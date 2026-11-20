"""Voix off avec une copie de voix (Chatterbox multilingue, licence MIT).
Même format de texte que voiceover.py (voix-off.json : t, end, text).
Usage : python tools/clone_voice.py <voix-off.json> <reference.wav|m4a> <sortie.wav> [durée=60]
  - la référence : 10 à 60 s de la voix à copier, enregistrée au calme
  - à lancer avec le Python où chatterbox-tts est installé
Les fichiers produits portent le filigrane inaudible Perth de Resemble AI.
"""
import json
import sys
import time
import numpy as np
import soundfile as sf
import librosa
import torch
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
ref, out = sys.argv[2], sys.argv[3]
DUR = float(sys.argv[4]) if len(sys.argv) > 4 else 60.0
SR = 48000
torch.manual_seed(int(cfg.get('seed', 7)))
model = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
model.prepare_conditionals(ref, exaggeration=cfg.get('exaggeration', 0.5))
track = np.zeros(int(DUR * SR), dtype=np.float32)


def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    if not len(idx):
        return s
    return s[max(0, idx[0] - int(.02 * sr)): min(len(s), idx[-1] + int(.1 * sr))]


report, prev_end = [], 0.0
for ln in cfg['lines']:
    t0 = time.time()
    text = ln['text'].replace('…', '...')
    wav = model.generate(text, language_id='fr', exaggeration=cfg.get('exaggeration', 0.5),
                         cfg_weight=cfg.get('cfg_weight', 0.5), temperature=cfg.get('temperature', 0.8))
    s = trim(wav.squeeze(0).cpu().numpy().astype(np.float32), model.sr)
    s = librosa.resample(s, orig_sr=model.sr, target_sr=SR)
    note = ''
    room = ln.get('end', 1e9) - ln['t']
    if len(s) / SR > room:  # accélère sans changer la hauteur, au plus de 15 %
        rate = min(1.15, (len(s) / SR) / room)
        s = librosa.effects.time_stretch(s, rate=rate)
        note = f'  [accéléré ×{rate:.2f}]'
    fade = int(.012 * SR)
    s[:fade] *= np.linspace(0, 1, fade)
    s[-fade:] *= np.linspace(1, 0, fade)
    i = int(ln['t'] * SR)
    end = ln['t'] + len(s) / SR
    if ln['t'] < prev_end - .02:
        note += '  ⚠ chevauche la réplique précédente'
    track[i:i + len(s)] += s[: max(0, len(track) - i)]
    report.append(f"{ln['t']:6.2f} → {end:6.2f}  {ln['text']}{note}   ({time.time() - t0:.0f} s de calcul)")
    print(report[-1], flush=True)
    prev_end = end

sf.write(out, track, SR)
