"""Bande-son synthétisée (musique d'ambiance + effets) calée sur les événements
exportés par le rendu (sfx.json). Aucune musique sous licence : tout est généré.
Usage : python3 tools/audio.py <sfx.json> <sortie.wav> [voix-off.wav]
"""
import json
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000
ev = json.load(open(sys.argv[1]))
DUR = ev['duration'] + 0.0
N = int(SR * DUR)
rng = np.random.default_rng(2026)
music = np.zeros((N, 2))
fx = np.zeros((N, 2))


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(buf, start, sig, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l, sig * r], 1)
    j = min(N, i + len(sig))
    if i < 0:
        sig = sig[-i:]
        i = 0
    buf[i:j] += sig[: j - i] * gain


def env(n, a, r, sustain=True):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    if r:
        e *= np.clip((n / SR - t) / r, 0, 1)
    return e


def bp(sig, lo, hi, order=2):
    sos = butter(order, [lo / (SR / 2), hi / (SR / 2)], btype='band', output='sos')
    return sosfilt(sos, sig)


def lp(sig, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), output='sos'), sig)


def hp(sig, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), btype='high', output='sos'), sig)


# ---------------------------------------------------------------- musique
def pad_note(m, dur, amp):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    s = np.zeros(n)
    for det in (-0.06, 0.0, 0.055):
        ff = f * 2 ** (det / 12)
        ph = rng.random() * 6.28
        for k in range(1, 7):
            s += np.sin(2 * np.pi * ff * k * t + ph * k) / (k ** 1.7)
    s *= 1 + 0.15 * np.sin(2 * np.pi * 0.23 * t + rng.random() * 6)
    return s * env(n, 1.4, 1.9) * amp / 3


CHORDS = [  # (début, fin, notes MIDI)
    (0.0, 6.6, [50, 57, 62, 65]),          # Ré m
    (6.4, 11.6, [46, 53, 58, 62, 65]),     # Si♭
    (11.4, 16.6, [43, 50, 55, 58, 62]),    # Sol m
    (16.4, 21.6, [50, 57, 62, 65, 69]),    # Ré m
    (21.4, 24.2, [46, 53, 58, 62, 65]),    # Si♭
    (24.0, 27.2, [48, 55, 60, 64, 67]),    # Do
    (27.0, 31.0, [50, 57, 62, 65]),        # Ré m
    (30.8, 35.0, [46, 53, 58, 62]),        # Si♭
    (34.8, 37.6, [43, 50, 55, 58, 62]),    # Sol m
    (37.4, 39.6, [45, 52, 57, 61, 64]),    # La (tension)
    (39.4, 46.2, [41, 48, 53, 57, 60, 65]),  # Fa majeur : la lumière
    (46.0, 50.2, [48, 55, 60, 64, 67]),    # Do
    (50.0, 52.2, [50, 57, 62, 65, 69]),    # Ré m
    (52.0, 54.2, [46, 53, 58, 62, 65]),    # Si♭
    (54.0, 60.0, [41, 53, 57, 60, 67, 69]),  # Fa add9 : résolution
]
for a, b, notes in CHORDS:
    for i, m in enumerate(notes):
        add(music, a, pad_note(m, b - a + 1.6, 0.11 if m > 52 else 0.14), pan=(i / max(1, len(notes) - 1) - .5) * .7)

# drone grave
t = np.arange(N) / SR
drone = np.sin(2 * np.pi * mtof(38) * t) * 0.10 * np.clip(t / 3, 0, 1) * np.clip((39.6 - t) / 1.5, 0, 1)
drone += np.sin(2 * np.pi * mtof(29) * t) * 0.10 * np.clip((t - 39.3) / 1.5, 0, 1) * np.clip((DUR - t) / 2, 0, 1)
music += np.stack([drone, drone], 1)


def pluck(m, amp=0.2, dec=1.4):
    n = int((dec * 2.2) * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    s = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * 2.001 * f * t) * np.exp(-t * 3)
         + .12 * np.sin(2 * np.pi * 3.003 * f * t) * np.exp(-t * 6))
    return s * np.exp(-t / dec * 2.3) * np.minimum(1, t / .004) * amp


def chord_at(time):
    cur = CHORDS[0][2]
    for a, b, notes in CHORDS:
        if time >= a + .2:
            cur = notes
    return cur


