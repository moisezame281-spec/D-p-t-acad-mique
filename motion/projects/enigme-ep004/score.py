"""L'Énigme humaine — EP004 — composition originale + design sonore + mixage (format de série).
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
S2, S3, S4, S5, S6, S7, S7B = (SEC[k] for k in ('s2', 's3', 's4', 's5', 's6', 's7', 's7b'))
WHY = first['cut'] + .02; TITLE = first['reveal']; QUESTION = first['question']; KNEEL = first['kneel']
GODL = first['godlight']; REAL = first['reasonlight']; SETTLE = first['settle']; DEEP = first['deep']
CUTD = next(e['d'] for e in ev['sfx'] if e['type'] == 'cut')
print('sections', [round(x, 2) for x in (S2, S3, S4, S5, S6, S7, S7B, TITLE)])


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


def organ(m, dur, amp, a=.8, r=1.2):  # orgue doux (additif), sans mélodie liturgique
    n = int(dur * SR); t = tt(n); f = mtof(m)
    s = sum(w * np.sin(2 * np.pi * f * k * t) for k, w in ((.5, .5), (1, 1), (2, .45), (3, .18), (4, .12)))
    return s * env(n, a, r) * amp / 2


def harpsi(m, amp):  # clavecin (cordes pincées brillantes)
    return hp(pluck(m, amp, .9, 2.2), 180)


def drum(amp):  # tambour sur cadre, grave et feutré
    n = int(.5 * SR); t = tt(n); fr = 70 + 40 * np.exp(-t * 18)
    return (np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 7) + bp(noise(.5), 200, 900) * np.exp(-t * 30) * .3) * amp


# ---------------------------------------------------------------- 1. la rue sous la pluie : tension, puis humanité
t = tt(N)
drone = (np.sin(2 * np.pi * mtof(24) * t) + .5 * np.sin(2 * np.pi * mtof(31) * t)) * .11
drone *= np.clip((t - .2) / 2, 0, 1) * np.clip((S2 + .4 - t) / .5, 0, 1)
music += np.stack([drone, drone], 1)
for k, x in enumerate(np.arange(1.2, WHY - .2, .86)):
    add(music, x, kick(.13 + .03 * (k % 2)))
add(fx, first['slam'] - .55, swell(.55, .18))
for e in ev['sfx']:
    if e['type'] == 'slam':
        add(fx, e['t'], boom(.5)); add(fx, e['t'], bell(48, .05, 2))
CAR = first['car']
for m, g in ((36, .08), (43, .06), (48, .05)):  # la tension monte avec les phares
    add(music, CAR, strings(m, KNEEL - CAR + .6, g, 700))
for m, g in ((36, .08), (48, .05), (52, .05), (55, .045), (60, .04)):  # ils s'arrêtent : un accord humain (do majeur)
    add(music, KNEEL - .2, strings(m, S2 - KNEEL + 1.0, g, 1300), pan=(m - 50) / 25)
add(music, KNEEL, piano(64, .08)); add(music, KNEEL + .45, piano(67, .07)); add(music, KNEEL + .9, piano(72, .07))

# ---------------------------------------------------------------- 2. l'arbre : vivant, organique
for m, g in ((39, .07), (46, .05)):
    add(music, S2 - .1, strings(m, S3 - S2 + 1, g, 900))
for k, (x, m) in enumerate(zip(np.arange(S2 + .3, S3 - .4, .38), [63, 67, 70, 75, 70, 67, 63, 70, 74, 79, 74, 70, 67, 63, 67, 70])):
    add(music, x, pizz(m - 12, .12), pan=.4 * np.sin(k))
for x, m in zip(np.linspace(first['roots'], S3 - .6, 4), [51, 48, 46, 43]):  # les racines descendent
    add(music, x, strings(m - 12, 1.6, .07, 900), pan=-.2)

# ---------------------------------------------------------------- 3. la nef : orgue doux, clarté
for m, g in ((44, .07), (51, .05), (56, .045), (60, .04), (63, .035)):
    add(music, S3 - .1, organ(m, S4 - S3 + 1.0, g, 1.0, 1.0), pan=(m - 54) / 25)
for x, m in zip(np.linspace(S3 + .8, S4 - .8, 4), [72, 75, 80, 79]):
    add(music, x, bell(m, .016, 3), pan=.2)

# ---------------------------------------------------------------- 4. les arcs : cordes pincées, tambour sur cadre
for m, g in ((36, .05), (43, .04)):
    add(music, S4 - .1, pad(m, S5 - S4 + 1, g, 1.2, 1.0))
mode = [48, 49, 52, 53, 55, 56, 58, 60]             # do, ré bémol, mi, fa, sol, la bémol, si bémol, do
for k, x in enumerate(np.arange(S4 + .4, S5 - .3, .46)):
    add(music, x, oud(mode[(k * 3 + k // 4) % 8], .07), pan=.35 * np.sin(k * 1.3))
    if k % 4 == 0: add(music, x, drum(.09))
    elif k % 4 == 2: add(music, x, drum(.05))

# ---------------------------------------------------------------- 5. Kant : clavecin, horloge, équilibre classique
alberti = [48, 55, 52, 55, 47, 55, 50, 55, 48, 55, 52, 55, 43, 50, 47, 50]
k = 0; x = S5 + .3
while x < S6 - .3:
    add(music, x, harpsi(alberti[k % 16], .06), pan=-.25); x += 60 / 104 / 2; k += 1
for x, m in zip(np.linspace(S5 + .5, S6 - .8, 5), [72, 76, 79, 77, 76]):
    add(music, x, harpsi(m, .07), pan=.25)
for m, g in ((48, .05), (60, .04), (64, .035), (67, .03)):  # le devoir se fixe
    add(music, SETTLE - .2, strings(m, S6 - SETTLE + 1.2, g, 1500), pan=(m - 58) / 25)

# ---------------------------------------------------------------- 6. la nuance, puis la descente vers le fondement
for i, (dt, notes) in enumerate([(0, [39, 51, 55, 58]), (2.6, [44, 51, 56, 60])]):
    for m in notes:
        add(music, S6 + dt, strings(m, 3.2, .05, 1200), pan=(m - 50) / 25)
add(music, DEEP, strings(31, S7 - DEEP + 1.2, .1, 400)); add(music, DEEP, pad(38, S7 - DEEP + 1.2, .05, 1.5, 1.0))
add(fx, DEEP, lp(noise(S7 - DEEP + .5), 160) * np.clip(tt(int((S7 - DEEP + .5) * SR)) / 1.5, 0, 1) * .05)

# ---------------------------------------------------------------- 7. la question : deux lumières, presque rien
add(music, S7, pad(48, S7B - S7 + .8, .03, 1.2, .8)); add(music, S7, pad(55, S7B - S7 + .8, .025, 1.2, .8))
for k, m in enumerate((79, 84, 88)): add(music, GODL + k * .12, bell(m, .02, 3.5), pan=-.5)
for k, m in enumerate((86, 91, 95)): add(music, REAL + k * .1, bell(m, .014, 2.5), pan=.5)
for m, g in ((36, .06), (48, .045), (55, .04), (64, .035)):  # le débat commence : l'aube
    add(music, S7B, strings(m, TITLE - S7B + 1.0, g, 1400), pan=(m - 50) / 25)

# ---------------------------------------------------------------- design sonore
def paper():
    out = np.zeros(int(.7 * SR))
    for _ in range(9):
        i = int(rng.random() * .55 * SR); n = int((.01 + rng.random() * .05) * SR)
        out[i:i + n] += bp(rng.standard_normal(n), 1500, 7000) * np.hanning(n) * (.3 + rng.random() * .7)
    return out


def chirp(f0, f1, d, amp):
    n = int(d * SR); fr = np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * np.arange(n) / n) ** 2 * amp


for e in ev['sfx']:
    T, ty = e['t'], e['type']
    if ty == 'city':
        n = int(e['d'] * SR); add(fx, T, lp(noise(e['d']), 380) * np.clip(tt(n) / 1.2, 0, 1) * np.clip((e['d'] - tt(n)) / .5, 0, 1) * .03)
    elif ty == 'rain':
        n = int(e['d'] * SR); add(fx, T, bp(noise(e['d']), 1500, 9000) * np.clip(tt(n) / .8, 0, 1) * np.clip((e['d'] - tt(n)) / .6, 0, 1) * .03)
    elif ty == 'step':
        add(fx, T, (lp(noise(.12), 900) + bp(noise(.12), 2500, 6000) * .4) * np.exp(-tt(int(.12 * SR)) * 40) * .07, pan=-.3 if int(T * 10) % 2 else .3)
    elif ty == 'car':
        n = int(e['d'] * SR); u = tt(n) / e['d']; eng = lp(noise(e['d']), 220) * (.2 + u) * np.clip((1 - u) / .2, 0, 1)
        add(fx, T, eng * .06 + bp(noise(e['d']), 400, 1800) * u * .015)
    elif ty == 'kneel':
        add(fx, T, lp(noise(.25), 500) * np.exp(-tt(int(.25 * SR)) * 18) * .1)
    elif ty == 'glow':
        add(fx, T - .2, swell(.4, .05)); add(fx, T, pad(76, 1.4, .016, .3, 1.0))
    elif ty == 'tr_descend':
        add(fx, T, whoosh(e['d'] + .2, 2400, 160, .09)); add(fx, T + e['d'] * .6, boom(.18))
    elif ty == 'tr_rise':
        add(fx, T, whoosh(e['d'] + .2, 180, 2600, .09)); add(fx, T + e['d'] * .7, bell(84, .016, 3))
    elif ty == 'tr_light':
        add(fx, T - .1, swell(e['d'] * .55, .1)); add(fx, T + e['d'] * .5, bell(88, .02, 3.5)); add(fx, T + e['d'] * .5, bell(95, .01, 3))
    elif ty == 'tr_whip':
        add(fx, T, whoosh(e['d'], 500, 4200, .11), pan=-.3)
    elif ty == 'tr_star':
        for k, m in enumerate((76, 79, 83, 88)): add(fx, T + k * e['d'] / 5, bell(m, .016, 2.5), pan=-.4 + k * .27)
        add(fx, T, whoosh(e['d'], 300, 2000, .05))
    elif ty == 'tr_page':
        add(fx, T + e['d'] * .2, paper() * .16); add(fx, T + e['d'] * .4, whoosh(.5, 1200, 400, .04))
    elif ty == 'line':
        add(fx, T, bell(93, .015, 1.8))
    elif ty == 'bloom':
        for k in range(6): add(fx, T + k * .12, bell(84 + (k * 5) % 12, .009, 2.2), pan=.4)
    elif ty == 'roots':
        add(fx, T, lp(noise(e['d']), 300) * np.sin(np.pi * np.arange(int(e['d'] * SR)) / (e['d'] * SR)) * .04)
    elif ty == 'chime':
        add(fx, T, bell(84, .018, 3))
    elif ty == 'mirror':
        add(fx, T, bell(79, .014, 2.5), pan=-.5); add(fx, T + .18, bell(79, .014, 2.5), pan=.5)
    elif ty == 'balance':
        add(fx, T, bell(72, .02, 3)); add(fx, T + .02, bell(79, .012, 3))
    elif ty == 'clock':
        for x in np.arange(T + .2, T + e['d'], 1.0):
            n = int(.05 * SR); add(fx, x, (np.sin(2 * np.pi * 2200 * tt(n)) * np.exp(-tt(n) * 120)) * .03, pan=.5)
    elif ty == 'needle':
        add(fx, T, whoosh(.6, 900, 1800, .03))
    elif ty == 'settle':
        add(fx, T, bell(91, .02, 2.5))
    elif ty == 'deep':
        add(fx, T, whoosh(1.4, 1200, 150, .05))
    elif ty == 'godlight':
        add(fx, T - .3, swell(.4, .05))
    elif ty == 'reasonlight':
        add(fx, T - .3, swell(.4, .04))
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
