/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 007 — « Es-tu encore la même personne ? »
   Style validé (ép. 004 v2) : explication continue, une seule musique de fond, fondus enchaînés en mouvement.
   Décors nouveaux : la vieille photographie, le miroir ancien, le portrait de Locke (G. Kneller, 1697, domaine public)
   et le fil des souvenirs, la mémoire en mosaïque (neurosciences), le lac à l'aube (tradition bouddhiste),
   la statue dans la brume, la galerie des trois cadres.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, personPath, makeBrain, rng, off } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', rose: '#E8949A', lamp: '#F2C27D', sepia: '#E9D6B0', blue: '#8EC9FF', saff: '#F0A85A' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); if (!ws.length) throw new Error('repère introuvable : ' + id + ' « ' + w + ' »'); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', 'italic 700 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument'].map(f => document.fonts.load(f, 'Aaé')));
  const IMG = new Image(); IMG.src = 'assets/locke.jpg'; await IMG.decode();

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    enfant: cue('s1a', 'enfant'), visage: cue('s1a', 'visage'), familier: cue('s1a', 'familier'),
    s1b: SEN('s1b').start, adulte: cue('s1b', 'adulte'), reves: cue('s1b', 'reves'), croyances: cue('s1b', 'croyances'), aimer: cue('s1b', 'aimer'),
    s2: SEN('s2a').start - .3, q2: SEN('s2a').start, affirmer: cue('s2a', 'affirmer'), toujours: cue('s2a', 'toujours'), personne2: cue('s2a', 'personne'), q2End: SEN('s2a').end,
    s3: SEN('s3a').start - .3, siecle: cue('s3a', 'siecle'), john: cue('s3a', 'john'), troublante: cue('s3a', 'troublante'),
    s3b: SEN('s3b').start - .1, identite: cue('s3b', 'identite'), continuite: cue('s3b', 'continuite'), conscience3: cue('s3b', 'conscience'),
    s3c: SEN('s3c').start, reconnaitre: cue('s3c', 'reconnaitre'), passees: cue('s3c', 'passees'),
    s4: SEN('s4a').start - .3, neurosciences: cue('s4a', 'neurosciences'), memoire: cue('s4b', 'memoire'), enregistrement: cue('s4b', 'enregistrement'), fidele: cue('s4b', 'fidele'),
    s4c: SEN('s4c').start, reconstruit: cue('s4c', 'reconstruit'), modifiant: cue('s4c', 'modifiant'),
    s5: SEN('s5a').start - .3, bouddhiste: cue('s5a', 'bouddhiste'), s5b: SEN('s5b').start, corps: cue('s5b', 'corps'), sensations: cue('s5b', 'sensations'), pensees: cue('s5b', 'pensees'), conscience5: cue('s5b', 'conscience'),
    s5c: SEN('s5c').start, existence: cue('s5c', 'existence'), moi: cue('s5c', 'moi'), permanent: cue('s5c', 'permanent'), immuable: cue('s5c', 'immuable'),
    s6: SEN('s6a').start - .3, approches: cue('s6a', 'approches'), chose: cue('s6a', 'chose'), s6b: SEN('s6b').start, ebranlent: cue('s6b', 'ebranlent'), figee: cue('s6b', 'figee'),
    s7: SEN('s7a').start - .3, q7: SEN('s7a').start, merite: cue('s7a', 'merite'), ete: cue('s7b', 'ete'), sommes: cue('s7b', 'sommes'), devenir: cue('s7b', 'devenir'), qEnd: SEN('s7b').end,
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
  const ROSE = ['#FFF4F2', '#F6C9C6', '#E8949A'], GOLD = ['#FFFFFF', '#F3E6CC', C.gold], SEPIA = ['#FFFFFF', '#F4E6CA', '#D9B47A'], STONE = ['#FFFFFF', '#DCE0E6', '#9AA2AE'];
  const small = (txt, top, col = 'rgba(242,239,232,.85)') => fit(tx(txt, 'fraunces', Object.assign({ top: top + 'px', fontWeight: 600, fontSize: '32px', letterSpacing: '.22em', paddingLeft: '.22em', color: col }, CENTER)), 1010);
  const ital = (txt, top, fs, col = C.ivory) => { const n = tx(txt, 'instrument', Object.assign({ top: top + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col }, CENTER)); fit(n, 1000); return n; };
  const big = (txt, top, fs, pal = GOLD) => fit(tx(gspan(txt, ...pal, '10px .06em 4px'), 'bodoni', Object.assign({ top: top + 'px', fontWeight: 900, fontSize: fs + 'px', textShadow: 'none' }, CENTER)), 1010);
  const note = (txt, top, fs = 23, col = 'rgba(242,239,232,.72)') => fit(tx(txt, 'fraunces', Object.assign({ top: top + 'px', fontWeight: 500, fontSize: fs + 'px', letterSpacing: '.04em', color: col }, CENTER)), 1000);

  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;007</div>`, '', Object.assign({ top: '150px', textShadow: 'none' }, CENTER));
  // S1 — la vieille photographie
  const tPh = small('UNE PHOTOGRAPHIE D’UN ENFANT', 214);
  const tVis = big('UN VISAGE FAMILIER', 262, 96, SEPIA);
  // S2 — le miroir (la question, mot à mot)
  const Q2 = [[['Alors,', 'qu’est-ce', 'qui', 'permet', 'd’affirmer'], 64, 196, C.ivory], [['qu’il', 's’agit', 'toujours'], 64, 280, C.ivory], [['de', 'la', 'même', 'personne&#8239;?'], 104, 364, C.rose]];
  // S3 — John Locke
  const tLocke = big('JOHN LOCKE', 150, 104, GOLD);
  const tLockeSub = note('1632 – 1704 · <i>Essai sur l’entendement humain</i>', 282, 30, 'rgba(242,239,232,.88)');
  const tTroub = ital('une idée troublante', 340, 66, C.rose);
  const tCredit = note('Portrait par Godfrey Kneller, 1697 · musée de l’Ermitage · domaine public', 1452, 21, 'rgba(242,239,232,.6)');
  const tIdA = small('L’IDENTITÉ PERSONNELLE', 186, C.rose);
  const tIdB = big('CONTINUITÉ DE LA CONSCIENCE', 236, 74, GOLD);
  const tQuote = [ital('«&#8239;Aussi loin que cette conscience peut s’étendre', 190, 50), ital('en arrière vers une action ou une pensée passée,', 252, 50), ital('aussi loin s’étend l’identité de cette personne.&#8239;»', 314, 50, C.lamp)];
  const tQuoteRef = note('Locke, <i>Essai</i>, II, 27, § 9 (éd. 1694) · traduction libre', 384);
  // S4 — la mémoire reconstruite
  const tNeu = small('NEUROSCIENCES', 184, C.blue);
  const tMem1 = ital('La mémoire n’est pas', 236, 62);
  const tMem2 = big('UN ENREGISTREMENT FIDÈLE', 312, 76, STONE);
  const tRec = big('ELLE LE RECONSTRUIT', 236, 84, STONE);
  const tMod = ital('parfois en le modifiant', 346, 70, C.rose);
  const tSch = note('D. L. Schacter, «&#8239;Constructive memory: past and future&#8239;», <i>Dialogues in Clinical Neuroscience</i>, 2012', 1452, 21, 'rgba(242,239,232,.62)');
  // S5 — la tradition bouddhiste
  const tBud = small('LA TRADITION BOUDDHISTE', 184, C.saff);
  const tSn = [ital('«&#8239;Ceci n’est pas à moi, je ne suis pas ceci,', 238, 54), ital('ce n’est pas mon soi.&#8239;»', 302, 54, C.lamp)];
  const tSnRef = note('<i>Saṃyutta Nikāya</i> 22.59 · traduction libre d’après Bhikkhu Sujato', 372);
  // S6 — la statue dans la brume
  const tAp = ital('Ces approches ne disent pas la même chose.', 214, 60);
  const tEb = ital('Pourtant, elles ébranlent une certitude&#8239;:', 196, 58);
  const FIG = 'CELLE D’UNE IDENTITÉ FIGÉE';
  const tFigA = big(FIG, 270, 80, STONE), tFigB = big(FIG, 270, 80, STONE);
  tFigA.style.clipPath = 'polygon(0 0, 100% 0, 100% 38%, 0 62%)'; tFigB.style.clipPath = 'polygon(0 62%, 100% 38%, 100% 100%, 0 100%)';
  // S7 — la question finale, mot à mot
  const Q7 = [[['Alors,', 'qu’est-ce', 'qui', 'mérite'], 66, 190, C.ivory], [['notre', 'fidélité&#8239;:'], 100, 266, C.rose], [['la', 'personne', 'que', 'nous', 'avons', 'été,'], 62, 410, C.ivory],
    [['celle', 'que', 'nous', 'sommes,'], 62, 494, C.ivory], [['ou', 'celle', 'que', 'nous', 'pouvons', 'encore', 'devenir&#8239;?'], 62, 578, C.rose]];
  const keysOf = w => (w.replace(/&#\d+;/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']);
  function wordLines(lines, sids) {
    const words = sids.flatMap(id => SEN(id).words); let wi = 0;
    return lines.map(([ws, fs, y, col]) => fit(tx(ws.map(w => { const idx = wi; wi += keysOf(w).length;
      return `<span class="qw" data-t="${words[Math.min(idx, words.length - 1)].start}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)), 1010));
  }
  const tQ2 = wordLines(Q2, ['s2a']), tQ7 = wordLines(Q7, ['s7a', 's7b']);
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', Object.assign({ top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }, CENTER));
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', Object.assign({ top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose }, CENTER));
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', Object.assign({ top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' }, CENTER));
  // couverture seulement (jamais dans la vidéo)
  const tCovA = ital('Es-tu encore', 300, 100), tCovB = big('LA MÊME PERSONNE&#8239;?', 410, 96, ROSE);

  /* ---------- sous-titres ---------- */
  const NOSUB = new Set(['s2a', 's6a', 's6b', 's7a', 's7b']);
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
  const person = (c, p, rim, dx) => rimmed(c, cc => personPath(cc, p), { body: '#06070a', rim, rimA: .85, dx, alpha: p.alpha == null ? 1 : p.alpha });
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

  /* =====================================================================
     LES PHOTOGRAPHIES (pré-rendues une fois) : l'enfant (tirage ancien) et l'adulte
     ===================================================================== */
  const PAL_OLD = { bg0: '#EBD9B4', bg1: '#7a5a38', skin: '#F2E2C0', skinD: '#B48E62', hair: '#3e2a18', cloth: '#5a4430', collar: '#F6EEDC', ink: '#2e1e10' };
  const PAL_NEW = { bg0: '#C9D2D6', bg1: '#4e5a64', skin: '#E6BE9E', skinD: '#A87C60', hair: '#2e221a', cloth: '#34506a', collar: '#ECE8E0', ink: '#22160e' };
  function portraitFace(c, x, y, w, h, age, pal) {
    let g = c.createRadialGradient(x + w * .5, y + h * .38, 10, x + w * .5, y + h * .45, h * .78); g.addColorStop(0, pal.bg0); g.addColorStop(1, pal.bg1); c.fillStyle = g; c.fillRect(x, y, w, h);
    const cx = x + w * .5, s = w / 460, by = y + h;
    const shW = lerp(165, 215, age) * s, shY = by - lerp(150, 175, age) * s;
    const hy = y + h * lerp(.42, .37, age), hr = lerp(100, 84, age) * s, hry = lerp(112, 112, age) * s;
    c.fillStyle = pal.skinD; c.fillRect(cx - lerp(32, 40, age) * s, hy + hry * .55, lerp(64, 80, age) * s, shY - (hy + hry * .55) + 14 * s); // cou
    c.fillStyle = pal.cloth; c.beginPath(); c.moveTo(cx - shW - 50 * s, by + 4); c.bezierCurveTo(cx - shW - 20 * s, shY + 30 * s, cx - shW + 30 * s, shY, cx - 46 * s, shY - 4 * s);
    c.lineTo(cx + 46 * s, shY - 4 * s); c.bezierCurveTo(cx + shW - 30 * s, shY, cx + shW + 20 * s, shY + 30 * s, cx + shW + 50 * s, by + 4); c.closePath(); c.fill();
    c.fillStyle = pal.collar; [-1, 1].forEach(d => { c.beginPath(); c.moveTo(cx, shY + 6 * s); c.quadraticCurveTo(cx + d * 64 * s, shY - 14 * s, cx + d * 92 * s, shY + 22 * s); c.quadraticCurveTo(cx + d * 48 * s, shY + 50 * s, cx, shY + 6 * s); c.fill(); });
    c.fillStyle = pal.skinD; [-1, 1].forEach(d => { c.beginPath(); c.ellipse(cx + d * hr * .97, hy + 10 * s, 14 * s, 24 * s, 0, 0, 6.283); c.fill(); }); // oreilles
    g = c.createRadialGradient(cx - hr * .3, hy - hry * .2, 5, cx, hy, hr * 1.25); g.addColorStop(0, pal.skin); g.addColorStop(1, pal.skinD); c.fillStyle = g;
    c.beginPath(); c.ellipse(cx, hy, hr, hry, 0, 0, 6.283); c.fill();
    c.fillStyle = pal.hair; c.beginPath();
    if (age < .5) { // coupe au bol, frange
      c.ellipse(cx, hy - hry * .16, hr * 1.1, hry * .9, 0, Math.PI * .97, Math.PI * 2.03); c.fill();
      c.beginPath(); c.moveTo(cx - hr * 1.08, hy - hry * .06); for (let k = 0; k <= 9; k++) { const u = k / 9, xx = cx + (u * 2 - 1) * hr * 1.08, yy = hy - hry * (.12 + .28 * Math.sin(u * Math.PI)); c.quadraticCurveTo(xx - hr * .12, yy + hry * .1, xx, yy); } c.lineTo(cx + hr * 1.08, hy - hry * .6); c.lineTo(cx - hr * 1.08, hy - hry * .6); c.fill();
      c.strokeStyle = rgba('#000000', .25); c.lineWidth = 2 * s; for (let k = 0; k < 14; k++) { const xx = cx + (k / 13 * 2 - 1) * hr * .9; c.beginPath(); c.moveTo(xx * .9 + cx * .1, hy - hry * .95); c.quadraticCurveTo(xx, hy - hry * .6, xx + 4 * s, hy - hry * .3); c.stroke(); }
    } else { c.ellipse(cx, hy - hry * .3, hr * 1.05, hry * .76, 0, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.beginPath(); c.moveTo(cx - hr * 1.02, hy - hry * .22); c.quadraticCurveTo(cx - hr * .2, hy - hry * .66, cx + hr * .98, hy - hry * .3); c.lineTo(cx + hr, hy - hry * .62); c.lineTo(cx - hr, hy - hry * .62); c.fill(); }
    c.fillStyle = c.strokeStyle = pal.ink; c.lineCap = 'round';
    const ey = hy + hry * .06, ex = hr * .38, er = lerp(11, 9, age) * s;
    [-1, 1].forEach(d => {
      c.fillStyle = pal.ink; c.beginPath(); c.ellipse(cx + d * ex, ey, er * 1.2, er, 0, 0, 6.283); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(cx + d * ex + er * .35, ey - er * .3, er * .32, 0, 6.283); c.fill();
      c.globalAlpha = .55; c.lineWidth = 4 * s; c.beginPath(); c.moveTo(cx + d * (ex - er * 1.6), ey - er * 2.3); c.quadraticCurveTo(cx + d * ex, ey - er * 3.1, cx + d * (ex + er * 1.6), ey - er * 2.2); c.stroke(); c.globalAlpha = 1;
    });
    c.globalAlpha = .42; c.lineWidth = 3.5 * s; c.beginPath(); c.moveTo(cx + 4 * s, hy + hry * .22); c.quadraticCurveTo(cx + 13 * s, hy + hry * .36, cx - 2 * s, hy + hry * .39); c.stroke();
    c.globalAlpha = .7; c.lineWidth = 4.5 * s; c.beginPath(); c.moveTo(cx - hr * .24, hy + hry * .53); c.quadraticCurveTo(cx, hy + hry * (age < .5 ? .66 : .58), cx + hr * .24, hy + hry * .53); c.stroke(); c.globalAlpha = 1;
    if (age < .5) { c.fillStyle = rgba('#E0907A', .16); [-1, 1].forEach(d => { c.beginPath(); c.arc(cx + d * hr * .56, hy + hry * .36, 22 * s, 0, 6.283); c.fill(); }); }
  }
  function makePhoto(w, h, age, pal, o) {
    const cv2 = off(w + 40, h + 40), c = cv2.getContext('2d'); c.translate(20, 20);
    c.fillStyle = o.paper; c.beginPath();
    if (o.deckle) { const st = 16; c.moveTo(0, 0); for (let x = 0; x < w; x += st) c.arc(x + st / 2, 0, st / 2, Math.PI, 0); for (let y = 0; y < h; y += st) c.arc(w, y + st / 2, st / 2, -Math.PI / 2, Math.PI / 2);
      for (let x = w; x > 0; x -= st) c.arc(x - st / 2, h, st / 2, 0, Math.PI); for (let y = h; y > 0; y -= st) c.arc(0, y - st / 2, st / 2, Math.PI / 2, Math.PI * 1.5); c.closePath(); }
    else c.roundRect(0, 0, w, h, 8);
    c.fill();
    const B = o.border, ix = B, iy = B, iw = w - 2 * B, ih = h - 2 * B;
    c.save(); c.beginPath(); c.rect(ix, iy, iw, ih); c.clip();
    portraitFace(c, ix, iy, iw, ih, age, pal);
    const r = rng(o.seed || 3);
    if (o.old) { // vieillissement : voile, taches, rayures, vignettage
      c.fillStyle = 'rgba(120,80,30,.12)'; c.fillRect(ix, iy, iw, ih);
      for (let k = 0; k < 9; k++) { const x = ix + r() * iw, y = iy + r() * ih, rr = 20 + r() * 70; const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, 'rgba(90,60,20,.15)'); g.addColorStop(1, 'rgba(90,60,20,0)'); c.fillStyle = g; c.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
      c.strokeStyle = 'rgba(250,240,220,.32)'; c.lineWidth = 1; for (let k = 0; k < 14; k++) { const x = ix + r() * iw, y = iy + r() * ih; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 40, y + 40 + r() * 140); c.stroke(); }
      const g = c.createRadialGradient(ix + iw / 2, iy + ih / 2, ih * .3, ix + iw / 2, iy + ih / 2, ih * .78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,24,8,.5)'); c.fillStyle = g; c.fillRect(ix, iy, iw, ih);
    } else { const g = c.createLinearGradient(ix, iy, ix + iw, iy + ih); g.addColorStop(0, 'rgba(255,240,200,.1)'); g.addColorStop(1, 'rgba(0,0,0,.2)'); c.fillStyle = g; c.fillRect(ix, iy, iw, ih); }
    c.restore();
    if (o.old) { c.fillStyle = 'rgba(160,130,90,.25)'; c.beginPath(); c.moveTo(w - 70, 0); c.lineTo(w, 0); c.lineTo(w, 70); c.closePath(); c.fill(); } // coin usé
    return cv2;
  }
  const PH_CHILD = makePhoto(520, 640, 0, PAL_OLD, { paper: '#EFE4CA', deckle: true, border: 30, old: true, seed: 5 });
  const PH_ADULT = makePhoto(520, 640, 1, PAL_NEW, { paper: '#F4F2EC', border: 26, seed: 8 });
  function drawPhoto(c, img, cx, cy, sc, rot, al = 1) {
    if (al <= 0) return;
    c.save(); c.globalAlpha = al; c.translate(cx, cy); c.rotate(rot); c.scale(sc, sc);
    c.save(); c.filter = 'blur(14px)'; c.globalAlpha = al * .6; c.fillStyle = '#000'; c.fillRect(-img.width / 2 + 26, -img.height / 2 + 34, img.width - 40, img.height - 40); c.restore();
    c.drawImage(img, -img.width / 2, -img.height / 2); c.restore();
  }
  function icon(c, kind, x, y, s, solid, col) {
    c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 4; c.strokeStyle = rgba(col, .4 + .6 * solid); c.fillStyle = rgba(col, .85 * solid); c.lineJoin = 'round'; c.lineCap = 'round';
    if (solid < .98) c.setLineDash([9, 3 + 9 * (1 - solid)]);
    c.beginPath();
    if (kind === 'kite') { c.moveTo(0, -56); c.lineTo(38, -8); c.lineTo(0, 48); c.lineTo(-38, -8); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(0, 48); c.quadraticCurveTo(22, 76, -4, 96); c.quadraticCurveTo(-28, 116, 6, 134); c.stroke(); }
    if (kind === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 54; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); }
    if (kind === 'heart') { c.moveTo(0, 44); c.bezierCurveTo(-74, -6, -44, -72, 0, -32); c.bezierCurveTo(44, -72, 74, -6, 0, 44); c.closePath(); c.fill(); c.stroke(); }
    c.restore();
  }

  /* =====================================================================
     DÉCOR 1 — LA VIEILLE PHOTOGRAPHIE, sur la table
     ===================================================================== */
  function drawTableStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#1a110a'); g.addColorStop(.5, '#2e1e12'); g.addColorStop(1, '#120b06'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const r = rng(12); c.lineWidth = 2; // veinage du bois
    for (let k = 0; k < 70; k++) { const y0 = -LM + r() * (H + 2 * LM); c.strokeStyle = rgba(r() > .5 ? '#4a3220' : '#0e0804', .25 + r() * .25); c.beginPath(); c.moveTo(-LM, y0); for (let x = -LM; x <= W + LM; x += 60) c.lineTo(x, y0 + Math.sin(x * .004 + k) * 18 + Math.sin(x * .013 + k * 2) * 5); c.stroke(); }
    // d'autres photographies, retournées, éparpillées
    [[90, 1680, .4], [990, 1760, -.3], [960, 330, .2]].forEach(([x, y, a]) => { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(-120, -140, 250, 300); c.fillStyle = '#6e604a'; c.fillRect(-130, -150, 250, 300); c.strokeStyle = 'rgba(40,30,20,.4)'; c.strokeRect(-120, -140, 230, 280); c.restore(); });
  }
  const TABLE = prerender(drawTableStatic, 1.2);
  const ICONS = [['kite', 'rêves', 'reves'], ['star', 'croyances', 'croyances'], ['heart', 'aimer', 'aimer']];
  function scene1(c, t) {
    const sp = prog(t, T.s1b - .3, T.s1b + 1.3, 'inOutCubic');
    const zp = prog(t, .2, T.s1b + .8, 'inOutSine');
    camSafe(c, lerp(1.24, 1.0, zp), 540, lerp(860, 980, zp));
    blit(c, TABLE);
    beam(c, -200, -200, 200, 1900, 900, 1500, '#F6D6A6', .12 + .1 * prog(t, 0, 2.5, 'outCubic'), 30); // la lumière de la fenêtre
    glow(c, 380, 820, 760, '#F6D6A6', .16 + .12 * prog(t, 0, 2.5, 'outCubic'));
    drawPhoto(c, PH_ADULT, lerp(1420, 790, sp), lerp(1120, 1000, sp), .78, lerp(.35, .07, sp), sp > 0 ? 1 : 0);
    drawPhoto(c, PH_CHILD, lerp(540, 300, sp), lerp(900, 980, sp), lerp(.9, .78, sp), lerp(-.035, -.08, sp));
    // ce que l'enfant a… et ce que l'adulte aura peut-être perdu : rêves, croyances, manière d'aimer
    ICONS.forEach(([k, label, w], i) => {
      const t0 = T[w], a = prog(t, t0 - .25, t0 + .35, 'outCubic'); if (a <= 0) return;
      const x0 = 150 + i * 150, y0 = 640, x1 = 640 + i * 150, y1 = 650, fl = prog(t, t0 + .1, t0 + 1.3, 'inOutSine');
      icon(c, k, x0, y0 - 10 * (1 - a), .62 * a, 1, k === 'heart' ? C.rose : C.lamp);
      c.save(); c.globalAlpha = a; c.font = 'italic 400 38px Instrument'; c.fillStyle = C.ivory; c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12; c.fillText(label, x0, y0 + 76); c.restore();
      if (fl > 0) { const xx = lerp(x0, x1, fl), yy = lerp(y0, y1, fl) - Math.sin(fl * Math.PI) * 120; icon(c, k, xx, yy, .62, 1 - .82 * fl, k === 'heart' ? C.rose : C.lamp);
        if (fl > .85) { c.save(); c.globalAlpha = (fl - .85) / .15; c.font = 'italic 400 46px Instrument'; c.fillStyle = 'rgba(242,239,232,.8)'; c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12; c.fillText('?', x1, y1 + 80); c.restore(); } }
    });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0a0604', .62, 640);
    vignette(c, .55, '#030201');
    flash(c, '#000000', 1 - prog(t, 0, .8, 'outCubic'));
  }

  /* =====================================================================
     DÉCOR 2 — LE MIROIR ANCIEN
     ===================================================================== */
  const MIR = { x: 540, y: 1010, rx: 250, ry: 390 };
  let COVER = false; // couverture : l'adulte et l'enfant superposés, bien lisibles
  function drawRoomStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#141c1a'); g.addColorStop(.6, '#1e2a26'); g.addColorStop(1, '#0a0e0c'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.fillStyle = 'rgba(200,220,200,.035)'; // papier peint damassé
    for (let y = -LM; y < 1560; y += 150) for (let x = -LM + ((y / 150) % 2) * 60; x < W + LM; x += 120) { c.beginPath(); c.moveTo(x, y - 40); c.quadraticCurveTo(x + 26, y, x, y + 40); c.quadraticCurveTo(x - 26, y, x, y - 40); c.fill(); c.beginPath(); c.arc(x, y - 52, 6, 0, 6.283); c.fill(); }
    c.fillStyle = '#0c1210'; c.fillRect(-LM, 1560, W + 2 * LM, 30); c.fillStyle = '#101614'; c.fillRect(-LM, 1590, W + 2 * LM, H); // lambris
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 4; for (let x = -LM + 20; x < W + LM; x += 260) c.strokeRect(x, 1630, 220, 260);
    c.fillStyle = '#1a120c'; c.fillRect(760, 1440, 280, 26); c.fillRect(780, 1466, 16, 140); c.fillRect(1004, 1466, 16, 140); // console
  }
  const ROOM = prerender(drawRoomStatic, 1.2);
  function mirrorFrame(c, m) {
    c.save(); c.fillStyle = 'rgba(0,0,0,.6)'; c.filter = 'blur(20px)'; c.beginPath(); c.ellipse(m.x + 14, m.y + 22, m.rx + 60, m.ry + 60, 0, 0, 6.283); c.fill(); c.restore();
    const g = c.createLinearGradient(m.x - m.rx, m.y - m.ry, m.x + m.rx, m.y + m.ry); g.addColorStop(0, '#5a3e14'); g.addColorStop(.35, '#E8C878'); g.addColorStop(.6, '#8a6224'); g.addColorStop(1, '#4a3010');
    c.fillStyle = g; c.beginPath(); c.ellipse(m.x, m.y, m.rx + 46, m.ry + 46, 0, 0, 6.283); c.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, 6.283); c.fill('evenodd');
    c.strokeStyle = 'rgba(40,24,6,.6)'; c.lineWidth = 3; c.beginPath(); c.ellipse(m.x, m.y, m.rx + 18, m.ry + 18, 0, 0, 6.283); c.stroke();
    c.fillStyle = '#F0D48A'; for (let k = 0; k < 48; k++) { const a = k / 48 * 6.283; c.beginPath(); c.arc(m.x + Math.cos(a) * (m.rx + 32), m.y + Math.sin(a) * (m.ry + 32), 4, 0, 6.283); c.fill(); } // perles
    c.fillStyle = g; c.beginPath(); c.moveTo(m.x - 90, m.y - m.ry - 30); c.bezierCurveTo(m.x - 70, m.y - m.ry - 110, m.x - 10, m.y - m.ry - 80, m.x, m.y - m.ry - 120); c.bezierCurveTo(m.x + 10, m.y - m.ry - 80, m.x + 70, m.y - m.ry - 110, m.x + 90, m.y - m.ry - 30); c.closePath(); c.fill(); // cimier
  }
  function mirror(c, m, t, refl, rip) {
    c.save(); c.beginPath(); c.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, 6.283); c.clip();
    let g = c.createLinearGradient(m.x - m.rx, m.y - m.ry, m.x + m.rx, m.y + m.ry); g.addColorStop(0, '#46545a'); g.addColorStop(.5, '#28343a'); g.addColorStop(1, '#141c20'); c.fillStyle = g; c.fillRect(m.x - m.rx, m.y - m.ry, m.rx * 2, m.ry * 2);
    glow(c, m.x + m.rx * .7, m.y + m.ry * .45, 260, '#F2C27D', .35); // la lampe, dans le reflet
    refl(c);
    if (rip > 0) { c.strokeStyle = rgba('#DDE8F0', .25 * rip); c.lineWidth = 2; for (let k = 0; k < 4; k++) { const u = ((t * .9 + k * .25) % 1); c.beginPath(); c.ellipse(m.x, m.y + 60, m.rx * u * 1.1, m.ry * u * .9, 0, 0, 6.283); c.stroke(); } }
    c.globalCompositeOperation = 'screen'; g = c.createLinearGradient(m.x - m.rx, m.y - m.ry, m.x + m.rx * .2, m.y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.08)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(m.x - m.rx, m.y - m.ry, m.rx * 2, m.ry * 2);
    c.globalCompositeOperation = 'source-over';
    const r = rng(17); for (let k = 0; k < 40; k++) { const a = r() * 6.283, d = .82 + r() * .2, x = m.x + Math.cos(a) * m.rx * d, y = m.y + Math.sin(a) * m.ry * d, rr = 6 + r() * 26; const gg = c.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, 'rgba(30,24,14,.5)'); gg.addColorStop(1, 'rgba(30,24,14,0)'); c.fillStyle = gg; c.fillRect(x - rr, y - rr, rr * 2, rr * 2); } // piqûres du tain
    c.restore();
    mirrorFrame(c, m);
  }
  function lamp(c, x, y) {
    c.fillStyle = '#2a1c10'; c.beginPath(); c.ellipse(x, y - 4, 40, 10, 0, 0, 6.283); c.fill(); c.fillRect(x - 8, y - 70, 16, 66);
    glow(c, x, y - 96, 220, '#F2C27D', .55); c.fillStyle = 'rgba(255,226,170,.9)'; c.beginPath(); c.ellipse(x, y - 96, 26, 32, 0, 0, 6.283); c.fill();
  }
  function reflections(c, m, ad, ch, blurA) { // le reflet : l'adulte, l'enfant… ou les deux
    const k = m.ry / 390;
    if (ad > 0) rimmed(c, cc => bustSil(cc, m.x + 30 * k, m.y + m.ry + 10 * k, .95 * k, 1), { body: '#0b1012', rim: '#F2C27D', rimA: .8, dx: 4 * k, alpha: ad, blur: blurA });
    if (ch > 0) rimmed(c, cc => bustSil(cc, m.x + 30 * k, m.y + m.ry + 10 * k, .78 * k, 0), { body: '#0b1012', rim: '#F6D6A6', rimA: .85, dx: 4 * k, alpha: ch, blur: blurA });
  }
  function scene2(c, t) {
    const zp = prog(t, T.s2, T.s3, 'inOutSine');
    camSafe(c, lerp(1.12, 1.0, zp), 540, lerp(980, 1060, zp));
    blit(c, ROOM);
    glow(c, 900, 1350, 420, '#F2C27D', .3); lamp(c, 900, 1440);
    const kid = COVER ? 1 : prog(t, T.toujours - .2, T.toujours + .7, 'inOutSine'), both = COVER ? 1 : prog(t, T.personne2 - .15, T.personne2 + .6, 'inOutSine');
    const ad = clamp(1 - kid + .6 * both), ch = kid * (1 - .4 * both), blurA = 3 * (Math.sin(kid * Math.PI) + Math.sin(both * Math.PI));
    mirror(c, MIR, t, cc => { if (COVER) glow(cc, MIR.x + 30, MIR.y + 40, 330, '#F6D6A6', .32); reflections(cc, MIR, COVER ? .85 : ad, COVER ? .8 : ch, blurA); }, COVER ? 0 : Math.sin(kid * Math.PI) + Math.sin(both * Math.PI) * .8);
    rimmed(c, cc => bustSil(cc, 430, 1990, 1.5, 1), { body: '#040506', rim: '#F2C27D', rimA: .7, dx: 6 }); // l'élève, de dos
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#060a08', .7, 640);
    vignette(c, .55, '#020403');
  }

  /* =====================================================================
     DÉCOR 3a — JOHN LOCKE : le portrait (G. Kneller, 1697)
     ===================================================================== */
  function drawStudyStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#1a1009'); g.addColorStop(.55, '#2c1c10'); g.addColorStop(1, '#0e0905'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 6; for (let x = -LM + 10; x < W + LM; x += 270) { c.strokeRect(x, 120, 230, 560); c.strokeRect(x, 760, 230, 680); } // boiseries
    g = c.createLinearGradient(0, 1500, 0, H + LM); g.addColorStop(0, '#3a2414'); g.addColorStop(1, '#140c06'); c.fillStyle = g; c.fillRect(-LM, 1500, W + 2 * LM, H); // le bureau
    c.fillStyle = '#E9DEC4'; c.beginPath(); c.moveTo(300, 1640); c.quadraticCurveTo(420, 1600, 540, 1640); c.quadraticCurveTo(660, 1600, 780, 1640); c.lineTo(800, 1780); c.quadraticCurveTo(670, 1740, 540, 1780); c.quadraticCurveTo(410, 1740, 280, 1780); c.closePath(); c.fill(); // le livre ouvert
    c.strokeStyle = 'rgba(80,60,30,.45)'; c.lineWidth = 2; for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo(320, 1660 + k * 15); c.lineTo(510, 1660 + k * 15); c.moveTo(570, 1660 + k * 15); c.lineTo(760, 1660 + k * 15); c.stroke(); }
    c.fillStyle = '#0a0806'; c.beginPath(); c.arc(880, 1700, 18, 0, 6.283); c.fill(); c.strokeStyle = '#E9DEC8'; c.lineWidth = 3; c.beginPath(); c.moveTo(882, 1690); c.quadraticCurveTo(930, 1600, 960, 1560); c.stroke(); // encrier, plume
    c.fillStyle = '#d8c8a0'; c.fillRect(170, 1590, 26, 110); // la bougie
  }
  const STUDY = prerender(drawStudyStatic, 1.2);
  function portrait(c, x, y, w, h, kz, sheen) {
    c.save(); c.fillStyle = 'rgba(0,0,0,.6)'; c.filter = 'blur(18px)'; c.beginPath(); c.ellipse(x + w / 2 + 12, y + h / 2 + 20, w / 2 + 26, h / 2 + 26, 0, 0, 6.283); c.fill(); c.restore();
    let g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#6a4a1c'); g.addColorStop(.4, '#F0D08A'); g.addColorStop(.7, '#9a6a28'); g.addColorStop(1, '#5a3a14');
    c.fillStyle = g; c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w / 2 + 24, h / 2 + 24, 0, 0, 6.283); c.fill();
    c.save(); c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 6.283); c.clip();
    const iw = IMG.naturalWidth, ih = IMG.naturalHeight * .93, sw = iw * .9 / kz, sh = sw * h / w, cx = iw * .5, cy = lerp(ih * .5, ih * .36, (kz - 1) * 6);
    c.drawImage(IMG, clamp(cx - sw / 2, 0, iw - sw), clamp(cy - sh / 2, 0, ih - sh), sw, sh, x, y, w, h);
    if (sheen > 0 && sheen < 1) { c.globalCompositeOperation = 'screen'; const sx = lerp(x - 200, x + w + 200, sheen); g = c.createLinearGradient(sx - 100, y, sx + 100, y + 200); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,.28)'); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(x, y, w, h); }
    c.restore();
  }
  function scene3a(c, t) {
    const zp = prog(t, T.s3, T.s3b + .6, 'inOutSine');
    camSafe(c, lerp(1.08, 1.0, zp), 540, lerp(1000, 1040, zp));
    blit(c, STUDY);
    glow(c, 183, 1560, 260, '#FFD9A0', .5 + .06 * Math.sin(t * 9)); c.fillStyle = 'rgba(255,230,170,.95)'; c.beginPath(); c.ellipse(183, 1572 + Math.sin(t * 11) * 1.5, 9, 18, 0, 0, 6.283); c.fill(); // flamme
    glow(c, 540, 930, 620, '#F6D6A6', .2);
    portrait(c, 290, 630, 500, 620, lerp(1, 1.1, zp), prog(t, T.john - .2, T.john + 1.6, 'inOutSine'));
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0a0604', .66, 600);
    vignette(c, .55, '#030201');
  }

  /* =====================================================================
     DÉCOR 3b — LE FIL DES SOUVENIRS : la continuité de la conscience
     ===================================================================== */
  const HAND = [318, 1688];
  const FR = [[740, 1446, .92, 'cake'], [868, 1000, .78, 'bike'], [520, 900, .64, 'book'], [770, 770, .52, 'house'], [560, 690, .43, 'boat'], [690, 628, .36, 'child']];
  const THR = (() => { const P = [HAND, ...FR.map(f => [f[0], f[1]]), [640, 590]], pts = [], idx = [0];
    for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let k = (i ? 1 : 0); k <= 20; k++) { const u = k / 20, u2 = u * u, u3 = u2 * u; pts.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3))); }
      idx.push(pts.length - 1); }
    let tot = 0; const L = [0]; for (let i = 1; i < pts.length; i++) { tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(tot); }
    pts.frac = idx.map(i => L[i] / tot); return pts; })();
  const STARS = (() => { const r = rng(3); return Array.from({ length: 140 }, () => [r() * W, r() * 1500, r()]); })();
  function memIcon(c, kind, w, h) { // petits dessins à l'encre, dans chaque souvenir
    c.strokeStyle = '#3a2614'; c.fillStyle = '#3a2614'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
    const x = w / 2, y = h / 2;
    if (kind === 'cake') { c.strokeRect(x - 50, y - 6, 100, 50); c.beginPath(); c.moveTo(x - 50, y + 14); c.quadraticCurveTo(x, y + 28, x + 50, y + 14); c.stroke(); for (let k = -1; k <= 1; k++) { c.fillRect(x + k * 26 - 3, y - 30, 6, 24); c.beginPath(); c.ellipse(x + k * 26, y - 38, 5, 8, 0, 0, 6.283); c.fill(); } }
    if (kind === 'bike') { c.beginPath(); c.arc(x - 44, y + 20, 30, 0, 6.283); c.moveTo(x + 74, y + 20); c.arc(x + 44, y + 20, 30, 0, 6.283); c.moveTo(x - 44, y + 20); c.lineTo(x - 6, y - 22); c.lineTo(x + 30, y - 22); c.lineTo(x + 44, y + 20); c.moveTo(x - 6, y - 22); c.lineTo(x + 2, y + 20); c.lineTo(x - 44, y + 20); c.moveTo(x + 30, y - 22); c.lineTo(x + 26, y - 38); c.stroke(); }
    if (kind === 'book') { c.beginPath(); c.moveTo(x, y - 30); c.quadraticCurveTo(x - 40, y - 44, x - 70, y - 30); c.lineTo(x - 70, y + 36); c.quadraticCurveTo(x - 40, y + 22, x, y + 36); c.quadraticCurveTo(x + 40, y + 22, x + 70, y + 36); c.lineTo(x + 70, y - 30); c.quadraticCurveTo(x + 40, y - 44, x, y - 30); c.lineTo(x, y + 36); c.stroke(); }
    if (kind === 'house') { c.strokeRect(x - 46, y - 10, 92, 60); c.beginPath(); c.moveTo(x - 58, y - 6); c.lineTo(x, y - 52); c.lineTo(x + 58, y - 6); c.stroke(); c.strokeRect(x - 12, y + 18, 24, 32); }
    if (kind === 'boat') { c.beginPath(); c.moveTo(x - 60, y + 20); c.lineTo(x + 60, y + 20); c.lineTo(x + 40, y + 42); c.lineTo(x - 40, y + 42); c.closePath(); c.moveTo(x, y + 20); c.lineTo(x, y - 50); c.lineTo(x + 40, y + 10); c.closePath(); c.stroke(); c.beginPath(); for (let k = 0; k <= 12; k++) c.lineTo(x - 80 + k * 13, y + 54 + Math.sin(k) * 4); c.stroke(); }
  }
  const POLA = FR.map(([, , , kind]) => { const o = off(220, 264), c = o.getContext('2d'); c.fillStyle = '#F2EEE4'; c.fillRect(0, 0, 220, 264); c.fillStyle = '#d9c7a2'; c.fillRect(14, 14, 192, 192);
    if (kind === 'child') c.drawImage(PH_CHILD, 100, 110, 360, 360, 14, 14, 192, 192); else { c.save(); c.translate(14, 14); memIcon(c, kind, 192, 192); c.restore(); }
    c.fillStyle = 'rgba(80,50,20,.12)'; c.fillRect(14, 14, 192, 192); return o; });
  function scene3b(c, t) {
    const zp = prog(t, T.s3b, T.s4, 'inOutSine');
    camSafe(c, lerp(1.06, 1.0, zp), lerp(520, 540, zp), lerp(1080, 1040, zp));
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#0a0c1e'); g.addColorStop(.5, '#16163a'); g.addColorStop(1, '#08080f'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    STARS.forEach(([x, y, a]) => { c.fillStyle = rgba('#DDE6FF', .15 + .35 * a * (.6 + .4 * Math.sin(t * 2 + a * 9))); c.fillRect(x, y, 2, 2); });
    glow(c, 650, 640, 420, '#F6D6A6', .35); // le passé, au loin
    c.fillStyle = '#0c0a14'; c.beginPath(); c.moveTo(-LM, 1700); c.quadraticCurveTo(540, 1640, W + LM, 1720); c.lineTo(W + LM, H + LM); c.lineTo(-LM, H + LM); c.fill(); // le sol
    const lit = prog(t, T.continuite - .3, T.conscience3 + .9, 'inOutSine');
    c.lineCap = 'round'; c.strokeStyle = 'rgba(242,232,210,.18)'; c.lineWidth = 2; strokeProg(c, THR, 1);
    if (lit > 0) { c.save(); c.strokeStyle = '#FFE2A8'; c.lineWidth = 3.5; c.shadowColor = '#FFD98A'; c.shadowBlur = 18; strokeProg(c, THR, lit); c.restore(); }
    for (let i = FR.length - 1; i >= 0; i--) { // les souvenirs, accrochés au fil (du plus lointain au plus proche)
      const [px, py, s] = FR[i], u = THR.frac[i + 1], sw = Math.sin(t * 1.3 + i * 1.7) * .05, rec = prog(t, T.reconnaitre - .35 + i * .26, T.reconnaitre + .35 + i * .26, 'outCubic');
      c.save(); c.translate(px, py); c.rotate(sw + (i % 2 ? .06 : -.05)); c.scale(s, s);
      if (rec > 0) glow(c, 0, 132, 220, '#FFD98A', .5 * rec);
      c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(-104, 14, 220, 264);
      c.globalAlpha = .55 + .45 * Math.max(rec, lit > u ? 1 : 0);
      c.drawImage(POLA[i], -110, 6);
      c.globalAlpha = 1;
      if (rec > 0) { c.save(); c.beginPath(); c.rect(-96, 20, 192, 192); c.clip(); rimmed(c, cc => bustSil(cc, 52, 216, .26, i === 5 ? 0 : .3 + i * .1), { body: rgba('#3a2010', .9), rim: '#FFE2A8', rimA: .9, dx: 2, alpha: rec * .9 }); c.restore(); }
      c.fillStyle = '#C8A060'; c.fillRect(-6, -4, 12, 22); // la pince
      c.restore();
    }
    person(c, { x: 250, y: 1900, s: 2.0, f: 1, hand: HAND, head: -.12, phone: 0 }, '#FFD9A0', 3);
    const cs = prog(t, T.conscience3 - .3, T.conscience3 + .6, 'outCubic');
    if (cs > 0) glow(c, 276, 1562, 110, '#FFE2A8', .6 * cs * (1 - .3 * prog(t, T.s3c + .5, T.s4, 'linear')));
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#06060f', .7, 560);
    vignette(c, .5, '#020208');
  }

  /* =====================================================================
     DÉCOR 4 — LA MÉMOIRE EN MOSAÏQUE (neurosciences)
     ===================================================================== */
  const BRAIN = makeBrain(540, 950, 520, 560, 110, 31);
  function memScene(c, w, h, v) { // un souvenir d'enfance (deux versions : l'originale et la reconstruite)
    let g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#8fbcd8'); g.addColorStop(.62, '#f0dcc0'); g.addColorStop(1, '#f0dcc0'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const sx = v ? 120 : 590; glow(c, sx, 92, 120, '#FFF2C0', .6); c.fillStyle = '#FFF0B8'; c.beginPath(); c.arc(sx, 92, 44, 0, 6.283); c.fill();
    if (v) { c.fillStyle = '#D85A4A'; c.beginPath(); c.moveTo(300, 70); c.lineTo(326, 104); c.lineTo(300, 146); c.lineTo(274, 104); c.closePath(); c.fill(); c.strokeStyle = '#7a3a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(300, 146); c.quadraticCurveTo(320, 190, 290, 230); c.stroke(); }
    c.fillStyle = '#9cc07a'; c.beginPath(); c.moveTo(0, 330); c.quadraticCurveTo(200, 270, 420, 320); c.quadraticCurveTo(580, 350, w, 300); c.lineTo(w, h); c.lineTo(0, h); c.fill();
    c.fillStyle = '#86ad66'; c.fillRect(0, 410, w, h - 410);
    c.fillStyle = '#F2E4CC'; c.fillRect(250, 250, 190, 170); c.fillStyle = '#B85A3A'; c.beginPath(); c.moveTo(232, 256); c.lineTo(345, 170); c.lineTo(458, 256); c.closePath(); c.fill();
    c.fillStyle = v ? '#3A62A8' : '#B23A2A'; c.fillRect(320, 330, 50, 90); // la porte
    c.fillStyle = '#7aa8c8'; c.fillRect(268, 282, 40, 36); c.fillRect(384, 282, 40, 36); c.strokeStyle = '#F2E4CC'; c.lineWidth = 3; c.beginPath(); c.moveTo(288, 282); c.lineTo(288, 318); c.moveTo(404, 282); c.lineTo(404, 318); c.stroke();
    c.fillStyle = '#6a4a2a'; c.fillRect(580, 270, 18, 160); // l'arbre
    if (!v) { c.fillStyle = '#5a9a4a'; c.beginPath(); c.arc(589, 230, 70, 0, 6.283); c.arc(546, 262, 46, 0, 6.283); c.arc(632, 264, 46, 0, 6.283); c.fill(); }
    else { c.fillStyle = '#2f6a42'; c.beginPath(); c.moveTo(589, 130); c.lineTo(654, 310); c.lineTo(524, 310); c.closePath(); c.fill(); }
    c.strokeStyle = '#6a4a2a'; c.lineWidth = 6; c.beginPath(); c.moveTo(70, 430); c.lineTo(100, 250); c.lineTo(190, 250); c.lineTo(220, 430); c.stroke(); // la balançoire
    c.lineWidth = 2; c.beginPath(); c.moveTo(130, 252); c.lineTo(130, 360); c.moveTo(162, 252); c.lineTo(162, 360); c.stroke(); c.fillStyle = '#6a4a2a'; c.fillRect(122, 358, 48, 8);
    if (!v) { c.fillStyle = '#3a3a5a'; c.beginPath(); c.arc(146, 318, 13, 0, 6.283); c.fill(); c.fillRect(136, 330, 20, 30); c.fillRect(150, 356, 22, 8); }
    c.fillStyle = '#F4EEE2'; for (let x = 8; x < w; x += 34) { c.fillRect(x, 448, 18, 64); c.beginPath(); c.moveTo(x, 448); c.lineTo(x + 9, 436); c.lineTo(x + 18, 448); c.fill(); } c.fillRect(0, 466, w, 9); c.fillRect(0, 494, w, 9);
    c.fillStyle = 'rgba(255,220,170,.14)'; c.fillRect(0, 0, w, h);
  }
  const MW = 700, MH = 520, MX = 190, MY = 690, COLS = 5, ROWS = 4, TW = MW / COLS, TH = MH / ROWS;
  const MEM = [0, 1].map(v => { const o = off(MW, MH); memScene(o.getContext('2d'), MW, MH, v); return o; });
  const TILES = (() => { const A = MEM[0].getContext('2d').getImageData(0, 0, MW, MH).data, B = MEM[1].getContext('2d').getImageData(0, 0, MW, MH).data, r = rng(41), out = [];
    for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) { let d = 0; for (let y = j * TH; y < (j + 1) * TH; y += 2) for (let x = i * TW; x < (i + 1) * TW; x += 2) { const k = (Math.floor(y) * MW + Math.floor(x)) * 4; d += Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]) > 60 ? 1 : 0; }
      const n = BRAIN.nodes[(j * COLS + i) * 5 % BRAIN.nodes.length]; out.push({ i, j, changed: d > 40, nx: n.x, ny: n.y, rot: (r() - .5) * 1.4, dl: r() * .35 }); }
    return out; })();
  function drawBrain(c, t, act) {
    const { nodes, edges } = BRAIN; c.save(); c.globalCompositeOperation = 'screen'; c.lineWidth = 1.5;
    edges.forEach(([i, j], k) => { const a = nodes[i], b = nodes[j]; c.strokeStyle = rgba('#5aa8ff', .06 + .16 * act); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      if (act > .05) { const u = (t * .7 + (k * .618) % 1) % 1; c.fillStyle = rgba('#CFE8FF', .75 * act); c.beginPath(); c.arc(lerp(a.x, b.x, u), lerp(a.y, b.y, u), 2.6, 0, 6.283); c.fill(); } });
    nodes.forEach(n => { const pu = .5 + .5 * Math.sin(t * 2 + n.d * 6.283); c.fillStyle = rgba('#9FD0FF', (.15 + .6 * act) * (.5 + .5 * pu)); c.beginPath(); c.arc(n.x, n.y, 3 + 2 * pu, 0, 6.283); c.fill(); });
    c.restore();
  }
  function scene4(c, t) {
    const zp = prog(t, T.s4, T.s5, 'inOutSine');
    camSafe(c, lerp(1.06, 1.0, zp), 540, lerp(980, 1020, zp));
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#04060e'); g.addColorStop(.5, '#0a1428'); g.addColorStop(1, '#04060a'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    drawBrain(c, t, prog(t, T.neurosciences - .3, T.neurosciences + 1, 'inOutSine'));
    const film = 1 - prog(t, T.fidele - .3, T.fidele + .2, 'linear');
    if (film > 0) { c.save(); c.globalAlpha = film; c.fillStyle = '#0a0a0c'; c.fillRect(MX - 30, MY - 70, MW + 60, 64); c.fillRect(MX - 30, MY + MH + 6, MW + 60, 64);
      c.fillStyle = '#d8d0c0'; for (let x = MX - 10; x < MX + MW + 20; x += 46) { c.fillRect(x, MY - 52, 24, 28); c.fillRect(x, MY + MH + 24, 24, 28); }
      const rec = prog(t, T.enregistrement - .2, T.enregistrement + .2, 'linear') * (Math.sin(t * 10) > 0 ? 1 : .4); c.fillStyle = rgba('#FF4A4A', .9 * rec); c.beginPath(); c.arc(MX + MW - 40, MY + 40, 12, 0, 6.283); c.fill(); c.restore(); }
    const mod = prog(t, T.modifiant - .2, T.modifiant + .4, 'outCubic') * (1 - prog(t, T.s5 - .7, T.s5 - .1, 'linear'));
    TILES.forEach(tl => {
      const sc = prog(t, T.fidele - .15 + tl.dl, T.fidele + .85 + tl.dl, 'outCubic'), rc = prog(t, T.reconstruit - .4 + tl.dl * 1.4, T.reconstruit + .6 + tl.dl * 1.4, 'inOutCubic');
      const hx = MX + tl.i * TW + TW / 2, hy = MY + tl.j * TH + TH / 2, sx = lerp(hx, tl.nx, .85), sy = lerp(hy, tl.ny, .85);
      const px = lerp(lerp(hx, sx, sc), hx, rc), py = lerp(lerp(hy, sy, sc), hy, rc), rot = tl.rot * sc * (1 - rc), s = lerp(1, lerp(.45, 1, rc), sc), a = lerp(1, lerp(.5, 1, rc), sc);
      const src = (tl.changed && rc > .02) ? MEM[1] : MEM[0];
      c.save(); c.globalAlpha = a; c.translate(px, py); c.rotate(rot); c.scale(s, s);
      c.drawImage(src, tl.i * TW, tl.j * TH, TW, TH, -TW / 2 - .5, -TH / 2 - .5, TW + 1, TH + 1);
      if (sc > .02 && rc < .98) { c.strokeStyle = rgba('#CFE8FF', .5 * sc * (1 - rc)); c.lineWidth = 2; c.strokeRect(-TW / 2, -TH / 2, TW, TH); }
      if (tl.changed && mod > 0) { c.strokeStyle = rgba(C.rose, .95 * mod); c.lineWidth = 4; c.shadowColor = C.rose; c.shadowBlur = 16; c.strokeRect(-TW / 2 + 3, -TH / 2 + 3, TW - 6, TH - 6); }
      c.restore();
    });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#04060e', .7, 560);
    vignette(c, .5, '#010206');
  }

  /* =====================================================================
     DÉCOR 5 — LE LAC À L'AUBE (tradition bouddhiste) : le « moi » qui se défait
     ===================================================================== */
  function drawLakeStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, 1060); g.addColorStop(0, '#16183a'); g.addColorStop(.55, '#5a4a7a'); g.addColorStop(1, '#EAA88A'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, 1060 + LM);
    const ridge = (y0, amp, col, seed) => { c.fillStyle = col; c.beginPath(); c.moveTo(-LM, 1062); for (let x = -LM; x <= W + LM; x += 20) c.lineTo(x, y0 - Math.abs(Math.sin(x * .0042 + seed)) * amp - Math.sin(x * .017 + seed * 3) * amp * .12); c.lineTo(W + LM, 1062); c.fill(); };
    ridge(980, 300, '#8a6a8a', 1); ridge(1010, 220, '#6a4e72', 2.2); ridge(1040, 140, '#4a3858', 3.7);
    g = c.createLinearGradient(0, 1060, 0, H + LM); g.addColorStop(0, '#C8907A'); g.addColorStop(.25, '#5a4a6a'); g.addColorStop(1, '#14142a'); c.fillStyle = g; c.fillRect(-LM, 1060, W + 2 * LM, H); // le lac
    c.fillStyle = '#1a1424'; c.beginPath(); c.moveTo(330, 1268); c.quadraticCurveTo(360, 1176, 540, 1180); c.quadraticCurveTo(730, 1178, 760, 1270); c.closePath(); c.fill(); // le rocher
    c.fillStyle = 'rgba(26,20,36,.35)'; c.beginPath(); c.moveTo(330, 1270); c.quadraticCurveTo(540, 1350, 760, 1272); c.closePath(); c.fill(); // son reflet
  }
  const LAKE = prerender(drawLakeStatic, 1.2);
  function seated(c, x, y, s) { // une personne assise en tailleur, de profil (l'élève)
    c.beginPath(); c.ellipse(x + 6 * s, y - 18 * s, 92 * s, 26 * s, 0, 0, 6.283); c.fill();
    c.beginPath(); c.moveTo(x - 40 * s, y - 30 * s); c.quadraticCurveTo(x - 50 * s, y - 120 * s, x - 22 * s, y - 168 * s); c.lineTo(x + 18 * s, y - 170 * s); c.quadraticCurveTo(x + 40 * s, y - 110 * s, x + 34 * s, y - 30 * s); c.closePath(); c.fill();
    c.fillRect(x - 6 * s, y - 192 * s, 16 * s, 28 * s);
    c.beginPath(); c.ellipse(x + 4 * s, y - 214 * s, 25 * s, 29 * s, 0, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(x - 2 * s, y - 226 * s, 27 * s, 20 * s, -.2, Math.PI, 2 * Math.PI); c.fill();
    c.beginPath(); c.moveTo(x + 27 * s, y - 218 * s); c.lineTo(x + 34 * s, y - 207 * s); c.lineTo(x + 26 * s, y - 203 * s); c.fill();
    c.lineWidth = 20 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 4 * s, y - 150 * s); c.quadraticCurveTo(x + 40 * s, y - 92 * s, x + 74 * s, y - 40 * s); c.stroke();
  }
  const SX = 530, SY = 1186, SS = 1.15;
  const MOI = (() => { const o = off(760, 300), c = o.getContext('2d'); c.font = '900 250px Bodoni'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const g = c.createLinearGradient(0, 40, 0, 260); g.addColorStop(0, '#E8E4DC'); g.addColorStop(.6, '#A8A49C'); g.addColorStop(1, '#6a665e'); c.fillStyle = g; c.fillText('MOI', 380, 160);
    const d = c.getImageData(0, 0, 760, 300).data, pts = [], r = rng(77);
    for (let y = 0; y < 300; y += 4) for (let x = 0; x < 760; x += 4) { const k = (y * 760 + x) * 4; if (d[k + 3] > 140) pts.push([x, y, `rgb(${d[k]},${d[k + 1]},${d[k + 2]})`, r(), r(), r()]); }
    return { img: o, pts }; })();
  const LABELS5 = [['le corps', 'corps', 250, 1100, [470, 1130]], ['les sensations', 'sensations', 840, 1100, [640, 1090]], ['les pensées', 'pensees', 270, 900, [500, 930]], ['la conscience', 'conscience5', 830, 900, [560, 1010]]];
  function scene5(c, t) {
    const zp = prog(t, T.s5, T.s6, 'inOutSine');
    camSafe(c, lerp(1.07, 1.0, zp), 540, lerp(1040, 1000, zp));
    blit(c, LAKE);
    glow(c, 540, 1060, 700, '#FFD0A0', .35 + .15 * zp); // l'aube se lève
    for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = .16; c.filter = 'blur(26px)'; c.fillStyle = '#F2E6F0'; c.fillRect(-LM + ((t * 18 * (k + 1)) % 500) - 250, 1000 + k * 40, W + 2 * LM, 46); c.restore(); } // brume
    c.strokeStyle = 'rgba(255,220,200,.22)'; c.lineWidth = 2; for (let k = 0; k < 14; k++) { const y = 1300 + k * 42, x = 540 + Math.sin(k * 2.3 + t * .6) * 260; c.beginPath(); c.moveTo(x - 60 - k * 6, y); c.lineTo(x + 60 + k * 6, y); c.stroke(); } // reflets sur l'eau
    const L = LABELS5.map(l => prog(t, T[l[1]] - .15, T[l[1]] + .45, 'outCubic'));
    if (L[1] > 0) { c.save(); c.strokeStyle = rgba('#F6B880', .5 * L[1]); c.lineWidth = 2.5; for (let k = 0; k < 4; k++) { const u = (t * .45 + k * .25) % 1; c.globalAlpha = 1 - u; c.beginPath(); c.ellipse(SX, SY - 110 * SS, 90 + u * 230, 60 + u * 150, 0, 0, 6.283); c.stroke(); } c.restore(); } // les sensations : des ondes
    rimmed(c, cc => seated(cc, SX, SY, SS), { body: '#0e0a16', rim: '#FFD0A0', rimA: .6 + .4 * L[0], dx: 3 });
    if (L[0] > 0) glow(c, SX, SY - 100, 200, '#FFD0A0', .25 * L[0]); // le corps : un liseré plus vif, un halo
    if (L[2] > 0) { const r = rng(9); for (let k = 0; k < 26; k++) { const u = (t * .22 + r()) % 1, x = SX + 10 + (r() - .5) * 160 + Math.sin(u * 7 + k) * 20, y = SY - 250 * SS - u * 300; c.fillStyle = rgba('#E8E0FF', .7 * L[2] * (1 - u)); c.beginPath(); c.arc(x, y, 3 + r() * 5, 0, 6.283); c.fill(); } } // les pensées : des bulles qui montent
    if (L[3] > 0) glow(c, SX + 4, SY - 160 * SS, 150, '#FFF4D8', .6 * L[3]); // la conscience : une lumière intérieure
    LABELS5.forEach(([txt, , x, y, [ax, ay]], i) => { if (L[i] <= 0) return; c.save(); c.globalAlpha = L[i] * (1 - .35 * prog(t, T.moi - .2, T.moi + .5, 'linear'));
      c.strokeStyle = 'rgba(242,239,232,.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + (x < 540 ? 80 : -80), y - 12); c.lineTo(ax, ay); c.stroke();
      c.font = 'italic 400 46px Instrument'; c.fillStyle = C.ivory; c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 12; c.fillText(txt, x, y); c.restore(); });
    const mA = prog(t, T.existence - .2, T.existence + .45, 'outCubic'), dis = prog(t, T.immuable - .3, T.immuable + 1.4, 'inOutSine');
    if (mA > 0) {
      const ox = 540 - 380, oy = 670 - 150;
      if (dis < .02) { c.save(); c.globalAlpha = mA; c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 24; c.drawImage(MOI.img, ox, oy + 10 * (1 - mA)); c.restore(); }
      else { MOI.pts.forEach(([x, y, col, a, b, d]) => { const pd = clamp(dis * 1.6 - a * .6 - (x / 760) * .3); if (pd >= 1) return; c.fillStyle = col; c.globalAlpha = (1 - pd) * mA;
        c.fillRect(ox + x + pd * (180 + b * 260) + Math.sin(pd * 6 + d * 9) * 20 * pd, oy + y - pd * (90 + d * 200), 4, 4); }); c.globalAlpha = 1; }
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0c0c22', .66, 560);
    vignette(c, .45, '#06060f');
  }

  /* =====================================================================
     DÉCOR 6 — LA STATUE DANS LA BRUME : une identité figée, ébranlée
     ===================================================================== */
  function drawFogStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#2c323a'); g.addColorStop(.5, '#8c949c'); g.addColorStop(.58, '#7a8288'); g.addColorStop(1, '#1e2226'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(40,44,50,.35)'; c.lineWidth = 26; c.lineCap = 'round'; // trois chemins qui divergent
    [[180, 1150], [540, 860], [900, 1150]].forEach(([x, y]) => { c.beginPath(); c.moveTo(540, H + LM); c.quadraticCurveTo(540 + (x - 540) * .2, 1500, x, y); c.stroke(); });
    c.fillStyle = '#5a5e64'; c.fillRect(380, 1540, 320, 40); c.fillStyle = '#4a4e54'; c.fillRect(400, 1580, 280, 260); c.fillStyle = '#5a5e64'; c.fillRect(370, 1830, 340, 40); // le socle
  }
  const FOG = prerender(drawFogStatic, 1.2);
  const WALK = [[180, 1150, .95, C.lamp, 'LOCKE', -1], [540, 860, .55, C.blue, 'NEUROSCIENCES', 0], [900, 1150, .95, C.saff, 'BOUDDHISME', 1]];
  const CRACKS = [[[540, 1060], [552, 1120], [536, 1190], [560, 1260], [548, 1330], [574, 1400], [560, 1470], [580, 1540]], [[552, 1120], [600, 1150], [640, 1146]], [[560, 1260], [500, 1300], [450, 1290], [400, 1340]], [[548, 1330], [620, 1360], [700, 1420]]];
  const SHARDS = [[[575, 1030], [610, 1040], [600, 1075], [572, 1062]], [[360, 1420], [400, 1400], [410, 1450], [372, 1460]], [[730, 1430], [770, 1440], [760, 1480], [722, 1470]]];
  const STAT = prerender(c => { // la statue : une identité de pierre (calque à part)
    const sg = c.createLinearGradient(330, 980, 760, 1540); sg.addColorStop(0, '#9EA3AA'); sg.addColorStop(.45, '#6a6e76'); sg.addColorStop(1, '#2e3238'); c.fillStyle = sg; bustSil(c, 540, 1540, 1.1, 1);
    c.globalCompositeOperation = 'source-atop'; const sh2 = c.createLinearGradient(420, 0, 680, 0); sh2.addColorStop(0, 'rgba(255,255,255,.18)'); sh2.addColorStop(.5, 'rgba(255,255,255,0)'); sh2.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = sh2; c.fillRect(250, 900, 580, 660);
    const r6 = rng(61); c.fillStyle = 'rgba(30,32,36,.25)'; for (let k = 0; k < 160; k++) c.fillRect(260 + r6() * 560, 960 + r6() * 580, 2 + r6() * 3, 2 + r6() * 3);
    c.globalCompositeOperation = 'source-over'; }, 1);
  const SC6 = off(STAT.width, STAT.height), sc6 = SC6.getContext('2d');
  function scene6(c, t) {
    const zp = prog(t, T.s6, T.s7, 'inOutSine'), shake = prog(t, T.ebranlent - .1, T.ebranlent + .2, 'linear') * (1 - prog(t, T.ebranlent + .2, T.ebranlent + .9, 'linear'));
    camSafe(c, lerp(1.08, 1.02, zp), 540 + Math.sin(t * 60) * 5 * shake, lerp(1080, 1040, zp) + Math.cos(t * 53) * 4 * shake);
    blit(c, FOG);
    const conv = prog(t, T.ebranlent - .4, T.ebranlent + .3, 'inOutCubic');
    WALK.forEach(([x, y, s, col, label, dir], i) => {
      const a = prog(t, T.approches - .4 + i * .25, T.approches + .4 + i * .25, 'outCubic'); if (a <= 0) return;
      const lx = x + 34 * s * (dir === 1 ? -1 : 1), ly = y - 96 * s, div = prog(t, T.chose - .5, T.chose + .3, 'inOutCubic');
      const tx0 = lerp(x + dir * 300, x + dir * 520, div), ty0 = lerp(y - 320, y - 520, div), tx1 = lerp(tx0, 540, conv), ty1 = lerp(ty0, 1230, conv);
      beam(c, lx, ly, tx1 - 70, ty1, tx1 + 70, ty1 + 40, col, .22 * a, 22);
      person(c, { x, y, s, f: dir === 1 ? -1 : 1, phone: 0, alpha: a * .92, hand: [lx, ly] }, col, 2);
      glow(c, lx, ly, 60 * s, col, .8 * a); c.fillStyle = rgba('#FFFFFF', .9 * a); c.beginPath(); c.arc(lx, ly, 5 * s, 0, 6.283); c.fill();
      c.save(); c.globalAlpha = a * .9; c.font = `600 ${Math.round(26 * Math.sqrt(s))}px Fraunces`; c.fillStyle = col; c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 10; c.fillText(label, x, y + 46 * s); c.restore();
    });
    for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = .2; c.filter = 'blur(34px)'; c.fillStyle = '#E6EAEE'; c.fillRect(-LM + ((t * 16 * (k + 1)) % 600) - 300, 1060 + k * 110, W + 2 * LM, 80); c.restore(); } // brume
    // la statue (une identité de pierre)
    const fall = prog(t, T.figee - .15, T.figee + 1.4, 'inCubic');
    sc6.setTransform(1, 0, 0, 1, 0, 0); sc6.clearRect(0, 0, SC6.width, SC6.height); sc6.drawImage(STAT, 0, 0);
    if (fall > 0) { sc6.setTransform(1, 0, 0, 1, LM, LM); sc6.globalCompositeOperation = 'destination-out'; SHARDS.forEach(q => { sc6.beginPath(); sc6.moveTo(...q[0]); q.slice(1).forEach(p => sc6.lineTo(...p)); sc6.closePath(); sc6.fill(); }); sc6.globalCompositeOperation = 'source-over'; }
    blit(c, SC6);
    const cr = prog(t, T.ebranlent - .1, T.figee + .3, 'inOutSine');
    if (cr > 0) CRACKS.forEach((pts, i) => { const p = clamp(cr * 1.5 - i * .2); if (p <= 0) return; c.strokeStyle = '#1a1c20'; c.lineWidth = 4; strokeProg(c, pts, p); c.save(); c.strokeStyle = '#FFE8C0'; c.lineWidth = 1.6; c.shadowColor = '#FFD98A'; c.shadowBlur = 14; strokeProg(c, pts, p); c.restore(); });
    if (conv > 0) glow(c, 540, 1230, 260, '#FFF0D8', .3 * conv);
    if (fall > 0) SHARDS.forEach((q, i) => { const dy = fall * (420 + i * 60), rot = fall * (i - 1) * 2; const cx = q.reduce((s, p) => s + p[0], 0) / 4, cy = q.reduce((s, p) => s + p[1], 0) / 4;
      c.save(); c.globalAlpha = 1 - fall * .6; c.translate(cx, cy + dy); c.rotate(rot); c.fillStyle = '#9a9ea6'; c.beginPath(); c.moveTo(q[0][0] - cx, q[0][1] - cy); q.slice(1).forEach(p => c.lineTo(p[0] - cx, p[1] - cy)); c.closePath(); c.fill(); c.restore(); });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#1a1e24', .6, 520);
    vignette(c, .5, '#0a0c0e');
  }

  /* =====================================================================
     DÉCOR 7 — LA GALERIE DES TROIS CADRES : été, sommes, devenir
     ===================================================================== */
  function drawGalleryStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#140c0e'); g.addColorStop(.6, '#24161a'); g.addColorStop(1, '#0c0809'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.fillStyle = '#100a0b'; c.fillRect(-LM, 1500, W + 2 * LM, 24); g = c.createLinearGradient(0, 1524, 0, H + LM); g.addColorStop(0, '#2a1a14'); g.addColorStop(1, '#0c0806'); c.fillStyle = g; c.fillRect(-LM, 1524, W + 2 * LM, H); // le parquet
  }
  const GAL = prerender(drawGalleryStatic, 1.2);
  function giltRect(c, x, y, w, h) { const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#5a3e14'); g.addColorStop(.4, '#E8C878'); g.addColorStop(.7, '#8a6224'); g.addColorStop(1, '#4a3010'); c.fillStyle = g; c.fillRect(x - 22, y - 22, w + 44, h + 44); c.fillStyle = '#1a1208'; c.fillRect(x - 4, y - 4, w + 8, h + 8); }
  function pictureLight(c, x, y, on) { c.fillStyle = '#6a5228'; c.fillRect(x - 50, y, 100, 14); c.fillRect(x - 4, y - 30, 8, 30); if (on > 0) { beam(c, x, y + 14, x - 190, y + 470, x + 190, y + 470, '#FFE2B0', .16 * on, 24); glow(c, x, y + 10, 70, '#FFE8C0', .7 * on); } }
  function scene7(c, t) {
    const L = [prog(t, T.ete - .3, T.ete + .4, 'outCubic'), prog(t, T.sommes - .3, T.sommes + .4, 'outCubic'), prog(t, T.devenir - .3, T.devenir + .6, 'outCubic')];
    const zp = prog(t, T.s7, T.title + 1, 'inOutSine'), fx = 540 - 90 * L[0] * (1 - L[1]) + 100 * L[2] * (1 - prog(t, T.qEnd, T.title + .6, 'inOutSine'));
    camSafe(c, lerp(1.0, 1.08, zp), fx, lerp(1060, 1010, zp));
    blit(c, GAL);
    const base = .25;
    // passé : la photographie de l'enfant
    glow(c, 210, 1010, 300, '#FFE2B0', .25 * L[0]); giltRect(c, 85, 850, 250, 320); c.save(); c.beginPath(); c.rect(85, 850, 250, 320); c.clip(); c.globalAlpha = base + (1 - base) * L[0]; c.drawImage(PH_CHILD, 30, 30, 520, 640, 72, 834, 276, 346); c.restore();
    // présent : le miroir et le reflet de l'adulte
    const m = { x: 540, y: 1000, rx: 140, ry: 210 };
    glow(c, 540, 1000, 320, '#FFE2B0', .25 * L[1]);
    mirror(c, m, t, cc => reflections(cc, m, base + (1 - base) * L[1], 0, 0), 0);
    // avenir : un cadre ouvert sur la lumière, une silhouette qui se forme
    giltRect(c, 745, 850, 250, 320); c.save(); c.beginPath(); c.rect(745, 850, 250, 320); c.clip();
    let g = c.createLinearGradient(0, 850, 0, 1170); g.addColorStop(0, mix('#2a2430', '#F6E2C0', L[2])); g.addColorStop(1, mix('#1a1620', '#E8B890', L[2])); c.fillStyle = g; c.fillRect(745, 850, 250, 320);
    glow(c, 870, 960, 200, '#FFFFFF', .5 * L[2]);
    for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = .25; c.filter = 'blur(16px)'; c.fillStyle = '#FFFFFF'; c.fillRect(745 + ((t * 30 * (k + 1)) % 300) - 150, 1040 + k * 40, 300, 30); c.restore(); }
    person(c, { x: 870, y: 1160, s: .82, f: -1, phone: 0, alpha: .15 + .75 * L[2] * prog(t, T.devenir, T.title, 'inOutSine') }, '#FFFFFF', 2);
    c.restore();
    [[210, 760], [540, 720], [870, 760]].forEach(([x, y], i) => pictureLight(c, x, y, L[i]));
    rimmed(c, cc => bustSil(cc, 540, 1990, 1.35, 1), { body: '#050304', rim: '#FFE2B0', rimA: .3 + .5 * Math.max(...L), dx: 0, dy: 5 }); // l'élève, devant les trois cadres
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0c0607', .72, 700);
    c.fillStyle = rgba('#05030a', .55 * prog(t, T.qEnd, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .55, '#030102');
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
  const SCN = [[0, T.s2, scene1], [T.s2, T.s3, scene2], [T.s3, T.s3b, scene3a], [T.s3b, T.s4, scene3b], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5], [T.s6, T.s7, scene6], [T.s7, DUR + 1, scene7]];
  const TRS = [
    { at: T.s2, d: 1.1, kind: 'dissolve', a: scene1, b: scene2 },
    { at: T.s3, d: 1.1, kind: 'warm', a: scene2, b: scene3a },
    { at: T.s3b, d: 1.0, kind: 'drift', a: scene3a, b: scene3b },
    { at: T.s4, d: 1.1, kind: 'tilt', a: scene3b, b: scene4, o: { dir: 1 } },
    { at: T.s5, d: 1.1, kind: 'dissolve', a: scene4, b: scene5 },
    { at: T.s6, d: 1.1, kind: 'drift', a: scene5, b: scene6 },
    { at: T.s7, d: 1.1, kind: 'warm', a: scene6, b: scene7 },
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
    (function () { const p = prog(t, .2, 1.3, 'outCubic'), o = 1 - prog(t, T.visage - .7, T.visage - .2, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    const e1 = T.s1b - .2;
    fade(tPh, t, T.visage - .3, e1, .6, 10, .3); slam(tVis, t, T.visage - .1, e1, .3);
    revealWords(tQ2, t, T.q2, 1 - prog(t, T.s3 - .4, T.s3 - .1, 'inCubic'));
    const e3 = T.s3b - .4;
    slam(tLocke, t, T.john - .1, e3, .3); fade(tLockeSub, t, T.john + .3, e3, .6, 8, .3); fade(tTroub, t, T.troublante - .15, e3, .5, 12, .3); fade(tCredit, t, T.john + .5, e3, .6, 4, .3);
    const e3b = T.s3c - .25;
    fade(tIdA, t, T.identite - .2, e3b, .5, 10, .3); slam(tIdB, t, T.continuite - .1, e3b, .3);
    const e3c = T.s4 - .35;
    tQuote.forEach((n, k) => fade(n, t, T.s3c + .05 + k * .2, e3c, .6, 12, .3)); fade(tQuoteRef, t, T.s3c + .7, e3c, .6, 6, .3);
    const e4 = T.s5 - .35;
    fade(tNeu, t, T.neurosciences - .15, e4, .5, 10, .3);
    fade(tMem1, t, T.memoire - .25, T.s4c - .2, .5, 12, .25); slam(tMem2, t, T.enregistrement - .1, T.s4c - .2, .25);
    slam(tRec, t, T.reconstruit - .1, e4, .3); fade(tMod, t, T.modifiant - .25, e4, .5, 12, .3); fade(tSch, t, T.memoire, e4, .6, 4, .3);
    const e5 = T.s6 - .35;
    fade(tBud, t, T.bouddhiste - .15, e5, .5, 10, .3);
    tSn.forEach((n, k) => fade(n, t, T.s5b + .1 + k * .25, e5, .6, 12, .3)); fade(tSnRef, t, T.s5b + .7, e5, .6, 6, .3);
    const e6 = T.s7 - .35;
    fade(tAp, t, T.approches - .5, T.s6b - .25, .6, 12, .25);
    fade(tEb, t, T.s6b - .1, e6, .5, 12, .3);
    const crack = prog(t, T.figee - .05, T.figee + .3, 'outBack'), fa = prog(t, T.s6b + .6, T.s6b + .67, 'linear'), fz = prog(t, T.s6b + .6, T.s6b + 1.05, 'outExpo'), fo = 1 - prog(t, e6, e6 + .3, 'inCubic');
    set(tFigA, { s: 1.12 - .12 * fz, o: fa * fo, blur: (1 - fa) * 6 }); set(tFigB, { s: 1.12 - .12 * fz, o: fa * fo, blur: (1 - fa) * 6, x: 7 * crack, y: 9 * crack, r: 1.1 * crack });
    revealWords(tQ7, t, T.q7, 1 - prog(t, T.title - .25, T.title + .15, 'inCubic'));
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores (la musique de fond est continue) ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7]].forEach(([n, x]) => sfx('sec_' + n, x));
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('musicbox', .4, { d: T.s2 - .6 }); sfx('shutter', cue('s1a', 'photographie') - .05); sfx('photo', T.s1b - .3); [T.reves, T.croyances, T.aimer].forEach(x => sfx('chime', x));
  sfx('mirror', T.toujours - .1); sfx('mirror', T.personne2 - .1);
  sfx('fire', T.s3 + .2, { d: T.s3b - T.s3 }); sfx('glow', T.john);
  sfx('thread', T.continuite - .3, { d: 1.8 }); FR.forEach((f, i) => sfx('chime', T.reconnaitre - .2 + i * .26));
  sfx('glow', T.neurosciences); sfx('scatter', T.fidele - .1); sfx('gather', T.reconstruit - .3, { d: 1.6 }); sfx('glow', T.modifiant);
  sfx('water', T.s5, { d: T.s6 - T.s5 }); [T.corps, T.sensations, T.pensees, T.conscience5].forEach(x => sfx('chime', x)); sfx('glow', T.moi); sfx('dust', T.immuable - .3, { d: 2.2 });
  sfx('wind', T.s6, { d: T.s7 - T.s6 }); sfx('crack', T.ebranlent); sfx('crumble', T.figee);
  sfx('musicbox', T.ete - .2, { d: 2.6 }); sfx('glow', T.sommes); sfx('glow', T.devenir);
  sfx('question', T.q7); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : le miroir, l'adulte et l'enfant superposés
    COVER = true; render(T.q2 + 1.6); COVER = false;
    set(tSeries, { o: 1, blur: 0, s: 1, y: -10 }); tSeries.style.top = '80px';
    tQ2.forEach(n => { n.style.opacity = 0; });
    [tCovA, tCovB].forEach(n => set(n, { o: 1, blur: 0, s: 1 })); SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
