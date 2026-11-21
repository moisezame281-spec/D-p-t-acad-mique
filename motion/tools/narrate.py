"""Narration synthétisée + minutage mot à mot (faster-whisper) + sous-titres.
Moteurs : "kokoro" (rapide) ou "chatterbox" (expressif, voix C de la série : timbre de la voix validée,
plus d'émotion, plusieurs prises par phrase, la plus expressive parmi celles fidèles au texte, traitement studio).
Intentions par phrase (chatterbox) : intime, grave, prof (explique, par défaut), recit, elan.
Usage : python tools/narrate.py <narration.json> <dossier-modele-kokoro> <dossier-sortie>
Sorties : voice.wav (48 kHz mono), timeline.json (phrases, mots, blocs de sous-titres), subtitles.srt
Le texte affiché ('display') reste celui du script officiel ; 'say' ne sert qu'à la prononciation.
"""
import difflib
import json
import os
import re
import sys
import unicodedata
import numpy as np
import soundfile as sf
import librosa
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
model_dir, out = sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
SR = 48000
tts = Kokoro(f'{model_dir}/kokoro-v1.0.onnx', f'{model_dir}/voices-v1.0.bin')
asr = WhisperModel('small', device='cpu', compute_type='int8')
ENGINE = cfg.get('engine', 'kokoro')
INTENTS = {  # émotion (exaggeration), rythme (cfg : plus bas = plus posé), prises, traitement
    'intime': dict(ex=.78, cfg=.33, temp=.8, takes=3, style='intime'),
    'grave':  dict(ex=.85, cfg=.30, temp=.8, takes=3, style='standard'),
    'prof':   dict(ex=.72, cfg=.38, temp=.8, takes=2, style='standard'),
    'recit':  dict(ex=.62, cfg=.42, temp=.75, takes=2, style='standard'),
    'elan':   dict(ex=.80, cfg=.45, temp=.8, takes=2, style='standard'),
}
if ENGINE == 'chatterbox':
    import torch
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from voice_master import master
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    REF = cfg['ref'] if os.path.isabs(cfg['ref']) else os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), cfg['ref']))
    cb = ChatterboxMultilingualTTS.from_pretrained(device='cpu')
    cb.prepare_conditionals(REF, exaggeration=.7)


NUMW = set('zero un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize vingt trente quarante cinquante soixante cent cents mille et'.split())


def _wer(ref, hyp):
    keep = lambda ws: [w for w in ws if not w.isdigit() and w not in NUMW]   # les nombres (« deux » / « 2 ») ne faussent pas le choix
    r, h = keep(norm_words(ref)), keep(norm_words(hyp)); d = list(range(len(h) + 1))
    for i, x in enumerate(r, 1):
        p_, d[0] = d[0], i
        for j, y in enumerate(h, 1): p_, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p_ + (x != y))
    return d[len(h)] / max(1, len(r))


def _melody(y):
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    f0, vf, _ = librosa.pyin(y16, fmin=90, fmax=500, sr=16000, frame_length=1024)
    f = f0[vf & ~np.isnan(f0)]
    if len(f) < 5: return 0.0
    st = 12 * np.log2(f / np.median(f)); return float(np.percentile(st, 95) - np.percentile(st, 5))


