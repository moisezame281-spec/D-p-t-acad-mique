/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 004 — « Le bien a-t-il besoin de Dieu ? »
   Format de série (voir series/enigme-humaine/FORMAT.md). Minutage piloté par timeline.json.
   Nouveautés : TRANSITIONS DE MISE EN SCÈNE entre chaque passage de la voix
   (plongée sous le trottoir, traversée de lumière, panoramique filé, étoile → boussole,
   page qui tourne, remontée vers la rue). Décors nouveaux : la rue sous la pluie,
   l'arbre en coupe (l'acte et ses racines), la nef, la forêt d'arcs bicolores,
   le cabinet de Kant (portrait de J. G. Becker, 1768, domaine public), les deux lumières.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, makeDust, dust, personPath, lattice, archPath, star8, khatam, rng, off } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', bord: '#541D2A', night: '#19283C', rose: '#E8949A', lamp: '#F2C27D', sodium: '#F2A65A', cold: '#9FC0FF' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', 'italic 700 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument', '500 40px Garamond'].map(f => document.fonts.load(f, 'Aaé')));
  await document.fonts.load('400 40px Amiri', 'المائدة');
  const IMG = new Image(); IMG.src = 'assets/kant.jpg'; await IMG.decode();

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    personne: cue('s1a', 'personne'), croitA: cue('s1a', 'croit'), dieuA: cue('s1a', 'dieu'), peut: cue('s1a', 'peut'), bien: cue('s1a', 'bien'), qEnd1: SEN('s1a').end,
    s1b: SEN('s1b').start, passants: cue('s1b', 'passants'), inconnu: cue('s1b', 'inconnu'), danger: cue('s1b', 'danger'),
    un: cue('s1c', 'croit'), autre: cue('s1c', 'autre'), non: cue('s1c', 'non'),
    tous: cue('s1d', 'tous'), arretent: cue('s1d', 'arretent'), aider: cue('s1d', 'aider'),
    geste: cue('s1e', 'geste'), moins: cue('s1e', 'moins'), moral: cue('s1e', 'moral'), chez: cue('s1e', 'chez'), autre2: cue('s1e', 'autre'), qEnd2: SEN('s1e').end,
    s2: SEN('s2a').start - .3, distinguons: cue('s2a', 'distinguons'), choses: cue('s2a', 'choses'),
    accomplir: cue('s2b', 'accomplir'), acte: cue('s2b', 'acte'), expliquer: cue('s2b', 'expliquer'), pourquoi: cue('s2b', 'pourquoi'), juste2: cue('s2b', 'juste', 1),
    s3: SEN('s3a').start - .25, matthieu: cue('s3a', 'matthieu'), jesus: cue('s3b', 'jesus'), traiter: cue('s3b', 'traiter'), autres: cue('s3b', 'autres'), comme: cue('s3b', 'comme'), traite: cue('s3b', 'traite'),
    s4: SEN('s4a').start - .25, coran: cue('s4a', 'coran'), sourate: cue('s4a', 'sourate'), appelle: cue('s4b', 'appelle'), juste4: cue('s4b', 'juste'), meme: cue('s4b', 'meme'), deteste: cue('s4b', 'deteste'),
    s5: SEN('s5a').start - .25, kant: cue('s5a', 'kante'), idee: cue('s5a', 'idee'), raison5: cue('s5a', 'raison'), devoir: cue('s5a', 'devoir'), impose: cue('s5a', 'impose'), contre: cue('s5a', 'contre'), interets: cue('s5a', 'interets'),
    s6: SEN('s6a').start - .3, nuance: cue('s6a', 'nuance'), foi6: cue('s6b', 'foi'), condition: cue('s6b', 'condition'), necessaire: cue('s6b', 'necessaire'), acte6: cue('s6b', 'acte'),
    tranche: cue('s6c', 'tranche'), fondement: cue('s6c', 'fondement'), ultime: cue('s6c', 'ultime'),
    q: SEN('s7a').start, dieu7: cue('s7a', 'dieu'), raison7: cue('s7a', 'raison'), valeur: cue('s7a', 'valeur'), qEnd: SEN('s7a').end,
    s7b: SEN('s7b').start, debat: cue('s7b', 'debat'), end7: SEN('s7b').end,
  };
  T.title = T.end7 + .5; T.qWords = SEN('s7a').words; T.rise = T.s7b - .55;

  /* ---------- texte (DOM) ---------- */
  const tx = (html, cls, style) => el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
  function fit(n, maxW) { const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block'; let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; } n.style.width = w; n.style.display = d; return n; }
  function slam(n, t, t0, t1, out = .3) { const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 }); }
  function wipe(n, t, t0, t1, dur = .7, out = .45) { const p = prog(t, t0, t0 + dur, 'outQuart'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); n.style.clipPath = `inset(-20% ${(100 - p * 100).toFixed(2)}% -20% 0)`; set(n, { x: (1 - p) * 18, o: o * (p > 0 ? 1 : 0) }); }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) { const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 }); }
  const grad = (a, b, c) => `background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(0,0,0,.6))`;
  const gspan = (txt, a, b, c, pad = '6px .08em 4px') => `<span style="display:inline-block;padding:${pad};${grad(a, b, c)}">${txt}</span>`;
  const CENTER = { left: '0', width: '1080px', textAlign: 'center' };
  const ROSE = ['#FFF4F2', '#F6C9C6', '#E8949A'], GOLD = ['#FFFFFF', '#F3E6CC', C.gold];

  // ouverture (identité de série)
  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;004</div>`, '', Object.assign({ top: '150px', textShadow: 'none' }, CENTER));
  // S1 — la question, la rue
  const tQa = tx('UNE PERSONNE QUI NE CROIT PAS EN DIEU', 'fraunces', Object.assign({ top: '420px', fontWeight: 600, fontSize: '31px', letterSpacing: '.16em', paddingLeft: '.16em' }, CENTER)); fit(tQa, 1000);
  const tQb = tx('peut-elle', 'instrument', Object.assign({ top: '476px', fontStyle: 'italic', fontSize: '100px' }, CENTER));
  const tQc = fit(tx(gspan('FAIRE LE BIEN&#8239;?', ...ROSE, '14px .06em 4px'), 'bodoni', Object.assign({ top: '580px', fontWeight: 900, fontSize: '128px', textShadow: 'none' }, CENTER)), 1000);
  const tLabA = tx('CROIT EN DIEU', 'fraunces', { left: '0', width: '760px', textAlign: 'center', top: '0px', fontWeight: 600, fontSize: '26px', letterSpacing: '.2em', color: C.lamp });
  const tLabB = tx('NE CROIT PAS', 'fraunces', { left: '320px', width: '760px', textAlign: 'center', top: '0px', fontWeight: 600, fontSize: '26px', letterSpacing: '.2em', color: '#BFD3F2' });
  const tM1 = tx('Leur geste est-il', 'instrument', Object.assign({ top: '300px', fontStyle: 'italic', fontSize: '76px' }, CENTER));
  const tM2 = fit(tx(gspan('MOINS MORAL&#8239;?', ...ROSE, '12px .06em 4px'), 'bodoni', Object.assign({ top: '392px', fontWeight: 900, fontSize: '124px', textShadow: 'none' }, CENTER)), 1000);
  const tM3 = tx('chez l’un que chez l’autre', 'instrument', Object.assign({ top: '548px', fontStyle: 'italic', fontSize: '62px', color: 'rgba(242,239,232,.85)' }, CENTER));
  // S2 — l'arbre : l'acte et ses racines
  const tDeux = tx('DEUX CHOSES', 'fraunces', Object.assign({ top: '196px', fontWeight: 600, fontSize: '32px', letterSpacing: '.3em', paddingLeft: '.3em', color: '#5a2a24' }, CENTER));
  const tAc1 = tx('ACCOMPLIR', 'bodoni', { left: '70px', top: '270px', fontWeight: 900, fontSize: '70px', color: '#2a1810', textShadow: '0 0 24px rgba(255,248,236,.85)' });
  const tAc2 = tx('un acte juste', 'instrument', { left: '74px', top: '352px', fontStyle: 'italic', fontSize: '62px', color: '#8E2F3A', textShadow: '0 0 18px rgba(255,248,236,.9)' });
  const tEx1 = tx('EXPLIQUER', 'bodoni', { left: '70px', top: '1460px', fontWeight: 900, fontSize: '70px' });
  const tEx2 = tx('pourquoi il faut être juste', 'instrument', { left: '74px', top: '1542px', fontStyle: 'italic', fontSize: '60px', color: C.rose });
  // S3 — Matthieu 7:12
  const tMt = tx('MATTHIEU 7 : 12', 'fraunces', Object.assign({ top: '176px', fontWeight: 600, fontSize: '34px', letterSpacing: '.18em', paddingLeft: '.18em' }, CENTER));
  const tMtQ1 = tx('«&#8239;Tout ce que vous voulez que les hommes', 'instrument', Object.assign({ top: '244px', fontStyle: 'italic', fontSize: '54px' }, CENTER)); fit(tMtQ1, 1000);
  const tMtQ2 = tx('fassent pour vous,', 'instrument', Object.assign({ top: '308px', fontStyle: 'italic', fontSize: '54px' }, CENTER));
  const tMtQ3 = tx(gspan('faites-le de même pour eux&#8239;»', ...GOLD, '4px .1em 6px'), 'instrument', Object.assign({ top: '376px', fontStyle: 'italic', fontSize: '76px', textShadow: 'none' }, CENTER)); fit(tMtQ3, 1000);
  const tLSG = tx('trad. Louis Segond, 1910', 'fraunces', Object.assign({ top: '480px', fontWeight: 500, fontSize: '23px', letterSpacing: '.08em', color: 'rgba(242,239,232,.75)' }, CENTER));
  // S4 — Coran 5:8
  const tSour = tx('SOURATE AL-MÂ’IDA', 'fraunces', Object.assign({ top: '168px', fontWeight: 600, fontSize: '36px', letterSpacing: '.22em', paddingLeft: '.22em' }, CENTER));
  const tAr = tx('المائدة', 'amiri', Object.assign({ top: '206px', fontSize: '116px', color: '#F3D9A0', direction: 'rtl' }, CENTER));
  const tVers = tx('5 : 8', 'fraunces', Object.assign({ top: '398px', fontWeight: 600, fontSize: '36px', letterSpacing: '.2em', paddingLeft: '.2em', color: C.rose }, CENTER));
  const tJu = fit(tx(gspan('RESTER JUSTE', ...GOLD, '10px .06em 4px'), 'bodoni', Object.assign({ top: '470px', fontWeight: 900, fontSize: '112px', textShadow: 'none' }, CENTER)), 1000);
  const tJu2 = tx('même envers ceux que l’on déteste', 'instrument', Object.assign({ top: '612px', fontStyle: 'italic', fontSize: '62px', color: C.rose }, CENTER)); fit(tJu2, 1000);
  // S5 — Kant
  const tKant = tx(gspan('EMMANUEL KANT', ...GOLD, '8px .06em 4px'), 'bodoni', Object.assign({ top: '160px', fontWeight: 900, fontSize: '84px', textShadow: 'none' }, CENTER)); fit(tKant, 1000);
  const tKantSub = tx('1724 – 1804 · Königsberg', 'fraunces', Object.assign({ top: '268px', fontWeight: 500, fontSize: '30px', letterSpacing: '.08em', color: 'rgba(242,239,232,.86)' }, CENTER));
  const tCred = tx('Johann Gottlieb Becker, <i>Immanuel Kant</i>, 1768 · Schiller-Nationalmuseum, Marbach · domaine public', 'fraunces', Object.assign({ top: '1082px', fontWeight: 500, fontSize: '18px', color: 'rgba(242,239,232,.6)' }, CENTER));
  const tGrund = tx('<i>Grundlegung zur Metaphysik der Sitten</i>, 1785', 'fraunces', Object.assign({ top: '196px', fontWeight: 600, fontSize: '30px', color: C.lamp }, CENTER)); fit(tGrund, 1000);
  const tFond = tx('Fondements de la métaphysique des mœurs', 'fraunces', Object.assign({ top: '244px', fontWeight: 500, fontSize: '28px', color: 'rgba(242,239,232,.8)' }, CENTER));
  const tImp = fit(tx(gspan('L’IMPÉRATIF CATÉGORIQUE', ...GOLD, '10px .06em 4px'), 'bodoni', Object.assign({ top: '320px', fontWeight: 900, fontSize: '84px', textShadow: 'none' }, CENTER)), 1000);
  const tDev = tx('un devoir qui s’impose', 'instrument', Object.assign({ top: '430px', fontStyle: 'italic', fontSize: '70px' }, CENTER));
  const tInt = tx('même contre nos intérêts', 'instrument', Object.assign({ top: '520px', fontStyle: 'italic', fontSize: '66px', color: C.rose }, CENTER));
  // S6 — la nuance
  const tNu = tx('UNE NUANCE', 'fraunces', Object.assign({ top: '196px', fontWeight: 600, fontSize: '32px', letterSpacing: '.3em', paddingLeft: '.3em', color: C.rose }, CENTER));
  const tN1 = tx('La foi n’est pas', 'instrument', Object.assign({ top: '262px', fontStyle: 'italic', fontSize: '74px' }, CENTER));
  const tN2 = fit(tx(gspan('UNE CONDITION NÉCESSAIRE', ...GOLD, '10px .06em 4px'), 'bodoni', Object.assign({ top: '352px', fontWeight: 900, fontSize: '82px', textShadow: 'none' }, CENTER)), 1000);
  const tN3 = tx('pour accomplir un acte juste', 'instrument', Object.assign({ top: '462px', fontStyle: 'italic', fontSize: '60px', color: 'rgba(242,239,232,.88)' }, CENTER));
  const tFu1 = tx('Mais cela ne tranche pas', 'instrument', Object.assign({ top: '300px', fontStyle: 'italic', fontSize: '70px' }, CENTER));
  const tFu2 = fit(tx(gspan('SON FONDEMENT ULTIME', ...ROSE, '10px .06em 4px'), 'bodoni', Object.assign({ top: '390px', fontWeight: 900, fontSize: '92px', textShadow: 'none' }, CENTER)), 1000);
  // S7 — les deux lumières, la question, le débat
  const tLD = tx('DIEU&#8239;?', 'fraunces', { left: '120px', width: '360px', textAlign: 'center', top: '1478px', fontWeight: 600, fontSize: '34px', letterSpacing: '.24em', color: '#FFD98A' });
  const tLR = tx('LA RAISON&#8239;?', 'fraunces', { left: '600px', width: '360px', textAlign: 'center', top: '1478px', fontWeight: 600, fontSize: '34px', letterSpacing: '.24em', color: '#CFE0FF' });
  const QL = [[[['Le', 0], ['bien', 1], ['vient-il', 2], ['de', 4], ['Dieu,', 5]], 80, 300, C.ivory],
    [[['ou', 6], ['la', 7], ['raison', 8], ['humaine', 9]], 80, 400, C.ivory],
    [[['peut-elle', 10], ['en', 12], ['reconnaître', 13]], 74, 500, C.ivory],
    [[['la', 14], ['valeur', 15], ['par', 16], ['elle-même&#8239;?', 17]], 86, 594, C.rose]];
  const tQ = QL.map(([ws, fs, y, col]) => tx(ws.map(([w, i]) => `<span class="qw" data-i="${i}" style="display:inline-block;margin:0 .12em">${w}</span>`).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)));
  const tQ6 = (() => { const n = tQ[0].querySelectorAll('.qw')[4]; n.style.color = '#FFD98A'; const r = tQ[1].querySelectorAll('.qw'); r[2].style.color = '#CFE0FF'; r[3].style.color = '#CFE0FF'; return n; })();
  const tDb1 = tx('C’est là que commence', 'instrument', Object.assign({ top: '330px', fontStyle: 'italic', fontSize: '76px' }, CENTER));
  const tDb2 = fit(tx(gspan('LE VÉRITABLE DÉBAT.', ...ROSE, '12px .06em 4px'), 'bodoni', Object.assign({ top: '420px', fontWeight: 900, fontSize: '100px', textShadow: 'none' }, CENTER)), 1000);
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', Object.assign({ top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }, CENTER));
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', Object.assign({ top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose }, CENTER));
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', Object.assign({ top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' }, CENTER));

  /* ---------- sous-titres (masqués quand la phrase est composée en grand) ---------- */
  const NOSUB = new Set(['s1a', 's1c', 's1e', 's7a', 's7b']); // s1c : les étiquettes au-dessus des passants disent la phrase
  const CHUNKS = TL.sentences.flatMap(s => s.chunks.map(c => Object.assign(c, { sid: s.id })));
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.show = Math.min(c.end + .3, nx ? nx.start - .02 : c.end + .6); });
  function subs(t) {
    const c = CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
    if (!c || NOSUB.has(c.sid)) { SUBS.style.opacity = 0; return; }
    if (SUBS.dataset.k !== c.text) { SUBS.textContent = c.text; SUBS.dataset.k = c.text; }
    SUBS.style.opacity = (prog(t, c.start - .03, c.start + .06, 'linear') * (1 - prog(t, c.show - .08, c.show, 'linear'))).toFixed(3);
  }

  /* ---------- outils de dessin ---------- */
  const cam = (c, z, fx, fy) => c.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 - fy * z);
  const LM = 140;
  const camSafe = (c, z, fx, fy) => { const hw = W / 2 / z, hh = H / 2 / z; cam(c, z, clamp(fx, hw - LM, W - hw + LM), clamp(fy, hh - LM, H - hh + LM)); };
  function prerender(fn, ss = 1.3) { const o = off(Math.round((W + 2 * LM) * ss), Math.round((H + 2 * LM) * ss)), c = o.getContext('2d'); c.setTransform(ss, 0, 0, ss, LM * ss, LM * ss); fn(c); return o; }
  const blit = (c, o) => c.drawImage(o, -LM, -LM, W + 2 * LM, H + 2 * LM);
  const flash = (c, col, a) => { if (a > 0) { c.fillStyle = rgba(col, Math.min(1, a)); c.fillRect(0, 0, W, H); } };
  const topShade = (c, col, a, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, rgba(col, a)); g.addColorStop(.7, rgba(col, a * .55)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, W, h); };
  const quad = (c, q) => { c.beginPath(); c.moveTo(...q[0]); c.lineTo(...q[1]); c.lineTo(...q[2]); c.lineTo(...q[3]); c.closePath(); };
  const _a = off(W, H), _ax = _a.getContext('2d'), _b = off(W, H), _bx = _b.getContext('2d');
  function rimmed(c, fn, o) { // silhouette + liseré de lumière du côté de la source (dx > 0 : lumière à droite)
    _ax.setTransform(1, 0, 0, 1, 0, 0); _ax.clearRect(0, 0, W, H); _ax.fillStyle = _ax.strokeStyle = o.body; fn(_ax);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over'; _bx.clearRect(0, 0, W, H); _bx.fillStyle = _bx.strokeStyle = o.rim; fn(_bx);
    _bx.globalCompositeOperation = 'destination-out'; _bx.setTransform(1, 0, 0, 1, -o.dx, -(o.dy || 0)); _bx.fillStyle = _bx.strokeStyle = '#000'; fn(_bx);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over';
    c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; c.drawImage(_a, 0, 0); c.globalAlpha *= o.rimA; c.drawImage(_b, 0, 0); c.restore();
  }
  const ik = (sx, sy, tx_, ty, l1, l2, bend) => { const dx = tx_ - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), l1 + l2 - .01), a = Math.atan2(dy, dx), b = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) * bend; return [sx + Math.cos(a + b) * l1, sy + Math.sin(a + b) * l1]; };
  function strokeProg(c, pts, p) {
    let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = tot * clamp(p); c.beginPath(); c.moveTo(...pts[0]);
    for (let i = 1; i < pts.length && left > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), k = Math.min(1, left / d); c.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); left -= d; }
    c.stroke();
  }
  /** le second passant : manteau long et bonnet (le premier est le personnage de la série, en sweat à capuche) */
  function coatPath(c, p) {
    const s = p.s || 1, f = p.f || 1, P = (x, y) => [p.x + x * s * f, p.y + y * s];
    c.beginPath(); c.moveTo(...P(-15, -150)); c.lineTo(...P(15, -150)); c.lineTo(...P(24, -56)); c.lineTo(...P(-22, -54)); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(...P(7, -178), 13 * s, 8 * s, 0, Math.PI, 2 * Math.PI); c.fill();
  }
  /** passant agenouillé (regarde à droite si f = 1), main tendue vers « reach » */
  function kneelPath(c, p) {
    const s = p.s, f = p.f, L = (x, y) => [p.x + x * s * f, p.y + y * s];
    c.lineCap = 'round'; c.lineJoin = 'round';
    const hip = L(-12, -64), kn = L(34, -52);
    c.lineWidth = 16 * s; c.beginPath(); c.moveTo(...L(-66, -4)); c.lineTo(...L(0, -6)); c.lineTo(...hip); c.stroke(); // jambe au sol
    c.beginPath(); c.moveTo(...hip); c.lineTo(...kn); c.lineTo(...L(40, -6)); c.stroke(); // jambe levée
    c.lineWidth = 9 * s; c.beginPath(); c.moveTo(...L(36, -4)); c.lineTo(...L(54, -3)); c.stroke();
    const ln = p.lean, cs = Math.cos(ln), sn = Math.sin(ln), R = (x, y) => L(-12 + x * cs - y * sn, -64 + x * sn + y * cs);
    c.beginPath(); c.moveTo(...R(-16, 0)); c.quadraticCurveTo(...R(-24, -50), ...R(-14, -86)); c.quadraticCurveTo(...R(2, -96), ...R(16, -86)); c.quadraticCurveTo(...R(24, -40), ...R(16, 0)); c.closePath(); c.fill();
    if (p.coat) { c.beginPath(); c.moveTo(...R(-18, -86)); c.lineTo(...R(18, -86)); c.lineTo(...R(30, 12)); c.lineTo(...R(-26, 12)); c.closePath(); c.fill(); }
    else { c.beginPath(); c.ellipse(...R(-10, -88), 12 * s, 8 * s, ln * f, 0, 6.283); c.fill(); } // capuche
    const nk = R(4, -90), hd = R(12 + (p.look || 0) * 4, -112);
    c.lineWidth = 11 * s; c.beginPath(); c.moveTo(...nk); c.lineTo(...hd); c.stroke();
    c.beginPath(); c.ellipse(hd[0], hd[1], 13 * s, 14.5 * s, 0, 0, 6.283); c.fill();
    if (p.coat) { c.beginPath(); c.ellipse(hd[0] - 1 * s * f, hd[1] - 6 * s, 14 * s, 9 * s, 0, Math.PI, 2 * Math.PI); c.fill(); }
    else { c.beginPath(); c.ellipse(hd[0] - 2 * s * f, hd[1] - 5 * s, 13 * s, 9 * s, -.2 * f, Math.PI, 2 * Math.PI); c.fill(); }
    const sh = R(8, -82), tgt = p.reach || R(60, -20), el_ = ik(sh[0], sh[1], tgt[0], tgt[1], 34 * s, 32 * s, f);
    c.lineWidth = 12 * s; c.beginPath(); c.moveTo(...sh); c.lineTo(...el_); c.lineTo(...tgt); c.stroke();
    c.beginPath(); c.arc(tgt[0], tgt[1], 7 * s, 0, 6.283); c.fill();
    return tgt;
  }
  /** l'inconnu, à terre ; « up » 0 allongé → 1 assis */
  function fallenPath(c, p) {
    const s = p.s, L = (x, y) => [p.x + x * s, p.y + y * s], up = p.up || 0;
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 17 * s; c.beginPath(); c.moveTo(...L(10, -10)); c.lineTo(...L(70, -12)); c.lineTo(...L(118, -8)); c.stroke(); // jambes
    c.beginPath(); c.moveTo(...L(10, -10)); c.lineTo(...L(66, -30 * up - 8)); c.lineTo(...L(112, -4)); c.stroke();
    const a = lerp(Math.PI * .96, Math.PI * .62, up), tor = [p.x + Math.cos(a) * 80 * s + 10 * s, p.y - 12 * s - Math.sin(a) * 80 * s];
    c.lineWidth = 34 * s; c.beginPath(); c.moveTo(...L(10, -14)); c.lineTo(...tor); c.stroke();
    c.beginPath(); c.arc(tor[0] + Math.cos(a) * 26 * s, tor[1] - Math.sin(a) * 26 * s, 14 * s, 0, 6.283); c.fill();
    c.lineWidth = 11 * s; c.beginPath(); c.moveTo(tor[0] + 6 * s, tor[1] + 4 * s); c.lineTo(tor[0] + 50 * s, tor[1] + 20 * s - up * 24 * s); c.stroke();
  }

  /* =====================================================================
     DÉCOR 1 & 7b — LA RUE SOUS LA PLUIE (nuit), puis à l'aube
     ===================================================================== */
  const HZ = 1130, GND = 1760;
  const roadX = (u, y) => 540 + u * (y - HZ) * 1.25;
  function drawStreetStatic(c, m) {
    const r = rng(404);
    let g = c.createLinearGradient(0, -LM, 0, HZ); g.addColorStop(0, mix('#05080e', '#2b3550', m)); g.addColorStop(.7, mix('#0d1622', '#B98A7A', m)); g.addColorStop(1, mix('#1c2430', '#F0C9A0', m));
    c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, HZ + LM);
    for (let layer = 0; layer < 3; layer++) { // immeubles, trois plans
      let x = -LM; const base = HZ + 4, k = layer / 2;
      while (x < W + LM) {
        const w = 70 + r() * 120, h = (420 - layer * 110) * (.5 + r() * .8) + 80, col = mix(mix('#0a1018', '#1a1e2a', k), mix('#5a4a52', '#2e2a34', k), m);
        c.fillStyle = col; c.fillRect(x, base - h, w + 2, h);
        for (let wy = base - h + 16; wy < base - 20; wy += 26) for (let wx = x + 10; wx < x + w - 12; wx += 22) if (r() < .32 - layer * .06) { c.fillStyle = rgba(r() < .7 ? '#F6C27A' : '#BFD8FF', (.35 + r() * .5) * (1 - m * .6) * (1 - k * .3)); c.fillRect(wx, wy, 9, 13); }
        x += w + 6 + r() * 20;
      }
      c.fillStyle = rgba(mix('#0d1622', '#E9C3A0', m), .25); c.fillRect(-LM, -LM, W + 2 * LM, HZ + LM); // brume
    }
    // trottoirs et chaussée mouillée
    g = c.createLinearGradient(0, HZ, 0, H + LM); g.addColorStop(0, mix('#141a22', '#7a6a66', m)); g.addColorStop(1, mix('#05070a', '#2a2422', m));
    c.fillStyle = g; c.fillRect(-LM, HZ, W + 2 * LM, H + LM - HZ);
    c.fillStyle = mix('#1a2028', '#8a7a72', m); c.beginPath(); c.moveTo(roadX(-1, HZ), HZ); c.lineTo(roadX(-1, H + LM), H + LM); c.lineTo(-LM, H + LM); c.lineTo(-LM, HZ); c.fill();
    c.beginPath(); c.moveTo(roadX(1, HZ), HZ); c.lineTo(roadX(1, H + LM), H + LM); c.lineTo(W + LM, H + LM); c.lineTo(W + LM, HZ); c.fill();
    c.strokeStyle = mix('#2a323c', '#a89a90', m); c.lineWidth = 3; for (const u of [-1, 1]) { c.beginPath(); c.moveTo(roadX(u, HZ), HZ); c.lineTo(roadX(u, H + LM), H + LM); c.stroke(); }
    // passage piéton (bandes vers le point de fuite)
    const y0 = 1640, y1 = 1860;
    for (let k = -6; k <= 5; k++) { const u0 = k * .16 + .02, u1 = u0 + .1; c.fillStyle = rgba(mix('#D9DEE6', '#FFF4E8', m), .36); quad(c, [[roadX(u0, y0), y0], [roadX(u1, y0), y0], [roadX(u1, y1), y1], [roadX(u0, y1), y1]]); c.fill(); }
    // ligne médiane
    for (let y = HZ + 10; y < y0 - 20; y += 30 + (y - HZ) * .25) { const h = 8 + (y - HZ) * .08; c.fillStyle = rgba('#E9D8A0', .45); quad(c, [[roadX(-.012, y), y], [roadX(.012, y), y], [roadX(.012, y + h), y + h], [roadX(-.012, y + h), y + h]]); c.fill(); }
    // lampadaire
    c.fillStyle = '#07090c'; c.fillRect(196, 640, 14, GND - 640); c.fillRect(196, 640, 120, 10); c.beginPath(); c.moveTo(290, 650); c.lineTo(340, 650); c.lineTo(330, 668); c.lineTo(300, 668); c.fill();
  }
  const STREET = [prerender(c => drawStreetStatic(c, 0)), prerender(c => drawStreetStatic(c, 1))];
  const rain = (() => { const r = rng(17); return Array.from({ length: 170 }, () => ({ x: r() * (W + 200) - 100, y: r() * H, v: 1500 + r() * 700, l: 26 + r() * 30 })); })();
  function drawStreet(c, t, st) {
    blit(c, STREET[0]); if (st.dawn > 0) { c.save(); c.globalAlpha = st.dawn; blit(c, STREET[1]); c.restore(); }
    const night = 1 - st.dawn;
    glow(c, 315, 670, 520, C.sodium, .42 * night + .1); beam(c, 315, 668, 60, GND + 40, 640, GND + 40, C.sodium, .22 * night, 22);
    glow(c, 330, GND - 30, 380, C.sodium, .18 * night);
    // reflets des lumières sur la chaussée mouillée
    c.save(); c.globalCompositeOperation = 'screen'; const r = rng(9);
    for (let k = 0; k < 26; k++) { const x = r() * W, a = (.05 + r() * .1) * night, w = 3 + r() * 6; const g = c.createLinearGradient(0, HZ, 0, H); g.addColorStop(0, rgba(r() < .6 ? '#F6C27A' : '#BFD8FF', a)); g.addColorStop(1, rgba('#F6C27A', 0)); c.fillStyle = g; c.fillRect(x + Math.sin(t * 2 + k) * 2, HZ + 10, w, H - HZ); }
    c.restore();
    // phares qui approchent (le danger), puis s'arrêtent
    const car = st.car || 0; if (car > 0) { const sp = lerp(10, 46, car), y = HZ + 8 + car * 40; for (const d of [-1, 1]) { glow(c, 540 + d * sp, y, 70 + car * 160, '#FFF6E0', .55 * st.carA); c.fillStyle = rgba('#FFFFFF', .9 * st.carA); c.beginPath(); c.arc(540 + d * sp, y, 3 + car * 6, 0, 6.283); c.fill(); }
      beam(c, 540, y, 380, GND, 700, GND, '#FFF6E0', .12 * car * st.carA, 30); }
    // personnages
    const fl = { x: 470, y: GND - 6, s: 1.55, up: st.up || 0 };
    rimmed(c, cc => fallenPath(cc, fl), { body: '#06070a', rim: C.sodium, rimA: .55, dx: -2.5, dy: 2 });
    const drawP = (P, coat, rim, dx, al) => { if (!P || al <= .001) return;
      if (P.kneel) rimmed(c, cc => kneelPath(cc, coat ? Object.assign({ coat: true }, P) : P), { body: '#07080b', rim, rimA: .85, dx, alpha: al });
      else rimmed(c, cc => { personPath(cc, P); if (coat) coatPath(cc, P); }, { body: '#07080b', rim, rimA: .85, dx, alpha: al }); };
    drawP(st.A, false, C.lamp, -3.2, st.Aal == null ? 1 : st.Aal); drawP(st.A2, false, mix(C.lamp, '#FFE7B8', .3), -3.2, st.A2al || 0);
    drawP(st.B, true, '#BFD3F2', 3.2, st.Bal == null ? 1 : st.Bal); drawP(st.B2, true, '#BFD3F2', 3.2, st.B2al || 0);
    if (st.hands > 0) for (const h of st.handPts || []) { glow(c, h[0], h[1], 130, '#FFE9C0', .55 * st.hands); c.fillStyle = rgba('#FFF6E0', .9 * st.hands); c.beginPath(); c.arc(h[0], h[1], 5, 0, 6.283); c.fill(); }
    // pluie
    if (st.rain > 0) { c.save(); c.strokeStyle = rgba('#CFE0F2', .28 * st.rain); c.lineWidth = 1.6; for (const d of rain) { const y = ((d.y + d.v * t) % (H + 80)) - 40, x = d.x - y * .08; c.beginPath(); c.moveTo(x, y); c.lineTo(x - d.l * .08, y + d.l); c.stroke(); } c.restore(); }
  }
  // la balance au-dessus des deux gestes
  function balance(c, x, y, s, p, glowA) {
    if (p <= 0) return;
    c.save(); c.globalAlpha = p; c.strokeStyle = '#F3D9A0'; c.lineWidth = 3.4; c.lineCap = 'round'; c.shadowColor = '#FFD98A'; c.shadowBlur = 16;
    c.beginPath(); c.moveTo(x, y - 120 * s); c.lineTo(x, y + 70 * s); c.moveTo(x - 40 * s, y + 70 * s); c.lineTo(x + 40 * s, y + 70 * s); c.stroke();
    strokeProg(c, [[x - 190 * s, y - 100 * s], [x + 190 * s, y - 100 * s]], p);
    for (const d of [-1, 1]) { const px = x + d * 190 * s, py = y - 100 * s; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 50 * s, py + 90 * s); c.moveTo(px, py); c.lineTo(px + 50 * s, py + 90 * s); c.stroke(); c.beginPath(); c.ellipse(px, py + 92 * s, 60 * s, 12 * s, 0, 0, Math.PI); c.stroke(); glow(c, px, py + 80 * s, 70 * s, '#FFE9C0', .6 * glowA); }
    c.restore();
  }
  function scene1(c, t) {
    const z = lerp(1.18, 1.0, prog(t, .3, T.passants, 'inOutSine')) + prog(t, T.arretent, T.s2, 'inOutSine') * .08;
    camSafe(c, z, 540, lerp(1000, 1080, prog(t, T.s1b, T.arretent, 'inOutSine')) + prog(t, T.arretent, T.s2, 'inOutSine') * 120);
    const wa = prog(t, T.s1b - .3, T.arretent + .2, 'linear'), kn = prog(t, T.arretent, T.arretent + .6, 'inOutCubic');
    const ax = lerp(-90, 355, Math.min(1, wa * 1.05)), bx = lerp(1170, 650, Math.min(1, wa * 1.05));
    const reach = prog(t, T.aider - .2, T.aider + .6, 'inOutCubic');
    const A = { x: ax, y: GND, s: 1.65, f: 1, walk: wa < 1 ? t * 6.2 : null, phone: 0 }, B = { x: bx, y: GND, s: 1.65, f: -1, walk: wa < 1 ? t * 6.0 + 1 : null, phone: 0 };
    const A2 = { kneel: true, x: 350, y: GND, s: 1.65, f: 1, lean: lerp(.1, .55, reach), reach: [lerp(430, 455, reach), lerp(GND - 120, GND - 70, reach)] };
    const B2 = { kneel: true, x: 655, y: GND, s: 1.65, f: -1, lean: lerp(.1, .5, reach), reach: [lerp(600, 560, reach), lerp(GND - 120, GND - 92, reach)] };
    const hands = prog(t, T.geste - .1, T.geste + .5, 'outCubic');
    drawStreet(c, t, { dawn: 0, rain: 1, car: prog(t, T.inconnu, T.arretent, 'inOutSine'), carA: 1 - .7 * prog(t, T.arretent, T.aider, 'linear'), up: prog(t, T.aider + .2, T.s2, 'inOutSine') * .25,
      A, B, A2, B2, Aal: 1 - kn, Bal: 1 - kn, A2al: kn, B2al: kn, hands, handPts: [A2.reach, B2.reach] });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#05070c', .5 + .3 * prog(t, T.geste, T.moins, 'linear'), 900); // place pour le texte
    balance(c, 540, 900, 1, prog(t, T.moins - .1, T.moins + .7, 'outCubic'), prog(t, T.chez - .1, T.autre2 + .3, 'inOutSine'));
    vignette(c, .55, '#02030a');
    flash(c, '#000000', 1 - prog(t, 0, .7, 'outCubic'));
    flash(c, '#000000', .6 * prog(t, T.qEnd1 + .2, T.qEnd1 + .26, 'linear') * (1 - prog(t, T.s1b - .35, T.s1b, 'linear')));
  }

  /* =====================================================================
     DÉCOR 2 & 6 — L'ARBRE EN COUPE : l'acte (au-dessus), le pourquoi (les racines)
     ===================================================================== */
  const GL = 1000; // ligne du sol
  const ROOTS = (() => { const r = rng(88), out = [];
    function grow(x, y, a, len, depth, t0) { const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; out.push({ x, y, x2, y2, w: Math.max(2, 18 - depth * 4), t0, t1: t0 + .25 + r() * .2 });
      if (depth < 4) { const n = depth < 2 ? 2 : (r() < .7 ? 2 : 1); for (let k = 0; k < n; k++) grow(x2, y2, a + (r() - .5) * 1.1 + (k ? .35 : -.35), len * (.62 + r() * .2), depth + 1, t0 + .2); } }
    grow(540, GL, Math.PI / 2 - .5, 170, 0, 0); grow(540, GL, Math.PI / 2 + .45, 160, 0, .05); grow(540, GL, Math.PI / 2, 190, 0, .1);
    return out; })();
  const DEEP = (() => { const r = rng(91), out = []; // les racines profondes vers les deux lumières
    for (const [tx_, side] of [[300, -1], [780, 1]]) { let x = 540 + side * 30, y = GL + 300; const pts = [[x, y]]; for (let k = 1; k <= 14; k++) { const u = k / 14; x = lerp(540 + side * 30, tx_, u) + Math.sin(k * 1.7 + side) * 26 * (1 - u); y = lerp(GL + 300, 1360, u) + (r() - .5) * 18; pts.push([x, y]); } out.push(pts); }
    return out; })();
  const leaves = (() => { const r = rng(55); return Array.from({ length: 70 }, () => { const a = r() * 6.283, d = Math.sqrt(r()); return { x: 540 + Math.cos(a) * d * 300, y: 560 + Math.sin(a) * d * 190, r: 40 + r() * 60, k: r() }; }); })();
  const FRUITS = [[420, 600], [640, 520], [560, 690], [700, 640], [470, 480]];
  function drawTree(c, t, st) {
    const m = st.night || 0;
    // ciel
    let g = c.createLinearGradient(0, -LM, 0, GL); g.addColorStop(0, mix('#9FB6C8', '#070b18', m)); g.addColorStop(.7, mix('#F2D9C0', '#1a2240', m)); g.addColorStop(1, mix('#F6E3C8', '#2a2a40', m));
    c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, GL + LM);
    if (m > 0) { const r = rng(3); for (let k = 0; k < 140; k++) { const x = r() * W, y = r() * 800, a = m * (.3 + .7 * Math.pow(.5 + .5 * Math.sin(t * (.5 + r()) + k), 2)); c.fillStyle = rgba('#EEF2FF', a * .8); c.beginPath(); c.arc(x, y, .6 + r() * 1.4, 0, 6.283); c.fill(); } }
    c.fillStyle = mix('#C9B48E', '#1a1d2a', m); c.beginPath(); c.moveTo(-LM, GL); c.quadraticCurveTo(540, GL - 120, W + LM, GL); c.fill(); // colline
    // sous-sol : strates
    g = c.createLinearGradient(0, GL, 0, H + 900); g.addColorStop(0, mix('#4a3020', '#22160e', m)); g.addColorStop(.35, mix('#2e1d12', '#140c08', m)); g.addColorStop(1, '#050302');
    c.fillStyle = g; c.fillRect(-LM, GL, W + 2 * LM, H + 900);
    const rs = rng(21); for (let k = 0; k < 60; k++) { c.fillStyle = rgba('#000000', .15 + rs() * .2); c.beginPath(); c.ellipse(rs() * W, GL + 40 + rs() * 1700, 10 + rs() * 30, 6 + rs() * 14, rs(), 0, 6.283); c.fill(); }
    for (let k = 0; k < 5; k++) { c.strokeStyle = rgba('#000000', .25); c.lineWidth = 2; c.beginPath(); const y = GL + 120 + k * 210; c.moveTo(-LM, y); c.bezierCurveTo(300, y + 30, 700, y - 30, W + LM, y + 10); c.stroke(); }
    // racines (le « pourquoi »)
    const rp = st.roots || 0;
    c.save(); c.lineCap = 'round'; c.strokeStyle = mix('#7a5a3a', '#4a3424', m);
    for (const b of ROOTS) { const p = clamp((rp * 1.4 - b.t0) / (b.t1 - b.t0)); if (p <= 0) continue; c.lineWidth = b.w; c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(lerp(b.x, b.x2, p), lerp(b.y, b.y2, p)); c.stroke(); }
    c.restore();
    if (rp > .6) for (const b of ROOTS.filter(b => b.w <= 2)) glow(c, b.x2, b.y2, 26, '#FFD9A0', .35 * clamp((rp - .6) / .4) * (.6 + .4 * Math.sin(t * 2 + b.x)));
    // racines profondes (les deux pistes du fondement)
    const dp = st.deep || 0;
    if (dp > 0) { c.save(); c.lineCap = 'round'; c.strokeStyle = mix('#7a5a3a', '#5a4430', m); c.lineWidth = 7; for (const pts of DEEP) strokeProg(c, [[540, GL + 120], [540, GL + 300], ...pts], dp); c.restore(); }
    const lg = st.godL || 0, lr = st.reaL || 0;
    if (lg > 0) { glow(c, 300, 1420, 340, '#FFD98A', .55 * lg); glow(c, 300, 1420, 90, '#FFF2C8', .8 * lg); }
    if (lr > 0) { glow(c, 780, 1420, 340, '#BFD8FF', .55 * lr); c.save(); c.globalAlpha = lr; c.strokeStyle = '#E6F0FF'; c.lineWidth = 2.4; khatam(c, 780, 1420, 44 + Math.sin(t) * 2); c.stroke(); c.restore(); glow(c, 780, 1420, 80, '#F2F7FF', .7 * lr); }
    // tronc, branches, feuillage
    c.fillStyle = mix('#3a2618', '#120c08', m); c.beginPath(); c.moveTo(510, GL + 10); c.bezierCurveTo(520, 860, 500, 760, 470, 640); c.lineTo(500, 630); c.bezierCurveTo(530, 720, 548, 760, 552, 700); c.lineTo(560, 600); c.lineTo(590, 610); c.bezierCurveTo(580, 760, 570, 860, 576, GL + 10); c.closePath(); c.fill();
    const bloom = st.bloom || 0;
    for (const lf of leaves) { c.fillStyle = rgba(mix(mix('#5d7a4a', '#9ab070', lf.k), mix('#1a2a20', '#2a3a2a', lf.k), m), .55 + bloom * .2); c.beginPath(); c.arc(lf.x, lf.y, lf.r * (.85 + .15 * bloom), 0, 6.283); c.fill(); }
    FRUITS.forEach(([x, y], i) => { const a = clamp(bloom * 1.6 - i * .15); if (a <= 0) return; glow(c, x, y, 70, '#FFE2A0', .6 * a); c.fillStyle = rgba('#FFE7B0', .95 * a); c.beginPath(); c.arc(x, y, 9, 0, 6.283); c.fill(); });
    // la ligne du sol (la distinction)
    const gl = st.line || 0; if (gl > 0) { c.save(); c.strokeStyle = '#FFE2A8'; c.lineWidth = 4; c.shadowColor = '#FFD98A'; c.shadowBlur = 18; strokeProg(c, [[-LM, GL], [W + LM, GL]], gl); c.restore(); }
    // au pied de l'arbre : les deux gestes (scène 6)
    if (st.pair > 0) { const a = st.pair; for (const [x, f, coat] of [[330, 1, false], [750, -1, true]]) { rimmed(c, cc => kneelPath(cc, { x, y: GL - 4, s: .8, f, lean: .45, reach: [x + f * 70, GL - 40], coat }), { body: '#080609', rim: '#FFE2A8', rimA: .7, dx: f * -2, alpha: a }); glow(c, x + f * 70, GL - 40, 90, '#FFE9C0', .5 * a * (st.pairGlow || 0)); } }
  }
  function scene2(c, t) {
    const z = lerp(1.06, 1.0, prog(t, T.s2, T.s3, 'inOutSine')), fy = lerp(900, 1010, prog(t, T.expliquer - .3, T.expliquer + .8, 'inOutSine'));
    camSafe(c, z, 540, fy);
    drawTree(c, t, { line: prog(t, T.distinguons - .1, T.choses + .3, 'inOutCubic'), bloom: prog(t, T.accomplir - .1, T.acte + .6, 'outCubic'), roots: prog(t, T.expliquer - .1, T.juste2 + .4, 'inOutSine') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .4, '#1a0e06');
  }

  /* =====================================================================
     DÉCOR 3 — LA NEF : la règle d'or, en miroir
     ===================================================================== */
  function drawNaveStatic(c) {
    const VPx = 540, VPy = 820;
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#0c0f16'); g.addColorStop(.55, '#1c2230'); g.addColorStop(1, '#0a0b10'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    // l'abside et son grand vitrail
    c.save(); archPath(c, VPx, 980, 200, 520, true); g = c.createLinearGradient(0, 460, 0, 980); g.addColorStop(0, '#FFF6DC'); g.addColorStop(1, '#F2C27D'); c.fillStyle = g; c.fill(); c.restore();
    c.strokeStyle = '#2a2018'; c.lineWidth = 5; c.beginPath(); c.moveTo(VPx, 470); c.lineTo(VPx, 980); for (let y = 560; y < 980; y += 70) { c.moveTo(VPx - 100, y); c.lineTo(VPx + 100, y); } c.stroke();
    // sol de pierre en perspective
    g = c.createLinearGradient(0, 980, 0, H + LM); g.addColorStop(0, '#3a3430'); g.addColorStop(1, '#0e0c0b'); c.fillStyle = g; c.beginPath(); c.moveTo(VPx - 110, 980); c.lineTo(VPx + 110, 980); c.lineTo(W + LM, H + LM); c.lineTo(-LM, H + LM); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; for (let k = -6; k <= 6; k++) { c.beginPath(); c.moveTo(VPx + k * 18, 980); c.lineTo(VPx + k * 260, H + LM); c.stroke(); }
    for (let y = 990, s = 8; y < H + LM; y += s, s *= 1.18) { c.beginPath(); c.moveTo(-LM, y); c.lineTo(W + LM, y); c.stroke(); }
    // colonnes et arcs de la nef, du fond vers l'avant
    for (let k = 7; k >= 0; k--) { const z = 1 + k * .55, sp = 520 / z, top = VPy - 760 / z, bot = 980 + (H - 980) * (1 / z) * .9, w = 70 / z;
      for (const d of [-1, 1]) { const x = VPx + d * sp; g = c.createLinearGradient(x - w, 0, x + w, 0); g.addColorStop(0, '#2a2a30'); g.addColorStop(.5, mix('#6a6058', '#2a2a30', k / 8)); g.addColorStop(1, '#18181c'); c.fillStyle = g; c.fillRect(x - w / 2, top, w, bot - top); }
      c.strokeStyle = mix('#5a5048', '#1a1a20', k / 8); c.lineWidth = 26 / z; c.beginPath(); c.moveTo(VPx - sp, top); c.quadraticCurveTo(VPx - sp, top - 330 / z, VPx, top - 420 / z); c.quadraticCurveTo(VPx + sp, top - 330 / z, VPx + sp, top); c.stroke(); }
    // lutrin et Bible ouverte (premier plan, à droite)
    c.fillStyle = '#0c0a08'; c.fillRect(860, 1560, 26, 380); c.beginPath(); c.moveTo(780, 1500); c.lineTo(980, 1500); c.lineTo(1000, 1580); c.lineTo(760, 1580); c.fill();
    c.fillStyle = '#EDE2C8'; c.beginPath(); c.moveTo(784, 1494); c.quadraticCurveTo(830, 1478, 878, 1494); c.lineTo(878, 1560); c.quadraticCurveTo(830, 1546, 772, 1560); c.fill(); c.beginPath(); c.moveTo(882, 1494); c.quadraticCurveTo(930, 1478, 976, 1494); c.lineTo(988, 1560); c.quadraticCurveTo(930, 1546, 882, 1560); c.fill();
    c.strokeStyle = 'rgba(58,48,40,.45)'; c.lineWidth = 1.6; for (let y = 1504; y < 1550; y += 7) { c.beginPath(); c.moveTo(790, y); c.lineTo(870, y); c.moveTo(890, y); c.lineTo(972, y); c.stroke(); }
  }
  const NAVE = prerender(drawNaveStatic, 1.25);
  const naveDust = makeDust(120, 33, [200, 300, 680, 1300]);
  function scene3(c, t) {
    const z = lerp(1.12, 1.0, prog(t, T.s3, T.s4, 'inOutSine')); camSafe(c, z, 540, lerp(1020, 960, prog(t, T.s3, T.s4, 'inOutSine')));
    blit(c, NAVE);
    glow(c, 540, 720, 520, '#FFE2A8', .45); beam(c, 540, 600, 200, 1900, 880, 1900, '#FFE9C0', .16, 30);
    dust(c, naveDust, t, [200, 300, 680, 1300], '#FFF0D0', .4, (x) => clamp(1 - Math.abs(x - 540) / 340));
    // le miroir : une ligne de lumière, deux personnes face à face
    const ml = prog(t, T.jesus - .2, T.jesus + .6, 'inOutCubic');
    if (ml > 0) { c.save(); c.strokeStyle = rgba('#FFF2D0', .7 * ml); c.lineWidth = 2.4; c.shadowColor = '#FFD98A'; c.shadowBlur = 16; strokeProg(c, [[540, 1180], [540, 1800]], ml); c.restore(); }
    const ex = prog(t, T.traiter - .1, T.autres + .5, 'inOutCubic'), back = prog(t, T.comme - .1, T.traite + .5, 'inOutCubic');
    rimmed(c, cc => personPath(cc, { x: 400, y: 1780, s: 1.9, f: 1, phone: 0, hand: ex > 0 ? [lerp(430, 520, ex), lerp(1640, 1560, ex)] : null }), { body: '#07080b', rim: '#FFE2A8', rimA: .8, dx: 3 });
    rimmed(c, cc => personPath(cc, { x: 680, y: 1780, s: 1.9, f: -1, phone: 0, hand: back > 0 ? [lerp(650, 560, back), lerp(1640, 1560, back)] : null }), { body: '#07080b', rim: '#FFE2A8', rimA: .8, dx: -3 });
    if (ex > 0) glow(c, lerp(430, 520, ex), lerp(1640, 1560, ex), 90, '#FFE9C0', .5 * ex);
    if (back > 0) glow(c, lerp(650, 560, back), lerp(1640, 1560, back), 90, '#FFE9C0', .5 * back);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#06070c', .6, 720);
    vignette(c, .55, '#030408');
  }

  /* =====================================================================
     DÉCOR 4 — LA FORÊT D'ARCS BICOLORES : la justice, l'équilibre
     ===================================================================== */
  function drawArcsStatic(c) {
    const VPx = 540, VPy = 900;
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#0e0806'); g.addColorStop(.5, '#2a160e'); g.addColorStop(1, '#0a0605'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    g = c.createLinearGradient(0, 1000, 0, H + LM); g.addColorStop(0, '#4a3020'); g.addColorStop(1, '#120a06'); c.fillStyle = g; c.fillRect(-LM, 1000, W + 2 * LM, H + LM);
    for (let k = 6; k >= 0; k--) { // rangées d'arcs, du fond vers l'avant : colonnes, arcs outrepassés bicolores, arcs supérieurs
      const z = 1 + k * .62, R = 150 / z, base = VPy + 860 / z, colH = 430 / z, colW = 26 / z, fog = Math.min(.95, k / 6.5), spring = base - colH, up = spring - 250 / z;
      const stone = mix('#D8C2A0', '#1a0f0a', fog), red = mix('#A8402A', '#1a0f0a', fog), cream = mix('#EADBBE', '#1a0f0a', fog);
      for (let j = -5; j <= 5; j++) { const cx = VPx + j * 2 * R;
        c.fillStyle = stone; c.fillRect(cx - R - colW / 2, spring, colW, colH); c.fillRect(cx - R - colW * .9, base - 12 / z, colW * 1.8, 12 / z); // colonne et base
        c.fillRect(cx - R - colW * .45, up, colW * .9, spring - up); // pilier supérieur
        for (let v = 0; v < 13; v++) { const a0 = Math.PI * (.9 + v * 1.2 / 13), a1 = Math.PI * (.9 + (v + 1) * 1.2 / 13);
          c.beginPath(); c.arc(cx, spring - R * .25, R * .98, a0, a1); c.arc(cx, spring - R * .25, R * .7, a1, a0, true); c.closePath(); c.fillStyle = v % 2 ? red : cream; c.fill(); } // arc outrepassé
        for (let v = 0; v < 11; v++) { const a0 = Math.PI * (1 + v / 11), a1 = Math.PI * (1 + (v + 1) / 11);
          c.beginPath(); c.arc(cx, up, R * .98, a0, a1); c.arc(cx, up, R * .76, a1, a0, true); c.closePath(); c.fillStyle = v % 2 ? cream : red; c.fill(); } // arc supérieur en plein cintre
      }
      c.fillStyle = mix('#3a2418', '#0a0605', fog); c.fillRect(-LM, up - R - 30 / z, W + 2 * LM, 30 / z); // plafond de bois
    }
    for (let k = 0; k < 7; k++) { c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(VPx + (k - 3) * 30, 1000); c.lineTo(VPx + (k - 3) * 520, H + LM); c.stroke(); }
  }
  const ARCS = prerender(drawArcsStatic, 1.25);
  const arcDust = makeDust(130, 51, [0, 300, W, 1500]);
  function scene4(c, t) {
    const z = lerp(1.1, 1.0, prog(t, T.s4, T.s5, 'inOutSine')); camSafe(c, z, 540 + lerp(-20, 20, prog(t, T.s4, T.s5, 'linear')), 980);
    blit(c, ARCS);
    // puits de lumière et ombre géométrique au sol
    for (const x of [300, 540, 780]) beam(c, x, -100, x - 160, 1500, x + 160, 1500, '#FFE2A8', .14, 26);
    c.save(); c.translate(540, 1560); c.scale(1, .32); c.globalCompositeOperation = 'screen'; c.globalAlpha = .55; lattice(c, -560, -560, 1120, 1120, 140, '#FFD9A0', 3, .8); c.restore();
    dust(c, arcDust, t, [0, 300, W, 1500], '#FFE7C0', .35, (x) => .5 + .5 * Math.cos((x - 540) / 120));
    // la balance de justice, et deux personnes qui se tournent le dos
    const bp = prog(t, T.appelle - .2, T.juste4 + .5, 'outCubic'), hate = prog(t, T.meme - .1, T.deteste + .4, 'inOutCubic');
    rimmed(c, cc => personPath(cc, { x: 290, y: 1760, s: 1.75, f: -1 + 0 * hate, phone: 0, head: .1 * hate }), { body: '#0a0605', rim: '#FFD9A0', rimA: .75, dx: 2.8, alpha: .4 + .6 * hate });
    rimmed(c, cc => personPath(cc, { x: 790, y: 1760, s: 1.75, f: 1, phone: 0, head: .1 * hate }), { body: '#0a0605', rim: '#FFD9A0', rimA: .75, dx: -2.8, alpha: .4 + .6 * hate });
    balance(c, 540, 1300, 1.05, bp, .5 + .5 * hate);
    if (hate > 0) { glow(c, 290, 1600, 220, '#FFE2A8', .3 * hate); glow(c, 790, 1600, 220, '#FFE2A8', .3 * hate); } // la même lumière sur les deux
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#0a0503', .6, 860);
    vignette(c, .55, '#050201');
  }

  /* =====================================================================
     DÉCOR 5 — LE CABINET DE KANT (Königsberg) : le portrait, la boussole du devoir
     ===================================================================== */
  function drawStudyStatic(c) {
    let g = c.createLinearGradient(0, -LM, 0, H + LM); g.addColorStop(0, '#1a140e'); g.addColorStop(1, '#0c0907'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    for (let x = -LM; x < W + LM; x += 180) { c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = 6; c.strokeRect(x + 14, 120, 150, 560); c.strokeRect(x + 14, 720, 150, 300); } // lambris
    c.fillStyle = '#0a1226'; c.fillRect(800, 160, 260, 800); // fenêtre : nuit étoilée
    const r = rng(6); for (let k = 0; k < 60; k++) { c.fillStyle = rgba('#EEF2FF', .4 + r() * .5); c.beginPath(); c.arc(800 + r() * 260, 160 + r() * 800, .6 + r() * 1.4, 0, 6.283); c.fill(); }
    c.fillStyle = '#1a120c'; c.fillRect(790, 150, 280, 16); c.fillRect(790, 950, 280, 20); c.fillRect(922, 150, 14, 820); c.fillRect(790, 550, 280, 12);
    for (let row = 0; row < 7; row++) for (let k = 0; k < 9; k++) { c.fillStyle = ['#4a2a1c', '#2a3020', '#5a4028', '#3a2018'][(row + k) % 4]; c.fillRect(-120 + k * 30, 200 + row * 120, 24, 100 - (k % 3) * 10); } // bibliothèque
    c.fillStyle = '#1a120c'; for (let row = 0; row <= 7; row++) c.fillRect(-130, 300 + row * 120, 300, 10);
    // bureau
    g = c.createLinearGradient(0, 1180, 0, 1260); g.addColorStop(0, '#3a2414'); g.addColorStop(1, '#1a0f08'); c.fillStyle = g; c.fillRect(-LM, 1180, W + 2 * LM, 80); c.fillStyle = '#0c0805'; c.fillRect(-LM, 1260, W + 2 * LM, H);
    c.fillStyle = '#E9DEC8'; c.save(); c.translate(220, 1210); c.rotate(-.08); c.fillRect(-90, -24, 180, 40); c.restore(); // feuillets
    c.strokeStyle = 'rgba(60,48,36,.5)'; c.lineWidth = 1.4; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(150, 1196 + k * 8); c.lineTo(290, 1186 + k * 8); c.stroke(); }
    c.fillStyle = '#0a0806'; c.beginPath(); c.arc(330, 1200, 16, 0, 6.283); c.fill(); c.strokeStyle = '#E9DEC8'; c.lineWidth = 2; c.beginPath(); c.moveTo(332, 1190); c.lineTo(372, 1110); c.stroke(); // encrier, plume
  }
  const STUDY = prerender(drawStudyStatic, 1.25);
  function portrait(c, x, y, w, h, kz, sheen) {
    c.save(); c.fillStyle = 'rgba(0,0,0,.6)'; c.filter = 'blur(18px)'; c.beginPath(); c.ellipse(x + w / 2 + 12, y + h / 2 + 20, w / 2 + 24, h / 2 + 24, 0, 0, 6.283); c.fill(); c.restore();
    let g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#6a4a1c'); g.addColorStop(.4, '#F0D08A'); g.addColorStop(.7, '#9a6a28'); g.addColorStop(1, '#5a3a14');
    c.fillStyle = g; c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w / 2 + 22, h / 2 + 22, 0, 0, 6.283); c.fill();
    c.save(); c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 6.283); c.clip();
    const iw = IMG.naturalWidth, ih = IMG.naturalHeight, sw = iw / kz, sh = ih / kz, cx = lerp(iw / 2, iw * .48, (kz - 1) * 4), cy = lerp(ih / 2, ih * .33, (kz - 1) * 4);
    c.drawImage(IMG, clamp(cx - sw / 2, 0, iw - sw), clamp(cy - sh / 2, 0, ih - sh), sw, sh, x, y, w, h);
    g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(20,10,4,.1)'); g.addColorStop(1, 'rgba(255,190,110,.12)'); c.fillStyle = g; c.fillRect(x, y, w, h);
    if (sheen > 0 && sheen < 1) { c.globalCompositeOperation = 'screen'; const sx = lerp(x - 200, x + w + 200, sheen); g = c.createLinearGradient(sx - 100, y, sx + 100, y + 200); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,.3)'); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(x, y, w, h); }
    c.restore();
  }
  function compass(c, x, y, R, needle, glowA, pulls) {
    c.save(); c.fillStyle = '#2a1a0c'; c.beginPath(); c.arc(x, y, R + 20, 0, 6.283); c.fill();
    let g = c.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, '#F2E6CC'); g.addColorStop(1, '#C9B48E'); c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 6.283); c.fill();
    c.strokeStyle = '#6a4a2a'; c.lineWidth = 2; star8(c, x, y, R * .86, R * .3); c.stroke(); khatam(c, x, y, R * .55); c.stroke();
    for (let k = 0; k < 32; k++) { const a = k * Math.PI / 16; c.beginPath(); c.moveTo(x + Math.cos(a) * R * .92, y + Math.sin(a) * R * .92); c.lineTo(x + Math.cos(a) * R * (k % 4 ? .97 : .88), y + Math.sin(a) * R * (k % 4 ? .97 : .88)); c.stroke(); }
    c.font = '600 26px Fraunces'; c.fillStyle = '#5a2a1c'; c.textAlign = 'center'; c.fillText('DEVOIR', x, y - R * .62);
    c.translate(x, y); c.rotate(needle);
    c.fillStyle = '#8E2F2A'; c.beginPath(); c.moveTo(0, -R * .8); c.lineTo(12, 0); c.lineTo(-12, 0); c.closePath(); c.fill();
    c.fillStyle = '#2a2a30'; c.beginPath(); c.moveTo(0, R * .8); c.lineTo(12, 0); c.lineTo(-12, 0); c.closePath(); c.fill();
    c.fillStyle = '#C0A16A'; c.beginPath(); c.arc(0, 0, 8, 0, 6.283); c.fill(); c.restore();
    glow(c, x, y - R * .7, 120, '#FFE2A0', glowA);
    for (const [px, py, a] of pulls) if (a > 0) { glow(c, px, py, 90, '#E8949A', .55 * a); c.fillStyle = rgba('#F6C9C6', a); c.beginPath(); c.arc(px, py, 14, 0, 6.283); c.fill(); c.font = '600 22px Fraunces'; c.textAlign = 'center'; c.fillStyle = rgba('#F6C9C6', a); c.fillText('intérêts', px, py + 46); }
  }
  function scene5(c, t) {
    const down = prog(t, T.raison5 - .4, T.devoir + .4, 'inOutCubic'), z = lerp(1.08, 1.0, prog(t, T.s5, T.raison5, 'inOutSine')) + down * .06;
    camSafe(c, z, 540, lerp(900, 1320, down));
    blit(c, STUDY);
    glow(c, 930, 560, 380, '#9FB6E0', .18);
    const kz = lerp(1, 1.12, prog(t, T.s5, T.raison5, 'inOutSine'));
    portrait(c, 330, 390, 420, 548, kz, prog(t, T.kant, T.kant + 2, 'inOutSine'));
    // bougie
    c.fillStyle = '#1a120c'; c.fillRect(840, 1196, 60, 8); c.fillStyle = '#E9DEC8'; c.fillRect(860, 1100, 18, 96); const wob = Math.sin(t * 9) * 1.6;
    glow(c, 869, 1080, 420, C.lamp, .4); glow(c, 869, 1080, 70, '#FFE2A8', .7); c.fillStyle = 'rgba(255,231,176,.95)'; c.beginPath(); c.ellipse(869 + wob, 1080, 6, 16, wob * .05, 0, 6.283); c.fill();
    // la boussole du devoir
    const ip = prog(t, T.contre - .3, T.interets + .5, 'inOutSine'), settle = prog(t, T.interets + .3, T.interets + 1.4, 'outBack');
    const needle = Math.sin(ip * Math.PI * 3) * .9 * (1 - settle) * ip + (prog(t, T.devoir - .2, T.devoir + .5, 'outBack') < 1 ? (1 - prog(t, T.devoir - .2, T.devoir + .5, 'outBack')) * 1.2 : 0);
    compass(c, 540, 1520, 170, needle, prog(t, T.devoir - .1, T.devoir + .5, 'outCubic') * (.5 + .5 * settle), [[300, 1600, ip * (1 - settle * .7)], [780, 1600, ip * (1 - settle * .7)]]);
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#080604', .45 + .3 * down, 820);
    vignette(c, .55, '#050302');
  }

  /* ---------- Scène 6 et 7a : l'arbre la nuit, la descente vers le fondement ---------- */
  function scene6(c, t) {
    const dive = prog(t, T.tranche - .2, T.q + .2, 'inOutCubic');
    camSafe(c, lerp(1.04, 1.0, prog(t, T.s6, T.tranche, 'inOutSine')), 540, lerp(820, 1500, dive));
    drawTree(c, t, { night: 1, line: 1 - prog(t, T.tranche, T.fondement, 'linear') * .6, bloom: 1, roots: 1, pair: prog(t, T.s6 + .2, T.s6 + 1, 'outCubic'), pairGlow: prog(t, T.condition - .1, T.acte6 + .4, 'inOutSine'),
      deep: prog(t, T.fondement - .2, T.ultime + .9, 'inOutSine'), godL: 0, reaL: 0 });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#040408', .5, 780);
    vignette(c, .55, '#020203');
  }
  function scene7a(c, t) {
    camSafe(c, 1.0, 540, lerp(820, 1500, prog(t, T.tranche - .2, T.q + .2, 'inOutCubic')));
    drawTree(c, t, { night: 1, line: 1 - prog(t, T.tranche, T.fondement, 'linear') * .6, bloom: 1, roots: 1, pair: 1, pairGlow: 1, deep: prog(t, T.fondement - .2, T.ultime + .9, 'inOutSine'), godL: prog(t, T.dieu7 - .2, T.dieu7 + .6, 'outCubic') * (.75 + .25 * Math.sin(t * 1.3)), reaL: prog(t, T.raison7 - .2, T.raison7 + .6, 'outCubic') * (.75 + .25 * Math.sin(t * 1.3 + 1)) });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#020204', .5, 900);
    vignette(c, .6, '#010102');
  }
  /* ---------- Scène 7b : le débat commence (la rue à l'aube) ---------- */
  function scene7b(c, t) {
    const z = lerp(1.04, 1.0, prog(t, T.s7b, T.title, 'inOutSine')); camSafe(c, z, 540, 1040);
    const talk = (k) => .5 + .5 * Math.sin(t * 3.2 + k);
    drawStreet(c, t, { dawn: .85, rain: 0, car: 0, up: 1, A: { x: 380, y: GND, s: 1.65, f: 1, phone: 0, hand: [440 + talk(0) * 30, GND - 200 - talk(0) * 20], head: -.05 }, B: { x: 690, y: GND, s: 1.65, f: -1, phone: 0, hand: [630 - talk(2) * 30, GND - 190 - talk(2) * 24], head: -.05 }, hands: 0 });
    c.setTransform(1, 0, 0, 1, 0, 0);
    topShade(c, '#08060a', .55, 860);
    c.fillStyle = rgba('#05060a', .5 * prog(t, T.end7, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .55);
  }

  /* =====================================================================
     TRANSITIONS DE MISE EN SCÈNE (pendant que la voix enchaîne)
     ===================================================================== */
  const BA = off(W, H), bax = BA.getContext('2d'), BB = off(W, H), bbx = BB.getContext('2d');
  function paint(x, fn, t) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over'; fn(x, t); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over'; }
  const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  function drawScaled(c, img, sc, dx, dy, al) { c.save(); c.globalAlpha = al; c.translate(W / 2 + dx, H / 2 + dy); c.scale(sc, sc); c.drawImage(img, -W / 2, -H / 2); c.restore(); }
  const KINDS = {
    tilt(c, p, o) { // la caméra continue son mouvement (vers le bas, ou vers le haut) pendant le fondu
      const e = ease(p), d = o.dir || 1, mix_ = sstep(.18, .82, p);
      drawScaled(c, BA, 1, 0, -d * 260 * e, 1); drawScaled(c, BB, 1, 0, d * 260 * (1 - e), mix_);
    },
    dissolve(c, p) { // fondu enchaîné, léger travelling avant
      const e = ease(p), mix_ = sstep(.15, .85, p);
      drawScaled(c, BA, 1 + .05 * e, 0, 0, 1); drawScaled(c, BB, 1.05 - .05 * e, 0, 0, mix_);
    },
    warm(c, p) { // fondu à travers une lumière chaude (sans flash blanc)
      const e = ease(p), mix_ = sstep(.2, .8, p);
      drawScaled(c, BA, 1 + .06 * e, 0, -30 * e, 1); drawScaled(c, BB, 1.06 - .06 * e, 0, 30 * (1 - e), mix_);
      glow(c, W / 2, H * .4, 1100, '#FFE2A8', .28 * Math.sin(p * Math.PI));
    },
    drift(c, p) { // fondu avec un glissement latéral doux
      const e = ease(p), mix_ = sstep(.15, .85, p);
      drawScaled(c, BA, 1, -70 * e, 0, 1); drawScaled(c, BB, 1, 70 * (1 - e), 0, mix_);
    },
  };
  /* ---------- montage ---------- */
  const SCN = [[0, T.s2, scene1], [T.s2, T.s3, scene2], [T.s3, T.s4, scene3], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5], [T.s6, T.q - .1, scene6], [T.q - .1, T.rise, scene7a], [T.rise, DUR + 1, scene7b]];
  const TRS = [
    { at: T.s2, d: 1.1, kind: 'tilt', a: scene1, b: scene2, o: { dir: 1 } },
    { at: T.s3, d: 1.1, kind: 'warm', a: scene2, b: scene3 },
    { at: T.s4, d: 1.0, kind: 'drift', a: scene3, b: scene4 },
    { at: T.s5, d: 1.0, kind: 'dissolve', a: scene4, b: scene5 },
    { at: T.s6, d: 1.0, kind: 'dissolve', a: scene5, b: scene6 },
    { at: T.rise, d: 1.2, kind: 'tilt', a: scene7a, b: scene7b, o: { dir: -1 } },
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
    (function () { const p = prog(t, .2, 1.3, 'outCubic'), o = 1 - prog(t, T.bien - .2, T.bien + .3, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    const q1 = T.s1b - .1;
    wipe(tQa, t, T.personne - .1, q1, .8, .3); fade(tQb, t, T.peut - .05, q1, .45, 14, .3); slam(tQc, t, T.bien - .25, q1, .3);
    // étiquettes au-dessus des passants (elles les suivent)
    const wa = prog(t, T.s1b - .3, T.arretent + .2, 'linear'), kn = prog(t, T.arretent, T.arretent + .6, 'inOutCubic');
    const xa = lerp(lerp(-90, 355, Math.min(1, wa * 1.05)), 350, kn), xb = lerp(lerp(1170, 650, Math.min(1, wa * 1.05)), 655, kn);
    const camz = 1 + prog(t, T.arretent, T.s2, 'inOutSine') * .08, camy = lerp(1000, 1080, prog(t, T.s1b, T.arretent, 'inOutSine')) + prog(t, T.arretent, T.s2, 'inOutSine') * 120;
    const camyC = clamp(camy, 960 / camz - LM, H - 960 / camz + LM), scr = (x, y) => [540 + (x - 540) * camz, 960 + (y - camyC) * camz];
    const pa = scr(xa, GND - 340), pb = scr(xb, GND - 340);
    fade(tLabA, t, T.un - .1, T.geste - .1, .5, 8, .3); fade(tLabB, t, T.non - .15, T.geste - .1, .5, 8, .3);
    tLabA.style.left = (pa[0] - 380) + 'px'; tLabA.style.top = pa[1] + 'px'; tLabB.style.left = (pb[0] - 380) + 'px'; tLabB.style.top = pb[1] + 'px';
    const q2 = T.s2 - .2;
    fade(tM1, t, T.geste - .25, q2, .5, 12, .3); slam(tM2, t, T.moins - .03, q2, .3); fade(tM3, t, T.chez - .05, q2, .5, 10, .3);
    fade(tDeux, t, T.distinguons - .1, T.s3 - .45, .6, 10, .3);
    wipe(tAc1, t, T.accomplir - .05, T.s3 - .45, .7, .3); fade(tAc2, t, T.acte - .1, T.s3 - .45, .5, 10, .3);
    wipe(tEx1, t, T.expliquer - .05, T.s3 - .45, .7, .3); fade(tEx2, t, T.pourquoi - .1, T.s3 - .45, .5, 10, .3);
    fade(tMt, t, T.matthieu - .1, T.s4 - .4, .6, 10, .3); fade(tMtQ1, t, T.jesus - .1, T.s4 - .4, .6, 12, .3); fade(tMtQ2, t, T.jesus + .2, T.s4 - .4, .6, 12, .3); fade(tMtQ3, t, T.comme - .1, T.s4 - .4, .7, 14, .3); fade(tLSG, t, T.comme + .4, T.s4 - .4, .6, 6, .3);
    const sDim = 1 - .7 * prog(t, T.juste4 - .2, T.juste4 + .3, 'linear');
    fade(tSour, t, T.coran - .1, T.s5 - .4, .6, 10, .3); fade(tAr, t, T.coran + .15, T.s5 - .4, .8, 10, .3); fade(tVers, t, T.sourate + .2, T.s5 - .4, .6, 10, .3);
    [tSour, tAr, tVers].forEach(n => { n.style.opacity = (parseFloat(n.style.opacity) * sDim).toFixed(3); });
    slam(tJu, t, T.juste4 - .05, T.s5 - .4, .3); fade(tJu2, t, T.meme - .05, T.s5 - .4, .6, 12, .3);
    const kOut = T.raison5 - .3;
    fade(tKant, t, T.kant - .1, kOut, .7, 12, .3); fade(tKantSub, t, T.kant + .4, kOut, .6, 8, .3); fade(tCred, t, T.kant + .3, kOut, .6, 0, .3);
    fade(tGrund, t, T.raison5, T.s6 - .4, .6, 8, .3); fade(tFond, t, T.raison5 + .25, T.s6 - .4, .6, 8, .3);
    slam(tImp, t, T.devoir - .05, T.s6 - .4, .3); fade(tDev, t, T.impose - .3, T.s6 - .4, .5, 10, .3); fade(tInt, t, T.contre - .05, T.s6 - .4, .6, 12, .3);
    const n6 = T.tranche - .35;
    fade(tNu, t, T.nuance - .15, n6, .6, 10, .3); fade(tN1, t, T.foi6 - .1, n6, .5, 12, .3); slam(tN2, t, T.condition - .05, n6, .3); fade(tN3, t, T.acte6 - .3, n6, .5, 10, .3);
    fade(tFu1, t, T.tranche - .2, T.q - .3, .5, 12, .3); slam(tFu2, t, T.fondement - .05, T.q - .3, .3);
    fade(tLD, t, T.dieu7 - .1, T.rise - .5, .5, 8, .3); fade(tLR, t, T.raison7 - .1, T.rise - .5, .5, 8, .3);
    // la question, mot après mot
    const W_ = T.qWords, outQ = 1 - prog(t, T.rise - .5, T.rise - .1, 'inCubic');
    tQ.forEach(n => { n.style.opacity = outQ > 0 && t > T.q - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const w = W_[+s.dataset.i] || W_[W_.length - 1], p = prog(t, w.start - .04, w.start + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * outQ, blur: (1 - p) * 6 }); }); });
    fade(tDb1, t, T.s7b + .1, T.title - .2, .5, 12, .3); slam(tDb2, t, T.debat - .35, T.title - .2, .3);
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.q], ['s7b', T.rise]].forEach(([n, x]) => sfx('sec_' + n, x));
  sfx('city', 0, { d: T.s2 + .4 }); sfx('rain', 0, { d: T.s2 + .5 }); sfx('slam', T.bien - .25); sfx('cut', T.qEnd1 + .25, { d: T.s1b - T.qEnd1 - .25 });
  for (let k = 0; k < 8; k++) sfx('step', T.s1b + k * .42); sfx('car', T.inconnu, { d: T.arretent - T.inconnu + 1 }); sfx('kneel', T.arretent + .3); sfx('slam', T.moins - .03); sfx('glow', T.geste);
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('line', T.distinguons); sfx('bloom', T.accomplir); sfx('roots', T.expliquer, { d: 1.8 });
  sfx('chime', T.jesus); sfx('mirror', T.comme);
  sfx('balance', T.appelle); sfx('glow', T.juste4);
  sfx('clock', T.s5, { d: T.s6 - T.s5 }); sfx('needle', T.contre); sfx('settle', T.interets + .4);
  sfx('line', T.nuance); sfx('glow', T.condition); sfx('deep', T.tranche, { d: T.q - T.tranche }); sfx('godlight', T.dieu7); sfx('reasonlight', T.raison7);
  sfx('question', T.q); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : la rue, les deux passants, la question
    render(T.geste + .6);
    [tM1, tM2, tM3, tLabA, tLabB].forEach(n => set(n, { o: 0 })); SUBS.style.opacity = 0;
    set(tSeries, { o: 1, blur: 0, s: 1, y: -10 }); [tQa, tQb, tQc].forEach(n => { n.style.clipPath = 'none'; set(n, { o: 1, blur: 0, s: 1 }); });
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
