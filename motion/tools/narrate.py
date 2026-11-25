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
    'flow':   dict(ex=.80, cfg=.40, temp=.8, takes=3, style='standard'),   # explication continue (passages entiers)
    'flow_slow': dict(ex=.78, cfg=.30, temp=.8, takes=4, style='standard'),  # ouverture : même ton, débit un peu plus posé
    'flow_slower': dict(ex=.78, cfg=.22, temp=.8, takes=5, style='standard'),  # question d'ouverture : encore un peu plus posée
    # ton « explication de prof » (à partir de l'EP011, d'après la vidéo de référence analysée le 25/11/2026) :
    # chaque groupe de souffle (5 à 14 mots) est généré seul, avec plus d'émotion, puis séparé par une petite pause (0,25 à 0,45 s)
    'explique':   dict(ex=1.05, cfg=.45, temp=.8, takes=3, style='standard'),
    'explique_q': dict(ex=1.05, cfg=.36, temp=.8, takes=5, style='standard'),   # questions : même énergie, débit plus posé
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
    f0, vf, _ = librosa.pyin(y16, fmin=60, fmax=500, sr=16000, frame_length=1024)
    f = f0[vf & ~np.isnan(f0)]
    if len(f) < 5: return 0.0
    st = 12 * np.log2(f / np.median(f)); return float(np.percentile(st, 95) - np.percentile(st, 5))


JUDGE = None
def judge_model():
    global JUDGE
    if JUDGE is None: JUDGE = WhisperModel(cfg.get('judge', 'small'), device='cpu', compute_type='int8') if cfg.get('judge', 'small') != 'small' else asr
    return JUDGE


def question_rises(y, words_q):
    """Montée finale (demi-tons) sur chaque fin de question : 80e centile des 0,45 dernières secondes − médiane de la seconde d'avant."""
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    f0, vf, _ = librosa.pyin(y16, fmin=60, fmax=500, sr=16000, frame_length=1024, hop_length=160)
    tt = np.arange(len(f0)) * .01; ok = vf & ~np.isnan(f0)
    if ok.sum() < 10: return [0.0 for _ in words_q]
    st = 12 * np.log2(np.where(ok, f0, 1) / np.median(f0[ok])); out = []
    for e in words_q:
        a_ = (tt > e - .4) & (tt <= e + .25) & ok; b_ = (tt > e - 1.4) & (tt <= e - .45) & ok
        out.append(float(np.percentile(st[a_], 80) - np.median(st[b_])) if a_.sum() > 3 and b_.sum() > 3 else 0.0)
    return out


def synth(sen, say):
    """Renvoie la phrase prononcée (48 kHz), selon le moteur choisi."""
    if ENGINE != 'chatterbox':
        a, r_ = tts.create(say, voice=cfg['voice'], speed=sen.get('speed', cfg['speed']), lang=cfg['lang'])
        y = librosa.resample(trim(np.asarray(a, dtype=np.float32), r_), orig_sr=r_, target_sr=SR).astype(np.float32)
        if cfg.get('master', True): y = master(y, SR, INTENTS.get(sen.get('intent', 'prof'), {}).get('style', 'standard')).astype(np.float32); y = y / (np.max(np.abs(y)) + 1e-9) * .89
        return y
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
        sg, _ = judge_model().transcribe(librosa.resample(y, orig_sr=SR, target_sr=16000), language='fr', beam_size=5, temperature=0.0, word_timestamps=True)
        sg = list(sg); e = _wer(say, ' '.join(x.text for x in sg)); mel = _melody(y)
        # répétition parasite en fin de prise (ex. EP010 : « …un paradoxe, alors un pa… ») : de la voix continue
        # plus de 0,5 s après le dernier mot reconnu, sans être transcrite → la prise est écartée comme un bégaiement
        lastw = max([w.end for x in sg for w in (x.words or [])] or [len(y) / SR])
        tl_ = y[int(min(len(y) / SR, lastw + .12) * SR):]
        if len(y) / SR - lastw > .5 and len(tl_) and 20 * np.log10(np.sqrt(np.mean(tl_ ** 2)) + 1e-9) > -38:
            print(f'      prise {k + 1}: voix non reconnue après le dernier mot ({len(y) / SR - lastw:.2f} s) → écartée', flush=True); e = max(e, .5)
        nq = say.count('?'); qe = [w.end for x in sg for w in (x.words or []) if '?' in w.word][:nq]
        rs = question_rises(y, qe) if qe else []; rise = (sum(min(r, 6) for r in rs) / nq - 2 * max(0, nq - len(qe))) if nq else 0.0
        wps = len(norm_words(say)) / max(.5, len(y) / SR); pace = sen.get('pace')   # débit (mots par seconde) : sur l'ouverture, on préfère la prise la plus posée
        slow = max(0, wps - pace) * 6 if pace else 0
        score = (e > (.02 if cfg.get('judge') else .12), e if e > (.02 if cfg.get('judge') else .12) else 0, slow - rise * .6 - min(mel, 20) + max(0, mel - 22))  # fidèle d'abord (sans bégaiement), puis le débit voulu, des questions qui montent, puis le plus expressif
        print(f'      prise {k + 1}: écart {e:.0%}, mélodie {mel:.1f} demi-tons, débit {wps:.2f} mots/s' + (f", questions {', '.join(f'{r:+.1f}' for r in rs)}" if nq else ''), flush=True)
        if best is None or score < best[0]: best = (score, y)
    y = master(best[1], SR, it['style']).astype(np.float32)
    y = y / (np.max(np.abs(y)) + 1e-9) * .89
    sf.write(cf, y, SR)
    return y


