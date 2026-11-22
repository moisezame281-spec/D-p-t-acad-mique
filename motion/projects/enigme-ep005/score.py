"""L'Énigme humaine — EP005 — composition originale + design sonore + mixage (format de série).
Tout est synthétisé ici (aucun échantillon, aucune musique tierce) : pas de droits tiers.
Usage : python3 score.py <sfx.json> <voice.wav> <sortie_mix.wav> [sortie_musique_seule.wav]
"""
import json
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
ev = json.load(open(sys.argv[1]))
DUR = float(ev['duration'])
N = int(DUR * SR)
rng = np.random.default_rng(1)
music = np.zeros((N, 2))
fx = np.zeros((N, 2))
first = {}
for e in ev['sfx']:
    first.setdefault(e['type'], e['t'])
# sections (marqueurs explicites posés par le montage)
SEC = {e['type'][4:]: e['t'] for e in ev['sfx'] if e['type'].startswith('sec_')}
S2, S3, S4, S5, S6, S7, S8 = (SEC[k] for k in ('s2', 's3', 's4', 's5', 's6', 's7', 's8'))
TITLE = first['reveal']; QUESTION = first['question']
print('sections', [round(x, 2) for x in (S2, S3, S4, S5, S6, S7, S8, TITLE)])


def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2 - 100) / (SR / 2), output='sos'), x, axis=0)
def hp(x, f, o=2): return sosfilt(butter(o, f / (SR / 2), btype='high', output='sos'), x, axis=0)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a / (SR / 2), b / (SR / 2)], btype='band', output='sos'), x, axis=0)
def noise(d): return rng.standard_normal(int(d * SR))
def tt(n): return np.arange(n) / SR


def env(n, a, r):
    t = tt(n); e = np.minimum(1, t / max(a, 1e-4))
    return e * np.clip((n / SR - t) / max(r, 1e-4), 0, 1)


def add(buf, t0, sig, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if sig.ndim == 1:
        sig = np.stack([sig * np.cos((pan + 1) * np.pi / 4), sig * np.sin((pan + 1) * np.pi / 4)], 1)
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig))
    if j > i: buf[i:j] += sig[:j - i] * g


# ---------------------------------------------------------------- instruments
def strings(m, dur, amp, bright=900):
    n = int(dur * SR); t = tt(n); f = mtof(m); s = np.zeros(n)
    for det in (-.08, 0, .07):
        vib = 1 + .0035 * np.sin(2 * np.pi * 5.1 * t + rng.random() * 6)
        ph = 2 * np.pi * np.cumsum(np.full(n, f * 2 ** (det / 12)) * vib) / SR
        for k in range(1, 16):
            s += np.sin(k * ph + rng.random()) / k
    return lp(s, bright) * env(n, 1.1, 1.6) * amp / 6


def pad(m, dur, amp, a=1.6, r=2.0):
    n = int(dur * SR); t = tt(n); f = mtof(m)
    s = sum(np.sin(2 * np.pi * f * k * t + rng.random() * 6) * w for k, w in ((1, 1), (2, .25), (3, .08)))
    s *= 1 + .2 * np.sin(2 * np.pi * .21 * t + rng.random() * 6)
    return s * env(n, a, r) * amp


def pluck(m, amp, dec=1.8, bright=1.0):
    n = int(dec * 2.5 * SR); t = tt(n); f = mtof(m)
    s = sum(np.sin(2 * np.pi * f * k * 1.0008 ** k * t) * np.exp(-t * (1.2 + k * 1.1 / bright) / dec) / k ** .9 for k in range(1, 9))
    return s * np.minimum(1, t / .003) * amp


def pizz(m, amp):
    n = int(.5 * SR); t = tt(n); f = mtof(m)
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (9 + k * 5)) / k for k in range(1, 7))
    return s * np.minimum(1, t / .002) * amp


def piano(m, amp, dec=2.6):
    n = int(dec * 2 * SR); t = tt(n); f = mtof(m)
    s = sum(np.sin(2 * np.pi * f * k * (1 + .0004 * k * k) * t) * np.exp(-t * (.9 + k * .7) / dec * 2) / k ** 1.3 for k in range(1, 10))
    s[:int(.01 * SR)] += lp(noise(.01), 3000) * .2
    return s * np.minimum(1, t / .002) * amp


def kick(amp):
    n = int(.4 * SR); t = tt(n); fr = 40 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 10) * amp


def hat(amp):
    n = int(.08 * SR); return hp(noise(.08), 7000) * np.exp(-tt(n) * 60) * amp


def arp(m, amp):
    n = int(.35 * SR); t = tt(n); f = mtof(m)
    s = sum(np.sign(np.sin(2 * np.pi * f * t)) * 0 + np.sin(2 * np.pi * f * k * t) / k for k in range(1, 10, 2))
    return lp(s, 1400) * np.exp(-t * 7) * np.minimum(1, t / .004) * amp


