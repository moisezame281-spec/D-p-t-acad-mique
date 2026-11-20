"""Narration synthétisée (Kokoro) + minutage mot à mot (faster-whisper) + sous-titres.
Usage : python tools/narrate.py <narration.json> <dossier-modele-kokoro> <dossier-sortie>
Sorties : voice.wav (48 kHz mono), timeline.json (phrases, mots, blocs de sous-titres), subtitles.srt
Le texte affiché ('display') reste celui du script officiel ; 'say' ne sert qu'à la prononciation.
"""
import difflib
import json
import os
import re
import sys
import unicodedata
import numpy as np
import soundfile as sf
import librosa
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
model_dir, out = sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
SR = 48000
tts = Kokoro(f'{model_dir}/kokoro-v1.0.onnx', f'{model_dir}/voices-v1.0.bin')
asr = WhisperModel('small', device='cpu', compute_type='int8')


def norm_words(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r"[’'«»“”]", ' ', s)
    return re.sub(r'[^a-z0-9\- ]+', ' ', s).replace('-', ' ').split()


def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    return s if not len(idx) else s[max(0, idx[0] - int(.015 * sr)): min(len(s), idx[-1] + int(.08 * sr))]


track_parts, timeline, t = [], [], float(cfg.get('lead_in', 0.5))
for sen in cfg['sentences']:
    chunks = [{'display': c[0], 'say': c[1] if len(c) > 1 and c[1] else c[0]} for c in sen['chunks']]
    say = ' '.join(c['say'] for c in chunks)
    s, sr = tts.create(say, voice=cfg['voice'], speed=sen.get('speed', cfg['speed']), lang=cfg['lang'])
    s = librosa.resample(trim(np.asarray(s, dtype=np.float32), sr), orig_sr=sr, target_sr=SR).astype(np.float32)
    dur = len(s) / SR
    # mots reconnus avec horodatage
    segs, _ = asr.transcribe(librosa.resample(s, orig_sr=SR, target_sr=16000), language='fr', beam_size=5,
                             temperature=0.0, word_timestamps=True)
    heard = [(w.word, w.start, w.end) for sg in segs for w in (sg.words or [])]
    hw = []
    for w, a, b in heard:
        parts = norm_words(w)
        for k, p in enumerate(parts):  # répartit un mot reconnu composé
            hw.append((p, a + (b - a) * k / len(parts), a + (b - a) * (k + 1) / len(parts)))
    # mots prononcés (par bloc) alignés sur les mots reconnus
    sw, owner = [], []
    for ci, c in enumerate(chunks):
        for w in norm_words(c['say']):
            sw.append(w); owner.append(ci)
    times = [None] * len(sw)
    sm = difflib.SequenceMatcher(a=sw, b=[h[0] for h in hw], autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (hw[blk.b + k][1], hw[blk.b + k][2])
    # interpolation des mots non retrouvés
    known = [i for i, x in enumerate(times) if x]
    for i in range(len(sw)):
        if times[i] is None:
            prv = max([k for k in known if k < i], default=None)
            nxt = min([k for k in known if k > i], default=None)
            a = times[prv][1] if prv is not None else 0.0
            b = times[nxt][0] if nxt is not None else dur
            n_gap = (nxt if nxt is not None else len(sw)) - (prv if prv is not None else -1) - 1
            pos = i - (prv if prv is not None else -1) - 1
            times[i] = (a + (b - a) * pos / max(1, n_gap), a + (b - a) * (pos + 1) / max(1, n_gap))
    words = [{'w': sw[i], 'start': round(t + times[i][0], 3), 'end': round(t + times[i][1], 3), 'chunk': owner[i]} for i in range(len(sw))]
    cks = []
    for ci, c in enumerate(chunks):
        ws = [w for w in words if w['chunk'] == ci]
        a = ws[0]['start'] if ws else t
        b = ws[-1]['end'] if ws else t + dur
        cks.append({'text': c['display'], 'start': round(a, 3), 'end': round(b, 3)})
    cks[0]['start'] = round(t, 3)
    for a_, b_ in zip(cks, cks[1:]):
        b_['start'] = round(max(b_['start'], a_['end'] - 0.05), 3)
    cks[-1]['end'] = round(t + dur, 3)
    match = sum(blk.size for blk in sm.get_matching_blocks()) / max(1, len(sw))
    timeline.append({'id': sen['id'], 'scene': sen['scene'], 'start': round(t, 3), 'end': round(t + dur, 3),
                     'display': ' '.join(c['display'] for c in chunks), 'say': say, 'heard': ' '.join(h[0] for h in heard).strip(),
                     'match': round(match, 3), 'words': words, 'chunks': cks})
    track_parts.append((t, s))
    print(f"{sen['id']}  {t:6.2f} → {t + dur:6.2f}  ({dur:4.2f} s, mots reconnus {match:.0%})  « {' '.join(h[0] for h in heard).strip()} »", flush=True)
    t += dur + sen.get('pause', 0.5)

total = timeline[-1]['end'] + float(cfg.get('tail', 3.0))
track = np.zeros(int(total * SR) + 1, dtype=np.float32)
for st, s in track_parts:
    i = int(st * SR)
    track[i:i + len(s)] += s[: len(track) - i]
sf.write(os.path.join(out, 'voice.wav'), track, SR)
json.dump({'duration': round(total, 3), 'sentences': timeline}, open(os.path.join(out, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def ts(x):
    ms = int(round(x * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


with open(os.path.join(out, 'subtitles.srt'), 'w', encoding='utf-8') as f:
    allc = [c for sen in timeline for c in sen['chunks']]
    for n, c in enumerate(allc, 1):  # fin légèrement prolongée, sans jamais chevaucher le bloc suivant
        end = c['end'] + 0.25
        if n < len(allc):
            end = min(end, allc[n]['start'] - 0.04)
        f.write(f"{n}\n{ts(c['start'])} --> {ts(max(end, c['start'] + 0.3))}\n{c['text']}\n\n")
print(f'durée totale : {total:.2f} s — narration {timeline[0]["start"]:.2f} → {timeline[-1]["end"]:.2f} s')
