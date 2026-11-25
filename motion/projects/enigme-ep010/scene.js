/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 010 — « Doit-on pardonner l'impardonnable ? »
   Style validé : explication continue, une seule musique de fond, fondus enchaînés en mouvement.
   Règles : silhouettes sombres jamais sur fond noir (fonds clairs ou contre-jour) ; début et questions posés.
   Habillage : la question à l'écran dès la première image, le logo qui s'allume en haut à gauche, le carton de fin.
   Décors nouveaux : le livre dont on tourne la page, les deux silhouettes séparées, le vase qui se fêle, la porte entrouverte,
   le chemin des trois pierres (Luc 17), la cour et le carreau réparé d'or (Coran 42:40), le bol en kintsugi (Derrida),
   les quatre « pas ça » du pardon, la chaise vide, la porte grande ouverte.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, personPath, rng, off, archPath, lattice, star8 } = CINE;
  const C = { ivory: '#F2EFE8', gold: '#C0A16A', rose: '#E8949A', lamp: '#F2C27D', red: '#D8584A', blue: '#8EC9FF', saff: '#F0A85A', ink: '#2a1d12' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); if (!ws.length) throw new Error('repère introuvable : ' + id + ' « ' + w + ' »'); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument', '400 40px Amiri'].map(f => document.fonts.load(f, 'Aaé')));

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    q1: SEN('s1a').start, tourne: cue('s1a', 'tourne'), page: cue('s1a', 'page'),
    s2: SEN('s2a').start - .3, q2: SEN('s2a').start, fermer: cue('s2a', 'fermer'), livre: cue('s2a', 'livre'), commis: cue('s2a', 'commis'), faute: cue('s2a', 'faute'),
    s3: SEN('s3a').start - .3, blesse: cue('s3a', 'blesse'), excuse: cue('s3a', 'excuse'), recommence: cue('s3a', 'recommence'),
    s3b: SEN('s3b').start - .25, q3: SEN('s3b').start, liberte: cue('s3b', 'liberte'), permission: cue('s3b', 'permission'),
    s4: SEN('s4a').start - .3, luc: cue('s4a', 'luc'), tort: cue('s4a', 'tort'), repentir: cue('s4a', 'repentir'), pardon4: cue('s4a', 'pardon'),
    s5: SEN('s5a').start - .3, coran: cue('s5a', 'coran'), proportionnee: cue('s5a', 'proportionnee'), pardon5: cue('s5a', 'pardon'), reparation: cue('s5a', 'reparation'),
    s6: SEN('s6a').start - .3, derrida: SEN('s6a').start, paradoxe: cue('s6a', 'paradoxe'), q6: SEN('s6b').start, pardonner6: cue('s6b', 'pardonner', 1),
    s7: SEN('s7a').start - .3, q7: SEN('s7a').start, excuser: cue('s7a', 'excuser'), oublier: cue('s7a', 'oublier'), confiance: cue('s7a', 'confiance'), justice7: cue('s7a', 'justice'),
    s8: SEN('s8a').start - .3, q8: SEN('s8a').start, exiger: cue('s8a', 'exiger'), ton: cue('s8a', 'ton'),
    s9: SEN('s9a').start - .3, q9: SEN('s9a').start, libre: cue('s9a', 'libre'), impose: cue('s9b', 'impose'), qEnd: SEN('s9b').end,
  };
  T.fin = T.qEnd + .65; // le carton de fin (logo, nom, appel à suivre)

  /* ---------- texte (DOM) ---------- */
  const tx = (html, cls, style) => el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
  function fit(n, maxW) { const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block'; let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; } n.style.width = w; n.style.display = d; return n; }
  function slam(n, t, t0, t1, out = .3) { const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 }); }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) { const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 }); }
  const grad = (a, b, c) => `background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(0,0,0,.6))`;
  const gspan = (txt, a, b, c, pad = '6px .08em 4px') => `<span style="display:inline-block;padding:${pad};${grad(a, b, c)}">${txt}</span>`;
  const CENTER = { left: '0', width: '1080px', textAlign: 'center' };
  const ROSE = ['#FFF4F2', '#F6C9C6', '#E8949A'], GOLD = ['#FFFFFF', '#F3E6CC', C.gold], RED = ['#FFF2EE', '#F6B4A8', '#E0705E'];
  const small = (txt, top, col = 'rgba(242,239,232,.88)') => fit(tx(txt, 'fraunces', Object.assign({ top: top + 'px', fontWeight: 600, fontSize: '32px', letterSpacing: '.22em', paddingLeft: '.22em', color: col }, CENTER)), 1010);
  const ital = (txt, top, fs, col = C.ivory) => { const n = tx(txt, 'instrument', Object.assign({ top: top + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col }, CENTER)); fit(n, 1000); return n; };
  const big = (txt, top, fs, pal = GOLD) => fit(tx(gspan(txt, ...pal, '10px .06em 4px'), 'bodoni', Object.assign({ top: top + 'px', fontWeight: 900, fontSize: fs + 'px', textShadow: 'none' }, CENTER)), 1010);
  const note = (txt, top, fs = 23, col = 'rgba(242,239,232,.78)') => fit(tx(txt, 'fraunces', Object.assign({ top: top + 'px', fontWeight: 500, fontSize: fs + 'px', letterSpacing: '.04em', color: col }, CENTER)), 1000);

  // S1 — l'accroche : la question de l'épisode, à l'écran dès la première image
  const tKick = [big('DOIT-ON PARDONNER', 300, 88, GOLD), big('L’IMPARDONNABLE&#8239;?', 410, 96, ROSE)];
  // S2 — la question, mot à mot
  const Q2 = [[['Mais', 'pourquoi', 'demander', 'à', 'celui'], 58, 290, C.ivory], [['qui', 'a', 'subi', 'le', 'mal'], 58, 356, C.ivory], [['de', 'fermer', 'le', 'livre,'], 78, 424, C.rose],
    [['alors', 'que', 'celui', 'qui', 'l’a', 'commis'], 58, 520, C.ivory], [['n’a', 'peut-être', 'même', 'pas'], 58, 586, C.ivory], [['reconnu', 'sa', 'faute&#8239;?'], 80, 652, C.rose]];
  // S3 — la porte : liberté ou permission ?
  const Q3 = [[['À', 'quel', 'moment', 'le', 'pardon'], 62, 290, C.ivory], [['cesse-t-il', 'd’être'], 62, 366, C.ivory], [['une', 'liberté'], 92, 440, C.gold], [['et', 'devient-il', 'une'], 62, 552, C.ivory], [['permission&#8239;?'], 96, 626, C.rose]];
  // S4 — Luc 17
  const tLuc = small('ÉVANGILE SELON LUC · 17 : 3', 296, '#EBD39A');
  const tLucQ = [ital('«&#8239;Si ton frère a péché, reprends-le;', 356, 62), ital('et, s’il se repent, pardonne-lui.&#8239;»', 428, 62, C.lamp)];
  const tLucRef = note('trad. Louis Segond, 1910', 512, 24);
  // S5 — Coran 42:40
  const tSur = small('SOURATE ASH-SHÛRÂ · 42 : 40', 290, '#EBD39A');
  const tSurAr = tx('الشورى', 'amiri', Object.assign({ top: '338px', fontSize: '54px', color: C.gold, direction: 'rtl' }, CENTER));
  const tSurQ = [ital('«&#8239;Mais quiconque pardonne et réforme,', 430, 60), ital('son salaire incombe à Allah.&#8239;»', 500, 60, C.lamp)];
  const tSurRef = note('trad. Muhammad Hamidullah (quran.com)', 584, 24);
  // S6 — Derrida
  const tDer = big('JACQUES DERRIDA', 290, 100, GOLD);
  const tDerSub = note('1930 – 2004 · <i>On Cosmopolitanism and Forgiveness</i> (2001)', 410, 28, 'rgba(242,239,232,.95)');
  const tPar = big('UN PARADOXE', 470, 84, ROSE);
  const Q6 = [[['pardonner', 'uniquement'], 70, 290, C.ivory], [['ce', 'qui', 'est', 'pardonnable,'], 70, 370, C.ivory], [['est-ce', 'encore', 'véritablement'], 66, 466, C.ivory], [['pardonner&#8239;?'], 108, 540, C.rose]];
  const tDq = [ital('«&#8239;Le pardon ne pardonne que l’impardonnable.&#8239;»', 1300, 48, C.lamp), note('Jacques Derrida, <i>On Cosmopolitanism and Forgiveness</i>, p. 32 · traduction libre', 1372, 21, 'rgba(242,239,232,.85)')];
  // S7 — ce que pardonner n'est pas, mot à mot
  const Q7 = [[['Mais', 'pardonner', 'n’est', 'pas'], 70, 290, C.ivory], [['excuser,', 'oublier,'], 70, 376, C.rose], [['rendre', 'sa', 'confiance'], 70, 462, C.rose], [['ou', 'renoncer', 'à', 'la', 'justice.'], 70, 548, C.rose]];
  const tSep = note('Distinctions étudiées par la <i>Stanford Encyclopedia of Philosophy</i>, «&#8239;Forgiveness&#8239;» (2026)', 1452, 21, 'rgba(60,48,34,.75)');
  // S8 — la question, mot à mot
  const Q8 = [[['Alors,', 'qui', 'a', 'le', 'droit'], 72, 300, C.ivory], [['d’exiger'], 96, 390, C.ivory], [['ton', 'pardon&#8239;?'], 112, 494, C.rose]];
  // S9 — la question finale, mot à mot
  const Q9 = [[['Et', 'si', 'le', 'pardon', 'ne', 'devenait'], 62, 290, C.ivory], [['une', 'grandeur'], 92, 364, C.gold], [['que', 'lorsqu’il', 'est', 'libre…'], 70, 476, C.ivory], [['et', 'jamais', 'imposé&#8239;?'], 96, 560, C.rose]];
  const keysOf = w => (w.replace(/&#\d+;/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']);
  function wordLines(lines, sids) {
    const words = sids.flatMap(id => SEN(id).words); let wi = 0;
    return lines.map(([ws, fs, y, col]) => fit(tx(ws.map(w => { const idx = wi; wi += keysOf(w).length;
      return `<span class="qw" data-t="${words[Math.min(idx, words.length - 1)].start}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)), 1010));
  }
  const tQ2 = wordLines(Q2, ['s2a']), tQ3 = wordLines(Q3, ['s3b']), tQ6 = wordLines(Q6, ['s6b']), tQ7 = wordLines(Q7, ['s7a']), tQ8 = wordLines(Q8, ['s8a']), tQ9 = wordLines(Q9, ['s9a', 's9b']);

  /* ---------- sous-titres ---------- */
  const NOSUB = new Set(['s2a', 's3b', 's6b', 's7a', 's8a', 's9a', 's9b']);
  const CHUNKS = TL.sentences.flatMap(s => s.chunks.map(c => Object.assign(c, { sid: s.id })));
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.show = Math.min(c.end + .3, nx ? nx.start - .02 : c.end + .6); });
  const chunkAt = t => CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
  const subAlpha = (c, t) => (!c || NOSUB.has(c.sid)) ? 0 : prog(t, c.start - .03, c.start + .06, 'linear') * (1 - prog(t, c.show - .08, c.show, 'linear'));
  function subs(t) {
    const c = chunkAt(t), a = subAlpha(c, t);
    if (a <= 0) { SUBS.style.opacity = 0; return; }
    if (SUBS.dataset.k !== c.text) { SUBS.textContent = c.text; SUBS.dataset.k = c.text; }
    SUBS.style.opacity = a.toFixed(3);
  }


  /* ---------- outils ---------- */
  const cam = (c, z, fx, fy) => c.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 - fy * z);
  const LM = 140;
  const camSafe = (c, z, fx, fy) => { const hw = W / 2 / z, hh = H / 2 / z; cam(c, z, clamp(fx, hw - LM, W - hw + LM), clamp(fy, hh - LM, H - hh + LM)); };
  function prerender(fn, ss = 1.25) { const o = off(Math.round((W + 2 * LM) * ss), Math.round((H + 2 * LM) * ss)), c = o.getContext('2d'); c.setTransform(ss, 0, 0, ss, LM * ss, LM * ss); fn(c); return o; }
  const blit = (c, o) => c.drawImage(o, -LM, -LM, W + 2 * LM, H + 2 * LM);
  const topShade = (c, col, a, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, rgba(col, a)); g.addColorStop(.7, rgba(col, a * .55)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, W, h); };
  const flash = (c, col, a) => { if (a > 0) { c.fillStyle = rgba(col, Math.min(1, a)); c.fillRect(0, 0, W, H); } };
  const _a = off(W, H), _ax = _a.getContext('2d'), _b = off(W, H), _bx = _b.getContext('2d');
  function rimmed(c, fn, o) { // silhouette + liseré de lumière (dans le repère courant de c)
    const tr = c.getTransform();
    _ax.setTransform(1, 0, 0, 1, 0, 0); _ax.clearRect(0, 0, W, H); _ax.setTransform(tr); _ax.fillStyle = _ax.strokeStyle = o.body; fn(_ax);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over'; _bx.clearRect(0, 0, W, H); _bx.setTransform(tr); _bx.fillStyle = _bx.strokeStyle = o.rim; fn(_bx);
    _bx.globalCompositeOperation = 'destination-out'; _bx.setTransform(tr.a, tr.b, tr.c, tr.d, tr.e - o.dx * tr.a, tr.f - (o.dy || 0) * tr.d); _bx.fillStyle = _bx.strokeStyle = '#000'; fn(_bx);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over'; _ax.setTransform(1, 0, 0, 1, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = o.alpha == null ? 1 : o.alpha; if (o.blur) c.filter = `blur(${o.blur}px)`; c.drawImage(_a, 0, 0); c.globalAlpha *= o.rimA; c.drawImage(_b, 0, 0); c.restore();
  }
  function strokeProg(c, pts, p) {
    let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = tot * clamp(p); c.beginPath(); c.moveTo(...pts[0]);
    for (let i = 1; i < pts.length && left > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), k = Math.min(1, left / d); c.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); left -= d; }
    c.stroke();
  }
  const person = (c, p, rim, dx) => { let out; rimmed(c, cc => { out = personPath(cc, p); }, { body: '#120c0e', rim, rimA: .9, dx, alpha: p.alpha == null ? 1 : p.alpha }); return out; };
  // buste de face (ou de dos : la silhouette est la même) ; x : centre, y : bas ; age 0 enfant → 1 adulte
  function bustSil(c, x, y, s, age) {
    const sh = lerp(150, 230, age) * s, hy = y - lerp(330, 400, age) * s, hr = lerp(80, 66, age) * s, hry = lerp(86, 82, age) * s;
    const nw = lerp(34, 44, age) * s, shY = y - lerp(140, 170, age) * s;
    c.beginPath(); c.moveTo(x - sh - 20 * s, y + 4);
    c.bezierCurveTo(x - sh - 10 * s, shY + 40 * s, x - sh + 14 * s, shY, x - nw * 1.7, shY - 8 * s);
    c.quadraticCurveTo(x - nw, shY - 12 * s, x - nw, hy + hry * .6); c.lineTo(x + nw, hy + hry * .6);
    c.quadraticCurveTo(x + nw, shY - 12 * s, x + nw * 1.7, shY - 8 * s);
    c.bezierCurveTo(x + sh - 14 * s, shY, x + sh + 10 * s, shY + 40 * s, x + sh + 20 * s, y + 4); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(x, hy, hr, hry, 0, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(x - hr * .97, hy + 8 * s, 11 * s, 19 * s, 0, 0, 6.283); c.ellipse(x + hr * .97, hy + 8 * s, 11 * s, 19 * s, 0, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(x, hy - hry * .22, hr * lerp(1.12, 1.05, age), hry * lerp(.86, .8, age), 0, Math.PI, 2 * Math.PI); c.fill();
  }


  const LIGHT = (c, x, y, r, a = .5, col = '#FFF6E6') => glow(c, x, y, r, col, a); // halo clair derrière une silhouette

  /* =====================================================================
     DÉCORS (tous nouveaux, tous clairs : les silhouettes sombres n'y sont jamais sur fond noir)
     ===================================================================== */
  const DARK = '#15111a', RIM = '#FFF1DA';
  const sil = (c, fn, rim = RIM, dx = 3, o = {}) => rimmed(c, fn, Object.assign({ body: DARK, rim, rimA: .9, dx }, o));

  // ---------- personnages ----------
  function seatedPath(c, x, y, s, lift) { // assis de profil, tourné vers la droite ; (x, y) = la hanche ; lift : 0 tampon appuyé → 1 levé
    const P = (u, v) => [x + u * s, y + v * s];
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 10 * s; c.beginPath(); c.moveTo(...P(-62, -4)); c.lineTo(...P(-80, -210)); c.stroke();
    c.beginPath(); c.moveTo(...P(-72, 10)); c.lineTo(...P(56, 10)); c.stroke();
    c.lineWidth = 8 * s; c.beginPath(); c.moveTo(...P(-52, 14)); c.lineTo(...P(-68, 200)); c.moveTo(...P(40, 14)); c.lineTo(...P(54, 200)); c.stroke();
    c.lineWidth = 40 * s; c.beginPath(); c.moveTo(...P(0, -14)); c.lineTo(...P(118, -8)); c.stroke();
    c.lineWidth = 32 * s; c.beginPath(); c.moveTo(...P(118, -8)); c.lineTo(...P(112, 178)); c.stroke();
    c.lineWidth = 18 * s; c.beginPath(); c.moveTo(...P(104, 192)); c.lineTo(...P(152, 194)); c.stroke();
    c.beginPath(); c.moveTo(...P(-40, -10)); c.lineTo(...P(34, -10)); c.quadraticCurveTo(...P(48, -110), ...P(32, -196)); c.quadraticCurveTo(...P(-6, -214), ...P(-34, -192)); c.quadraticCurveTo(...P(-54, -100), ...P(-40, -10)); c.fill();
    c.lineWidth = 22 * s; c.beginPath(); c.moveTo(...P(6, -196)); c.lineTo(...P(18, -226)); c.stroke();
    c.beginPath(); c.ellipse(...P(26, -258), 30 * s, 36 * s, .15, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(...P(16, -272), 32 * s, 26 * s, .1, Math.PI * .9, Math.PI * 2.05); c.fill();
    c.beginPath(); c.moveTo(...P(52, -264)); c.lineTo(...P(61, -248)); c.lineTo(...P(52, -243)); c.fill();
    const sh = P(16, -180), hand = P(150, -112 - 66 * lift), el = P(96, -96 - 22 * lift);
    c.lineWidth = 26 * s; c.beginPath(); c.moveTo(...sh); c.lineTo(...el); c.stroke();
    c.lineWidth = 21 * s; c.beginPath(); c.moveTo(...el); c.lineTo(...hand); c.stroke();
    c.beginPath(); c.arc(hand[0] + 6 * s, hand[1] - 8 * s, 13 * s, 0, 6.283); c.fill();
    c.fillRect(hand[0] - 3 * s, hand[1], 18 * s, 22 * s); c.fillRect(hand[0] - 14 * s, hand[1] + 22 * s, 40 * s, 12 * s);
    return { hand };
  }
  function standPath(c, x, y, s, o = {}) { // debout, de face ; (x, y) = les pieds
    const P = (u, v) => [x + u * s, y + v * s], pu = o.pull || 0;
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 15 * s; c.beginPath(); c.moveTo(...P(-9, -92)); c.lineTo(...P(-11, -4)); c.moveTo(...P(9, -92)); c.lineTo(...P(11, -4)); c.stroke();
    c.lineWidth = 9 * s; c.beginPath(); c.moveTo(...P(-12, -2)); c.lineTo(...P(-24, -1)); c.moveTo(...P(12, -2)); c.lineTo(...P(24, -1)); c.stroke();
    c.beginPath(); c.moveTo(...P(-23, -150)); c.lineTo(...P(23, -150)); c.lineTo(...P(20, -88)); c.lineTo(...P(-20, -88)); c.closePath(); c.fill();
    c.lineWidth = 10 * s; c.beginPath(); c.moveTo(...P(0, -150)); c.lineTo(...P(0, -160)); c.stroke();
    c.beginPath(); c.ellipse(...P(0, -172), 11.5 * s, 13.5 * s, 0, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(...P(0, -178), 12.5 * s, 9 * s, 0, Math.PI, 2 * Math.PI); c.fill();
    const hl = P(-31, -86 - 44 * pu), hr = P(31, -86 - 44 * pu), el = P(-31, -118 - 14 * pu), er = P(31, -118 - 14 * pu);
    c.lineWidth = 11 * s; c.beginPath(); c.moveTo(...P(-20, -146)); c.lineTo(...el); c.lineTo(...hl); c.moveTo(...P(20, -146)); c.lineTo(...er); c.lineTo(...hr); c.stroke();
    if (o.stamp) { c.beginPath(); c.arc(hr[0], hr[1] - 2 * s, 5 * s, 0, 6.283); c.fill(); c.fillRect(hr[0] - 2 * s, hr[1], 4 * s, 9 * s); c.fillRect(hr[0] - 8 * s, hr[1] + 9 * s, 16 * s, 5 * s); }
    return { hl, hr, head: P(0, -186) };
  }
  // ---------- objets communs : le vase (qui se fêle, puis se répare d'or) et la porte ----------
  const VASE = (() => { // profil du vase (demi-largeur selon la hauteur) et les fêlures
    const prof = [[0, 46], [.08, 58], [.2, 70], [.36, 104], [.55, 120], [.72, 108], [.86, 76], [.95, 50], [1, 44]];
    const r = rng(42), cracks = [];
    for (let k = 0; k < 6; k++) { let x = (r() - .5) * 120, y = .15 + r() * .7; const pts = [[x, y]]; for (let i = 0; i < 7; i++) { x += (r() - .5) * 46; y += (r() - .45) * .09; pts.push([x, y]); } cracks.push(pts); }
    return { prof, cracks };
  })();
  function vaseWidth(u) { const P = VASE.prof; for (let i = 1; i < P.length; i++) if (u <= P[i][0]) { const k = (u - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], (1 - Math.cos(Math.PI * k)) / 2); } return P[P.length - 1][1]; }
  function vasePath(c, x, y, h, s) { c.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; c.lineTo(x + vaseWidth(u) * s, y - u * h); } for (let i = 40; i >= 0; i--) { const u = i / 40; c.lineTo(x - vaseWidth(u) * s, y - u * h); } c.closePath(); }
  // vase(c, x, y, h, s, crack : 0→1 fêlures visibles, n : nombre de fêlures, glue : 0→1 recollées en gris, gold : 0→1 réparées d'or)
  function vase(c, x, y, h, s, o = {}) {
    c.save();
    c.fillStyle = 'rgba(60,44,30,.18)'; c.beginPath(); c.ellipse(x, y + 4, 120 * s, 18 * s, 0, 0, 6.283); c.fill();
    const g = c.createLinearGradient(x - 120 * s, 0, x + 120 * s, 0); g.addColorStop(0, '#9FB4AA'); g.addColorStop(.35, '#E6EFE9'); g.addColorStop(.6, '#C8D8CF'); g.addColorStop(1, '#7E958B');
    c.fillStyle = g; vasePath(c, x, y, h, s); c.fill();
    c.strokeStyle = 'rgba(40,60,52,.35)'; c.lineWidth = 2; c.stroke();
    c.save(); vasePath(c, x, y, h, s); c.clip();
    const n = o.n == null ? 3 : o.n;
    VASE.cracks.slice(0, n).forEach((pts, k) => {
      const P = pts.map(([px, pu]) => [x + px * s, y - pu * h]);
      if ((o.crack || 0) > 0) { c.strokeStyle = rgba('#2a1e18', .85 * (1 - (o.glue || 0) * .75) * (1 - (o.gold || 0))); c.lineWidth = 3 * s; c.lineJoin = 'round'; strokeProg(c, P, clamp((o.crack - k * .15) / .7)); }
      if ((o.gold || 0) > 0) { c.save(); c.strokeStyle = '#D9B25E'; c.lineWidth = 5 * s; c.shadowColor = 'rgba(255,214,130,.95)'; c.shadowBlur = 12; strokeProg(c, P, clamp((o.gold - k * .1) / .7)); c.restore(); }
    });
    c.restore(); c.restore();
  }
  // la porte dans un mur clair ; open : 0 fermée → 1 grande ouverte ; la lumière passe par l'ouverture
  function door(c, x, y, w, h, open, o = {}) {
    const gap = w * open;
    c.fillStyle = '#8A7A66'; c.fillRect(x - 14, y - h - 14, w + 28, h + 14);
    const lg = c.createLinearGradient(0, y - h, 0, y); lg.addColorStop(0, o.sky || '#FFF6E2'); lg.addColorStop(1, o.ground || '#FFE2B0'); c.fillStyle = lg; c.fillRect(x, y - h, w, h);
    if (o.scene) o.scene(c);
    // la lumière qui entre et s'étale au sol
    c.save(); c.globalCompositeOperation = 'screen'; c.filter = 'blur(10px)'; const fg = c.createLinearGradient(0, y, 0, y + 520); fg.addColorStop(0, rgba('#FFE7B8', .75 * Math.min(1, open * 1.6))); fg.addColorStop(1, 'rgba(255,231,184,0)');
    c.fillStyle = fg; c.beginPath(); c.moveTo(x + w - gap, y); c.lineTo(x + w, y); c.lineTo(x + w + 160 + 260 * open, y + 520); c.lineTo(x + w - gap - 220 - 300 * open, y + 520); c.closePath(); c.fill(); c.restore();
    // le battant (en perspective : il pivote sur sa gauche)
    const lw = w * (1 - open * .82);
    const dg = c.createLinearGradient(x, 0, x + lw, 0); dg.addColorStop(0, '#B79C78'); dg.addColorStop(1, '#9E8262'); c.fillStyle = dg;
    c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + lw, y - h + 30 * open); c.lineTo(x + lw, y - 10 * open); c.lineTo(x, y); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(70,50,30,.35)'; c.lineWidth = 3; c.strokeRect(x + lw * .15, y - h * .9, lw * .7, h * .36); c.strokeRect(x + lw * .15, y - h * .48, lw * .7, h * .38);
    c.fillStyle = '#5a4630'; c.beginPath(); c.arc(x + lw * .86, y - h * .5, 7, 0, 6.283); c.fill();
    if ((o.wedge || 0) > 0) { c.save(); c.globalAlpha = o.wedge; c.fillStyle = '#4a3a2c'; c.beginPath(); c.moveTo(x + lw - 6, y + 2); c.lineTo(x + lw + 70, y + 2); c.lineTo(x + lw - 6, y - 34); c.closePath(); c.fill(); c.restore(); }
  }

  // ---------- S1 : le livre dont on tourne la page ----------
  function drawReadingStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9DFCD'); g.addColorStop(.55, '#F5EEE2'); g.addColorStop(1, '#D9C9AE'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 160, 760, 700, '#FFF6E2', .9);
    c.fillStyle = '#B79A72'; c.fillRect(-LM, 1240, W + 2 * LM, 30);
    g = c.createLinearGradient(0, 1270, 0, H); g.addColorStop(0, '#A98A62'); g.addColorStop(1, '#8E7050'); c.fillStyle = g; c.fillRect(-LM, 1270, W + 2 * LM, H - 1270 + LM);
    c.save(); c.globalAlpha = .25; c.fillStyle = '#FFF4DC'; c.beginPath(); c.moveTo(-LM, 1270); c.lineTo(600, 1270); c.lineTo(400, H + LM); c.lineTo(-LM, H + LM); c.fill(); c.restore();
  }
  const READING = prerender(drawReadingStatic);
  const BK = { cx: 540, top: 1000, bot: 1270, half: 400 };
  function pageQuad(c, side, k, lift) { // k : 1 = à plat côté side ; la page pivote sur le dos du livre
    const ex = BK.cx + side * BK.half * k, ly = -lift;
    c.beginPath(); c.moveTo(BK.cx, BK.top + 14); c.quadraticCurveTo(BK.cx + side * BK.half * k * .5, BK.top - 16 + ly, ex, BK.top + 6 + ly * .6); c.lineTo(ex, BK.bot - 8 + ly * .6); c.quadraticCurveTo(BK.cx + side * BK.half * k * .5, BK.bot - 22 + ly, BK.cx, BK.bot - 4); c.closePath();
  }
  function textLines(c, side, a) { c.fillStyle = rgba('#5a4a3a', .28 * a); for (let i = 0; i < 9; i++) { const y = BK.top + 50 + i * 22; c.fillRect(BK.cx + side * 50 - (side < 0 ? 300 : 0), y, 300 - (i % 4) * 30, 6); } }
  function scene1(c, t) {
    const z = 1.04 + .05 * prog(t, 0, T.s2 + .5, 'inOutSine');
    camSafe(c, z, 540, 1080); blit(c, READING);
    c.fillStyle = '#6a4a30'; c.beginPath(); c.roundRect(BK.cx - BK.half - 16, BK.bot - 4, 2 * BK.half + 32, 22, 6); c.fill();
    c.fillStyle = '#F6EFE0'; pageQuad(c, -1, 1, 0); c.fill(); pageQuad(c, 1, 1, 0); c.fill();
    textLines(c, 1, 1);
    // la blessure : une tache et une fêlure d'encre sur la page de gauche
    const wa = prog(t, .2, 1.2, 'outCubic');
    c.save(); pageQuad(c, -1, 1, 0); c.clip(); textLines(c, -1, 1);
    c.fillStyle = rgba('#7A2A22', .75 * wa); c.beginPath(); c.ellipse(330, 1130, 54 * wa, 40 * wa, .3, 0, 6.283); c.fill();
    c.strokeStyle = rgba('#5a1e18', .8 * wa); c.lineWidth = 4; c.beginPath(); c.moveTo(250, 1060); c.lineTo(300, 1110); c.lineTo(285, 1150); c.lineTo(350, 1200); c.lineTo(330, 1240); c.stroke(); c.restore();
    // la page qui se tourne (sur « tourne la page »), puis la trace qui transparaît
    const fp = prog(t, T.tourne - .2, T.page + .7, 'inOutSine');
    if (fp > 0) {
      const k = Math.cos(Math.PI * fp), lift = 70 * Math.sin(Math.PI * fp), side = k >= 0 ? 1 : -1;
      c.fillStyle = mix('#F6EFE0', '#E2D6C0', Math.sin(Math.PI * fp) * .6); pageQuad(c, side, Math.abs(k), lift); c.fill();
      c.strokeStyle = 'rgba(90,70,50,.25)'; c.lineWidth = 2; c.stroke();
      if (fp >= 1) { c.save(); pageQuad(c, -1, 1, 0); c.clip(); textLines(c, -1, .8); c.fillStyle = rgba('#7A2A22', .22 + .06 * Math.sin(t * 2)); c.beginPath(); c.ellipse(330, 1130, 54, 40, .3, 0, 6.283); c.fill(); c.strokeStyle = 'rgba(90,30,24,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(250, 1060); c.lineTo(300, 1110); c.lineTo(285, 1150); c.lineTo(350, 1200); c.lineTo(330, 1240); c.stroke(); c.restore(); }
    }
    c.fillStyle = 'rgba(70,50,30,.3)'; c.fillRect(BK.cx - 2, BK.top + 10, 4, BK.bot - BK.top - 14);
    vignette(c, .2, '#5a4426');
  }

  // ---------- S2 : deux silhouettes séparées par la distance ----------
  function drawRoomStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E6E1D8'); g.addColorStop(.5, '#F6F3EE'); g.addColorStop(1, '#D6CCBC'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.fillStyle = '#FFFFFF'; c.fillRect(640, 640, 260, 560); glow(c, 770, 920, 420, '#FFFFFF', .8);
    c.fillStyle = '#C9BCA6'; c.fillRect(-LM, 1260, W + 2 * LM, H - 1260 + LM);
    c.strokeStyle = 'rgba(120,100,76,.22)'; c.lineWidth = 2; for (let k = -10; k <= 10; k++) { c.beginPath(); c.moveTo(540 + k * 30, 1260); c.lineTo(540 + k * 200, H + LM); c.stroke(); }
  }
  const ROOM = prerender(drawRoomStatic);
  function scene2(c, t) {
    const z = 1 + .06 * prog(t, T.s2 - .6, T.s3 + .6, 'inOutSine');
    camSafe(c, z, 540, 1180); blit(c, ROOM);
    // la longue table
    c.fillStyle = '#7A5E44'; c.beginPath(); c.moveTo(60, 1380); c.lineTo(980, 1300); c.lineTo(990, 1318); c.lineTo(70, 1404); c.closePath(); c.fill();
    c.fillRect(90, 1404, 14, 200); c.fillRect(950, 1318, 10, 120);
    // celui qui part, au fond, de dos : il s'éloigne
    const walk = prog(t, T.s2, T.s3 + .5, 'linear'), fx = 760 + 70 * walk;
    LIGHT(c, fx, 1120, 200, .55);
    sil(c, cc => standPath(cc, fx, 1262, 1.35 - .15 * walk, {}), RIM, 2);
    // celle qui a subi le mal, au premier plan : elle ferme le livre
    LIGHT(c, 250, 1300, 300, .5);
    sil(c, cc => { seatedPath(cc, 200, 1560, 1.25, .2); }, RIM, -3);
    const cl = prog(t, T.fermer - .2, T.livre + .4, 'inOutCubic');
    c.save(); c.translate(400, 1388); c.fillStyle = '#F4ECDC'; c.fillRect(-70, -8, 140, 10); c.fillStyle = '#6a3a2a'; c.save(); c.rotate(-Math.PI * (1 - cl) * .85); c.fillRect(0, -10, 72, 8); c.restore(); c.fillRect(-72, -10, 72, 8); c.restore();
    vignette(c, .16, '#5a5048');
  }

  // ---------- S3 : le vase qui se fêle (blesse, s'excuse, recommence) ----------
  function drawPlinthStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E8E4DC'); g.addColorStop(.5, '#F7F5F0'); g.addColorStop(1, '#DCD5C8'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 900, 560, '#FFFFFF', .9);
    c.fillStyle = '#EDE8DF'; c.fillRect(380, 1200, 320, 420); c.fillStyle = '#DDD6CA'; c.fillRect(360, 1186, 360, 22);
    c.fillStyle = 'rgba(120,110,96,.15)'; c.fillRect(-LM, 1620, W + 2 * LM, H);
  }
  const PLINTH = prerender(drawPlinthStatic);
  function scene3(c, t) {
    const z = 1.02 + .06 * prog(t, T.s3 - .6, T.s3b + .6, 'inOutSine');
    camSafe(c, z, 540, 1040); blit(c, PLINTH);
    const c1 = prog(t, T.blesse - .1, T.blesse + .6), g1 = prog(t, T.excuse - .1, T.excuse + .6), c2 = prog(t, T.recommence - .1, T.recommence + .7);
    vase(c, 540, 1186, 440, 1, { crack: c1 * (1 - g1 * .0) + c2 * .0, n: c2 > 0 ? 6 : 3, glue: g1 * (1 - c2) });
    if (c2 > 0) vase(c, 540, 1186, 440, 1, { crack: c2 * 1.2, n: 6 }); // tout recommence, en pire
    // le cercle : blesse → s'excuse → recommence
    const lab = [['blesse', T.blesse, -2.2], ['s’excuse', T.excuse, -.4], ['recommence', T.recommence, 1.3]];
    const ra = prog(t, T.recommence + .2, T.recommence + 1.2, 'inOutSine');
    c.save(); c.strokeStyle = rgba('#8A6A3A', .7); c.lineWidth = 4; c.setLineDash([10, 10]); c.beginPath(); c.arc(540, 960, 330, -2.4, -2.4 + 6.0 * ra); c.stroke(); c.restore();
    c.font = 'italic 400 52px Instrument'; c.textAlign = 'center';
    lab.forEach(([w, tw, a]) => { const p = prog(t, tw - .15, tw + .35, 'outCubic'); if (p <= 0) return; c.fillStyle = rgba('#5a3a20', p); c.fillText(w, 540 + Math.cos(a) * 360, 980 + Math.sin(a) * 300); });
    vignette(c, .14, '#5a5048');
  }
  // ---------- S3 bis : la porte entrouverte (liberté ou permission ?) ----------
  function drawWallLightStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#DED6C8'); g.addColorStop(.5, '#EFE9DF'); g.addColorStop(1, '#D3C7B3'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    g = c.createLinearGradient(0, 1400, 0, H); g.addColorStop(0, '#CDBFA8'); g.addColorStop(1, '#B9A88C'); c.fillStyle = g; c.fillRect(-LM, 1400, W + 2 * LM, H - 1400 + LM);
  }
  const WALLD = prerender(drawWallLightStatic);
  function scene3b(c, t) {
    const z = 1 + .06 * prog(t, T.s3b - .5, T.s4 + .5, 'inOutSine');
    camSafe(c, z, 540, 1120); blit(c, WALLD);
    const op = .12 + .5 * prog(t, T.liberte - .3, T.liberte + .6, 'outCubic'), wd = prog(t, T.permission - .3, T.permission + .3, 'outBack');
    door(c, 380, 1400, 320, 620, op, { wedge: wd });
    // sur « permission », une ombre passe dans la lumière
    const sp = prog(t, T.permission, T.permission + 1.4, 'inOutSine');
    if (sp > 0 && sp < 1) { c.save(); c.globalAlpha = .35 * Math.sin(Math.PI * sp); c.fillStyle = '#3a3040'; c.filter = 'blur(4px)'; c.translate(lerp(560, 860, sp), 1600); c.transform(1, 0, -.6, .35, 0, 0); standPath(c, 0, 0, 2.2, {}); c.restore(); }
    vignette(c, .16, '#5a4a36');
  }

  // ---------- S4 : Luc 17 — le chemin des trois pierres ----------
  function drawPathStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9E4D6'); g.addColorStop(.42, '#FBF6EA'); g.addColorStop(1, '#C9C0A6'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 860, 520, '#FFFFFF', .95);
    g = c.createLinearGradient(0, 940, 0, H); g.addColorStop(0, '#D8D2BC'); g.addColorStop(1, '#AFA78C'); c.fillStyle = g; c.beginPath(); c.moveTo(-LM, 940); c.lineTo(W + LM, 940); c.lineTo(W + LM, H + LM); c.lineTo(-LM, H + LM); c.fill();
    c.fillStyle = 'rgba(120,130,100,.22)'; for (let i = 0; i < 60; i++) { const r = rng(100 + i); const x = r() * W, y = 960 + r() * 900; c.fillRect(x, y, 3, 8 + (y - 940) * .02); }
  }
  const PATH = prerender(drawPathStatic);
  function scene4(c, t) {
    const z = 1 + .07 * prog(t, T.s4 - .6, T.s5 + .6, 'inOutSine');
    camSafe(c, z, 540, 1180); blit(c, PATH);
    const ST = [[540, 1620, 230, T.tort, 'reprendre'], [540, 1330, 165, T.repentir, 'se repentir'], [540, 1110, 115, T.pardon4, 'pardonner']];
    ST.forEach(([x, y, r, tw, lab], i) => {
      const p = prog(t, tw - .3, tw + .5, 'outCubic');
      c.fillStyle = 'rgba(60,50,30,.18)'; c.beginPath(); c.ellipse(x + 8, y + 10, r, r * .3, 0, 0, 6.283); c.fill();
      c.fillStyle = mix('#BDB5A2', '#F2E2B8', p); c.beginPath(); c.ellipse(x, y, r, r * .3, 0, 0, 6.283); c.fill();
      if (p > 0) glow(c, x, y - 10, r * 1.6, '#FFE3A0', .5 * p);
      c.font = `italic 400 ${Math.round(34 + r * .12)}px Instrument`; c.textAlign = 'center'; c.fillStyle = rgba('#5a4220', .35 + .65 * p); c.fillText(lab, x, y + r * .3 + 44);
    });
    vignette(c, .16, '#5a5038');
  }

  // ---------- S5 : Coran 42:40 — la cour, le carreau brisé et réparé ----------
  function drawCourtyardStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9DAC0'); g.addColorStop(1, '#DCC7A4'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    [[260, 1150], [820, 1150]].forEach(([x, y]) => { c.fillStyle = '#CDB48C'; archPath(c, x, y, 330, 560, true); c.fill(); g = c.createLinearGradient(0, y - 560, 0, y); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FFF0D2'); c.fillStyle = g; archPath(c, x, y - 10, 280, 520, true); c.fill(); });
    g = c.createLinearGradient(0, 1150, 0, H); g.addColorStop(0, '#E2CFAE'); g.addColorStop(1, '#C9B08A'); c.fillStyle = g; c.fillRect(-LM, 1150, W + 2 * LM, H - 1150 + LM);
    c.save(); c.translate(540, 1150); c.transform(1, 0, 0, .42, 0, 0); c.translate(-540, -1150); lattice(c, -100, 1150, 1300, 1800, 120, '#A8865A', 5, .7, 1); c.restore();
  }
  const COURT5 = prerender(drawCourtyardStatic);
  const TILE = { x: 540, y: 1480 };
  const TCRACK = [[[-80, -20], [-30, 0], [0, -12], [40, 10], [90, -4]], [[0, -12], [10, 30], [-6, 54]], [[-30, 0], [-50, 40]]];
  function scene5(c, t) {
    const z = 1.03 + .05 * prog(t, T.s5 - .6, T.s6 + .6, 'inOutSine');
    camSafe(c, z, 540, 1160); blit(c, COURT5);
    const pr_ = prog(t, T.proportionnee - .3, T.proportionnee + .5, 'outCubic');
    glow(c, 260, 900, 260, '#FFF6DC', .3 + .3 * pr_); glow(c, 820, 900, 260, '#FFF6DC', .3 + .3 * pr_);
    // le carreau brisé au centre de la cour, puis la réparation d'or
    c.save(); c.translate(TILE.x, TILE.y); c.transform(1, 0, 0, .42, 0, 0);
    c.fillStyle = '#EBDCC0'; c.beginPath(); c.moveTo(0, -150); c.lineTo(150, 0); c.lineTo(0, 150); c.lineTo(-150, 0); c.closePath(); c.fill(); c.strokeStyle = '#A8865A'; c.lineWidth = 6; c.stroke();
    star8(c, 0, 0, 90, 44); c.strokeStyle = '#B8965E'; c.lineWidth = 5; c.stroke();
    const rep = prog(t, T.reparation - .75, T.reparation + .15, 'inOutSine');
    TCRACK.forEach(pts => { const P = pts.map(([a, b]) => [a * 1.5, b * 2.6]); c.strokeStyle = rgba('#3a2a1a', .8 * (1 - rep)); c.lineWidth = 6; strokeProg(c, P, 1); c.save(); c.strokeStyle = '#E2B85E'; c.lineWidth = 9; c.shadowColor = 'rgba(255,214,130,1)'; c.shadowBlur = 16; strokeProg(c, P, rep); c.restore(); });
    c.restore();
    const pd = prog(t, T.pardon5 - .3, T.pardon5 + .6, 'outCubic'); if (pd > 0) glow(c, 540, 1480, 360, '#FFE8B0', .35 * pd + .2 * rep);
    vignette(c, .16, '#6a5030');
  }

  // ---------- S6 : Derrida — le bol brisé, puis réparé d'or (kintsugi) ----------
  const SHARDS = (() => { const r = rng(61), out = []; for (let k = 0; k < 9; k++) { const a0 = k / 9 * 6.283, a1 = (k + 1) / 9 * 6.283; out.push({ a0, a1, dx: (r() - .5) * 260, dy: -60 - r() * 200, rot: (r() - .5) * 1.4 }); } return out; })();
  function drawStudioStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E4DFD6'); g.addColorStop(.5, '#F6F3EE'); g.addColorStop(1, '#D9D1C3'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 1040, 600, '#FFFFFF', .95);
    c.fillStyle = 'rgba(120,108,92,.18)'; c.beginPath(); c.ellipse(540, 1330, 360, 60, 0, 0, 6.283); c.fill();
  }
  const STUDIO = prerender(drawStudioStatic);
  function bowlShard(c, s, k, gold) { // un morceau du bol (vu de trois quarts) entre deux angles
    const R = 230, Rh = 150;
    c.beginPath(); c.moveTo(0, 0);
    for (let i = 0; i <= 8; i++) { const a = lerp(s.a0, s.a1, i / 8); c.lineTo(Math.cos(a) * R, Math.sin(a) * Rh * .45 + (Math.sin(a) > 0 ? Rh * Math.sin(a) * .6 : 0)); }
    c.closePath();
    const g = c.createLinearGradient(-R, 0, R, 0); g.addColorStop(0, '#2E3A4A'); g.addColorStop(.5, '#4E6278'); g.addColorStop(1, '#26303C'); c.fillStyle = g; c.fill();
    if (gold > 0) { c.save(); c.strokeStyle = rgba('#E2B85E', gold); c.lineWidth = 5; c.shadowColor = 'rgba(255,214,130,.9)'; c.shadowBlur = 14 * gold; c.stroke(); c.restore(); }
  }
  function scene6(c, t) {
    const z = 1.02 + .06 * prog(t, T.s6 - .6, T.s7 + .6, 'inOutSine');
    camSafe(c, z, 540, 1080); blit(c, STUDIO);
    const br = prog(t, T.s6 + .2, T.paradoxe, 'outCubic'), rj = prog(t, T.q6 + .5, T.pardonner6 + .6, 'inOutCubic');
    const apart = br * (1 - rj), gold = prog(t, T.pardonner6 - .4, T.pardonner6 + .9, 'inOutSine');
    c.save(); c.translate(540, 1180);
    SHARDS.forEach((s, k) => { c.save(); c.translate(s.dx * apart, s.dy * apart); c.rotate(s.rot * apart); bowlShard(c, s, k, gold); c.restore(); });
    c.restore();
    if (gold > 0) glow(c, 540, 1160, 420, '#FFE2A0', .35 * gold);
    vignette(c, .14, '#5a5048');
  }

  // ---------- S7 : pardonner n'est pas… (quatre choses barrées) ----------
  function drawShelfStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E6DECF'); g.addColorStop(.5, '#F4EEE3'); g.addColorStop(1, '#DDD1BC'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 1130, 640, '#FFFFFF', .7);
    [[300, 960], [780, 960], [300, 1310], [780, 1310]].forEach(([x, y]) => { c.fillStyle = 'rgba(80,60,40,.12)'; c.fillRect(x - 150, y - 140, 312, 292); c.fillStyle = '#FBF8F2'; c.fillRect(x - 160, y - 150, 312, 292); c.strokeStyle = '#C8B48A'; c.lineWidth = 3; c.strokeRect(x - 160, y - 150, 312, 292); });
  }
  const SHELF = prerender(drawShelfStatic);
  function icon7(c, k, x, y) {
    c.save(); c.translate(x, y); c.fillStyle = '#3a3440'; c.strokeStyle = '#3a3440'; c.lineWidth = 8; c.lineCap = 'round'; c.lineJoin = 'round';
    if (k === 0) { c.beginPath(); c.roundRect(-80, -60, 160, 90, 26); c.fill(); c.beginPath(); c.moveTo(-30, 28); c.lineTo(-50, 64); c.lineTo(4, 30); c.fill(); c.fillStyle = '#FBF8F2'; c.font = 'italic 400 46px Instrument'; c.textAlign = 'center'; c.fillText('pardon…', 0, -4); }
    if (k === 1) { c.save(); c.rotate(-.35); c.fillStyle = '#E9A8A8'; c.fillRect(-70, -26, 100, 52); c.fillStyle = '#5a5a7a'; c.fillRect(30, -26, 40, 52); c.restore(); c.strokeStyle = 'rgba(58,52,64,.35)'; c.lineWidth = 6; c.beginPath(); c.moveTo(-90, 50); c.lineTo(90, 50); c.stroke(); }
    if (k === 2) { c.lineWidth = 12; c.beginPath(); c.arc(-40, 0, 34, 0, 6.283); c.stroke(); c.beginPath(); c.moveTo(-6, 0); c.lineTo(80, 0); c.moveTo(56, 0); c.lineTo(56, 24); c.moveTo(76, 0); c.lineTo(76, 18); c.stroke(); }
    if (k === 3) { c.lineWidth = 6; c.beginPath(); c.moveTo(0, -60); c.lineTo(0, 60); c.moveTo(-70, -40); c.lineTo(70, -40); c.moveTo(-40, 60); c.lineTo(40, 60); c.stroke(); [-70, 70].forEach(px => { c.beginPath(); c.moveTo(px, -40); c.lineTo(px - 30, 10); c.lineTo(px + 30, 10); c.closePath(); c.stroke(); }); }
    c.restore();
  }
  function scene7(c, t) {
    const z = 1.04 - .04 * prog(t, T.s7 - .6, T.s8 + .6, 'inOutSine');
    camSafe(c, z, 540, 1130); blit(c, SHELF);
    const CUES = [T.excuser, T.oublier, T.confiance, T.justice7], LAB = ['excuser', 'oublier', 'rendre sa confiance', 'renoncer à la justice'];
    [[300, 940], [780, 940], [300, 1290], [780, 1290]].forEach(([x, y], k) => {
      const p = prog(t, CUES[k] - .25, CUES[k] + .3, 'outCubic'), s = prog(t, CUES[k] + .15, CUES[k] + .6, 'inOutCubic');
      c.save(); c.globalAlpha = .35 + .65 * p; icon7(c, k, x, y - 10); c.restore();
      c.font = '600 28px Fraunces'; c.textAlign = 'center'; c.fillStyle = rgba('#5a4a34', .4 + .6 * p); c.fillText(LAB[k].toUpperCase(), x, y + 110);
      if (s > 0) { c.save(); c.strokeStyle = 'rgba(176,52,44,.85)'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 130, y + 120); c.lineTo(lerp(x - 130, x + 130, s), lerp(y + 120, y - 130, s)); c.stroke(); c.restore(); }
    });
    vignette(c, .16, '#5a4a36');
  }

  // ---------- S8 : la chaise vide ----------
  function drawChairRoomStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E2DBCF'); g.addColorStop(.5, '#F2EDE5'); g.addColorStop(1, '#D4C8B4'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    g = c.createLinearGradient(0, 1380, 0, H); g.addColorStop(0, '#D8CBB4'); g.addColorStop(1, '#BBA98C'); c.fillStyle = g; c.fillRect(-LM, 1380, W + 2 * LM, H - 1380 + LM);
  }
  const CHAIRROOM = prerender(drawChairRoomStatic);
  const DEM = [[120, .9], [300, 1.1], [800, 1.05], [960, .85], [200, .7], [880, .7]];
  function chair(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#6a4a32'; c.fillRect(-70, -40, 140, 18); c.fillRect(-64, -22, 12, 150); c.fillRect(52, -22, 12, 150); c.fillRect(-64, -260, 12, 230); c.fillRect(52, -260, 12, 230); c.fillRect(-64, -260, 128, 18); c.fillRect(-64, -190, 128, 12); c.restore(); }
  function scene8(c, t) {
    const z = 1 + .07 * prog(t, T.s8 - .6, T.s9 + .6, 'inOutSine');
    camSafe(c, z, 540, 1160); blit(c, CHAIRROOM);
    // les ombres qui exigent : des silhouettes projetées sur les murs, le bras tendu vers la chaise
    const ex = prog(t, T.exiger - .5, T.exiger + .5, 'outCubic') * (1 - prog(t, T.ton + .2, T.ton + 1.2, 'inOutSine'));
    DEM.forEach(([x, s], i) => { if (ex <= 0) return; c.save(); c.globalAlpha = .28 * ex; c.filter = 'blur(3px)'; c.fillStyle = c.strokeStyle = '#3a3346'; const p = standPath(c, x, 1380, 3.2 * s, { pull: .1 }); const dir = x < 540 ? 1 : -1; c.lineWidth = 11 * 3.2 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + dir * 20 * 3.2 * s, 1380 - 146 * 3.2 * s); c.lineTo(x + dir * 80 * 3.2 * s, 1380 - 150 * 3.2 * s); c.stroke(); c.restore(); });
    // le rai de lumière sur la chaise vide : c'est à toi de décider
    const lit = .45 + .55 * prog(t, T.ton - .2, T.ton + .8, 'outCubic');
    c.save(); c.globalCompositeOperation = 'screen'; c.filter = 'blur(16px)'; const g = c.createLinearGradient(540, 300, 540, 1500); g.addColorStop(0, rgba('#FFF4D8', .1)); g.addColorStop(1, rgba('#FFE8B8', .7 * lit)); c.fillStyle = g; c.beginPath(); c.moveTo(470, 260); c.lineTo(610, 260); c.lineTo(760, 1520); c.lineTo(320, 1520); c.closePath(); c.fill(); c.restore();
    c.fillStyle = 'rgba(60,44,30,.2)'; c.beginPath(); c.ellipse(560, 1500, 170, 26, 0, 0, 6.283); c.fill();
    chair(c, 540, 1380, 1.25);
    vignette(c, .18, '#5a4a36');
  }

  // ---------- S9 : la porte grande ouverte ----------
  function scene9(c, t) {
    const z = 1.06 - .1 * prog(t, T.s9 - .6, T.fin + .5, 'inOutSine');
    camSafe(c, z, 540, 1120); blit(c, WALLD);
    const op = .55 + .45 * prog(t, T.libre - .4, T.libre + .8, 'inOutSine');
    door(c, 380, 1400, 320, 620, op, { sky: '#FFF8EC', ground: '#FFD9A0', scene: cc => { glow(cc, 540, 1220, 320, '#FFFFFF', .9); cc.fillStyle = 'rgba(200,170,120,.35)'; cc.fillRect(380, 1280, 320, 120); } });
    // la silhouette qui passe le seuil, librement
    const wk = prog(t, T.s9 + .3, T.fin - .2, 'inOutSine');
    LIGHT(c, 560, 1180, 260, .6);
    sil(c, cc => standPath(cc, lerp(820, 600, wk), lerp(1560, 1420, wk), lerp(2.6, 1.9, wk), { walk: true }), RIM, 2, { alpha: 1 });
    vignette(c, .12, '#5a4a36');
  }

  /* ---------- transitions et rendu ---------- */
  const BA = off(W, H), bax = BA.getContext('2d'), BB = off(W, H), bbx = BB.getContext('2d');
  function paint(x, fn, t) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over'; fn(x, t); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over'; }
  const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  function drawScaled(c, img, sc, dx, dy, al) { c.save(); c.globalAlpha = al; c.translate(W / 2 + dx, H / 2 + dy); c.scale(sc, sc); c.drawImage(img, -W / 2, -H / 2); c.restore(); }
  const KINDS = {
    tilt(c, p, o) { const e = ease(p), d = o.dir || 1, m = sstep(.18, .82, p); drawScaled(c, BA, 1, 0, -d * 260 * e, 1); drawScaled(c, BB, 1, 0, d * 260 * (1 - e), m); },
    dissolve(c, p) { const e = ease(p), m = sstep(.15, .85, p); drawScaled(c, BA, 1 + .05 * e, 0, 0, 1); drawScaled(c, BB, 1.05 - .05 * e, 0, 0, m); },
    warm(c, p) { const e = ease(p), m = sstep(.2, .8, p); drawScaled(c, BA, 1 + .06 * e, 0, -30 * e, 1); drawScaled(c, BB, 1.06 - .06 * e, 0, 30 * (1 - e), m); glow(c, W / 2, H * .4, 1100, '#FFE2A8', .28 * Math.sin(p * Math.PI)); },
    drift(c, p) { const e = ease(p), m = sstep(.15, .85, p); drawScaled(c, BA, 1, -70 * e, 0, 1); drawScaled(c, BB, 1, 70 * (1 - e), 0, m); },
  };

  const SCN = [[-1, T.s2, scene1], [T.s2, T.s3, scene2], [T.s3, T.s3b, scene3], [T.s3b, T.s4, scene3b], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5],
    [T.s6, T.s7, scene6], [T.s7, T.s8, scene7], [T.s8, T.s9, scene8], [T.s9, DUR + 1, scene9]];
  const TRS = [
    { at: T.s2, d: 1.1, kind: 'warm', a: scene1, b: scene2 },
    { at: T.s3, d: 1.1, kind: 'drift', a: scene2, b: scene3 },
    { at: T.s3b, d: .9, kind: 'dissolve', a: scene3, b: scene3b },
    { at: T.s4, d: 1.1, kind: 'warm', a: scene3b, b: scene4 },
    { at: T.s5, d: 1.0, kind: 'drift', a: scene4, b: scene5 },
    { at: T.s6, d: 1.1, kind: 'tilt', a: scene5, b: scene6, o: { dir: 1 } },
    { at: T.s7, d: 1.0, kind: 'dissolve', a: scene6, b: scene7 },
    { at: T.s8, d: 1.1, kind: 'warm', a: scene7, b: scene8 },
    { at: T.s9, d: 1.0, kind: 'dissolve', a: scene8, b: scene9 },
  ];
  // voile discret derrière les textes du haut (décors clairs)
  const TV = [[-1, T.s2 - .2], [T.s2 - .2, T.fin]];
  const topVeil = t => Math.max(0, ...TV.map(([a, b]) => (a < 0 ? 1 : prog(t, a, a + .4)) * (1 - prog(t, b - .3, b + .2))));
  let COVER = false;
  function render(t) {
    const f = Math.round(t * 30);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    const tr = TRS.find(x => t >= x.at - x.d / 2 && t < x.at + x.d / 2);
    if (tr) { paint(bax, tr.a, t); paint(bbx, tr.b, t); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); KINDS[tr.kind](ctx, (t - tr.at + tr.d / 2) / tr.d, tr.o || {}); }
    else { const sc = SCN.filter(([a, b]) => t >= a && t < b).pop() || SCN[SCN.length - 1]; sc[2](ctx, t); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    const tv = topVeil(t) * (COVER ? 1.15 : 1);
    if (tv > 0) { const g = ctx.createLinearGradient(0, 210, 0, 780); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.22, rgba('#0a080c', .52 * tv)); g.addColorStop(.78, rgba('#0a080c', .52 * tv)); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 210, W, 570); }
    const sa = Math.max(subAlpha(chunkAt(t), t), tDq[0].style.opacity * 1 || 0); // voile discret derrière les sous-titres (et la citation de Derrida)
    if (sa > 0) { const g = ctx.createLinearGradient(0, 1230, 0, 1480); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.35, rgba('#0a080c', .34 * sa)); g.addColorStop(.7, rgba('#0a080c', .34 * sa)); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 1230, W, 250); }
    grain(ctx, f, .06);
    if (!COVER) { EH.bug(ctx, t, { out: T.fin - .35 }); EH.endCard(ctx, t, T.fin); } // habillage de la série
    texts(t); subs(t);
  }
  function revealWords(nodes, t, t0, out) { nodes.forEach(n => { n.style.opacity = out > 0 && t > t0 - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const st = +s.dataset.t, p = prog(t, st - .04, st + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * out, blur: (1 - p) * 6 }); }); }); }
  function texts(t) {
    const ko = 1 - prog(t, T.s2 - .5, T.s2 - .1, 'inCubic'), kz = prog(t, 0, 1.2, 'outCubic');
    tKick.forEach(n => set(n, { o: ko, s: 1.02 - .02 * kz, y: 0, blur: 0 }));
    revealWords(tQ2, t, T.q2, 1 - prog(t, T.s3 - .4, T.s3 - .1, 'inCubic'));
    revealWords(tQ3, t, T.q3, 1 - prog(t, T.s4 - .4, T.s4 - .1, 'inCubic'));
    const e4 = T.s5 - .35;
    fade(tLuc, t, T.luc - .2, e4, .5, 8, .3); tLucQ.forEach((n, k) => fade(n, t, T.tort - .6 + k * .45, e4, .6, 12, .3)); fade(tLucRef, t, T.pardon4, e4, .6, 6, .3);
    const e5 = T.s6 - .35;
    fade(tSur, t, T.coran - .2, e5, .5, 8, .3); fade(tSurAr, t, T.coran + .1, e5, .6, 8, .3);
    tSurQ.forEach((n, k) => fade(n, t, T.pardon5 - .5 + k * .4, e5, .6, 12, .3)); fade(tSurRef, t, T.reparation, e5, .6, 6, .3);
    const e6 = T.q6 - .2;
    slam(tDer, t, T.derrida - .1, e6, .3); fade(tDerSub, t, T.derrida + .4, e6, .6, 8, .3); slam(tPar, t, T.paradoxe - .15, e6, .3);
    revealWords(tQ6, t, T.q6, 1 - prog(t, T.s7 - .4, T.s7 - .1, 'inCubic'));
    tDq.forEach((n, k) => fade(n, t, T.q6 + .5 + k * .3, T.s7 - .35, .6, 8, .3));
    revealWords(tQ7, t, T.q7, 1 - prog(t, T.s8 - .4, T.s8 - .1, 'inCubic')); fade(tSep, t, T.excuser, T.s8 - .35, .6, 4, .3);
    revealWords(tQ8, t, T.q8, 1 - prog(t, T.s9 - .4, T.s9 - .1, 'inCubic'));
    revealWords(tQ9, t, T.q9, 1 - prog(t, T.fin - .45, T.fin - .1, 'inCubic'));
  }

  /* ---------- événements sonores (la musique de fond est continue) ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7], ['s8', T.s8], ['s9', T.s9]].forEach(([n, x]) => sfx('sec_' + n, x));
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('signature', 0); sfx('signature', T.fin); sfx('reveal', T.fin);
  sfx('room', 0, { d: T.s2 + .5 }); sfx('page', T.tourne - .1);
  for (let x = T.s2 + .2; x < T.s3 - .2; x += .55) sfx('step', x); sfx('stamp', T.livre, { g: .45 }); sfx('question', T.q2);
  sfx('crack', T.blesse); sfx('glow', T.excuse); sfx('crack', T.recommence);
  sfx('door', T.liberte - .3, { d: 1.2 }); sfx('stamp', T.permission, { g: .6 }); sfx('question', T.q3);
  [T.tort, T.repentir, T.pardon4].forEach(x => sfx('glow', x));
  sfx('glow', T.proportionnee); sfx('gold', T.reparation - .2);
  sfx('shatter', T.s6 + .2); sfx('gold', T.pardonner6 - .3); sfx('question', T.q6);
  [T.excuser, T.oublier, T.confiance, T.justice7].forEach(x => sfx('draw', x + .15, { d: .45 }));
  sfx('tension', T.exiger - .5, { d: 1.5 }); sfx('glow', T.ton); sfx('question', T.q8);
  sfx('door', T.libre - .4, { d: 1.4 }); sfx('wind', T.s9, { d: DUR - T.s9 - .5 }); sfx('question', T.q9);

  window.DURATION = DUR; window.__T = T;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : le livre et la blessure, la question de l'épisode, le logo et le nom
    COVER = true; render(1.6); COVER = false;
    tKick.forEach(n => { set(n, { o: 1, s: 1, y: 150, blur: 0 }); });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createLinearGradient(0, 230, 0, 860); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.2, 'rgba(10,8,12,.5)'); g.addColorStop(.8, 'rgba(10,8,12,.5)'); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 230, W, 630);
    EH.icon(ctx, 382, 340, 46); EH.wordmark(ctx, 446, 356, .48, { align: 'left', motto: false });
    SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
