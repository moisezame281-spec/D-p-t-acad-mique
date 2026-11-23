/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 008 — « Qui a choisi ce que tu désires ? »
   Style validé : explication continue, une seule musique de fond, fondus enchaînés en mouvement.
   Règle depuis l'ép. 008 : les silhouettes sombres ne sont JAMAIS sur fond noir (fonds clairs ou contre-jour).
   Décors nouveaux : la vitrine éclairée, la galerie claire et le piédestal, le triangle mimétique sur papier,
   la main et le sable (deuxième Noble Vérité), la ville des écrans au crépuscule, le vertige, le désert de sel.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, personPath, rng, off } = CINE;
  const C = { ivory: '#F2EFE8', gold: '#C0A16A', rose: '#E8949A', lamp: '#F2C27D', red: '#D8584A', blue: '#8EC9FF', saff: '#F0A85A', ink: '#2a1d12' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); if (!ws.length) throw new Error('repère introuvable : ' + id + ' « ' + w + ' »'); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument'].map(f => document.fonts.load(f, 'Aaé')));

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    q1: SEN('s1a').start, desirs: cue('s1a', 'desirs'), croyons: cue('s1a', 'croyons'), q1End: SEN('s1a').end,
    s2: SEN('s2a').start - .3, montre: cue('s2a', 'montre'), metier: cue('s2a', 'metier'), silhouette: cue('s2a', 'silhouette'), relation: cue('s2a', 'relation'),
    s2b: SEN('s2b').start, objet: cue('s2b', 'objet'), change: cue('s2b', 'change'), s2c: SEN('s2c').start, regard: cue('s2c', 'regard'), autres: cue('s2c', 'autres'), valeur: cue('s2c', 'valeur'),
    s3: SEN('s3a').start - .3, girard: cue('s3a', 'jirar'), fascinante: cue('s3a', 'fascinante'), desir3: cue('s3b', 'desir'), mimetique: cue('s3b', 'mimetique'),
    s3c: SEN('s3c').start, choses: cue('s3c', 'choses'), s3d: SEN('s3d').start, observant: cue('s3d', 'observant'), possedent: cue('s3d', 'possedent'),
    s3e: SEN('s3e').start, modele: cue('s3e', 'modele'), s3f: SEN('s3f').start, rival: cue('s3f', 'rival'),
    s4: SEN('s4a').start - .3, bouddhisme: cue('s4a', 'bouddhisme'), s4b: SEN('s4b').start, deuxieme: cue('s4b', 'deuxieme'), soif: cue('s4b', 'soif'), attachement: cue('s4b', 'attachement'), racines: cue('s4b', 'racines'), souffrance: cue('s4b', 'souffrance'),
    s4c: SEN('s4c').start, desirons4: cue('s4c', 'desirons'), maniere: cue('s4c', 'maniere'), attachons: cue('s4c', 'attachons'),
    s5: SEN('s5a').start - .3, algorithmes: cue('s5a', 'algorithmes'), personnalisent: cue('s5a', 'personnalisent'), interactions: cue('s5a', 'interactions'),
    s5b: SEN('s5b').start, choisissent: cue('s5b', 'choisissent'), place: cue('s5b', 'place'), faconner: cue('s5b', 'faconner'), univers: cue('s5b', 'univers'), attention: cue('s5b', 'attention'),
    s6: SEN('s6a').start - .3, vertige: cue('s6a', 'vertige'),
    s7: SEN('s7a').start - .3, q7: SEN('s7a').start, admirer: cue('s7a', 'admirer'), envier: cue('s7a', 'envier'), voir: cue('s7a', 'voir'), poursuivons: cue('s7a', 'poursuivons'), desirer: cue('s7b', 'desirer'), qEnd: SEN('s7b').end,
  };
  T.title = T.qEnd + .55;

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

  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;008</div>`, '', Object.assign({ top: '150px', textShadow: 'none' }, CENTER));
  // S1 — la question d'ouverture, mot à mot
  const Q1 = [[['Et', 'si', 'certains', 'de', 'nos', 'désirs'], 70, 196, C.ivory], [['ne', 'nous', 'appartenaient', 'pas'], 82, 282, C.rose], [['autant', 'que', 'nous', 'le', 'croyons&#8239;?'], 70, 382, C.ivory]];
  // S2 — le piédestal
  const tReg = big('LE REGARD DES AUTRES', 236, 84, GOLD);
  const tVal = ital('lui donne soudain de la valeur', 344, 66, C.lamp);
  // S3 — René Girard
  const tGir = big('RENÉ GIRARD', 150, 104, GOLD);
  const tGirSub = note('1923 – 2015 · <i>Mensonge romantique et vérité romanesque</i> (1961)', 282, 28, 'rgba(242,239,232,.9)');
  const tMim = big('LE DÉSIR MIMÉTIQUE', 336, 80, ROSE);
  const tGq = [ital('«&#8239;Tout “sujet” a besoin d’un “modèle”', 186, 54), ital('pour savoir “quoi” désirer.&#8239;»', 250, 54, C.lamp)];
  const tGqRef = note('Association Recherches Mimétiques, «&#8239;Présentation de la théorie mimétique&#8239;»', 320);
  // S4 — la deuxième Noble Vérité
  const tNob = small('LA DEUXIÈME NOBLE VÉRITÉ', 184, C.saff);
  const tSn = [ital('«&#8239;C’est cette soif qui conduit à une nouvelle existence,', 236, 48), ital('accompagnée de plaisir et de convoitise,', 294, 48), ital('cherchant son plaisir ici et là.&#8239;»', 352, 48, C.lamp)];
  const tSnRef = note('<i>Saṃyutta Nikāya</i> 56.11 · traduction libre d’après Bhikkhu Bodhi', 420);
  const tMan1 = ital('pas seulement ce que nous désirons,', 230, 56);
  const tMan2 = big('LA MANIÈRE', 298, 92, GOLD);
  const tMan3 = ital('dont nous nous y attachons', 408, 62, C.lamp);
  // S5 — les algorithmes
  const tAlg = small('LES ALGORITHMES', 184, C.blue);
  const tInt = ital('à partir de nos interactions', 236, 60);
  const tTik = note('Selon TikTok : vidéos aimées ou partagées, comptes suivis, commentaires, contenus créés (Newsroom, 2020)', 1452, 21, 'rgba(242,239,232,.7)');
  const tCho = ital('Ils ne choisissent pas à notre place,', 230, 58);
  const tUni = big('L’UNIVERS DE MODÈLES', 300, 84, GOLD);
  // S6 — le vertige
  const tVo = ital('Et voici', 300, 80), tVer = big('LE VÉRITABLE VERTIGE', 392, 92, ROSE);
  // S7 — la question finale, mot à mot
  const Q7 = [[['Si', 'personne', 'ne', 'pouvait'], 66, 180, C.ivory], [['admirer,', 'envier', 'ou', 'même', 'voir'], 76, 258, C.rose], [['ce', 'que', 'nous', 'poursuivons,'], 62, 352, C.ivory],
    [['continuerions-nous'], 90, 432, C.ivory], [['à', 'le', 'désirer&#8239;?'], 96, 536, C.rose]];
  const keysOf = w => (w.replace(/&#\d+;/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']);
  function wordLines(lines, sids) {
    const words = sids.flatMap(id => SEN(id).words); let wi = 0;
    return lines.map(([ws, fs, y, col]) => fit(tx(ws.map(w => { const idx = wi; wi += keysOf(w).length;
      return `<span class="qw" data-t="${words[Math.min(idx, words.length - 1)].start}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)), 1010));
  }
  const tQ1 = wordLines(Q1, ['s1a']), tQ7 = wordLines(Q7, ['s7a', 's7b']);
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', Object.assign({ top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }, CENTER));
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', Object.assign({ top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose }, CENTER));
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', Object.assign({ top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' }, CENTER));
  const tCovA = ital('Qui a choisi', 300, 104), tCovB = big('CE QUE TU DÉSIRES&#8239;?', 410, 90, ROSE); // couverture seulement

  /* ---------- sous-titres ---------- */
  const NOSUB = new Set(['s1a', 's6a', 's7a', 's7b']);
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
  // la montre (acier → or selon « val »)
  function watch(c, x, y, s, val, t, glint = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = mix('#3a3632', '#5a3a1c', val); c.beginPath(); c.roundRect(-26, -120, 52, 240, 14); c.fill(); // bracelet
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let k = -4; k <= 4; k++) { if (Math.abs(k) < 2) continue; c.beginPath(); c.moveTo(-24, k * 24); c.lineTo(24, k * 24); c.stroke(); }
    const g = c.createLinearGradient(-60, -60, 60, 60); g.addColorStop(0, mix('#E8E8EC', '#FFF0B8', val)); g.addColorStop(.5, mix('#8a8c92', '#D8A848', val)); g.addColorStop(1, mix('#4a4c52', '#7a5418', val));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 62, 0, 6.283); c.fill(); c.fillRect(58, -10, 14, 20); // boîtier, couronne
    c.fillStyle = mix('#F4F2EE', '#1a2a3a', val * .9); c.beginPath(); c.arc(0, 0, 50, 0, 6.283); c.fill(); // cadran
    c.strokeStyle = mix('#3a3a40', '#E8C878', val); c.lineWidth = 3; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; c.beginPath(); c.moveTo(Math.cos(a) * 40, Math.sin(a) * 40); c.lineTo(Math.cos(a) * 46, Math.sin(a) * 46); c.stroke(); }
    c.lineCap = 'round'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(-1.2) * 26, Math.sin(-1.2) * 26); c.stroke();
    c.lineWidth = 3; const a = t * .5 - 1.57; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 38, Math.sin(a) * 38); c.stroke();
    if (glint > 0) { c.globalCompositeOperation = 'screen'; const gx = Math.sin(t * 1.3) * 40; const gg = c.createRadialGradient(gx - 10, -20, 0, gx - 10, -20, 40); gg.addColorStop(0, rgba('#FFFFFF', .55 * glint)); gg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gg; c.beginPath(); c.arc(0, 0, 62, 0, 6.283); c.fill(); }
    c.restore();
    if (val > .05) glow(c, x, y, 140 * s, '#FFD98A', .45 * val);
  }

  /* =====================================================================
     DÉCOR 1 — LA VITRINE ÉCLAIRÉE (les passants à contre-jour)
     ===================================================================== */
  const WIN = { x0: 80, x1: 1000, y0: 520, y1: 1700 };
  function drawShopStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, 560); g.addColorStop(0, '#2c3a5c'); g.addColorStop(1, '#6a6a8e'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 600 + LM); // ciel du soir
    c.fillStyle = '#4a3e36'; c.fillRect(-LM, 380, W + 2 * LM, 1400); c.fillStyle = '#5a4c42'; c.fillRect(-LM, 380, W + 2 * LM, 30); // façade
    const r = rng(4); c.fillStyle = 'rgba(0,0,0,.12)'; for (let k = 0; k < 40; k++) c.fillRect(-LM + r() * (W + 2 * LM), 410 + r() * 1300, 60 + r() * 80, 3);
    c.fillStyle = '#B8964A'; c.fillRect(300, 430, 480, 60); c.fillStyle = '#8a6e30'; c.fillRect(310, 440, 460, 40); // enseigne (sans marque)
    // l'intérieur, très lumineux
    g = c.createRadialGradient(540, 1050, 60, 540, 1100, 760); g.addColorStop(0, '#FFF8EA'); g.addColorStop(.55, '#F6E2C0'); g.addColorStop(1, '#D8B88A'); c.fillStyle = g; c.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
    c.fillStyle = 'rgba(160,120,70,.25)'; [800, 1360].forEach(y => c.fillRect(WIN.x0, y, WIN.x1 - WIN.x0, 14)); // étagères
    [[200, 760], [880, 760], [210, 1320], [870, 1320]].forEach(([x, y]) => { c.fillStyle = 'rgba(120,90,50,.28)'; c.beginPath(); c.roundRect(x - 50, y - 70, 100, 70, 8); c.fill(); }); // écrins
    c.fillStyle = '#6a1e2a'; c.beginPath(); c.ellipse(540, 1170, 170, 46, 0, 0, 6.283); c.fill(); c.fillStyle = '#8a2a38'; c.beginPath(); c.ellipse(540, 1150, 150, 40, 0, 0, 6.283); c.fill(); // coussin de velours
    c.strokeStyle = '#2a2018'; c.lineWidth = 22; c.strokeRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); c.strokeStyle = '#C0A060'; c.lineWidth = 4; c.strokeRect(WIN.x0 + 10, WIN.y0 + 10, WIN.x1 - WIN.x0 - 20, WIN.y1 - WIN.y0 - 20); // cadre
    g = c.createLinearGradient(0, WIN.y1, 0, H + LM); g.addColorStop(0, '#8a7058'); g.addColorStop(1, '#3a3028'); c.fillStyle = g; c.fillRect(-LM, WIN.y1 + 10, W + 2 * LM, H); // trottoir mouillé
    c.fillStyle = 'rgba(255,240,210,.18)'; c.fillRect(WIN.x0, WIN.y1 + 10, WIN.x1 - WIN.x0, 300); // reflet de la vitrine
  }
  const SHOP = prerender(drawShopStatic, 1.2);
  function scene1(c, t) {
    const zp = prog(t, 0, T.s2 + .5, 'inOutSine');
    camSafe(c, lerp(1.0, 1.14, zp), 540, lerp(1100, 1060, zp));
    blit(c, SHOP);
    [[360, '#FFF2D8'], [720, '#FFF2D8']].forEach(([x, col]) => beam(c, x, WIN.y0 + 20, 470, 1150, 610, 1150, col, .22, 20)); // spots
    watch(c, 540, 1090, .9, .15 + .25 * prog(t, T.desirs - .3, T.desirs + .8, 'inOutSine'), t);
    c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = .12; c.strokeStyle = '#FFFFFF'; c.lineWidth = 60; [[160, 560, 520, 1700], [520, 560, 880, 1700]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); }); c.restore(); // reflets sur la vitre
    // les passants, à contre-jour devant la vitrine
    [[250, 1980, 1.08, .9], [560, 2010, 1.22, 1], [860, 1985, 1.05, .9]].forEach(([x, y, s, a]) => rimmed(c, cc => bustSil(cc, x, y, s, 1), { body: '#1a1210', rim: '#FFE8C0', rimA: .9, dx: 0, dy: 5, alpha: a }));
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0e1220', .7, 620);
    vignette(c, .45, '#05060a');
    flash(c, '#000000', 1 - prog(t, 0, .8, 'outCubic'));
  }

  /* =====================================================================
     DÉCOR 2 — LA GALERIE CLAIRE ET LE PIÉDESTAL : le regard des autres
     ===================================================================== */
  function drawGalleryStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, 1270); g.addColorStop(0, '#C9C1B4'); g.addColorStop(.5, '#E6E0D6'); g.addColorStop(1, '#D6CEC2'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 1270 + LM); // murs clairs
    g = c.createLinearGradient(0, 1270, 0, H + LM); g.addColorStop(0, '#BDB3A4'); g.addColorStop(1, '#8a8072'); c.fillStyle = g; c.fillRect(-LM, 1270, W + 2 * LM, H); // sol
    c.strokeStyle = 'rgba(90,80,66,.18)'; c.lineWidth = 2; for (let k = -8; k <= 8; k++) { c.beginPath(); c.moveTo(540 + k * 40, 1270); c.lineTo(540 + k * 260, H + LM); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.35)'; [[-60, 260], [880, 260]].forEach(([x, w]) => c.fillRect(x, 120, w, 760)); // grandes baies de lumière
    c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.ellipse(540, 1275, 160, 20, 0, 0, 6.283); c.fill();
    g = c.createLinearGradient(440, 0, 640, 0); g.addColorStop(0, '#F6F4F0'); g.addColorStop(1, '#CFC9C0'); c.fillStyle = g; c.fillRect(450, 1010, 180, 262); c.fillStyle = '#FAF8F4'; c.fillRect(430, 990, 220, 24); // piédestal
  }
  const GALL = prerender(drawGalleryStatic, 1.2);
  function briefcase(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#5a3a22'; c.beginPath(); c.roundRect(-80, -50, 160, 110, 12); c.fill(); c.strokeStyle = '#3a2414'; c.lineWidth = 8; c.beginPath(); c.roundRect(-28, -78, 56, 34, 10); c.stroke(); c.fillStyle = '#C8A050'; c.fillRect(-12, -6, 24, 14); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-80, 0); c.lineTo(80, 0); c.stroke(); c.restore(); }
  function mannequin(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#E8DCC8'; c.beginPath(); c.moveTo(-46, -100); c.quadraticCurveTo(-60, -40, -30, 0); c.quadraticCurveTo(-48, 50, -40, 90); c.lineTo(40, 90); c.quadraticCurveTo(48, 50, 30, 0); c.quadraticCurveTo(60, -40, 46, -100); c.quadraticCurveTo(0, -116, -46, -100); c.fill(); c.fillStyle = '#6a4a2a'; c.fillRect(-5, 90, 10, 40); c.fillRect(-30, 128, 60, 8); c.restore(); }
  function rings(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 12; c.strokeStyle = '#D8A848'; c.beginPath(); c.arc(-24, 0, 40, 0, 6.283); c.stroke(); c.strokeStyle = '#B8B8C0'; c.beginPath(); c.arc(24, 0, 40, 0, 6.283); c.stroke(); c.strokeStyle = '#D8A848'; c.beginPath(); c.arc(-24, 0, 40, -.5, .5); c.stroke(); c.restore(); }
  const OBJS = [['montre', 'une montre'], ['metier', 'un métier'], ['silhouette', 'une silhouette'], ['relation', 'une relation']];
  const VIEW = [[150, 1, '#FFF6E6'], [300, 1, '#FFF6E6'], [780, -1, '#FFF6E6'], [930, -1, '#FFF6E6']];
  function scene2(c, t) {
    const zp = prog(t, T.s2, T.s3, 'inOutSine');
    camSafe(c, lerp(1.1, 1.0, zp), 540, lerp(1020, 1060, zp));
    blit(c, GALL);
    const back = prog(t, T.objet - .3, T.objet + .2, 'inOutCubic'); // retour à la montre : « l'objet ne change pas »
    let k = -1; OBJS.forEach(([w], i) => { if (t >= T[w] - .15) k = i; });
    const pop = k >= 0 ? prog(t, T[OBJS[k][0]] - .15, T[OBJS[k][0]] + .25, 'outBack') : 0;
    const val = prog(t, T.valeur - .25, T.valeur + .5, 'outCubic');
    if (back > .5 || k === 0) watch(c, 540, 900, .95 * (back > .5 ? 1 : pop), back > .5 ? val : .1, t, .6);
    else if (k === 1) briefcase(c, 540, 930, 1.1 * pop); else if (k === 2) mannequin(c, 540, 860, 1.0 * pop); else if (k === 3) rings(c, 540, 920, 1.1 * pop);
    if (k >= 0 && back < .5) { c.save(); c.globalAlpha = pop * (1 - 2 * back); c.font = 'italic 400 50px Instrument'; c.fillStyle = '#3a2e22'; c.textAlign = 'center'; c.fillText(OBJS[k][1], 540, 740); c.restore(); }
    if (back > .5 && t < T.regard) { c.save(); c.globalAlpha = (back - .5) * 2 * (1 - prog(t, T.s2c - .2, T.s2c + .2, 'linear')); c.font = 'italic 400 48px Instrument'; c.fillStyle = '#3a2e22'; c.textAlign = 'center'; c.fillText('l’objet ne change pas', 540, 740); c.restore(); }
    // les regards des autres
    const ap = prog(t, T.regard - .5, T.autres + .3, 'outCubic');
    if (ap > 0) VIEW.forEach(([x, f], i) => {
      const a = clamp(ap * 1.6 - i * .15); if (a <= 0) return;
      LIGHT(c, x, 1100, 150, .35 * a);
      const o = person(c, { x, y: 1268, s: 1.55, f, phone: 0, head: .06, alpha: a }, '#FFF6E6', 2);
      const hx = x + f * 22, hy = 1268 - 262; const g = prog(t, T.autres - .2 + i * .08, T.autres + .5 + i * .08, 'outCubic');
      if (g > 0) { c.save(); c.setLineDash([10, 12]); c.lineDashOffset = -t * 40; c.strokeStyle = rgba('#B8862A', .75 * g); c.lineWidth = 3; c.beginPath(); c.moveTo(hx, hy); c.lineTo(lerp(hx, 540, g), lerp(hy, 900, g)); c.stroke(); c.restore(); }
    });
    if (val > 0) { const r = rng(5); for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = (60 + r() * 160) * val; c.fillStyle = rgba('#FFE7A0', (1 - val * .6) * .9); c.beginPath(); c.arc(540 + Math.cos(a) * d, 900 + Math.sin(a) * d, 3 + r() * 3, 0, 6.283); c.fill(); } }
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#2a2218', .66, 600);
    vignette(c, .35, '#2a2218');
  }

  /* =====================================================================
     DÉCOR 3 — LE TRIANGLE MIMÉTIQUE, sur papier (René Girard)
     ===================================================================== */
  function drawPaperStatic(c) {
    let g = c.createRadialGradient(540, 1000, 200, 540, 1000, 1200); g.addColorStop(0, '#F4ECDA'); g.addColorStop(1, '#D8C8A6'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(120,90,50,.08)'; c.lineWidth = 1.5; for (let x = -LM; x < W + LM; x += 54) { c.beginPath(); c.moveTo(x, -LM); c.lineTo(x, H + LM); c.stroke(); } for (let y = -LM; y < H + LM; y += 54) { c.beginPath(); c.moveTo(-LM, y); c.lineTo(W + LM, y); c.stroke(); }
    const r = rng(19); for (let k = 0; k < 12; k++) { const x = r() * W, y = r() * H, rr = 40 + r() * 120; const gg = c.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, 'rgba(150,110,60,.08)'); gg.addColorStop(1, 'rgba(150,110,60,0)'); c.fillStyle = gg; c.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
    c.strokeStyle = 'rgba(80,60,40,.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(80, 1262); c.lineTo(1000, 1262); c.stroke(); // la ligne du sol, à l'encre
  }
  const PAPER = prerender(drawPaperStatic, 1.2);
  const OBJ = [540, 800];
  function inkLine(c, a, b, p, col, w = 4, dash = null) { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(...a); c.lineTo(lerp(a[0], b[0], p), lerp(a[1], b[1], p)); c.stroke(); c.restore(); }
  function label(c, txt, x, y, a, col = '#3a2a1a', fs = 30) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `600 ${fs}px Fraunces`; c.fillStyle = col; c.textAlign = 'center'; c.fillText(txt, x, y); c.restore(); }
  function scene3(c, t) {
    const zp = prog(t, T.s3, T.s4, 'inOutSine');
    camSafe(c, lerp(1.06, 1.0, zp), 540, lerp(1020, 1050, zp));
    blit(c, PAPER);
    const fig = prog(t, T.s3c - .4, T.s3c + .4, 'outCubic'), riv = prog(t, T.rival - .35, T.rival + .4, 'inOutCubic');
    const sx = lerp(230, 350, riv), mx = lerp(850, 760, riv);
    const S = [sx + 20, 1262 - 300], M = [mx - 20, 1262 - 300];
    // le désir « en ligne droite » (pas seulement…)
    const dl = prog(t, T.choses - .3, T.choses + .5, 'outCubic');
    inkLine(c, S, OBJ, dl, rgba('#3a2a1a', .5 * (1 - .5 * prog(t, T.observant - .3, T.observant + .3, 'linear'))), 3, [6, 10]);
    // … le triangle : sujet → modèle → objet
    const sm = prog(t, T.observant - .3, T.observant + .5, 'outCubic'), mo = prog(t, T.possedent - .3, T.possedent + .5, 'outCubic');
    const red = riv;
    inkLine(c, S, M, sm, mix('#B8862A', C.red, red), 5 + 3 * red, red > .3 ? null : [14, 10]);
    inkLine(c, M, OBJ, mo, '#3a2a1a', 4);
    if (red > 0) { c.save(); c.strokeStyle = rgba(C.red, .8 * red); c.lineWidth = 3; c.beginPath(); for (let k = 0; k <= 20; k++) { const u = k / 20; c.lineTo(lerp(S[0], M[0], u), lerp(S[1], M[1], u) - 40 + (k % 2 ? -14 : 14) * red); } c.stroke(); c.restore(); } // l'éclair de la rivalité
    if (mo > .3) { const u = (t * .45) % 1, P = u < .5 ? [lerp(S[0], M[0], u * 2), lerp(S[1], M[1], u * 2)] : [lerp(M[0], OBJ[0], (u - .5) * 2), lerp(M[1], OBJ[1], (u - .5) * 2)]; glow(c, P[0], P[1], 40, '#E8A848', .8 * (mo - .3) * (1 - red)); } // le désir passe par le modèle
    const ow = prog(t, T.s3c - .2, T.s3c + .4, 'outCubic');
    if (ow > 0) { c.save(); c.globalAlpha = ow; watch(c, OBJ[0], OBJ[1], .8, .35 + .4 * mo, t); c.restore(); }
    if (fig > 0) {
      LIGHT(c, sx, 1110, 170, .25 * fig); LIGHT(c, mx, 1110, 170, .25 * fig);
      person(c, { x: sx, y: 1262, s: 1.7, f: 1, phone: 0, head: -.12, alpha: fig, hand: riv > .05 ? [lerp(sx + 60, 470, riv), lerp(1110, 900, riv)] : null }, '#FFF4DE', 2);
      person(c, { x: mx, y: 1262, s: 1.7, f: -1, phone: 0, head: -.05, alpha: fig, hand: [lerp(mx - 60, 610, Math.max(mo, riv)), lerp(1110, 900, Math.max(mo, riv))] }, '#FFF4DE', 2);
    }
    label(c, 'SUJET', sx, 1310, fig); label(c, 'OBJET', OBJ[0], OBJ[1] - 120, ow);
    const ml = prog(t, T.modele - .2, T.modele + .4, 'outCubic');
    label(c, 'MODÈLE', mx, 1310, fig * (1 - red), mix('#3a2a1a', '#A8761A', ml), 30 + 6 * ml);
    label(c, 'RIVAL', mx, 1310, red, C.red, 36);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#2a1e12', .78, 560);
    vignette(c, .35, '#3a2a18');
  }

  /* =====================================================================
     DÉCOR 4 — LA MAIN ET LE SABLE (la deuxième Noble Vérité)
     ===================================================================== */
  function drawSaffronStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#F4DCA8'); g.addColorStop(.55, '#EAB46A'); g.addColorStop(.78, '#C8864A'); g.addColorStop(1, '#8a5428'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.fillStyle = '#9a6030'; c.beginPath(); c.moveTo(-LM, 1560); c.quadraticCurveTo(540, 1520, W + LM, 1570); c.lineTo(W + LM, H + LM); c.lineTo(-LM, H + LM); c.fill(); // la terre
  }
  const SAFF = prerender(drawSaffronStatic, 1.2);
  const ROOTS = (() => { const r = rng(23), out = []; for (let k = 0; k < 7; k++) { let x = 600 + (r() - .5) * 80, y = 1080; const pts = [[x, y]]; const dx = (r() - .5) * 2.4; for (let i = 0; i < 14; i++) { x += dx * 18 + (r() - .5) * 26; y += 38; pts.push([x, y]); } out.push(pts); } return out; })();
  const CRACKS = (() => { const r = rng(31), out = []; for (let k = 0; k < 9; k++) { let x = 100 + r() * 880, y = 1580 + r() * 200; const pts = [[x, y]]; for (let i = 0; i < 6; i++) { x += (r() - .5) * 110; y += 20 + r() * 30; pts.push([x, y]); } out.push(pts); } return out; })();
  const ARM = cc => { cc.beginPath(); cc.moveTo(1240, 900); cc.quadraticCurveTo(960, 915, 700, 935); cc.lineTo(700, 1060); cc.quadraticCurveTo(960, 1085, 1240, 1110); cc.closePath(); cc.fill(); };
  function fistPath(cc) { // le poing serré, doigts repliés vers nous
    ARM(cc); cc.beginPath(); cc.roundRect(520, 880, 220, 200, 56); cc.fill();
    for (let i = 0; i < 4; i++) { cc.beginPath(); cc.roundRect(492 + i * 4, 892 + i * 46, 210, 50, 25); cc.fill(); }
    cc.lineCap = 'round'; cc.lineWidth = 46; cc.beginPath(); cc.moveTo(712, 900); cc.quadraticCurveTo(640, 868, 560, 884); cc.stroke(); // le pouce
  }
  function openPath(cc) { // la main ouverte, paume vers le haut
    ARM(cc); cc.beginPath(); cc.ellipse(640, 990, 140, 74, -.08, 0, 6.283); cc.fill();
    cc.lineCap = 'round'; [[528, 960, -2.55, 118, 34], [540, 990, -2.85, 132, 34], [552, 1020, -3.1, 124, 32], [574, 1046, 2.95, 104, 28]].forEach(([x, y, a, l, w]) => { cc.lineWidth = w; cc.beginPath(); cc.moveTo(x, y); cc.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * .55); cc.stroke(); });
    cc.lineWidth = 40; cc.beginPath(); cc.moveTo(640, 1040); cc.quadraticCurveTo(560, 1090, 500, 1086); cc.stroke(); // le pouce
  }
  function hand(c, open) {
    if (open < 1) { rimmed(c, fistPath, { body: '#2a1810', rim: '#FFF0C8', rimA: .9, dx: 0, dy: -4, alpha: 1 - open });
      c.save(); c.globalAlpha = (1 - open) * .55; c.strokeStyle = '#C89A6A'; c.lineWidth = 3; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(508 + i * 4, 892 + i * 46); c.quadraticCurveTo(600 + i * 4, 884 + i * 46, 690 + i * 4, 892 + i * 46); c.stroke(); } c.restore(); } // les plis des doigts
    if (open > 0) { rimmed(c, openPath, { body: '#2a1810', rim: '#FFF0C8', rimA: .9, dx: 0, dy: -4, alpha: open });
      c.save(); c.globalAlpha = open * .45; c.strokeStyle = '#C89A6A'; c.lineWidth = 3; c.beginPath(); c.moveTo(560, 1000); c.quadraticCurveTo(640, 1030, 720, 990); c.stroke(); c.restore(); } // la ligne de la paume
  }
  function scene4(c, t) {
    const zp = prog(t, T.s4, T.s5, 'inOutSine');
    camSafe(c, lerp(1.06, 1.0, zp), 560, lerp(1040, 1060, zp));
    blit(c, SAFF);
    const open = prog(t, T.maniere - .3, T.attachons + .5, 'inOutCubic');
    glow(c, 640, 980, 420, '#FFF4D8', .35 + .25 * open);
    const rp = prog(t, T.racines - .6, T.racines + .9, 'inOutSine') * (1 - open);
    const cr = prog(t, T.souffrance - .3, T.souffrance + .6, 'outCubic') * (1 - open);
    if (cr > 0) CRACKS.forEach(pts => { c.save(); c.strokeStyle = rgba('#3a1a0a', .7 * cr); c.lineWidth = 3; strokeProg(c, pts, cr); c.strokeStyle = rgba('#FF6A4A', .5 * cr); c.lineWidth = 1.5; c.shadowColor = '#FF6A4A'; c.shadowBlur = 10; strokeProg(c, pts, cr); c.restore(); });
    if (rp > 0) ROOTS.forEach((pts, i) => { c.save(); c.strokeStyle = rgba('#3a2010', .85); c.lineWidth = 7 - i * .5; c.lineCap = 'round'; strokeProg(c, pts, clamp(rp * 1.3 - i * .05)); c.restore(); });
    // le sable qui s'écoule du poing… puis qui repose dans la main ouverte
    const r = rng(7);
    if (open < .9) for (let i = 0; i < 70; i++) { const u = (t * (.5 + r() * .3) + r()) % 1, x = 590 + (r() - .5) * 40 + u * 6, y = 1080 + u * 470; c.fillStyle = rgba('#F6D27A', (1 - u) * .9 * (1 - open)); c.fillRect(x, y, 3, 3); }
    hand(c, open);
    if (open > 0) { c.fillStyle = rgba('#F2C860', open); c.beginPath(); c.ellipse(640, 952, 100 * open, 34 * open, 0, Math.PI, 2 * Math.PI); c.fill(); glow(c, 640, 930, 130, '#FFE8A0', .5 * open); }
    const wv = prog(t, T.desirons4 - .4, T.desirons4 + .4, 'outCubic');
    if (wv > 0) watch(c, 640, lerp(760, 720, open), .6, .4 * (1 - open), t, .5 + .5 * open);
    [['la soif', 'soif', 300, 1170, [560, 1180]], ['l’attachement', 'attachement', 850, 1190, [680, 1240]]].forEach(([txt, w, x, y, [ax, ay]]) => {
      const a = prog(t, T[w] - .15, T[w] + .4, 'outCubic') * (1 - open); if (a <= 0) return;
      c.save(); c.globalAlpha = a; c.strokeStyle = 'rgba(42,24,16,.55)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + (x < 540 ? 70 : -90), y - 12); c.lineTo(ax, ay); c.stroke();
      c.font = 'italic 400 50px Instrument'; c.fillStyle = '#2a1810'; c.textAlign = 'center'; c.fillText(txt, x, y); c.restore(); });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#3a200e', .78, 640);
    vignette(c, .35, '#4a2a10');
  }

  /* =====================================================================
     DÉCOR 5 — LA VILLE DES ÉCRANS, au crépuscule (les algorithmes)
     ===================================================================== */
  const BOARDS = [[300, 560, 480, 500, 0], [-120, 640, 380, 360, 1], [820, 620, 380, 380, 2]];
  const BOARDS2 = [[-60, 220, 300, 300], [780, 200, 340, 320], [180, 160, 260, 240], [560, 120, 240, 220], [-120, 1000, 220, 200], [980, 980, 220, 220]];
  function drawCityStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, 1200); g.addColorStop(0, '#4a3a7a'); g.addColorStop(.55, '#C86A8A'); g.addColorStop(1, '#F6B07A'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 1200 + LM);
    const r = rng(8); c.fillStyle = '#2e2440'; for (let x = -LM; x < W + LM; x += 90) { const h = 300 + r() * 700; c.fillRect(x, 1200 - h, 84, h); } // immeubles
    c.fillStyle = 'rgba(255,220,160,.35)'; for (let k = 0; k < 160; k++) c.fillRect(-LM + r() * (W + 2 * LM), 500 + r() * 680, 6, 9);
    g = c.createLinearGradient(0, 1200, 0, H + LM); g.addColorStop(0, '#D8A8B8'); g.addColorStop(.4, '#9a6a8a'); g.addColorStop(1, '#3a2a44'); c.fillStyle = g; c.fillRect(-LM, 1200, W + 2 * LM, H); // la place, claire et luisante
  }
  const CITY = prerender(drawCityStatic, 1.2);
  function adContent(c, x, y, w, h, kind, mod, t) { // affiche : avant (produits variés) → après (des modèles avec leur montre)
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, mix(['#FFE0C8', '#D8F0FF', '#FFF0B0'][kind], '#FFF4E0', mod)); g.addColorStop(1, mix(['#F6A0A0', '#7AB8E8', '#F2C860'][kind], '#E8C890', mod)); c.fillStyle = g; c.fillRect(x, y, w, h);
    if (mod < 1) { c.globalAlpha = 1 - mod; c.fillStyle = ['#C83A4A', '#2a5a9a', '#B8862A'][kind]; if (kind === 0) { c.beginPath(); c.roundRect(x + w * .4, y + h * .3, w * .2, h * .45, 10); c.fill(); } if (kind === 1) { c.beginPath(); c.ellipse(x + w / 2, y + h * .6, w * .3, h * .14, 0, 0, 6.283); c.fill(); } if (kind === 2) { c.beginPath(); c.arc(x + w / 2, y + h / 2, Math.min(w, h) * .22, 0, 6.283); c.fill(); } c.globalAlpha = 1; }
    if (mod > 0) { c.globalAlpha = mod; rimmed(c, cc => personPath(cc, { x: x + w * .4, y: y + h * .98, s: h / 260, f: 1, phone: 0, hand: [x + w * .62, y + h * .45] }), { body: '#2a1e18', rim: '#FFFFFF', rimA: .6, dx: 2, alpha: mod }); watch(c, x + w * .64, y + h * .42, h / 900, .9, t, 1); }
    c.restore(); c.strokeStyle = 'rgba(20,14,30,.8)'; c.lineWidth = 8; c.strokeRect(x, y, w, h);
  }
  function scene5(c, t) {
    const zp = prog(t, T.s5, T.s6, 'inOutSine');
    camSafe(c, lerp(1.08, 1.0, zp), 540, lerp(1040, 1000, zp));
    blit(c, CITY);
    const mod = BOARDS.map((b, i) => prog(t, T.interactions - .2 + i * .35, T.interactions + .6 + i * .35, 'inOutCubic'));
    BOARDS.forEach(([x, y, w, h, k], i) => { glow(c, x + w / 2, y + h / 2, w * .8, '#FFF0E0', .25); adContent(c, x, y, w, h, k, mod[i], t); });
    const more = prog(t, T.univers - .4, T.attention + .4, 'outCubic');
    if (more > 0) BOARDS2.forEach(([x, y, w, h], i) => { const a = clamp(more * 1.6 - i * .12); if (a <= 0) return; c.save(); c.globalAlpha = a; adContent(c, x, y + (1 - a) * 40, w, h, i % 3, 1, t); c.restore(); });
    // des passants absorbés par leur téléphone (devant les affiches lumineuses)
    [[140, 1236, 1.35, 1], [930, 1240, 1.4, -1]].forEach(([x, y, s, f]) => person(c, { x, y, s, f, phone: 1, glow: 1, head: .25 }, '#FFF0F4', 2));
    // l'élève : ses interactions (cœurs) remontent vers les affiches
    const st = { x: 540, y: 1250, s: 1.9, f: 1, phone: 1, glow: 1, head: .22 };
    LIGHT(c, 540, 1060, 220, .3);
    const hp = person(c, st, '#FFF0F4', 2.5);
    const like = prog(t, T.personnalisent - .2, T.s5b + .6, 'linear');
    if (like > 0 && like < 1) { const r = rng(12); for (let i = 0; i < 12; i++) { const u = (like * 2.2 + r()) % 1, tx_ = BOARDS[i % 3][0] + BOARDS[i % 3][2] / 2, ty_ = BOARDS[i % 3][1] + BOARDS[i % 3][3] / 2; const x = lerp(hp.hand[0], tx_, u), y = lerp(hp.hand[1], ty_, u) - Math.sin(u * Math.PI) * 120; c.save(); c.globalAlpha = (1 - u) * .9; c.fillStyle = C.rose; c.translate(x, y); c.scale(.4, .4); c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-50, -4, -30, -50, 0, -22); c.bezierCurveTo(30, -50, 50, -4, 0, 30); c.fill(); c.restore(); } }
    const tap = prog(t, T.choisissent, T.place + .3, 'linear'); if (tap > 0 && tap < 1) { const p = (Math.sin(tap * 18) + 1) / 2; glow(c, hp.hand[0], hp.hand[1], 30 + 30 * p, '#FFFFFF', .6); } // c'est encore lui qui choisit
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#1e1630', .72, 620);
    vignette(c, .4, '#140e20');
  }

  /* =====================================================================
     DÉCOR 6 — LE VERTIGE : une spirale d'écrans, vue d'en haut
     ===================================================================== */
  function scene6(c, t) {
    const p = prog(t, T.s6 - .5, T.s7 + .6, 'inOutSine');
    c.setTransform(1, 0, 0, 1, 0, 0);
    let g = c.createRadialGradient(540, 1060, 20, 540, 1060, 1100); g.addColorStop(0, '#FFF8EC'); g.addColorStop(.35, '#E8C8D8'); g.addColorStop(1, '#5a3a6a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(540, 1060); c.rotate(p * 2.2); c.scale(1 + p * 1.6, 1 + p * 1.6);
    for (let i = 0; i < 46; i++) { const a = i * .55, d = 60 + i * 15, w = 30 + i * 2.2, h = w * .62; c.save(); c.rotate(a); c.translate(d, 0); c.rotate(Math.PI / 2);
      c.fillStyle = mix('#FFF4E8', ['#F6A0A0', '#7AB8E8', '#F2C860'][i % 3], .5); c.fillRect(-w / 2, -h / 2, w, h); c.strokeStyle = 'rgba(30,20,40,.7)'; c.lineWidth = 2; c.strokeRect(-w / 2, -h / 2, w, h); c.restore(); }
    c.restore();
    glow(c, 540, 1060, 160, '#FFFFFF', .6);
    rimmed(c, cc => personPath(cc, { x: 540, y: 1100, s: .35 + p * .5, f: 1, phone: 1 }), { body: '#1a1018', rim: '#FFFFFF', rimA: .6, dx: 1 }); // l'élève, minuscule au centre
    topShade(c, '#1e1424', .7, 600);
    vignette(c, .5, '#140a18');
  }

  /* =====================================================================
     DÉCOR 7 — LE DÉSERT DE SEL : plus personne pour voir
     ===================================================================== */
  function drawSaltStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, 1060); g.addColorStop(0, '#9fb2c8'); g.addColorStop(.6, '#d8e0ea'); g.addColorStop(1, '#F6EFE4'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 1060 + LM);
    g = c.createLinearGradient(0, 1060, 0, H + LM); g.addColorStop(0, '#F2ECE2'); g.addColorStop(1, '#C8C0B4'); c.fillStyle = g; c.fillRect(-LM, 1060, W + 2 * LM, H);
    c.strokeStyle = 'rgba(120,110,96,.18)'; c.lineWidth = 2; const r = rng(29); // les polygones du sel
    for (let k = 0; k < 120; k++) { const z = 1 + r() * 6, x = 540 + (r() - .5) * 2400 / z, y = 1060 + 900 / z; const s = 70 / z; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.lineTo(x + Math.cos(a) * s * 1.6, y + Math.sin(a) * s * .45); } c.closePath(); c.stroke(); }
  }
  const SALT = prerender(drawSaltStatic, 1.2);
  const CROWD = (() => { const r = rng(51), out = []; for (let i = 0; i < 15; i++) { const side = i % 3, x = [80 + r() * 300, 700 + r() * 300, 320 + r() * 440][side], y = 1070 + r() * 70; out.push({ x, y, s: .5 + (y - 1070) / 260, f: x < 540 ? 1 : -1, g: side }); } return out.sort((a, b) => a.y - b.y); })();
  function scene7(c, t) {
    const zp = prog(t, T.s7, T.title + 1, 'inOutSine');
    camSafe(c, lerp(1.0, 1.1, zp), 540, lerp(1080, 1040, zp));
    blit(c, SALT);
    glow(c, 540, 1060, 700, '#FFF6E8', .35);
    const gone = [T.admirer, T.envier, T.voir].map(x => prog(t, x - .1, x + .7, 'inOutSine'));
    CROWD.forEach(p => { const a = 1 - gone[p.g]; if (a <= .01) return;
      person(c, { x: p.x, y: p.y - (1 - a) * 30, s: p.s, f: p.f, phone: 0, head: .05, alpha: .85 * a }, '#FFFFFF', 1);
      if (p.g === 0) { c.save(); c.globalAlpha = a * .8; c.fillStyle = C.rose; c.font = `${Math.round(26 * p.s)}px Inter`; c.textAlign = 'center'; c.fillText('♥', p.x, p.y - 200 * p.s); c.restore(); }
      if (p.g === 1) { c.save(); c.globalAlpha = a * .8; c.fillStyle = '#6a9a4a'; c.font = `${Math.round(28 * p.s)}px Inter`; c.textAlign = 'center'; c.fillText('★', p.x, p.y - 200 * p.s); c.restore(); }
      if (p.g === 2) { c.save(); c.globalAlpha = a * .8; c.strokeStyle = '#3a3a48'; c.lineWidth = 2; c.beginPath(); c.ellipse(p.x, p.y - 200 * p.s, 12 * p.s, 6 * p.s, 0, 0, 6.283); c.stroke(); c.fillStyle = '#3a3a48'; c.beginPath(); c.arc(p.x, p.y - 200 * p.s, 3 * p.s, 0, 6.283); c.fill(); c.restore(); } });
    LIGHT(c, 540, 1180, 240, .35);
    const look = prog(t, T.poursuivons - .2, T.desirer + .4, 'inOutSine');
    const o = person(c, { x: 540, y: 1420, s: 2.1, f: 1, phone: .55, head: .1 + .2 * look }, '#FFFFFF', 2.5);
    watch(c, o.hand[0] + 8, o.hand[1] - 10, .32, lerp(.7, .35, look), t, 1);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#1e2430', .66, 680);
    c.fillStyle = rgba('#120c0a', .72 * prog(t, T.qEnd, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .35, '#2a2a34');
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

  const SCN = [[0, T.s2, scene1], [T.s2, T.s3, scene2], [T.s3, T.s4, scene3], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5], [T.s6, T.s7, scene6], [T.s7, DUR + 1, scene7]];
  const TRS = [
    { at: T.s2, d: 1.1, kind: 'dissolve', a: scene1, b: scene2 },
    { at: T.s3, d: 1.1, kind: 'warm', a: scene2, b: scene3 },
    { at: T.s4, d: 1.1, kind: 'drift', a: scene3, b: scene4 },
    { at: T.s5, d: 1.1, kind: 'tilt', a: scene4, b: scene5, o: { dir: 1 } },
    { at: T.s6, d: .8, kind: 'dissolve', a: scene5, b: scene6 },
    { at: T.s7, d: 1.0, kind: 'warm', a: scene6, b: scene7 },
  ];
  function render(t) {
    const f = Math.round(t * 30);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    const tr = TRS.find(x => t >= x.at - x.d / 2 && t < x.at + x.d / 2);
    if (tr) { paint(bax, tr.a, t); paint(bbx, tr.b, t); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); KINDS[tr.kind](ctx, (t - tr.at + tr.d / 2) / tr.d, tr.o || {}); }
    else { const sc = SCN.filter(([a, b]) => t >= a && t < b).pop() || SCN[SCN.length - 1]; sc[2](ctx, t); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    const sa = subAlpha(chunkAt(t), t); // un voile discret derrière les sous-titres (fonds clairs)
    if (sa > 0) { const g = ctx.createLinearGradient(0, 1230, 0, 1480); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.35, rgba('#0a080c', .34 * sa)); g.addColorStop(.7, rgba('#0a080c', .34 * sa)); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 1230, W, 250); }
    grain(ctx, f, .07);
    texts(t); subs(t);
  }
  function revealWords(nodes, t, t0, out) { nodes.forEach(n => { n.style.opacity = out > 0 && t > t0 - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const st = +s.dataset.t, p = prog(t, st - .04, st + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * out, blur: (1 - p) * 6 }); }); }); }
  let COVER = false;
  function texts(t) {
    (function () { const p = prog(t, .2, 1.3, 'outCubic'), o = 1 - prog(t, T.q1 + .2, T.q1 + .6, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    revealWords(tQ1, t, T.q1 + .5, COVER ? 0 : 1 - prog(t, T.s2 - .4, T.s2 - .1, 'inCubic'));
    const e2 = T.s3 - .35;
    slam(tReg, t, T.regard - .1, e2, .3); fade(tVal, t, T.valeur - .25, e2, .5, 12, .3);
    const e3 = T.s3c - .25;
    slam(tGir, t, T.girard - .1, e3, .3); fade(tGirSub, t, T.girard + .3, e3, .6, 8, .3); slam(tMim, t, T.desir3 - .1, e3, .3);
    const e3b = T.s4 - .35;
    tGq.forEach((n, k) => fade(n, t, T.s3d - .1 + k * .2, e3b, .6, 12, .3)); fade(tGqRef, t, T.s3d + .5, e3b, .6, 6, .3);
    const e4 = T.s5 - .35;
    fade(tNob, t, T.deuxieme - .15, T.s4c - .2, .5, 10, .25);
    tSn.forEach((n, k) => fade(n, t, T.deuxieme + .3 + k * .2, T.s4c - .2, .6, 12, .25)); fade(tSnRef, t, T.deuxieme + .9, T.s4c - .2, .6, 6, .25);
    fade(tMan1, t, T.s4c + .2, e4, .5, 12, .3); slam(tMan2, t, T.maniere - .1, e4, .3); fade(tMan3, t, T.attachons - .5, e4, .5, 12, .3);
    const e5 = T.s6 - .3;
    fade(tAlg, t, T.algorithmes - .15, e5, .5, 10, .3); fade(tInt, t, T.interactions - .3, T.s5b - .2, .5, 12, .25); fade(tTik, t, T.interactions, e5, .6, 4, .3);
    fade(tCho, t, T.s5b - .05, e5, .5, 12, .3); slam(tUni, t, T.univers - .1, e5, .3);
    const e6 = T.s7 - .3;
    fade(tVo, t, T.s6 + .25, e6, .4, 12, .25); slam(tVer, t, T.vertige - .1, e6, .25);
    revealWords(tQ7, t, T.q7, 1 - prog(t, T.title - .25, T.title + .15, 'inCubic'));
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores (la musique de fond est continue) ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7]].forEach(([n, x]) => sfx('sec_' + n, x));
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('city', .2, { d: T.s2 }); sfx('glow', T.desirs);
  OBJS.forEach(([w]) => sfx('chime', T[w])); sfx('glow', T.valeur);
  sfx('draw', T.choses - .3, { d: .8 }); sfx('draw', T.observant - .3, { d: .8 }); sfx('draw', T.possedent - .3, { d: .8 }); sfx('glow', T.modele); sfx('tension', T.rival - .2, { d: 1.6 });
  sfx('sand', T.s4, { d: T.maniere - T.s4 }); sfx('roots', T.racines - .5, { d: 1.5 }); sfx('glow', T.attachons);
  sfx('likes', T.personnalisent - .2, { d: T.s5b + .6 - T.personnalisent }); sfx('tap', T.choisissent); sfx('chime', T.univers);
  sfx('swirl', T.s6 - .3, { d: T.s7 - T.s6 + .8 }); sfx('wind', T.s7, { d: DUR - T.s7 - .5 }); [T.admirer, T.envier, T.voir].forEach(x => sfx('fadeout', x));
  sfx('question', T.q7); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : la vitrine, la montre, les passants à contre-jour
    COVER = true; render(Math.min(T.q1End, T.s2 - .7)); COVER = false;
    set(tSeries, { o: 1, blur: 0, s: 1, y: -10 }); tSeries.style.top = '80px';
    tQ1.forEach(n => { n.style.opacity = 0; });
    [tCovA, tCovB].forEach(n => set(n, { o: 1, blur: 0, s: 1 })); SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
