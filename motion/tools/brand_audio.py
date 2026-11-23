"""Signature sonore de « L'Énigme humaine » : deux notes qui montent, comme une question.

    la (A4) puis mi (E5) : une quinte ouverte, qui ne se résout pas.
    Timbre : cloche de verre et piano doux, avec un léger souffle lumineux
    (la lumière qui traverse la serrure du logo).

Les deux notes appartiennent à la tonalité du thème de fin (ré majeur) et à la plupart des
tonalités mineures de la série (mi, fa dièse, si, la), elles restent donc identiques d'un épisode à l'autre.

Usage dans score.py (EP009 et suivants) :
    from brand_audio import signature
    sig = signature(SR)                      # tableau stéréo (n, 2), crête 0,5
    add(out, 0.0, sig * g)                   # à l'allumage du logo (t = 0)
    add(out, T_FIN, sig * g)                 # au carton de fin

En ligne de commande : python3 brand_audio.py sortie.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

NOTES = ((0.02, 69, 1.0), (0.24, 76, 0.92))   # (instant en s, note MIDI, gain) : la4 puis mi5


def signature(sr=48000, seed=7):
    rng = np.random.default_rng(seed)
    dur = 3.2
    n = int(dur * sr)
    t = np.arange(n) / sr
    out = np.zeros((n, 2))
    mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

    def put(t0, sig, pan):
        i = int(t0 * sr)
        k = min(len(sig), n - i)
        out[i:i + k, 0] += sig[:k] * np.cos((pan + 1) * np.pi / 4)
        out[i:i + k, 1] += sig[:k] * np.sin((pan + 1) * np.pi / 4)

    for t0, m, g in NOTES:
        f = mtof(m)
        u = t[:int(2.8 * sr)]
        bell = sum(a * np.sin(2 * np.pi * f * r * u) * np.exp(-u * k) for r, a, k in ((1, 1, 1.3), (2.01, .42, 2.2), (3.0, .2, 3.4), (4.2, .1, 4.6), (5.43, .05, 7)))
        piano = sum(np.sin(2 * np.pi * f * h * u) / h ** 1.6 for h in range(1, 7)) * np.exp(-u * 1.9)
        att = np.minimum(1, u / .003)
        put(t0, (bell * .55 + piano * .45) * att * g, -.25 if m < 72 else .25)
        put(t0 + .003, np.sin(2 * np.pi * f * 2 * u) * np.exp(-u * 3.5) * att * .12 * g, .4 if m < 72 else -.4)   # scintillement à l'octave

    # le souffle lumineux : un bruit filtré qui monte pendant l'allumage (0 → 0,45 s)
    d = .9
    m_ = int(d * sr)
    v = np.arange(m_) / m_
    noise = rng.standard_normal(m_)
    sos = butter(2, [2500 / (sr / 2), 9000 / (sr / 2)], btype='band', output='sos')
    air = sosfilt(sos, noise) * np.clip(v / .45, 0, 1) ** 2 * np.clip((1 - v) / .5, 0, 1) * .05
    put(0, air, -.3); put(.01, sosfilt(sos, rng.standard_normal(m_)) * np.clip(v / .45, 0, 1) ** 2 * np.clip((1 - v) / .5, 0, 1) * .05, .3)

    # une petite réverbération (salle douce)
    ir_n = int(1.6 * sr)
    ir_t = np.arange(ir_n) / sr
    for c in range(2):
        ir = rng.standard_normal(ir_n) * np.exp(-ir_t * 3.2)
        ir = sosfilt(butter(1, 5000 / (sr / 2), output='sos'), ir)
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, c] = out[:, c] * .8 + fftconvolve(out[:, c], ir)[:n] * .35
    out *= np.clip((dur - t) / .6, 0, 1)[:, None]
    return out * (.5 / np.max(np.abs(out)))


if __name__ == '__main__':
    from scipy.io import wavfile
    sr = 48000
    s = signature(sr)
    wavfile.write(sys.argv[1], sr, (s * .9 * 32767).astype(np.int16))
    print('signature écrite :', sys.argv[1], f'{len(s) / sr:.1f} s')
