/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode pilote 001 — « Tu sais. Tu recommences. Pourquoi ? »
   Documentaire graphique, 1080×1920, 30 i/s. Tout le minutage vient de timeline.json
   (narration synthétisée + horodatage mot à mot) : chaque image est calée sur la voix.
   ===================================================================== */
(async function () {
  const { E, prog, tw, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, makeDust, dust, person, lattice, archPath, bust, makeBrain, star8, rng } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', bord: '#541D2A', night: '#19283C', cold: '#9FC0FF' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '800 40px Inter', '500 40px Inter', '400 20px Plex', '500 20px Plex',
    '500 40px Garamond', '400 40px Amiri', '600 40px Caveat'].map(f => document.fonts.load(f, 'AΑاé')));
  await document.fonts.load('500 40px Garamond', 'ΑΚΡΑΣΙΑ');
  await document.fonts.load('400 40px Amiri', 'الشمس');

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères temporels (tous dérivés de la voix) ---------- */
  const T = {
    phone: 0.85,
    lapse0: cue('s1b', 'lendemain') - 0.15, lapse1: cue('s1b', 'trahis') + 0.1,
    sais: cue('s1c', 'savais'), recom: cue('s1c', 'recommencerais'), why: cue('s1d', 'pourquoi'),
    s2: SEN('s2a').start - 0.8, romains: cue('s2a', 'romains'), conflit: cue('s2a', 'conflit'), bien: cue('s2a', 'vouloir'), desap: cue('s2a', 'mais'),
    s3: SEN('s3a').start - 0.6, coran: cue('s3a', 'coran'), ame: cue('s3a', 'ame'), disc: cue('s3a', 'discernement'), mal: cue('s3a', 'mal'), piete: cue('s3a', 'piete'), purif: cue('s3a', 'purification'),
    s4: SEN('s4a').start - 0.5, textes: cue('s4a', 'textes'), lutte: cue('s4b', 'lutte'), prennent: cue('s4b', 'prennent'),
    s5: SEN('s5a').start - 0.55, aristote: cue('s5a', 'aristote'), akrasia: cue('s5a', 'akrassia'), contre: cue('s5a', 'contre'), desir: cue('s5a', 'desir'), emotion: cue('s5a', 'emotion'),
    s6: SEN('s6a').start - 0.55, lieu: cue('s6a', 'lieu'), heure: cue('s6a', 'heure'), decl: cue('s6a', 'declencheur'), react: cue('s6a', 'reactiver'), habit: cue('s6a', 'habitude'), auto: cue('s6a', 'automatiquement'),
    s7: SEN('s7a').start - 0.6, comprendre: cue('s7b', 'comprendre'), declenche: cue('s7b', 'declenche'), s7bEnd: SEN('s7b').end, toi: SEN('s7c').start, end7c: SEN('s7c').end,
  };
  T.leave = T.s7bEnd + 0.15; T.title = T.end7c + 0.25;
  window.EP_T = T;

  /* ---------- texte à l'écran (DOM) ---------- */
  function tx(html, cls, style) {
    const n = el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
    return n;
  }
  function fit(n, maxW) { // mesure la largeur réelle du texte (et non celle de la boîte)
    const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block';
    let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; }
    n.style.width = w; n.style.display = d; return n; }
  /** apparition « coup » : brutale, légère compression */
  function slam(n, t, t0, t1, out = .3) {
    const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic');
    set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 });
  }
  /** révélation éditoriale : balayage gauche → droite */
  function wipe(n, t, t0, t1, dur = .7, out = .45) {
    const p = prog(t, t0, t0 + dur, 'outQuart'), o = 1 - prog(t, t1, t1 + out, 'inCubic');
    n.style.clipPath = `inset(-20% ${(100 - p * 100).toFixed(2)}% -20% 0)`;
    set(n, { x: (1 - p) * 18, o: o * (p > 0 ? 1 : 0) });
  }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) {
    const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic');
    set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 });
  }

  // Scène 1
  const tSais = tx('TU SAIS.', 'bodoni', { left: '86px', top: '200px', fontWeight: 900, fontSize: '150px', letterSpacing: '-.01em', transformOrigin: '0 50%' });
  const tRecom = fit(tx('TU RECOMMENCES.', 'bodoni', { left: '86px', top: '372px', fontWeight: 900, fontSize: '112px', letterSpacing: '-.015em', transformOrigin: '0 50%' }), 900);
  const tWhy = fit(tx('POURQUOI&#8239;?', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '330px', fontWeight: 900, fontSize: '196px', letterSpacing: '-.02em', color: C.ivory }), 960);
  const tSeries = tx('L’ÉNIGME HUMAINE &nbsp;·&nbsp; ÉPISODE 001', 'plex', { left: '86px', top: '150px', fontSize: '22px', letterSpacing: '.32em', color: C.gold });
  // Scène 2
  const tRom = tx('ROMAINS 7:19-21', 'plex', { left: '86px', top: '210px', fontWeight: 500, fontSize: '34px', letterSpacing: '.28em', color: C.gold });
  const tConf = fit(tx('LE CONFLIT<br>INTÉRIEUR.', 'bodoni', { left: '86px', top: '270px', fontWeight: 700, fontSize: '104px', lineHeight: '1.02', whiteSpace: 'normal', width: '900px' }), 920);
  // Scène 3
  const tSour = tx('SOURATE ASH-SHAMS', 'plex', { left: '0', width: '1080px', textAlign: 'center', top: '196px', fontWeight: 500, fontSize: '32px', letterSpacing: '.3em', color: C.ivory });
  const tAr = tx('الشمس', 'amiri', { left: '0', width: '1080px', textAlign: 'center', top: '236px', fontSize: '112px', color: C.gold, direction: 'rtl' });
  const tVers = tx('91 : 7 – 10', 'plex', { left: '0', width: '1080px', textAlign: 'center', top: '418px', fontSize: '28px', letterSpacing: '.24em', color: C.gold });
  const tWords = ['L’ÂME.', 'LE DISCERNEMENT.', 'LA PURIFICATION.'].map((w, i) => tx(w, 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: (492 + i * 64) + 'px', fontWeight: 700, fontSize: '52px', letterSpacing: '.02em' }));
  // Scène 4
  const tDiff = tx('DES TRADITIONS DIFFÉRENTES.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '868px', fontWeight: 700, fontSize: '54px', letterSpacing: '.01em' });
  const tHum = tx('UNE QUESTION HUMAINE.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '986px', fontWeight: 700, fontSize: '54px', letterSpacing: '.01em', color: C.gold });
  [tDiff, tHum].forEach(n => fit(n, 980));
  // Scène 5
  const tRefA = tx('ARISTOTE &nbsp;·&nbsp; ÉTHIQUE À NICOMAQUE, LIVRE VII', 'plex', { left: '86px', top: '190px', fontSize: '22px', letterSpacing: '.18em', color: C.gold });
  const tGr = tx('ΑΚΡΑΣΙΑ', 'garamond', { right: '80px', top: '228px', fontWeight: 500, fontSize: '168px', letterSpacing: '.08em', color: C.gold, textAlign: 'right' });
  const tAk = tx('AKRASIA', 'inter', { right: '84px', top: '420px', fontWeight: 600, fontSize: '30px', letterSpacing: '.7em', color: C.ivory, textAlign: 'right' });
  const tJug = tx('AGIR CONTRE<br>SON MEILLEUR JUGEMENT.', 'bodoni', { right: '80px', top: '492px', fontWeight: 700, fontSize: '60px', lineHeight: '1.06', textAlign: 'right' });
  // Scène 6
  const loopLabels = [['DÉCLENCHEUR.', 150, 252], ['HABITUDE.', 640, 252], ['AUTOMATISME.', 330, 540]].map(([w, x, y], i) =>
    tx(`<span style="font-family:Plex;font-weight:400;font-size:22px;letter-spacing:.2em;color:${C.gold};display:block;margin-bottom:6px">0${i + 1}</span>${w}`, 'inter', { left: x + 'px', top: y + 'px', fontWeight: 800, fontSize: '46px', letterSpacing: '.02em' }));
  const tSrc = tx('D’APRÈS VERPLANKEN &amp; ORBELL · ANNUAL REVIEW OF PSYCHOLOGY, 2022', 'plex', { left: '0', width: '1080px', textAlign: 'center', top: '1238px', fontSize: '19px', letterSpacing: '.12em', color: 'rgba(242,239,232,.7)' });
  // Scène 7
  const tTag = tx('CE QUE TU NE COMPRENDS PAS DE TOI<br>PEUT CONTINUER À TE CONTRÔLER.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '220px', fontWeight: 700, fontSize: '50px', lineHeight: '1.18', whiteSpace: 'normal' });
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', { left: '0', width: '1080px', textAlign: 'center', top: '600px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });
  const tSlogan = tx('FAIS TA PROPRE RÉFLEXION.', 'plex', { left: '0', width: '1080px', textAlign: 'center', top: '962px', fontWeight: 500, fontSize: '30px', letterSpacing: '.3em', color: C.ivory });
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'plex', { left: '0', width: '1080px', textAlign: 'center', top: '1030px', fontSize: '20px', letterSpacing: '.28em', color: C.gold });

  /* ---------- sous-titres incrustés (zone de sécurité) ---------- */
  const CHUNKS = TL.sentences.flatMap(s => s.chunks);
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.show = Math.min(c.end + .3, nx ? nx.start - .02 : c.end + .6); });
  function subs(t) {
    const c = CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
    if (!c) { SUBS.style.opacity = 0; return; }
    if (SUBS.dataset.k !== c.text) { SUBS.textContent = c.text; SUBS.dataset.k = c.text; }
    SUBS.style.opacity = (prog(t, c.start - .03, c.start + .06, 'linear') * (1 - prog(t, c.show - .08, c.show, 'linear'))).toFixed(3);
  }

  /* =====================================================================
     DÉCOR 1 & 7 — LA CHAMBRE, LE MIROIR
     ===================================================================== */
  const M = { x: 150, y: 600, w: 390, h: 730 };               // glace du miroir
  const MC = { x: M.x + M.w / 2, y: M.y + M.h / 2 };
  const mirC = CINE.off(M.w + 40, M.h + 40), mirX = mirC.getContext('2d');
  const roomDust = makeDust(70, 21, [0, 0, W, H]);
  function skyColor(tod) { // 0 nuit · .25 aube · .5 jour · .75 crépuscule · 1 nuit
    const k = ((tod % 1) + 1) % 1;
    const stops = [[0, '#0B1424'], [.22, '#1E2B44'], [.3, '#B98A5C'], [.42, '#8DA2BC'], [.6, '#9AAFC6'], [.72, '#6B3A43'], [.82, '#1A2236'], [1, '#0B1424']];
    for (let i = 1; i < stops.length; i++) if (k <= stops[i][0]) return mix(stops[i - 1][1], stops[i][1], (k - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
    return stops[0][1];
  }
  function drawRoom(c, t, st) {
    const day = st.daylight || 0;   // lumière du jour qui entre (0..1)
    const dim = st.dim == null ? 1 : st.dim; // coupure de lumière
    // mur
    let g = c.createLinearGradient(0, 0, 0, 1480);
    g.addColorStop(0, mix('#15161b', '#3a3026', day * .6)); g.addColorStop(1, mix('#0c0d10', '#221c16', day * .5));
    c.fillStyle = g; c.fillRect(-400, -400, W + 800, 1880);
    // lambris verticaux discrets
    c.strokeStyle = rgba('#000000', .25); c.lineWidth = 2;
    for (let x = -40; x < W + 60; x += 120) { c.beginPath(); c.moveTo(x, 1080); c.lineTo(x, 1480); c.stroke(); }
    c.fillStyle = rgba('#000000', .25); c.fillRect(-400, 1072, W + 800, 10);
    // sol
    g = c.createLinearGradient(0, 1480, 0, H); g.addColorStop(0, '#0d0c0c'); g.addColorStop(1, '#060606');
    c.fillStyle = g; c.fillRect(-400, 1480, W + 800, 900);
    c.strokeStyle = rgba('#ffffff', .025);
    for (let i = 0; i < 9; i++) { const y = 1480 + i * i * 7; c.beginPath(); c.moveTo(-400, y); c.lineTo(W + 400, y); c.stroke(); }
    // fenêtre (à droite)
    const wx = 830, wy = 380, ww = 210, wh = 520;
    const sky = skyColor(st.tod || 0);
    g = c.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, sky); g.addColorStop(1, mix(sky, '#000000', .45));
    c.fillStyle = g; c.fillRect(wx, wy, ww, wh);
    const r = rng(5); c.fillStyle = rgba('#F3D9A0', .5 * (1 - day));
    for (let i = 0; i < 16; i++) { const x = wx + 10 + r() * (ww - 20), y = wy + wh * .55 + r() * wh * .4; c.fillRect(x, y, 3, 4); } // fenêtres lointaines
    c.strokeStyle = '#08090b'; c.lineWidth = 16; c.strokeRect(wx, wy, ww, wh);
    c.lineWidth = 8; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh * .45); c.lineTo(wx + ww, wy + wh * .45); c.stroke();
    // lumière de la fenêtre projetée
    const skyL = st.tod != null ? 1 : 0;
    beam(c, wx + ww / 2, wy + wh / 2, 560, 1800, 1140, 1900, mix('#6F8DB8', '#F0C890', day), (.10 + day * .35) * dim * skyL, 30);
    // horloge
    const cx = 935, cy = 1040, R = 58;
    c.fillStyle = mix('#1c1d22', '#4a4134', day * .5); c.beginPath(); c.arc(cx, cy, R, 0, 6.283); c.fill();
    c.strokeStyle = C.gold; c.lineWidth = 5; c.stroke();
    c.strokeStyle = rgba(C.ivory, .5); c.lineWidth = 2;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.beginPath(); c.moveTo(cx + Math.cos(a) * R * .78, cy + Math.sin(a) * R * .78); c.lineTo(cx + Math.cos(a) * R * .9, cy + Math.sin(a) * R * .9); c.stroke(); }
    const hrs = st.hours, ah = (hrs % 12) / 12 * 6.283 - Math.PI / 2, am = (hrs % 1) * 6.283 - Math.PI / 2, as = ((st.secs || 0) % 60) / 60 * 6.283 - Math.PI / 2;
    c.strokeStyle = C.ivory; c.lineCap = 'round';
    c.lineWidth = 5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ah) * R * .48, cy + Math.sin(ah) * R * .48); c.stroke();
    c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(am) * R * .74, cy + Math.sin(am) * R * .74); c.stroke();
    c.strokeStyle = C.gold; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(as) * R * .8, cy + Math.sin(as) * R * .8); c.stroke();
    // console sous le miroir
    c.fillStyle = '#0a0a0c'; c.fillRect(126, 1345, 440, 22); c.fillRect(150, 1367, 14, 113); c.fillRect(528, 1367, 14, 113);
    c.fillStyle = rgba(C.gold, .25); c.fillRect(126, 1345, 440, 2);
    // téléphone posé (scène 7)
    if (st.phoneOnTable) {
      c.fillStyle = '#050608'; c.fillRect(448, 1338, 52, 8);
      if (st.tableGlow > 0) glow(c, 474, 1336, 60, C.cold, .4 * st.tableGlow);
    }
    // ---- reflet dans le miroir (rendu hors-champ puis déformé) ----
    const mc = mirX; mc.setTransform(1, 0, 0, 1, 0, 0); mc.clearRect(0, 0, mirC.width, mirC.height);
    mc.translate(20 - M.x, 20 - M.y);
    g = mc.createLinearGradient(0, M.y, 0, M.y + M.h); g.addColorStop(0, mix('#101219', '#3b3127', day * .6)); g.addColorStop(1, mix('#07080b', '#1b1612', day * .5));
    mc.fillStyle = g; mc.fillRect(M.x - 20, M.y - 20, M.w + 40, M.h + 40);
    mc.strokeStyle = rgba('#000', .35); mc.lineWidth = 6; mc.strokeRect(M.x + 60, M.y + 90, 150, 330); // porte reflétée
    if (st.refl) for (const rp of st.refl) person(mc, rp.p, rp.o);
    if (day > 0) glow(mc, M.x + M.w * .8, M.y + M.h * .3, 380, '#F0C890', .25 * day);
    mc.setTransform(1, 0, 0, 1, 0, 0);
    // tain : léger voile + déformation ondulante
    const amp = st.ripple || 0, ph = t * 2.2;
    c.save();
    c.beginPath(); c.rect(M.x, M.y, M.w, M.h); c.clip();
    if (amp > .05) {
      for (let y = 0; y < M.h + 40; y += 4) {
        const dx = Math.sin(y * .018 + ph) * amp + Math.sin(y * .051 - ph * 1.7) * amp * .4;
        c.drawImage(mirC, 0, y, mirC.width, 4, M.x - 20 + dx, M.y - 20 + y, mirC.width, 4);
      }
    } else c.drawImage(mirC, M.x - 20, M.y - 20);
    g = c.createLinearGradient(M.x, M.y, M.x + M.w, M.y + M.h);
    g.addColorStop(0, rgba('#9FB4D8', .07)); g.addColorStop(.5, rgba('#ffffff', .02)); g.addColorStop(1, rgba('#9FB4D8', .06));
    c.fillStyle = g; c.fillRect(M.x, M.y, M.w, M.h);
    c.restore();
    // cadre or patiné
    c.strokeStyle = mix('#5d4b2c', C.gold, .55 + day * .3); c.lineWidth = 16; c.strokeRect(M.x - 8, M.y - 8, M.w + 16, M.h + 16);
    c.strokeStyle = rgba('#000', .5); c.lineWidth = 3; c.strokeRect(M.x - 1, M.y - 1, M.w + 2, M.h + 2);
    c.strokeStyle = rgba('#F6E7C1', .25 + day * .3); c.lineWidth = 1.5; c.strokeRect(M.x - 15, M.y - 15, M.w + 30, M.h + 30);
    // la promesse (post-it)
    if (st.note && (st.noteA == null || st.noteA > 0)) {
      c.save(); c.globalAlpha = st.noteA == null ? 1 : st.noteA; c.translate(452, 650); c.rotate(-.07);
      c.fillStyle = mix('#8f8a63', '#E9DFA8', .35 + day * .4 + (st.phoneGlow || 0) * .15); c.fillRect(0, 0, 118, 108);
      c.fillStyle = rgba('#000', .25); c.fillRect(0, 98, 118, 10);
      c.fillStyle = '#1d1a14'; c.font = '600 31px Caveat'; c.fillText('Demain,', 12, 42); c.fillText('j’arrête.', 12, 80);
      c.restore();
    }
    // personnage au premier plan
    if (st.man) person(c, st.man.p, st.man.o);
    if (st.phoneGlow > 0 && st.man) glow(c, 600, 1040, 520, C.cold, .10 * st.phoneGlow); // lumière froide sur la pièce
    dust(c, roomDust, t, [0, 0, W, H], '#cfd8ea', .18 * dim, (x, y) => (x > 520 && y > 500) ? .6 : .25);
  }
  function roomCam(c, z, fx, fy, rot = 0) {
    c.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 - fy * z);
    if (rot) { c.translate(fx, fy); c.rotate(rot); c.translate(-fx, -fy); }
  }

  /* ---------- Scène 1 : l'accroche ---------- */
  function scene1(c, t) {
    const z = lerp(1, 1.24, E.inOutSine(clamp(t / 7.6))) + prog(t, 8.0, T.s2 + .7, 'inExpo') * 2.6;
    const fx = lerp(560, 410, E.inOutSine(clamp(t / 7.6))), fy = lerp(990, 930, E.inOutSine(clamp(t / 7.6)));
    const fx2 = lerp(fx, MC.x + 30, prog(t, 7.9, T.s2 + .7, 'inOutCubic'));
    roomCam(c, z, fx2, fy, .004 * Math.sin(t * .4));
    // laps de temps : 24 h défilent
    const lp = prog(t, T.lapse0, T.lapse1, 'inOutCubic');
    const hours = 23 + 47 / 60 + lp * 24 + t / 3600;
    const present = 1 - prog(t, T.lapse0 + .05, T.lapse0 + .3, 'linear') + prog(t, T.lapse1 - .45, T.lapse1 - .1, 'linear');
    const pg = prog(t, T.phone, T.phone + .25, 'outCubic') * (present > .5 ? 1 : 0) * (.85 + .15 * Math.sin(t * 9));
    const cut = prog(t, T.why - .05, T.why + .05, 'linear') * (1 - prog(t, 8.15, 8.6, 'linear') * .5);
    const manPose = { x: 720, y: 1640, s: 4.0, f: -1, phone: .5, glow: pg, head: .05 };
    const reflPose = { x: 300, y: 1560, s: 3.6, f: 1, phone: .5, glow: pg, head: .05 };
    drawRoom(c, t, {
      tod: lp, daylight: Math.sin(lp * Math.PI) * .55, hours, secs: t + 47 * 60, note: true, phoneGlow: pg, dim: 1 - cut * .85,
      ripple: 1.2 + prog(t, 5, 7.2, 'linear') * 3 + prog(t, 7.9, T.s2 + .6, 'inQuad') * 26,
      man: present > .02 ? { p: manPose, o: { rim: C.cold, rimA: .25 + pg * .7, rimDx: -1, alpha: present, blur: 1.2 } } : null,
      refl: present > .02 ? [{ p: reflPose, o: { rim: C.cold, rimA: .35 + pg * .65, rimDx: 1, alpha: present * .92, body: '#050609' } }] : null,
    });
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (cut > 0) { c.fillStyle = rgba('#000', .62 * cut); c.fillRect(0, 0, W, H); if (pg > 0) glow(c, W * .42, H * .5, 300, C.cold, .12 * cut * pg); }
    // flash de passage dans le miroir
    const fl = prog(t, T.s2 + .35, T.s2 + .62, 'inCubic');
    if (fl > 0) { c.fillStyle = rgba('#EDE6D6', fl * .85); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 2 — ARCHITECTURE ANCIENNE (Romains 7)
     ===================================================================== */
  const vp = { x: 540, y: 880 };
  const corridorDust = makeDust(120, 33, [0, 200, W, 1500]);
  function drawCorridor(c, t, st) {
    const cam = st.camX || 0;
    // fond : mur du fond très sombre, teinté bordeaux
    let g = c.createRadialGradient(vp.x, vp.y, 40, vp.x, vp.y, 1300);
    g.addColorStop(0, '#2a1418'); g.addColorStop(.5, '#140b0d'); g.addColorStop(1, '#070506');
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, H + 600);
    // sol en perspective
    c.save(); c.beginPath(); c.moveTo(-300, H + 300); c.lineTo(vp.x - 40 + cam * .2, vp.y + 280); c.lineTo(vp.x + 40 + cam * .2, vp.y + 280); c.lineTo(W + 300, H + 300); c.closePath();
    g = c.createLinearGradient(0, vp.y + 280, 0, H); g.addColorStop(0, '#120a0b'); g.addColorStop(1, '#2b1a17'); c.fillStyle = g; c.fill(); c.clip();
    c.strokeStyle = rgba('#000', .35); c.lineWidth = 2;
    for (let i = -10; i <= 10; i++) { c.beginPath(); c.moveTo(vp.x + cam * .2 + i * 8, vp.y + 280); c.lineTo(vp.x + i * 260 + cam * 1.4, H + 300); c.stroke(); }
    for (let k = 1; k < 14; k++) { const y = vp.y + 280 + Math.pow(k / 14, 2.2) * (H - vp.y); c.beginPath(); c.moveTo(-300, y); c.lineTo(W + 300, y); c.stroke(); }
    c.restore();
    // arcades en enfilade (plein cintre) : de la plus lointaine à la plus proche
    for (let i = 7; i >= 0; i--) {
      const z = 1 + i * .55, s = 1 / z;
      const cx = vp.x + (0 - vp.x * 0) * s + cam * s * 1.2, base = vp.y + (1650 - vp.y) * s;
      const w = 1500 * s, h = 1900 * s, th = 120 * s;
      const shade = clamp(1 - i * .11);
      c.save();
      c.beginPath(); c.rect(-400, -400, W + 800, H + 800);
      archPath(c, cx, base, w - th * 2, h - th, false);
      c.clip('evenodd');
      archPath(c, cx, base, w, h, false);
      g = c.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      g.addColorStop(0, mix('#0d0809', '#5b4a3c', shade * .55)); g.addColorStop(.5, mix('#0d0809', '#3a2d26', shade * .4)); g.addColorStop(1, mix('#0d0809', '#6b5846', shade * (.5 + (st.beam || 0) * .3)));
      c.fillStyle = g; c.fill();
      c.strokeStyle = rgba('#000', .5); c.lineWidth = 3 * s; c.stroke();
      // claveaux
      c.strokeStyle = rgba('#000', .28); c.lineWidth = 2 * s;
      for (let k = 1; k < 12; k++) { const a = Math.PI + k * Math.PI / 12, rr = (w - th) / 2; const ccx = cx, ccy = base - h + w / 2; c.beginPath(); c.moveTo(ccx + Math.cos(a) * (rr - th * .5), ccy + Math.sin(a) * (rr - th * .5)); c.lineTo(ccx + Math.cos(a) * (rr + th * .5), ccy + Math.sin(a) * (rr + th * .5)); c.stroke(); }
      c.restore();
    }
    // portes latérales : le bien (gauche, lumière ivoire) / ce qu'on désapprouve (droite, bordeaux)
    const gl = st.good || 0, gr = st.bad || 0;
    const doorL = [120 + cam * .9, 1460], doorR = [960 + cam * .9, 1460];
    for (const [d, col, a] of [[doorL, '#F2E2C0', .25 + gl * .75], [doorR, '#B0303F', .12 + gr * .8]]) {
      c.save(); archPath(c, d[0], d[1], 190, 470, false); c.fillStyle = mix('#0b0707', col, a * .55); c.fill(); c.restore();
      glow(c, d[0], d[1] - 200, 420, col, a * .35);
      c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = a * .5;
      g = c.createLinearGradient(d[0], d[1], d[0] + (d === doorL ? 380 : -380), d[1] + 260);
      g.addColorStop(0, rgba(col, .5)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g;
      c.beginPath(); c.moveTo(d[0] - 95, d[1]); c.lineTo(d[0] + 95, d[1]); c.lineTo(d[0] + (d === doorL ? 520 : -520), d[1] + 380); c.lineTo(d[0] + (d === doorL ? 120 : -120), d[1] + 420); c.closePath(); c.fill();
      c.restore();
    }
    // pupitre et manuscrit dans le rayon
    const bx = 330 + cam * 1.1, by = 1250;
    c.fillStyle = '#0b0807'; c.beginPath(); c.moveTo(bx - 30, by + 30); c.lineTo(bx + 30, by + 30); c.lineTo(bx + 18, by + 330); c.lineTo(bx - 18, by + 330); c.fill();
    c.fillRect(bx - 70, by + 320, 140, 16);
    c.save(); c.translate(bx, by); c.rotate(-.06);
    const pageL = mix('#3b2f22', '#E6D8B8', .35 + (st.beam || 0) * .5), pageR = mix('#3b2f22', '#EFE4C8', .4 + (st.beam || 0) * .55);
    c.fillStyle = '#20140f'; c.beginPath(); c.moveTo(-150, 0); c.quadraticCurveTo(0, -26, 150, 0); c.lineTo(150, 30); c.quadraticCurveTo(0, 6, -150, 30); c.fill();
    c.fillStyle = pageL; c.beginPath(); c.moveTo(-142, -2); c.quadraticCurveTo(-70, -26, 0, -12); c.lineTo(0, 22); c.quadraticCurveTo(-70, 8, -142, 26); c.fill();
    c.fillStyle = pageR; c.beginPath(); c.moveTo(0, -12); c.quadraticCurveTo(70, -26, 142, -2); c.lineTo(142, 26); c.quadraticCurveTo(70, 8, 0, 22); c.fill();
    // lignes d'écriture (abstraites, illisibles par choix : sobriété)
    c.strokeStyle = rgba('#2a1d14', .45); c.lineWidth = 1.4;
    for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(-128, -6 + k * 4.5); c.quadraticCurveTo(-70, -22 + k * 4.5, -12, -8 + k * 4.5); c.stroke(); c.beginPath(); c.moveTo(12, -8 + k * 4.5); c.quadraticCurveTo(70, -22 + k * 4.5, 128, -6 + k * 4.5); c.stroke(); }
    c.fillStyle = rgba(C.bord, .9); c.fillRect(-126, -10, 9, 11);
    c.restore();
    // rayon de lumière (fenêtre haute à droite) + poussière
    const bA = st.beam || 0;
    beam(c, 980 + cam * .3, 160, bx - 220, by + 40, bx + 230, by + 90, '#F3E3BE', .55 * bA, 24);
    glow(c, bx, by, 240, '#F3E3BE', .3 * bA);
    dust(c, corridorDust, t, [0, 200, W, 1500], '#F7EBD0', .55 * bA, (x, y) => {
      const u = (y - 160) / (by + 60 - 160); if (u < 0 || u > 1.1) return 0;
      const cx = lerp(980, bx, u), half = lerp(10, 230, u); return clamp(1 - Math.abs(x - cx) / half);
    });
    // le personnage au carrefour + son ombre
    if (st.man) {
      const p = st.man;
      if (st.shadow > 0) { // ombre portée vers la porte « désapprouvée »
        c.save(); c.globalAlpha = .75 * st.shadow; c.translate(p.x, p.y); c.transform(1, 0, 2.6, -.32, 0, 0); c.translate(-p.x, -p.y);
        person(c, Object.assign({}, p), { body: '#000000' }); c.restore();
      }
      person(c, p, { rim: st.rimCol || '#F2E2C0', rimA: .7, rimDx: st.rimDx || -1 });
    }
  }
  function scene2(c, t) {
    const lt = t - T.s2;
    const z = lerp(1.55, 1.0, prog(t, T.s2, T.s2 + 1.6, 'outCubic'));
    const camX = lerp(90, -70, prog(t, T.s2, T.s3 + .6, 'inOutSine'));
    c.setTransform(z, 0, 0, z, W / 2 - 540 * z, H / 2 - 1000 * z);
    const good = prog(t, T.bien - .1, T.bien + .5, 'outCubic') * (1 - .6 * prog(t, T.desap, T.desap + .8, 'inOutCubic'));
    const bad = prog(t, T.desap, T.desap + .7, 'outCubic');
    // personnage : avance, s'arrête au carrefour, se tourne vers le bien… puis repart vers l'autre porte
    let x = lerp(700, 560, prog(t, T.s2 + .4, T.bien - .3, 'outCubic'));
    let f = -1, walk = (t < T.bien - .3 && t > T.s2 + .4) ? t * 7 : null;
    if (t > T.desap + .25) { f = 1; const p = prog(t, T.desap + .25, T.s3 + .4, 'linear'); x = lerp(560, 760, p); walk = t * 6.5; }
    const man = { x, y: 1560, s: 2.5, f, walk, head: t > T.bien && t < T.desap + .25 ? -.12 : 0 };
    drawCorridor(c, t, { camX, beam: prog(t, T.s2 + .2, T.s2 + 1.4, 'outCubic'), good, bad, man, shadow: prog(t, T.bien, T.bien + .6, 'outCubic'), rimCol: t > T.desap + .25 ? '#C9545F' : '#F2E2C0', rimDx: t > T.desap + .25 ? 1 : -1 });
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .55, '#050203');
    // ouverture depuis le flash du miroir
    const fl = 1 - prog(t, T.s2 + .62, T.s2 + 1.1, 'outCubic');
    if (fl > 0) { c.fillStyle = rgba('#EDE6D6', fl * .85); c.fillRect(0, 0, W, H); }
    const fo = prog(t, T.s3 - .4, T.s3, 'inCubic'); // le rayon envahit l'image
    if (fo > 0) { glow(c, 760, 700, 1400 * fo + 200, '#F3E3BE', fo); c.fillStyle = rgba('#F3E3BE', fo * .9); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 3 — GÉOMÉTRIE, LUMIÈRE (sourate Ash-Shams)
     ===================================================================== */
  const AW = { x: 540, base: 1430, w: 640, h: 700 };
  const islDust = makeDust(140, 44, [0, 300, W, 1500]);
  const latC = CINE.off(AW.w, AW.h), latX = latC.getContext('2d');
  (function buildScreen() { // écran ajouré (moucharabieh) : on découpe des étoiles dans un panneau
    latX.fillStyle = '#0a0f18'; latX.fillRect(0, 0, AW.w, AW.h);
    latX.globalCompositeOperation = 'destination-out';
    const L = 80;
    for (let j = 0; j * L < AW.h + L; j++) for (let i = 0; i * L < AW.w + L; i++) {
      const cx = i * L + (AW.w % L) / 2, cy = j * L;
      star8(latX, cx, cy, L * .3, L * .17); latX.fill();
      latX.beginPath(); latX.rect(cx + L * .36, cy - 4, L * .28, 8); latX.rect(cx - 4, cy + L * .36, 8, L * .28); latX.fill();
    }
    latX.globalCompositeOperation = 'source-over';
  })();
  function drawIslamic(c, t, st) {
    const L = st.light;              // 0..1 : de l'obscurité vers la lumière
    let g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix('#05070c', C.night, .4 + L * .3)); g.addColorStop(1, mix('#020305', '#1a1712', L * .6));
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, H + 600);
    // arcades latérales (silhouettes architecturales)
    for (const [x, s] of [[110, .62], [970, .62], [-60, .9], [1140, .9]]) {
      c.save(); archPath(c, x + (st.camX || 0) * s, 1500, 420 * s, 1250 * s, true);
      c.fillStyle = mix('#04060a', '#2a2418', L * .35); c.fill();
      c.strokeStyle = rgba(C.gold, .12 + L * .25); c.lineWidth = 2; c.stroke(); c.restore();
    }
    // ciel derrière l'écran + soleil qui monte
    c.save(); archPath(c, AW.x, AW.base, AW.w, AW.h, true); c.clip();
    g = c.createLinearGradient(0, AW.base - AW.h, 0, AW.base);
    g.addColorStop(0, mix('#0b1220', '#E9C98E', L * .55)); g.addColorStop(1, mix('#101a2b', '#F6E3B6', L * .9));
    c.fillStyle = g; c.fillRect(AW.x - AW.w, AW.base - AW.h, AW.w * 2, AW.h);
    const sy = lerp(AW.base - 80, AW.base - AW.h * .55, E.outCubic(L));
    glow(c, AW.x, sy, 520, '#FFE6B0', .25 + L * .6);
    c.fillStyle = rgba('#FFF3D6', .25 + L * .7); c.beginPath(); c.arc(AW.x, sy, 70 + L * 20, 0, 6.283); c.fill();
    // l'âme : un point de lumière
    if (st.soul > 0) glow(c, AW.x, AW.base - AW.h * .48, 120, '#FFF6E0', st.soul * .9);
    c.drawImage(latC, AW.x - AW.w / 2, AW.base - AW.h);
    // treillis doré qui s'illumine (purification)
    lattice(c, AW.x - AW.w / 2 + (AW.w % 80) / 2, AW.base - AW.h, AW.w, AW.h, 80, mix('#4d3f25', '#F3D9A0', st.goldLines || 0), 1.6, .35 + (st.goldLines || 0) * .65);
    c.restore();
    c.save(); c.strokeStyle = mix('#3a301c', C.gold, .4 + L * .6); c.lineWidth = 10; archPath(c, AW.x, AW.base, AW.w, AW.h, true); c.stroke(); c.restore();
    // sol : la lumière dessine le motif (projection en perspective)
    c.save();
    c.beginPath(); c.rect(-300, AW.base, W + 600, H); c.clip();
    g = c.createLinearGradient(0, AW.base, 0, H); g.addColorStop(0, mix('#05070b', '#2a2418', L * .5)); g.addColorStop(1, '#030305'); c.fillStyle = g; c.fillRect(-300, AW.base, W + 600, H);
    c.globalCompositeOperation = 'screen';
    const sideL = st.leftLit == null ? 1 : st.leftLit, sideR = st.rightLit == null ? 1 : st.rightLit;
    for (const [side, k] of [[-1, sideL], [1, sideR]]) {
      c.save();
      c.beginPath(); side < 0 ? c.rect(-300, AW.base, AW.x + 300, H) : c.rect(AW.x, AW.base, W, H); c.clip();
      c.globalAlpha = clamp(L * 1.2) * k * .55;
      c.translate(AW.x, AW.base); c.transform(1.25, 0, 0, .55, 0, 0); c.scale(1, -1); c.translate(-AW.x, -AW.base);
      c.filter = 'blur(3px)';
      const lg = c.createLinearGradient(0, AW.base - AW.h, 0, AW.base); lg.addColorStop(0, 'rgba(255,230,170,0)'); lg.addColorStop(1, 'rgba(255,230,170,.9)');
      c.fillStyle = lg; c.fillRect(AW.x - AW.w / 2, AW.base - AW.h, AW.w, AW.h);
      c.globalCompositeOperation = 'destination-out'; c.drawImage(latC, AW.x - AW.w / 2, AW.base - AW.h);
      c.restore();
    }
    c.restore();
    // ligne du discernement (sur le sol)
    if (st.divide > 0) {
      c.save(); c.globalAlpha = st.divide; c.strokeStyle = rgba('#F6E7C1', .9); c.lineWidth = 3; c.shadowColor = '#F6E7C1'; c.shadowBlur = 16;
      c.beginPath(); c.moveTo(AW.x, AW.base); c.lineTo(AW.x, lerp(AW.base, H, st.divide)); c.stroke(); c.restore();
    }
    dust(c, islDust, t, [0, 300, W, 1500], '#FFEFC8', (.15 + L * .6) * (st.dustK == null ? 1 : st.dustK), (x, y) => clamp(1 - Math.abs(x - AW.x) / 520));
    if (st.man) person(c, st.man, { rim: '#F3D9A0', rimA: .2 + L * .8, rimDx: 1, body: '#05060a' });
  }
  function islamicState(t) {
    const L = lerp(.08, .32, prog(t, T.s3, T.ame, 'inOutSine')) + .12 * prog(t, T.disc, T.piete + .3, 'linear') + .56 * prog(t, T.purif - .1, T.purif + 1.2, 'inOutCubic');
    return {
      light: L, soul: prog(t, T.ame - .05, T.ame + .4, 'outCubic') * (1 - .5 * prog(t, T.purif, T.purif + 1, 'linear')),
      divide: prog(t, T.disc, T.disc + .6, 'outCubic') * (1 - prog(t, T.purif, T.purif + .8, 'inCubic')),
      leftLit: t < T.disc ? 1 : lerp(1, .15, prog(t, T.mal - .1, T.mal + .3, 'outCubic')) + .85 * prog(t, T.purif, T.purif + 1, 'inOutCubic'),
      rightLit: t < T.disc ? 1 : lerp(.6, 1.4, prog(t, T.piete - .1, T.piete + .3, 'outCubic')),
      goldLines: prog(t, T.purif, T.purif + 1, 'inOutCubic'),
      camX: lerp(-40, 40, prog(t, T.s3, T.s4 + .6, 'inOutSine')),
      man: { x: 330, y: 1700, s: 2.0, f: 1, head: -.05 },
    };
  }
  function scene3(c, t) {
    const z = lerp(1.18, 1.0, prog(t, T.s3, T.s4, 'inOutSine'));
    c.setTransform(z, 0, 0, z, W / 2 - 540 * z, H / 2 - 1010 * z);
    drawIslamic(c, t, islamicState(t));
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .5, '#020306');
    const fl = 1 - prog(t, T.s3 + .3, T.s3 + .9, 'outCubic');
    if (fl > 0) { c.fillStyle = rgba('#F3E3BE', fl * .9); c.fillRect(0, 0, W, H); }
  }

  /* ---------- Scène 4 : la nuance (deux plans distincts) ---------- */
  function scene4(c, t) {
    const gap = 8 + 30 * prog(t, T.textes, T.textes + .8, 'inOutCubic');
    const open = prog(t, T.s4, T.s4 + .7, 'outExpo');
    const H2 = H / 2;
    c.fillStyle = '#060607'; c.fillRect(0, 0, W, H);
    // haut : la tradition biblique (arcades, rayon)
    c.save(); c.beginPath(); c.rect(0, H2 - H2 * open, W, H2 * open - gap / 2); c.clip();
    c.setTransform(.6, 0, 0, .6, W / 2 - 540 * .6, H2 / 2 - 1080 * .6);
    drawCorridor(c, t, { camX: 40 * Math.sin(t * .4), beam: 1, good: .5, bad: .5, shadow: 0 });
    c.setTransform(1, 0, 0, 1, 0, 0);
    let g = c.createLinearGradient(0, 0, 0, H2); g.addColorStop(0, rgba(C.bord, .25)); g.addColorStop(1, rgba('#000', .35)); c.fillStyle = g; c.fillRect(0, 0, W, H2);
    c.restore();
    // bas : la tradition islamique (géométrie, soleil)
    c.save(); c.beginPath(); c.rect(0, H2 + gap / 2, W, H2 * open); c.clip();
    c.setTransform(.6, 0, 0, .6, W / 2 - 540 * .6, H2 + H2 / 2 - 1060 * .6);
    drawIslamic(c, t, { light: .85, goldLines: .8, leftLit: 1, rightLit: 1, dustK: .6, camX: 30 * Math.sin(t * .4 + 1) });
    c.setTransform(1, 0, 0, 1, 0, 0);
    g = c.createLinearGradient(0, H2, 0, H); g.addColorStop(0, rgba('#000', .35)); g.addColorStop(1, rgba(C.night, .25)); c.fillStyle = g; c.fillRect(0, H2, W, H2);
    c.restore();
    // la ligne lumineuse qui sépare
    const lp = prog(t, T.s4 + .2, T.s4 + .9, 'outExpo'), pulse = .7 + .3 * Math.sin((t - T.lutte) * 6) * prog(t, T.lutte, T.lutte + .3, 'linear');
    c.save(); c.shadowColor = '#F6E7C1'; c.shadowBlur = 26; c.fillStyle = rgba('#F6E7C1', .95 * pulse);
    c.fillRect(W / 2 - W / 2 * lp, H2 - 1.5, W * lp, 3); c.restore();
    vignette(c, .45);
    // sortie : la ligne s'ouvre en fente de lumière vers la bibliothèque
    const ex = prog(t, T.s5 - .05, T.s5 + .55, 'inCubic');
    if (ex > 0) { c.fillStyle = rgba('#F3E3BE', ex); c.fillRect(0, H2 - ex * H2, W, ex * H); }
  }

  /* =====================================================================
     DÉCOR 5 — LA BIBLIOTHÈQUE, LE BUSTE, LE RÉSEAU
     ===================================================================== */
  const books = (() => { const r = rng(91), out = []; const pal = ['#3b1a20', '#541D2A', '#2b2219', '#463625', '#1f2a3a', '#5c4a2c', '#2e1b14', '#6b5634'];
    for (let side = -1; side <= 1; side += 2) for (let row = 0; row < 9; row++) { let u = 0; while (u < 1) { const w = .006 + r() * .012; out.push({ side, row, u, w, h: .55 + r() * .4, col: pal[(r() * pal.length) | 0], lean: r() < .06 ? (r() - .5) * .4 : 0 }); u += w + r() * .002; } }
    return out; })();
  const brain = makeBrain(640, 760, 360, 330, 120, 12);
  const brainPulses = Array.from({ length: 40 }, (_, i) => ({ e: (i * 37) % brain.edges.length, ph: (i * .137) % 1, sp: .6 + ((i * 53) % 10) / 10 }));
  function wallPt(side, u, h, cam) { // perspective des rayonnages
    const f = 1 - 1 / (1 + 2.4 * u);
    const xNear = side < 0 ? -140 : W + 140, xFar = side < 0 ? 400 : 680;
    const x = lerp(xNear, xFar, f / .706) + cam * (1 - f) * 1.2;
    const yTop = lerp(-260, 470, f / .706), yBot = lerp(2150, 1170, f / .706);
    return [x, lerp(yBot, yTop, h)];
  }
  function drawLibrary(c, t, st) {
    const cam = st.cam || 0, fadeShelves = 1 - (st.toBrain || 0) * .75;
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0907'); g.addColorStop(1, '#050404');
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, H + 600);
    // grande fenêtre du fond
    const fx = 540 + cam * .25;
    g = c.createLinearGradient(0, 470, 0, 1170); g.addColorStop(0, '#E8C890'); g.addColorStop(1, '#6b4a26');
    c.save(); archPath(c, fx, 1170, 260, 700, false); c.fillStyle = mix('#140f0a', '#E8C890', .55 * fadeShelves); c.fill(); c.restore();
    glow(c, fx, 820, 600, '#E8C890', .28 * fadeShelves);
    // rayonnages
    c.save(); c.globalAlpha = fadeShelves;
    for (const b of books) {
      const shelfH = 1 / 9, h0 = b.row * shelfH + .01, h1 = h0 + shelfH * b.h * .9;
      const p1 = wallPt(b.side, b.u, h0, cam), p2 = wallPt(b.side, b.u + b.w, h0, cam), p3 = wallPt(b.side, b.u + b.w, h1, cam), p4 = wallPt(b.side, b.u, h1, cam);
      const shade = 1 - b.u * .7;
      c.fillStyle = mix('#050404', b.col, .35 + shade * .5);
      c.beginPath(); c.moveTo(...p1); c.lineTo(...p2); c.lineTo(...p3); c.lineTo(...p4); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(0,0,0,.6)'; c.lineWidth = 6;
    for (const side of [-1, 1]) for (let row = 0; row <= 9; row++) { c.beginPath(); c.moveTo(...wallPt(side, 0, row / 9, cam)); c.lineTo(...wallPt(side, 1, row / 9, cam)); c.stroke(); }
    c.restore();
    // rayon depuis la fenêtre
    beam(c, fx, 640, 260 + cam * .6, 1900, 900 + cam * .6, 1900, '#F0D29A', .22 * fadeShelves, 30);
    // réseau abstrait (le cerveau) qui émerge
    const tb = st.toBrain || 0;
    if (tb > 0) {
      c.save(); c.translate(cam * .35, 0);
      c.lineWidth = 1.6;
      brain.edges.forEach(([i, j], k) => {
        const p = clamp(tb * 1.6 - (k / brain.edges.length) * .6); if (p <= 0) return;
        const a = brain.nodes[i], b = brain.nodes[j];
        c.strokeStyle = rgba('#E8DCC4', .32 * p);
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(lerp(a.x, b.x, p), lerp(a.y, b.y, p)); c.stroke();
      });
      brain.nodes.forEach((n, k) => { const p = clamp(tb * 1.6 - (k / brain.nodes.length) * .6); if (p <= 0) return; c.fillStyle = rgba('#F2EFE8', .7 * p); c.beginPath(); c.arc(n.x, n.y, 2.6, 0, 6.283); c.fill(); });
      // impulsions : désir, émotion (chaudes) qui débordent le jugement (froid)
      const hot = st.hot || 0;
      brainPulses.forEach(pu => {
        const [i, j] = brain.edges[pu.e], a = brain.nodes[i], b = brain.nodes[j];
        const u = ((t * pu.sp + pu.ph) % 1);
        const x = lerp(a.x, b.x, u), y = lerp(a.y, b.y, u);
        glow(c, x, y, 26, hot > .02 ? '#D2475A' : '#BFD3FF', (.35 + hot * .6) * tb);
      });
      if (hot > 0) glow(c, 640, 760, 420, '#8E2435', .22 * hot);
      c.restore();
    }
    // buste + gaine (premier plan, se déplace à l'opposé du fond : travelling circulaire)
    const bxp = 150 - cam * .9, byp = 650;
    c.save();
    c.fillStyle = '#0d0b09'; c.fillRect(bxp + 110, byp + 520, 250, 720);
    g = c.createLinearGradient(bxp + 110, 0, bxp + 360, 0); g.addColorStop(0, rgba('#F0D29A', .18)); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(bxp + 110, byp + 520, 250, 720);
    c.fillStyle = rgba(C.gold, .55); c.font = '500 30px Garamond'; c.textAlign = 'center'; c.fillText('ΑΡΙΣΤΟΤΕΛΗΣ', bxp + 235, byp + 600);
    c.fillStyle = '#16120e'; c.fillRect(bxp + 96, byp + 510, 278, 22);
    c.restore();
    glow(c, bxp + 230, byp + 260, 300, '#F0D29A', .12);
    bust(c, bxp + 60, byp, 1.25, .5 + .2 * Math.sin(t * .5));
  }
  function scene5(c, t) {
    const cam = 70 * Math.sin((t - T.s5) * .55) - 30;
    const z = lerp(1.12, 1.0, prog(t, T.s5, T.s6, 'inOutSine'));
    c.setTransform(z, 0, 0, z, W / 2 - 540 * z, H / 2 - 980 * z);
    drawLibrary(c, t, { cam, toBrain: prog(t, T.contre + .5, T.desir, 'inOutCubic'), hot: prog(t, T.desir - .1, T.desir + .4, 'outCubic') * (.7 + .3 * prog(t, T.emotion, T.emotion + .3, 'linear')) });
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .55);
    const fl = 1 - prog(t, T.s5 + .5, T.s5 + 1.0, 'outCubic');
    if (fl > 0) { c.fillStyle = rgba('#F3E3BE', fl); c.fillRect(0, 0, W, H); }
    const fo = prog(t, T.s6 - .45, T.s6, 'inCubic'); // le réseau s'éteint dans la nuit de la ville
    if (fo > 0) { c.fillStyle = rgba('#0B1424', fo); c.fillRect(0, 0, W, H); }
  }

  /* =====================================================================
     DÉCOR 6 — LA VILLE, LE GESTE QUI SE RÉPÈTE
     ===================================================================== */
  const city = (() => { const r = rng(61), layers = [];
    for (const [n, yb, hmin, hmax, col, lit] of [[14, 1300, 260, 640, '#0f1828', .12], [11, 1420, 380, 900, '#0b121e', .22], [7, 1560, 520, 1100, '#070b12', .3]]) {
      const bs = []; let x = -120;
      for (let i = 0; i < n; i++) { const w = 120 + r() * 160, h = hmin + r() * (hmax - hmin); const win = []; for (let wy = yb - h + 30; wy < yb - 20; wy += 34) for (let wx = x + 14; wx < x + w - 14; wx += 26) if (r() < lit) win.push([wx, wy, r() < .7]); bs.push({ x, w, h, win }); x += w + 6 + r() * 30; }
      layers.push({ yb, col, bs });
    }
    return layers; })();
  function drawCity(c, t, st) {
    const cam = st.cam || 0;
    let g = c.createLinearGradient(0, 0, 0, 1560); g.addColorStop(0, '#05080f'); g.addColorStop(.6, C.night); g.addColorStop(1, '#2a2636');
    c.fillStyle = g; c.fillRect(-300, -300, W + 600, H + 600);
    city.forEach((L, li) => {
      const par = [.2, .45, .8][li];
      c.save(); c.translate(cam * par, 0);
      for (const b of L.bs) {
        c.fillStyle = L.col; c.fillRect(b.x, L.yb - b.h, b.w, b.h);
        for (const [wx, wy, warm] of b.win) { c.fillStyle = warm ? rgba('#E8B86A', .55 + li * .1) : rgba('#9FC0FF', .4); c.fillRect(wx, wy, 12, 16); }
      }
      c.restore();
    });
    // trottoir mouillé
    g = c.createLinearGradient(0, 1560, 0, H); g.addColorStop(0, '#0c0f16'); g.addColorStop(1, '#040507');
    c.fillStyle = g; c.fillRect(-300, 1560, W + 600, H);
    // lampadaire
    const lx = 800 + cam * .95;
    c.fillStyle = '#05060a'; c.fillRect(lx - 7, 700, 14, 860); c.fillRect(lx - 70, 690, 80, 12);
    beam(c, lx - 60, 700, lx - 330, 1600, lx + 200, 1600, '#F3C985', .3, 20);
    glow(c, lx - 60, 705, 160, '#F7D9A0', .6);
    // reflets sur le sol
    c.save(); c.globalAlpha = .18; c.translate(0, 3120); c.scale(1, -1);
    glow(c, lx - 60, 705 + 1560 - 1560, 200, '#F7D9A0', .5); c.restore();
    if (st.ghosts) for (const gh of st.ghosts) person(c, gh.p, { rim: C.cold, rimA: .8, rimDx: -1, alpha: gh.a, body: '#0b1322' });
    if (st.man) {
      person(c, st.man, { rim: '#F3C985', rimA: .75, rimDx: -1 });
      c.save(); c.globalAlpha = .16; c.translate(0, 2 * st.man.y); c.scale(1, -1); person(c, st.man, { body: '#000' }); c.restore();
    }
  }
  function icon(c, kind, x, y, s, a) {
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
    c.strokeStyle = C.gold; c.lineWidth = 3.4; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = C.gold; c.shadowBlur = 14;
    c.fillStyle = rgba('#0b0f18', .75); c.beginPath(); c.arc(0, 0, 46, 0, 6.283); c.fill(); c.stroke();
    c.lineWidth = 3;
    if (kind === 'pin') { c.beginPath(); c.arc(0, -8, 14, Math.PI * .8, Math.PI * 2.2); c.lineTo(0, 22); c.closePath(); c.stroke(); c.beginPath(); c.arc(0, -8, 5, 0, 6.283); c.stroke(); }
    if (kind === 'clock') { c.beginPath(); c.arc(0, 0, 20, 0, 6.283); c.stroke(); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -12); c.moveTo(0, 0); c.lineTo(9, 5); c.stroke(); }
    if (kind === 'bell') { c.beginPath(); c.moveTo(-15, 12); c.quadraticCurveTo(-13, -16, 0, -17); c.quadraticCurveTo(13, -16, 15, 12); c.closePath(); c.stroke(); c.beginPath(); c.arc(0, 16, 4, 0, Math.PI); c.stroke(); c.beginPath(); c.arc(16, -16, 6, 0, 6.283); c.fillStyle = '#D2475A'; c.fill(); }
    c.restore();
  }
  function pop(t, t0) { return prog(t, t0, t0 + .35, 'outBack'); }
  function scene6(c, t) {
    const cam = lerp(40, -40, prog(t, T.s6, T.s7, 'inOutSine'));
    const z = lerp(1.08, 1.0, prog(t, T.s6, T.s6 + 2.5, 'outCubic'));
    c.setTransform(z, 0, 0, z, W / 2 - 540 * z, H / 2 - 1000 * z);
    // le personnage arrive sous le lampadaire, puis le geste
    const arrive = prog(t, T.s6 + .2, T.lieu - .2, 'outCubic');
    const walking = t < T.lieu - .2;
    const raise = prog(t, T.react, T.react + .55, 'inOutCubic');
    const buzz = t > T.decl && t < T.decl + .6 ? Math.sin(t * 90) * 2 : 0;
    const man = { x: lerp(300, 610, arrive) + cam * .95, y: 1560, s: 3.4, f: 1, walk: walking ? t * 7.5 : null, phone: lerp(0, 1, raise) * (raise > 0 ? 1 : 0) || (t > T.decl ? .08 : 0), glow: raise > .3 ? 1 : 0, head: raise * .1 };
    if (t > T.decl && raise === 0) man.phone = 0;
    // répétitions fantômes (automatisme) : le même geste rejoué, décalé
    let ghosts = null;
    const gA = prog(t, T.auto - .1, T.auto + .4, 'outCubic');
    if (gA > 0) {
      ghosts = [1, 2, 3].map(k => {
        const lt = ((t - T.auto) * 1.3 + k * .33) % 1;
        return { p: { x: man.x - k * 150, y: 1560, s: 3.4 - k * .14, f: 1, phone: E.inOutSine(Math.sin(lt * Math.PI)), glow: 1, head: .08 }, a: gA * (.62 - k * .14) };
      });
    }
    drawCity(c, t, { cam, man: Object.assign(man, { x: man.x + buzz * 0 }), ghosts });
    // déclencheurs : un lieu, une heure, une notification
    icon(c, 'pin', man.x - 210, 760, pop(t, T.lieu), prog(t, T.lieu, T.lieu + .2, 'linear'));
    icon(c, 'clock', man.x - 40, 690, pop(t, T.heure), prog(t, T.heure, T.heure + .2, 'linear'));
    icon(c, 'bell', man.x + 190, 860, pop(t, T.decl) * (1 + buzz * .01), prog(t, T.decl, T.decl + .2, 'linear'));
    c.setTransform(1, 0, 0, 1, 0, 0);
    // la boucle (schéma lisible sans le son)
    const L1 = prog(t, T.decl + .2, T.habit, 'inOutCubic'), L2 = prog(t, T.habit + .2, T.auto, 'inOutCubic'), L3 = prog(t, T.auto + .2, T.auto + 1.1, 'inOutCubic');
    c.save(); c.strokeStyle = C.gold; c.lineWidth = 3; c.lineCap = 'round'; c.shadowColor = C.gold; c.shadowBlur = 10;
    const arc = (x1, y1, x2, y2, bend, p) => { if (p <= 0) return; c.beginPath(); const mx = (x1 + x2) / 2 + bend[0], my = (y1 + y2) / 2 + bend[1]; const steps = 30; for (let i = 0; i <= steps * p; i++) { const u = i / steps; const x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2, y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
      if (p >= 1) { const ang = Math.atan2(y2 - my, x2 - mx); c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 16 * Math.cos(ang - .45), y2 - 16 * Math.sin(ang - .45)); c.moveTo(x2, y2); c.lineTo(x2 - 16 * Math.cos(ang + .45), y2 - 16 * Math.sin(ang + .45)); c.stroke(); } };
    arc(520, 300, 630, 300, [0, -70], L1);
    arc(790, 400, 700, 560, [80, 30], L2);
    arc(320, 590, 240, 400, [-90, 20], L3);
    c.restore();
    vignette(c, .5, '#02040a');
    const fl = 1 - prog(t, T.s6 + .45, T.s6 + .95, 'outCubic');
    if (fl > 0) { c.fillStyle = rgba('#0B1424', fl); c.fillRect(0, 0, W, H); }
    const fo = prog(t, T.s7 - .45, T.s7, 'inCubic'); // on entre dans la lumière de l'écran
    if (fo > 0) glow(c, W * .55, H * .55, 900 * (1 + fo), C.cold, fo * .9);
  }

  /* ---------- Scène 7 : la conclusion ---------- */
  function scene7(c, t) {
    const push = prog(t, T.s7, T.toi, 'inOutSine');
    const dive = prog(t, T.toi - .2, T.title + .2, 'inOutCubic');
    const z = lerp(1.04, 1.16, push) + dive * 1.5;
    const fx = lerp(560, 470, push), fy = lerp(990, 960, push);
    roomCam(c, z, lerp(fx, MC.x, dive), lerp(fy, MC.y + 10, dive));
    // le téléphone : regardé… posé… éteint
    const lower = prog(t, T.comprendre, T.declenche + .35, 'inOutCubic');
    const placed = t > T.declenche + .4;
    const off = prog(t, T.declenche + .5, T.declenche + .9, 'linear');
    const turn = t > T.leave;
    const walkP = prog(t, T.leave, T.leave + 2.0, 'inQuad');
    const manX = lerp(720, 1260, walkP);
    let pose;
    if (!turn) pose = { x: 720, y: 1640, s: 4.0, f: -1, phone: placed ? 0 : lerp(.5, .25, lower), glow: placed ? 0 : 1 - lower * .4, head: .05 + lower * .1 };
    else pose = { x: manX, y: 1640, s: 4.0, f: 1, walk: (t - T.leave) * 6.5, phone: 0 };
    const refl = turn ? { x: lerp(300, -260, walkP), y: 1560, s: 3.6, f: -1, walk: (t - T.leave) * 6.5, phone: 0 } : Object.assign({}, pose, { x: 300, y: 1560, s: 3.6, f: 1 });
    const pg = placed ? 0 : 1 - lower * .4;
    const dawn = prog(t, T.toi - .4, T.title + 1.2, 'inOutSine');
    drawRoom(c, t, {
      tod: lerp(0, .3, dawn), daylight: dawn * .75, hours: 23 + 52 / 60 + (t - T.s7) / 3600, secs: t, note: true, noteA: 1 - prog(t, T.toi + .6, T.title, 'inOutCubic'), phoneGlow: pg,
      phoneOnTable: placed, tableGlow: 1 - off, ripple: .8,
      man: walkP < .98 ? { p: pose, o: { rim: turn ? '#F0C890' : C.cold, rimA: .3 + pg * .6, rimDx: turn ? 1 : -1, blur: 1.2 } } : null,
      refl: walkP < .98 ? [{ p: refl, o: { rim: C.cold, rimA: .3 + pg * .6, rimDx: 1, alpha: .9, body: '#050609' } }] : null,
    });
    c.setTransform(1, 0, 0, 1, 0, 0);
    // lumière qui révèle le titre
    if (dive > 0) glow(c, W / 2, 820, 700, '#F6E3B6', .16 * prog(t, T.title - .2, T.title + 1.2, 'outCubic'));
    vignette(c, .55 - dawn * .15);
    const fl = 1 - prog(t, T.s7 + .1, T.s7 + .6, 'outCubic');
    if (fl > 0) { glow(c, W * .55, H * .55, 900 * (1 + (1 - fl)), C.cold, fl * .9); }
  }

  /* =====================================================================
     MONTAGE
     ===================================================================== */
  const scenes = [[0, T.s2 + .62, scene1], [T.s2 + .55, T.s3 + .95, scene2], [T.s3, T.s4 + .02, scene3], [T.s4, T.s5 + .56, scene4], [T.s5 + .5, T.s6 + .02, scene5], [T.s6, T.s7 + .02, scene6], [T.s7, DUR + 1, scene7]];
  function render(t) {
    const f = Math.round(t * 30);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    // une seule scène à la fois (les transitions sont dessinées par les scènes elles-mêmes), sauf fondus S2→S3, S5→S6, S6→S7
    const active = scenes.filter(([a, b]) => t >= a && t < b);
    const sc = active[active.length - 1];
    sc[2](ctx, t);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
    grain(ctx, f, .085);
    texts(t);
    subs(t);
  }

  function texts(t) {
    // S1
    fade(tSeries, t, .25, T.lapse0, .8, 0, .5);
    slam(tSais, t, T.sais, T.why - .12, .12);
    slam(tRecom, t, T.recom, T.why - .12, .12);
    if (t > T.recom) tSais.style.opacity = (parseFloat(tSais.style.opacity) * (1 - .45 * prog(t, T.recom, T.recom + .2, 'linear'))).toFixed(3);
    slam(tWhy, t, T.why, T.s2 + .35, .25);
    // S2
    wipe(tRom, t, T.romains, T.s3 - .2, .7, .35);
    wipe(tConf, t, T.conflit, T.s3 - .2, .9, .35);
    // S3
    fade(tSour, t, T.coran, T.s4 - .15, .6, 10, .35);
    fade(tAr, t, T.coran + .25, T.s4 - .15, .9, 10, .35);
    fade(tVers, t, T.coran + .5, T.s4 - .15, .6, 10, .35);
    [T.ame, T.disc, T.purif].forEach((t0, i) => {
      fade(tWords[i], t, t0, T.s4 - .15, .45, 16, .35);
      const next = [T.disc, T.purif, 1e9][i];
      if (t > next) tWords[i].style.opacity = (parseFloat(tWords[i].style.opacity) * .5).toFixed(3);
    });
    tWords[2].style.color = mix(C.ivory, '#F3D9A0', prog(t, T.purif, T.purif + .8, 'linear'));
    // S4
    wipe(tDiff, t, T.textes, T.s5 - .1, .8, .3);
    wipe(tHum, t, T.prennent + .2, T.s5 - .1, .8, .3);
    // S5
    fade(tRefA, t, T.aristote, T.s6 - .15, .6, 0, .3);
    (function () { // ΑΚΡΑΣΙΑ : lettre à lettre
      const p = prog(t, T.akrasia - .05, T.akrasia + .9, 'linear'), o = 1 - prog(t, T.s6 - .15, T.s6 + .15, 'inCubic');
      tGr.style.opacity = o * (p > 0 ? 1 : 0); tGr.style.clipPath = `inset(-20% 0 -20% ${(100 - E.outCubic(p) * 100).toFixed(2)}%)`;
      set(tGr, { x: (1 - E.outCubic(p)) * -24, o: o * (p > 0 ? 1 : 0) });
    })();
    fade(tAk, t, T.akrasia + .35, T.s6 - .15, .6, 0, .3);
    wipe(tJug, t, T.contre, T.s6 - .15, .9, .3);
    // S6
    loopLabels.forEach((n, i) => fade(n, t, [T.decl, T.habit, T.auto][i], T.s7 - .2, .45, 14, .3));
    fade(tSrc, t, T.s6 + 1.0, T.s7 - .2, .6, 0, .3);
    // S7
    fade(tTag, t, T.s7bEnd + .3, T.toi - .15, .7, 12, .4);
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8);
    fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores (pour la bande-son) ---------- */
  for (let s = 0; s < T.why; s += 1) sfx('tick', s + .3);
  sfx('buzz', T.phone); sfx('lapse', T.lapse0, { d: T.lapse1 - T.lapse0 });
  sfx('slam', T.sais); sfx('slam', T.recom); sfx('cut', T.why - .02, { d: T.s2 + .1 - T.why });
  sfx('dive', T.s2 - .1, { d: .9 }); sfx('paper', T.s2 + .9); sfx('paper', T.bien - .2);
  sfx('swell_good', T.bien); sfx('swell_bad', T.desap);
  sfx('light', T.s3 + .1); sfx('soul', T.ame); sfx('purify', T.purif);
  sfx('split', T.s4); sfx('line', T.s4 + .2); sfx('pulse', T.lutte);
  sfx('open', T.s5); sfx('pulse_hot', T.desir); sfx('pulse_hot', T.emotion);
  sfx('city', T.s6); [T.lieu, T.heure, T.decl].forEach(x => sfx('pop', x)); sfx('buzz', T.decl); sfx('ghost', T.auto);
  sfx('phone_in', T.s7); sfx('tap', T.declenche + .4);
  for (let k = 0; k < 5; k++) sfx('step', T.leave + .25 + k * .48);
  sfx('reveal', T.title);

  window.DURATION = DUR;
  window.SECTIONS = { s1: 0, s2: T.s2, s3: T.s3, s4: T.s4, s5: T.s5, s6: T.s6, s7: T.s7, title: T.title, why: T.why, end: DUR };
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : les trois lignes ensemble
    render(T.recom + 1.0);
    tWhy.style.top = '488px'; tWhy.style.transformOrigin = '0 0'; tWhy.style.left = '86px'; tWhy.style.width = 'auto'; tWhy.style.textAlign = 'left'; tWhy.style.color = C.gold;
    set(tWhy, { o: 1, s: .6, blur: 0 }); set(tSais, { o: 1, blur: 0 }); set(tRecom, { o: 1, blur: 0 }); set(tSeries, { o: 1, blur: 0 }); SUBS.style.opacity = 0;
  };
  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
