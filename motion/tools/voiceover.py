"""Voix off de synthèse (Kokoro, voix française ff_siwis), calée réplique par réplique.
Usage : python3 tools/voiceover.py <voix-off.json> <dossier-modele> <sortie.wav> [durée=60]
Le dossier modèle contient kokoro-v1.0.onnx et voices-v1.0.bin
(github.com/thewh1teagle/kokoro-onnx, release model-files-v1.0).
"""
import json
import sys
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly
from kokoro_onnx import Kokoro

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
model_dir, out = sys.argv[2], sys.argv[3]
DUR = float(sys.argv[4]) if len(sys.argv) > 4 else 60.0
SR = 48000
k = Kokoro(f'{model_dir}/kokoro-v1.0.onnx', f'{model_dir}/voices-v1.0.bin')
track = np.zeros(int(DUR * SR), dtype=np.float32)


def trim(s, sr, thr=0.012):
    idx = np.where(np.abs(s) > thr)[0]
    if not len(idx):
        return s
    a = max(0, idx[0] - int(.02 * sr))
    b = min(len(s), idx[-1] + int(.08 * sr))
    return s[a:b]


report, prev_end = [], 0.0
for ln in cfg['lines']:
    s, sr = k.create(ln['text'], voice=cfg.get('voice', 'ff_siwis'), speed=ln.get('speed', cfg.get('speed', 1.0)), lang=cfg.get('lang', 'fr-fr'))
    s = trim(np.asarray(s, dtype=np.float32), sr)
    s = resample_poly(s, SR, sr).astype(np.float32)
    fade = int(.012 * SR)
    s[:fade] *= np.linspace(0, 1, fade)
    s[-fade:] *= np.linspace(1, 0, fade)
    i = int(ln['t'] * SR)
    end = ln['t'] + len(s) / SR
    flag = '  ⚠ chevauche la réplique précédente' if ln['t'] < prev_end - .02 else ''
    if end > DUR - .2:
        flag += '  ⚠ dépasse la fin'
    track[i:i + len(s)] += s[: max(0, len(track) - i)]
    report.append(f"{ln['t']:6.2f} → {end:6.2f}  {ln['text']}{flag}")
    prev_end = end

sf.write(out, track, SR)
print('\n'.join(report))