def shape_intonation(y, regions):
    """Fait monter la voix (en demi-tons) sur des fenêtres précises : la fin d'une question, un mot interrogé.
    Analyse/resynthèse WORLD, recollée seulement sur ces fenêtres (fondus de 30 ms) : le reste du son est intact."""
    if not regions: return y
    import pyworld as pw
    x = y.astype(np.float64); fp = 5.0
    f0, tp = pw.harvest(x, SR, frame_period=fp, f0_floor=80, f0_ceil=600)   # harvest : détection des parties voisées plus sûre que dio
    sp = pw.cheaptrick(x, f0, tp, SR); ap = pw.d4c(x, f0, tp, SR); f0m = f0.copy()
    for t0, tk, t1, st in regions:   # rampe jusqu'au pic (fin du mot), puis la hauteur tient sur la voyelle finale
        m = (tp >= t0) & (tp <= t1); u = np.clip((tp[m] - t0) / max(1e-3, tk - t0), 0, 1)
        f0m[m] *= 2 ** (st * u ** 1.4 / 12)
    z = pw.synthesize(f0m, sp, ap, SR, fp)[:len(y)]
    z = np.pad(z, (0, max(0, len(y) - len(z))))
    out = y.astype(np.float64).copy(); fd = int(.03 * SR)
    for t0, tk, t1, st in regions:
        a_, b_ = max(0, int((t0 - .06) * SR)), min(len(y), int((t1 + .06) * SR))
        if b_ - a_ <= 2 * fd: continue
        w = np.ones(b_ - a_); w[:fd] = np.linspace(0, 1, fd); w[-fd:] = np.linspace(1, 0, fd)
        out[a_:b_] = out[a_:b_] * (1 - w) + z[a_:b_] * w
    return out.astype(np.float32)


def norm_words(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r"[’'«»“”]", ' ', s)
    return re.sub(r'[^a-z0-9\- ]+', ' ', s).replace('-', ' ').split()


def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    return s if not len(idx) else s[max(0, idx[0] - int(.015 * sr)): min(len(s), idx[-1] + int(.08 * sr))]


units = []   # passages : phrases consécutives d'un même groupe, générées d'un seul tenant (parole continue)
for sen in cfg['sentences']:
    g = sen.get('group')
    if g and units and units[-1].get('group') == g:
        u = units[-1]; u['members'].append((sen, len(u['chunks']), len(sen['chunks']))); u['chunks'] = u['chunks'] + sen['chunks']; u['pause'] = sen.get('pause', .5)
        if sen.get('trim_end'): u['trim_end'] = sen['trim_end']
    else:
        u = dict(sen); u['chunks'] = list(sen['chunks']); u['members'] = [(sen, 0, len(sen['chunks']))]; units.append(u)
