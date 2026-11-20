"""L'Énigme humaine — EP001 — composition originale + design sonore + mixage.
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
# sections (déduites des événements posés par le montage)
S2 = first['dive'] + .1; S3 = first['light'] - .1; S4 = first['split']; S5 = first['open']; S6 = first['city']; S7 = first['phone_in']
WHY = first['cut'] + .02; TITLE = first['reveal']
QUESTION = first['question'] if 'question' in first else TITLE - 3.4
GOOD = first['swell_good']; BAD = first['swell_bad']; PURIF = first['purify']; DESIR = first['pulse_hot']
print('sections', [round(x, 2) for x in (S2, S3, S4, S5, S6, S7, TITLE)])


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


# ---------------------------------------------------------------- 1. accroche : tension discrète
t = tt(N)
drone = (np.sin(2 * np.pi * mtof(26) * t) + .5 * np.sin(2 * np.pi * mtof(33) * t)) * .12
drone *= np.clip((t - .3) / 2.5, 0, 1) * np.clip((S2 + .6 - t) / .6, 0, 1)
music += np.stack([drone, drone], 1)
shim = (np.sin(2 * np.pi * mtof(86) * t) + np.sin(2 * np.pi * mtof(87) * t * 1.0003)) * .006 * np.clip((t - 2) / 3, 0, 1) * (t < WHY)
music += np.stack([shim, shim * .9], 1)
for k, x in enumerate(np.arange(2.6, WHY - .2, .92)):  # battement sourd
    add(music, x, kick(.16 + .03 * (k % 2)))
add(fx, first['slam'] - .55, swell(.55, .18))
for e in ev['sfx']:
    if e['type'] == 'slam':
        add(fx, e['t'], boom(.55)); add(fx, e['t'], bell(50, .05, 2))

# ---------------------------------------------------------------- 2. Romains 7 : cordes profondes
prog2 = [(S2, 'Dm', [38, 45, 50, 53, 57]), (GOOD - .3, 'Bb', [34, 46, 50, 53, 58]), (BAD - .2, 'A', [33, 45, 52, 55, 61])]
for i, (a, _, notes) in enumerate(prog2):
    b = prog2[i + 1][0] if i + 1 < len(prog2) else S3 + .4
    for j, m in enumerate(notes):
        add(music, a, strings(m, b - a + 1.4, .10 if m > 40 else .14, 700 + j * 120), pan=(j / 4 - .5) * .8)
for x, m in zip(np.linspace(S2 + .4, S3 - .8, 4), [62, 60, 58, 57]):  # violoncelle / alto solo
    add(music, x, strings(m - 12, 1.8, .07, 1500), pan=-.2)

# ---------------------------------------------------------------- 3. Ash-Shams : texture épurée, vers la lumière
for m, g in ((38, .07), (45, .05)):
    add(music, S3, pad(m, S4 - S3 + 1.5, g, 2.0, 1.5))
for k, (x, m) in enumerate(zip(np.arange(S3 + .6, PURIF - .2, 1.15), [69, 72, 74, 76, 74, 72, 69, 67])):
    add(music, x, pluck(m, .07, 2.2, 1.2), pan=.5 * np.sin(k * 1.7))
for m in (53, 57, 60, 65, 69):  # résolution lumineuse (Fa majeur)
    add(music, PURIF - .1, pad(m, S4 - PURIF + 1.8, .045, 1.2, 1.6), pan=(m - 60) / 20)
for k in range(10):
    add(music, PURIF + k * .11, bell(81 + (k * 5) % 12, .012, 2.5), pan=(k % 3 - 1) * .6)

# ---------------------------------------------------------------- 4. la nuance : suspension
for m, g in ((34, .06), (46, .045), (53, .04), (57, .035), (62, .03)):
    add(music, S4 - .2, pad(m, S5 - S4 + 1.2, g, .8, 1.2))

# ---------------------------------------------------------------- 5. Aristote : pulsation intellectuelle
step = 60 / 112 / 4
seq = [50, 57, 53, 57, 50, 58, 53, 58]
k = 0; x = S5 + .3
while x < S6 - .1:
    tension = (x - S5) / (S6 - S5)
    add(music, x, pizz(seq[k % len(seq)] - 12, .16 * (1 if k % 4 == 0 else .7)), pan=.3 * np.sin(k))
    if k % 2 == 0: add(music, x, hat(.03 + .03 * tension), pan=.4)
    x += step; k += 1
for m in (38, 45, 50):
    add(music, S5, strings(m, S6 - S5 + .6, .06, 600))
for m in (49, 50, 56):  # désir / émotion : cluster sombre
    add(music, DESIR - .2, strings(m, S6 - DESIR + .5, .05, 1100))

# ---------------------------------------------------------------- 6. psychologie : progression électronique
beat = 60 / 96
chords6 = [[50, 53, 57, 60, 64], [46, 50, 53, 57, 60], [43, 46, 50, 53, 58], [45, 49, 52, 57, 61]]
k = 0; x = S6 + .2
while x < S7 - .1:
    ch = chords6[int((x - S6) / (beat * 4)) % 4]
    add(music, x, arp(ch[[0, 2, 4, 3, 1, 3, 2, 4][k % 8]] + 12, .07), pan=.4 * np.sin(k * .9))
    if k % 2 == 0: add(music, x, kick(.12))
    x += beat / 2; k += 1
for i in range(int((S7 - S6) / (beat * 4)) + 1):
    a = S6 + i * beat * 4
    for m in chords6[i % 4][:3]:
        add(music, a, pad(m, beat * 4 + 1, .03, .3, 1.0))

# ---------------------------------------------------------------- 7. conclusion : résolution, puis silence
for i, (dt, notes) in enumerate([(0, [34, 46, 53, 58]), (3.2, [41, 48, 53, 57]), (6.4, [43, 50, 55, 58])]):
    for m in notes:
        add(music, S7 + dt, pad(m, 3.8, .045, 1.0, 1.4))
for x, m in zip([S7 + .5, S7 + 2.2, S7 + 3.8, S7 + 5.6, S7 + 7.6], [62, 65, 62, 60, 58]):
    add(music, x, piano(m, .09), pan=.15)

# ---------------------------------------------------------------- design sonore
def paper():
    out = np.zeros(int(.7 * SR))
    for _ in range(9):
        i = int(rng.random() * .55 * SR); n = int((.01 + rng.random() * .05) * SR)
        out[i:i + n] += bp(rng.standard_normal(n), 1500, 7000) * np.hanning(n) * (.3 + rng.random() * .7)
    return out


for e in ev['sfx']:
    T, ty = e['t'], e['type']
    if ty == 'tick':
        n = int(.05 * SR); add(fx, T, (np.sin(2 * np.pi * 2400 * tt(n)) * np.exp(-tt(n) * 120) + hp(noise(.05), 4000) * np.exp(-tt(n) * 200) * .5) * .05, pan=.55)
    elif ty == 'buzz':
        n = int(.5 * SR); tb = tt(n); add(fx, T, np.sin(2 * np.pi * 165 * tb) * (np.sin(2 * np.pi * 7 * tb) > 0) * np.hanning(n) * .05, pan=-.1)
    elif ty == 'lapse':
        add(fx, T, whoosh(e['d'] + .3, 300, 4000, .07))
        for k in range(18): add(fx, T + k * e['d'] / 18, hat(.03))
    elif ty == 'dive':
        add(fx, T - .2, swell(.6, .14)); add(fx, T + .35, whoosh(.9, 2000, 200, .1))
    elif ty == 'paper':
        add(fx, T, paper() * .12, pan=-.3)
    elif ty in ('swell_good', 'swell_bad'):
        add(fx, T, pad(74 if ty == 'swell_good' else 61, 1.6, .03, .3, 1.0), pan=-.5 if ty == 'swell_good' else .5)
    elif ty == 'light':
        add(fx, T - .3, swell(.5, .08))
    elif ty == 'soul':
        add(fx, T, bell(88, .03, 3))
    elif ty == 'purify':
        add(fx, T - .2, lp(noise(2.0), 3000) * np.sin(np.pi * np.arange(int(2 * SR)) / (2 * SR)) ** 2 * .03)  # souffle
    elif ty == 'split':
        add(fx, T, whoosh(.7, 400, 3000, .09))
    elif ty == 'line':
        add(fx, T, bell(93, .015, 1.8))
    elif ty == 'pulse':
        add(fx, T, kick(.12)); add(fx, T, bell(57, .02, 2))
    elif ty == 'open':
        add(fx, T - .2, swell(.4, .1)); add(fx, T + .2, lp(noise(1.2), 900) * np.exp(-tt(int(1.2 * SR)) * 3) * .06)
    elif ty == 'pulse_hot':
        add(fx, T, kick(.14)); add(fx, T, lp(noise(.8), 300) * np.exp(-tt(int(.8 * SR)) * 4) * .08)
    elif ty == 'city':
        add(fx, T, lp(noise(DUR - T), 500)[:int((S7 - T + .5) * SR)] * .012)  # rumeur urbaine
    elif ty == 'pop':
        n = int(.18 * SR); fr = 900 * np.exp(-tt(n) * 8) + 500; add(fx, T, np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt(n) * 22) * .06, pan=.2)
    elif ty == 'ghost':
        for k in range(3): add(fx, T + k * .33, whoosh(.5, 3000, 600, .035), pan=-.3 * k)
    elif ty == 'phone_in':
        add(fx, T - .3, swell(.4, .07))
    elif ty == 'tap':
        add(fx, T, (bp(noise(.06), 800, 5000) * np.exp(-tt(int(.06 * SR)) * 80)) * .18); add(fx, T, kick(.06))
    elif ty == 'step':
        add(fx, T, lp(noise(.12), 600) * np.exp(-tt(int(.12 * SR)) * 40) * .09, pan=.5)
    elif ty == 'reveal':
        add(fx, T - .4, swell(.4, .06))
        for k, m in enumerate((74, 78, 81, 86)): add(fx, T + k * .06, bell(m, .018, 3.5), pan=-.3 + k * .2)

# respirations atmosphériques (souffle très doux sous tout le film)
air = lp(noise(DUR), 1200) * .006 * (1 + .5 * np.sin(2 * np.pi * t / 7.3))
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
# coupure sonore sur « Pourquoi ? » : silence total (hors voix), puis reprise sur la plongée
g = np.ones(N)
a, b = int(WHY * SR), int((S2 - .25) * SR)
g[a:b] = 0
g[max(0, a - 240):a] = np.linspace(1, 0, min(240, a))
g[b:b + 4800] = np.linspace(0, 1, 4800)
bed *= g[:, None]
# la question finale : la musique se retire pour laisser la voix seule
qg = 1 - .85 * np.clip((t - (QUESTION - .5)) / .5, 0, 1) * np.clip((TITLE - .15 - t) / .25, 0, 1)
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
duck = 1 - .6 * np.clip(envv / active, 0, 1)
bed *= np.interp(np.arange(N), np.arange(len(duck)) * F, duck)[:, None]
rms = lambda x: np.sqrt(np.mean(x ** 2)) + 1e-12
musical = (~vmask) & (g > .5) & (fade > .5)
bed *= 10 ** (-17.5 / 20) / rms(bed[musical])
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
out = out + end * (10 ** (-15.5 / 20) / er)
K = .7; mag = np.abs(out)
out = np.sign(out) * np.where(mag < K, mag, K + (.944 - K) * np.tanh((mag - K) / (.944 - K)))
wavfile.write(sys.argv[3], SR, (out * 32767).astype(np.int16))
sp = 20 * np.log10(rms(out[vmask])); gp = 20 * np.log10(rms(out[musical]))
print(f'mix ok {DUR:.2f} s · parole {sp:.1f} dBFS · musique seule {gp:.1f} dBFS · crête {20 * np.log10(np.max(np.abs(out))):.1f} dBFS')
