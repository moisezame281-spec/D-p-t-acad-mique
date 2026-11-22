/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 005 — « Et si tu ne cherchais pas la vérité, mais à avoir raison ? »
   Style validé (ép. 004 v2) : explication continue, une seule musique de fond, fondus enchaînés en mouvement.
   Décors nouveaux : la cloche de verre (la chambre d'écho), les deux observateurs, la caverne de Platon,
   les deux lumières (un cercle, un rectangle), le corridor éclairé par la lanterne, le filtre du biais,
   défendre / rechercher, la cloche qui se fend.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, makeDust, dust, personPath, lattice, archPath, star8, khatam, rng, off } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', bord: '#541D2A', rose: '#E8949A', lamp: '#F2C27D', fire: '#F29A4A', orange: '#F2A65A', blue: '#7FB2E5', teal: '#5FC9C0' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', 'italic 700 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument'].map(f => document.fonts.load(f, 'Aaé')));
  await document.fonts.load('400 40px Amiri', 'الإسراء');

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    verite1: cue('s1a', 'verite'), raison1: cue('s1a', 'raison'), qEnd1: SEN('s1a').end, piege: cue('s1b', 'piege'), dangereux: cue('s1b', 'dangereux'),
    convaincu: cue('s1c', 'convaincu'), raison1c: cue('s1c', 'raison'), plus: cue('s1c', 'plus'), verite1c: cue('s1c', 'verite'),
    s2: SEN('s2a').start - .3, experience: cue('s2a', 'experience'), deux: cue('s2b', 'deux'), observent: cue('s2b', 'observent'), meme: cue('s2b', 'meme'), evenement: cue('s2b', 'evenement'),
    retient: cue('s2c', 'retient'), details: cue('s2c', 'details'), confirment: cue('s2c', 'confirment'), deja: cue('s2c', 'deja'),
    s3: SEN('s3a').start - .3, platon: cue('s3a', 'platon'), caverne: cue('s3a', 'caverne'), prisonniers: cue('s3b', 'prisonniers'), ombres: cue('s3b', 'ombres'), realite: cue('s3b', 'realite'), jamais: cue('s3b', 'jamais'), autre: cue('s3b', 'autre'),
    s4: SEN('s4a').start - .3, bible: cue('s4a', 'bible'), proverbes: cue('s4a', 'proverbes'), premiere: cue('s4b', 'premiere'), sembler: cue('s4b', 'sembler'), juste: cue('s4b', 'juste'), personne: cue('s4b', 'personne'), examiner: cue('s4b', 'examiner'),
    s5: SEN('s5a').start - .3, coran: cue('s5a', 'coran'), sourate: cue('s5a', 'sourate'), garde: cue('s5b', 'garde'), suivre: cue('s5b', 'suivre'), connaissance: cue('s5b', 'connaissance'),
    s6: SEN('s6a').start - .3, psychologie: cue('s6a', 'psychologie'), biais: cue('s6a', 'biais'), tendance: cue('s6a', 'tendance'), informations: cue('s6a', 'informations'), confortent: cue('s6a', 'confortent'), croyances: cue('s6a', 'croyances'),
    s7: SEN('s7a').start - .3, distinction: cue('s7a', 'distinction'), defendre: cue('s7b', 'defendre'), rechercher: cue('s7b', 'rechercher'), verite7: cue('s7b', 'verite'),
    s8: SEN('s8a').start - .35, q: SEN('s8a').start, accepte: cue('s8a', 'accepte'), certitudes: cue('s8a', 'certitudes'), question8: cue('s8a', 'question'), qEnd: SEN('s8a').end,
  };
  T.title = T.qEnd + .55; T.qWords = SEN('s8a').words;

  /* ---------- texte (DOM) ---------- */
  const tx = (html, cls, style) => el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
  function fit(n, maxW) { const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block'; let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; } n.style.width = w; n.style.display = d; return n; }
  function slam(n, t, t0, t1, out = .3) { const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 }); }
  function wipe(n, t, t0, t1, dur = .7, out = .45) { const p = prog(t, t0, t0 + dur, 'outQuart'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); n.style.clipPath = `inset(-20% ${(100 - p * 100).toFixed(2)}% -20% 0)`; set(n, { x: (1 - p) * 18, o: o * (p > 0 ? 1 : 0) }); }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) { const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 }); }
  const grad = (a, b, c) => `background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(0,0,0,.6))`;
  const gspan = (txt, a, b, c, pad = '6px .08em 4px') => `<span style="display:inline-block;padding:${pad};${grad(a, b, c)}">${txt}</span>`;
  const CENTER = { left: '0', width: '1080px', textAlign: 'center' };
  const ROSE = ['#FFF4F2', '#F6C9C6', '#E8949A'], GOLD = ['#FFFFFF', '#F3E6CC', C.gold], ICE = ['#FFFFFF', '#DCEBFF', '#A9C8F0'];
  const small = (txt, top, col = 'rgba(242,239,232,.85)') => tx(txt, 'fraunces', Object.assign({ top: top + 'px', fontWeight: 600, fontSize: '32px', letterSpacing: '.22em', paddingLeft: '.22em', color: col }, CENTER));

  // ouverture (identité de série)
  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;005</div>`, '', Object.assign({ top: '150px', textShadow: 'none' }, CENTER));
  // S1 — la question, la cloche de verre
  const tQa = small('ET SI TU NE CHERCHAIS PAS', 430);
  const tQb = fit(tx(gspan('LA VÉRITÉ,', ...ICE, '12px .06em 4px'), 'bodoni', Object.assign({ top: '484px', fontWeight: 900, fontSize: '128px', textShadow: 'none' }, CENTER)), 1000);
  const tQc = tx('mais à avoir raison&#8239;?', 'instrument', Object.assign({ top: '640px', fontStyle: 'italic', fontSize: '96px', color: C.rose }, CENTER)); fit(tQc, 1000);
  const tPiege = small('UN PIÈGE INTELLECTUEL', 230, C.rose);
  const tConv = fit(tx(gspan('CONVAINCU D’AVOIR RAISON', ...ROSE, '10px .06em 4px'), 'bodoni', Object.assign({ top: '300px', fontWeight: 900, fontSize: '80px', textShadow: 'none' }, CENTER)), 1000);
  const tPlus = tx('on ne cherche plus la vérité', 'instrument', Object.assign({ top: '410px', fontStyle: 'italic', fontSize: '68px' }, CENTER));
  // S2 — les deux observateurs
  const tExp = small('UNE EXPÉRIENCE SIMPLE', 196);
  const tMeme = fit(tx(gspan('LE MÊME ÉVÉNEMENT', ...GOLD, '10px .06em 4px'), 'bodoni', Object.assign({ top: '262px', fontWeight: 900, fontSize: '96px', textShadow: 'none' }, CENTER)), 1000);
  const tRet1 = tx('chacun ne retient que ce qui confirme', 'instrument', Object.assign({ top: '384px', fontStyle: 'italic', fontSize: '58px' }, CENTER)); fit(tRet1, 1000);
  const tRet2 = tx('ce qu’il croyait déjà', 'instrument', Object.assign({ top: '452px', fontStyle: 'italic', fontSize: '66px', color: C.rose }, CENTER));
  // S3 — Platon, la caverne
  const tPla = fit(tx(gspan('PLATON', ...GOLD, '8px .06em 4px'), 'bodoni', Object.assign({ top: '160px', fontWeight: 900, fontSize: '96px', textShadow: 'none' }, CENTER)), 1000);
  const tPlaSub = tx('v. 429 – 347 av. J.-C. · <i>La République</i>', 'fraunces', Object.assign({ top: '280px', fontWeight: 500, fontSize: '30px', color: 'rgba(242,239,232,.86)' }, CENTER));
  const tCav = small('L’ALLÉGORIE DE LA CAVERNE', 336, C.lamp);
  const tOmb = tx('des ombres', 'instrument', Object.assign({ top: '420px', fontStyle: 'italic', fontSize: '84px', color: C.rose }, CENTER));
  const tReal = fit(tx(gspan('PRISES POUR LA RÉALITÉ', ...GOLD, '10px .06em 4px'), 'bodoni', Object.assign({ top: '520px', fontWeight: 900, fontSize: '78px', textShadow: 'none' }, CENTER)), 1000);
  // S4 — Proverbes 18:17
  const tPr = small('PROVERBES 18 : 17', 176);
  const tPrQ1 = tx('«&#8239;Le premier qui parle dans sa cause paraît juste&#8239;;', 'instrument', Object.assign({ top: '240px', fontStyle: 'italic', fontSize: '54px' }, CENTER)); fit(tPrQ1, 1010);
  const tPrQ2 = tx(gspan('vient sa partie adverse, et on l’examine.&#8239;»', ...GOLD, '4px .1em 6px'), 'instrument', Object.assign({ top: '306px', fontStyle: 'italic', fontSize: '62px', textShadow: 'none' }, CENTER)); fit(tPrQ2, 1010);
  const tLSG = tx('trad. Louis Segond, 1910', 'fraunces', Object.assign({ top: '400px', fontWeight: 500, fontSize: '23px', letterSpacing: '.08em', color: 'rgba(242,239,232,.75)' }, CENTER));
  const tV1 = tx('une première version', 'instrument', { left: '70px', top: '1150px', fontStyle: 'italic', fontSize: '46px', color: C.lamp });
  const tV2 = tx('… examinée', 'instrument', { right: '60px', top: '1150px', fontStyle: 'italic', fontSize: '46px', color: '#CFE0FF', textAlign: 'right' });
  // S5 — Coran 17:36
  const tSour = small('SOURATE AL-ISRÂ’', 168, C.ivory);
  const tAr = tx('الإسراء', 'amiri', Object.assign({ top: '206px', fontSize: '116px', color: '#F3D9A0', direction: 'rtl' }, CENTER));
  const tVers = tx('17 : 36', 'fraunces', Object.assign({ top: '398px', fontWeight: 600, fontSize: '36px', letterSpacing: '.2em', paddingLeft: '.2em', color: C.rose }, CENTER));
  const tSuiv = fit(tx(gspan('NE PAS SUIVRE', ...GOLD, '10px .06em 4px'), 'bodoni', Object.assign({ top: '470px', fontWeight: 900, fontSize: '110px', textShadow: 'none' }, CENTER)), 1000);
  const tConn = tx('ce dont on n’a aucune connaissance', 'instrument', Object.assign({ top: '610px', fontStyle: 'italic', fontSize: '60px', color: C.rose }, CENTER)); fit(tConn, 1000);
  // S6 — biais de confirmation
  const tPsy = small('LA PSYCHOLOGIE', 190, '#9FE3DB');
  const tBia = fit(tx(gspan('BIAIS DE CONFIRMATION', ...ROSE, '10px .06em 4px'), 'bodoni', Object.assign({ top: '252px', fontWeight: 900, fontSize: '92px', textShadow: 'none' }, CENTER)), 1010);
  const tBia2 = tx('privilégier ce qui conforte nos croyances', 'instrument', Object.assign({ top: '372px', fontStyle: 'italic', fontSize: '56px' }, CENTER)); fit(tBia2, 1000);
  const tNick = tx('R. S. Nickerson, <i>Review of General Psychology</i>, 1998', 'fraunces', Object.assign({ top: '452px', fontWeight: 500, fontSize: '23px', color: 'rgba(242,239,232,.7)' }, CENTER));
  // S7 — défendre / rechercher
  const tDist = small('UNE DISTINCTION ESSENTIELLE', 196, C.ivory);
  const tDef = tx('DÉFENDRE', 'bodoni', { left: '0', width: '540px', textAlign: 'center', top: '300px', fontWeight: 900, fontSize: '58px', color: '#F6C9C6' });
  const tDef2 = tx('une idée', 'instrument', { left: '0', width: '540px', textAlign: 'center', top: '380px', fontStyle: 'italic', fontSize: '56px', color: 'rgba(242,239,232,.85)' });
  const tRec = tx('RECHERCHER', 'bodoni', { left: '540px', width: '540px', textAlign: 'center', top: '300px', fontWeight: 900, fontSize: '50px', paddingTop: '6px', color: '#DCEBFF' });
  const tRec2 = tx('sa vérité', 'instrument', { left: '540px', width: '540px', textAlign: 'center', top: '380px', fontStyle: 'italic', fontSize: '56px', color: 'rgba(242,239,232,.85)' });
  const tNeq = tx('≠', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '452px', fontWeight: 700, fontSize: '110px', color: C.ivory, textShadow: '0 0 30px rgba(0,0,0,.9)' });
  // S8 — la phrase finale, mot après mot
  const QL = [[[['La', 0], ['véritable', 1], ['intelligence', 2]], 78, 300, C.ivory],
    [[['commence', 3], ['peut-être', 4]], 78, 392, C.ivory],
    [[['au', 6], ['moment', 7], ['où', 8], ['l’on', 9], ['accepte', 11]], 64, 492, C.ivory],
    [[['que', 12], ['ses', 13], ['propres', 14], ['certitudes', 15]], 82, 572, C.rose],
    [[['puissent', 16], ['être', 17], ['remises', 18], ['en', 19], ['question.', 20]], 70, 672, C.ivory]];
  const tQ = QL.map(([ws, fs, y, col]) => tx(ws.map(([w, i]) => `<span class="qw" data-i="${i}" style="display:inline-block;margin:0 .12em">${w}</span>`).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)));
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', Object.assign({ top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }, CENTER));
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', Object.assign({ top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose }, CENTER));
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', Object.assign({ top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' }, CENTER));

  /* ---------- sous-titres ---------- */
  const NOSUB = new Set(['s1a', 's8a']);
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
  function coatPath(c, p) { const s = p.s || 1, f = p.f || 1, P = (x, y) => [p.x + x * s * f, p.y + y * s];
    c.beginPath(); c.moveTo(...P(-15, -150)); c.lineTo(...P(15, -150)); c.lineTo(...P(24, -56)); c.lineTo(...P(-22, -54)); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(...P(7, -178), 13 * s, 8 * s, 0, Math.PI, 2 * Math.PI); c.fill(); }
  const person = (c, p, rim, dx, extra) => rimmed(c, cc => { personPath(cc, p); if (extra) extra(cc, p); }, { body: '#06070a', rim, rimA: .85, dx, alpha: p.alpha == null ? 1 : p.alpha });

  /* =====================================================================
     DÉCOR 1 & 8 — LA CLOCHE DE VERRE (la chambre d'écho)
     ===================================================================== */
  const DOME = { x: 540, base: 1730, R: 310, h: 700 };
  const domePath = (c) => archPath(c, DOME.x, DOME.base, DOME.R * 2, DOME.h, false);
  const echoes = (() => { const r = rng(55); return Array.from({ length: 16 }, () => ({ x: r(), y: r(), vx: (r() - .5) * .22, vy: (r() - .5) * .18, s: 26 + r() * 22, ph: r() * 6 })); })();
  const CRACKS = (() => { const r = rng(9), out = []; function br(x, y, a, len, d, t0) { const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; out.push({ x, y, x2, y2, t0 }); if (d < 4) for (let k = 0; k < 2; k++) br(x2, y2, a + (r() - .5) * 1.4, len * (.6 + r() * .3), d + 1, t0 + .12); }
    for (let k = 0; k < 7; k++) br(780, 1400, k * .9 + r() * .4, 90 + r() * 70, 0, 0); return out; })();
  const SHARDS = (() => { const r = rng(4); return Array.from({ length: 34 }, () => { const a = Math.PI + r() * Math.PI, rr = DOME.R * (.5 + r() * .5); return { x: DOME.x + Math.cos(a) * rr, y: DOME.base - DOME.h + DOME.R + Math.sin(a) * rr * .9 + r() * 200, vx: (r() - .5) * 160, vr: (r() - .5) * 4, s: 14 + r() * 26 }; }); })();
  function drawDomeRoom(c, t, st) {
    const open = st.open || 0, light = st.light || 0;
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, mix('#05070c', '#2a3346', light)); g.addColorStop(.6, mix('#0d1320', '#8a96a8', light * .8)); g.addColorStop(1, mix('#06080c', '#3a3f4a', light * .6));
    c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 860, 420, 700, '#DCEBFF', .22 + .6 * light); glow(c, 860, 420, 160, '#FFFFFF', .35 + .5 * light); // la lumière du dehors : la vérité
    // galerie de miroirs (ils renvoient tous la même silhouette)
    const mir = 1 - open;
    for (const [x, sc] of [[110, .62], [300, .7], [780, .7], [970, .62]]) {
      c.save(); archPath(c, x, 1600, 170 * sc / .7, 900 * sc / .7, true); c.fillStyle = mix('#0a0f18', '#2a3346', light * .5); c.fill(); c.strokeStyle = rgba('#A9C8F0', .2 + .2 * mir); c.lineWidth = 3; c.stroke(); c.clip();
      const g2 = c.createLinearGradient(x - 80, 0, x + 80, 0); g2.addColorStop(0, 'rgba(169,200,240,0)'); g2.addColorStop(.5, rgba('#A9C8F0', .1 * mir)); g2.addColorStop(1, 'rgba(169,200,240,0)'); c.fillStyle = g2; c.fillRect(x - 100, 600, 200, 1100);
      if (mir > 0) rimmed(c, cc => personPath(cc, { x, y: 1600, s: 1.25 * sc / .7, f: x < 540 ? 1 : -1, head: Math.sin(t * 2.4) * .12 * st.nod }), { body: '#0a0e16', rim: '#A9C8F0', rimA: .5, dx: x < 540 ? 2 : -2, alpha: .55 * mir });
      c.restore();
    }
    // sol réfléchissant
    g = c.createLinearGradient(0, DOME.base, 0, H + LM); g.addColorStop(0, mix('#101622', '#6a7280', light * .6)); g.addColorStop(1, '#05070a'); c.fillStyle = g; c.fillRect(-LM, DOME.base, W + 2 * LM, H + LM);
    // socle
    c.fillStyle = '#0b0d12'; c.beginPath(); c.ellipse(DOME.x, DOME.base + 10, DOME.R + 60, 40, 0, 0, 6.283); c.fill();
    c.strokeStyle = rgba('#C0A16A', .5); c.lineWidth = 3; c.beginPath(); c.ellipse(DOME.x, DOME.base + 4, DOME.R + 50, 32, 0, Math.PI, 2 * Math.PI); c.stroke();
    // l'élève sous la cloche
    person(c, st.who || { x: 540, y: DOME.base - 4, s: 1.9, f: 1, head: Math.sin(t * 2.4) * .12 * st.nod }, mix('#A9C8F0', '#FFFFFF', light), 3);
    // les mots qui résonnent sous la cloche (l'écho de ce qu'on pense déjà)
    if (st.echo > 0) { c.save(); domePath(c); c.clip(); c.font = 'italic 400 34px Instrument'; c.textAlign = 'center';
      echoes.forEach((e, i) => { const bx = DOME.x - DOME.R + 40, bw = DOME.R * 2 - 80, by = DOME.base - DOME.h + 120, bh = DOME.h - 300;
        const px = bx + Math.abs(((e.x + e.vx * t) % 2 + 2) % 2 - 1) * bw, py = by + Math.abs(((e.y + e.vy * t) % 2 + 2) % 2 - 1) * bh;
        c.font = `italic 400 ${e.s}px Instrument`; c.fillStyle = rgba(i % 3 ? '#E8949A' : '#F6C9C6', st.echo * (.35 + .35 * Math.sin(t * 2 + e.ph))); c.fillText('raison', px, py); });
      c.restore(); }
    // la cloche de verre
    const da = 1 - open;
    if (da > 0) {
      c.save(); c.globalAlpha = da; domePath(c); c.fillStyle = 'rgba(200,220,255,.05)'; c.fill(); c.strokeStyle = 'rgba(220,235,255,.55)'; c.lineWidth = 3.5; c.stroke();
      domePath(c); c.clip();
      for (const [x0, w, a] of [[DOME.x - DOME.R + 36, 18, .35], [DOME.x - DOME.R + 70, 8, .22], [DOME.x + DOME.R - 50, 10, .16]]) { const g3 = c.createLinearGradient(0, DOME.base - DOME.h, 0, DOME.base); g3.addColorStop(0, rgba('#FFFFFF', a)); g3.addColorStop(1, rgba('#FFFFFF', 0)); c.fillStyle = g3; c.fillRect(x0, DOME.base - DOME.h, w, DOME.h); }
      c.restore();
      c.save(); c.globalAlpha = da; c.fillStyle = '#C9D6E8'; c.beginPath(); c.arc(DOME.x, DOME.base - DOME.h - 14, 16, 0, 6.283); c.fill(); c.restore();
      // la lumière extérieure glisse sur le verre sans entrer
      beam(c, 860, 420, DOME.x + DOME.R - 30, DOME.base - DOME.h + 160, DOME.x + DOME.R + 20, DOME.base - 200, '#DCEBFF', .1 * da, 20);
    }
    // fissures puis éclats
    const ck = st.crack || 0;
    if (ck > 0 && da > 0) { c.save(); c.globalAlpha = da; c.strokeStyle = 'rgba(240,248,255,.9)'; c.lineWidth = 2.2; c.shadowColor = '#DCEBFF'; c.shadowBlur = 10; domePath(c); c.clip();
      for (const b of CRACKS) { const p = clamp((ck * 1.8 - b.t0) / .35); if (p > 0) { c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(lerp(b.x, b.x2, p), lerp(b.y, b.y2, p)); c.stroke(); } } c.restore(); glow(c, 780, 1400, 160, '#FFFFFF', .5 * ck * da); }
    if (open > 0 && open < 1) { c.save(); for (const s_ of SHARDS) { const tt = open * 1.6, x = s_.x + s_.vx * tt, y = s_.y + 600 * tt * tt; c.save(); c.translate(x, y); c.rotate(s_.vr * tt); c.globalAlpha = (1 - open) * .8; c.strokeStyle = 'rgba(220,235,255,.7)'; c.fillStyle = 'rgba(200,220,255,.12)'; c.beginPath(); c.moveTo(-s_.s / 2, 0); c.lineTo(0, -s_.s); c.lineTo(s_.s / 2, s_.s * .2); c.closePath(); c.fill(); c.stroke(); c.restore(); } c.restore(); }
    if (light > 0) beam(c, 860, 380, 380, 1800, 1000, 1800, '#FFFFFF', .14 * light, 30);
  }
  function scene1(c, t) {
    const z = lerp(1.15, 1.0, prog(t, .3, T.piege, 'inOutSine')) + prog(t, T.convaincu, T.s2, 'inOutSine') * .05;
    camSafe(c, z, 540, lerp(1150, 1000, prog(t, .3, T.piege, 'inOutSine')));
    drawDomeRoom(c, t, { nod: prog(t, T.convaincu - .2, T.convaincu + .6, 'outCubic'), echo: prog(t, T.raison1c - .3, T.raison1c + .7, 'outCubic') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#04060a', .55, 860);
    vignette(c, .55, '#020308');
    flash(c, '#000000', 1 - prog(t, 0, .7, 'outCubic'));
  }
  function scene8(c, t) {
    const z = lerp(1.06, 1.0, prog(t, T.s8, T.qEnd, 'inOutSine'));
    camSafe(c, z, 540, 1000);
    const crack = prog(t, T.accepte - .3, T.certitudes + .2, 'inOutSine'), open = prog(t, T.certitudes + .1, T.question8 + .4, 'inOutCubic'), light = prog(t, T.certitudes, T.qEnd + .3, 'inOutSine');
    const walk = prog(t, T.question8, T.title + .6, 'inOutSine');
    const who = { x: lerp(540, 700, walk), y: DOME.base - 4, s: 1.9, f: 1, walk: walk > 0 && walk < 1 ? t * 5.5 : null, phone: 0, hand: crack > 0 && open < .5 ? [lerp(600, 760, prog(t, T.accepte - .3, T.accepte + .3, 'inOutCubic')), lerp(1580, 1420, prog(t, T.accepte - .3, T.accepte + .3, 'inOutCubic'))] : null, head: -.08 * light };
    drawDomeRoom(c, t, { nod: 0, echo: 1 - open, crack, open, light, who });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#04060a', .6 - .2 * light, 900);
    c.fillStyle = rgba('#05060a', .5 * prog(t, T.qEnd, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .5, '#020308');
  }

  /* =====================================================================
     DÉCOR 2 — LES DEUX OBSERVATEURS (le même événement, deux mémoires)
     ===================================================================== */
  const SPH = { x: 540, y: 1230, r: 120 };
  const FRAGS = (() => { const r = rng(12), out = []; for (let k = 0; k < 90; k++) { const a = r() * 6.283, d = Math.sqrt(r()) * SPH.r; out.push({ x: SPH.x + Math.cos(a) * d, y: SPH.y + Math.sin(a) * d, col: r() < .5 ? 0 : 1, rot: r() * 6, s: 14 + r() * 12, k: r() }); } return out; })();
  const HEADS = [[232, 1440], [848, 1440]];
  function tri(c, x, y, s, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.moveTo(0, -s * .6); c.lineTo(s * .55, s * .4); c.lineTo(-s * .55, s * .4); c.closePath(); c.fill(); c.restore(); }
  function drawObservers(c, t, st) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#1a1714'); g.addColorStop(.6, '#2e2924'); g.addColorStop(1, '#100e0c'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    beam(c, 540, -200, 300, 1700, 780, 1700, '#FFF2DC', .22, 30); glow(c, 540, 1300, 520, '#FFE9C8', .25);
    g = c.createLinearGradient(0, 1700, 0, H + LM); g.addColorStop(0, '#3a332c'); g.addColorStop(1, '#0c0a08'); c.fillStyle = g; c.fillRect(-LM, 1700, W + 2 * LM, H + LM);
    c.fillStyle = '#14110e'; c.beginPath(); c.moveTo(470, 1700); c.lineTo(500, 1360); c.lineTo(580, 1360); c.lineTo(610, 1700); c.fill(); // socle
    // l'événement : une sphère de fragments orange et bleus
    for (const f of FRAGS) { c.fillStyle = rgba(f.col ? C.blue : C.orange, .95); tri(c, f.x, f.y, f.s, f.rot + t * .3); }
    glow(c, SPH.x, SPH.y, 240, '#FFF2DC', .25);
    // les deux observateurs, chacun avec son filtre
    person(c, { x: 230, y: 1760, s: 1.8, f: 1, phone: 0, head: .05 }, C.orange, -3);
    person(c, { x: 850, y: 1760, s: 1.8, f: -1, phone: 0, head: .05 }, C.blue, 3, coatPath);
    const lens = st.lens || 0;
    if (lens > 0) { glow(c, HEADS[0][0] + 12, HEADS[0][1] - 4, 70, C.orange, .7 * lens); glow(c, HEADS[1][0] - 12, HEADS[1][1] - 4, 70, C.blue, .7 * lens); }
    // les fragments volent vers chacun ; seuls ceux de « sa » couleur sont retenus
    const fl = st.fly || 0;
    if (fl > 0) FRAGS.forEach((f, i) => { const side = f.col ? 1 : 0, ph = clamp(fl * 1.6 - f.k * .6); if (ph <= 0) return;
      for (const s_ of [0, 1]) { const keep = s_ === side, [hx, hy] = HEADS[s_], tx_ = lerp(f.x, hx + (s_ ? -20 : 20), ph), ty = lerp(f.y, hy - 10, ph) - Math.sin(ph * Math.PI) * 140;
        const a = keep ? 1 : (1 - ph) * .6; if (a <= 0.02 || (keep && ph >= 1)) continue; c.fillStyle = rgba(f.col ? C.blue : C.orange, a * .85); tri(c, tx_, ty, f.s * (keep ? 1 - ph * .5 : 1 - ph * .3), f.rot + ph * 3); } });
    // les mémoires : chacun ne garde que sa couleur
    const mem = st.mem || 0;
    if (mem > 0) for (const [s_, x] of [[0, 230], [1, 850]]) { const y = 1020, w = 300, h = 170;
      c.save(); c.globalAlpha = mem; c.fillStyle = 'rgba(10,8,6,.55)'; c.strokeStyle = rgba(s_ ? C.blue : C.orange, .8); c.lineWidth = 2.4; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 18); c.fill(); c.stroke();
      const r = rng(30 + s_); for (let k = 0; k < Math.round(22 * mem); k++) { c.fillStyle = rgba(s_ ? C.blue : C.orange, .95); tri(c, x - w / 2 + 30 + r() * (w - 60), y - h / 2 + 30 + r() * (h - 60), 18, r() * 6); }
      c.restore(); }
  }
  function scene2(c, t) {
    camSafe(c, lerp(1.08, 1.0, prog(t, T.s2, T.s3, 'inOutSine')), 540, lerp(1060, 1000, prog(t, T.s2, T.s3, 'inOutSine')));
    drawObservers(c, t, { lens: prog(t, T.observent - .1, T.observent + .5, 'outCubic'), fly: prog(t, T.retient - .2, T.confirment + .4, 'inOutSine'), mem: prog(t, T.details, T.deja + .3, 'outCubic') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0c0a08', .55, 760);
    vignette(c, .5, '#050403');
  }

  /* =====================================================================
     DÉCOR 3 — LA CAVERNE DE PLATON (vue de côté : le feu, le muret, les prisonniers, la paroi)
     ===================================================================== */
  const WALLQ = [[690, 330], [1100, 200], [1100, 1780], [690, 1640]];
  function drawCaveStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#0a0705'); g.addColorStop(1, '#140d08'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const r = rng(77);
    // l'ouverture vers le jour, en haut à gauche, et le chemin qui y monte
    c.fillStyle = '#1a120c'; c.beginPath(); c.moveTo(-LM, 1500); c.lineTo(120, 1300); c.lineTo(200, 900); c.lineTo(228, 640); c.lineTo(262, 642); c.lineTo(250, 920); c.lineTo(190, 1320); c.lineTo(60, 1560); c.closePath(); c.fill(); // la montée
    // la roche : voûte et parois irrégulières
    c.fillStyle = '#120c08'; c.beginPath(); c.moveTo(-LM, -LM); c.lineTo(W + LM, -LM); c.lineTo(W + LM, 200); for (let x = W + 40; x > -LM; x -= 40) c.lineTo(x, 280 + Math.sin(x * .013) * 60 + r() * 40 + (x < 380 ? 240 : 0)); c.closePath(); c.fill();
    c.fillStyle = '#100a07'; c.beginPath(); c.moveTo(-LM, 1650); for (let x = -LM; x < W + LM; x += 40) c.lineTo(x, 1660 + Math.sin(x * .02) * 14 + r() * 10); c.lineTo(W + LM, H + LM); c.lineTo(-LM, H + LM); c.fill();
    // la paroi du fond (où l'on projette), en perspective
    quad(c, WALLQ); g = c.createLinearGradient(690, 0, 1100, 0); g.addColorStop(0, '#5a3a22'); g.addColorStop(1, '#3a2416'); c.fillStyle = g; c.fill();
    c.save(); quad(c, WALLQ); c.clip(); for (let k = 0; k < 60; k++) { c.fillStyle = rgba('#000000', .06 + r() * .1); c.beginPath(); c.ellipse(690 + r() * 410, 200 + r() * 1580, 20 + r() * 60, 10 + r() * 40, r(), 0, 6.283); c.fill(); } c.restore();
    // le muret (parapet) derrière les prisonniers
    c.fillStyle = '#24170e'; c.fillRect(200, 1440, 220, 210); c.fillStyle = '#3a2618'; c.fillRect(200, 1430, 220, 16);
    for (let k = 0; k < 5; k++) { c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(200, 1480 + k * 36); c.lineTo(420, 1480 + k * 36); c.stroke(); }
  }
  const CAVE = prerender(drawCaveStatic, 1.25);
  function seatedPath(c, p) { // prisonnier assis, enchaîné, tourné vers la paroi (à droite)
    const s = p.s, L = (x, y) => [p.x + x * s, p.y + y * s]; c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 16 * s; c.beginPath(); c.moveTo(...L(0, -12)); c.lineTo(...L(44, -60)); c.lineTo(...L(74, -6)); c.stroke();
    c.beginPath(); c.moveTo(...L(-18, -6)); c.quadraticCurveTo(...L(-24, -60), ...L(-8, -104)); c.quadraticCurveTo(...L(8, -112), ...L(20, -100)); c.quadraticCurveTo(...L(22, -50), ...L(16, -6)); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(...L(14 + (p.turn || 0) * -8, -126), 14 * s, 16 * s, 0, 0, 6.283); c.fill();
    c.lineWidth = 11 * s; c.beginPath(); c.moveTo(...L(10, -94)); c.lineTo(...L(34, -70)); c.lineTo(...L(50, -58)); c.stroke();
  }
  const FIGS = { vase: (c) => { c.beginPath(); c.moveTo(-14, 0); c.quadraticCurveTo(-30, -30, -12, -60); c.lineTo(-8, -76); c.lineTo(8, -76); c.lineTo(12, -60); c.quadraticCurveTo(30, -30, 14, 0); c.closePath(); c.fill(); },
    horse: (c) => { c.beginPath(); c.moveTo(-40, -20); c.lineTo(-40, 0); c.lineTo(-34, 0); c.lineTo(-30, -18); c.lineTo(20, -18); c.lineTo(24, 0); c.lineTo(30, 0); c.lineTo(30, -26); c.lineTo(44, -50); c.lineTo(54, -46); c.lineTo(40, -26); c.lineTo(30, -40); c.lineTo(-30, -40); c.closePath(); c.fill(); },
    statue: (c) => { c.beginPath(); c.arc(0, -66, 9, 0, 6.283); c.fill(); c.beginPath(); c.moveTo(-12, -56); c.lineTo(12, -56); c.lineTo(16, 0); c.lineTo(-16, 0); c.closePath(); c.fill(); c.lineWidth = 6; c.beginPath(); c.moveTo(-10, -50); c.lineTo(-26, -70); c.stroke(); } };
  function drawCave(c, t, st) {
    blit(c, CAVE);
    const fl = .8 + .2 * Math.sin(t * 9) * Math.sin(t * 5.3 + 1);
    // la lumière du feu sur la paroi, et les ombres projetées
    c.save(); quad(c, WALLQ); c.clip();
    glow(c, 850, 1000, 700, C.fire, .45 * fl);
    const carriers = [0, 1, 2].map(k => ({ x: 140 + ((t * 38 + k * 150) % 420), kind: ['vase', 'horse', 'statue'][k] }));
    c.fillStyle = 'rgba(12,6,3,.78)';
    for (const cr of carriers) { const sx = 720 + (cr.x - 140) * .9, sy = 820 + (cr.x - 140) * -.12, sc = 2.6 + (cr.x - 140) * .002;
      c.save(); c.translate(sx, sy); c.transform(1, -.32, 0, 1, 0, 0); c.scale(sc * (.9 + .1 * fl), sc); c.filter = 'blur(3px)'; FIGS[cr.kind](c); c.restore(); }
    for (const x of [470, 560]) { c.save(); c.translate(760 + (x - 470) * .9, 1420); c.transform(1, -.32, 0, 1, 0, 0); c.scale(2.2, 2.2); c.filter = 'blur(4px)'; c.beginPath(); c.ellipse(0, -60, 16, 18, 0, 0, 6.283); c.fill(); c.fillRect(-22, -44, 44, 60); c.restore(); }
    c.restore();
    // le feu
    const fx = 70, fy = 1560; glow(c, fx, fy - 60, 520, C.fire, .55 * fl); glow(c, fx, fy - 40, 140, '#FFE2A8', .8 * fl);
    for (let k = 0; k < 5; k++) { const w = Math.sin(t * (7 + k) + k) * 8; c.fillStyle = rgba(k % 2 ? '#F29A4A' : '#FFD27A', .8); c.beginPath(); c.moveTo(fx - 40 + k * 16, fy); c.quadraticCurveTo(fx - 30 + k * 16 + w, fy - 80 - k * 10, fx - 20 + k * 14 + w * 1.5, fy - 140 - (k % 3) * 30); c.quadraticCurveTo(fx - 14 + k * 16, fy - 60, fx - 6 + k * 16, fy); c.fill(); }
    // les porteurs derrière le muret, et les figures sculptées qu'ils élèvent
    for (const cr of carriers) { c.save(); c.fillStyle = c.strokeStyle = '#0a0604';
      personPath(c, { x: cr.x + 40, y: 1650, s: 1.25, f: 1, walk: t * 5 + cr.x * .02, phone: 0, hand: [cr.x + 70, 1320] }); c.fillRect(cr.x + 68, 1250, 5, 80);
      c.translate(cr.x + 70, 1252); c.scale(1.1, 1.1); FIGS[cr.kind](c); c.restore(); }
    c.fillStyle = '#24170e'; c.fillRect(200, 1440, 220, 210); c.fillStyle = '#3a2618'; c.fillRect(200, 1430, 220, 16); // le muret repasse devant
    // les prisonniers, enchaînés, face à la paroi
    for (const [x, k] of [[470, 0], [560, 1], [640, 2]]) { rimmed(c, cc => seatedPath(cc, { x, y: 1648, s: 1.15, turn: k === 0 ? st.turn || 0 : 0 }), { body: '#080504', rim: C.fire, rimA: .8, dx: -2.4 });
      c.strokeStyle = 'rgba(120,100,80,.7)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + 57, 1582); c.quadraticCurveTo(x + 60, 1640, x + 40, 1652); c.stroke(); }
    // l'ouverture vers le jour, en haut à gauche, au bout de la montée
    const dy = st.day || 0; c.save(); c.beginPath(); c.ellipse(245, 610, 64, 40, -.15, 0, 6.283); let g2 = c.createRadialGradient(245, 610, 4, 245, 610, 66); g2.addColorStop(0, '#FFFDF4'); g2.addColorStop(.75, '#F2E6C8'); g2.addColorStop(1, '#9a8a68'); c.fillStyle = g2; c.fill(); c.restore();
    glow(c, 245, 610, 260 + 200 * dy, '#FFF8E0', .3 + .4 * dy);
    beam(c, 245, 620, 190, 1300, 320, 1300, '#FFF8E0', .07 + .12 * dy, 24);
  }
  function scene3(c, t) {
    camSafe(c, lerp(1.1, 1.0, prog(t, T.s3, T.s4, 'inOutSine')), lerp(600, 540, prog(t, T.s3, T.s4, 'inOutSine')), 1040);
    drawCave(c, t, { day: prog(t, T.jamais - .2, T.autre + .6, 'inOutSine'), turn: prog(t, T.autre, T.autre + .6, 'inOutSine') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#060403', .55, 820);
    vignette(c, .55, '#030201');
  }

  /* =====================================================================
     DÉCOR 4 — DEUX LUMIÈRES : un cercle sur un mur, un rectangle sur l'autre
     ===================================================================== */
  function drawTwoLights(c, t, st) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#0b0c10'); g.addColorStop(1, '#16181e'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const back = [[90, 560], [800, 560], [800, 1460], [90, 1460]], side = [[800, 560], [1180, 380], [1180, 1700], [800, 1460]];
    quad(c, back); c.fillStyle = mix('#1c1e26', '#4a3a28', st.l1 * .6); c.fill();
    quad(c, side); c.fillStyle = mix('#14161c', '#2a3446', st.l2 * .7); c.fill();
    g = c.createLinearGradient(0, 1460, 0, H + LM); g.addColorStop(0, '#202228'); g.addColorStop(1, '#08090c'); c.fillStyle = g; c.beginPath(); c.moveTo(-LM, H + LM); c.lineTo(90, 1460); c.lineTo(800, 1460); c.lineTo(1180, 1700); c.lineTo(W + LM, H + LM); c.fill();
    // les deux ombres du même objet
    if (st.l1 > 0) { c.save(); quad(c, back); c.clip(); glow(c, 430, 960, 520, '#FFD9A0', .4 * st.l1); c.fillStyle = rgba('#0a0806', .85 * st.l1); c.beginPath(); c.arc(430, 920, 120, 0, 6.283); c.fill(); c.restore(); }
    if (st.l2 > 0) { c.save(); quad(c, side); c.clip(); glow(c, 990, 1000, 420, '#BFD8FF', .4 * st.l2); c.fillStyle = rgba('#05070a', .85 * st.l2); quad(c, [[920, 820], [1060, 755], [1060, 1110], [920, 1160]]); c.fill(); c.restore(); }
    // le socle et le cylindre
    c.fillStyle = '#0c0d10'; c.fillRect(470, 1420, 140, 280);
    const cx = 540, top = 1220, bot = 1410, rw = 70;
    g = c.createLinearGradient(cx - rw, 0, cx + rw, 0); g.addColorStop(0, mix('#3a3a40', '#E9C890', st.l1 * .8)); g.addColorStop(.6, '#2a2a30'); g.addColorStop(1, mix('#1a1a20', '#A9C8F0', st.l2 * .8));
    c.fillStyle = g; c.fillRect(cx - rw, top, rw * 2, bot - top); c.beginPath(); c.ellipse(cx, bot, rw, 18, 0, 0, Math.PI); c.fill();
    c.fillStyle = mix('#4a4a52', '#F2E6CC', .3 + .4 * Math.max(st.l1, st.l2)); c.beginPath(); c.ellipse(cx, top, rw, 18, 0, 0, 6.283); c.fill();
    // la première lampe, et le premier qui parle
    glow(c, 150, 1180, 320, '#FFD9A0', .6 * st.l1); c.fillStyle = rgba('#FFE7B8', .9 * st.l1); c.beginPath(); c.arc(150, 1180, 12, 0, 6.283); c.fill();
    beam(c, 150, 1180, 300, 760, 520, 1100, '#FFD9A0', .14 * st.l1, 20);
    person(c, { x: 230, y: 1760, s: 1.8, f: 1, phone: 0, hand: st.speak > 0 ? [320, 1520 - 40 * Math.sin(t * 4) * st.speak] : null }, '#FFD9A0', 3);
    // le second arrive avec sa lanterne et examine
    const ent = st.enter || 0;
    if (ent > 0) { const x = lerp(1200, 850, ent), hand = [x - 70, 1500];
      person(c, { x, y: 1760, s: 1.8, f: -1, walk: ent < 1 ? t * 6 : null, phone: 0, hand }, '#BFD8FF', -3, coatPath);
      glow(c, hand[0], hand[1] - 20, 260, '#BFD8FF', .6 * ent); c.fillStyle = rgba('#EAF3FF', .9 * ent); c.fillRect(hand[0] - 10, hand[1] - 34, 20, 26);
      beam(c, hand[0], hand[1] - 20, 880, 720, 1100, 1250, '#BFD8FF', .12 * ent, 20); }
    // marques : ✓ puis ?
    const ok = st.ok || 0, qm = st.qm || 0;
    if (ok > 0) { c.save(); c.strokeStyle = rgba('#FFE2A8', ok * (1 - .6 * qm)); c.lineWidth = 7; c.lineCap = 'round'; strokeProg(c, [[380, 920], [420, 960], [490, 870]], ok); c.restore(); }
    if (qm > 0) { c.save(); c.globalAlpha = qm; c.font = '900 120px Bodoni'; c.fillStyle = '#E8949A'; c.textAlign = 'center'; c.fillText('?', 430 + 110, 900); c.restore(); }
  }
  function scene4(c, t) {
    camSafe(c, lerp(1.08, 1.0, prog(t, T.s4, T.s5, 'inOutSine')), 540, 1040);
    drawTwoLights(c, t, { l1: prog(t, T.s4 + .2, T.premiere, 'inOutSine'), speak: prog(t, T.premiere - .2, T.premiere + .3, 'linear') * (1 - prog(t, T.personne, T.personne + .4, 'linear')),
      ok: prog(t, T.juste - .15, T.juste + .45, 'outCubic'), enter: prog(t, T.personne - .4, T.examiner + .2, 'inOutCubic'), l2: prog(t, T.personne, T.examiner + .3, 'inOutSine'), qm: prog(t, T.examiner - .1, T.examiner + .4, 'outCubic') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#07080b', .6, 560);
    vignette(c, .5, '#030304');
  }

  /* =====================================================================
     DÉCOR 5 — LE CORRIDOR À ARCS : la lanterne n'éclaire que ce qu'on connaît
     ===================================================================== */
  const tile = (() => { const o = off(256, 256), x = o.getContext('2d'); x.fillStyle = '#D9C9AA'; x.fillRect(0, 0, 256, 256);
    for (const [cx, cy] of [[0, 0], [256, 0], [0, 256], [256, 256], [128, 128]]) { x.fillStyle = '#1f4f5a'; star8(x, cx, cy, 64, 34); x.fill(); x.fillStyle = '#D9C9AA'; star8(x, cx, cy, 40, 22); x.fill(); x.fillStyle = '#9a4a30'; star8(x, cx, cy, 20, 11); x.fill(); }
    x.strokeStyle = '#1f4f5a'; x.lineWidth = 5; for (const [cx, cy] of [[128, 0], [0, 128], [256, 128], [128, 256]]) { khatam(x, cx, cy, 46); x.stroke(); } return o; })();
  const HZ5 = 860;
  function drawCorridorStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#120c0a'); g.addColorStop(1, '#0a0706'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const pat = c.createPattern(tile, 'repeat');
    for (let y = HZ5 + 40; y < H + LM; y += 2) { const a = (y - HZ5) / 420, v = 140000 / (y - HZ5); pat.setTransform(new DOMMatrix([a, 0, 0, a, 540, y - a * v])); c.fillStyle = pat; c.fillRect(-LM, y, W + 2 * LM, 2.5); }
    for (let k = 8; k >= 0; k--) { const z = 1 + k * .55, w = 760 / z, h = 1300 / z, base = HZ5 + 980 / z, fog = Math.min(.92, k / 8.5);
      c.save(); c.beginPath(); c.rect(-LM, -LM, W + 2 * LM, H + 2 * LM); archPath(c, 540, base, w, h, true); c.clip('evenodd');
      c.fillStyle = mix('#7a5a3e', '#0e0a08', fog); c.fillRect(540 - w / 2 - 260 / z, base - h - 200 / z, w + 520 / z, h + 200 / z); // piliers et voûtains
      lattice(c, 540 - w / 2 - 230 / z, base - h * .55, 200 / z, h * .5, 40 / z, mix('#E9C990', '#1a120c', fog), 1.2, .6); lattice(c, 540 + w / 2 + 30 / z, base - h * .55, 200 / z, h * .5, 40 / z, mix('#E9C990', '#1a120c', fog), 1.2, .6);
      c.restore(); c.save(); archPath(c, 540, base, w, h, true); c.strokeStyle = mix('#C9A070', '#120c0a', fog); c.lineWidth = 12 / z; c.stroke(); c.restore(); }
  }
  const CORR = prerender(drawCorridorStatic, 1.2);
  function drawCorridor(c, t, st) {
    blit(c, CORR);
    // la lanterne éclaire autour du marcheur ; au-delà, l'obscurité (ce qu'on ne connaît pas)
    const wx = 540, wy = lerp(1820, 1560, st.walk), s = lerp(1.9, 1.45, st.walk), lx = wx + 50 * s, ly = wy - 120 * s, R = 330;
    const g = c.createRadialGradient(lx, ly + 140, R * .25, lx, ly + 140, R * 1.6); g.addColorStop(0, 'rgba(6,4,3,0)'); g.addColorStop(.55, 'rgba(6,4,3,.55)'); g.addColorStop(1, 'rgba(6,4,3,.96)');
    c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, lx, ly, 380, '#FFD08A', .55); c.fillStyle = 'rgba(255,224,170,.95)'; c.fillRect(lx - 9, ly - 14, 18, 26);
    person(c, { x: wx, y: wy, s, f: 1, walk: st.walk > 0 && st.walk < 1 && !st.stop ? t * 5.2 : null, phone: 0, hand: [lx - 6, ly + 14] }, '#FFD08A', 3);
    if (st.stop > 0) { c.save(); c.globalAlpha = st.stop; c.strokeStyle = '#E8949A'; c.lineWidth = 4; c.setLineDash([16, 12]); c.beginPath(); c.moveTo(lx - 260, ly - 170); c.lineTo(lx + 200, ly - 170); c.stroke(); c.restore(); }
  }
  function scene5(c, t) {
    camSafe(c, lerp(1.06, 1.0, prog(t, T.s5, T.s6, 'inOutSine')), 540, 1000);
    const walk = prog(t, T.s5, T.connaissance, 'inOutSine');
    drawCorridor(c, t, { walk, stop: prog(t, T.connaissance - .2, T.connaissance + .4, 'outCubic') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#060403', .6, 800);
    vignette(c, .55, '#030201');
  }

  /* =====================================================================
     DÉCOR 6 — LE FILTRE : seules entrent les informations qui confortent
     ===================================================================== */
  const PARTS = (() => { const r = rng(61); return Array.from({ length: 70 }, () => ({ y: 820 + r() * 560, sp: .16 + r() * .18, ph: r(), col: r() < .5 ? 1 : 0, s: 5 + r() * 5 })); })();
  const BRAIN = (() => { const r = rng(3); return Array.from({ length: 60 }, () => { const a = r() * 6.283, d = Math.sqrt(r()); return [800 + Math.cos(a) * d * 110, 960 + Math.sin(a) * d * 90]; }); })();
  function headProfile(c) { c.beginPath(); c.moveTo(700, 1360); c.bezierCurveTo(690, 1280, 640, 1250, 650, 1180); c.lineTo(630, 1150); c.lineTo(648, 1130); c.bezierCurveTo(640, 1100, 655, 1080, 650, 1060); c.bezierCurveTo(630, 1040, 640, 1000, 660, 990); c.bezierCurveTo(660, 860, 760, 800, 840, 810); c.bezierCurveTo(960, 820, 1000, 920, 990, 1020); c.bezierCurveTo(985, 1120, 940, 1180, 930, 1260); c.lineTo(940, 1360); }
  function drawBias(c, t, st) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#060b14'); g.addColorStop(1, '#0c1626'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(95,201,192,.06)'; c.lineWidth = 1; for (let x = 0; x < W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    // la tête et les croyances qui grossissent
    c.save(); c.strokeStyle = 'rgba(220,235,255,.75)'; c.lineWidth = 3; c.shadowColor = '#A9C8F0'; c.shadowBlur = 14; headProfile(c); c.stroke(); c.restore();
    const grow = st.grow || 0; BRAIN.forEach(([x, y], i) => { const a = clamp(.3 + grow * 1.2 - i / 80); if (a > 0) { c.fillStyle = rgba('#E8949A', .85 * a); c.beginPath(); c.arc(x, y, 4 + 2 * a, 0, 6.283); c.fill(); } });
    glow(c, 800, 960, 160 + 80 * grow, '#E8949A', .2 + .3 * grow);
    // le filtre devant le regard
    const gx = 560, fo = st.filter || 0;
    if (fo > 0) { c.save(); c.globalAlpha = fo; c.strokeStyle = '#E8949A'; c.lineWidth = 4; c.beginPath(); c.moveTo(gx, 820); c.lineTo(gx + 60, 1040); c.lineTo(gx + 60, 1120); c.lineTo(gx, 1380); c.stroke(); c.restore(); }
    // le flux d'informations
    for (const p of PARTS) { const u = ((t * p.sp + p.ph) % 1), x = lerp(-40, 760, u); let y = p.y, a = 1;
      if (fo > .5 && x > gx) { if (p.col) { y = lerp(p.y, 960 + (p.y - 1100) * .3, clamp((x - gx) / 200)); a = 1 - clamp((x - 700) / 60); } else { const k = clamp((x - gx) / 200); y = p.y + (p.y < 1100 ? -1 : 1) * k * 380; a = 1 - k; } }
      if (a <= .02) continue; c.fillStyle = rgba(p.col ? '#E8949A' : C.teal, a * .9); c.beginPath(); c.arc(x, y, p.s, 0, 6.283); c.fill(); }
  }
  function scene6(c, t) {
    camSafe(c, lerp(1.06, 1.0, prog(t, T.s6, T.s7, 'inOutSine')), 540, 1040);
    drawBias(c, t, { filter: prog(t, T.biais - .1, T.biais + .6, 'outCubic'), grow: prog(t, T.confortent - .3, T.croyances + .8, 'inOutSine') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#060b14', .55, 560);
    vignette(c, .5, '#02040a');
  }

  /* =====================================================================
     DÉCOR 7 — DÉFENDRE (la forteresse) ≠ RECHERCHER (le chemin)
     ===================================================================== */
  function drawSplit(c, t, st) {
    const sp = st.split || 0;
    // à gauche : la forteresse
    c.save(); c.beginPath(); c.rect(-LM, -LM, 540 + LM, H + 2 * LM); c.clip();
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0a0c'); g.addColorStop(1, '#3a1418'); c.fillStyle = g; c.fillRect(-LM, -LM, 540 + LM, H + 2 * LM);
    c.fillStyle = '#0c0506'; c.fillRect(150, 900, 240, 800); for (let x = 150; x < 390; x += 48) c.fillRect(x, 860, 30, 44); // tour
    c.fillStyle = '#5a1a20'; c.beginPath(); c.moveTo(270, 1060); c.lineTo(350, 1090); c.lineTo(340, 1220); c.quadraticCurveTo(300, 1290, 270, 1300); c.quadraticCurveTo(240, 1290, 200, 1220); c.lineTo(190, 1090); c.closePath(); c.fill(); // bouclier
    c.strokeStyle = '#E8949A'; c.lineWidth = 3; c.stroke();
    for (let k = 0; k < 6; k++) { const ph = ((t * .6 + k * .17) % 1), x = lerp(540, 380, ph), y = 1000 + k * 60; c.strokeStyle = rgba('#F6C9C6', (1 - ph) * .8); c.lineWidth = 3; c.beginPath(); c.moveTo(x + 40, y); c.lineTo(x, y); c.stroke(); c.font = '600 26px Fraunces'; c.fillStyle = rgba('#F6C9C6', (1 - ph) * .8); c.fillText('?', x + 46, y + 9); } // les questions rebondissent
    c.restore();
    // à droite : le chemin vers l'horizon, la lanterne
    c.save(); c.beginPath(); c.rect(540, -LM, 540 + LM, H + 2 * LM); c.clip();
    g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a3a5a'); g.addColorStop(.55, '#C9B8A8'); g.addColorStop(.62, '#E9D2B0'); g.addColorStop(1, '#2a2620'); c.fillStyle = g; c.fillRect(540, -LM, 540 + LM, H + 2 * LM);
    glow(c, 810, 1050, 400, '#FFF2D8', .6);
    c.fillStyle = '#3a3026'; c.beginPath(); c.moveTo(800, 1060); c.lineTo(830, 1060); c.lineTo(1040, H); c.lineTo(600, H); c.fill(); // le chemin
    c.save(); c.globalAlpha = .7; c.strokeStyle = '#F2EFE8'; c.lineWidth = 2; star8(c, 860, 760, 70, 30); c.stroke(); c.beginPath(); c.arc(860, 760, 84, 0, 6.283); c.stroke(); c.restore(); // la rose des vents
    const wk = st.walk || 0; person(c, { x: lerp(780, 830, wk), y: lerp(1640, 1420, wk), s: lerp(1.4, 1.0, wk), f: 1, walk: t * 5, phone: 0, hand: [lerp(830, 860, wk), lerp(1460, 1300, wk)] }, '#FFF2D8', -3);
    c.restore();
    // la ligne de partage
    c.save(); c.strokeStyle = '#F2EFE8'; c.lineWidth = 3; c.shadowColor = '#FFFFFF'; c.shadowBlur = 16; strokeProg(c, [[540, -LM], [540, H + LM]], sp); c.restore();
  }
  function scene7(c, t) {
    camSafe(c, 1.0 + .03 * prog(t, T.s7, T.s8, 'inOutSine'), 540, 960);
    drawSplit(c, t, { split: prog(t, T.distinction - .2, T.distinction + .5, 'inOutCubic'), walk: prog(t, T.rechercher, T.s8 + .5, 'inOutSine') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#08060a', .55, 560);
    vignette(c, .5);
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
    { at: T.s2, d: 1.1, kind: 'drift', a: scene1, b: scene2 },
    { at: T.s3, d: 1.1, kind: 'tilt', a: scene2, b: scene3, o: { dir: 1 } },
    { at: T.s4, d: 1.0, kind: 'dissolve', a: scene3, b: scene4 },
    { at: T.s5, d: 1.0, kind: 'drift', a: scene4, b: scene5 },
    { at: T.s6, d: 1.0, kind: 'dissolve', a: scene5, b: scene6 },
    { at: T.s7, d: 1.0, kind: 'dissolve', a: scene6, b: scene7 },
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
  function texts(t) {
    (function () { const p = prog(t, .2, 1.3, 'outCubic'), o = 1 - prog(t, T.raison1 - .4, T.raison1 + .1, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    const q1 = T.piege - .35;
    wipe(tQa, t, .5, q1, .8, .3); slam(tQb, t, T.verite1 - .05, q1, .3); fade(tQc, t, T.raison1 - .35, q1, .5, 14, .3);
    fade(tPiege, t, T.piege - .1, T.s2 - .2, .5, 10, .3); slam(tConv, t, T.convaincu - .05, T.s2 - .2, .3); fade(tPlus, t, T.plus - .1, T.s2 - .2, .5, 12, .3);
    fade(tExp, t, T.experience - .2, T.s3 - .35, .5, 10, .3); slam(tMeme, t, T.meme - .05, T.s3 - .35, .3); fade(tRet1, t, T.retient - .1, T.s3 - .35, .5, 12, .3); fade(tRet2, t, T.confirment - .05, T.s3 - .35, .5, 12, .3);
    fade(tPla, t, T.platon - .1, T.s4 - .35, .6, 12, .3); fade(tPlaSub, t, T.platon + .3, T.s4 - .35, .6, 8, .3); wipe(tCav, t, T.caverne - .2, T.s4 - .35, .7, .3);
    fade(tOmb, t, T.ombres - .1, T.s4 - .35, .5, 12, .3); slam(tReal, t, T.realite - .05, T.s4 - .35, .3);
    [tPla, tPlaSub, tCav].forEach(n => { n.style.opacity = (parseFloat(n.style.opacity) * (1 - .7 * prog(t, T.ombres - .2, T.ombres + .2, 'linear'))).toFixed(3); });
    fade(tPr, t, T.proverbes - .1, T.s5 - .35, .6, 10, .3); fade(tPrQ1, t, T.premiere - .2, T.s5 - .35, .6, 12, .3); fade(tPrQ2, t, T.personne - .2, T.s5 - .35, .7, 14, .3); fade(tLSG, t, T.personne + .3, T.s5 - .35, .6, 6, .3);
    fade(tV1, t, T.premiere, T.s5 - .35, .5, 8, .3); fade(tV2, t, T.examiner - .1, T.s5 - .35, .5, 8, .3);
    const sDim = 1 - .7 * prog(t, T.garde - .2, T.garde + .3, 'linear');
    fade(tSour, t, T.coran - .1, T.s6 - .35, .6, 10, .3); fade(tAr, t, T.coran + .15, T.s6 - .35, .8, 10, .3); fade(tVers, t, T.sourate + .2, T.s6 - .35, .6, 10, .3);
    [tSour, tAr, tVers].forEach(n => { n.style.opacity = (parseFloat(n.style.opacity) * sDim).toFixed(3); });
    slam(tSuiv, t, T.suivre - .1, T.s6 - .35, .3); fade(tConn, t, T.connaissance - .4, T.s6 - .35, .6, 12, .3);
    fade(tPsy, t, T.psychologie - .1, T.s7 - .35, .5, 10, .3); slam(tBia, t, T.biais - .05, T.s7 - .35, .3); fade(tBia2, t, T.informations - .2, T.s7 - .35, .6, 12, .3); fade(tNick, t, T.informations + .3, T.s7 - .35, .6, 6, .3);
    fade(tDist, t, T.distinction - .3, T.s8 - .35, .5, 10, .3); wipe(tDef, t, T.defendre - .05, T.s8 - .35, .6, .3); fade(tDef2, t, T.defendre + .25, T.s8 - .35, .5, 10, .3);
    fade(tNeq, t, T.defendre + .5, T.s8 - .35, .5, 0, .3); wipe(tRec, t, T.rechercher - .05, T.s8 - .35, .6, .3); fade(tRec2, t, T.verite7 - .2, T.s8 - .35, .5, 10, .3);
    const W_ = T.qWords, outQ = 1 - prog(t, T.title - .25, T.title + .15, 'inCubic');
    tQ.forEach(n => { n.style.opacity = outQ > 0 && t > T.q - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const w = W_[+s.dataset.i] || W_[W_.length - 1], p = prog(t, w.start - .04, w.start + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * outQ, blur: (1 - p) * 6 }); }); });
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores (la musique de fond est continue) ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7], ['s8', T.s8]].forEach(([n, x]) => sfx('sec_' + n, x));
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('glow', T.convaincu); sfx('chime', T.meme); sfx('fire', T.s3 - .5, { d: T.s4 - T.s3 + .8 }); sfx('glow', T.juste); sfx('chime', T.examiner); sfx('glow', T.suivre); sfx('chime', T.biais);
  sfx('crack', T.accepte); sfx('shatter', T.certitudes + .1);
  sfx('question', T.q); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : la cloche de verre, la question
    render(T.raison1 + .3);
    set(tSeries, { o: 1, blur: 0, s: 1, y: -10 }); [tQa, tQb, tQc].forEach(n => { n.style.clipPath = 'none'; set(n, { o: 1, blur: 0, s: 1 }); }); SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
