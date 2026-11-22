/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 006 — « La mort donne-t-elle du prix à la vie ? »
   Style validé (ép. 004 v2) : explication continue, une seule musique de fond, fondus enchaînés en mouvement.
   Décors nouveaux : le livre sans dernière page, le sablier, la roue des saisons (Ecclésiaste 3),
   les ruines dans le désert (Coran 3:185), l'atrium de Sénèque et le sablier fêlé, l'allée du vieux cimetière,
   la colline au couchant, la dernière page.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, makeDust, dust, personPath, lattice, archPath, star8, khatam, bust, rng, off } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', bord: '#541D2A', rose: '#E8949A', lamp: '#F2C27D', sand: '#E6B877', ink: '#2a1d12' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 500 40px Fraunces', 'italic 600 40px Fraunces', 'italic 700 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument', '500 40px Garamond'].map(f => document.fonts.load(f, 'Aaé')));
  await document.fonts.load('400 40px Amiri', 'آل عمران');

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    imagine: cue('s1a', 'imagine'), page: cue('s1a', 'page'), urgent: cue('s1b', 'urgent'), s1b: SEN('s1b').start, depart: cue('s1c', 'depart'), s1c: SEN('s1c').start, definitif: cue('s1c', 'definitif'),
    rencontre: cue('s1d', 'rencontre'), s1d: SEN('s1d').start, irremplacable: cue('s1d', 'irremplacable'),
    s2: SEN('s2a').start - .3, question2: cue('s2a', 'question'), mort2: cue('s2b', 'mort'), valeur: cue('s2b', 'valeur'), vie2: cue('s2b', 'vie'), q2: SEN('s2b').start, q2End: SEN('s2b').end,
    s3: SEN('s3a').start - .3, ecclesiaste: cue('s3a', 'ecclesiaste'), moment: cue('s3b', 'moment'), naitre: cue('s3b', 'naitre'), mourir: cue('s3b', 'mourir'), construire: cue('s3b', 'construire'), detruire: cue('s3b', 'detruire'), saisons: cue('s3c', 'saisons'), reviennent: cue('s3c', 'reviennent'),
    s4: SEN('s4a').start - .3, coran: cue('s4a', 'coran'), sourate: cue('s4a', 'sourate'), ame: cue('s4b', 'ame'), mort4: cue('s4b', 'mort'), richesse: cue('s4c', 'richesse'), pouvoir: cue('s4c', 'pouvoir'), orgueil: cue('s4c', 'orgueil'), place: cue('s4c', 'place'),
    s5: SEN('s5a').start - .3, seneque: cue('s5a', 'seneque'), brievete: cue('s5a', 'brievete'), troublante: cue('s5a', 'troublante'), courte: cue('s5b', 'courte'), s5b: SEN('s5b').start, gaspillons: cue('s5c', 'gaspillons'), partie: cue('s5c', 'partie'),
    s6: SEN('s6a').start - .3, automatiquement: cue('s6a', 'automatiquement'), heureuse: cue('s6a', 'heureuse'), juste6: cue('s6a', 'juste'),
    s7: SEN('s7a').start - .3, profonde: cue('s7a', 'profonde'), q7: SEN('s7b').start, limite: cue('s7b', 'limite'), irreversible: cue('s7b', 'irreversible'), merite: cue('s7b', 'merite'), vie7: cue('s7b', 'vie'), q7End: SEN('s7b').end,
    s8: SEN('s8a').start - .35, q8: SEN('s8a').start, mourir8: cue('s8a', 'mourir'), compris: cue('s8b', 'compris'), vecu: cue('s8b', 'vecu'), qEnd: SEN('s8b').end,
  };
  T.title = T.qEnd + .55;

  /* ---------- texte (DOM) ---------- */
  const tx = (html, cls, style) => el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
  function fit(n, maxW) { const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block'; let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; } n.style.width = w; n.style.display = d; return n; }
  function slam(n, t, t0, t1, out = .3) { const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 }); }
  function wipe(n, t, t0, t1, dur = .7, out = .45) { const p = prog(t, t0, t0 + dur, 'outQuart'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); n.style.clipPath = `inset(-20% ${(100 - p * 100).toFixed(2)}% -20% 0)`; set(n, { x: (1 - p) * 18, o: o * (p > 0 ? 1 : 0) }); }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) { const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 }); }
  const grad = (a, b, c) => `background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(0,0,0,.6))`;
  const gspan = (txt, a, b, c, pad = '6px .08em 4px') => `<span style="display:inline-block;padding:${pad};${grad(a, b, c)}">${txt}</span>`;
  const CENTER = { left: '0', width: '1080px', textAlign: 'center' };
  const ROSE = ['#FFF4F2', '#F6C9C6', '#E8949A'], GOLD = ['#FFFFFF', '#F3E6CC', C.gold], SAND = ['#FFFFFF', '#F6E2BC', '#E6B877'];
  const small = (txt, top, col = 'rgba(242,239,232,.85)') => tx(txt, 'fraunces', Object.assign({ top: top + 'px', fontWeight: 600, fontSize: '32px', letterSpacing: '.22em', paddingLeft: '.22em', color: col }, CENTER));
  const ital = (txt, top, fs, col = C.ivory) => { const n = tx(txt, 'instrument', Object.assign({ top: top + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col }, CENTER)); fit(n, 1000); return n; };
  const big = (txt, top, fs, pal = GOLD) => fit(tx(gspan(txt, ...pal, '10px .06em 4px'), 'bodoni', Object.assign({ top: top + 'px', fontWeight: 900, fontSize: fs + 'px', textShadow: 'none' }, CENTER)), 1010);

  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;006</div>`, '', Object.assign({ top: '150px', textShadow: 'none' }, CENTER));
  // S1 — le livre sans dernière page
  const tExA = small('UNE EXISTENCE', 372);
  const tExB = big('SANS DERNIÈRE PAGE', 424, 96, SAND);
  const tU = ital('plus rien d’urgent', 250, 66, C.lamp), tD = ital('aucun départ définitif', 250, 66, C.lamp), tR = ital('aucune rencontre irremplaçable', 250, 62, C.lamp);
  // S2 — la question, le sablier
  const tQs = small('UNE QUESTION SURGIT', 196, C.rose);
  const tQ2a = ital('Est-ce la mort', 268, 92);
  const tQ2b = big('QUI DONNE SA VALEUR', 376, 84, GOLD);
  const tQ2c = ital('à la vie&#8239;?', 480, 104, C.rose);
  // S3 — Ecclésiaste 3
  const tEc = small('ECCLÉSIASTE 3', 176);
  const tEcQ = ital('«&#8239;Il y a un temps pour tout,', 232, 58), tEcQ2 = ital('un temps pour toute chose sous les cieux&#8239;»', 300, 58);
  const tLSG = tx('trad. Louis Segond, 1910', 'fraunces', Object.assign({ top: '378px', fontWeight: 500, fontSize: '23px', letterSpacing: '.08em', color: 'rgba(242,239,232,.75)' }, CENTER));
  const tSai = ital('des saisons qui ne reviennent pas toujours', 430, 54, C.rose);
  // S4 — Coran 3:185
  const tSour = small('SOURATE ÂL ‘IMRÂN', 168, C.ivory);
  const tAr = tx('آل عمران', 'amiri', Object.assign({ top: '206px', fontSize: '116px', color: '#F3D9A0', direction: 'rtl' }, CENTER));
  const tVers = tx('3 : 185', 'fraunces', Object.assign({ top: '398px', fontWeight: 600, fontSize: '36px', letterSpacing: '.2em', paddingLeft: '.2em', color: C.rose }, CENTER));
  const tAme = big('«&#8239;TOUTE ÂME GOÛTERA LA MORT&#8239;»', 466, 64, SAND);
  const tHam = tx('trad. M. Hamidullah', 'fraunces', Object.assign({ top: '560px', fontWeight: 500, fontSize: '23px', letterSpacing: '.08em', color: 'rgba(242,239,232,.75)' }, CENTER));
  const tJp = ital('à leur juste place', 616, 60, C.rose);
  // S5 — Sénèque
  const tSen = big('SÉNÈQUE', 160, 96, GOLD);
  const tSenSub = tx('v. 1 av. J.-C. – 65 apr. J.-C. · <i>De la brièveté de la vie</i>', 'fraunces', Object.assign({ top: '278px', fontWeight: 500, fontSize: '29px', color: 'rgba(242,239,232,.86)' }, CENTER)); fit(tSenSub, 1000);
  const tLat = tx('«&#8239;Non exiguum temporis habemus, sed multum perdidimus.&#8239;»', 'garamond', Object.assign({ top: '352px', fontWeight: 500, fontStyle: 'italic', fontSize: '44px', color: C.lamp }, CENTER)); fit(tLat, 1000);
  const tLatRef = tx('<i>De brevitate vitae</i>, I, 3', 'fraunces', Object.assign({ top: '414px', fontWeight: 500, fontSize: '23px', color: 'rgba(242,239,232,.7)' }, CENTER));
  const tLatFr = ital('Nous n’avons pas peu de temps : nous en perdons beaucoup.', 456, 50);
  const tLatFr2 = tx('traduction libre', 'fraunces', Object.assign({ top: '522px', fontWeight: 500, fontSize: '21px', color: 'rgba(242,239,232,.6)' }, CENTER));
  // S6 — la nuance
  const tN1 = ital('Mais la mort ne rend pas automatiquement', 300, 60);
  const tN2 = big('UNE EXISTENCE', 380, 92, GOLD);
  const tN3 = ital('heureuse ou juste', 486, 86, C.rose);
  // S7 — la question plus profonde
  const tP = small('UNE QUESTION PLUS PROFONDE', 196, C.rose);
  const tLim = big('LIMITÉ · IRRÉVERSIBLE', 252, 74, SAND);
  const Q7 = [[['qu’est-ce', 'qui', 'mérite', 'réellement'], 70, 360, C.ivory, ['qu', 'est', 'ce', 'qui', 'merite', 'reellement']], [['que', 'nous', 'lui', 'consacrions'], 70, 446, C.ivory, ['que', 'nous', 'lui', 'consacrions']], [['notre', 'vie&#8239;?'], 104, 528, C.rose, ['notre', 'vie']]];
  // S8 — la dernière page
  const Q8 = [[['Peut-être', 'que', 'le', 'véritable', 'drame'], 66, 300, C.ivory], [['n’est', 'pas', 'de', 'mourir', 'un', 'jour…'], 66, 384, C.ivory], [['mais', 'de', 'ne', 'jamais', 'avoir', 'compris'], 70, 498, C.rose], [['pourquoi', 'nous', 'avons', 'vécu.'], 92, 588, C.rose]];
  function wordLines(lines, sids) {
    const words = sids.flatMap(id => SEN(id).words); let wi = 0;
    return lines.map(([ws, fs, y, col, keys]) => tx(ws.map(w => { // associe chaque mot affiché au(x) mot(s) prononcé(s)
      const k = (w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']); const idx = wi; wi += k.length;
      return `<span class="qw" data-i="${Math.min(idx, words.length - 1)}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)));
  }
  const s7bW = SEN('s7b').words, offQ7 = s7bW.findIndex(w => w.w === 'qu');
  const tQ7 = (() => { const words = s7bW.slice(offQ7); let wi = 0; return Q7.map(([ws, fs, y, col]) => tx(ws.map(w => { const k = (w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']); const idx = wi; wi += k.length; return `<span class="qw" data-t="${words[Math.min(idx, words.length - 1)].start}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER))); })();
  const tQ8 = (() => { const words = ['s8a', 's8b'].flatMap(id => SEN(id).words); let wi = 0; return Q8.map(([ws, fs, y, col]) => tx(ws.map(w => { const k = (w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']); const idx = wi; wi += k.length; return `<span class="qw" data-t="${words[Math.min(idx, words.length - 1)].start}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER))); })();
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', Object.assign({ top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }, CENTER));
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', Object.assign({ top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose }, CENTER));
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', Object.assign({ top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' }, CENTER));

  /* ---------- sous-titres ---------- */
  const NOSUB = new Set(['s2b', 's7b', 's8a', 's8b']);
  const CHUNKS = TL.sentences.flatMap(s => s.chunks.map(c => Object.assign(c, { sid: s.id })));
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.show = Math.min(c.end + .3, nx ? nx.start - .02 : c.end + .6); });
  function subs(t) {
    const c = CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
    if (!c || NOSUB.has(c.sid)) { SUBS.style.opacity = 0; return; }
    if (SUBS.dataset.k !== c.text) { SUBS.textContent = c.text; SUBS.dataset.k = c.text; }
    SUBS.style.opacity = (prog(t, c.start - .03, c.start + .06, 'linear') * (1 - prog(t, c.show - .08, c.show, 'linear'))).toFixed(3);
  }

  /* ---------- outils ---------- */
  const cam = (c, z, fx, fy) => c.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 - fy * z);
  const LM = 140;
  const camSafe = (c, z, fx, fy) => { const hw = W / 2 / z, hh = H / 2 / z; cam(c, z, clamp(fx, hw - LM, W - hw + LM), clamp(fy, hh - LM, H - hh + LM)); };
  function prerender(fn, ss = 1.3) { const o = off(Math.round((W + 2 * LM) * ss), Math.round((H + 2 * LM) * ss)), c = o.getContext('2d'); c.setTransform(ss, 0, 0, ss, LM * ss, LM * ss); fn(c); return o; }
  const blit = (c, o) => c.drawImage(o, -LM, -LM, W + 2 * LM, H + 2 * LM);
  const topShade = (c, col, a, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, rgba(col, a)); g.addColorStop(.7, rgba(col, a * .55)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, W, h); };
  const flash = (c, col, a) => { if (a > 0) { c.fillStyle = rgba(col, Math.min(1, a)); c.fillRect(0, 0, W, H); } };
  const quad = (c, q) => { c.beginPath(); c.moveTo(...q[0]); c.lineTo(...q[1]); c.lineTo(...q[2]); c.lineTo(...q[3]); c.closePath(); };
  const _a = off(W, H), _ax = _a.getContext('2d'), _b = off(W, H), _bx = _b.getContext('2d');
  function rimmed(c, fn, o) {
    _ax.setTransform(1, 0, 0, 1, 0, 0); _ax.clearRect(0, 0, W, H); _ax.fillStyle = _ax.strokeStyle = o.body; fn(_ax);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over'; _bx.clearRect(0, 0, W, H); _bx.fillStyle = _bx.strokeStyle = o.rim; fn(_bx);
    _bx.globalCompositeOperation = 'destination-out'; _bx.setTransform(1, 0, 0, 1, -o.dx, -(o.dy || 0)); _bx.fillStyle = _bx.strokeStyle = '#000'; fn(_bx);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over';
    c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; c.drawImage(_a, 0, 0); c.globalAlpha *= o.rimA; c.drawImage(_b, 0, 0); c.restore();
  }
  function strokeProg(c, pts, p) {
    let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = tot * clamp(p); c.beginPath(); c.moveTo(...pts[0]);
    for (let i = 1; i < pts.length && left > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), k = Math.min(1, left / d); c.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); left -= d; }
    c.stroke();
  }
  const person = (c, p, rim, dx) => rimmed(c, cc => personPath(cc, p), { body: '#06070a', rim, rimA: .85, dx, alpha: p.alpha == null ? 1 : p.alpha });

  /* =====================================================================
     DÉCOR 1 & 8 — LE LIVRE SANS DERNIÈRE PAGE
     ===================================================================== */
  const GUT = 540, PT = 760, PB = 1330, PW = 420;
  const LPq = [[GUT - PW + 20, PT - 30], [GUT, PT], [GUT, PB], [GUT - PW, PB - 20]], RPq = [[GUT, PT], [GUT + PW - 20, PT - 30], [GUT + PW, PB - 20], [GUT, PB]];
  function drawDesk(c, t, warm) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, mix('#070910', '#14100c', warm)); g.addColorStop(.6, mix('#0d1018', '#2a1e14', warm)); g.addColorStop(1, '#07060a'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 860, 620, 520, C.lamp, .25 + .25 * warm); // la lampe
    c.fillStyle = mix('#140e0a', '#2a1c12', warm); c.fillRect(-LM, 1260, W + 2 * LM, H); // le bureau
  }
  function pageShape(c, q) { c.beginPath(); c.moveTo(...q[0]); c.quadraticCurveTo((q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2 - 10, ...q[1]); c.lineTo(...q[2]); c.quadraticCurveTo((q[2][0] + q[3][0]) / 2, (q[2][1] + q[3][1]) / 2 + 8, ...q[3]); c.closePath(); }
  function drawBookBase(c, stackL, stackR) {
    c.fillStyle = 'rgba(0,0,0,.55)'; c.save(); c.filter = 'blur(24px)'; c.fillRect(GUT - PW - 20, PT + 40, PW * 2 + 40, PB - PT); c.restore();
    c.fillStyle = '#3a1612'; pageShape(c, [[GUT - PW - 10, PT - 44], [GUT + PW + 10, PT - 44], [GUT + PW + 26, PB + 12], [GUT - PW - 26, PB + 12]]); c.fill();
    for (let k = Math.round(stackL); k > 0; k--) { c.fillStyle = mix('#b89a6a', '#e9d8b4', k / 8); pageShape(c, LPq.map(([x, y], i) => [x - (i === 0 || i === 3 ? k * 1.6 : 0), y + k * 2])); c.fill(); }
    for (let k = Math.round(stackR); k > 0; k--) { c.fillStyle = mix('#b89a6a', '#e9d8b4', k / 8); pageShape(c, RPq.map(([x, y], i) => [x + (i === 1 || i === 2 ? k * 1.6 : 0), y + k * 2])); c.fill(); }
    for (const [q, dir] of [[LPq, 1], [RPq, -1]]) { pageShape(c, q); const g = c.createLinearGradient(dir > 0 ? GUT - PW : GUT + PW, 0, GUT, 0); g.addColorStop(0, '#F2E6CC'); g.addColorStop(.8, '#E9DAB8'); g.addColorStop(1, '#BBA27A'); c.fillStyle = g; c.fill(); }
  }
  function flipPage(c, th, shade) { // une page qui tourne autour de la reliure (th : 0 à droite → π à gauche)
    const cs = Math.cos(th), sn = Math.sin(th), ox = GUT + cs * PW, lift = sn * 150;
    c.beginPath(); c.moveTo(GUT, PT); c.quadraticCurveTo(GUT + cs * PW * .5, PT - 20 - lift, ox, PT - 30 - lift * .9); c.lineTo(ox + cs * 10, PB - 20 - lift * .6); c.quadraticCurveTo(GUT + cs * PW * .5, PB + 6 - lift * .5, GUT, PB); c.closePath();
    const g = c.createLinearGradient(GUT, 0, ox, 0); g.addColorStop(0, mix('#BBA27A', '#E9DAB8', .4)); g.addColorStop(1, mix('#F2E6CC', '#8a7656', shade * Math.abs(cs) * .0 + (1 - Math.abs(cs)) * .45)); c.fillStyle = g; c.fill();
    c.strokeStyle = 'rgba(90,70,40,.35)'; c.lineWidth = 1.5; c.stroke();
  }
  function inkClock(c, x, y, r, p, t) { c.save(); c.globalAlpha = p; c.strokeStyle = C.ink; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r, 0, 6.283 * p); c.stroke();
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; c.beginPath(); c.moveTo(x + Math.cos(a) * r * .85, y + Math.sin(a) * r * .85); c.lineTo(x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95); c.stroke(); }
    c.lineWidth = 4; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(-1.3) * r * .5, y + Math.sin(-1.3) * r * .5); c.stroke(); c.lineWidth = 2.5; const a = t * .3 - 1.57; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78); c.stroke();
    c.font = 'italic 400 30px Instrument'; c.fillStyle = C.ink; c.textAlign = 'center'; c.fillText('∞', x, y + r + 44); c.restore(); }
  function inkBoat(c, x, y, p, t) { c.save(); c.globalAlpha = Math.min(1, p * 2); c.strokeStyle = C.ink; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath(); for (let k = 0; k <= 30; k++) { const xx = x - 150 + k * 10; c[k ? 'lineTo' : 'moveTo'](xx, y + 30 + Math.sin(k * .8 + t * 2) * 4); } c.stroke();
    const bx = x - 60 + Math.sin(t * 1.4) * 70; // le bateau part… et revient
    c.beginPath(); c.moveTo(bx - 40, y + 10); c.lineTo(bx + 40, y + 10); c.lineTo(bx + 26, y + 26); c.lineTo(bx - 26, y + 26); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(bx, y + 10); c.lineTo(bx, y - 60); c.lineTo(bx + 34, y); c.closePath(); c.stroke();
    c.setLineDash([6, 8]); c.beginPath(); c.arc(x, y + 80, 80, Math.PI * .1, Math.PI * .9); c.stroke(); c.restore(); }
  function inkMeet(c, x, y, p, mult) { c.save(); c.globalAlpha = Math.min(1, p * 2); c.fillStyle = C.ink; c.strokeStyle = C.ink;
    const fig = (fx, fy, s) => { c.beginPath(); c.arc(fx, fy - 46 * s, 9 * s, 0, 6.283); c.fill(); c.lineWidth = 6 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(fx, fy - 36 * s); c.lineTo(fx, fy - 12 * s); c.moveTo(fx, fy - 12 * s); c.lineTo(fx - 7 * s, fy + 6 * s); c.moveTo(fx, fy - 12 * s); c.lineTo(fx + 7 * s, fy + 6 * s); c.stroke(); };
    fig(x - 30, y, 1.2); fig(x + 30, y, 1.2);
    if (mult > 0) for (let k = 0; k < Math.round(mult * 14); k++) { const cx = x - 160 + (k % 7) * 52, cy = y - 150 + Math.floor(k / 7) * 70; c.globalAlpha = .45; fig(cx - 10, cy, .55); fig(cx + 10, cy, .55); }
    c.restore(); }
  function scene1(c, t) {
    const z = lerp(1.08, 1.0, prog(t, .3, T.urgent, 'inOutSine'));
    camSafe(c, z, 540, lerp(1090, 1040, prog(t, .3, T.urgent, 'inOutSine')));
    drawDesk(c, t, .6);
    drawBookBase(c, 6, 7);
    // le contenu de la page de droite (une esquisse par phrase)
    c.save(); pageShape(c, RPq); c.clip();
    const pu = prog(t, T.s1b - .1, T.s1b + .9, 'outCubic') * (1 - prog(t, T.s1c - .3, T.s1c, 'linear')), pd = prog(t, T.s1c, T.s1c + .9, 'outCubic') * (1 - prog(t, T.s1d - .3, T.s1d, 'linear')), pr = prog(t, T.s1d, T.s1d + .9, 'outCubic');
    if (pu > 0) inkClock(c, 760, 980, 110, pu, t);
    if (pd > 0) inkBoat(c, 760, 1030, pd, t);
    if (pr > 0) inkMeet(c, 760, 1180, pr, prog(t, T.irremplacable - .3, T.irremplacable + .8, 'inOutSine'));
    c.restore();
    // les pages qui tournent, sans fin (très vite au début, puis à chaque phrase)
    const fast = 1 - prog(t, T.page + .3, T.s1b, 'linear');
    for (let k = 0; k < 4; k++) { const ph = ((t * (1.6 * fast + .05) + k * .25) % 1); if (fast > .02) flipPage(c, ph * Math.PI, 1); }
    for (const t0 of [T.s1b, T.s1c, T.s1d]) { const p = prog(t, t0 - .45, t0 + .1, 'inOutCubic'); if (p > 0 && p < 1) flipPage(c, p * Math.PI, 1); }
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#06070c', .55, 760);
    vignette(c, .55, '#020308');
    flash(c, '#000000', 1 - prog(t, 0, .7, 'outCubic'));
  }
  function scene8(c, t) {
    camSafe(c, lerp(1.02, 1.12, prog(t, T.s8, T.title, 'inOutSine')), 540, lerp(1040, 1060, prog(t, T.s8, T.title, 'inOutSine')));
    const last = prog(t, T.compris - .4, T.vecu + .3, 'inOutSine');
    drawDesk(c, t, .6 + .4 * last);
    drawBookBase(c, lerp(6, 12, last), lerp(5, 0, last));
    // les dernières pages tournent, plus lentement… puis la dernière
    for (let k = 0; k < 3; k++) { const t0 = T.s8 + .3 + k * 1.1, p = prog(t, t0, t0 + .9, 'inOutCubic'); if (p > 0 && p < 1) flipPage(c, p * Math.PI, 1); }
    const p = prog(t, T.compris - .5, T.compris + .5, 'inOutCubic'); if (p > 0 && p < 1) flipPage(c, p * Math.PI, 1);
    if (last > 0) { c.save(); pageShape(c, RPq); c.clip(); glow(c, 760, 1040, 380, '#FFF2D0', .6 * last); c.strokeStyle = rgba('#C08A3A', .9 * last); c.lineWidth = 3; c.lineCap = 'round'; strokeProg(c, [[620, 1060], [700, 1050], [780, 1064], [880, 1052]], prog(t, T.vecu - .2, T.title, 'inOutSine')); c.restore(); }
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#06070c', .6, 820);
    c.fillStyle = rgba('#05060a', .5 * prog(t, T.qEnd, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .55, '#020308');
  }

  /* =====================================================================
     DÉCOR 2 — LE SABLIER
     ===================================================================== */
  const HG = { x: 540, top: 820, bot: 1640, w: 190 };
  const grains = (() => { const r = rng(21); return Array.from({ length: 80 }, () => ({ ph: r(), dx: (r() - .5) * 6, s: 1 + r() * 2 })); })();
  function bulbPath(c, upper) { const { x, top, bot, w } = HG, mid = (top + bot) / 2; c.beginPath();
    if (upper) { c.moveTo(x - w, top + 30); c.bezierCurveTo(x - w, mid - 140, x - 18, mid - 60, x - 8, mid); c.lineTo(x + 8, mid); c.bezierCurveTo(x + 18, mid - 60, x + w, mid - 140, x + w, top + 30); c.closePath(); }
    else { c.moveTo(x - w, bot - 30); c.bezierCurveTo(x - w, mid + 140, x - 18, mid + 60, x - 8, mid); c.lineTo(x + 8, mid); c.bezierCurveTo(x + 18, mid + 60, x + w, mid + 140, x + w, bot - 30); c.closePath(); } }
  function hourglass(c, t, fill, glowEnd, crack) {
    const { x, top, bot, w } = HG, mid = (top + bot) / 2;
    // sable du haut (diminue) et du bas (augmente)
    c.save(); bulbPath(c, true); c.clip(); const lvlT = lerp(top + 60, mid - 10, fill); let g = c.createLinearGradient(0, lvlT, 0, mid); g.addColorStop(0, '#F2CC8A'); g.addColorStop(1, '#C8904A'); c.fillStyle = g; c.beginPath(); c.moveTo(x - w, lvlT + 30); c.quadraticCurveTo(x, lvlT + 90 * (1 - fill), x + w, lvlT + 30); c.lineTo(x + w, mid); c.lineTo(x - w, mid); c.fill(); c.restore();
    c.save(); bulbPath(c, false); c.clip(); const ph = lerp(20, 300, fill); g = c.createLinearGradient(0, bot - ph, 0, bot); g.addColorStop(0, '#F2CC8A'); g.addColorStop(1, '#B87E3A'); c.fillStyle = g; c.beginPath(); c.moveTo(x - w, bot - 30); c.lineTo(x - w, bot - ph * .5); c.quadraticCurveTo(x, bot - ph - 40, x + w, bot - ph * .5); c.lineTo(x + w, bot - 30); c.fill(); c.restore();
    // le filet de sable
    c.strokeStyle = 'rgba(242,204,138,.9)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, mid); c.lineTo(x, bot - lerp(20, 300, fill) - 20); c.stroke();
    for (const gr of grains) { const u = (t * .9 + gr.ph) % 1, yy = lerp(mid, bot - lerp(20, 300, fill) - 20, u); c.fillStyle = rgba('#FFE2A8', .8); c.beginPath(); c.arc(x + gr.dx * u, yy, gr.s, 0, 6.283); c.fill(); }
    if (glowEnd > 0) glow(c, x, mid + 10, 140, '#FFD98A', .7 * glowEnd);
    // le verre
    for (const up of [true, false]) { bulbPath(c, up); c.fillStyle = 'rgba(200,220,255,.05)'; c.fill(); c.strokeStyle = 'rgba(230,240,255,.55)'; c.lineWidth = 3; c.stroke(); }
    c.save(); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 7; c.beginPath(); c.moveTo(x - w + 30, top + 80); c.quadraticCurveTo(x - w + 34, mid - 150, x - 60, mid - 70); c.stroke(); c.restore();
    if (crack > 0) { c.save(); c.strokeStyle = rgba('#F2F7FF', crack); c.lineWidth = 2; c.beginPath(); c.moveTo(x + w * .7, bot - 140); c.lineTo(x + w * .8, bot - 110); c.lineTo(x + w * .74, bot - 80); c.lineTo(x + w * .86, bot - 60); c.stroke(); c.restore(); }
    // le cadre de bois
    g = c.createLinearGradient(x - w - 40, 0, x + w + 40, 0); g.addColorStop(0, '#3a2414'); g.addColorStop(.5, '#7a5230'); g.addColorStop(1, '#2a180c'); c.fillStyle = g;
    c.fillRect(x - w - 50, top - 10, (w + 50) * 2, 40); c.fillRect(x - w - 50, bot - 30, (w + 50) * 2, 40);
    for (const px of [x - w - 32, x + w + 18]) c.fillRect(px, top + 20, 14, bot - top - 50);
  }
  function scene2(c, t) {
    camSafe(c, lerp(1.1, 1.0, prog(t, T.s2, T.s3, 'inOutSine')), 540, 1100);
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#0a0706'); g.addColorStop(1, '#1a120c'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 1230, 700, '#F2C27D', .3); c.fillStyle = '#140e0a'; c.fillRect(-LM, 1660, W + 2 * LM, H);
    hourglass(c, t, lerp(.35, .85, prog(t, T.s2, T.s3, 'linear')), prog(t, T.valeur - .2, T.vie2 + .6, 'inOutSine'), 0);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#060403', .6, 720);
    vignette(c, .55, '#030201');
  }

  /* =====================================================================
     DÉCOR 3 — LA ROUE DES SAISONS (Ecclésiaste 3)
     ===================================================================== */
  const RW = { x: 540, y: 1180, r: 380 };
  const SEAS = [['#9ACB7A', 'naître'], ['#E9C46A', 'construire'], ['#D9824A', 'détruire'], ['#9FB3C8', 'mourir']];
  function drawSeasons(c, t, st) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#141210'); g.addColorStop(1, '#221c16'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const ang = st.angle; // angle de l'aiguille (0 = haut)
    for (let k = 0; k < 4; k++) { const a0 = -Math.PI / 2 + k * Math.PI / 2, a1 = a0 + Math.PI / 2, passed = st.faded[k] || 0, lit = st.lit[k] || 0;
      c.beginPath(); c.moveTo(RW.x, RW.y); c.arc(RW.x, RW.y, RW.r, a0, a1); c.closePath(); c.fillStyle = rgba(mix(SEAS[k][0], '#3a3634', passed * .8), .22 + .45 * lit); c.fill();
      c.strokeStyle = 'rgba(242,239,232,.25)'; c.lineWidth = 2; c.stroke();
      if (lit > 0) { const am = (a0 + a1) / 2; c.save(); c.globalAlpha = lit * (1 - passed * .5); c.font = 'italic 400 54px Instrument'; c.fillStyle = '#F2EFE8'; c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 12; c.fillText(SEAS[k][1], RW.x + Math.cos(am) * RW.r * .68, RW.y + Math.sin(am) * RW.r * .68 + 16); c.restore(); } }
    c.strokeStyle = 'rgba(242,239,232,.6)'; c.lineWidth = 3; c.beginPath(); c.arc(RW.x, RW.y, RW.r, 0, 6.283); c.stroke();
    for (let k = 0; k < 48; k++) { const a = k * Math.PI / 24; c.lineWidth = k % 12 ? 1.5 : 3; c.beginPath(); c.moveTo(RW.x + Math.cos(a) * RW.r, RW.y + Math.sin(a) * RW.r); c.lineTo(RW.x + Math.cos(a) * (RW.r + (k % 12 ? 12 : 26)), RW.y + Math.sin(a) * (RW.r + (k % 12 ? 12 : 26))); c.stroke(); }
    // l'arbre au centre, qui change de saison
    const sk = ((ang / (Math.PI / 2)) % 4 + 4) % 4, i0 = Math.floor(sk), u = sk - i0, leaf = mix(SEAS[i0][0], SEAS[(i0 + 1) % 4][0], u), bare = (i0 === 3 ? u : i0 === 2 ? 0 : i0 === 0 ? 1 - u : 0);
    c.fillStyle = '#2a1a10'; c.beginPath(); c.moveTo(RW.x - 14, RW.y + 150); c.lineTo(RW.x - 8, RW.y - 40); c.lineTo(RW.x + 8, RW.y - 40); c.lineTo(RW.x + 14, RW.y + 150); c.fill();
    c.strokeStyle = '#2a1a10'; c.lineWidth = 7; for (const [dx, dy] of [[-60, -110], [60, -100], [-30, -150], [34, -140]]) { c.beginPath(); c.moveTo(RW.x, RW.y - 30); c.lineTo(RW.x + dx, RW.y + dy); c.stroke(); }
    const r = rng(8); for (let k = 0; k < 26; k++) { const a = r() * 6.283, d = Math.sqrt(r()) * 110; c.fillStyle = rgba(leaf, (.7 - bare * .65)); c.beginPath(); c.arc(RW.x + Math.cos(a) * d, RW.y - 110 + Math.sin(a) * d * .7, 20 + r() * 16, 0, 6.283); c.fill(); }
    // l'aiguille
    c.save(); c.translate(RW.x, RW.y); c.rotate(ang); c.strokeStyle = '#F3D9A0'; c.lineWidth = 5; c.shadowColor = '#FFD98A'; c.shadowBlur = 14; c.beginPath(); c.moveTo(0, 30); c.lineTo(0, -RW.r + 20); c.stroke(); c.fillStyle = '#F3D9A0'; c.beginPath(); c.moveTo(0, -RW.r + 6); c.lineTo(-12, -RW.r + 34); c.lineTo(12, -RW.r + 34); c.fill(); c.restore();
    c.fillStyle = '#F3D9A0'; c.beginPath(); c.arc(RW.x, RW.y, 12, 0, 6.283); c.fill();
  }
  function scene3(c, t) {
    camSafe(c, lerp(1.08, 1.0, prog(t, T.s3, T.s4, 'inOutSine')), 540, 1060);
    const cues = [T.naitre, T.construire, T.detruire, T.mourir];
    const angle = lerp(-.3, 4 * Math.PI / 2 + .3, prog(t, T.moment, T.reviennent + .6, 'inOutSine'));
    drawSeasons(c, t, { angle, lit: cues.map(x => prog(t, x - .15, x + .4, 'outCubic')), faded: [0, 1, 2, 3].map(k => k === 0 || k === 2 ? prog(t, T.reviennent - .3, T.reviennent + .6, 'inOutSine') : 0) });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0c0a08', .6, 520);
    vignette(c, .5, '#050403');
  }

  /* =====================================================================
     DÉCOR 4 — LES RUINES DANS LE DÉSERT (Coran 3:185)
     ===================================================================== */
  function drawRuins(c, t, st) {
    const dusk = st.dusk || 0;
    let g = c.createLinearGradient(0, -LM, 0, 1300); g.addColorStop(0, mix('#3a2a4a', '#060814', dusk)); g.addColorStop(.6, mix('#D9906A', '#1a1a34', dusk)); g.addColorStop(1, mix('#F2C890', '#3a2a3a', dusk));
    c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 1400 + LM);
    if (dusk > .3) { const r = rng(14); for (let k = 0; k < 120; k++) { c.fillStyle = rgba('#EEF2FF', (dusk - .3) / .7 * (.3 + .6 * r())); c.beginPath(); c.arc(r() * W, r() * 900, .6 + r() * 1.4, 0, 6.283); c.fill(); } }
    glow(c, 300, 1180, 600, '#F6C27A', .45 * (1 - dusk)); c.fillStyle = rgba('#FFE0B0', .9 * (1 - dusk)); c.beginPath(); c.arc(300, 1220 + dusk * 160, 90, Math.PI, 2 * Math.PI); c.fill();
    // les ruines : une grande porte brisée à décor géométrique, des colonnes tombées
    const stone = mix('#B88A62', '#2a2230', dusk);
    c.fillStyle = stone; c.fillRect(520, 640, 120, 680); c.fillRect(880, 760, 100, 560);
    c.save(); c.beginPath(); c.rect(520, 560, 460, 260); c.clip(); c.beginPath(); c.moveTo(520, 820); c.lineTo(520, 700); c.quadraticCurveTo(540, 600, 640, 590); c.lineTo(700, 600); c.lineTo(720, 640); c.lineTo(640, 650); c.quadraticCurveTo(600, 680, 640, 820); c.closePath(); c.fill(); c.restore(); // arc brisé
    c.save(); c.beginPath(); c.rect(530, 860, 100, 380); c.clip(); lattice(c, 530, 860, 100, 380, 50, mix('#2c5a6a', '#3a4a6a', dusk), 2, .8); c.restore();
    c.save(); c.beginPath(); c.rect(888, 880, 84, 360); c.clip(); lattice(c, 888, 880, 84, 360, 42, mix('#2c5a6a', '#3a4a6a', dusk), 2, .7); c.restore();
    c.save(); c.translate(760, 1350); c.rotate(-.12); c.fillStyle = stone; c.fillRect(-170, -40, 340, 70); c.restore(); // colonne tombée
    // les dunes
    const dune = (y0, amp, col, seed) => { c.fillStyle = col; c.beginPath(); c.moveTo(-LM, H + LM); for (let x = -LM; x <= W + LM; x += 30) c.lineTo(x, y0 + Math.sin(x * .004 + seed) * amp + Math.sin(x * .012 + seed * 2) * amp * .35); c.lineTo(W + LM, H + LM); c.fill(); };
    dune(1320, 40, mix('#C98A5A', '#2a2232', dusk), 1); dune(1470, 46, mix('#A86A40', '#1c1826', dusk), 2.4);
    // richesse, pouvoir, orgueil : des pièces d'or, un sceptre, une couronne… que le sable recouvre
    const sink = st.sink || 0, L = st.labels || [0, 0, 0];
    const obj = [[260, 1760, 'coins'], [540, 1800, 'sceptre'], [820, 1760, 'crown']];
    obj.forEach(([x, y, kind], i) => { const yy = y + sink * 60, sc = 1 - sink * .25;
      c.save(); c.translate(x, yy); c.scale(sc, sc); c.fillStyle = mix('#F2C860', '#8a7040', dusk * .6); c.strokeStyle = mix('#7a5a20', '#3a2a14', dusk);
      if (kind === 'coins') for (let k = 0; k < 7; k++) { c.beginPath(); c.ellipse(-60 + k * 20, -k % 3 * 10, 22, 8, 0, 0, 6.283); c.fill(); c.lineWidth = 2; c.stroke(); }
      if (kind === 'sceptre') { c.save(); c.rotate(-.5); c.fillRect(-6, -90, 12, 150); c.beginPath(); c.arc(0, -100, 18, 0, 6.283); c.fill(); c.restore(); }
      if (kind === 'crown') { c.beginPath(); c.moveTo(-60, 0); c.lineTo(-60, -50); c.lineTo(-30, -20); c.lineTo(0, -64); c.lineTo(30, -20); c.lineTo(60, -50); c.lineTo(60, 0); c.closePath(); c.fill(); c.lineWidth = 2.5; c.stroke(); }
      c.restore();
      if (L[i] > 0) { c.save(); c.globalAlpha = L[i] * (1 - sink * .4); c.font = 'italic 400 46px Instrument'; c.fillStyle = '#F2EFE8'; c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 14; c.fillText(['la richesse', 'le pouvoir', 'l’orgueil'][i], x, y - 110); c.restore(); } });
    // le sable qui recouvre
    if (sink > 0) { c.fillStyle = mix('#B87A4A', '#22202e', dusk); c.beginPath(); c.moveTo(-LM, H + LM); for (let x = -LM; x <= W + LM; x += 30) c.lineTo(x, 1850 - sink * 90 + Math.sin(x * .01 + 1) * 20); c.lineTo(W + LM, H + LM); c.fill(); }
    const dr = rng(5); c.fillStyle = rgba('#F2D2A0', .35 * (1 - dusk * .6)); for (let k = 0; k < 90; k++) { const x = ((dr() * W + t * (40 + dr() * 60)) % (W + 200)) - 100, y = 1450 + dr() * 400; c.fillRect(x, y, 2, 1); } // sable soufflé
  }
  function scene4(c, t) {
    camSafe(c, lerp(1.08, 1.0, prog(t, T.s4, T.s5, 'inOutSine')), 540, 1040);
    drawRuins(c, t, { dusk: prog(t, T.ame - .3, T.mort4 + 1.2, 'inOutSine'), labels: [T.richesse, T.pouvoir, T.orgueil].map(x => prog(t, x - .1, x + .4, 'outCubic')), sink: prog(t, T.place - .5, T.s5 + .5, 'inOutSine') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0a0608', .55, 720);
    vignette(c, .5, '#040203');
  }

  /* =====================================================================
     DÉCOR 5 — L'ATRIUM DE SÉNÈQUE : le sablier fêlé, le temps gaspillé
     ===================================================================== */
  function drawAtriumStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#2a0e0c'); g.addColorStop(.6, '#5a1a14'); g.addColorStop(1, '#1a0806'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM); // mur pompéien
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 6; for (let x = -LM; x < W + LM; x += 300) c.strokeRect(x + 30, 420, 240, 760); c.fillStyle = '#120806'; c.fillRect(-LM, 1180, W + 2 * LM, 40);
    for (const x of [60, 1020]) { g = c.createLinearGradient(x - 50, 0, x + 50, 0); g.addColorStop(0, '#8a7a66'); g.addColorStop(.5, '#E9DCC4'); g.addColorStop(1, '#6a5a48'); c.fillStyle = g; c.fillRect(x - 46, 200, 92, 1500); c.strokeStyle = 'rgba(60,50,40,.35)'; c.lineWidth = 2; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(x + k * 12, 220); c.lineTo(x + k * 12, 1680); c.stroke(); } c.fillRect(x - 60, 180, 120, 30); } // colonnes cannelées
    g = c.createLinearGradient(0, 1700, 0, H + LM); g.addColorStop(0, '#3a2a1e'); g.addColorStop(1, '#100a06'); c.fillStyle = g; c.fillRect(-LM, 1700, W + 2 * LM, H + LM); // sol
    c.fillStyle = '#2a1c12'; c.fillRect(200, 1340, 680, 30); c.fillRect(240, 1370, 24, 330); c.fillRect(816, 1370, 24, 330); // table
    c.fillStyle = '#E9DEC8'; c.fillRect(250, 1312, 260, 30); c.fillStyle = '#C9B48E'; c.beginPath(); c.arc(250, 1327, 18, 0, 6.283); c.arc(510, 1327, 18, 0, 6.283); c.fill(); // le rouleau
    c.strokeStyle = 'rgba(60,40,20,.5)'; c.lineWidth = 1.5; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(280, 1320 + k * 7); c.lineTo(480, 1320 + k * 7); c.stroke(); }
    c.fillStyle = '#d8ccb8'; c.fillRect(110, 1120, 170, 580); c.fillStyle = '#e9dfcc'; c.fillRect(96, 1100, 198, 30); // socle du buste
    bust(c, 90, 690, 1.0, .6);
  }
  const ATRIUM = prerender(drawAtriumStatic, 1.25);
  function scene5(c, t) {
    camSafe(c, lerp(1.06, 1.0, prog(t, T.s5, T.s6, 'inOutSine')), 540, 1060);
    blit(c, ATRIUM);
    glow(c, 300, 900, 420, '#F6D6A6', .25);
    // le sablier (plus petit), fêlé : le sable s'échappe et se perd au sol
    c.save(); c.translate(680, 1340); c.scale(.42, .42); c.translate(-HG.x, -HG.bot - 10); hourglass(c, t, lerp(.4, .7, prog(t, T.s5, T.s6, 'linear')), 0, prog(t, T.gaspillons - .3, T.gaspillons + .2, 'outCubic')); c.restore();
    const leak = prog(t, T.gaspillons - .2, T.s6 + .4, 'linear');
    if (leak > 0) { const x0 = 680 + HG.w * .8 * .42, y0 = 1340 - 70 * .42; c.strokeStyle = 'rgba(242,204,138,.85)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 + 20, y0 + 40, x0 + 26, 1700); c.stroke();
      const r = rng(6); for (let k = 0; k < 40; k++) { const u = (t * 1.3 + r()) % 1; c.fillStyle = 'rgba(255,226,168,.8)'; c.beginPath(); c.arc(x0 + 8 + u * 18, lerp(y0, 1700, u), 1.6, 0, 6.283); c.fill(); }
      c.fillStyle = 'rgba(230,184,119,.9)'; c.beginPath(); c.ellipse(x0 + 30, 1704, 40 + leak * 120, 6 + leak * 14, 0, Math.PI, 2 * Math.PI); c.fill(); }
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#120605', .65, 620);
    vignette(c, .55, '#050101');
  }

  /* =====================================================================
     DÉCOR 6 — L'ALLÉE DU VIEUX CIMETIÈRE, dans la brume
     ===================================================================== */
  function drawCemeteryStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#2a3040'); g.addColorStop(.55, '#8a8a90'); g.addColorStop(.62, '#6a6a70'); g.addColorStop(1, '#14161a'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.fillStyle = '#4a4c50'; c.beginPath(); c.moveTo(520, 1060); c.lineTo(560, 1060); c.lineTo(820, H + LM); c.lineTo(260, H + LM); c.fill(); // l'allée
    for (let k = 9; k >= 0; k--) { const z = 1 + k * .45, fog = Math.min(.9, k / 10);
      for (const d of [-1, 1]) {
        const x = 540 + d * (110 + 320 / z), y = 1060 + 700 / z, h = 150 / z, w = 90 / z;
        c.fillStyle = mix('#2a2c30', '#8a8a90', fog); c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h + w / 2); c.arc(x, y - h + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, y); c.closePath(); c.fill(); // stèle simple
        if (k % 3 === 1) { const cx = 540 + d * (300 + 420 / z), ch = 600 / z; c.fillStyle = mix('#14181a', '#7a7c80', fog); c.beginPath(); c.moveTo(cx, y - ch); c.quadraticCurveTo(cx + 40 / z, y - ch * .5, cx + 26 / z, y); c.lineTo(cx - 26 / z, y); c.quadraticCurveTo(cx - 40 / z, y - ch * .5, cx, y - ch); c.fill(); } // cyprès
      } }
    c.fillStyle = '#1a1c20'; c.fillRect(500, 960, 8, 100); c.fillRect(572, 960, 8, 100); c.beginPath(); c.arc(540, 960, 40, Math.PI, 2 * Math.PI); c.lineWidth = 6; c.strokeStyle = '#1a1c20'; c.stroke(); // le portail au fond
  }
  const CEM = prerender(drawCemeteryStatic, 1.25);
  const leaves = (() => { const r = rng(44); return Array.from({ length: 30 }, () => ({ x: r() * W, ph: r(), sp: .05 + r() * .06, s: 4 + r() * 5 })); })();
  function scene6(c, t) {
    camSafe(c, lerp(1.04, 1.1, prog(t, T.s6, T.s7, 'inOutSine')), 540, lerp(1040, 1000, prog(t, T.s6, T.s7, 'inOutSine')));
    blit(c, CEM);
    for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = .18; c.filter = 'blur(30px)'; c.fillStyle = '#E9ECF2'; c.fillRect(-LM + ((t * 20 * (k + 1)) % 500) - 250, 1000 + k * 90, W + 2 * LM, 70); c.restore(); } // brume
    for (const l of leaves) { const u = (t * l.sp + l.ph) % 1; c.fillStyle = 'rgba(160,110,70,.7)'; c.save(); c.translate(l.x + Math.sin(u * 12) * 30, lerp(300, 1900, u)); c.rotate(u * 9); c.fillRect(-l.s, -l.s / 2, l.s * 2, l.s); c.restore(); }
    const walk = prog(t, T.s6, T.s7 + .6, 'linear');
    person(c, { x: 540, y: lerp(1900, 1700, walk), s: lerp(1.9, 1.6, walk), f: 1, walk: t * 4, phone: 0, alpha: .95 }, '#C9CED8', 2.5);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#14161c', .6, 700);
    vignette(c, .5, '#08090c');
  }

  /* =====================================================================
     DÉCOR 7 — LA COLLINE AU COUCHANT : le temps limité
     ===================================================================== */
  function scene7(c, t) {
    camSafe(c, lerp(1.08, 1.0, prog(t, T.s7, T.s8, 'inOutSine')), 540, 1040);
    const down = prog(t, T.s7, T.s8 + .6, 'linear');
    let g = c.createLinearGradient(0, -LM, 0, 1500); g.addColorStop(0, mix('#2a2a5a', '#1a1438', down)); g.addColorStop(.5, mix('#C86A5A', '#8a3a4a', down)); g.addColorStop(1, mix('#F6B870', '#C8644A', down)); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 1600 + LM);
    const sy = lerp(1140, 1330, down); glow(c, 540, sy, 700, '#FFD9A0', .55); c.fillStyle = '#FFE6B8'; c.beginPath(); c.arc(540, sy, 150, 0, 6.283); c.fill(); // le soleil qui descend
    c.fillStyle = '#2a1820'; c.beginPath(); c.moveTo(-LM, 1360); for (let x = -LM; x <= W + LM; x += 30) c.lineTo(x, 1340 + Math.sin(x * .006 + 2) * 24); c.lineTo(W + LM, H + LM); c.lineTo(-LM, H + LM); c.fill(); // horizon
    c.fillStyle = '#120a0e'; c.beginPath(); c.moveTo(-LM, H + LM); c.lineTo(-LM, 1600); c.quadraticCurveTo(400, 1500, 700, 1560); c.quadraticCurveTo(900, 1600, W + LM, 1700); c.lineTo(W + LM, H + LM); c.fill(); // la colline
    // des lumières lointaines : ce qui pourrait mériter notre vie
    const opts = prog(t, T.merite - .3, T.vie7 + .4, 'inOutSine'); const r = rng(9);
    for (let k = 0; k < 7; k++) { const x = 120 + k * 140 + r() * 40, y = 1330 + r() * 24, a = clamp(opts * 2 - k * .15); if (a > 0) { glow(c, x, y, 40, '#FFF2D0', .7 * a); c.fillStyle = rgba('#FFFFFF', a); c.beginPath(); c.arc(x, y, 3, 0, 6.283); c.fill(); } }
    person(c, { x: 420, y: 1548, s: 1.85, f: 1, phone: 0, head: -.05 - .08 * opts }, '#FFD9A0', 3);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#120a14', .55, 720);
    vignette(c, .45, '#0a0408');
  }

  /* =====================================================================
     TRANSITIONS (fondus enchaînés en mouvement — style validé)
     ===================================================================== */
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
  const SCN = [[0, T.s2, scene1], [T.s2, T.s3, scene2], [T.s3, T.s4, scene3], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5], [T.s6, T.s7, scene6], [T.s7, T.s8, scene7], [T.s8, DUR + 1, scene8]];
  const TRS = [
    { at: T.s2, d: 1.1, kind: 'dissolve', a: scene1, b: scene2 },
    { at: T.s3, d: 1.1, kind: 'warm', a: scene2, b: scene3 },
    { at: T.s4, d: 1.0, kind: 'drift', a: scene3, b: scene4 },
    { at: T.s5, d: 1.0, kind: 'dissolve', a: scene4, b: scene5 },
    { at: T.s6, d: 1.1, kind: 'dissolve', a: scene5, b: scene6 },
    { at: T.s7, d: 1.1, kind: 'tilt', a: scene6, b: scene7, o: { dir: -1 } },
    { at: T.s8, d: 1.1, kind: 'warm', a: scene7, b: scene8 },
  ];
  function render(t) {
    const f = Math.round(t * 30);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    const tr = TRS.find(x => t >= x.at - x.d / 2 && t < x.at + x.d / 2);
    if (tr) { paint(bax, tr.a, t); paint(bbx, tr.b, t); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); KINDS[tr.kind](ctx, (t - tr.at + tr.d / 2) / tr.d, tr.o || {}); }
    else { const sc = SCN.filter(([a, b]) => t >= a && t < b).pop() || SCN[SCN.length - 1]; sc[2](ctx, t); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    grain(ctx, f, .08);
    texts(t); subs(t);
  }
  function revealWords(nodes, t, t0, out) { nodes.forEach(n => { n.style.opacity = out > 0 && t > t0 - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const st = +s.dataset.t, p = prog(t, st - .04, st + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * out, blur: (1 - p) * 6 }); }); }); }
  function texts(t) {
    (function () { const p = prog(t, .2, 1.3, 'outCubic'), o = 1 - prog(t, T.page - .2, T.page + .3, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    const e1 = T.s1b - .1;
    wipe(tExA, t, T.imagine, e1, .7, .3); slam(tExB, t, T.page - .3, e1, .3);
    fade(tU, t, T.urgent - .3, T.s1c - .2, .5, 10, .25); fade(tD, t, T.definitif - .4, T.s1d - .2, .5, 10, .25); fade(tR, t, T.irremplacable - .5, T.s2 - .2, .5, 10, .3);
    const q2 = T.s3 - .35;
    fade(tQs, t, T.question2 - .2, q2, .5, 10, .3); fade(tQ2a, t, T.mort2 - .3, q2, .5, 12, .3); slam(tQ2b, t, T.valeur - .1, q2, .3); fade(tQ2c, t, T.vie2 - .15, q2, .5, 12, .3);
    const e3 = T.s4 - .35;
    fade(tEc, t, T.ecclesiaste - .1, e3, .6, 10, .3); fade(tEcQ, t, T.ecclesiaste + .2, e3, .6, 12, .3); fade(tEcQ2, t, T.ecclesiaste + .45, e3, .6, 12, .3); fade(tLSG, t, T.ecclesiaste + .6, e3, .6, 6, .3); fade(tSai, t, T.saisons - .1, e3, .6, 12, .3);
    const e4 = T.s5 - .35, sDim = 1 - .7 * prog(t, T.ame - .3, T.ame + .2, 'linear');
    fade(tSour, t, T.coran - .1, e4, .6, 10, .3); fade(tAr, t, T.coran + .15, e4, .8, 10, .3); fade(tVers, t, T.sourate + .2, e4, .6, 10, .3);
    [tSour, tAr, tVers].forEach(n => { n.style.opacity = (parseFloat(n.style.opacity) * sDim).toFixed(3); });
    slam(tAme, t, T.ame - .2, e4, .3); fade(tHam, t, T.ame + .4, e4, .6, 6, .3); fade(tJp, t, T.place - .4, e4, .6, 12, .3);
    const e5 = T.s6 - .35;
    fade(tSen, t, T.seneque - .1, e5, .7, 12, .3); fade(tSenSub, t, T.brievete - .2, e5, .6, 8, .3);
    fade(tLat, t, T.courte - .5, e5, .7, 12, .3); fade(tLatRef, t, T.courte, e5, .6, 6, .3); fade(tLatFr, t, T.gaspillons - .3, e5, .6, 12, .3); fade(tLatFr2, t, T.gaspillons + .2, e5, .6, 6, .3);
    const e6 = T.s7 - .35;
    fade(tN1, t, T.automatiquement - .5, e6, .6, 12, .3); slam(tN2, t, T.automatiquement + .3, e6, .3); fade(tN3, t, T.heureuse - .1, e6, .6, 12, .3);
    const e7 = T.s8 - .35;
    fade(tP, t, T.profonde - .4, e7, .5, 10, .3); slam(tLim, t, T.limite - .05, e7, .3);
    revealWords(tQ7, t, T.merite - .5, 1 - prog(t, e7, e7 + .3, 'inCubic'));
    revealWords(tQ8, t, T.q8, 1 - prog(t, T.title - .25, T.title + .15, 'inCubic'));
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores (la musique de fond est continue) ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7], ['s8', T.s8]].forEach(([n, x]) => sfx('sec_' + n, x));
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('pages', .4, { d: T.s1b - .4 }); [T.s1b, T.s1c, T.s1d].forEach(x => sfx('page', x - .45)); sfx('tick', T.urgent, { d: T.s1c - T.urgent });
  sfx('sand', T.s2, { d: T.s3 - T.s2 }); sfx('glow', T.valeur); sfx('chime', T.naitre); sfx('chime', T.construire); sfx('chime', T.detruire); sfx('chime', T.mourir);
  sfx('wind', T.s4, { d: T.s5 - T.s4 }); sfx('glow', T.ame); sfx('sand', T.place - .4, { d: 1.6 });
  sfx('crack', T.gaspillons - .1); sfx('sand', T.gaspillons, { d: T.s6 - T.gaspillons }); sfx('wind', T.s6, { d: T.s7 - T.s6 }); sfx('glow', T.merite);
  for (let k = 0; k < 3; k++) sfx('page', T.s8 + .3 + k * 1.1); sfx('page', T.compris - .5);
  sfx('question', T.q8); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : le sablier, la question
    render(Math.min(T.vie2 - .1, T.s3 - .65));
    set(tSeries, { o: 1, blur: 0, s: 1, y: -10 }); tSeries.style.top = '80px'; [tQs].forEach(n => set(n, { o: 0 }));
    [tQ2a, tQ2b, tQ2c].forEach(n => set(n, { o: 1, blur: 0, s: 1 })); SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
