"""Reprise ciblée d'un groupe de souffle, sans relancer toute la narration.

Usage : python3 retake.py <narration.json> <dossier_de_travail> <id_phrase> <mots_clés séparés par des virgules> <graphie 1> [<graphie 2> …]

- génère plusieurs prises pour chaque graphie (voix et réglages de l'intention de la phrase) ;
- garde la prise où chaque mot-clé est entendu par les deux modèles de transcription (« medium » et « small »),
  avec et sans bruit de fond, sans voix après le dernier mot reconnu, et avec le moins d'écart au texte ;
- la masterise comme narrate.py et l'écrit dans le cache, sous la clé de la phrase d'origine (l'ancienne prise est gardée en .ancienne).
Relancer ensuite narrate.py : il réassemble la voix en réutilisant le cache (seule cette phrase change).
"""
import sys, os, json, re, hashlib, difflib, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, soundfile as sf, librosa, torch
from faster_whisper import WhisperModel
from voice_master import master
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

SR = 48000
CFGF, WORK, SID, KEYS = sys.argv[1:5]; VARS = sys.argv[5:]
cfg = json.load(open(CFGF)); REF = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(CFGF)), cfg['ref']))
# mêmes intentions que narrate.py (la clé du cache en dépend)
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'narrate.py'), encoding='utf-8').read()
INTENTS = eval(src[src.index('INTENTS = {') + 10: src.index('\n}\n', src.index('INTENTS = {')) + 2])
sen = next(s for s in cfg['sentences'] if s['id'] == SID)
grp = [s for s in cfg['sentences'] if s.get('group') and s.get('group') == sen.get('group')] or [sen]
assert len(grp) == 1, 'cette reprise ne vise que les groupes d’une seule phrase'
it = dict(INTENTS[sen.get('intent', cfg.get('intent', 'prof'))])
say = ' '.join(c[1] if len(c) > 1 and c[1] else c[0] for c in sen['chunks'])
key = hashlib.sha1(json.dumps([say, it, sen.get('takes', it['takes']), os.path.getsize(REF)]).encode()).hexdigest()[:16]
cf = os.path.join(WORK, 'cache', key + '.wav')
print('phrase', SID, '· cache', os.path.basename(cf), 'existe' if os.path.exists(cf) else 'ABSENT', flush=True)
disp = ' '.join(c[0] for c in sen['chunks'])
def nw(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z0-9 ]+", ' ', s.replace('’', ' ').replace("'", ' ')).split()
def wer(a, b):
    A, B = nw(a), nw(b); sm = difflib.SequenceMatcher(None, A, B)
    return sum(max(i2 - i1, j2 - j1) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal') / max(1, len(A))
def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    return s if not len(idx) else s[max(0, idx[0] - int(.015 * sr)): min(len(s), idx[-1] + int(.08 * sr))]
cb = ChatterboxMultilingualTTS.from_pretrained(device='cpu'); cb.prepare_conditionals(REF, exaggeration=.7)
med = WhisperModel('medium', device='cpu', compute_type='int8'); sm = WhisperModel('small', device='cpu', compute_type='int8')
rng = np.random.default_rng(5); keys = [k.strip().lower() for k in KEYS.split(',') if k.strip()]
best = None
for v in VARS:
    for k in range(int(os.environ.get('TAKES', 4))):
        torch.manual_seed(7000 + 37 * k + len(v))
        w = cb.generate(v.replace('…', '...'), language_id='fr', exaggeration=it['ex'], cfg_weight=it['cfg'], temperature=it['temp'])
        y = librosa.resample(trim(w.squeeze(0).cpu().numpy().astype(np.float32), cb.sr), orig_sr=cb.sr, target_sr=SR).astype(np.float32)
        y16 = librosa.resample(y, orig_sr=SR, target_sr=16000); noisy = y16 + rng.standard_normal(len(y16)).astype(np.float32) * .02
        H = []; lastw = 0
        for m in (med, sm):
            for a in (y16, noisy):
                segs, _ = m.transcribe(a, language='fr', beam_size=5, temperature=0.0, word_timestamps=True); segs = list(segs)
                H.append(' '.join(x.text for x in segs).strip())
                if m is med and a is y16: lastw = max([ww.end for x in segs for ww in (x.words or [])] or [len(y) / SR])
        ok = sum(all(kk in h.lower() for kk in keys) for h in H)
        tail = len(y) / SR - lastw; tl_ = y[int(min(len(y) / SR, lastw + .12) * SR):]
        clean = not (tail > .45 and len(tl_) and 20 * np.log10(np.sqrt(np.mean(tl_ ** 2)) + 1e-9) > -38)
        e = np.mean([wer(disp, h) for h in H])
        print(f'[{v}] prise {k}: mots-clés {ok}/4, fin propre={clean}, écart moyen {e:.0%}, {len(y) / SR:.2f} s | ' + ' | '.join(H), flush=True)
        # un mot en trop (répétition parasite, ex. EP011 : « je, cela, cela ») fait monter l'écart au texte : la prise n'est plus « propre »
        if e > float(os.environ.get('MAXE', .12)): clean = False
        sc = (ok + (3 if clean else 0), -e)
        if best is None or sc > best[0]: best = (sc, y, v, k)
print('RETENUE :', best[2], 'prise', best[3], best[0], flush=True)
y = master(best[1], SR, it['style']).astype(np.float32); y = y / (np.max(np.abs(y)) + 1e-9) * .89
if best[0][0] >= 6:
    if os.path.exists(cf): os.replace(cf, cf + '.ancienne')
    sf.write(cf, y, SR); print('prise remplacée dans le cache', flush=True)
else:
    sf.write(os.path.join(WORK, f'retake_{SID}.wav'), y, SR); print('aucune prise assez sûre : écrite à part, cache inchangé', flush=True)