def whoosh(d, f0, f1, amp):
    n = int(d * SR); s = noise(d); out = np.zeros(n); y = 0.0
    u = np.arange(n) / n; fc = f0 * (f1 / f0) ** u; al = 1 - np.exp(-2 * np.pi * fc / SR)
    for i in range(n):
        y += al[i] * (s[i] - y); out[i] = y
    return hp(out, 100) * np.sin(np.pi * u) ** 2 * amp * 4


def boom(amp):
    n = int(2.2 * SR); t = tt(n); fr = 28 + 40 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 2.2)
    s += bp(noise(2.2), 200, 2500) * np.exp(-t * 18) * .35
    return s * amp


def swell(d, amp):  # aspiration montante avant un impact
    n = int(d * SR); u = np.arange(n) / n
    x = noise(d)
    return (lp(x, 600) * (1 - u ** 2) + lp(x, 5600) * u ** 2) * u ** 3 * amp


def bell(m, amp, dec=3.0):
    n = int(dec * SR); t = tt(n); f = mtof(m)
    return sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * k / dec * 2) for r, a, k in ((1, 1, 1), (2.01, .4, 1.6), (3.0, .2, 2.4), (4.2, .1, 3.2))) * amp


def choir(m, dur, amp, a=1.2, r=1.8):  # chœur synthétique (voyelle « a »), sans paroles
    n = int(dur * SR); t = tt(n); f = mtof(m); s = np.zeros(n)
    for det in (-.06, .05):
        vib = 1 + .004 * np.sin(2 * np.pi * 4.6 * t + rng.random() * 6)
        ph = 2 * np.pi * np.cumsum(np.full(n, f * 2 ** (det / 12)) * vib) / SR
        for k in range(1, 24): s += np.sin(k * ph) / k
    s = bp(s, 550, 1300) * 1.4 + bp(s, 2300, 3000) * .5
    return s * env(n, a, r) * amp / 4


def oud(m, amp):  # corde pincée grave et chaude
    return lp(pluck(m, amp, 1.4, .7), 2600)


def wood(amp):  # balancier d'horloge, bois
    n = int(.12 * SR); t = tt(n)
    return (np.sin(2 * np.pi * 820 * t) * .6 + bp(noise(.12), 600, 2400) * .5) * np.exp(-t * 55) * amp