track_parts, timeline, t = [], [], float(cfg.get('lead_in', 0.5))
for sen in units:
    chunks = [{'display': c[0], 'say': c[1] if len(c) > 1 and c[1] else c[0]} for c in sen['chunks']]
    say = ' '.join(c['say'] for c in chunks)
    s = synth(sen, say)
    if sen.get('trim_end'):  # fin de prise imposée (répétition du moteur repérée à l'écoute ou par la transcription « medium »)
        ci = int(sen['trim_end'] * SR); fo = int(.04 * SR)
        if ci < len(s): s = s[:ci].copy(); s[-fo:] *= np.linspace(1, 0, fo)
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
    if times[-1] and dur - times[-1][1] > .7:   # fin de prise sans parole (souffle, bruit du moteur) : on coupe après le dernier mot
        ci = int((times[-1][1] + .3) * SR); fo = int(.05 * SR)
        print(f"      fin de prise sans parole coupée : {dur - times[-1][1] - .3:.1f} s", flush=True)
        s = s[:ci].copy(); s[-fo:] *= np.linspace(1, 0, fo); dur = len(s) / SR
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
    regions = []
    for m, base, n in sen['members']:   # chaque phrase reprend sa place dans le minutage
        mw = [dict(w, chunk=w['chunk'] - base) for w in words if base <= w['chunk'] < base + n]
        mc = cks[base:base + n]
        timeline.append({'id': m['id'], 'scene': m['scene'], 'start': mc[0]['start'], 'end': mc[-1]['end'],
                         'display': ' '.join(c[0] for c in m['chunks']), 'say': ' '.join(c[1] if len(c) > 1 and c[1] else c[0] for c in m['chunks']),
                         'heard': ' '.join(h[0] for h in heard).strip(), 'match': round(match, 3), 'words': mw, 'chunks': mc})
        target = m.get('question_rise', cfg.get('question_rise', 0))
        want = [(wi, st) for wi, st in m.get('rise_words', [])]
        if m['chunks'][-1][0].rstrip().endswith('?') and target: want.append((len(mw) - 1, target))
        if want:
            got = question_rises(s, [mw[wi]['end'] - t for wi, _ in want])
            for (wi, st), g_ in zip(want, got):
                add = float(np.clip(st - g_, 0, 5))
                if add >= 1.0: w = mw[wi]; regions.append((max(0, w['start'] - t - .15), w['end'] - t + .05, min(len(s) / SR, w['end'] - t + .28), round(add, 1)))   # pic sur la fin du mot, tenu jusqu'au bout de la voyelle
                print(f"      « {mw[wi]['w']} » : montée naturelle {g_:+.1f} demi-tons" + (f', ajout {add:+.1f}' if add >= 1.0 else ' (suffisante)'), flush=True)
    if regions:
        s = shape_intonation(s, regions)
        print('      intonation : ' + ', '.join(f'+{st:g} demi-tons à {a + t:.2f} s' for a, k, b, st in regions), flush=True)
    track_parts.append((t, s))
    print(f"{'+'.join(m['id'] for m, _, _ in sen['members'])}  {t:6.2f} → {t + dur:6.2f}  ({dur:4.2f} s, mots reconnus {match:.0%})  « {' '.join(h[0] for h in heard).strip()} »", flush=True)
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
# ralentissement léger d'une phrase (ex. question) :
#   "stretch": 0.9  → facteur imposé ;
#   "max_syl": 5.0  → débit maximal en syllabes/s (mesuré sur le minutage), étiré si besoin, jamais au-delà de -15 %
def _syl(w):
    w = ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if unicodedata.category(c) != 'Mn')
    w = re.sub(r'e$', '', w) if len(w) > 3 else w
    return max(1, len(re.findall(r'[aeiouy]+', w)))
for sen in cfg['sentences']:
    fac = sen.get('stretch')
    if not fac and sen.get('max_syl'):
        tl_ = json.load(open(os.path.join(out, 'timeline.json'), encoding='utf-8'))
        ss_ = [x for x in tl_['sentences'] if x['id'] in sen.get('stretch_ids', [sen['id']])]   # "stretch_ids" : plusieurs phrases d'un même passage
        rate = sum(_syl(w['w']) for s_ in ss_ for w in s_['words']) / max(.3, sum(s_['words'][-1]['end'] - s_['words'][0]['start'] for s_ in ss_))
        fac = max(.85, sen['max_syl'] / rate) if rate > sen['max_syl'] else 1.0
        print(f"      {','.join(sen.get('stretch_ids', [sen['id']]))} : débit {rate:.2f} syllabes/s (max {sen['max_syl']}) → facteur {fac:.2f}", flush=True)
        if fac > .97: fac = None
    if fac:
        import subprocess
        subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'stretch.py'), out, ','.join(sen.get('stretch_ids', [sen['id']])), str(fac)], check=True)
