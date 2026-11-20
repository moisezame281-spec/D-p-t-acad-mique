"""Voix off avec une copie de voix (Chatterbox multilingue, licence MIT).
Même format de texte que voiceover.py (t, end, text) + options : takes, max_stretch,
exaggeration, cfg_weight, temperature.
Usage : python tools/clone_voice.py <voix-off.json> <reference.wav> <sortie.wav> [durée=60] [dossier-cache]
  - référence : 10 à 60 s de la voix à copier, enregistrée au calme
  - plusieurs prises par réplique ; si faster-whisper est installé, chaque prise est
    transcrite et la plus fidèle au texte est gardée (contrôle sans écoute)
  - le cache évite de régénérer les répliques inchangées
Les fichiers produits portent le filigrane inaudible Perth de Resemble AI.
"""
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
import numpy as np
import soundfile as sf
import librosa
import torch
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
ref, out = sys.argv[2], sys.argv[3]
DUR = float(sys.argv[4]) if len(sys.argv) > 4 else 60.0
cache = sys.argv[5] if len(sys.argv) > 5 else os.path.join(os.path.dirname(os.path.abspath(out)), 'clone-cache')
os.makedirs(cache, exist_ok=True)
SR = 48000
TAKES = int(cfg.get('takes', 1))
MAXS = float(cfg.get('max_stretch', 1.15))
P = dict(exaggeration=cfg.get('exaggeration', 0.5), cfg_weight=cfg.get('cfg_weight', 0.5), temperature=cfg.get('temperature', 0.8))
ref_hash = hashlib.sha1(open(ref, 'rb').read()).hexdigest()[:10]

model = None
def tts():
    global model
    if model is None:
        model = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
        model.prepare_conditionals(ref, exaggeration=P['exaggeration'])
    return model

try:
    from faster_whisper import WhisperModel
    asr = WhisperModel('small', device='cpu', compute_type='int8')
except Exception:
    asr = None


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = s.replace("'", ' ').replace('’', ' ')
    s = re.sub(r'geksa|gexaa|jeksa|j ai que ca|jexa|gexa', 'BRAND', s)
    s = re.sub(r'ennemis', 'ennemies', s)
    s = re.sub(r'allies', 'alliees', s)
    s = re.sub(r'debats', 'debat', s)
    s = re.sub(r'\bquand\b', 'kant', s)
    return re.sub(r"[^a-zA-Z0-9 ]+", ' ', s).split()


def wer(ref_txt, hyp):
    r, h = norm(ref_txt), norm(hyp)
    d = np.arange(len(h) + 1)
    for i, rw in enumerate(r, 1):
        prev, d[0] = d[0], i
        for j, hw in enumerate(h, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (rw != hw))
    return d[len(h)] / max(1, len(r))


def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    if not len(idx):
        return s
    return s[max(0, idx[0] - int(.02 * sr)): min(len(s), idx[-1] + int(.1 * sr))]


def take(text, k):
    key = hashlib.sha1(json.dumps([text, k, P, ref_hash]).encode()).hexdigest()[:16]
    f = os.path.join(cache, key + '.wav')
    if os.path.exists(f):
        s, _ = sf.read(f, dtype='float32')
        return s, True
    m = tts()
    torch.manual_seed(1000 + k)
    wav = m.generate(text.replace('…', '...'), language_id='fr', **P)
    s = trim(wav.squeeze(0).cpu().numpy().astype(np.float32), m.sr)
    s = librosa.resample(s, orig_sr=m.sr, target_sr=SR).astype(np.float32)
    sf.write(f, s, SR)
    return s, False


WARP = bool(cfg.get('warp', False))
chosen = []
for ln in cfg['lines']:
    t0 = time.time()
    room = ln.get('end', 1e9) - ln['t']
    best = None
    for k in range(int(ln.get('takes', TAKES))):
        s, cached = take(ln['text'], k)
        heard, w = '', 0.0
        if asr is not None:
            segs, _ = asr.transcribe(librosa.resample(s, orig_sr=SR, target_sr=16000), language='fr', beam_size=5, temperature=0.0)
            heard = ' '.join(x.text.strip() for x in segs)
            w = wer(ln['text'], heard)
        over = 0.0 if WARP else max(0.0, len(s) / SR / room - MAXS)
        score = w + over * 2
        if best is None or score < best[0]:
            best = (score, s, heard, w, k)
    _, s, heard, w, k = best
    chosen.append(dict(ln=ln, s=s, heard=heard, w=w, k=k, secs=time.time() - t0))

# ---------------------------------------------------------------- placement
anchors = [[0.0, 0.0]]  # [temps animation, temps vidéo]
if WARP:
    # chaque fenêtre [t, end] dure au moins la voix naturelle + une marge ; le reste garde sa durée
    MARGIN = float(cfg.get('margin', 0.12))
    va = 0.0
    for c in chosen:
        ln = c['ln']
        d = len(c['s']) / SR
        a0, a1 = ln['t'], ln.get('end', ln['t'] + d)
        va += a0 - anchors[-1][0]
        anchors.append([a0, va])
        va += max(a1 - a0, d + MARGIN)
        anchors.append([a1, va])
    va += DUR - anchors[-1][0]
    anchors.append([DUR, va])
    VDUR = va
else:
    VDUR = DUR

def to_video(ta):
    for (a0, v0), (a1, v1) in zip(anchors, anchors[1:]):
        if ta <= a1:
            return v0 + (ta - a0) * (v1 - v0) / max(1e-9, a1 - a0)
    return anchors[-1][1] + ta - anchors[-1][0]

track = np.zeros(int(VDUR * SR) + SR, dtype=np.float32)
report, prev_end = [], 0.0
for c in chosen:
    ln, s = c['ln'], c['s']
    note = ''
    start = to_video(ln['t'])
    room = to_video(ln.get('end', 1e9)) - start if 'end' in ln else 1e9
    if not WARP and len(s) / SR > room:
        rate = min(MAXS, (len(s) / SR) / room)
        s = librosa.effects.time_stretch(s, rate=rate)
        note += f'  [×{rate:.2f}]'
    if WARP:
        slow = (to_video(ln.get('end', ln['t'])) - start) / max(1e-9, ln.get('end', ln['t']) - ln['t'])
        if slow > 1.005:
            note += f'  [animation ralentie ×{slow:.2f}]'
    fade = int(.012 * SR)
    s = s.copy()
    s[:fade] *= np.linspace(0, 1, fade)
    s[-fade:] *= np.linspace(1, 0, fade)
    i = int(start * SR)
    end = start + len(s) / SR
    if end > start + room + .05:
        note += f'  ⚠ déborde de {end - start - room:.2f} s'
    if start < prev_end - .02:
        note += '  ⚠ chevauche la réplique précédente'
    if asr is not None:
        note += f"  | prise {c['k'] + 1}, écart texte {c['w']:.0%} : « {c['heard']} »"
    track[i:i + len(s)] += s[: max(0, len(track) - i)]
    report.append(f"{start:6.2f} → {end:6.2f}  {ln['text']}{note}")
    print(report[-1], flush=True)
    prev_end = end

track = track[: int(VDUR * SR)]
sf.write(out, track, SR)
if WARP:
    json.dump({'duration': round(VDUR, 3), 'anim_duration': DUR, 'anchors': [[round(a, 4), round(v, 4)] for a, v in anchors]},
              open(out + '.warp.json', 'w'), indent=1)
    print(f'durée vidéo : {VDUR:.2f} s (carte temporelle : {out}.warp.json)')
print('voix off écrite :', out)