# =====================================================================
#  UNE SEULE MUSIQUE DE FOND, CONTINUE (la mineur, 80 battements/min) — style validé à l'ép. 004
#  nappe de cordes + basse + arpège de piano régulier + pulsation douce ;
#  l'énergie évolue avec le propos, sans aucune coupure, jusqu'au thème de fin.
# =====================================================================
BPM = 80; BEAT = 60 / BPM; BAR = 4 * BEAT
PROG = [([57, 60, 64], 45), ([53, 57, 60], 41), ([48, 52, 55], 36), ([55, 59, 62], 43)]   # Lam – Fa – Do – Sol
END = [([53, 57, 60], 41), ([55, 59, 62], 43), ([57, 61, 64], 45)]                          # Fa – Sol – La (majeur) : la cloche s'ouvre, puis le thème de fin en ré
t = tt(N)
nb = int(np.ceil(DUR / BAR)) + 1
endbar = int(S8 // BAR) + 1
def chord(b):
    if b >= endbar: return END[min(b - endbar, 2)]
    return PROG[b % 4]
def energy(x):  # 0 (calme) → 1 (plein)
    if x < S2: return .35
    if x < S4: return .55
    if x < S6: return .65
    if x < S7: return .8
    if x < S8: return .6
    return .5
for b in range(nb):
    x0 = b * BAR
    if x0 > DUR + .5: break
    notes, root = chord(b)
    last = b >= endbar + 2
    dur = (DUR - x0 + .5) if last else BAR + 1.0
    e = energy(x0)
    for j, m in enumerate(notes):   # nappe de cordes, toujours là
        add(music, x0, strings(m, dur, .034 + .012 * e, 900 + 500 * e), pan=(j - 1) * .45)
        add(music, x0, strings(m + 12, dur, .012 + .012 * e, 1500), pan=(1 - j) * .4)
    add(music, x0, pad(root, dur, .07, .25, .8))   # basse
    if x0 + .3 >= BAR * .9:   # arpège de piano (dès la 2e mesure) : le fil de l'explication
        pat = [0, 1, 2, 1, 3, 1, 2, 1] if not last else [0, 1, 2, 3]
        tones = sorted(set([n + 12 for n in notes] + [notes[0] + 24]))
        step = BEAT / 2 if not last else BEAT
        for k, pi in enumerate(pat):
            xx = x0 + k * step + (.008 if k % 2 else 0)
            if xx > DUR - 1: break
            add(music, xx, piano(tones[pi % len(tones)], (.046 + .02 * e) * (1 if k % 4 == 0 else .78), 2.0), pan=.18 * np.sin(k * 1.3))
    if S2 <= x0 < S8:   # pulsation douce
        for k in (0, 2):
            add(music, x0 + k * BEAT, kick(.05 + .05 * e))
        if S3 <= x0 < S6:
            for k in range(4): add(music, x0 + k * BEAT + BEAT / 2, hat(.008 + .01 * e), pan=.35)
    if S4 <= x0 < S8 and b % 2 == 0:   # contre-chant (cloche douce)
        add(music, x0 + BEAT * 2, bell(notes[-1] + 24, .012, 3), pan=-.3)

# ---------------------------------------------------------------- design sonore (discret)
for e in ev['sfx']:
    T, ty = e['t'], e['type']
    if ty == 'rain':
        n = int(e['d'] * SR); add(fx, T, bp(noise(e['d']), 1500, 9000) * np.clip(tt(n) / .8, 0, 1) * np.clip((e['d'] - tt(n)) / .8, 0, 1) * .018)
    elif ty == 'city':
        n = int(e['d'] * SR); add(fx, T, lp(noise(e['d']), 380) * np.clip(tt(n) / 1.2, 0, 1) * np.clip((e['d'] - tt(n)) / .8, 0, 1) * .02)
    elif ty == 'step':
        add(fx, T, (lp(noise(.12), 900) + bp(noise(.12), 2500, 6000) * .4) * np.exp(-tt(int(.12 * SR)) * 40) * .045, pan=-.3 if int(T * 10) % 2 else .3)
    elif ty == 'car':
        n = int(e['d'] * SR); u = tt(n) / e['d']; add(fx, T, lp(noise(e['d']), 220) * (.2 + u) * np.clip((1 - u) / .2, 0, 1) * .04)
    elif ty == 'fire':
        n = int(e['d'] * SR); out_ = np.zeros(n)
        for _ in range(int(e['d'] * 9)):
            i = int(rng.random() * (n - 800)); m = int((.002 + rng.random() * .006) * SR); out_[i:i + m] += bp(rng.standard_normal(m), 1200, 6000) * np.hanning(m) * rng.random()
        add(fx, T, (out_ * .05 + lp(noise(e['d']), 300) * .02) * np.clip(tt(n) / .6, 0, 1) * np.clip((e['d'] - tt(n)) / .6, 0, 1), pan=-.4)
    elif ty == 'crack':
        add(fx, T, hp(noise(.3), 2500) * np.exp(-tt(int(.3 * SR)) * 20) * .08); add(fx, T, bell(96, .01, 1.2))
    elif ty == 'shatter':
        for k in range(10): add(fx, T + k * .05 + rng.random() * .04, bell(90 + int(rng.random() * 10), .008, 1.0), pan=(rng.random() - .5) * 1.4)
        add(fx, T, hp(noise(.8), 3000) * np.exp(-tt(int(.8 * SR)) * 5) * .05)
    elif ty.startswith('tr_'):   # transitions : un souffle doux, rien de plus
        add(fx, T, whoosh(e['d'] + .2, 500, 2600, .028))
    elif ty in ('glow', 'balance', 'settle', 'chime'):
        add(fx, T, bell(84 if ty != 'balance' else 76, .009, 2.5), pan=.25)
    elif ty == 'reveal':
        for k, m in enumerate((74, 78, 81, 86)): add(fx, T + k * .06, bell(m, .014, 3.5), pan=-.3 + k * .2)

air = lp(noise(DUR), 1200) * .004 * (1 + .5 * np.sin(2 * np.pi * t / 7.3))
fx += np.stack([air, np.roll(air, 2400)], 1)

# ---------------------------------------------------------------- réverbération
def ir(rt):
    n = int(rt * SR); tr = tt(n); out = []
    for _ in range(2):
        x = rng.standard_normal(n) * np.exp(-6.9 * tr / rt); x = lp(x, 6500); x[:int(.02 * SR)] = 0; out.append(x / np.sqrt(np.sum(x ** 2)))
    return out


R = ir(3.2)
bed = music + fx
wet = np.stack([fftconvolve(bed[:, c], R[c])[:N] for c in range(2)], 1)
bed = hp(bed * .8 + wet * .45, 28)
# musique continue : aucune coupure ; elle s'adoucit seulement un peu sous la question finale
g = np.ones(N)
qg = 1 - .25 * np.clip((t - (QUESTION - .8)) / .8, 0, 1) * np.clip((TITLE - .15 - t) / .6, 0, 1)
bed *= qg[:, None]
# silence final maîtrisé
fade = np.clip((DUR - .5 - t) / 2.2, 0, 1) ** 1.6
bed *= fade[:, None]
if len(sys.argv) > 4:
    wavfile.write(sys.argv[4], SR, (np.clip(bed / (np.max(np.abs(bed)) + 1e-9) * .9, -1, 1) * 32767).astype(np.int16))

# ---------------------------------------------------------------- voix (prioritaire) + mixage
vsr, v = wavfile.read(sys.argv[2]); v = v.astype(float)
if v.ndim > 1: v = v.mean(1)
if np.max(np.abs(v)) > 1.5: v /= 32768
v = np.pad(v, (0, max(0, N - len(v))))[:N]
v = hp(v, 85); v = v + .2 * bp(v, 2500, 6000)
F = 480
fr = np.sqrt(np.mean(np.pad(v, (0, (-N) % F)).reshape(-1, F) ** 2, 1))
envv = np.zeros_like(fr)
for i in range(1, len(fr)):
    al = 1 - np.exp(-1 / 3) if fr[i] > envv[i - 1] else 1 - np.exp(-1 / 35)
    envv[i] = envv[i - 1] + al * (fr[i] - envv[i - 1])
active = np.percentile(fr[fr > 1e-4], 75)
comp = np.where(envv > active * .5, (np.maximum(envv, 1e-9) / (active * .5)) ** -.4, 1)
v *= np.interp(np.arange(N), np.arange(len(comp)) * F, comp)
vmask = np.interp(np.arange(N), np.arange(len(envv)) * F, envv) > active * .3
vr = np.sqrt(np.mean(v[vmask] ** 2)); KV = 3.4 * vr; v = KV * np.tanh(v / KV); v /= np.sqrt(np.mean(v[vmask] ** 2))
VR = ir(.6)
vwet = np.stack([fftconvolve(v, VR[c])[:N] for c in range(2)], 1)
vst = np.stack([v, v], 1) * .95 + vwet * .08
duck = 1 - .42 * np.clip(envv / active, 0, 1)   # la musique reste présente sous la voix
bed *= np.interp(np.arange(N), np.arange(len(duck)) * F, duck)[:, None]
rms = lambda x: np.sqrt(np.mean(x ** 2)) + 1e-12
musical = (~vmask) & (g > .5) & (fade > .5)
bed *= 10 ** (-19 / 20) / rms(bed[fade > .5])   # niveau de la musique sur tout le film (bien présente sous la voix)
target = 10 ** (-10.4 / 20)
bv = rms(bed[vmask]); vv = rms(vst[vmask])
out = bed + vst * np.sqrt(max(target ** 2 - bv ** 2, (target * .5) ** 2)) / vv
# ---------------------------------------------------------------- petite musique de fin (sur l'écriture finale)
end = np.zeros((N, 2))
beat = 60 / 76
theme = [(0, 69, .5), (.5, 74, .5), (1, 78, .75), (1.75, 76, .25), (2, 74, .5), (2.5, 81, 1.5)]   # la – ré – fa# – mi – ré … la
for b0, m, d in theme:
    add(end, TITLE + b0 * beat, piano(m, .16, 2.4 + d), pan=.1)
    add(end, TITLE + b0 * beat + .004, bell(m + 12, .018, 2.0), pan=-.2)
for m, g in ((38, .07), (50, .05), (54, .045), (57, .045), (62, .04), (66, .035)):   # Ré majeur, cordes douces
    add(end, TITLE - .1, strings(m, DUR - TITLE + .6, g, 1600), pan=(m - 55) / 30)
add(end, TITLE, piano(38, .2, 4.0)); add(end, TITLE + .01, piano(50, .12, 4.0))
endw = np.stack([fftconvolve(end[:, c], R[c])[:N] for c in range(2)], 1)
end = end * .75 + endw * .5
end *= (np.clip((DUR - .35 - t) / 1.6, 0, 1) ** 1.3)[:, None]
er = rms(end[int(TITLE * SR):int((DUR - 1) * SR)])
out = out + end * (10 ** (-17 / 20) / er)
K = .7; mag = np.abs(out)
out = np.sign(out) * np.where(mag < K, mag, K + (.944 - K) * np.tanh((mag - K) / (.944 - K)))
wavfile.write(sys.argv[3], SR, (out * 32767).astype(np.int16))
sp = 20 * np.log10(rms(out[vmask])); gp = 20 * np.log10(rms(out[musical]))
print(f'mix ok {DUR:.2f} s · parole {sp:.1f} dBFS · musique seule {gp:.1f} dBFS · crête {20 * np.log10(np.max(np.abs(out))):.1f} dBFS')