def synth(sen, say):
    """Renvoie la phrase prononcée (48 kHz), selon le moteur choisi."""
    if ENGINE != 'chatterbox':
        a, r_ = tts.create(say, voice=cfg['voice'], speed=sen.get('speed', cfg['speed']), lang=cfg['lang'])
        return librosa.resample(trim(np.asarray(a, dtype=np.float32), r_), orig_sr=r_, target_sr=SR).astype(np.float32)
    it = dict(INTENTS[sen.get('intent', cfg.get('intent', 'prof'))])
    import hashlib
    key = hashlib.sha1(json.dumps([say, it, sen.get('takes', it['takes']), os.path.getsize(REF)]).encode()).hexdigest()[:16]
    cdir = os.path.join(out, 'cache'); os.makedirs(cdir, exist_ok=True); cf = os.path.join(cdir, key + '.wav')
    if os.path.exists(cf):
        print('      (prise en cache réutilisée)', flush=True)
        return sf.read(cf, dtype='float32')[0]
    best = None
    for k in range(sen.get('takes', it['takes'])):
        torch.manual_seed(1000 + 17 * k + len(say))
        w = cb.generate(say.replace('…', '...'), language_id='fr', exaggeration=it['ex'], cfg_weight=it['cfg'], temperature=it['temp'])
        y = librosa.resample(trim(w.squeeze(0).cpu().numpy().astype(np.float32), cb.sr), orig_sr=cb.sr, target_sr=SR).astype(np.float32)
        sg, _ = asr.transcribe(librosa.resample(y, orig_sr=SR, target_sr=16000), language='fr', beam_size=5, temperature=0.0)
        e = _wer(say, ' '.join(x.text for x in sg)); mel = _melody(y)
        score = (e > .12, e if e > .12 else 0, -min(mel, 20) + max(0, mel - 22))  # fidèle d'abord, puis le plus expressif
        print(f'      prise {k + 1}: écart {e:.0%}, mélodie {mel:.1f} demi-tons', flush=True)
        if best is None or score < best[0]: best = (score, y)
    y = master(best[1], SR, it['style']).astype(np.float32)
    y = y / (np.max(np.abs(y)) + 1e-9) * .89
    sf.write(cf, y, SR)
    return y


def norm_words(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r"[’'«»“”]", ' ', s)
    return re.sub(r'[^a-z0-9\- ]+', ' ', s).replace('-', ' ').split()


def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    return s if not len(idx) else s[max(0, idx[0] - int(.015 * sr)): min(len(s), idx[-1] + int(.08 * sr))]


