/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 002 — « Si Dieu est bon, pourquoi les innocents souffrent-ils ? »
   Format de série (voir series/enigme-humaine/FORMAT.md). Minutage piloté par timeline.json.
   Décors nouveaux : la chambre d'enfant, le désert de Job, l'étang des quatre vérités, la colline de Sisyphe.
   Décor réutilisé (variante) : la salle à géométrie (pluie → patience).
   ===================================================================== */
(async function () {
  const { E, prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, makeDust, dust, person, lattice, archPath, star8, rng } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', bord: '#541D2A', night: '#19283C', cold: '#9FC0FF', rose: '#E8949A', lamp: '#F2C27D' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', 'italic 700 40px Fraunces', 'italic 800 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument', '400 40px Amiri'].map(f => document.fonts.load(f, 'Aaé')));
  await document.fonts.load('400 40px Amiri', 'البقرة');

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    enfant: cue('s1a', 'enfant'), mere: cue('s1a', 'mere'), prie: cue('s1a', 'prie'), ciel: cue('s1c', 'ciel'), silence: cue('s1c', 'silencieux'),
    dieu: cue('s1d', 'dieu'), pourquoi: cue('s1d', 'pourquoi'), souffre: cue('s1d', 'souffre'),
    s2: SEN('s2a').start - .8, job: cue('s2a', 'job'), frappe: cue('s2a', 'frappe'), amis: cue('s2b', 'amis'), punition: cue('s2b', 'punition'), refuse: cue('s2c', 'refuse'), souffrir: cue('s2c', 'souffrir'), merite: cue('s2c', 'merite'),
    s3: SEN('s3a').start - .6, coran: cue('s3a', 'coran'), epreuve: cue('s3b', 'epreuve'), peur: cue('s3b', 'peur'), faim: cue('s3b', 'faim'), perte: cue('s3b', 'perte'), patience: cue('s3b', 'patience'),
    s4: SEN('s4a').start - .6, bouddhisme: cue('s4a', 'bouddhisme'), premiere: cue('s4a', 'premiere'), souffrance: cue('s4a', 'souffrance'), origine: cue('s4a', 'origine'), cessation: cue('s4a', 'cessation'),
    s5: SEN('s5a').start - .5, camus: cue('s5a', 'camus'), absurde: cue('s5b', 'absurde'), lucidite: cue('s5b', 'lucidite'), solidarite: cue('s5b', 'solidarite'),
    s6: SEN('s6a').start - .55, traditions: cue('s6a', 'traditions'), reponse: cue('s6a', 'reponse'),
    s7: SEN('s7a').start - .7, urgente: cue('s7a', 'urgente'), q: SEN('s7b').start, qEnd: SEN('s7b').end,
  };
  T.title = T.qEnd + .45; T.qWords = SEN('s7b').words; T.magga = T.cessation + .9;

  /* ---------- texte (DOM) ---------- */
  const tx = (html, cls, style) => el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
  function fit(n, maxW) { const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block'; let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; } n.style.width = w; n.style.display = d; return n; }
  function slam(n, t, t0, t1, out = .3) { const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 }); }
  function wipe(n, t, t0, t1, dur = .7, out = .45) { const p = prog(t, t0, t0 + dur, 'outQuart'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); n.style.clipPath = `inset(-20% ${(100 - p * 100).toFixed(2)}% -20% 0)`; set(n, { x: (1 - p) * 18, o: o * (p > 0 ? 1 : 0) }); }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) { const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 }); }
  const grad = (a, b, c) => `background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(0,0,0,.6))`;

  // ouverture (identité de série)
  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;002</div>`, '', { left: '0', width: '1080px', textAlign: 'center', top: '150px', textShadow: 'none' });
  // S1 — la question
  const tSi = tx('SI DIEU EST BON,', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '330px', fontWeight: 900, fontSize: '104px', letterSpacing: '-.01em' });
  const tPq = fit(tx('POURQUOI L’INNOCENT<br>SOUFFRE-T-IL&#8239;?', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '470px', fontWeight: 900, fontSize: '96px', lineHeight: '1.02', color: C.rose }), 1000);
  fit(tSi, 980);
  // S2 — Job
  const tJob = tx('Le livre de Job', 'fraunces', { left: '86px', top: '176px', fontWeight: 700, fontStyle: 'italic', fontSize: '48px', color: C.rose });
  const tJobRef = tx('Job 2 : 8 · 4 : 7 · 42 : 7', 'fraunces', { left: '88px', top: '240px', fontWeight: 500, fontSize: '28px', letterSpacing: '.08em', color: 'rgba(242,239,232,.8)' });
  const tEqA = fit(tx('SOUFFRANCE', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '350px', fontWeight: 900, fontSize: '100px' }), 960);
  const tEqB = tx('PUNITION', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '566px', fontWeight: 900, fontSize: '100px' });
  const tEqC = tx('souffrir ≠ mériter', 'instrument', { left: '0', width: '1080px', textAlign: 'center', top: '690px', fontStyle: 'italic', fontSize: '76px', color: C.rose });
  // S3 — Coran 2:155
  const tSour = tx('SOURATE AL-BAQARA', 'fraunces', { left: '0', width: '1080px', textAlign: 'center', top: '190px', fontWeight: 600, fontSize: '36px', letterSpacing: '.22em' });
  const tAr = tx('البقرة', 'amiri', { left: '0', width: '1080px', textAlign: 'center', top: '232px', fontSize: '112px', color: C.gold, direction: 'rtl' });
  const tVers = tx('2 : 155', 'fraunces', { left: '0', width: '1080px', textAlign: 'center', top: '416px', fontWeight: 600, fontSize: '34px', letterSpacing: '.2em', color: C.rose });
  const tTrials = [['L’ÉPREUVE.', 120, 490], ['LA PEUR.', 600, 490], ['LA FAIM.', 120, 560], ['LA PERTE.', 600, 560]].map(([w, x, y]) => tx(w, 'bodoni', { left: x + 'px', top: y + 'px', width: '380px', textAlign: x < 300 ? 'right' : 'left', fontWeight: 700, fontSize: '50px' }));
  const tPat = tx(`<span style="display:inline-block;padding:6px .1em 4px;${grad('#FFFFFF', '#F6E3C1', C.gold)}">La patience.</span>`, 'instrument', { left: '0', width: '1080px', textAlign: 'center', top: '624px', fontStyle: 'italic', fontSize: '110px', textShadow: 'none' });
  // S4 — bouddhisme
  const tBud = tx('Le bouddhisme', 'fraunces', { left: '0', width: '1080px', textAlign: 'center', top: '176px', fontWeight: 700, fontStyle: 'italic', fontSize: '48px', color: C.rose });
  const tVer = tx('LES QUATRE NOBLES VÉRITÉS', 'fraunces', { left: '0', width: '1080px', textAlign: 'center', top: '244px', fontWeight: 600, fontSize: '30px', letterSpacing: '.24em' });
  const NOBLE = [['01', 'DUKKHA', 'la souffrance'], ['02', 'SAMUDAYA', 'l’origine'], ['03', 'NIRODHA', 'la cessation'], ['04', 'MAGGA', 'le chemin']];
  const tNob = NOBLE.map(([n, p, f], i) => tx(`<span class="instrument" style="font-style:italic;font-size:40px;color:${C.rose}">${n}</span>&nbsp;&nbsp;<span style="font-weight:800;font-size:44px;letter-spacing:.06em">${p}</span><br><span class="instrument" style="font-style:italic;font-size:46px;color:rgba(242,239,232,.85)">${f}</span>`,
    'fraunces', { left: (i % 2 ? 560 : 100) + 'px', width: '420px', textAlign: i % 2 ? 'left' : 'right', top: (340 + Math.floor(i / 2) * 150) + 'px', lineHeight: '1.08' }));
  // S5 — Camus
  const tCam = tx('Albert Camus', 'fraunces', { left: '86px', top: '176px', fontWeight: 700, fontStyle: 'italic', fontSize: '52px', color: '#8E2F3A', textShadow: '0 0 18px rgba(255,250,240,.8)' });
  const tCamRef = tx('<i>Le Mythe de Sisyphe</i>, 1942 · <i>La Peste</i>, 1947', 'fraunces', { left: '88px', top: '244px', fontWeight: 600, fontSize: '28px', color: '#3a2618', textShadow: '0 0 14px rgba(255,250,240,.9)' });
  const tAbs = tx('L’ABSURDE', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '360px', fontWeight: 900, fontSize: '128px', letterSpacing: '.02em', color: '#2a1810', textShadow: '0 0 30px rgba(255,250,240,.7)' });
  const tLuc = tx(`<span style="display:inline-block;background:linear-gradient(180deg,#3a2a1e,#7a4a20);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 16px rgba(255,250,240,.85))">lucidité</span>`, 'instrument', { left: '120px', top: '530px', fontStyle: 'italic', fontSize: '92px', textShadow: 'none' });
  const tSol = tx(`<span style="display:inline-block;background:linear-gradient(180deg,#5a1a24,#9E3A46);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 16px rgba(255,250,240,.85))">solidarité</span>`, 'instrument', { right: '120px', top: '640px', fontStyle: 'italic', fontSize: '92px', textShadow: 'none', textAlign: 'right' });
  // S6 — nuance
  const tN1 = tx('QUATRE TRADITIONS.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '880px', fontWeight: 700, fontSize: '56px' });
  const tN2 = tx('PAS LA MÊME RÉPONSE.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '978px', fontWeight: 700, fontSize: '56px', color: C.rose });
  // S7 — la question au spectateur
  const QL = [['Quand tu ne peux pas expliquer', 64, 330, C.ivory], ['la souffrance de quelqu’un,', 64, 410, C.ivory], ['peux-tu au moins', 84, 520, C.ivory], ['contribuer à la soulager&#8239;?', 92, 615, C.rose]];
  const tQ = QL.map(([s, fs, y, col]) => tx(s.split(' ').map(w => `<span class="qw" style="display:inline-block;margin:0 .12em">${w}</span>`).join(''), 'instrument', { left: '0', width: '1080px', textAlign: 'center', top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }));
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', { left: '0', width: '1080px', textAlign: 'center', top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose });
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', { left: '0', width: '1080px', textAlign: 'center', top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' });

  /* ---------- sous-titres ---------- */
  const CHUNKS = TL.sentences.flatMap(s => s.chunks);
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.show = Math.min(c.end + .3, nx ? nx.start - .02 : c.end + .6); });
  function subs(t) {
    if (t >= T.q - .1) { SUBS.style.opacity = 0; return; }
    const c = CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
    if (!c) { SUBS.style.opacity = 0; return; }
    if (SUBS.dataset.k !== c.text) { SUBS.textContent = c.text; SUBS.dataset.k = c.text; }
    SUBS.style.opacity = (prog(t, c.start - .03, c.start + .06, 'linear') * (1 - prog(t, c.show - .08, c.show, 'linear'))).toFixed(3);
  }
  const cam = (c, z, fx, fy) => c.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 - fy * z);

  /* =====================================================================
     DÉCOR 1 & 7 — LA CHAMBRE D'ENFANT
     ===================================================================== */
  const stars = (() => { const r = rng(202); return Array.from({ length: 260 }, () => ({ x: r() * W * 1.4 - W * .2, y: -1900 + r() * 2600, s: .5 + r() * 1.8, ph: r() * 6.3, tw: .4 + r() * 1.6 })); })();
  function drawSky(c, t, k = 1) {
    let g = c.createLinearGradient(0, -2000, 0, 900); g.addColorStop(0, '#03040a'); g.addColorStop(.6, '#0a1124'); g.addColorStop(1, '#16203a');
    c.fillStyle = g; c.fillRect(-500, -2400, W + 1000, 3400);
    for (const s of stars) { const a = k * (.35 + .65 * Math.pow(.5 + .5 * Math.sin(t * s.tw + s.ph), 2)); c.fillStyle = rgba('#EEF2FF', a * .9); c.beginPath(); c.arc(s.x, s.y, s.s, 0, 6.283); c.fill(); }
    glow(c, 760, -260, 260, '#DCE6FF', .18 * k);
    c.fillStyle = rgba('#F4F1E6', .85 * k); c.beginPath(); c.arc(760, -260, 34, 0, 6.283); c.fill();
    c.fillStyle = '#0a1124'; c.beginPath(); c.arc(774, -270, 30, 0, 6.283); c.fill(); // croissant
  }
  function kneeling(c, x, y, s, st) { // la mère, à genoux, mains jointes, tête inclinée
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#07070b'; c.strokeStyle = '#07070b'; c.lineCap = 'round'; c.lineJoin = 'round';
    const bow = st.bow || 0, lift = st.lift || 0;
    c.beginPath(); c.moveTo(-40, 0); c.quadraticCurveTo(-48, -42, -18, -52); c.lineTo(46, -52); c.quadraticCurveTo(60, -30, 58, 0); c.closePath(); c.fill(); // jambes repliées
    c.save(); c.translate(-10, -52); c.rotate(-.18 - bow * .22 + lift * .2);
    c.beginPath(); c.moveTo(-22, 0); c.quadraticCurveTo(-30, -60, -14, -96); c.lineTo(16, -100); c.quadraticCurveTo(26, -50, 22, 0); c.closePath(); c.fill(); // buste
    c.save(); c.translate(-2, -112); c.rotate(-.25 - bow * .35 + lift * .3);
    c.beginPath(); c.ellipse(0, 0, 15, 17, 0, 0, 6.283); c.fill();
    c.beginPath(); c.moveTo(8, -12); c.quadraticCurveTo(26, -4, 22, 30); c.quadraticCurveTo(16, 40, 4, 34); c.closePath(); c.fill(); // cheveux
    c.restore();
    const hands = st.hands == null ? 1 : st.hands; // 1 = mains jointes au visage
    c.lineWidth = 10; c.beginPath(); c.moveTo(-10, -86); c.quadraticCurveTo(-34 - 10 * hands, -60, -30 - 6 * hands, -96 * hands - 40 * (1 - hands)); c.stroke();
    c.restore(); c.restore();
  }
  function drawNursery(c, t, st) {
    const warm = st.warm == null ? .6 : st.warm, breath = Math.sin(t * 2.1) * (st.breathAmp == null ? 1 : st.breathAmp);
    // ciel derrière la fenêtre (dessiné en premier : la caméra peut monter dedans)
    c.save(); c.beginPath(); c.rect(300, 230, 480, 660); c.clip(); drawSky(c, t, 1); c.restore();
    if (st.skyOnly) return;
    // mur (papier peint étoilé discret)
    let g = c.createLinearGradient(0, 0, 0, 1480); g.addColorStop(0, mix('#1c1e30', '#3a2c2a', warm * .25)); g.addColorStop(1, mix('#131420', '#2a1f1c', warm * .2));
    c.save(); c.beginPath(); c.rect(-400, -2600, W + 800, 4100); c.rect(300, 230, 480, 660); c.clip('evenodd');
    c.fillStyle = g; c.fillRect(-400, -2600, W + 800, 4100);
    c.fillStyle = rgba('#E8E2F2', .06);
    for (let x = 20; x < W; x += 90) for (let y = 30; y < 1450; y += 110) { const xx = x + ((y / 110) % 2) * 45; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 3 : 8; i ? c.lineTo(xx + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(xx + Math.cos(a) * r, y + Math.sin(a) * r); } c.fill(); }
    c.restore();
    // fenêtre : cadre + rideaux clairs
    c.strokeStyle = '#0d0e16'; c.lineWidth = 18; c.strokeRect(300, 230, 480, 660);
    c.lineWidth = 9; c.beginPath(); c.moveTo(540, 230); c.lineTo(540, 890); c.moveTo(300, 560); c.lineTo(780, 560); c.stroke();
    for (const [x0, dir] of [[226, 1], [774, -1]]) { g = c.createLinearGradient(x0, 0, x0 + 80 * dir, 0); g.addColorStop(0, mix('#3a3550', '#8a7a8a', warm * .3)); g.addColorStop(1, mix('#22202e', '#55485a', warm * .3)); c.fillStyle = g; c.fillRect(Math.min(x0, x0 + 80 * dir), 190, 80, 900); }
    beam(c, 540, 560, 260, 1700, 900, 1760, '#8FA7D8', .12, 30); // clair de lune
    // sol + tapis
    g = c.createLinearGradient(0, 1480, 0, H); g.addColorStop(0, '#221a18'); g.addColorStop(1, '#0a0807'); c.fillStyle = g; c.fillRect(-400, 1480, W + 800, 900);
    c.fillStyle = '#0d0a0a'; c.fillRect(-400, 1474, W + 800, 10);
    c.fillStyle = mix('#2a2340', '#4a3a4a', warm * .3); c.beginPath(); c.ellipse(560, 1740, 520, 120, 0, 0, 6.283); c.fill();
    // table de chevet, veilleuse, ours en peluche
    c.fillStyle = '#0d0b0c'; c.fillRect(860, 1220, 170, 260);
    c.fillStyle = mix('#3a2a1c', '#F6D6A6', .3 + warm * .6); c.beginPath(); c.moveTo(905, 1130); c.lineTo(985, 1130); c.lineTo(1000, 1190); c.lineTo(890, 1190); c.fill();
    c.fillStyle = '#0d0b0c'; c.fillRect(940, 1190, 10, 30);
    glow(c, 945, 1170, 560 * (.6 + warm * .6), C.lamp, .42 * warm + .06);
    c.fillStyle = '#100c0c'; c.beginPath(); c.arc(1010, 1196, 16, 0, 6.283); c.arc(1010, 1170, 11, 0, 6.283); c.arc(1001, 1161, 5, 0, 6.283); c.arc(1019, 1161, 5, 0, 6.283); c.fill();
    // lit d'enfant
    c.fillStyle = '#0f0d14'; c.fillRect(110, 1150, 40, 330); c.fillRect(800, 1250, 30, 230);
    c.fillStyle = mix('#2c2a3e', '#6a5a62', warm * .35); c.fillRect(140, 1300, 680, 70); // matelas
    // l'enfant : tête sur l'oreiller, couverture qui se soulève au rythme du souffle
    c.fillStyle = mix('#3d3a52', '#8b7b84', warm * .35); c.beginPath(); c.ellipse(240, 1278, 70, 26, 0, 0, 6.283); c.fill(); // oreiller
    c.fillStyle = '#0a090e'; c.beginPath(); c.arc(258, 1258, 30, 0, 6.283); c.fill(); // tête
    c.beginPath(); c.arc(246, 1240, 30, Math.PI, 2 * Math.PI); c.fill();
    g = c.createLinearGradient(0, 1240, 0, 1340); g.addColorStop(0, mix('#4a4566', '#B7A39A', warm * .45)); g.addColorStop(1, mix('#2a2740', '#6a5a58', warm * .4));
    c.fillStyle = g; c.beginPath(); c.moveTo(286, 1300); c.quadraticCurveTo(420, 1236 - breath * 4, 560, 1262 - breath * 2); c.quadraticCurveTo(700, 1270, 810, 1290); c.lineTo(810, 1330); c.lineTo(286, 1330); c.closePath(); c.fill();
    c.fillStyle = '#0a090e'; c.beginPath(); c.ellipse(330, 1286 - breath * 2, 14, 9, -.3, 0, 6.283); c.fill(); // petite main
    if (st.fever > 0) glow(c, 258, 1258, 90, '#C8505A', .2 * st.fever);
    // la mère
    kneeling(c, 470, 1478, 2.05, st.mother || {});
    // le personnage de la série (scène 7)
    if (st.man) person(c, st.man, { rim: C.lamp, rimA: .75, rimDx: 1, body: '#08080c' });
    dust(c, nurseryDust, t, [0, 200, W, 1300], '#E8E2F2', .2, (x, y) => (x > 300 && x < 800) ? .7 : .2);
  }
  const nurseryDust = makeDust(60, 77, [0, 200, W, 1300]);

  function scene1(c, t) {
    const up = prog(t, T.ciel - .3, T.silence + .9, 'inOutSine');       // la caméra monte vers le ciel
    const z = lerp(1.18, 1.05, prog(t, 0, T.ciel, 'inOutSine')) + up * .55;
    const fy = lerp(1210, 1260, prog(t, 0, T.ciel, 'linear')) - up * 1350, fx = lerp(500, 540, up);
    cam(c, z, fx, fy);
    const pray = prog(t, T.mere - .2, T.prie + .4, 'inOutCubic');
    drawNursery(c, t, { warm: .55, fever: prog(t, T.enfant, T.enfant + 1, 'outCubic') * (1 - up), mother: { hands: lerp(.3, 1, pray), bow: pray } });
    c.setTransform(1, 0, 0, 1, 0, 0);
    const cut = prog(t, T.souffre - .02, T.souffre + .05, 'linear');
    if (cut > 0) { c.fillStyle = rgba('#000', .35 * cut); c.fillRect(0, 0, W, H); }
    vignette(c, .5, '#02030a');
    const fo = prog(t, T.s2 + .3, T.s2 + .75, 'inCubic'); // les étoiles deviennent le sable
    if (fo > 0) { c.fillStyle = rgba('#B9774A', fo); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 2 — LE DÉSERT, LE TAS DE CENDRE (Job)
     ===================================================================== */
  const ash = makeDust(160, 23, [0, 700, W, 1200]);
  function robe(c, x, y, s, point, f = -1) { // un ami de Job : silhouette en robe, voile
    c.save(); c.translate(x, y); c.scale(s * f, s);
    c.fillStyle = '#120b0a';
    c.beginPath(); c.moveTo(-34, 0); c.quadraticCurveTo(-30, -90, -18, -150); c.lineTo(18, -150); c.quadraticCurveTo(32, -90, 36, 0); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(0, -166, 15, 18, 0, 0, 6.283); c.fill();
    c.beginPath(); c.moveTo(-17, -176); c.quadraticCurveTo(0, -196, 17, -176); c.lineTo(22, -130); c.lineTo(-22, -130); c.closePath(); c.fill(); // voile
    c.strokeStyle = '#120b0a'; c.lineWidth = 9; c.lineCap = 'round';
    c.beginPath(); c.moveTo(10, -138); c.lineTo(10 + 46 * point, -118 - 26 * point); c.lineTo(14 + 80 * point, -128 - 30 * point); c.stroke(); // bras qui accuse
    c.restore();
  }
  function seated(c, x, y, s) { // Job, assis sur la cendre, tête dans les mains
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#0c0807'; c.strokeStyle = '#0c0807'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-40, 0); c.quadraticCurveTo(-46, -50, -20, -92); c.quadraticCurveTo(10, -104, 26, -80); c.lineTo(36, -40); c.lineTo(60, -44); c.lineTo(70, 0); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(30, -96, 15, 17, .5, 0, 6.283); c.fill();
    c.lineWidth = 10; c.beginPath(); c.moveTo(0, -84); c.quadraticCurveTo(30, -60, 34, -86); c.stroke();
    c.restore();
  }
  function drawDesert(c, t, st) {
    const camX = st.camX || 0;
    let g = c.createLinearGradient(0, -200, 0, 1250); g.addColorStop(0, '#1d0d12'); g.addColorStop(.45, '#5a2328'); g.addColorStop(.8, '#B9774A'); g.addColorStop(1, '#E3A869');
    c.fillStyle = g; c.fillRect(-400, -400, W + 800, 1700);
    glow(c, 300 + camX * .2, 1120, 700, '#F6C27A', .5); c.fillStyle = rgba('#FFE2B0', .8); c.beginPath(); c.arc(300 + camX * .2, 1160, 120, Math.PI, 2 * Math.PI); c.fill();
    const dune = (y0, amp, col, par, seed) => { c.fillStyle = col; c.beginPath(); c.moveTo(-400, H); for (let x = -400; x <= W + 400; x += 40) c.lineTo(x + camX * par, y0 + Math.sin(x * .004 + seed) * amp + Math.sin(x * .011 + seed * 2) * amp * .4); c.lineTo(W + 400, H); c.fill(); };
    dune(1180, 40, '#6b3324', .3, 1); dune(1290, 50, '#3f1d17', .6, 2.3); dune(1440, 36, '#20100d', 1, 4.1);
    // le tas de cendre
    c.fillStyle = '#3a3532'; c.beginPath(); c.ellipse(380 + camX, 1500, 300, 70, 0, Math.PI, 2 * Math.PI); c.fill();
    c.fillStyle = '#4a4440'; c.beginPath(); c.ellipse(380 + camX, 1500, 220, 46, 0, Math.PI, 2 * Math.PI); c.fill();
    seated(c, 360 + camX, 1462, 2.2);
    // les trois amis
    const pt = st.point || 0;
    robe(c, 690 + camX * 1.1, 1520, 2.3, pt, -1); robe(c, 850 + camX * 1.2, 1560, 2.6, pt * .6, -1); robe(c, 990 + camX * 1.3, 1540, 2.4, pt * .3, -1);
    dust(c, ash, t, [0, 700, W, 1200], '#D9C9B6', .35, (x, y) => y > 900 ? 1 : .4);
    // l'équation qui se brise (dessinée à la main dans le ciel)
    const eq = st.eq || 0, br = st.broken || 0;
    if (eq > 0 && st.screenEq) {
      c.save(); c.globalAlpha = eq; c.strokeStyle = C.ivory; c.lineWidth = 9; c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 16;
      c.beginPath(); c.moveTo(470, 500); c.lineTo(610, 500); c.moveTo(470, 534); c.lineTo(610, 534); c.stroke();
      if (br > 0) { c.strokeStyle = C.rose; c.lineWidth = 11; c.beginPath(); c.moveTo(498, 580); c.lineTo(lerp(498, 582, br), lerp(580, 452, br)); c.stroke(); }
      c.restore();
    }
  }
  function scene2(c, t) {
    const camX = lerp(60, -60, prog(t, T.s2, T.s3 + .6, 'inOutSine'));
    const z = lerp(1.25, 1.0, prog(t, T.s2, T.s2 + 2.4, 'outCubic')) + prog(t, T.amis, T.punition + .6, 'inOutCubic') * .06;
    cam(c, z, 540, 1000);
    const eqS = { eq: prog(t, T.punition + .1, T.punition + .5, 'outCubic') * (1 - prog(t, T.s3 - .5, T.s3, 'inCubic')), broken: prog(t, T.refuse, T.refuse + .45, 'outCubic'), screenEq: true };
    drawDesert(c, t, { camX, point: prog(t, T.amis + .1, T.punition + .2, 'outBack') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    (function (c) { const eq = eqS.eq, br = eqS.broken; if (eq <= 0) return;
      c.save(); c.globalAlpha = eq; c.strokeStyle = C.ivory; c.lineWidth = 9; c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 16;
      c.beginPath(); c.moveTo(470, 500); c.lineTo(610, 500); c.moveTo(470, 534); c.lineTo(610, 534); c.stroke();
      if (br > 0) { c.strokeStyle = C.rose; c.lineWidth = 11; c.beginPath(); c.moveTo(498, 580); c.lineTo(lerp(498, 582, br), lerp(580, 452, br)); c.stroke(); }
      c.restore(); })(c);
    vignette(c, .5, '#0a0303');
    const fl = 1 - prog(t, T.s2 + .75, T.s2 + 1.3, 'outCubic'); if (fl > 0) { c.fillStyle = rgba('#B9774A', fl); c.fillRect(0, 0, W, H); }
    const fo = prog(t, T.s3 - .45, T.s3, 'inCubic'); if (fo > 0) { c.fillStyle = rgba('#0b1a22', fo); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 3 — LA SALLE À GÉOMÉTRIE (variante : la pluie, puis la patience)
     ===================================================================== */
  const AW = { x: 540, base: 1430, w: 640, h: 700 };
  const latC = CINE.off(AW.w, AW.h), latX = latC.getContext('2d');
  (function () { latX.fillStyle = '#081217'; latX.fillRect(0, 0, AW.w, AW.h); latX.globalCompositeOperation = 'destination-out'; const L = 64;
    for (let j = 0; j * L < AW.h + L; j++) for (let i = 0; i * L < AW.w + L; i++) { const cx = i * L + (AW.w % L) / 2, cy = j * L; star8(latX, cx, cy, L * .3, L * .16); latX.fill(); latX.beginPath(); latX.rect(cx + L * .36, cy - 3, L * .28, 6); latX.rect(cx - 3, cy + L * .36, 6, L * .28); latX.fill(); }
    latX.globalCompositeOperation = 'source-over'; })();
  const rain = (() => { const r = rng(9); return Array.from({ length: 140 }, () => ({ x: r() * AW.w, y: r() * AW.h, v: 900 + r() * 500, l: 18 + r() * 26 })); })();
  const islDust = makeDust(120, 44, [0, 300, W, 1500]);
  function drawHall(c, t, st) {
    const L = st.light, R = st.rain || 0;
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#04090c', '#123039', .3 + L * .3)); g.addColorStop(1, mix('#020405', '#1a1712', L * .6));
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, H + 600);
    for (const [x, s] of [[110, .62], [970, .62], [-60, .9], [1140, .9]]) { c.save(); archPath(c, x, 1500, 420 * s, 1250 * s, true); c.fillStyle = mix('#03070a', '#2a2418', L * .35); c.fill(); c.strokeStyle = rgba(C.gold, .1 + L * .25); c.lineWidth = 2; c.stroke(); c.restore(); }
    c.save(); archPath(c, AW.x, AW.base, AW.w, AW.h, true); c.clip();
    g = c.createLinearGradient(0, AW.base - AW.h, 0, AW.base); g.addColorStop(0, mix('#0b1a20', '#E9C98E', L * .55)); g.addColorStop(1, mix('#10242b', '#F6E3B6', L * .9));
    c.fillStyle = g; c.fillRect(AW.x - AW.w, AW.base - AW.h, AW.w * 2, AW.h);
    if (R > 0) { c.save(); c.strokeStyle = rgba('#BFD8E8', .35 * R); c.lineWidth = 2; for (const d of rain) { const y = ((d.y + d.v * t) % (AW.h + 60)) - 30; const x = AW.x - AW.w / 2 + ((d.x + y * .25) % AW.w); c.beginPath(); c.moveTo(x, AW.base - AW.h + y); c.lineTo(x - d.l * .25, AW.base - AW.h + y + d.l); c.stroke(); } c.restore(); }
    if (st.flash > 0) { c.fillStyle = rgba('#DDEBFF', st.flash * .5); c.fillRect(AW.x - AW.w, AW.base - AW.h, AW.w * 2, AW.h); }
    glow(c, AW.x, AW.base - AW.h * .45, 420, '#FFE6B0', L * .6);
    c.drawImage(latC, AW.x - AW.w / 2, AW.base - AW.h);
    lattice(c, AW.x - AW.w / 2 + (AW.w % 64) / 2, AW.base - AW.h, AW.w, AW.h, 64, mix('#2d3d40', '#F3D9A0', st.gold || 0), 1.4, .3 + (st.gold || 0) * .6);
    c.restore();
    c.save(); c.strokeStyle = mix('#2a3a3c', C.gold, .3 + L * .6); c.lineWidth = 10; archPath(c, AW.x, AW.base, AW.w, AW.h, true); c.stroke(); c.restore();
    g = c.createLinearGradient(0, AW.base, 0, H); g.addColorStop(0, mix('#04080a', '#2a2418', L * .5)); g.addColorStop(1, '#020304'); c.fillStyle = g; c.fillRect(-300, AW.base, W + 600, H);
    // petite lampe dans une niche : la flamme reste stable (la patience)
    const lx = 540, ly = 1560; c.fillStyle = '#0a0b0c'; c.fillRect(lx - 50, ly, 100, 14);
    const fl = st.flame == null ? .3 : st.flame, wob = (1 - (st.calm || 0)) * Math.sin(t * 13) * 4;
    c.fillStyle = rgba('#FFE0A0', .4 + fl * .6); c.beginPath(); c.ellipse(lx + wob, ly - 20, 9, 22 + fl * 8, wob * .03, 0, 6.283); c.fill();
    glow(c, lx, ly - 24, 380 * (.5 + fl), '#F6C27A', .25 + fl * .45);
    dust(c, islDust, t, [0, 300, W, 1500], '#FFEFC8', .12 + L * .5, (x) => clamp(1 - Math.abs(x - AW.x) / 520));
  }
  function scene3(c, t) {
    const z = lerp(1.15, 1.0, prog(t, T.s3, T.s4, 'inOutSine'));
    cam(c, z, 540, 1040);
    const words = [T.epreuve, T.peur, T.faim, T.perte];
    const flash = Math.max(...words.map(w => Math.max(0, 1 - Math.abs(t - w - .05) * 8)));
    const calm = prog(t, T.patience - .1, T.patience + 1, 'inOutCubic');
    drawHall(c, t, { light: lerp(.12, .2, prog(t, T.s3, T.perte, 'linear')) + calm * .65, rain: 1 - calm, flash, flame: .25 + calm * .75, calm, gold: calm });
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .5, '#010304');
    const fl = 1 - prog(t, T.s3, T.s3 + .6, 'outCubic'); if (fl > 0) { c.fillStyle = rgba('#0b1a22', fl); c.fillRect(0, 0, W, H); }
    const fo = prog(t, T.s4 - .45, T.s4, 'inCubic'); if (fo > 0) { c.fillStyle = rgba('#E9D8C0', fo * .9); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 4 — L'ÉTANG AU CRÉPUSCULE (les quatre nobles vérités)
     ===================================================================== */
  const ripplesAt = [[300, 1330, 1], [760, 1380, 1.1], [420, 1560, 1.3], [800, 1650, 1.45]];
  function drawPond(c, t, st) {
    let g = c.createLinearGradient(0, 0, 0, 1180); g.addColorStop(0, '#1a1c34'); g.addColorStop(.55, '#5a4a66'); g.addColorStop(.85, '#D9A07A'); g.addColorStop(1, '#F0C79A');
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, 1500);
    const mtn = (y0, amp, col, par, seed) => { c.fillStyle = col; c.beginPath(); c.moveTo(-300, 1200); for (let x = -300; x <= W + 300; x += 30) c.lineTo(x + (st.cam || 0) * par, y0 - Math.abs(Math.sin(x * .003 + seed)) * amp - Math.sin(x * .013 + seed) * amp * .2); c.lineTo(W + 300, 1200); c.fill(); };
    mtn(1060, 260, '#6a5470', .2, 1); mtn(1120, 180, '#3c3150', .45, 2.2); mtn(1180, 90, '#221d33', .8, 3.7);
    glow(c, 540, 1150, 520, '#FFD9A8', .4);
    // eau
    g = c.createLinearGradient(0, 1180, 0, H); g.addColorStop(0, '#E9B78E'); g.addColorStop(.15, '#6a5470'); g.addColorStop(1, '#0d0e1c');
    c.fillStyle = g; c.fillRect(-300, 1180, W + 600, H);
    c.strokeStyle = rgba('#FFE7C8', .12); c.lineWidth = 2;
    for (let k = 0; k < 14; k++) { const y = 1190 + k * k * 4.5, w = 420 - k * 22; c.beginPath(); c.moveTo(540 - w + Math.sin(t + k) * 10, y); c.lineTo(540 + w + Math.sin(t + k) * 10, y); c.stroke(); }
    // brume
    for (let k = 0; k < 3; k++) { c.save(); c.globalAlpha = .12; c.filter = 'blur(30px)'; c.fillStyle = '#F2E6E0'; c.fillRect(-300 + ((t * 18 * (k + 1)) % 600) - 300, 1120 + k * 60, W + 600, 50); c.restore(); }
    // les rides : une par vérité
    ripplesAt.forEach(([x, y, s], i) => {
      const a = st.rip[i] || 0; if (a <= 0) return;
      for (let k = 0; k < 4; k++) {
        const ph = ((t - (st.ripT[i] || 0)) * .35 + k * .25) % 1;
        c.strokeStyle = rgba(i === 3 ? '#F6E3C1' : '#FFF4EA', a * (1 - ph) * .65); c.lineWidth = 2.4 * s;
        c.beginPath(); c.ellipse(x, y, (30 + ph * 190) * s, (8 + ph * 46) * s, 0, 0, 6.283); c.stroke();
      }
      glow(c, x, y, 60 * s, '#FFF1DE', a * .55);
    });
    // ponton et silhouette (le personnage de la série, de dos à l'eau)
    c.fillStyle = '#0d0b10'; c.fillRect(-60, 1300, 290, 18); for (const x of [10, 110, 200]) c.fillRect(x, 1318, 10, 120);
    person(c, { x: 150, y: 1300, s: 1.5, f: 1, head: .15 }, { rim: '#F0C79A', rimA: .7, rimDx: 1, body: '#0b0a10' });
  }
  function scene4(c, t) {
    const camX = lerp(30, -30, prog(t, T.s4, T.s5, 'inOutSine'));
    const z = lerp(1.12, 1.0, prog(t, T.s4, T.s5, 'inOutSine'));
    cam(c, z, 540 + camX * .3, 1000);
    const rip = [T.souffrance, T.origine, T.cessation, T.magga].map(x => prog(t, x - .1, x + .6, 'outCubic'));
    drawPond(c, t, { cam: camX, rip, ripT: [T.souffrance, T.origine, T.cessation, T.magga] });
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .45, '#0a0710');
    const fl = 1 - prog(t, T.s4, T.s4 + .6, 'outCubic'); if (fl > 0) { c.fillStyle = rgba('#E9D8C0', fl * .9); c.fillRect(0, 0, W, H); }
    const fo = prog(t, T.s5 - .4, T.s5, 'inCubic'); if (fo > 0) { c.fillStyle = rgba('#FFFBF0', fo); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 5 — LA COLLINE SOUS LE SOLEIL (Camus, Sisyphe, la solidarité)
     ===================================================================== */
  function drawHill(c, t, st) {
    let g = c.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, '#9FB6C8'); g.addColorStop(.6, '#E9E2D2'); g.addColorStop(1, '#F6EEDD');
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, H + 600);
    const sun = st.sun || 0; glow(c, 860, 320, 520 + sun * 260, '#FFFFFF', .7 + sun * .3); c.fillStyle = '#FFFDF6'; c.beginPath(); c.arc(860, 320, 90 + sun * 10, 0, 6.283); c.fill();
    if (sun > 0) { c.save(); c.globalAlpha = sun * .5; c.strokeStyle = '#FFFFFF'; c.lineWidth = 3; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + t * .1; c.beginPath(); c.moveTo(860 + Math.cos(a) * 120, 320 + Math.sin(a) * 120); c.lineTo(860 + Math.cos(a) * (200 + sun * 120), 320 + Math.sin(a) * (200 + sun * 120)); c.stroke(); } c.restore(); }
    c.fillStyle = '#d9c3a0'; c.beginPath(); c.moveTo(-300, 1500); c.quadraticCurveTo(500, 1300, 1400, 760); c.lineTo(1400, H); c.lineTo(-300, H); c.fill(); // colline lointaine
    c.fillStyle = '#B88E5E'; c.beginPath(); c.moveTo(-300, 1800); c.lineTo(1400, 900); c.lineTo(1400, H); c.lineTo(-300, H); c.fill();  // pente
    const slope = x => 1800 - (x + 300) * (900 / 1700);
    // le rocher et Sisyphe (puis d'autres qui viennent l'aider)
    const bx = st.bx, by = slope(bx) - 95;
    c.save(); c.translate(bx, by); c.rotate(bx * .01); c.fillStyle = '#5a4a3a'; c.beginPath(); c.ellipse(0, 0, 100, 92, 0, 0, 6.283); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.arc(-20, -10, 40, .5, 2.4); c.stroke(); c.restore();
    const pushers = st.helpers || 0;
    for (let k = 0; k <= 3; k++) {
      const a = k === 0 ? 1 : clamp(pushers * 3 - (k - 1)); if (a <= 0) continue;
      const px = bx - 150 - k * 120, py = slope(px) + 4;
      c.save(); c.globalAlpha = a; c.translate(px, py); c.rotate(-.42); c.translate(-px, -py);
      person(c, { x: px, y: py, s: 2.3 - k * .08, f: 1, walk: t * 4.2 + k, phone: 0, hand: [px + 70, py - 230] }, { rim: '#FFF6E2', rimA: .8, rimDx: 1, body: '#1a120c', alpha: a });
      c.restore();
    }
  }
  function scene5(c, t) {
    const z = lerp(1.1, 1.0, prog(t, T.s5, T.s6, 'inOutSine'));
    cam(c, z, 540, 980);
    drawHill(c, t, { bx: lerp(300, 520, prog(t, T.s5, T.s6 + .4, 'linear')), sun: prog(t, T.lucidite - .1, T.lucidite + .6, 'outCubic'), helpers: prog(t, T.solidarite - .1, T.solidarite + 1.2, 'linear') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .3, '#2a1a0c');
    const fl = 1 - prog(t, T.s5, T.s5 + .6, 'outCubic'); if (fl > 0) { c.fillStyle = rgba('#FFFBF0', fl); c.fillRect(0, 0, W, H); }
  }

  /* ---------- Scène 6 : la nuance (quatre plans distincts) ---------- */
  function scene6(c, t) {
    c.fillStyle = '#060607'; c.fillRect(0, 0, W, H);
    const open = prog(t, T.s6, T.s6 + .8, 'outExpo'), gap = 10;
    const panels = [[0, 0, (cc) => drawDesert(cc, t, { camX: 0, eq: 0 })], [1, 0, (cc) => drawHall(cc, t, { light: .8, gold: .8, flame: 1, calm: 1, rain: 0 })], [0, 1, (cc) => drawPond(cc, t, { rip: [1, 1, 1, 1], ripT: [0, .7, 1.4, 2.1] })], [1, 1, (cc) => drawHill(cc, t, { bx: 520, sun: 1, helpers: 1 })]];
    panels.forEach(([i, j, fn], k) => {
      const x = i * W / 2, y = j * H / 2, a = prog(t, T.s6 + k * .12, T.s6 + .6 + k * .12, 'outCubic');
      c.save(); c.globalAlpha = a; c.beginPath(); c.rect(x + gap / 2, y + gap / 2, W / 2 - gap, H / 2 - gap); c.clip();
      c.setTransform(.5, 0, 0, .5, x, y); fn(c); c.restore();
    });
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.save(); c.shadowColor = '#F6E7C1'; c.shadowBlur = 24; c.fillStyle = rgba('#F6E7C1', .95);
    c.fillRect(W / 2 - 1.5, H / 2 - H / 2 * open, 3, H * open); c.fillRect(W / 2 - W / 2 * open, H / 2 - 1.5, W * open, 3); c.restore();
    c.fillStyle = rgba('#060607', .55 * prog(t, T.traditions, T.traditions + .5, 'linear')); c.fillRect(0, 850, W, 230);
    vignette(c, .45);
    const fo = prog(t, T.s7 - .45, T.s7, 'inCubic'); if (fo > 0) { c.fillStyle = rgba('#03040a', fo); c.fillRect(0, 0, W, H); }
  }

  /* ---------- Scène 7 : la solution évoquée ---------- */
  function scene7(c, t) {
    const down = 1 - prog(t, T.s7, T.s7 + 2.4, 'inOutSine'); // on redescend du ciel vers la chambre
    const dive = prog(t, T.qEnd - .3, T.title + .3, 'inOutCubic');
    const z = 1.08 + down * .5 - dive * .02;
    cam(c, z, 540, 1240 - down * 1350 - dive * 260);
    // quelqu'un entre, pose la main sur l'épaule de la mère ; la lumière se réchauffe
    const enter = prog(t, T.urgente - .2, T.q + .8, 'inOutCubic');
    const rest = prog(t, T.q + .8, T.q + 1.6, 'inOutCubic');
    const mx = lerp(1180, 720, enter);
    const man = { x: mx, y: 1478, s: 3.2, f: -1, walk: enter < 1 ? t * 6 : null, hand: rest > 0 ? [lerp(mx - 60, 548, rest), lerp(1478 - 300, 1300, rest)] : null, head: .12 * rest };
    const warm = .55 + .45 * prog(t, T.q + 1, T.qEnd, 'inOutSine');
    drawNursery(c, t, { warm, man, breathAmp: 1 - .5 * warm, mother: { hands: lerp(1, .4, rest), bow: lerp(1, .3, prog(t, T.q + 2.5, T.qEnd, 'inOutSine')), lift: prog(t, T.q + 2.5, T.qEnd, 'inOutSine') } });
    c.setTransform(1, 0, 0, 1, 0, 0);
    glow(c, W * .5, H * .62, 900, C.lamp, .12 * prog(t, T.q + 1, T.qEnd, 'linear'));
    c.fillStyle = rgba('#05060a', .5 * prog(t, T.qEnd, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .5);
    const fl = 1 - prog(t, T.s7, T.s7 + .6, 'outCubic'); if (fl > 0) { c.fillStyle = rgba('#03040a', fl); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     MONTAGE
     ===================================================================== */
  const scenes = [[0, T.s2 + .75, scene1], [T.s2 + .75, T.s3, scene2], [T.s3, T.s4, scene3], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5], [T.s6, T.s7, scene6], [T.s7, DUR + 1, scene7]];
  function render(t) {
    const f = Math.round(t * 30);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    const sc = scenes.filter(([a, b]) => t >= a && t < b).pop() || scenes[scenes.length - 1];
    sc[2](ctx, t);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    grain(ctx, f, .08);
    texts(t); subs(t);
  }
  function texts(t) {
    (function () { const p = prog(t, .15, 1.3, 'outCubic'), o = 1 - prog(t, T.mere - .3, T.mere + .2, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    slam(tSi, t, T.dieu - .05, T.s2 + .2, .3);
    slam(tPq, t, T.pourquoi, T.s2 + .2, .3);
    wipe(tJob, t, T.job, T.s3 - .3, .7, .3); fade(tJobRef, t, T.job + .4, T.s3 - .3, .6, 0, .3);
    slam(tEqA, t, T.punition, T.s3 - .5, .3); slam(tEqB, t, T.punition + .25, T.s3 - .5, .3);
    if (t > T.refuse) tEqB.style.opacity = (parseFloat(tEqB.style.opacity) * (1 - .6 * prog(t, T.refuse, T.refuse + .4, 'linear'))).toFixed(3);
    fade(tEqC, t, T.souffrir, T.s3 - .5, .6, 14, .3);
    fade(tSour, t, T.coran, T.s4 - .2, .6, 10, .3); fade(tAr, t, T.coran + .25, T.s4 - .2, .8, 10, .3); fade(tVers, t, T.coran + .5, T.s4 - .2, .6, 10, .3);
    [T.epreuve, T.peur, T.faim, T.perte].forEach((t0, i) => { fade(tTrials[i], t, t0 - .03, T.s4 - .2, .35, 12, .3); if (t > T.patience) tTrials[i].style.opacity = (parseFloat(tTrials[i].style.opacity) * (1 - .55 * prog(t, T.patience, T.patience + .5, 'linear'))).toFixed(3); });
    fade(tPat, t, T.patience - .05, T.s4 - .2, .8, 18, .3);
    fade(tBud, t, T.bouddhisme, T.s5 - .2, .6, 10, .3); fade(tVer, t, T.premiere, T.s5 - .2, .6, 10, .3);
    [T.souffrance, T.origine, T.cessation, T.magga].forEach((t0, i) => fade(tNob[i], t, t0 - .05, T.s5 - .2, .5, 14, .3));
    wipe(tCam, t, T.camus - .15, T.s6 - .2, .7, .3); fade(tCamRef, t, T.camus + .3, T.s6 - .2, .6, 0, .3);
    slam(tAbs, t, T.absurde, T.s6 - .2, .3);
    if (t > T.lucidite) tAbs.style.opacity = (parseFloat(tAbs.style.opacity) * (1 - .5 * prog(t, T.lucidite, T.lucidite + .4, 'linear'))).toFixed(3);
    fade(tLuc, t, T.lucidite - .05, T.s6 - .2, .6, 14, .3); fade(tSol, t, T.solidarite - .05, T.s6 - .2, .6, 14, .3);
    wipe(tN1, t, T.traditions, T.s7 - .2, .8, .3); wipe(tN2, t, T.reponse - .1, T.s7 - .2, .8, .3);
    // la question, mot après mot
    const W_ = T.qWords, out = 1 - prog(t, T.title - .25, T.title + .15, 'inCubic');
    const spans = tQ.flatMap(n => [...n.querySelectorAll('.qw')]);
    const order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 18]; // index des mots reconnus (« quelqu’un » et « peux-tu » comptent pour 2)
    spans.forEach((n, i) => { const st = W_[order[i]] ? W_[order[i]].start : W_[W_.length - 1].start; const p = prog(t, st - .04, st + .35, 'outCubic'); set(n, { y: (1 - p) * 16, o: p * out, blur: (1 - p) * 6 }); });
    tQ.forEach(n => { n.style.opacity = out > 0 ? 1 : 0; });
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores ---------- */
  sfx('breath', T.enfant); sfx('silence', T.silence - .2, { d: T.dieu - T.silence });
  sfx('slam', T.dieu - .05); sfx('slam', T.pourquoi); sfx('cut', T.souffre + .45, { d: T.s2 + .6 - T.souffre - .45 });
  sfx('dive', T.s2 + .3, { d: .9 }); sfx('wind', T.s2 + .5, { d: T.s3 - T.s2 }); sfx('swell_good', T.punition); sfx('crack', T.refuse);
  sfx('light', T.s3 + .1); sfx('rain', T.s3, { d: T.patience - T.s3 }); [T.epreuve, T.peur, T.faim, T.perte].forEach(x => sfx('thunder', x)); sfx('purify', T.patience);
  sfx('open', T.s4); [T.souffrance, T.origine, T.cessation, T.magga].forEach(x => sfx('bowl', x));
  sfx('city', T.s5); sfx('pulse_hot', T.absurde); sfx('sunburst', T.lucidite); sfx('swell_bad', T.solidarite);
  sfx('split', T.s6); sfx('line', T.s6 + .2);
  sfx('phone_in', T.s7); for (let k = 0; k < 5; k++) sfx('step', T.urgente - .1 + k * .45);
  sfx('question', T.q); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : la chambre, la mère qui prie, la question
    render(T.prie + .4);
    set(tSeries, { o: 1, blur: 0, s: 1 }); set(tSi, { o: 1, blur: 0, s: 1 }); set(tPq, { o: 1, blur: 0, s: 1 }); SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