# arpèges (ostinato) : énergie à partir de la balance
pattern = [0, 2, 1, 3, 2, 4, 3, 1]
for sec, (a, b, step, amp) in enumerate([(16.6, 26.8, .3, .085), (27.2, 39.2, .6, .07), (40.2, 45.6, .3, .07), (46.0, 53.8, .3, .085)]):
    k = 0
    x = a
    while x < b:
        notes = sorted(set(n % 12 for n in chord_at(x)))
        base = [n + 72 if n + 72 < 84 else n + 60 for n in notes]
        base = sorted(base)
        m = base[pattern[k % len(pattern)] % len(base)]
        add(music, x, pluck(m, amp * (1 - .25 * (k % 2))), pan=.35 * np.sin(k * 1.3))
        x += step
        k += 1

# pulsation grave douce
def kick(amp=.35):
    n = int(.45 * SR)
    t = np.arange(n) / SR
    f = 42 + 60 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * amp


for a, b in [(16.6, 26.6), (40.2, 45.6), (46.0, 53.6)]:
    x = a
    while x < b:
        add(music, x, kick(.28))
        x += 1.2

# ---------------------------------------------------------------- effets
def noise(d):
    return rng.standard_normal(int(d * SR))


def whoosh(d, f0=250, f1=3200, amp=.35):
    n = int((d + .5) * SR)
    s = noise(n / SR)
    out = np.zeros(n)
    y = 0.0
    tt = np.arange(n) / n
    fc = f0 * (f1 / f0) ** np.sin(tt * np.pi / 2)
    alpha = 1 - np.exp(-2 * np.pi * fc / SR)
    for i in range(n):  # passe-bas à fréquence variable
        y += alpha[i] * (s[i] - y)
        out[i] = y
    e = np.sin(np.pi * np.clip(tt * 1.15, 0, 1)) ** 2
    return hp(out, 120) * e * amp * 3


def bell(f, d=2.5, amp=.2):
    n = int(d * SR)
    t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dk) for r, a, dk in [(1, 1, 1.6), (2.76, .45, 2.8), (5.4, .25, 4.5), (8.93, .12, 7)])
    return s * np.minimum(1, t / .002) * amp


def thump(amp=.5, f=60):
    n = int(.6 * SR)
    t = np.arange(n) / SR
    fr = f * 0.6 + f * np.exp(-t * 18)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 7)
    s += lp(noise(.6), 900) * np.exp(-t * 30) * .3
    return s * amp


for e in ev['sfx']:
    T, ty = e['t'], e['type']
    if ty == 'impact':
        add(fx, T, thump(.8, 55))
        add(fx, T, bell(mtof(74), 3.5, .14), pan=-.2)
        add(fx, T + .02, bell(mtof(81), 3.0, .07), pan=.25)
        add(fx, T - .9, whoosh(.9, 400, 5000, .12))
    elif ty == 'pen':
        d, n = e['d'], max(1, e['n'])
        s = bp(noise(d + .2), 2200, 7500)
        tt = np.arange(len(s)) / SR
        strokes = np.abs(np.sin(np.pi * n * np.clip(tt / d, 0, 1))) ** .6
        grit = 0.6 + 0.4 * lp(np.abs(noise(d + .2)), 40) * 3
        e_ = strokes * np.clip(grit, 0, 1.6) * np.clip(tt / .05, 0, 1) * np.clip((d + .15 - tt) / .15, 0, 1)
        add(fx, T, s * e_ * .045, pan=.15)
    elif ty == 'whoosh':
        add(fx, T, whoosh(e['d'], 180, 2600, .4))
        add(fx, T + e['d'] * .85, thump(.25, 48))
    elif ty == 'swish':
        add(fx, T, whoosh(e['d'], 600, 7000, .28), pan=0)
        n = int(1.2 * SR); tt = np.arange(n) / SR
        add(fx, T + .1, np.sin(2 * np.pi * np.cumsum(1800 + 2400 * tt) / SR) * np.exp(-tt * 3) * .04)
    elif ty == 'soft':
        add(fx, T, bell(mtof(86), 3, .07), pan=.3)
    elif ty == 'tick':
        n = int(.12 * SR); tt = np.arange(n) / SR
        click = np.sin(2 * np.pi * 1750 * tt) * np.exp(-tt * 70) + bp(noise(.12), 3000, 9000) * np.exp(-tt * 120) * .4
        add(fx, T, click * .22, pan=-.25)
        add(fx, T, thump(.22, 70))
        add(fx, T + .05, bell(mtof(84 + [0, 2, 4, 7][int(round((T - 46.95)))] if 0 <= round(T - 46.95) <= 3 else 84), 1.6, .05), pan=.2)
    elif ty == 'chime':
        for i, m in enumerate([77, 81, 84, 89]):
            add(fx, T + i * .07, bell(mtof(m), 3.5, .07), pan=-.4 + i * .27)
    elif ty == 'drop':
        for tb, a in [(55.41, .55), (55.72, .22), (55.87, .1)]:
            add(fx, tb, thump(a, 65))
    elif ty == 'shine':
        n = int(1.1 * SR); tt = np.arange(n) / SR
        sweep = np.sin(2 * np.pi * np.cumsum(2500 + 3500 * tt) / SR) * np.sin(np.pi * tt / 1.1) ** 2
        add(fx, T, sweep * (0.6 + .4 * np.sin(2 * np.pi * 18 * tt)) * .025, pan=.1)
    elif ty == 'sparkle':
        add(fx, T, bell(mtof(96 + int(T * 7) % 5), 1.2, .035), pan=(T * 13 % 2) - 1)

