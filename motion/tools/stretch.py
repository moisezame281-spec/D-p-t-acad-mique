"""Ralentit une phrase de la voix (étirement temporel ffmpeg atempo, hauteur conservée) et met le minutage à jour.
Usage : python3 stretch.py <dossier_voix> <id_phrase> <facteur ex. 0.9>"""
import json, sys, os, shutil, subprocess, numpy as np, soundfile as sf
d, sid, fac = sys.argv[1], sys.argv[2], float(sys.argv[3])
tl = json.load(open(f'{d}/timeline.json')); y, sr = sf.read(f'{d}/voice.wav', dtype='float32')
S = tl['sentences']; s = next(x for x in S if x['id'] == sid); i = S.index(s)
a = s['start'] - .06; b = s['end'] + .06
assert (i == 0 or S[i - 1]['end'] < a) and (i == len(S) - 1 or S[i + 1]['start'] > b), 'bornes hors silence'
ia, ib = int(a * sr), int(b * sr)
sf.write(f'{d}/_seg.wav', y[ia:ib], sr)
FF = shutil.which('ffmpeg')
if not FF:
    import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([FF, '-loglevel', 'error', '-y', '-i', f'{d}/_seg.wav', '-filter:a', f'atempo={fac}', '-ar', str(sr), f'{d}/_seg_s.wav'], check=True)
z, _ = sf.read(f'{d}/_seg_s.wav', dtype='float32')
if z.ndim > 1: z = z.mean(1)
f = int(.01 * sr); w = np.linspace(0, 1, f)
z[:f] *= w; z[-f:] *= w[::-1]
out = np.concatenate([y[:ia], z, y[ib:]])
delta = len(z) / sr - (b - a)
def mp(t): return t if t <= a else (a + (t - a) / fac if t <= b else t + delta)
for x in S:
    x['start'], x['end'] = round(mp(x['start']), 3), round(mp(x['end']), 3)
    for w_ in x['words']: w_['start'], w_['end'] = round(mp(w_['start']), 3), round(mp(w_['end']), 3)
    for c in x['chunks']: c['start'], c['end'] = round(mp(c['start']), 3), round(mp(c['end']), 3)
tl['duration'] = round(tl['duration'] + delta, 3)
out = np.pad(out, (0, max(0, int(tl['duration'] * sr) - len(out))))[:int(tl['duration'] * sr)]
sf.write(f'{d}/voice.wav', out, sr, subtype='PCM_16')
json.dump(tl, open(f'{d}/timeline.json', 'w'), ensure_ascii=False, indent=1)
def ts(x):
    ms = int(round(x * 1000)); return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'
with open(f'{d}/subtitles.srt', 'w', encoding='utf-8') as fh:
    allc = [c | {'text': c['text']} for x in S for c in x['chunks']]
    for n, c in enumerate(allc, 1):
        end = c['end'] + .25
        if n < len(allc): end = min(end, allc[n]['start'] - .04)
        fh.write(f"{n}\n{ts(c['start'])} --> {ts(max(end, c['start'] + .3))}\n{c['text']}\n\n")
os.remove(f'{d}/_seg.wav'); os.remove(f'{d}/_seg_s.wav')
print(f'{sid} : {b - a:.2f} s → {len(z) / sr:.2f} s (+{delta:.2f} s) ; durée totale {tl["duration"]:.2f} s')
