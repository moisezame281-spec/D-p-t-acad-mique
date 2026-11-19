/* =====================================================================
   GEXAA × Journée mondiale de la philosophie — 19 novembre 2026
   « La foi s'oppose-t-elle à la raison ? »  —  60 s, 1080×1920, 30 i/s
   ---------------------------------------------------------------------
   0:00 Ouverture        la goutte d'or + la Règle calibrée
   0:06 Le sujet         la question écrite à la plume
   0:16 La balance       foi / raison : croire / savoir
   0:27 Les penseurs     Augustin · Pascal · Kant
   0:40 Le pivot         « au bac… savoir penser »
   0:46 La méthode       4 temps calibrés
   0:54 Signature        logo GEXAA animé
   ===================================================================== */
(async function () {
  const { C, E, prog, tw, inout, set, el, sv, svgLayer, split, stagger, Script, scene, clamp, lerp, sfx, W, H } = GX;
  const stage = document.getElementById('stage');

  await Promise.all([
    GX.loadFont('script', '/node_modules/@fontsource/parisienne/files/parisienne-latin-400-normal.woff'),
    GX.loadFont('serif', '/node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff'),
  ]);
  await Promise.all(['500 20px Montserrat', '600 20px Montserrat', '700 20px Montserrat', '800 20px Montserrat',
    '500 20px Cormorant', '600 20px Cormorant', 'italic 500 20px Cormorant', 'italic 600 20px Cormorant'].map(f => document.fonts.load(f)));

  /* ---------- définitions SVG partagées ---------- */
  const defsSvg = svgLayer(stage);
  defsSvg.style.width = 0; defsSvg.style.height = 0;
  defsSvg.innerHTML = `<defs>
    <filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" result="b"/>
      <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .55 0" result="g"/>
      <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE3A0"/><stop offset=".5" stop-color="#E5AE3E"/><stop offset="1" stop-color="#B37C14"/></linearGradient>
    <linearGradient id="gGoldH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B37C14"/><stop offset=".5" stop-color="#F6D27A"/><stop offset="1" stop-color="#B37C14"/></linearGradient>
    <linearGradient id="gTrail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3CB6B" stop-opacity="0"/><stop offset="1" stop-color="#F3CB6B"/></linearGradient>
    <linearGradient id="gFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1BF"/><stop offset=".45" stop-color="#F3B640"/><stop offset="1" stop-color="#C46A0E"/></linearGradient>
    <radialGradient id="gHalo"><stop offset="0" stop-color="#F3CB6B" stop-opacity=".55"/><stop offset="1" stop-color="#F3CB6B" stop-opacity="0"/></radialGradient>
    <radialGradient id="gHaloGreen"><stop offset="0" stop-color="#2BC29A" stop-opacity=".35"/><stop offset="1" stop-color="#2BC29A" stop-opacity="0"/></radialGradient>
  </defs>`;

  const GOLD = [[0, '#FBE3A0'], [.48, '#E9B445'], [1, '#B07A12']];
  const GOLD_DEEP = [[0, '#D9A43A'], [1, '#8E600C']];
  const IVORY = [[0, '#FFFFFF'], [1, '#E9DFC8']];
  const GREEN = [[0, '#D2F7EA'], [1, '#2BC29A']];
  const INKG = [[0, '#1E448E'], [1, '#06173A']];

  /* ---------- petits outils ---------- */
  const txt = (parent, text, cls, style = {}) => el('div', parent, { class: 't ' + cls, style }, text);
  const drawPath = (parent, d, attrs = {}) => sv('path', parent, Object.assign({ d, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
  const draw = (node, p) => node.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));
  function swoosh(parent, b, y, color, width = 7, lift = 26) {
    const x1 = b.x - 18, x2 = b.x + b.w + 26;
    return drawPath(parent, `M${x1},${y} C${x1 + (x2 - x1) * .3},${y + 14} ${x1 + (x2 - x1) * .7},${y - lift} ${x2},${y - lift * .55}`, { stroke: color, 'stroke-width': width });
  }

  /* =================================================================
     SCÈNE 1 — OUVERTURE (0 → 6.9 s)
     ================================================================= */
  (function () {
    const s = scene(0, 6.9);
    const root = el('div', s.node, { class: 'fill' });
    const svg = svgLayer(root);
    const RY = 930;
    const trail = sv('line', svg, { x1: 540, x2: 540, y1: 0, y2: 0, stroke: 'url(#gTrail)', 'stroke-width': 3, 'stroke-linecap': 'round' });
    const drop = sv('circle', svg, { cx: 540, cy: -40, r: 9, fill: C.goldLight, filter: 'url(#glow)' });
    const rings = [0, 1].map(() => sv('ellipse', svg, { cx: 540, cy: RY, rx: 0, ry: 0, fill: 'none', stroke: C.goldLight, 'stroke-width': 2 }));
    const line = sv('line', svg, { x1: 540, x2: 540, y1: RY, y2: RY, stroke: 'url(#gGoldH)', 'stroke-width': 3, 'stroke-linecap': 'round' });
    const ticks = [];
    for (let i = 0; i <= 40; i++) {
      const x = 170 + i * 18.5, long = i % 5 === 0, mid = i === 20;
      const h = mid ? 44 : long ? 24 : 11;
      ticks.push({ n: sv('line', svg, { x1: x, x2: x, y1: RY, y2: RY, stroke: mid ? C.goldLight : C.gold, 'stroke-width': mid ? 3 : long ? 2.2 : 1.4, 'stroke-linecap': 'round' }), x, h });
    }
    const date = txt(root, '19 novembre 2026', 'mont', { top: '862px', fontWeight: 600, fontSize: '30px', letterSpacing: '.5em', paddingLeft: '.5em', color: C.goldLight });
    const dateS = split(date);
    const lab = txt(root, 'Journée mondiale de la', 'mont', { top: '985px', fontWeight: 600, fontSize: '27px', letterSpacing: '.42em', paddingLeft: '.42em', color: 'rgba(246,241,230,.82)' });
    const labS = split(lab);
    const wsvg = svgLayer(root);
    const word = new Script(wsvg, 'Philosophie', { x: 540, y: 1240, size: 240, maxWidth: 900, gradient: GOLD }).register(2.35, 2.0);
    word.g.setAttribute('filter', 'url(#softGlow)');
    sfx('impact', 1.15);

    s.render = t => {
      const dp = prog(t, .25, 1.15, 'inQuad');
      const dy = lerp(-40, RY, dp);
      drop.setAttribute('cy', dy.toFixed(1));
      drop.setAttribute('opacity', t < 1.15 ? 1 : 0);
      trail.setAttribute('y1', Math.max(0, dy - 300 * Math.min(1, dp * 3)).toFixed(1));
      trail.setAttribute('y2', dy.toFixed(1));
      trail.setAttribute('opacity', (1 - prog(t, 1.1, 1.5, 'outCubic')).toFixed(3));
      rings.forEach((r, k) => {
        const p = prog(t, 1.15 + k * .2, 2.7 + k * .2, 'outExpo');
        r.setAttribute('rx', (30 + p * 600).toFixed(1));
        r.setAttribute('ry', (5 + p * 80).toFixed(1));
        r.setAttribute('opacity', (t > 1.15 + k * .2 ? (1 - p) * .85 : 0).toFixed(3));
      });
      const half = 370 * prog(t, 1.15, 2.0, 'outExpo');
      line.setAttribute('x1', 540 - half); line.setAttribute('x2', 540 + half);
      ticks.forEach(k => {
        const a = 1.2 + Math.abs(k.x - 540) / 370 * .62;
        const p = prog(t, a, a + .4, 'outBack');
        k.n.setAttribute('y2', (RY + k.h * p).toFixed(1));
        k.n.setAttribute('opacity', clamp(p).toFixed(3));
      });
      stagger(dateS, t, 1.45, .035, .6, { dy: 22 });
      stagger(labS, t, 1.9, .022, .6, { dy: 18 });
      word.frame(t, 2.35, 2.0);
      const e = prog(t, 5.9, 6.65, 'inCubic');
      set(root, { s: 1 + .05 * prog(t, 1.2, 6.9, 'linear'), y: -100 * e, o: 1 - e, blur: 12 * e });
    };
  })();

  /* =================================================================
     SCÈNE 2 — LE SUJET (6.2 → 16.8 s)
     ================================================================= */
  (function () {
    const s = scene(6.2, 16.8);
    const root = el('div', s.node, { class: 'fill' });
    const bg = svgLayer(root);
    // grand point d'interrogation en filigrane, dessiné au trait
    const f = GX.fonts.serif;
    const qp = f.getPath('?', 0, 0, 1500);
    const bb = qp.getBoundingBox();
    const qg = sv('g', bg, { transform: `translate(${540 - (bb.x1 + bb.x2) / 2},${1010 - (bb.y1 + bb.y2) / 2})` });
    const qWrap = sv('g', bg); qWrap.appendChild(qg);
    const qFill = sv('path', qg, { d: qp.toPathData(2), fill: C.gold, opacity: 0 });
    const qLine = drawPath(qg, qp.toPathData(2), { stroke: C.gold, 'stroke-width': 2.5, opacity: .22 });

    const label = el('div', root, { class: 't mont', style: { top: '540px', fontWeight: 600, fontSize: '26px', letterSpacing: '.5em', paddingLeft: '.5em', color: C.goldLight } }, 'Le sujet');
    const labelS = split(label);
    const lines = el('div', root, { class: 'fill' });
    const ls = svgLayer(lines);
    const l1 = new Script(ls, 'La foi', { x: 540, y: 850, size: 270, maxWidth: 900, gradient: GOLD }).register(7.0, 1.1);
    const l2 = new Script(ls, 's’oppose-t-elle', { x: 540, y: 1060, size: 178, maxWidth: 940, gradient: IVORY }).register(8.25, 1.75);
    const l3 = new Script(ls, 'à la raison ?', { x: 540, y: 1270, size: 196, maxWidth: 940, gradient: IVORY }).register(10.1, 1.8);
    l1.g.setAttribute('filter', 'url(#softGlow)');
    const bFoi = l1.bbox(3, 6), bRai = l3.bbox(5, 11);
    const sw1 = swoosh(ls, bFoi, 890, C.gold, 7);
    const sw2 = swoosh(ls, bRai, 1312, C.greenLight, 7, 18);
    sfx('soft', 12.0);
    const cap = txt(root, 'Des siècles de débat… et une copie à rendre.', 'corm it', { top: '1420px', fontWeight: 500, fontSize: '50px', color: 'rgba(246,241,230,.85)' });
    const capS = split(cap, 'words');

    s.render = t => {
      set(root, { s: 1 + .04 * prog(t, 6.4, 16.8, 'linear') });
      stagger(labelS, t, 6.6, .05, .6, { dy: 16 });
      draw(qLine, prog(t, 6.7, 9.6, 'inOutCubic'));
      qFill.setAttribute('opacity', (.05 * prog(t, 9.0, 10.5, 'outCubic')).toFixed(3));
      const qr = -7 + 9 * prog(t, 6.2, 16.8, 'linear');
      qWrap.setAttribute('transform', `rotate(${qr.toFixed(3)} 540 1010)`);
      l1.frame(t, 7.0, 1.1); l2.frame(t, 8.25, 1.75); l3.frame(t, 10.1, 1.8);
      draw(sw1, prog(t, 12.0, 12.5, 'outCubic'));
      draw(sw2, prog(t, 12.25, 12.8, 'outCubic'));
      stagger(capS, t, 12.9, .07, .7, { dy: 20 });
      set(lines, { y: Math.sin(t * .9) * 5 });
    };
  })();

  /* =================================================================
     SCÈNE 3 — LA BALANCE (15.9 → 27.05 s)  — volet "Règle d'or"
     ================================================================= */
  (function () {
    const s = scene(15.9, 27.05, { background: `radial-gradient(ellipse 60% 45% at 18% 58%, rgba(216,156,31,.20), transparent 70%),
      radial-gradient(ellipse 60% 45% at 82% 58%, rgba(43,194,154,.18), transparent 70%),
      radial-gradient(ellipse 100% 70% at 50% 45%, #0D2756 0%, #051431 65%, #020A1C 100%)` });
    const wipe = el('div', stage, { style: { position: 'absolute', top: 0, left: 0, width: '4px', height: '1920px', zIndex: 70, background: 'linear-gradient(#F3CB6B00,#F3CB6B 20%,#FFF3C8 50%,#F3CB6B 80%,#F3CB6B00)', boxShadow: '0 0 28px 6px rgba(243,203,107,.55)', display: 'none' } });
    sfx('swish', 15.9, { d: .85 });
    const root = el('div', s.node, { class: 'fill' });

    const hA = txt(root, 'Opposées…', 'corm it', { top: '360px', fontWeight: 600, fontSize: '112px', color: C.ivory });
    const hAS = split(hA, 'words');
    const hB = el('div', root, { class: 't corm it', style: { top: '492px', fontWeight: 600, fontSize: '96px', color: C.ivory } });
    hB.innerHTML = '<span>…ou</span> <span class="cpl">complémentaires</span> <span>?</span>';
    const hBS = Array.from(hB.children);
    hBS.forEach(x => Object.assign(x.style, { display: 'inline-block' }));
    Object.assign(hB.querySelector('.cpl').style, { background: 'linear-gradient(90deg,#F3CB6B,#E9B445 45%,#2BC29A 100%)', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: '.08em' });

    const svg = svgLayer(root);
    const P = { x: 540, y: 800 }, L = 320, ST = { stroke: C.gold, 'stroke-width': 4 };
    const pillar = drawPath(svg, `M540,812 L540,1335`, ST);
    const base1 = drawPath(svg, `M395,1345 L685,1345`, Object.assign({}, ST, { 'stroke-width': 5 }));
    const base2 = drawPath(svg, `M452,1345 L484,1302 L596,1302 L628,1345`, ST);
    const orn = drawPath(svg, `M540,784 L540,742 M540,724 L552,738 L540,752 L528,738 Z`, Object.assign({}, ST, { 'stroke-width': 3 }));
    const beamG = sv('g', svg);
    const beam = drawPath(beamG, `M${540 - L},800 L${540 + L},800`, ST);
    const curl = drawPath(beamG, `M490,800 Q540,764 590,800`, Object.assign({}, ST, { 'stroke-width': 3 }));
    const hub = sv('circle', svg, { cx: 540, cy: 800, r: 0, fill: C.night, stroke: C.gold, 'stroke-width': 4 });

    function pan(side) {
      const g = sv('g', svg);
      const halo = sv('circle', g, { cx: 0, cy: 175, r: 120, fill: side < 0 ? 'url(#gHalo)' : 'url(#gHaloGreen)', opacity: 0 });
      const chains = drawPath(g, `M-112,242 L0,0 L112,242`, { stroke: C.gold, 'stroke-width': 2.2, opacity: .9 });
      const ring = sv('circle', g, { cx: 0, cy: 0, r: 0, fill: C.gold });
      const bowl = drawPath(g, `M-138,242 Q0,338 138,242 Z`, { stroke: C.gold, 'stroke-width': 4, fill: 'rgba(216,156,31,.08)' });
      const icon = sv('g', g);
      let parts;
      if (side < 0) { // flamme = la foi
        const fl = sv('g', icon, { transform: 'translate(0,176)' });
        const flk = sv('g', fl);
        sv('path', flk, { d: 'M0,-84 C32,-42 55,-12 40,27 C30,52 -30,52 -40,27 C-55,-12 -32,-42 0,-84 Z', fill: 'url(#gFlame)' });
        sv('path', flk, { d: 'M0,-30 C14,-10 22,4 15,22 C10,34 -10,34 -15,22 C-22,4 -14,-10 0,-30 Z', fill: '#FFF6D6' });
        parts = { fl, flk };
      } else { // géométrie + compas = la raison
        const gm = sv('g', icon, { transform: 'translate(0,168)' });
        const st = { stroke: '#D2F7EA', 'stroke-width': 3 };
        parts = {
          circ: drawPath(gm, 'M0,-60 A60,60 0 1 1 -0.1,-60', st),
          tri: drawPath(gm, 'M0,-60 L52,30 L-52,30 Z', { stroke: C.greenLight, 'stroke-width': 3 }),
          comp: drawPath(gm, 'M-34,38 L0,-96 L38,38', { stroke: C.ivory, 'stroke-width': 3.2 }),
          hinge: sv('circle', gm, { cx: 0, cy: -96, r: 0, fill: C.ivory }),
          dot: sv('circle', gm, { cx: 0, cy: 0, r: 0, fill: C.greenLight }),
        };
      }
      const label = sv('text', g, { x: 0, y: 405, 'text-anchor': 'middle', 'font-family': 'Montserrat', 'font-weight': 800, 'font-size': 38, 'letter-spacing': 7, fill: C.ivory, opacity: 0 });
      label.textContent = side < 0 ? 'LA FOI' : 'LA RAISON';
      const word = new Script(g, side < 0 ? 'croire' : 'savoir', { x: 0, y: 525, size: 128, maxWidth: 380, gradient: side < 0 ? GOLD : GREEN });
      return { g, halo, chains, ring, bowl, icon, parts, label, word, side };
    }
    const pans = [pan(-1), pan(1)];
    pans[0].word.register(19.0, .8); pans[1].word.register(19.85, .8);
    sfx('soft', 21.7);

    s.render = t => {
      // volet de révélation
      const wx = 1080 * prog(t, 15.9, 16.75, 'inOutCubic');
      if (t < 16.75) { s.node.style.clipPath = `inset(0 ${(1080 - wx).toFixed(1)}px 0 0)`; wipe.style.display = ''; wipe.style.transform = `translateX(${(wx - 2).toFixed(1)}px)`; }
      else { s.node.style.clipPath = 'none'; wipe.style.display = 'none'; }
      if (t > 16.9) wipe.style.display = 'none';

      draw(pillar, prog(t, 16.6, 17.4, 'outCubic'));
      draw(base1, prog(t, 17.1, 17.7, 'outCubic'));
      draw(base2, prog(t, 17.2, 17.8, 'outCubic'));
      draw(orn, prog(t, 16.9, 17.5, 'outCubic'));
      draw(beam, prog(t, 17.0, 17.8, 'outExpo'));
      draw(curl, prog(t, 17.3, 17.9, 'outCubic'));
      hub.setAttribute('r', (13 * prog(t, 17.0, 17.5, 'outBack')).toFixed(2));

      const ang = tw(t, [[19.0, 0], [20.15, -9, 'inOutSine'], [21.35, 8, 'inOutSine'], [23.8, 0, 'outElastic']]);
      beamG.setAttribute('transform', `rotate(${ang.toFixed(3)} 540 800)`);
      const rad = ang * Math.PI / 180;
      pans.forEach(p => {
        const ex = P.x + p.side * L * Math.cos(rad), ey = P.y + p.side * L * Math.sin(rad);
        p.g.setAttribute('transform', `translate(${ex.toFixed(2)},${ey.toFixed(2)})`);
        const k = p.side < 0 ? 0 : .12;
        draw(p.chains, prog(t, 17.5 + k, 18.2 + k, 'outCubic'));
        draw(p.bowl, prog(t, 17.8 + k, 18.5 + k, 'outCubic'));
        p.ring.setAttribute('r', (7 * prog(t, 17.5 + k, 17.9 + k, 'outBack')).toFixed(2));
        p.halo.setAttribute('opacity', (prog(t, 18.3, 19.2, 'outCubic') * (.8 + .2 * Math.sin(t * 3 + p.side))).toFixed(3));
        if (p.side < 0) {
          const ap = prog(t, 18.15, 18.85, 'outBack');
          const fy = 1 + .07 * Math.sin(t * 9.1) + .03 * Math.sin(t * 15.7);
          const fx = 1 - .03 * Math.sin(t * 9.1);
          p.parts.fl.setAttribute('transform', `translate(0,${176 + 45 * (1 - ap)}) scale(${(ap * fx).toFixed(4)},${(ap * fy).toFixed(4)}) translate(0,-0)`);
          p.parts.flk.setAttribute('transform', `skewX(${(Math.sin(t * 6.3) * 3).toFixed(2)})`);
        } else {
          draw(p.parts.circ, prog(t, 18.2, 18.9, 'outCubic'));
          draw(p.parts.tri, prog(t, 18.45, 19.05, 'outCubic'));
          draw(p.parts.comp, prog(t, 18.6, 19.15, 'outCubic'));
          p.parts.hinge.setAttribute('r', (7 * prog(t, 18.9, 19.2, 'outBack')).toFixed(2));
          p.parts.dot.setAttribute('r', (5 * prog(t, 18.9, 19.2, 'outBack')).toFixed(2));
        }
        p.label.setAttribute('opacity', prog(t, 18.6 + k, 19.1 + k, 'outCubic').toFixed(3));
      });
      pans[0].word.frame(t, 19.0, .8);
      pans[1].word.frame(t, 19.85, .8);

      stagger(hAS, t, 18.7, .1, .7, { dy: 24 });
      hA.style.opacity = (1 - .55 * prog(t, 21.6, 22.2, 'outCubic')).toFixed(3);
      stagger(hBS, t, 21.75, .14, .75, { dy: 24, blur: 10 });
      set(root, { s: 1 + .03 * prog(t, 16, 27, 'linear') });
    };
    GX.Ink.add(26.05, 1.0, '#040E24', 540, 940);
  })();

  /* =================================================================
     SCÈNE 4 — LES PENSEURS (26.9 → 40.35 s)
     ================================================================= */
  (function () {
    const s = scene(26.9, 40.35, { background: `radial-gradient(ellipse 60% 30% at 50% 29%, rgba(216,156,31,.16), transparent 70%), #040E24` });
    const root = el('div', s.node, { class: 'fill' });
    const svg = svgLayer(root);
    const M = { x: 540, y: 560 };
    const ring = drawPath(svg, `M540,410 A150,150 0 1 1 539.9,410`, { stroke: C.gold, 'stroke-width': 3 });
    const ring2 = drawPath(svg, `M540,424 A136,136 0 1 0 540.1,424`, { stroke: C.gold, 'stroke-width': 1.2, opacity: .55 });
    const leaves = [];
    const LEAF = 'M0,0 C10,-10 11,-28 0,-40 C-11,-28 -10,-10 0,0 Z';
    // couronne de laurier : une tige + feuilles alternées extérieur / intérieur
    const SR = 186, stems = [];
    for (let side of [-1, 1]) {
      const a0 = side < 0 ? 108 : 72, a1 = side < 0 ? 246 : -66;
      const p0 = [M.x + SR * Math.cos(a0 * Math.PI / 180), M.y + SR * Math.sin(a0 * Math.PI / 180)];
      const p1 = [M.x + SR * Math.cos(a1 * Math.PI / 180), M.y + SR * Math.sin(a1 * Math.PI / 180)];
      stems.push(drawPath(svg, `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${SR},${SR} 0 0 ${side < 0 ? 1 : 0} ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`, { stroke: C.gold, 'stroke-width': 2.4 }));
      for (let j = 0; j < 17; j++) {
        const i = j / 2, outer = j % 2 === 0;
        const a = side < 0 ? 114 + i * 15.5 : 66 - i * 15.5;
        const ar = a * Math.PI / 180;
        const tang = side < 0 ? [-Math.sin(ar), Math.cos(ar)] : [Math.sin(ar), -Math.cos(ar)];
        const n = [Math.cos(ar), Math.sin(ar)], k = outer ? 1 : -1, c = Math.cos(.62), sn = Math.sin(.62);
        const d = [tang[0] * c + n[0] * sn * k, tang[1] * c + n[1] * sn * k];
        const rot = Math.atan2(d[1], d[0]) * 180 / Math.PI + 90;
        const x = M.x + SR * Math.cos(ar), y = M.y + SR * Math.sin(ar);
        const g = sv('g', svg, { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` });
        const inner = sv('path', g, { d: LEAF, fill: 'url(#gGold)' });
        leaves.push({ inner, rot, i, k: 0, sc: 1 - i * .035 });
      }
    }
    const letter = sv('text', svg, { x: 540, y: 628, 'text-anchor': 'middle', 'font-family': 'Cormorant', 'font-weight': 600, 'font-size': 210, fill: 'url(#gGold)' });
    const Q = [
      { s: 27.0, e: 30.7, L: 'A', words: 'Comprends pour croire, crois pour comprendre.', who: 'Saint Augustin', ref: 'Sermon 43' },
      { s: 30.7, e: 34.75, L: 'P', words: 'Le cœur a ses raisons que la raison ne connaît point.', who: 'Blaise Pascal', ref: 'Pensées · 1670' },
      { s: 34.75, e: 39.45, L: 'K', words: 'J’ai dû abolir le savoir afin d’obtenir de la place pour la croyance.', who: 'Emmanuel Kant', ref: 'Critique de la raison pure · 1787' },
    ];
    const wsvg = svgLayer(root);
    Q.forEach((q, i) => {
      q.box = el('div', root, { style: { position: 'absolute', left: '90px', top: '790px', width: '900px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 600, fontSize: i === 2 ? '72px' : '78px', lineHeight: 1.18, color: C.ivory } });
      const inner = el('div', q.box);
      const toks = ['«', ...q.words.split(' '), '»'];
      q.spans = toks.map((w, j) => {
        const sp = el('span', inner, { style: { display: 'inline-block', color: (j === 0 || j === toks.length - 1) ? C.gold : C.ivory } }, w);
        if (j < toks.length - 1) inner.appendChild(document.createTextNode(' '));
        return sp;
      });
      q.script = new Script(wsvg, q.who, { x: 540, y: 1345, size: 124, maxWidth: 860, gradient: GOLD }).register(q.s + 1.25, 1.15);
      q.ref = txt(root, q.ref, 'mont', { top: '1395px', fontWeight: 600, fontSize: '25px', letterSpacing: '.28em', paddingLeft: '.28em', color: 'rgba(246,241,230,.62)' });
    });
    const progress = el('div', root, { class: 't mont', style: { top: '1490px', fontWeight: 700, fontSize: '24px', letterSpacing: '.3em' } });
    const pItems = ['01', '02', '03'].map((n, i) => {
      const sp = el('span', progress, { style: { display: 'inline-block', margin: '0 18px' } }, n);
      return sp;
    });

    s.render = t => {
      draw(ring, prog(t, 27.0, 27.8, 'inOutCubic'));
      draw(ring2, prog(t, 27.15, 27.9, 'inOutCubic'));
      stems.forEach(st => draw(st, prog(t, 27.05, 27.75, 'outCubic')));
      leaves.forEach(l => {
        const p = prog(t, 27.15 + l.i * .06, 27.6 + l.i * .06, 'outBack');
        l.inner.setAttribute('transform', `rotate(${l.rot.toFixed(1)}) scale(${(Math.max(0, p) * l.sc).toFixed(3)})`);
      });
      // monogramme qui pivote d'un penseur à l'autre
      let qi = Q.findIndex(q => t < q.e); if (qi < 0) qi = 2;
      let sx = prog(t, 27.3, 27.8, 'outBack');
      Q.forEach((q, i) => {
        if (i === 0) return;
        const f = prog(t, q.s - .25, q.s + .25, 'inOutSine');
        if (f > 0 && f < 1) sx = Math.abs(1 - 2 * f);
      });
      const shown = Q.reduce((acc, q, i) => (t >= q.s - (i ? 0 : 1) ? i : acc), 0);
      letter.textContent = Q[shown].L;
      letter.setAttribute('transform', `translate(540,0) scale(${sx.toFixed(4)},1) translate(-540,0)`);
      letter.setAttribute('opacity', prog(t, 27.3, 27.7, 'outCubic').toFixed(3));

      Q.forEach((q, i) => {
        const on = t > q.s - .1 && t < q.e + .1;
        q.box.style.display = on ? 'flex' : 'none';
        q.ref.style.display = on ? '' : 'none';
        q.script.g.style.display = on ? '' : 'none';
        if (!on) return;
        stagger(q.spans, t, q.s + .45, .065, .6, { dy: 24, blur: 8, out: q.e - .5, outStep: .012, outDur: .4 });
        q.script.frame(t, q.s + 1.25, 1.15);
        const fo = 1 - prog(t, q.e - .5, q.e - .1, 'inCubic');
        q.script.g.setAttribute('opacity', fo.toFixed(3));
        const rp = prog(t, q.s + 2.2, q.s + 2.8, 'outCubic');
        set(q.ref, { y: (1 - rp) * 14, o: rp * fo });
      });
      pItems.forEach((sp, i) => {
        sp.style.color = i === qi ? C.goldLight : 'rgba(246,241,230,.28)';
      });
      progress.style.opacity = prog(t, 27.6, 28.2, 'outCubic').toFixed(3);
    };
    GX.Ink.add(39.3, 1.0, C.ivory, 540, 1000);
  })();

  /* =================================================================
     SCÈNE 5 — LE PIVOT (40.2 → 46.3 s)  — fond ivoire
     ================================================================= */
  const IVORY_BG = `radial-gradient(ellipse 80% 55% at 50% 42%, #FFFDF7 0%, #F6F1E6 55%, #EBE2CE 100%)`;
  (function () {
    const s = scene(40.2, 46.3, { background: IVORY_BG });
    const root = el('div', s.node, { class: 'fill' });
    const a1 = txt(root, 'Au bac, on ne vous demande pas', 'mont', { top: '770px', fontWeight: 700, fontSize: '32px', letterSpacing: '.16em', paddingLeft: '.16em', color: C.ink });
    const a1S = split(a1);
    const a2 = txt(root, 'de choisir un camp.', 'corm it', { top: '820px', fontWeight: 600, fontSize: '118px', color: C.ink });
    const a2S = split(a2, 'words');
    const b1 = txt(root, 'mais de savoir', 'corm it', { top: '690px', fontWeight: 600, fontSize: '110px', color: C.ink });
    const b1S = split(b1, 'words');
    const svg = svgLayer(root);
    const pen = new Script(svg, 'penser.', { x: 540, y: 1125, size: 330, maxWidth: 820, gradient: INKG }).register(42.85, 1.15);
    const sw = swoosh(svg, pen.bbox(0, 6), 1185, C.gold, 10, 22);
    const b3 = txt(root, 'Avec méthode.', 'mont', { top: '1262px', fontWeight: 700, fontSize: '32px', letterSpacing: '.45em', paddingLeft: '.45em', color: C.goldDeep });
    const b3S = split(b3);

    s.render = t => {
      stagger(a1S, t, 40.35, .018, .55, { dy: 16, out: 41.95, outStep: .004, outDur: .45 });
      stagger(a2S, t, 40.8, .1, .7, { dy: 26, out: 42.0, outStep: .03, outDur: .45 });
      stagger(b1S, t, 42.3, .1, .7, { dy: 26 });
      pen.frame(t, 42.85, 1.15);
      draw(sw, prog(t, 44.0, 44.5, 'outCubic'));
      stagger(b3S, t, 44.3, .03, .6, { dy: 14 });
      const e = prog(t, 45.6, 46.25, 'inCubic');
      set(root, { s: 1 + .03 * prog(t, 40.2, 46.3, 'linear'), y: -80 * e, o: 1 - e, blur: 10 * e });
    };
  })();

  /* =================================================================
     SCÈNE 6 — LA MÉTHODE (45.9 → 54.3 s)
     ================================================================= */
  (function () {
    const s = scene(45.9, 54.3, { background: IVORY_BG });
    const root = el('div', s.node, { class: 'fill' });
    const steps = el('div', root, { class: 'fill' });
    const title = el('div', steps, { class: 't mont', style: { top: '330px', fontWeight: 800, fontSize: '32px', letterSpacing: '.36em', color: C.ink, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '26px' } });
    const tl1 = el('span', title, { style: { display: 'inline-block', width: '70px', height: '3px', background: C.gold } });
    const tt = el('span', title, { style: { display: 'inline-block', paddingLeft: '.36em' } }, 'La méthode GEXAA');
    const tl2 = el('span', title, { style: { display: 'inline-block', width: '70px', height: '3px', background: C.gold } });
    const svg = svgLayer(steps);
    const sub = new Script(svg, 'en quatre temps', { x: 540, y: 500, size: 112, maxWidth: 700, gradient: GOLD_DEEP }).register(46.25, .95);
    const RX = 170, R0 = 600, R1 = 1400;
    const rline = drawPath(svg, `M${RX},${R0} L${RX},${R1}`, { stroke: C.gold, 'stroke-width': 3 });
    const rt = [];
    for (let y = R0, i = 0; y <= R1; y += 20, i++) rt.push({ n: sv('line', svg, { x1: RX, x2: RX, y1: y, y2: y, stroke: C.gold, 'stroke-width': i % 5 ? 1.4 : 2.4 }), len: i % 5 ? 11 : 24, y });
    const marker = sv('path', svg, { d: 'M-30,-13 L0,0 L-30,13 Z', fill: C.gold, opacity: 0 });
    const DATA = [['Analyser', 'le sujet, mot à mot'], ['Problématiser', 'trouver la vraie tension'], ['Argumenter', 'thèse · antithèse · synthèse'], ['Conclure', 'ouvrir avec justesse']];
    const rows = DATA.map(([lab, sb], i) => {
      const y = 590 + i * 205;
      const r = el('div', steps, { style: { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px' } });
      const num = el('div', r, { class: 'corm', style: { position: 'absolute', left: '212px', top: (y - 22) + 'px', fontWeight: 600, fontSize: '124px', lineHeight: 1, color: C.goldDeep, transformOrigin: '30% 60%' } }, '0' + (i + 1));
      const l = el('div', r, { class: 'mont', style: { position: 'absolute', left: '385px', top: (y + 10) + 'px', fontWeight: 800, fontSize: '44px', letterSpacing: '.04em', color: C.ink } }, lab);
      const sbn = el('div', r, { class: 'corm it', style: { position: 'absolute', left: '387px', top: (y + 66) + 'px', fontWeight: 500, fontSize: '42px', color: 'rgba(10,33,72,.75)' } }, sb);
      const a = 46.95 + i * 1.0;
      sfx('tick', a);
      return { r, num, l, sbn, a, cy: y + 52 };
    });
    // l'affirmation finale
    const st = el('div', root, { class: 'fill' });
    const d1 = txt(st, 'Des méthodes', 'corm', { top: '640px', fontWeight: 600, fontSize: '128px', color: C.ink });
    const d1S = split(d1, 'words');
    const ssvg = svgLayer(st);
    const cal = new Script(ssvg, 'calibrées.', { x: 540, y: 1010, size: 310, maxWidth: 880, gradient: GOLD_DEEP }).register(51.95, 1.05);
    const cb = cal.bbox(0, 10);
    const gauge = drawPath(ssvg, `M${cb.x},1062 L${cb.x + cb.w},1062`, { stroke: C.gold, 'stroke-width': 3 });
    const gt = [];
    for (let i = 0; i <= 24; i++) {
      const x = cb.x + cb.w * i / 24;
      gt.push({ n: sv('line', ssvg, { x1: x, x2: x, y1: 1062, y2: 1062, stroke: C.gold, 'stroke-width': i % 6 ? 1.4 : 2.4 }), len: i % 6 ? 10 : 20, i });
    }
    const d3 = txt(st, 'Pour le bac & les prépas concours', 'mont', { top: '1112px', fontWeight: 700, fontSize: '30px', letterSpacing: '.2em', paddingLeft: '.2em', color: C.ink });
    const d3S = split(d3);

    s.render = t => {
      const tp = prog(t, 45.95, 46.6, 'outCubic');
      set(tt, { y: (1 - tp) * 16, o: tp });
      set(tl1, { sx: prog(t, 46.1, 46.7, 'outExpo') }); tl1.style.transformOrigin = '100% 50%';
      set(tl2, { sx: prog(t, 46.1, 46.7, 'outExpo') }); tl2.style.transformOrigin = '0% 50%';
      sub.frame(t, 46.25, .95);
      const rp = prog(t, 46.1, 46.95, 'outCubic');
      draw(rline, rp);
      rt.forEach(k => {
        const p = prog(t, 46.1 + (k.y - R0) / (R1 - R0) * .85, 46.35 + (k.y - R0) / (R1 - R0) * .85, 'outCubic');
        k.n.setAttribute('x2', (RX + k.len * p).toFixed(1));
      });
      const myAdj = (() => { // le curseur glisse juste avant chaque étape
        let y = rows[0].cy;
        rows.forEach((r, i) => { if (i) y = lerp(y, r.cy, prog(t, r.a - .35, r.a, 'inOutCubic')); });
        return y;
      })();
      marker.setAttribute('transform', `translate(${RX - 8},${myAdj.toFixed(1)})`);
      marker.setAttribute('opacity', prog(t, 46.7, 47.0, 'outCubic').toFixed(3));
      rows.forEach(r => {
        const pn = prog(t, r.a, r.a + .6, 'outBack');
        set(r.num, { s: .6 + .4 * pn, o: clamp(pn * 1.4) });
        const pl = prog(t, r.a + .1, r.a + .7, 'outExpo');
        set(r.l, { x: (1 - pl) * 50, o: pl });
        const ps = prog(t, r.a + .25, r.a + .85, 'outCubic');
        set(r.sbn, { x: (1 - ps) * 30, o: ps });
      });
      // sortie des étapes
      const ex = prog(t, 50.9, 51.55, 'inCubic');
      set(steps, { x: -70 * ex, o: 1 - ex, blur: 8 * ex });
      steps.style.display = t > 51.6 ? 'none' : '';
      // affirmation
      stagger(d1S, t, 51.5, .12, .7, { dy: 26 });
      cal.frame(t, 51.95, 1.05);
      const gp = prog(t, 52.85, 53.35, 'outCubic');
      draw(gauge, gp);
      gt.forEach(k => {
        const p = prog(t, 52.9 + k.i * .014, 53.15 + k.i * .014, 'outBack');
        k.n.setAttribute('y2', (1062 + k.len * p).toFixed(1));
      });
      stagger(d3S, t, 52.95, .014, .55, { dy: 14 });
      const e = prog(t, 53.6, 54.25, 'inCubic');
      set(st, { y: -70 * e, o: 1 - e, blur: 10 * e });
    };
  })();

  /* =================================================================
     SCÈNE 7 — SIGNATURE : logo GEXAA animé (53.9 → 60 s)
     ================================================================= */
  (function () {
    const s = scene(53.9, 60.1, { background: IVORY_BG });
    const root = el('div', s.node, { class: 'fill' });
    const LW = 940, LH = LW * 720 / 1080, LX = 70, LY = 390;
    const logo = el('div', root, { style: { position: 'absolute', left: LX + 'px', top: LY + 'px', width: LW + 'px', height: LH + 'px', transformOrigin: '50% 50%' } });
    const layer = (name, origin) => el('img', logo, { src: `/assets/logo/${name}.png`, style: { position: 'absolute', left: 0, top: 0, width: LW + 'px', height: LH + 'px', transformOrigin: origin || '50% 50%' } });
    const Lr = layer('rule'), Ll = layer('laurel-left', '31% 45%'), Lrr = layer('laurel-right', '69% 45%'), Lc = layer('cover', '50% 50%'),
      Lp = layer('pages', '50% 47%'), Lpen = layer('pen'), Lcap = layer('cap', '50% 20%'), Lw = layer('wordmark'), Lt = layer('tagline'), Lrest = layer('rest');
    const sheen = el('div', logo, { style: { position: 'absolute', left: 0, top: 0, width: LW + 'px', height: LH + 'px',
      webkitMaskImage: 'url(/assets/logo/wordmark.png)', maskImage: 'url(/assets/logo/wordmark.png)', webkitMaskSize: '100% 100%', maskSize: '100% 100%',
      background: 'linear-gradient(105deg, rgba(255,255,255,0) 42%, rgba(255,250,230,.9) 50%, rgba(255,255,255,0) 58%)', backgroundSize: '300% 100%' } });
    const ssvg = svgLayer(root);
    const STAR = 'M0,-24 C3,-5 5,-3 24,0 C5,3 3,5 0,24 C-3,5 -5,3 -24,0 C-5,-3 -3,-5 0,-24 Z';
    const k = LW / 1080;
    const stars = [[332, 52, 56.75], [748, 52, 56.95], [633, 178, 57.15], [985, 470, 56.55]].map(([x, y, a]) => ({ n: sv('path', ssvg, { d: STAR, fill: '#F6D27A', filter: 'url(#glow)' }), x: LX + x * k, y: LY + y * k, a }));
    const svg = svgLayer(root);
    const sig = new Script(svg, 'L’excellence se prépare.', { x: 540, y: 1235, size: 140, maxWidth: 860, gradient: INKG }).register(57.05, 1.4);
    const hash = txt(root, '#JournéeMondialeDeLaPhilosophie', 'mont', { top: '1300px', fontWeight: 600, fontSize: '25px', letterSpacing: '.06em', textTransform: 'none', color: C.goldDeep });
    sfx('chime', 55.45); sfx('drop', 55.55); sfx('shine', 56.4);
    stars.forEach(st => sfx('sparkle', st.a));

    s.render = t => {
      const rp = prog(t, 54.0, 54.8, 'outExpo');
      Lr.style.clipPath = `inset(0 ${(50 - 50 * rp).toFixed(2)}% 0 ${(50 - 50 * rp).toFixed(2)}%)`;
      [[Ll, -1], [Lrr, 1]].forEach(([n, sd]) => {
        const p = prog(t, 54.2, 55.2, 'outCubic');
        n.style.clipPath = `inset(${(100 - 100 * p).toFixed(2)}% 0 0 0)`;
        set(n, { r: sd * 22 * (1 - prog(t, 54.2, 55.4, 'outBackSoft')), o: clamp(p * 3) });
      });
      const pc = prog(t, 54.3, 55.0, 'outExpo');
      set(Lc, { y: (1 - pc) * 50, o: pc });
      const pp = prog(t, 54.5, 55.25, 'outBack');
      set(Lp, { sx: 1, sy: Math.max(0, pp), o: clamp(pp * 2) });
      const pn = prog(t, 54.9, 55.45, 'outBack');
      set(Lpen, { y: -130 * (1 - pn), o: clamp(pn * 2) });
      const pk = prog(t, 55.1, 55.95, 'outBounce');
      set(Lcap, { y: -230 * (1 - pk), r: -14 * (1 - prog(t, 55.1, 55.9, 'outCubic')), o: clamp(prog(t, 55.1, 55.3, 'linear')) });
      const pw = prog(t, 55.5, 56.35, 'inOutCubic');
      Lw.style.clipPath = `inset(0 ${(100 - 100 * pw).toFixed(2)}% 0 0)`;
      set(Lw, { x: (1 - pw) * -20 });
      const pt = prog(t, 56.15, 56.9, 'outCubic');
      set(Lt, { y: (1 - pt) * 14, o: pt });
      set(Lrest, { o: prog(t, 54.4, 55.2, 'outCubic') });
      const sh = prog(t, 56.4, 57.3, 'inOutSine');
      sheen.style.backgroundPosition = `${(100 - 100 * sh).toFixed(2)}% 0`;
      sheen.style.opacity = (sh > 0 && sh < 1 ? .9 : 0).toString();
      set(logo, { s: .965 + .035 * prog(t, 54.0, 60, 'outCubic') });
      stars.forEach(st => {
        const p = clamp((t - st.a) / .7);
        const sc = Math.sin(p * Math.PI);
        st.n.setAttribute('transform', `translate(${st.x.toFixed(1)},${st.y.toFixed(1)}) rotate(${(p * 90).toFixed(1)}) scale(${(sc * .9).toFixed(3)})`);
        st.n.setAttribute('opacity', p > 0 && p < 1 ? 1 : 0);
      });
      sig.frame(t, 57.05, 1.4);
      const hp = prog(t, 58.45, 59.1, 'outCubic');
      set(hash, { y: (1 - hp) * 12, o: hp });
    };
  })();

  /* =================================================================
     COUCHES GLOBALES : plume, encre, poussière d'or, vignettes, grain
     ================================================================= */
  GX.Ink.init(stage);
  GX.Pen.init(stage);
  GX.Dust.init(stage, 70);
  const vigDark = el('div', stage, { id: 'vigDark', class: 'overlay' });
  const vigLight = el('div', stage, { id: 'vigLight', class: 'overlay' });
  const grain = el('div', stage, { id: 'grain', class: 'overlay' });
  const R = GX.rng(99);
  const offs = Array.from({ length: 2000 }, () => [Math.floor(R() * 512), Math.floor(R() * 512)]);
  GX.hooks.push(t => {
    const light = t >= 40.3;
    vigDark.style.opacity = light ? 0 : 1;
    vigLight.style.opacity = light ? 1 : 0;
    grain.style.opacity = light ? .07 : .1;
    const f = Math.floor(t * GX.FPS);
    grain.style.backgroundPosition = `${offs[f % 2000][0]}px ${offs[f % 2000][1]}px`;
    const da = light ? .5 * prog(t, 54.6, 56.0, 'outCubic') : tw(t, [[0, 0], [1.0, 1], [39.3, 1], [40.1, 0]]);
    GX.Dust.frame(t, da, light ? '200,140,30' : '243,203,107');
  });

  window.DURATION = 60;
  window.renderFrame = GX.renderFrame;
  window.SFX = GX.SFX;
  GX.renderFrame(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