track_parts, timeline, t = [], [], float(cfg.get('lead_in', 0.5))
for sen in cfg['sentences']:
    chunks = [{'display': c[0], 'say': c[1] if len(c) > 1 and c[1] else c[0]} for c in sen['chunks']]
    say = ' '.join(c['say'] for c in chunks)
    s = synth(sen, say)
    dur = len(s) / SR
    # mots reconnus avec horodatage
    segs, _ = asr.transcribe(librosa.resample(s, orig_sr=SR, target_sr=16000), language='fr', beam_size=5,
                             temperature=0.0, word_timestamps=True)
    heard = [(w.word, w.start, w.end) for sg in segs for w in (sg.words or [])]
    hw = []
    for w, a, b in heard:
        parts = norm_words(w)
        for k, p in enumerate(parts):  # répartit un mot reconnu composé
            hw.append((p, a + (b - a) * k / len(parts), a + (b - a) * (k + 1) / len(parts)))
    # mots prononcés (par bloc) alignés sur les mots reconnus
    sw, owner = [], []
    for ci, c in enumerate(chunks):
        for w in norm_words(c['say']):
            sw.append(w); owner.append(ci)
    times = [None] * len(sw)
    sm = difflib.SequenceMatcher(a=sw, b=[h[0] for h in hw], autojunk=False)
    ops = sm.get_opcodes()
    if ops and ops[-1][0] == 'insert' and ops[-1][1] == len(sw) and ops[-1][3] > 0:
        # queue parasite (syllabes ajoutées par le moteur après le dernier mot) : on coupe proprement
        j1 = ops[-1][3]; cut = min(hw[j1][1], hw[j1 - 1][2] + .22); ci = int(cut * SR)
        if ci < len(s):
            fo = min(int(.04 * SR), ci); s = s[:ci].copy(); s[-fo:] *= np.linspace(1, 0, fo)
            print(f"      queue parasite coupée à {cut:.2f} s : « {' '.join(h[0] for h in hw[j1:])} »", flush=True)
            hw = hw[:j1]; heard = [h for h in heard if h[1] < cut]; dur = len(s) / SR
            sm = difflib.SequenceMatcher(a=sw, b=[h[0] for h in hw], autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (hw[blk.b + k][1], hw[blk.b + k][2])
    # interpolation des mots non retrouvés
    known = [i for i, x in enumerate(times) if x]
    for i in range(len(sw)):
        if times[i] is None:
            prv = max([k for k in known if k < i], default=None)
            nxt = min([k for k in known if k > i], default=None)
            a = times[prv][1] if prv is not None else 0.0
            b = times[nxt][0] if nxt is not None else dur
            n_gap = (nxt if nxt is not None else len(sw)) - (prv if prv is not None else -1) - 1
            pos = i - (prv if prv is not None else -1) - 1
            times[i] = (a + (b - a) * pos / max(1, n_gap), a + (b - a) * (pos + 1) / max(1, n_gap))
    ip = sen.get('insert_pause')
    if ip:  # silence dramatique inséré après le n-ième mot (ex. « Et toi ? » … « qu'est-ce qui… »)
        k = ip['after_word'] - 1
        cut = (times[k][1] + times[k + 1][0]) / 2
        ci = int(cut * SR)
        s = np.concatenate([s[:ci], np.zeros(int(ip['dur'] * SR), dtype=np.float32), s[ci:]])
        times = [(a, b) if i <= k else (a + ip['dur'], b + ip['dur']) for i, (a, b) in enumerate(times)]
        dur = len(s) / SR
    words = [{'w': sw[i], 'start': round(t + times[i][0], 3), 'end': round(t + times[i][1], 3), 'chunk': owner[i]} for i in range(len(sw))]
    cks = []
    for ci, c in enumerate(chunks):
        ws = [w for w in words if w['chunk'] == ci]
        a = ws[0]['start'] if ws else t
        b = ws[-1]['end'] if ws else t + dur
        cks.append({'text': c['display'], 'start': round(a, 3), 'end': round(b, 3)})
    cks[0]['start'] = round(t, 3)
    for a_, b_ in zip(cks, cks[1:]):
        b_['start'] = round(max(b_['start'], a_['end'] - 0.05), 3)
    cks[-1]['end'] = round(t + dur, 3)
    match = sum(blk.size for blk in sm.get_matching_blocks()) / max(1, len(sw))
    timeline.append({'id': sen['id'], 'scene': sen['scene'], 'start': round(t, 3), 'end': round(t + dur, 3),
                     'display': ' '.join(c['display'] for c in chunks), 'say': say, 'heard': ' '.join(h[0] for h in heard).strip(),
                     'match': round(match, 3), 'words': words, 'chunks': cks})
    track_parts.append((t, s))
    print(f"{sen['id']}  {t:6.2f} → {t + dur:6.2f}  ({dur:4.2f} s, mots reconnus {match:.0%})  « {' '.join(h[0] for h in heard).strip()} »", flush=True)
    t += dur + sen.get('pause', 0.5)

total = timeline[-1]['end'] + float(cfg.get('tail', 3.0))
track = np.zeros(int(total * SR) + 1, dtype=np.float32)
for st, s in track_parts:
    i = int(st * SR)
    track[i:i + len(s)] += s[: len(track) - i]
sf.write(os.path.join(out, 'voice.wav'), track, SR)
json.dump({'duration': round(total, 3), 'sentences': timeline}, open(os.path.join(out, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def ts(x):
    ms = int(round(x * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


with open(os.path.join(out, 'subtitles.srt'), 'w', encoding='utf-8') as f:
    allc = [c for sen in timeline for c in sen['chunks']]
    for n, c in enumerate(allc, 1):  # fin légèrement prolongée, sans jamais chevaucher le bloc suivant
        end = c['end'] + 0.25
        if n < len(allc):
            end = min(end, allc[n]['start'] - 0.04)
        f.write(f"{n}\n{ts(c['start'])} --> {ts(max(end, c['start'] + 0.3))}\n{c['text']}\n\n")
print(f'durée totale : {total:.2f} s — narration {timeline[0]["start"]:.2f} → {timeline[-1]["end"]:.2f} s')
