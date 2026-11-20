"""Traitement « studio » d'une voix off (numpy/scipy, sans dépendance externe).
Chaîne : coupe-bas → chaleur → présence → dé-esseur → compression → densité douce → petite pièce.
Utilisable seul :  python3 tools/voice_master.py <entree.wav> <sortie.wav> [intime|standard]
ou importé :       from voice_master import master ; y = master(x, sr, style='standard')
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve


def _f(x, sr, kind, f, o=2):
    w = np.array(f) / (sr / 2) if isinstance(f, (list, tuple)) else f / (sr / 2)
    return sosfilt(butter(o, w, btype=kind, output='sos'), x)


def _env(x, sr, att, rel):
    a1, r1 = np.exp(-1 / (att * sr)), np.exp(-1 / (rel * sr))
    lev = np.abs(x)
    # enveloppe par blocs de 1 ms (rapide en Python)
    B = max(1, int(sr / 1000)); n = len(x) // B
    blk = lev[:n * B].reshape(n, B).max(1)
    e = np.zeros(n); a1b, r1b = a1 ** B, r1 ** B
    for i in range(1, n):
        c = a1b if blk[i] > e[i - 1] else r1b
        e[i] = c * e[i - 1] + (1 - c) * blk[i]
    return np.interp(np.arange(len(x)), np.arange(n) * B, e)


def master(x, sr, style='standard'):
    x = np.asarray(x, dtype=float)
    if x.ndim > 1: x = x.mean(1)
    peak_in = np.max(np.abs(x)) + 1e-9
    x = _f(x, sr, 'high', 75)
    warm = 1.6 if style == 'intime' else 1.25           # chaleur / effet de proximité
    x = x + (warm - 1) * _f(x, sr, 'low', 220)
    x = x + .28 * _f(x, sr, 'band', [2800, 5200])        # présence, intelligibilité
    # dé-esseur : atténue les sifflantes quand elles dépassent
    s = _f(x, sr, 'band', [5200, 9500]); es = _env(s, sr, .002, .06); eb = _env(x, sr, .005, .1)
    g = np.clip(1 - np.maximum(0, es / (eb + 1e-6) - .35) * 1.4, .45, 1)
    x = x - s * (1 - g)
    # compression douce (3:1 au-dessus du seuil), voix plus égale et plus « devant »
    e = _env(x, sr, .008, .14); thr = np.percentile(e[e > 1e-4], 60) if np.any(e > 1e-4) else 1
    ratio = 3.0
    gain = np.where(e > thr, (thr + (e - thr) / ratio) / (e + 1e-9), 1.0)
    x = x * gain
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.25) / np.tanh(1.25)   # densité (saturation légère)
    # petite pièce (0,35 s), très discrète
    n = int(.35 * sr); t = np.arange(n) / sr
    ir = np.random.default_rng(3).standard_normal(n) * np.exp(-6.9 * t / .35); ir[:int(.012 * sr)] = 0; ir = _f(ir, sr, 'low', 5000); ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[:len(x)]
    x = x + (.05 if style == 'intime' else .07) * wet
    return x / (np.max(np.abs(x)) + 1e-9) * peak_in


if __name__ == '__main__':
    import soundfile as sf
    x, sr = sf.read(sys.argv[1])
    sf.write(sys.argv[2], master(x, sr, sys.argv[3] if len(sys.argv) > 3 else 'standard').astype(np.float32), sr)
