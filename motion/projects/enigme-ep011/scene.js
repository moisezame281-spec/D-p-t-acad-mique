/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 011 — « Une machine peut-elle t'aimer ? »
   Premier épisode au modèle « tableau vivant » (motion design simple et constant, motion/lib/tableau.js)
   et au ton « explication de prof » (voix en groupes de souffle, plus expressive).
   L'épisode se décrit par une liste de temps (BEATS) ; le moteur dessine le reste.
   ===================================================================== */
(async function () {
  const { prog, set, sfx } = GX;
  const { W, H, P } = TB;
  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const keysOf = w => (w.replace(/&#\d+;/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z0-9]+/g) || []);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); if (!ws.length) throw new Error('repère introuvable : ' + id + ' « ' + w + ' »'); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['900 40px Bodoni', '800 40px Inter', '600 40px Inter', 'italic 400 40px Instrument', '600 40px Fraunces', '400 40px Instrument'].map(f => document.fonts.load(f, 'Aaé')));
  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const SUBS = document.getElementById('subs');

  /* ---------- mots de la voix → jetons minutés (chaque mot affiché reçoit l'instant où il est prononcé) ---------- */
  function toks(ids, o = {}) {
    const out = [], hl = (o.hl || []).map(h => keysOf(h).join(' ')), rose = (o.rose || []).map(h => keysOf(h).join(' '));
    ids.forEach(id => {
      const s = SEN(id);
      s.chunks.forEach((ch, ci) => {
        const ws = s.words.filter(w => w.chunk === ci), disp = ch.text.split(/\s+/).filter(Boolean);
        const nk = disp.reduce((a, w) => a + Math.max(1, keysOf(w).length), 0);
        let wi = 0;
        disp.forEach((w, j) => {
          const idx = nk === ws.length ? wi : Math.floor(j * ws.length / disp.length);
          const t = (ws[Math.min(idx, ws.length - 1)] || s.words[0]).start; wi += Math.max(1, keysOf(w).length);
          const k = keysOf(w).join(' ');
          out.push({ txt: w, t, hl: hl.includes(k), col: rose.includes(k) ? P.rose : undefined });
        });
      });
    });
    return out;
  }
  const ST = (id, d = -.15) => SEN(id).start + d;   // début d'un temps : juste avant la voix
  const EN = id => SEN(id).end;

  /* ---------- la liste des temps (BEATS) : type, phrases, mots surlignés, pictogramme ---------- */
  const c = ctx;
  const B = [];
  const beat = (o) => { B.push(o); return o; };
  const L = {};   // mises en page calculées une fois
  const lay = (key, f) => L[key] || (L[key] = f());
  // 1. l'accroche : la question de l'épisode, visible dès la première image
  beat({ id: 'titre', start: -1, sids: ['s01'], nosub: false, draw(t) {
    TB.text(c, 'L’ÉNIGME DU JOUR', W / 2, 360, 'texte', 32, P.soft);
    const LL = lay('titre', () => TB.fit(c, [{ txt: 'UNE', t: -1 }, { txt: 'MACHINE', t: -1 }, { txt: 'PEUT-ELLE', t: -1, br: true }, { txt: 'T’AIMER ?', t: -1, hl: true, col: P.rose, br: true }], 'titre', 150, 960, 560, 1.05));
    TB.words(c, LL, W / 2, 430, t);
    const p = prog(t, cue('s01', 'trois') - .2, cue('s01', 'trois') + .5);
    TB.icon(c, 'horloge', 380, 1150, .8, p); TB.text(c, '3 h du matin', 640, 1170, 'ital', 64, P.blue, { a: p, align: 'left' });
  } });
  // 2. la confidence
  beat({ id: 'confie', start: ST('s02'), sids: ['s02'], nosub: true, draw(t) {
    const LL = lay('confie', () => TB.fit(c, toks(['s02'], { hl: ['blessures…', 'intelligence', 'artificielle.'] }), 'titre', 100, 940, 520, 1.1));
    TB.words(c, LL, W / 2, 330, t);
    const p = prog(t, cue('s02', 'intelligence') - .1, cue('s02', 'intelligence') + .6);
    TB.icon(c, 'telephone', 430, 1110, .8, p); TB.icon(c, 'bulle', 660, 1040, .55, p, P.blue); TB.icon(c, 'points', 660, 1046, .55, p, P.blue);
  } });
  // 3. ce que fait l'IA (une liste qui se coche)
  const LIST = [['Elle ne s’impatiente jamais', ST('s03', .05)], ['Elle t’écoute', cue('s03', 'ecoute')], ['Elle reformule tes peurs', ST('s04', .05)], ['Elle trouve les mots', cue('s04', 'trouve')]];
  beat({ id: 'liste', start: ST('s03'), sids: ['s03', 's04'], draw(t) {
    TB.icon(c, 'robot', W / 2, 400, .7, prog(t, ST('s03'), ST('s03') + .5));
    LIST.forEach(([txt, tw], i) => {
      const a = prog(t, tw - .1, tw + .2), y = 640 + i * 150;
      TB.card(c, 120, y - 80, 840, 120, a);
      if (a > 0) { TB.icon(c, 'check', 200, y - 20, 1, prog(t, tw, tw + .3), P.green, 10); TB.text(c, txt, 270, y, 'fort', 48, P.ink, { a, align: 'left', max: 660 }); }
    });
  } });
  // 4. tu te sens compris
  beat({ id: 'compris', start: ST('s05'), sids: ['s05'], nosub: true, draw(t) {
    const LL = lay('compris', () => TB.fit(c, toks(['s05'], { hl: ['compris.'], rose: ['compris.'] }), 'titre', 110, 940, 560, 1.1));
    TB.words(c, LL, W / 2, 360, t);
    TB.icon(c, 'coeur', W / 2, 1110, .9, prog(t, cue('s05', 'compris') - .1, cue('s05', 'compris') + .5), P.rose, 10);
  } });
  // 5. la question
  beat({ id: 'q1', start: ST('s06'), sids: ['s06', 's07'], nosub: true, question: SEN('s07').start, draw(t) {
    TB.text(c, 'Posons-nous une question simple.', W / 2, 400, 'ital', 64, P.blue, { a: prog(t, ST('s06'), ST('s06') + .4) });
    const LL = lay('q1', () => TB.fit(c, toks(['s07'], { hl: ['aimé ?', 'aimé ?', 'aime'], rose: ['aimé ?', 'aimé ?', 'aime'] }), 'titre', 130, 940, 560, 1.1));
    TB.words(c, LL, W / 2, 560, t);
  } });
  // 6. Martin Buber
  beat({ id: 'buber', start: ST('s08'), sids: ['s08', 's09'], draw(t) {
    const tb = SEN('s08').words[SEN('s08').words.length - 1].start;
    TB.text(c, 'Pour y voir clair…', W / 2, 400, 'ital', 60, P.blue, { a: prog(t, ST('s08'), ST('s08') + .4) });
    const s = TB.oB(prog(t, tb - .1, tb + .35)), a = prog(t, tb - .1, tb + .15);
    c.save(); c.globalAlpha = a; c.translate(W / 2, 600); c.scale(.6 + .4 * s, .6 + .4 * s); TB.text(c, 'MARTIN BUBER', 0, 0, 'titre', 120, P.ink); c.restore();
    const ty = cue('s09', 'vingt') - .3; TB.text(c, '1878 – 1965 · Je et Tu (1923)', W / 2, 690, 'ref', 40, P.soft, { a: prog(t, ty, ty + .4) });
    TB.icon(c, 'visages', W / 2, 1020, 1, prog(t, cue('s09', 'manieres') - .2, cue('s09', 'manieres') + .6));
  } });
  // 7. Je-Cela / Je-Tu
  beat({ id: 'jetu', start: ST('s10'), sids: ['s10', 's11', 's12', 's13'], draw(t) {
    TB.text(c, 'DEUX MANIÈRES D’ÊTRE EN RELATION', W / 2, 380, 'texte', 34, P.soft);
    const a1 = prog(t, ST('s10'), ST('s10') + .3), a2 = prog(t, ST('s12'), ST('s12') + .3);
    TB.card(c, 80, 450, 440, 720, a1); TB.card(c, 560, 450, 440, 720, a2, { fill: '#FFF7EE' });
    if (a1 > 0) { TB.text(c, 'JE – CELA', 300, 560, 'titre', 64, P.ink, { a: a1, max: 400 }); TB.icon(c, 'cube', 300, 780, .9, prog(t, ST('s11'), ST('s11') + .5)); TB.text(c, 'l’autre devient', 300, 1000, 'ital', 50, P.ink, { a: prog(t, ST('s11'), ST('s11') + .4), max: 400 }); TB.text(c, 'un objet', 300, 1066, 'fort', 52, P.ink, { a: prog(t, cue('s11', 'objet') - .1, cue('s11', 'objet') + .3), max: 400 }); }
    if (a2 > 0) { TB.text(c, 'JE – TU', 780, 560, 'titre', 64, P.rose, { a: a2, max: 400 }); TB.icon(c, 'visages', 780, 790, .85, prog(t, ST('s13'), ST('s13') + .6), P.rose); TB.text(c, 'tu accueilles', 780, 1000, 'ital', 50, P.ink, { a: prog(t, ST('s13'), ST('s13') + .4), max: 400 }); TB.text(c, 'une présence', 780, 1066, 'fort', 52, P.rose, { a: prog(t, cue('s13', 'presence') - .1, cue('s13', 'presence') + .3), max: 400 }); }
  } });
  // 8. retenons ça
  beat({ id: 'retenons', start: ST('s14'), sids: ['s14'], nosub: true, draw(t) {
    TB.text(c, 'Retenons ça.', W / 2, 460, 'ital', 96, P.blue, { a: prog(t, ST('s14'), ST('s14') + .3) });
    const t1 = cue('s14', 'objet'), t2 = cue('s14', 'presence');
    TB.card(c, 140, 600, 800, 170, prog(t, t1 - .2, t1 + .1)); TB.text(c, 'UN OBJET', W / 2, 715, 'titre', 92, P.ink, { a: prog(t, t1 - .1, t1 + .2) });
    TB.text(c, 'ou', W / 2, 860, 'ital', 70, P.soft, { a: prog(t, t2 - .4, t2 - .1) });
    TB.card(c, 140, 920, 800, 170, prog(t, t2 - .2, t2 + .1), { fill: '#FFF2EE' }); TB.text(c, 'UNE PRÉSENCE', W / 2, 1035, 'titre', 92, P.rose, { a: prog(t, t2 - .1, t2 + .2) });
  } });
  // 9. ce que l'IA peut imiter
  beat({ id: 'signes', start: ST('s15'), sids: ['s15'], nosub: true, draw(t) {
    const LL = lay('signes', () => TB.fit(c, toks(['s15'], { hl: ['signes'] }), 'titre', 100, 940, 520, 1.1));
    TB.words(c, LL, W / 2, 340, t);
    const p = prog(t, cue('s15', 'reconfort') - .2, cue('s15', 'reconfort') + .5);
    TB.icon(c, 'bulle', W / 2, 1060, .8, p, P.blue); TB.icon(c, 'coeur', W / 2, 1050, .35, p, P.rose, 8);
  } });
  beat({ id: 'saufque', start: ST('s16'), sids: ['s16', 's17'], nosub: true, draw(t) {
    TB.text(c, 'Sauf que…', W / 2, 400, 'ital', 80, P.rose, { a: prog(t, ST('s16'), ST('s16') + .3) });
    const LL = lay('saufque', () => TB.fit(c, toks(['s16', 's17']).slice(2).map(k => Object.assign(k, { hl: ['ne', 'prouve', 'pas,'].includes(k.txt) })), 'titre', 84, 940, 600, 1.12));
    TB.words(c, LL, W / 2, 480, t);
    TB.icon(c, 'robot', W / 2, 1200, .6, prog(t, ST('s17'), ST('s17') + .5));
  } });
  // 10. la science : l'étude
  beat({ id: 'etude', start: ST('s18'), sids: ['s18', 's19', 's20'], question: null, draw(t) {
    TB.text(c, 'Et la science ?', W / 2, 420, 'ital', 90, P.blue, { a: prog(t, ST('s18'), ST('s18') + .3) });
    const a = prog(t, ST('s19'), ST('s19') + .35); TB.card(c, 110, 500, 860, 640, a);
    if (a > 0) {
      TB.text(c, 'PSYCHOLOGICAL SCIENCE · 2026', W / 2, 590, 'texte', 34, P.soft, { a }); TB.text(c, 'Folk & Dunn', W / 2, 670, 'ref', 50, P.ink, { a });
      const r = [['+ de 2 000 adultes', cue('s19', 'adultes')], ['4 pays', cue('s20', 'quatre')], ['12 mois', cue('s20', 'an')]];
      r.forEach(([txt, tw], i) => TB.text(c, txt, W / 2, 800 + i * 100, 'fort', 70, i ? P.ink : P.rose, { a: prog(t, tw - .15, tw + .2) }));
      TB.icon(c, 'personnes', W / 2, 1290, .55, prog(t, cue('s19', 'adultes') - .2, cue('s19', 'adultes') + .6));
    }
  } });
  // 11. le résultat
  beat({ id: 'resultat', start: ST('s21'), sids: ['s21', 's22'], draw(t) {
    TB.text(c, 'Résultat', W / 2, 400, 'ital', 80, P.blue, { a: prog(t, ST('s21'), ST('s21') + .3) });
    const t1 = cue('s21', 'chatbots'), t2 = cue('s22', 'isoles');
    TB.card(c, 110, 480, 860, 230, prog(t, t1 - .3, t1)); TB.text(c, 'chatbots de compagnie', 470, 615, 'fort', 56, P.ink, { a: prog(t, t1 - .2, t1 + .1), max: 600 }); TB.icon(c, 'fleche', 860, 595, .55, prog(t, t1, t1 + .4), P.rose, 10);
    TB.icon(c, 'fleche', W / 2, 820, .5, prog(t, t2 - .7, t2 - .3), P.soft, 8);
    TB.card(c, 110, 930, 860, 230, prog(t, t2 - .3, t2)); TB.text(c, 'isolement émotionnel', 470, 1065, 'fort', 56, P.ink, { a: prog(t, t2 - .2, t2 + .1), max: 600 }); TB.icon(c, 'fleche', 860, 1045, .55, prog(t, t2, t2 + .4), P.rose, 10);
  } });
  // 12. la prudence des chercheurs
  beat({ id: 'prudence', start: ST('s23'), sids: ['s23', 's24'], draw(t) {
    TB.icon(c, 'attention', W / 2, 560, .9, prog(t, ST('s23'), ST('s23') + .5), P.gold, 10);
    TB.text(c, 'Les chercheurs restent prudents', W / 2, 820, 'fort', 56, P.ink, { a: prog(t, cue('s23', 'prudents') - .5, cue('s23', 'prudents')) });
    const te = cue('s24', 'exploratoires'); TB.text(c, 'analyses encore exploratoires', W / 2, 920, 'ital', 64, P.blue, { a: prog(t, te - .3, te + .2) });
  } });
  // 13. le danger n'est pas de parler aux machines
  beat({ id: 'danger', start: ST('s25'), sids: ['s25'], nosub: true, draw(t) {
    const LL = lay('danger', () => TB.fit(c, toks(['s25'], { hl: ['pas'] }), 'titre', 104, 940, 560, 1.1));
    TB.words(c, LL, W / 2, 360, t);
    TB.icon(c, 'bulle', W / 2, 1100, .7, prog(t, cue('s25', 'machines') - .2, cue('s25', 'machines') + .4));
  } });
  // 14. préférer…
  beat({ id: 'preferer', start: ST('s26'), sids: ['s26', 's27'], draw(t) {
    TB.text(c, 'Le danger : finir par préférer…', W / 2, 400, 'ital', 64, P.rose, { a: prog(t, ST('s26'), ST('s26') + .4) });
    const t1 = cue('s26', 'contredit'), t2 = cue('s27', 'liberte');
    const a1 = prog(t, t1 - .6, t1 - .3), a2 = prog(t, t2 - .7, t2 - .4);
    TB.card(c, 80, 470, 440, 680, a1, { fill: '#FFF7EE' }); TB.card(c, 560, 470, 440, 680, a2);
    if (a1 > 0) { TB.icon(c, 'miroir', 300, 720, .9, a1, P.gold); TB.text(c, 'une présence qui', 300, 960, 'ital', 46, P.ink, { a: a1, max: 400 }); TB.text(c, 'ne te contredit', 300, 1030, 'fort', 44, P.ink, { a: a1, max: 400 }); TB.text(c, 'jamais', 300, 1090, 'fort', 44, P.rose, { a: a1, max: 400 }); }
    if (a2 > 0) { TB.icon(c, 'personne', 780, 720, .95, a2); TB.text(c, 'une personne', 780, 960, 'ital', 46, P.ink, { a: a2, max: 400 }); TB.text(c, 'qui a sa propre', 780, 1030, 'fort', 44, P.ink, { a: a2, max: 400 }); TB.text(c, 'liberté', 780, 1090, 'fort', 44, P.blue, { a: a2, max: 400 }); }
  } });
  // 15. la question finale
  beat({ id: 'q2', start: ST('s28'), sids: ['s28', 's29'], nosub: true, question: SEN('s28').start, draw(t) {
    const LL = lay('q2', () => TB.fit(c, toks(['s28', 's29'], { hl: ['comprendre…', 'l’autre ?', 'l’autre ?'], rose: ['l’autre ?', 'l’autre ?'] }), 'titre', 90, 940, 820, 1.12));
    TB.words(c, LL, W / 2, 320, t);
  } });
  // 16. l'appel au commentaire
  beat({ id: 'cta', start: ST('s30'), sids: ['s30'], nosub: true, draw(t) {
    TB.icon(c, 'commentaire', W / 2, 520, .9, prog(t, ST('s30'), ST('s30') + .5), P.blue);
    const LL = lay('cta', () => TB.fit(c, toks(['s30'], { hl: ['commentaire.'] }), 'titre', 92, 940, 400, 1.1));
    TB.words(c, LL, W / 2, 700, t);
  } });
  for (let i = 0; i < B.length; i++) B[i].end = i + 1 < B.length ? B[i + 1].start : DUR + 1;
  const qEnd = EN('s30'), T = { fin: qEnd + .65 };
  B.forEach(b => b.draw(-5));   // calcule les mises en page (et les instants des mots surlignés)

  /* ---------- sous-titres (seulement quand l'écran ne montre pas déjà les mots dits) ---------- */
  const NOSUB = new Set(B.filter(b => b.nosub).flatMap(b => b.sids));
  const CHUNKS = TL.sentences.flatMap(s => s.chunks.map(ch => Object.assign(ch, { sid: s.id })));
  CHUNKS.forEach((ch, i) => { const nx = CHUNKS[i + 1]; ch.show = Math.min(ch.end + .3, nx ? nx.start - .02 : ch.end + .6); });
  const chunkAt = t => CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
  const subAlpha = (ch, t) => (!ch || NOSUB.has(ch.sid)) ? 0 : prog(t, ch.start - .03, ch.start + .06, 'linear') * (1 - prog(t, ch.show - .08, ch.show, 'linear'));
  function subs(t) { const ch = chunkAt(t), a = subAlpha(ch, t); if (a <= 0) { SUBS.style.opacity = 0; return; } if (SUBS.dataset.k !== ch.text) { SUBS.textContent = ch.text; SUBS.dataset.k = ch.text; } SUBS.style.opacity = a.toFixed(3); }

  /* ---------- rendu : fond papier fixe, le temps en cours, l'enchaînement sec vers le suivant ---------- */
  const TR = .28;
  function drawBeat(b, t, a, dy, z) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(W / 2, 800 + dy); c.scale(z, z); c.translate(-W / 2, -800); b.draw(t); c.restore(); }
  let COVER = false;
  function render(t) {
    const f = Math.round(t * 30);
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none'; c.globalCompositeOperation = 'source-over';
    TB.paper(c);
    const i = B.findIndex(b => t >= b.start && t < b.end), b = B[Math.max(0, i)];
    const zoom = 1 + .025 * prog(t, b.start, b.end);
    const nx = B[i + 1];
    if (nx && t > nx.start - TR) { const p = TB.oC(prog(t, nx.start - TR, nx.start)); drawBeat(b, t, 1 - p, -70 * p, zoom); drawBeat(nx, t, p, 70 * (1 - p), 1); }
    else drawBeat(b, t, 1, 0, zoom);
    if (!COVER) TB.progress(c, t / DUR);
    if (!COVER) { EH.bug(c, t, { out: T.fin - .35 }); EH.endCard(c, t, T.fin); }
    subs(t);
  }

  /* ---------- événements sonores ---------- */
  B.forEach((b, k) => { if (k > 0) sfx('tr_dissolve', b.start - TR, { d: TR + .1 }); });
  B.forEach(b => { if (b.question) sfx('question', b.question); });
  ['confie', 'compris', 'q1', 'signes', 'saufque', 'danger', 'q2', 'cta'].forEach(id => { const b = B.find(x => x.id === id); const L_ = L[id]; if (L_) L_.lines.forEach(ln => ln.items.forEach(tk => { if (tk.hl && tk.t > 0) sfx('pop', tk.t); })); });
  LIST.forEach(([, tw]) => sfx('pop', tw)); sfx('pop', cue('s14', 'objet')); sfx('pop', cue('s14', 'presence'));
  const secs = ['liste', 'q1', 'buber', 'jetu', 'signes', 'etude', 'prudence', 'preferer'];
  secs.forEach((id, k) => sfx('sec_s' + (k + 2), B.find(b => b.id === id).start));
  sfx('signature', 0); sfx('signature', T.fin); sfx('reveal', T.fin);

  window.DURATION = DUR; window.__T = T; window.__B = B.map(b => [b.id, +b.start.toFixed(2)]);
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : le titre, le logo et le nom, sur le papier
    COVER = true; render(1.2); COVER = false;
    c.setTransform(1, 0, 0, 1, 0, 0); EH.icon(c, 382, 250, 46); EH.wordmark(c, 446, 266, .48, { align: 'left', motto: false, light: true });
    SUBS.style.opacity = 0;
  };
  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