# ---------------------------------------------------------------- réverbération + mix
def reverb_ir(rt=2.8):
    n = int(rt * SR)
    t = np.arange(n) / SR
    irs = []
    for _ in range(2):
        ir = rng.standard_normal(n) * np.exp(-6.9 * t / rt)
        ir = lp(ir, 6000)
        ir[: int(.02 * SR)] = 0
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    return irs


ir = reverb_ir()
mix = music * .9 + fx
wet = np.stack([fftconvolve(mix[:, c], ir[c])[:N] for c in range(2)], 1)
out = mix * .78 + wet * .42
out = hp(out.T, 30).T
# fondu d'entrée / sortie (musique et effets)
tt = np.arange(N) / SR
out *= np.clip(tt / .4, 0, 1)[:, None] * np.clip((DUR - tt) / 1.6, 0, 1)[:, None] ** 1.5
out *= 0.17 / np.sqrt(np.mean(out ** 2))

# ---------------------------------------------------------------- voix off (optionnelle)
if len(sys.argv) > 3:
    from scipy.io import wavfile as _wf
    vsr, v = _wf.read(sys.argv[3])
    v = v.astype(float)
    if v.ndim > 1:
        v = v.mean(1)
    if np.max(np.abs(v)) > 1.5:
        v /= 32768.0
    assert vsr == SR, 'la voix doit être en 48 kHz'
    v = np.pad(v, (0, max(0, N - len(v))))[:N]
    v = hp(v, 85)
    v = v + 0.22 * bp(v, 2500, 6000)            # présence
    # enveloppe par trames de 10 ms (attaque rapide, relâche lente)
    F = 480
    fr = np.sqrt(np.mean(np.pad(v, (0, (-len(v)) % F)).reshape(-1, F) ** 2, axis=1))
    env = np.zeros_like(fr)
    a_att, a_rel = 1 - np.exp(-1 / 3), 1 - np.exp(-1 / 35)
    for i in range(1, len(fr)):
        a = a_att if fr[i] > env[i - 1] else a_rel
        env[i] = env[i - 1] + a * (fr[i] - env[i - 1])
    active = np.percentile(fr[fr > 1e-4], 75) if np.any(fr > 1e-4) else 1
    # compression douce de la voix
    comp = np.where(env > active * .5, (np.maximum(env, 1e-9) / (active * .5)) ** -0.35, 1.0)
    comp_s = np.interp(np.arange(N), np.arange(len(comp)) * F, comp)
    v = v * comp_s
    vr = np.sqrt(np.mean(v[np.interp(np.arange(N), np.arange(len(env)) * F, env) > active * .3] ** 2))
    v *= 0.24 / vr
    # ducking : la musique baisse d'environ 7 dB sous la voix
    duck = 1 - 0.55 * np.clip(env / active, 0, 1)
    duck_s = np.interp(np.arange(N), np.arange(len(duck)) * F, duck)
    out *= duck_s[:, None]
    vir = reverb_ir(.7)
    vwet = np.stack([fftconvolve(v, vir[c])[:N] for c in range(2)], 1)
    out += np.stack([v, v], 1) * .95 + vwet * .10
    print('voix off mixée')

# limiteur doux + crête à -1 dBFS
out = np.tanh(out * 1.4) / np.tanh(1.4)
out *= 0.89 / np.max(np.abs(out))
wavfile.write(sys.argv[2], SR, (out * 32767).astype(np.int16))
print('audio ok', DUR, 's  rms', float(np.sqrt(np.mean(out ** 2))), 'peak', float(np.max(np.abs(out))))
