"""L'Énigme humaine — EP003 — composition originale + design sonore + mixage (format de série).
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
WHY = first['cut'] + .02; TITLE = first['reveal']; QUESTION = first['question']; KEY = first['keystone']
LIGHT = first['light']; FOI2 = first['glow']; STARS = first['stars']; DUSK = first['dusk']; REVEL = first['revelation']; SWAP = first['swap']
CUTD = next(e['d'] for e in ev['sfx'] if e['type'] == 'cut')
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


# ---------------------------------------------------------------- 1. la bibliothèque : le temps, la lumière qui monte
t = tt(N)
drone = (np.sin(2 * np.pi * mtof(26) * t) + .5 * np.sin(2 * np.pi * mtof(33) * t) + .25 * np.sin(2 * np.pi * mtof(38) * t)) * .11
drone *= np.clip((t - .2) / 2.5, 0, 1) * np.clip((S2 + .5 - t) / .5, 0, 1)
music += np.stack([drone, drone], 1)
for k, x in enumerate(np.arange(.9, WHY - .3, 1.0)):  # le balancier des siècles
    add(music, x, wood(.05 + .015 * (k % 2)), pan=-.35 if k % 2 else .35)
for k, (dt, m) in enumerate([(0, 74), (.45, 77), (.9, 81), (1.6, 86)]):  # la lumière entre
    add(music, LIGHT + dt, bell(m, .03, 3.5), pan=-.4 + k * .25)
add(music, LIGHT, pad(62, WHY - LIGHT + .4, .03, 1.5, .4))
add(fx, first['slam'] - .55, swell(.55, .18))
for e in ev['sfx']:
    if e['type'] == 'slam':
        add(fx, e['t'], boom(.5)); add(fx, e['t'], bell(50, .05, 2))

# ---------------------------------------------------------------- 2. la distinction : deux voix en contrepoint
step = 60 / 96 / 2
seqL = [50, 53, 57, 60, 57, 53, 50, 45]           # la raison : une ligne qui avance pas à pas
k = 0; x = S2 + .5
while x < S3 - .3:
    add(music, x, pluck(seqL[k % 8], .075, 1.1, 1.4), pan=-.55)
    x += step; k += 1
for m in (38, 45):
    add(music, S2 + .2, strings(m, S3 - S2 + 1.0, .08, 700))
for m, g in ((62, .04), (66, .035), (69, .035), (74, .03)):  # la foi : une lumière tenue, à droite
    add(music, FOI2 - .2, pad(m, S3 - FOI2 + 1.2, g, 1.0, 1.2), pan=.55)
for k in range(6):
    add(music, FOI2 + .3 + k * .55, bell(81 + (0, 5, 9, 12, 9, 5)[k], .014, 2.5), pan=.6)

# ---------------------------------------------------------------- 3. l'arche : on bâtit, la clé de voûte résout
prog3 = [(S3, [38, 45, 50, 53]), (S3 + (KEY - S3) * .5, [34, 46, 50, 53]), (KEY - .9, [33, 45, 49, 52, 55])]
for i, (a, notes) in enumerate(prog3):
    b = prog3[i + 1][0] if i + 1 < len(prog3) else KEY
    for j, m in enumerate(notes):
        add(music, a, strings(m, b - a + .9, .09 if m > 40 else .13, 650 + j * 120), pan=(j / 4 - .5) * .7)
for m, g in ((38, .12), (50, .07), (54, .06), (57, .06), (62, .05), (66, .04)):  # Ré majeur : l'arche tient
    add(music, KEY - .05, strings(m, S4 - KEY + 1.4, g, 1500), pan=(m - 55) / 30)
add(music, KEY, piano(62, .12, 3)); add(music, KEY + .02, piano(66, .08, 3)); add(music, KEY + .04, piano(69, .08, 3))

# ---------------------------------------------------------------- 4. la Bible : clarté du matin
for m, g in ((41, .05), (53, .04), (57, .035), (60, .03), (65, .025)):
    add(music, S4 - .1, pad(m, S5 - S4 + 1.2, g, 1.2, 1.2))
for x, m in zip(np.linspace(S4 + .6, S5 - 1, 5), [69, 72, 77, 76, 72]):
    add(music, x, piano(m, .075), pan=.2)

# ---------------------------------------------------------------- 5. la cour : le jour, la nuit, les signes
for m, g in ((38, .05), (45, .04)):
    add(music, S5 - .1, pad(m, S6 - S5 + 1.2, g, 1.5, 1.2))
mode = [50, 51, 54, 55, 57, 58, 60, 62]           # ré, mi bémol, fa dièse, sol, la, si bémol, do, ré
for k, x in enumerate(np.arange(S5 + .5, DUSK, .62)):
    add(music, x, oud(mode[(k * 3) % 8] - 12 * (k % 3 == 0), .07), pan=.4 * np.sin(k))
for m, g in ((38, .05), (50, .04), (53, .035), (57, .03)):  # le crépuscule
    add(music, DUSK, pad(m, S6 - DUSK + 1, g, 1.4, 1.0))
for k in range(12):
    add(music, STARS + k * .16, bell(81 + (0, 3, 7, 10, 12, 15)[k % 6] + 12 * (k > 7), .012, 3), pan=(k % 5 - 2) * .3)

# ---------------------------------------------------------------- 6. Thomas d'Aquin : chœur, puis la lumière d'en haut
chords = [(S6, [50, 53, 57]), (S6 + (REVEL - S6) * .5, [48, 53, 57]), (REVEL - .3, [50, 54, 57, 62])]
for i, (a, notes) in enumerate(chords):
    b = chords[i + 1][0] if i + 1 < len(chords) else S7 + .3
    for m in notes:
        add(music, a, choir(m, b - a + 1.2, .05, 1.0, 1.4), pan=(m - 54) / 20)
    add(music, a, strings(notes[0] - 12, b - a + 1, .07, 600))
for k, m in enumerate((86, 81, 78, 74)):
    add(music, REVEL + k * .14, bell(m, .02, 3.5), pan=.3 - k * .2)

# ---------------------------------------------------------------- 7. la leçon : le thème se résout
for i, (dt, notes) in enumerate([(0, [38, 50, 54, 57]), (2.6, [43, 50, 55, 59]), (5.2, [45, 52, 57, 61])]):
    for m in notes:
        add(music, S7 + dt, strings(m, 3.4, .05, 1300), pan=(m - 52) / 25)
for x, m in zip([S7 + .4, S7 + 1.5, S7 + 2.6, S7 + 3.4], [66, 69, 74, 73]):
    add(music, x, piano(m, .085), pan=.15)
for k, m in enumerate((62, 66, 69, 74, 78, 81)):
    add(music, SWAP + k * .09, pluck(m, .05, 1.6, 1.5), pan=-.5 + k * .2)

# ---------------------------------------------------------------- 8. la question : presque rien
add(music, S8, pad(57, TITLE - S8 + .6, .03, 1.5, .8)); add(music, S8, pad(45, TITLE - S8 + .6, .03, 1.5, .8))

# ---------------------------------------------------------------- design sonore
def paper():
    out = np.zeros(int(.7 * SR))
    for _ in range(9):
        i = int(rng.random() * .55 * SR); n = int((.01 + rng.random() * .05) * SR)
        out[i:i + n] += bp(rng.standard_normal(n), 1500, 7000) * np.hanning(n) * (.3 + rng.random() * .7)
    return out


def crackle(d, amp):
    n = int(d * SR); out = np.zeros(n)
    for _ in range(int(d * 7)):
        i = int(rng.random() * (n - 800)); m = int((.002 + rng.random() * .006) * SR)
        out[i:i + m] += bp(rng.standard_normal(m), 1200, 6000) * np.hanning(m) * rng.random()
    return out * amp


def chirp(f0, f1, d, amp):
    n = int(d * SR); fr = np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * np.arange(n) / n) ** 2 * amp


for e in ev['sfx']:
    T, ty = e['t'], e['type']
    if ty == 'library':
        n = int(e['d'] * SR); add(fx, T, lp(noise(e['d']), 260) * np.clip(tt(n) / 1.5, 0, 1) * np.clip((e['d'] - tt(n)) / .4, 0, 1) * .02)
    elif ty == 'candle':
        add(fx, T, crackle(e['d'], .05), pan=.35)
    elif ty == 'light':
        add(fx, T - .3, swell(.6, .07))
    elif ty == 'page':
        add(fx, T, paper() * .13, pan=-.2)
    elif ty == 'line':
        add(fx, T, bell(93, .016, 1.8))
    elif ty == 'quill':
        for k in range(5):
            n = int(.07 * SR); add(fx, T + k * .07, bp(noise(.07), 2500, 8000) * np.hanning(n) * .035, pan=-.4)
    elif ty == 'glow':
        add(fx, T - .2, swell(.4, .05)); add(fx, T, pad(74, 1.6, .02, .3, 1.0), pan=.5)
    elif ty == 'shimmer':
        for k in range(8): add(fx, T + k * .07, bell(86 + (k * 5) % 12, .008, 2), pan=.5)
    elif ty == 'stone':
        n = int(.25 * SR); add(fx, T, (lp(noise(.25), 500) * np.exp(-tt(n) * 30) + np.sin(2 * np.pi * 110 * tt(n)) * np.exp(-tt(n) * 25) * .6) * .16, pan=-.4)
    elif ty == 'glass':
        add(fx, T, bell(88, .02, 1.6), pan=.45); add(fx, T, bell(95, .008, 1.2), pan=.5)
    elif ty == 'tension':
        add(fx, T, swell(e['d'], .1))
    elif ty == 'keystone':
        add(fx, T, boom(.55)); add(fx, T, bell(50, .06, 3)); add(fx, T + .02, lp(noise(1.4), 1800) * np.exp(-tt(int(1.4 * SR)) * 4) * .08)
    elif ty == 'daylight':
        add(fx, T - .3, swell(.4, .06))
        for k in range(7):
            x = T + .6 + k * .9 + rng.random() * .3; f = 3200 + rng.random() * 1500
            add(fx, x, chirp(f, f * 1.25, .08, .012), pan=.6); add(fx, x + .11, chirp(f * 1.1, f * .9, .07, .01), pan=.6)
    elif ty == 'lens':
        add(fx, T, whoosh(.8, 600, 2400, .04))
    elif ty == 'gold':
        for k, m in enumerate((74, 78, 81)): add(fx, T + k * .08, bell(m, .02, 3))
    elif ty == 'fountain':
        n = int(e['d'] * SR); wv = bp(noise(e['d']), 500, 3500) * (.6 + .4 * np.abs(np.sin(2 * np.pi * 1.7 * tt(n)))) * np.clip(tt(n) / .8, 0, 1) * np.clip((e['d'] - tt(n)) / .6, 0, 1)
        add(fx, T, wv * .013, pan=-.1)
    elif ty == 'dusk':
        add(fx, T, swell(1.2, .04))
    elif ty == 'drop':
        add(fx, T, chirp(1500, 600, .12, .05)); add(fx, T + .02, bell(79, .01, 1.5))
    elif ty == 'frame':
        add(fx, T, whoosh(.8, 300, 2500, .06))
    elif ty == 'step_soft':
        add(fx, T, lp(noise(.1), 700) * np.exp(-tt(int(.1 * SR)) * 45) * .06, pan=-.3)
    elif ty == 'revelation':
        add(fx, T - .3, swell(.4, .06))
    elif ty == 'dawn':
        add(fx, T - .3, swell(.5, .07))
    elif ty == 'swap':
        add(fx, T, whoosh(.9, 400, 3500, .06))
    elif ty == 'chime':
        add(fx, T, bell(86, .014, 2.5))
    elif ty == 'flicker':
        add(fx, T, lp(noise(.5), 1200) * np.sin(np.pi * np.arange(int(.5 * SR)) / (.5 * SR)) ** 2 * .03)
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
# coupure sonore sur la question : silence total (hors voix), puis reprise sur la plongée
g = np.ones(N)
a, b = int(WHY * SR), int((WHY + CUTD) * SR)
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
