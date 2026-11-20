"""Laboratoire de voix : compare plusieurs « directions » sur les mêmes passages.
A = voix actuelle (Kokoro, telle quelle)
B = même voix + direction (débit, silences) + traitement studio
C = même timbre, moteur expressif (Chatterbox, référence = la voix Kokoro validée) + traitement studio
Mesures objectives : fidélité au texte (transcription) et expressivité (amplitude de la mélodie, en demi-tons).
Usage : python tools/voice_lab.py <dossier-modele-kokoro> <reference.wav> <sortie-dir>
"""
import os
import re
import sys
import unicodedata
import numpy as np
import soundfile as sf
import librosa
import torch
sys.path.insert(0, os.path.dirname(__file__))
from voice_master import master
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

KOK, REF, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
SR = 48000
PASSAGES = [
    ('ouverture', 'Un enfant souffre. Sa mère prie. Et le ciel reste silencieux.', 'intime'),
    ('question', 'Alors, si Dieu est bon, pourquoi l’innocent souffre-t-il ?', 'standard'),
    ('finale', 'Quand tu ne peux pas expliquer la souffrance de quelqu’un, peux-tu au moins contribuer à la soulager ?', 'intime'),
]
# B : direction écrite pour Kokoro (silences et débit)
DIRECTED = {
    'ouverture': [('Un enfant souffre.', .82, .7), ('Sa mère prie.', .82, .8), ('Et le ciel reste silencieux.', .8, 0)],
    'question': [('Alors…', .82, .35), ('si Dieu est bon,', .86, .45), ('pourquoi l’innocent souffre-t-il ?', .82, 0)],
    'finale': [('Quand tu ne peux pas expliquer la souffrance de quelqu’un,', .84, .7), ('peux-tu au moins… contribuer à la soulager ?', .8, 0)],
}
kok = Kokoro(f'{KOK}/kokoro-v1.0.onnx', f'{KOK}/voices-v1.0.bin')
asr = WhisperModel('small', device='cpu', compute_type='int8')


def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9 ]+', ' ', re.sub(r"[’'«»“”…-]", ' ', s)).split()


def wer(a, b):
    r, h = norm(a), norm(b); d = list(range(len(h) + 1))
    for i, x in enumerate(r, 1):
        p, d[0] = d[0], i
        for j, y in enumerate(h, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(h)] / max(1, len(r))


def measure(y, text):
    y16 = librosa.resample(y.astype(np.float32), orig_sr=SR, target_sr=16000)
    segs, _ = asr.transcribe(y16, language='fr', beam_size=5, temperature=0.0)
    heard = ' '.join(s.text.strip() for s in segs)
    f0, vf, _ = librosa.pyin(y16, fmin=90, fmax=500, sr=16000, frame_length=1024)
    f = f0[vf & ~np.isnan(f0)]
    st = 12 * np.log2(f / np.median(f)) if len(f) else np.array([0])
    return dict(wer=wer(text, heard), range=float(np.percentile(st, 95) - np.percentile(st, 5)), dur=len(y) / SR, heard=heard)


def trim(s, sr, thr=.01):
    i = np.where(np.abs(s) > thr)[0]
    return s if not len(i) else s[max(0, i[0] - int(.02 * sr)): i[-1] + int(.1 * sr)]


def kokoro(text, speed):
    s, sr = kok.create(text, voice='ff_siwis', speed=speed, lang='fr-fr')
    return librosa.resample(trim(np.asarray(s, np.float32), sr), orig_sr=sr, target_sr=SR)


report = []
results = {}
for key, text, style in PASSAGES:
    A = kokoro(text, .9)
    parts = []
    for frag, sp, pause in DIRECTED[key]:
        parts += [kokoro(frag, sp), np.zeros(int(pause * SR), np.float32)]
    B = master(np.concatenate(parts), SR, style)
    results[key] = {'A': A, 'B': B}

# C : moteur expressif, même timbre (référence = voix Kokoro validée)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
cb = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
for ex, cw, tag in ((.55, .5, 'C1'), (.8, .35, 'C2')):
    cb.prepare_conditionals(REF, exaggeration=ex)
    for key, text, style in PASSAGES:
        best = None
        for k in range(2):
            torch.manual_seed(100 + k)
            w = cb.generate(text.replace('…', '...'), language_id='fr', exaggeration=ex, cfg_weight=cw, temperature=.8)
            y = librosa.resample(trim(w.squeeze(0).cpu().numpy().astype(np.float32), cb.sr), orig_sr=cb.sr, target_sr=SR)
            m = measure(y, text)
            if best is None or (m['wer'], -m['range']) < (best[1]['wer'], -best[1]['range']): best = (y, m)
        results[key][tag] = master(best[0], SR, style)

for key, text, style in PASSAGES:
    for tag, y in results[key].items():
        m = measure(y, text)
        sf.write(f'{OUT}/{key}_{tag}.wav', y.astype(np.float32), SR)
        report.append(f'{key:10s} {tag:3s} durée {m["dur"]:4.1f} s · mélodie {m["range"]:4.1f} demi-tons · écart texte {m["wer"]:.0%} · « {m["heard"]} »')
        print(report[-1], flush=True)
open(f'{OUT}/rapport.txt', 'w', encoding='utf-8').write('\n'.join(report) + '\n')
