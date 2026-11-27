/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 012 — « Qui pense en toi ? »
   Modèle « tableau vivant » (motion design simple et constant, motion/lib/tableau.js)
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
  beat({ id: 'titre', start: -1, sids: ['s01'], draw(t) {
    TB.text(c, 'L’ÉNIGME DU JOUR', W / 2, 360, 'texte', 32, P.soft);
    const LL = lay('titre', () => TB.fit(c, [{ txt: 'QUI', t: -1 }, { txt: 'PENSE', t: -1 }, { txt: 'EN TOI ?', t: -1, hl: true, col: P.rose, br: true }], 'titre', 170, 960, 460, 1.05));
    TB.words(c, LL, W / 2, 440, t);
    const p = prog(t, .3, 1.0);
    TB.icon(c, 'personne', 470, 1080, .9, p); TB.icon(c, 'bulle', 680, 960, .6, p, P.blue); TB.icon(c, 'points', 680, 966, .6, p, P.blue);
  } });
  // 2. l'expérience
  beat({ id: 'choisis', start: ST('s02'), sids: ['s02'], nosub: true, draw(t) {
    const LL = lay('choisis', () => TB.fit(c, toks(['s02'], { hl: ['prochaine', 'pensée.'], rose: ['pensée.'] }), 'titre', 100, 940, 620, 1.1));
    TB.words(c, LL, W / 2, 330, t);
  } });
  beat({ id: 'difficile', start: ST('s03'), sids: ['s03'], nosub: true, draw(t) {
    const LL = lay('difficile', () => TB.fit(c, toks(['s03'], { hl: ['nouvelle,', 'Difficile,'], rose: ['Difficile,'] }), 'titre', 96, 940, 640, 1.1));
    TB.words(c, LL, W / 2, 330, t);
    TB.icon(c, 'horloge', W / 2, 1150, .6, prog(t, cue('s03', 'avant') - .2, cue('s03', 'avant') + .5), P.soft);
  } });
  // 3. la question
  beat({ id: 'q1', start: ST('s04'), sids: ['s04'], nosub: true, question: SEN('s04').start, draw(t) {
    TB.text(c, 'Alors, posons la question.', W / 2, 400, 'ital', 60, P.blue, { a: prog(t, ST('s04'), ST('s04') + .4) });
    const LL = lay('q1', () => TB.fit(c, toks(['s04'], { hl: ['auteurs'], rose: ['auteurs'] }), 'titre', 110, 940, 600, 1.1));
    TB.words(c, LL, W / 2, 540, t);
  } });
  // 4. Spinoza
  beat({ id: 'spinoza', start: ST('s05'), sids: ['s05', 's06'], draw(t) {
    const tb = cue('s05', 'spinoza');
    TB.text(c, 'Pour comprendre…', W / 2, 400, 'ital', 60, P.blue, { a: prog(t, ST('s05'), ST('s05') + .4) });
    const s = TB.oB(prog(t, tb - .1, tb + .35)), a = prog(t, tb - .1, tb + .15);
    c.save(); c.globalAlpha = a; c.translate(W / 2, 620); c.scale(.6 + .4 * s, .6 + .4 * s); TB.text(c, 'SPINOZA', 0, 0, 'titre', 150, P.ink); c.restore();
    TB.text(c, '1632 – 1677 · Éthique', W / 2, 720, 'ref', 44, P.soft, { a: prog(t, ST('s06'), ST('s06') + .4) });
    TB.text(c, 'une idée dérangeante', W / 2, 1000, 'ital', 70, P.rose, { a: prog(t, cue('s06', 'derangeante') - .4, cue('s06', 'derangeante')) });
  } });
  // 5. la thèse : conscients des désirs, ignorants des causes
  beat({ id: 'these', start: ST('s07'), sids: ['s07', 's08'], draw(t) {
    TB.text(c, 'On se croit libres…', W / 2, 440, 'ital', 80, P.blue, { a: prog(t, ST('s07'), ST('s07') + .3) });
    const t1 = cue('s07', 'desirs'), t2 = cue('s08', 'causes');
    TB.card(c, 110, 580, 860, 200, prog(t, t1 - .3, t1)); TB.text(c, 'conscients de nos désirs', W / 2, 700, 'fort', 60, P.ink, { a: prog(t, t1 - .2, t1 + .1), max: 780 });
    TB.text(c, 'mais', W / 2, 870, 'ital', 64, P.soft, { a: prog(t, ST('s08'), ST('s08') + .3) });
    TB.card(c, 110, 930, 860, 200, prog(t, t2 - .3, t2), { fill: '#FFF2EE' }); TB.text(c, 'ignorants des causes', W / 2, 1050, 'fort', 60, P.rose, { a: prog(t, t2 - .2, t2 + .1), max: 780 });
  } });
  // 6. Libet : l'activité du cerveau avant l'intention rapportée (schéma illustratif)
  beat({ id: 'libet', start: ST('s09'), sids: ['s09', 's10', 's11'], draw(t) {
    TB.text(c, 'Et la neuroscience ?', W / 2, 400, 'ital', 80, P.blue, { a: prog(t, ST('s09'), ST('s09') + .3) });
    const a = prog(t, ST('s10'), ST('s10') + .35); TB.card(c, 90, 490, 900, 660, a);
    if (a <= 0) return;
    TB.text(c, 'Benjamin Libet', W / 2, 590, 'ref', 56, P.ink, { a });
    const tc = cue('s10', 'cerveau'), ti = cue('s11', 'intention'), x0 = 150, x1 = 930, y0 = 940;
    const p = prog(t, ST('s10'), ti + .4, 'linear'), xe = x0 + (x1 - x0) * p;
    c.save(); c.globalAlpha = a; c.lineWidth = 8; c.lineCap = 'round'; c.strokeStyle = P.rose; c.beginPath();
    for (let x = x0; x <= xe; x += 6) { const r = Math.max(0, (x - 470) / (840 - 470)); const y = y0 - 170 * Math.min(1, r) ** 1.6 + 6 * Math.sin(x / 9); x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); }
    c.stroke(); c.strokeStyle = P.soft; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0 + 40); c.lineTo(x1, y0 + 40); c.stroke(); c.restore();
    const m = (x, col, txt, tw) => { const q = prog(t, tw - .15, tw + .25); if (q <= 0) return; c.save(); c.globalAlpha = q; c.fillStyle = col; c.beginPath(); c.arc(x, y0 + 40, 14, 0, 7); c.fill(); c.restore(); TB.text(c, txt, x, y0 + 120, 'fort', 40, col, { a: q, max: 380 }); };
    m(480, P.rose, 'activité du cerveau', tc); m(840, P.blue, '« je veux bouger »', ti);
  } });
  // 7. mais attention
  beat({ id: 'attention', start: ST('s12'), sids: ['s12', 's13'], draw(t) {
    TB.icon(c, 'attention', W / 2, 520, .9, prog(t, ST('s12'), ST('s12') + .5), P.gold, 10);
    const ti = cue('s12', 'illusion'); TB.text(c, 'pas une preuve que le libre', W / 2, 760, 'fort', 56, P.ink, { a: prog(t, ti - .6, ti - .3) }); TB.text(c, 'arbitre est une illusion', W / 2, 834, 'fort', 56, P.ink, { a: prog(t, ti - .6, ti - .3) });
    const t1 = cue('s13', 'simples'), t2 = cue('s13', 'debattue');
    TB.text(c, 'des gestes très simples', W / 2, 990, 'ital', 64, P.blue, { a: prog(t, t1 - .3, t1 + .1) });
    TB.text(c, 'une interprétation débattue', W / 2, 1080, 'ital', 64, P.rose, { a: prog(t, t2 - .3, t2 + .1) });
  } });
  // 8. le Dhammapada (traduction libre du verset 1)
  beat({ id: 'dhamma', start: ST('s14'), sids: ['s14', 's15', 's16'], draw(t) {
    TB.text(c, 'Le bouddhisme', W / 2, 400, 'ital', 80, P.blue, { a: prog(t, ST('s14'), ST('s14') + .3) });
    const a = prog(t, cue('s14', 'verset') - .2, cue('s14', 'verset') + .2); TB.card(c, 110, 480, 860, 520, a, { fill: '#FFF7EE' });
    if (a > 0) {
      TB.text(c, 'DHAMMAPADA · VERSET 1', W / 2, 570, 'texte', 34, P.soft, { a });
      const tq = cue('s15', 'precede'); const q = prog(t, tq - .3, tq + .1);
      TB.text(c, '« L’esprit précède', W / 2, 700, 'ref', 64, P.ink, { a: q }); TB.text(c, 'et façonne nos paroles', W / 2, 790, 'ref', 64, P.ink, { a: q }); TB.text(c, 'et nos actes. »', W / 2, 880, 'ref', 64, P.ink, { a: q });
      TB.text(c, 'traduction libre', W / 2, 950, 'texte', 28, P.soft, { a: q });
    }
    const o1 = cue('s16', 'observer'), o2 = cue('s16', 'cultiver');
    TB.text(c, 'observer', 330, 1120, 'fort', 62, P.blue, { a: prog(t, o1 - .2, o1 + .1) }); TB.text(c, '·', W / 2, 1120, 'fort', 62, P.soft, { a: prog(t, o2 - .2, o2 + .1) }); TB.text(c, 'cultiver', 750, 1120, 'fort', 62, P.green, { a: prog(t, o2 - .2, o2 + .1) });
  } });
  // 9. retenons ça
  beat({ id: 'retenons', start: ST('s17'), sids: ['s17'], nosub: true, draw(t) {
    TB.text(c, 'Retenons ça.', W / 2, 460, 'ital', 96, P.blue, { a: prog(t, ST('s17'), ST('s17') + .3) });
    const t1 = cue('s17', 'choisir'), t2 = cue('s17', 'obeir');
    TB.card(c, 110, 600, 860, 190, prog(t, t1 - .2, t1 + .1)); TB.text(c, 'NE PAS CHOISIR', W / 2, 690, 'titre', 80, P.ink, { a: prog(t, t1 - .1, t1 + .2) }); TB.text(c, 'une pensée', W / 2, 760, 'ital', 50, P.ink, { a: prog(t, t1 - .1, t1 + .2) });
    TB.text(c, '≠', W / 2, 890, 'titre', 110, P.rose, { a: prog(t, t2 - .5, t2 - .2) });
    TB.card(c, 110, 940, 860, 190, prog(t, t2 - .2, t2 + .1), { fill: '#FFF2EE' }); TB.text(c, 'LUI OBÉIR', W / 2, 1065, 'titre', 92, P.rose, { a: prog(t, t2 - .1, t2 + .2) });
  } });
  // 10. deux exemples
  beat({ id: 'exemples', start: ST('s18'), sids: ['s18', 's19'], draw(t) {
    const row = (y, l, r, ta, tb) => {
      const a1 = prog(t, ta - .2, ta + .1), a2 = prog(t, tb - .2, tb + .1);
      TB.card(c, 70, y - 110, 420, 200, a1); TB.text(c, l[0], 280, y - 20, 'ital', 46, P.ink, { a: a1, max: 380 }); TB.text(c, l[1], 280, y + 44, 'fort', 52, P.ink, { a: a1, max: 380 });
      TB.text(c, '≠', W / 2, y + 30, 'titre', 100, P.rose, { a: a2 });
      TB.card(c, 590, y - 110, 420, 200, a2, { fill: '#FFF2EE' }); TB.text(c, r[0], 800, y - 20, 'ital', 46, P.ink, { a: a2, max: 380 }); TB.text(c, r[1], 800, y + 44, 'fort', 52, P.rose, { a: a2, max: 380 });
    };
    row(620, ['une pensée', 'de haine'], ['une personne', 'haineuse'], cue('s18', 'haine'), cue('s18', 'haineuse'));
    row(980, ['une pensée', 'de peur'], ['devoir', 'lui céder'], cue('s19', 'peur'), cue('s19', 'ceder'));
  } });
  // 11. la liberté
  beat({ id: 'liberte', start: ST('s20'), sids: ['s20', 's21'], nosub: true, draw(t) {
    const LL = lay('liberte', () => TB.fit(c, toks(['s20', 's21'], { hl: ['liberté', 'confiance.'], rose: ['liberté'] }), 'titre', 88, 940, 760, 1.12));
    TB.words(c, LL, W / 2, 320, t);
  } });
  // 12. la question finale
  beat({ id: 'q2', start: ST('s22'), sids: ['s22', 's23'], nosub: true, question: SEN('s22').start, draw(t) {
    const LL = lay('q2', () => TB.fit(c, toks(['s22', 's23'], { hl: ['maîtres', 'responsables'], rose: ['maîtres', 'responsables'] }), 'titre', 92, 940, 820, 1.12));
    TB.words(c, LL, W / 2, 320, t);
  } });
  // 13. l'appel au commentaire
  beat({ id: 'cta', start: ST('s24'), sids: ['s24'], nosub: true, draw(t) {
    TB.icon(c, 'commentaire', W / 2, 520, .9, prog(t, ST('s24'), ST('s24') + .5), P.blue);
    const LL = lay('cta', () => TB.fit(c, toks(['s24'], { hl: ['commentaire.'] }), 'titre', 92, 940, 400, 1.1));
    TB.words(c, LL, W / 2, 700, t);
  } });
  for (let i = 0; i < B.length; i++) B[i].end = i + 1 < B.length ? B[i + 1].start : DUR + 1;
  const qEnd = EN('s24'), T = { fin: qEnd + .65 };
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
  ['choisis', 'difficile', 'q1', 'liberte', 'q2', 'cta'].forEach(id => { const b = B.find(x => x.id === id); const L_ = L[id]; if (L_) L_.lines.forEach(ln => ln.items.forEach(tk => { if (tk.hl && tk.t > 0) sfx('pop', tk.t); })); });
  [['s07', 'desirs'], ['s08', 'causes'], ['s10', 'cerveau'], ['s11', 'intention'], ['s17', 'choisir'], ['s17', 'obeir'], ['s18', 'haineuse'], ['s19', 'ceder']].forEach(([s, w]) => sfx('pop', cue(s, w)));
  const secs = ['difficile', 'q1', 'spinoza', 'libet', 'attention', 'dhamma', 'retenons', 'liberte'];
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
