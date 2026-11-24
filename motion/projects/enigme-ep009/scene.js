/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 009 — « Peut-on être coupable sans avoir choisi le mal ? »
   Style validé : explication continue, une seule musique de fond, fondus enchaînés en mouvement.
   Règles : silhouettes sombres jamais sur fond noir (fonds clairs ou contre-jour) ; début et questions posés.
   Habillage (dès l'EP009) : la question à l'écran dès la première image, le logo qui s'allume en haut à gauche, le carton de fin.
   Décors nouveaux : le bureau au matin, le tampon vu de dessus, le mur blanc et les fils, le laboratoire des années 1960,
   la salle d'audience et la cage de verre vide, la salle blanche où les lumières s'éteignent, le livre dans le rayon de lumière,
   l'arc et la géométrie, la rangée d'interrupteurs, la balance, le grand bureau vu d'en haut.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, personPath, rng, off, archPath, lattice } = CINE;
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
    s1b: SEN('s1b').start, s1c: SEN('s1c').start, matin: cue('s1c', 'matin'), ins: cue('s1c', 'elle') - .15,
    consc: cue('s1c', 'consciencieusement'), actes: cue('s1c', 'actes'), souffrir: cue('s1c', 'souffrir'), humains: cue('s1c', 'humains'),
    s2: SEN('s2a').start - .3, q2: SEN('s2a').start, innocente: cue('s2a', 'innocente'), obeir: cue('s2a', 'obeir'),
    s3: SEN('s3a').start - .3, milgram: cue('s3a', 'psychologue'), s3b: SEN('s3b').start, croient: cue('s3b', 'croient'), decharges: cue('s3b', 'decharges'),
    inconnu: cue('s3b', 'inconnu'), autorite: cue('s3b', 'autorite'), continuer: cue('s3b', 'continuer'),
    s4: SEN('s4a').start - .3, arendt: SEN('s4a').start, nazisme: cue('s4a', 'nazisme'), derangeante: cue('s4a', 'derangeante'),
    s4b: SEN('s4b').start - .25, q4: SEN('s4b').start, cessons: cue('s4b', 'cessons'), memes: cue('s4b', 'memes'),
    s5: SEN('s5a').start - .3, dieu: cue('s5a', 'dieu'), hommes: cue('s5a', 'hommes'),
    s5b: SEN('s5b').start - .25, coran: cue('s5b', 'coran'), justice: cue('s5b', 'justice'), deteste: cue('s5b', 'deteste'),
    s6: SEN('s6a').start - .3, probleme: cue('s6a', 'probleme'), q6: SEN('s6b').start, moment: cue('s6b', 'moment'), vertu: cue('s6b', 'vertu'), abdication: cue('s6b', 'abdication'), conscience: cue('s6b', 'conscience'),
    s7: SEN('s7a').start - .3, q7: SEN('s7a').start, toujours: cue('s7a', 'toujours'), responsable: cue('s7a', 'responsable'),
    s8: SEN('s8a').start - .3, q8: SEN('s8a').start, demander: cue('s8b', 'demander'), juste: cue('s8b', 'juste'), qEnd: SEN('s8b').end,
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
  const tKick = [big('PEUT-ON ÊTRE COUPABLE', 300, 84, GOLD), big('SANS AVOIR CHOISI', 400, 84, GOLD), big('LE MAL&#8239;?', 500, 104, ROSE)];
  // S2 — la question, mot à mot
  const Q2 = [[['Est-elle', 'innocente'], 92, 300, C.ivory], [['parce', 'qu’elle', 'ne', 'fait'], 72, 410, C.ivory], [['qu’obéir&#8239;?'], 110, 494, C.rose]];
  // S3 — Milgram
  const tMil = big('STANLEY MILGRAM', 290, 100, GOLD);
  const tMilSub = note('Psychologue · <i>Obedience to Authority</i> (1974)', 410, 30, 'rgba(242,239,232,.95)');
  const tFict = [ital('Les décharges n’étaient pas réelles,', 296, 54), ital('mais les participants l’ignoraient.', 360, 54, C.lamp)];
  const tCont = big('CONTINUER', 446, 96, ROSE);
  const tStat = note('Expérience 5 : 65 % des participants sont allés jusqu’à 450 volts (Milgram, 1974)', 576, 23, 'rgba(242,239,232,.92)');
  // S4 — Arendt
  const tAr = big('HANNAH ARENDT', 290, 100, GOLD);
  const tArSub = note('1906 – 1975 · <i>Eichmann à Jérusalem</i> (1963)', 410, 30, 'rgba(242,239,232,.95)');
  const tBan = big('LA BANALITÉ DU MAL', 482, 76, ROSE);
  const Q4 = [[['que', 'devient', 'notre'], 66, 290, C.ivory], [['responsabilité'], 100, 370, C.rose], [['lorsque', 'nous', 'cessons'], 66, 494, C.ivory], [['de', 'penser', 'par', 'nous-mêmes&#8239;?'], 70, 572, C.ivory]];
  const tRJ = [ital('«&#8239;Les non-participants […] furent les seuls', 1290, 44), ital('qui osèrent juger par eux-mêmes.&#8239;»', 1344, 44, C.lamp),
    note('Hannah Arendt, «&#8239;Responsabilité personnelle sous la dictature&#8239;» (1964), dans <i>Responsabilité et jugement</i> · traduction libre', 1408, 19, 'rgba(242,239,232,.8)')];
  // S5 — Actes 5:29 et Coran 5:8
  const tAct = small('ACTES DES APÔTRES · 5 : 29', 296, '#EBD39A');
  const tActQ = [ital('«&#8239;Il faut obéir à Dieu', 356, 76), ital('plutôt qu’aux hommes.&#8239;»', 442, 76, C.lamp)];
  const tActRef = note('trad. Louis Segond, 1910', 540, 24);
  const tSur = small('SOURATE AL-MÂ’IDA · 5 : 8', 290, '#EBD39A');
  const tSurAr = tx('المائدة', 'amiri', Object.assign({ top: '338px', fontSize: '54px', color: C.gold, direction: 'rtl' }, CENTER));
  const tSurQ = [ital('«&#8239;Et que la haine pour un peuple', 424, 58), ital('ne vous incite pas à être injuste.', 490, 58), ital('Soyez justes […]&#8239;»', 556, 66, C.lamp)];
  const tSurRef = note('trad. Muhammad Hamidullah (quran.com)', 638, 24);
  // S6 — le véritable problème
  const tPb1 = ital('Mais voici', 300, 80), tPb2 = big('LE VÉRITABLE PROBLÈME', 392, 88, ROSE);
  const Q6 = [[['à', 'partir', 'de', 'quel', 'moment'], 62, 290, C.ivory], [['l’obéissance'], 96, 364, C.gold], [['cesse-t-elle', 'd’être', 'une', 'vertu'], 64, 478, C.ivory],
    [['et', 'devient-elle', 'une'], 64, 552, C.ivory], [['abdication', 'de', 'conscience&#8239;?'], 80, 626, C.rose]];
  // S7 — la phrase-clé, mot à mot
  const Q7 = [[['Car', 'ne', 'pas', 'avoir', 'voulu', 'le', 'mal'], 64, 300, C.ivory], [['ne', 'signifie', 'pas', 'toujours'], 64, 380, C.ivory], [['ne', 'pas', 'en', 'être'], 64, 460, C.ivory], [['responsable.'], 108, 536, C.rose]];
  // S8 — la question finale, mot à mot
  const Q8 = [[['Et', 'si', 'le', 'danger', 'le', 'plus', 'discret'], 62, 290, C.ivory], [['n’était', 'pas', 'de', 'devenir', 'mauvais,'], 62, 364, C.ivory],
    [['mais', 'd’apprendre', 'à', 'ne', 'plus'], 66, 452, C.ivory], [['se', 'demander', 'si', 'ce', 'que', 'l’on', 'fait'], 64, 530, C.ivory], [['est', 'juste&#8239;?'], 112, 610, C.rose]];
  const keysOf = w => (w.replace(/&#\d+;/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z]+/g) || ['x']);
  function wordLines(lines, sids) {
    const words = sids.flatMap(id => SEN(id).words); let wi = 0;
    return lines.map(([ws, fs, y, col]) => fit(tx(ws.map(w => { const idx = wi; wi += keysOf(w).length;
      return `<span class="qw" data-t="${words[Math.min(idx, words.length - 1)].start}" style="display:inline-block;margin:0 .12em">${w}</span>`; }).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)), 1010));
  }
  const tQ2 = wordLines(Q2, ['s2a']), tQ4 = wordLines(Q4, ['s4b']), tQ6 = wordLines(Q6, ['s6b']), tQ7 = wordLines(Q7, ['s7a']), tQ8 = wordLines(Q8, ['s8a', 's8b']);

  /* ---------- sous-titres ---------- */
  const NOSUB = new Set(['s2a', 's4b', 's6a', 's6b', 's7a', 's8a', 's8b']);
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
  function clock(c, x, y, r, h, m) {
    c.save(); c.fillStyle = '#FBF7EF'; c.strokeStyle = '#6a5a48'; c.lineWidth = r * .1; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); c.stroke();
    c.lineWidth = r * .04; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; c.beginPath(); c.moveTo(x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78); c.lineTo(x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9); c.stroke(); }
    const ah = (h % 12 + m / 60) / 12 * 6.283, am = m / 60 * 6.283; c.strokeStyle = '#2a2218'; c.lineCap = 'round';
    c.lineWidth = r * .09; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5); c.stroke();
    c.lineWidth = r * .06; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(am) * r * .74, y - Math.cos(am) * r * .74); c.stroke(); c.restore();
  }
  function switchRow(c, x0, x1, y, n, k, o = {}) { // une rangée d'interrupteurs ; k interrupteurs basculés (réel, pour un basculement progressif)
    const step = (x1 - x0) / n, w = step * .7, h = o.h || w * 1.6;
    for (let i = 0; i < n; i++) {
      const x = x0 + step * (i + .5), f = clamp(k - i), u = i / (n - 1);
      c.fillStyle = o.plate || '#5c605c'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, w * .18); c.fill();
      c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.roundRect(x - w * .2, y - h * .32, w * .4, h * .64, w * .12); c.fill();
      c.strokeStyle = o.lever || '#E9E6DE'; c.lineCap = 'round'; c.lineWidth = w * .26; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h * .42 * (1 - 2 * f)); c.stroke();
      const lc = o.lamp ? o.lamp(u) : '#E0563C', ly = y - h / 2 - w * .55;
      c.fillStyle = f > .5 ? lc : 'rgba(80,80,80,.55)'; c.beginPath(); c.arc(x, ly, w * .24, 0, 6.283); c.fill();
      if (f > .5) glow(c, x, ly, w * 1.2, lc, .5 * f);
    }
  }

  // ---------- S1 : le bureau du matin (plan large) ----------
  function drawOfficeStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#EDE3D3'); g.addColorStop(.6, '#F5EFE5'); g.addColorStop(1, '#E2D6C2'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const wx = 30, wy = 560, ww = 660, wh = 760;
    g = c.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#CFE0EE'); g.addColorStop(.5, '#FFEBCF'); g.addColorStop(1, '#FFD7A2'); c.fillStyle = g; c.fillRect(wx, wy, ww, wh);
    glow(c, 330, 1120, 460, '#FFF3DA', .95);
    c.fillStyle = 'rgba(160,150,160,.32)'; [[50, 1190, 90, 140], [150, 1160, 70, 170], [230, 1210, 120, 100], [360, 1140, 80, 190], [450, 1200, 110, 110], [570, 1170, 100, 150]].forEach(([x, y, w, h]) => c.fillRect(x, y, w, wy + wh - y));
    c.fillStyle = '#D6C9B2'; c.fillRect(wx - 18, wy - 18, ww + 36, 18); c.fillRect(wx - 18, wy + wh, ww + 36, 22); c.fillRect(wx - 18, wy, 18, wh); c.fillRect(wx + ww, wy, 18, wh);
    c.fillRect(wx + ww / 2 - 7, wy, 14, wh); c.fillRect(wx, wy + wh * .42, ww, 12);
    g = c.createLinearGradient(0, 1340, 0, H); g.addColorStop(0, '#D9C8A8'); g.addColorStop(1, '#C4AF8C'); c.fillStyle = g; c.fillRect(-LM, 1340, W + 2 * LM, H - 1340 + LM);
    c.save(); c.globalAlpha = .38; c.fillStyle = '#FFF4DC'; c.beginPath(); c.moveTo(30, 1340); c.lineTo(700, 1340); c.lineTo(1000, H + LM); c.lineTo(120, H + LM); c.fill(); c.restore();
    c.fillStyle = '#CDBB9E'; c.fillRect(770, 960, 270, 14);
    ['#B9A27E', '#A88E68', '#C4AE8A', '#9E8460', '#B59C76'].forEach((col, i) => { c.fillStyle = col; c.fillRect(788 + i * 48, 878, 40, 82); });
  }
  const OFFICE = prerender(drawOfficeStatic);
  const S1_STAMPS = [];
  function desk(c, x0, x1, y, s) { c.fillRect(x0, y, x1 - x0, 22 * s); c.fillRect(x0 + 20 * s, y, 14 * s, 300 * s); c.fillRect(x1 - 34 * s, y, 14 * s, 300 * s); }
  function scene1(c, t) {
    const z = 1 + .05 * prog(t, 0, T.ins + 1, 'inOutSine');
    camSafe(c, z, 540, 1000); blit(c, OFFICE);
    const sunA = .25 + .2 * prog(t, 0, T.ins, 'inOutSine'); glow(c, 330, 1120, 520, '#FFE6B8', sunA);
    clock(c, 880, 760, 64, 8, 2 + 3 * prog(t, 0, T.ins + 1));
    if (t > T.matin - .3) glow(c, 880, 760, 150, '#FFE7B0', .45 * Math.sin(Math.PI * prog(t, T.matin - .3, T.matin + 1.2)));
    // le geste régulier : il tamponne calmement
    let lift = 1; S1_STAMPS.forEach(ts => { const d = t - ts; if (d > -.45 && d < .5) lift = Math.min(lift, d < 0 ? 1 - prog(d, -.45, -.02, 'inCubic') : prog(d, .08, .5, 'inOutSine')); });
    LIGHT(c, 520, 1000, 260, .55);
    sil(c, cc => { seatedPath(cc, 420, 1238, 1.2, lift); desk(cc, 560, 1020, 1144, 1.2); cc.fillStyle = '#F2EADC'; }, RIM, -4);
    c.fillStyle = '#EFE6D4'; c.fillRect(600, 1134, 120, 10); c.fillRect(880, 1128, 110, 16); c.fillStyle = '#E4D8C2'; c.fillRect(884, 1120, 102, 8);
    // la lampe de bureau
    c.strokeStyle = '#3a2e26'; c.lineWidth = 8; c.beginPath(); c.moveTo(980, 1144); c.lineTo(960, 1040); c.lineTo(900, 1010); c.stroke(); c.fillStyle = '#3a2e26'; c.beginPath(); c.moveTo(880, 990); c.lineTo(930, 1000); c.lineTo(910, 1040); c.closePath(); c.fill();
    glow(c, 900, 1060, 120, '#FFE2A8', .5);
    vignette(c, .22, '#5a4632');
  }

  // ---------- S1 bis : le bureau vu de dessus (le tampon, les dossiers) ----------
  function drawDeskStatic(c) {
    let g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#E2C9A2'); g.addColorStop(1, '#C9AB7E'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const r = rng(7); c.strokeStyle = 'rgba(120,84,46,.16)'; c.lineWidth = 2;
    for (let i = 0; i < 46; i++) { const y = -LM + i * 48 + r() * 20; c.beginPath(); c.moveTo(-LM, y); for (let x = -LM; x < W + LM; x += 60) c.lineTo(x, y + Math.sin(x / 180 + i) * 6); c.stroke(); }
    c.save(); c.globalAlpha = .3; c.fillStyle = '#FFF6E2'; c.beginPath(); c.moveTo(-LM, 200); c.lineTo(520, -LM); c.lineTo(1100, -LM); c.lineTo(-LM, 1500); c.fill(); c.restore();
  }
  const DESK = prerender(drawDeskStatic);
  const PEOPLE = [0, 1, 2, 3, 4, 5, 6].map(i => ({ age: [.9, .3, 1, .6, .8, .2, .95][i], tone: ['#C9D4DC', '#D8CCD6', '#CFD8C8', '#DCD2C2', '#C8D0DC', '#D8D2C8', '#D2CCDA'][i] }));
  function sheet(c, x, y, rot, s, who, faded, stampA) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    c.fillStyle = 'rgba(70,46,20,.22)'; c.fillRect(-196, -246, 400, 510);
    c.fillStyle = '#FBF8F1'; c.fillRect(-200, -260, 400, 510);
    c.fillStyle = '#E9E2D4'; c.fillRect(-200, -260, 400, 46);
    c.fillStyle = PEOPLE[who].tone; c.fillRect(-170, -190, 150, 190);
    c.save(); c.beginPath(); c.rect(-170, -190, 150, 190); c.clip(); c.globalAlpha = 1 - .62 * faded; c.fillStyle = '#2a2430'; bustSil(c, -95, 4, .42, PEOPLE[who].age); c.restore();
    if (faded > 0) { c.fillStyle = rgba('#8a8a8a', .45 * faded); c.fillRect(-170, -190, 150, 190); }
    c.fillStyle = '#CFC6B6'; for (let k = 0; k < 4; k++) c.fillRect(10, -180 + k * 42, 150 - k * 18, 14);
    for (let k = 0; k < 6; k++) c.fillRect(-170, 40 + k * 32, 330 - (k % 3) * 40, 12);
    if (stampA > 0) { c.save(); c.globalAlpha = .85 * stampA; c.translate(70, 120); c.rotate(-.18); c.strokeStyle = '#C0392B'; c.lineWidth = 8; c.strokeRect(-110, -44, 220, 88); c.font = '800 54px Fraunces'; c.fillStyle = '#C0392B'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CLASSÉ', 0, 4); c.restore(); }
    c.restore();
  }
  function scene1b(c, t) {
    const z = 1.08 - .08 * prog(t, T.ins, T.s2 + .5, 'inOutSine');
    camSafe(c, z, 540, 900); blit(c, DESK);
    const EV = [T.consc, T.actes, T.souffrir];
    // la pile des dossiers déjà traités (en haut à droite), qui grossit
    const done = EV.filter(e => t > e + .7).length, fan = prog(t, T.humains - .4, T.humains + .8, 'outCubic');
    const pileN = 3 + done + Math.round(3 * fan);
    for (let i = 0; i < pileN; i++) sheet(c, 820 - fan * (i - pileN / 2) * 64 + i * 3, 560 + i * 4 + fan * Math.abs(i - pileN / 2) * 14, -.3 + i * .05 + fan * (i - pileN / 2) * .09, .46, (i + 3) % 7, 1, 1);
    // le dossier en cours
    let k = EV.findIndex(e => t < e + .7); if (k < 0) k = EV.length;
    if (k < EV.length) {
      const e = EV[k], slideIn = prog(t, e - 1.1, e - .45, 'outCubic'), slideOut = prog(t, e + .35, e + .7, 'inCubic');
      sheet(c, lerp(-300, 470, slideIn) + slideOut * 360, lerp(1250, 1000, slideIn) - slideOut * 440, -.06 + .1 * (1 - slideIn) + .2 * slideOut, 1 - .5 * slideOut, k, prog(t, e + .02, e + .45), t > e ? 1 : 0);
      // le tampon et la manche : il descend, frappe, remonte
      const d = t - e, lift = d < 0 ? 1 - prog(d, -.4, -.02, 'inCubic') : prog(d, .1, .45, 'inOutSine');
      const sx = 560 + 40 * lift, sy = 1110 - 60 * lift, ss = 1 + .35 * lift;
      c.fillStyle = 'rgba(60,40,20,.25)'; c.beginPath(); c.ellipse(sx + 40 * lift, sy + 40 + 50 * lift, 120 * ss, 60 * ss, 0, 0, 6.283); c.fill();
      // le tampon en bois (vu de dessus) : la semelle, puis la poignée
      c.save(); c.translate(sx, sy); c.scale(ss, ss);
      c.fillStyle = '#7a5434'; c.beginPath(); c.roundRect(-100, -46, 200, 92, 10); c.fill(); c.fillStyle = '#9a6e46'; c.beginPath(); c.roundRect(-88, -36, 176, 72, 8); c.fill();
      c.fillStyle = '#B0342C'; c.fillRect(-100, 40, 200, 8);
      const kg = c.createRadialGradient(-12, -14, 4, 0, 0, 56); kg.addColorStop(0, '#C89868'); kg.addColorStop(1, '#6e4a2c'); c.fillStyle = kg; c.beginPath(); c.arc(0, 0, 54, 0, 6.283); c.fill(); c.restore();
      // la main qui le tient, et la manche (silhouette)
      sil(c, cc => { cc.lineCap = 'round'; cc.lineWidth = 110 * ss; cc.beginPath(); cc.moveTo(W + 200, sy + 300); cc.lineTo(sx + 120 * ss, sy + 70 * ss); cc.stroke();
        cc.beginPath(); cc.ellipse(sx + 34 * ss, sy + 8 * ss, 62 * ss, 50 * ss, -.5, 0, 6.283); cc.fill(); }, '#FFF4E0', 3);
      c.fillStyle = '#E9E2D2'; c.save(); c.translate(sx + 120 * ss, sy + 70 * ss); c.rotate(-.62); c.fillRect(-58 * ss, -8 * ss, 116 * ss, 14 * ss); c.restore();
      if (d > 0 && d < .25) glow(c, 470, 1000, 300, '#FFFFFF', .35 * (1 - d / .25));
    }
    vignette(c, .25, '#4a3418');
  }

  // ---------- S2 : le mur de lumière et les fils ----------
  function drawWallStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9E3D8'); g.addColorStop(.45, '#F8F4EC'); g.addColorStop(1, '#E5DDCF'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 820, 700, '#FFFFFF', .9);
    g = c.createLinearGradient(0, 1580, 0, H); g.addColorStop(0, '#D8D0C2'); g.addColorStop(1, '#C6BCAB'); c.fillStyle = g; c.fillRect(-LM, 1580, W + 2 * LM, H - 1580 + LM);
    c.fillStyle = 'rgba(120,108,92,.25)'; c.fillRect(-LM, 1576, W + 2 * LM, 6);
  }
  const WALL = prerender(drawWallStatic);
  function scene2(c, t) {
    const z = 1 + .08 * prog(t, T.s2 - .6, T.s3 + .6, 'inOutSine');
    camSafe(c, z, 540, 1080); blit(c, WALL);
    const pull = prog(t, T.obeir - .5, T.obeir + .4, 'outBack') * .9, sway = Math.sin(t * 1.7) * 3;
    // l'ombre immense sur le mur
    c.save(); c.globalAlpha = .26; c.filter = 'blur(5px)'; c.fillStyle = c.strokeStyle = '#4a4458'; c.translate(540, 1580); c.transform(1.5, 0, -.25, 1.55, 0, 0); c.translate(-540, -1580); standPath(c, 540, 1580, 3.0, { pull, stamp: 1 }); c.restore();
    LIGHT(c, 540, 1200, 380, .5);
    let pts; sil(c, cc => { pts = standPath(cc, 540 + sway * .3, 1580, 3.0, { pull, stamp: 1 }); }, RIM, 3);
    // les fils dorés qui descendent jusqu'aux poignets et à la tête
    const th = prog(t, T.innocente - .3, T.obeir, 'inOutSine');
    if (th > 0) {
      c.save(); c.strokeStyle = 'rgba(176,132,60,.9)'; c.lineWidth = 2.4; c.shadowColor = 'rgba(255,214,140,.9)'; c.shadowBlur = 10;
      [pts.hl, pts.hr, pts.head].forEach(([x, y], i) => { const top = -60, yy = lerp(top, y, th); c.beginPath(); c.moveTo(x + (i - 1) * 40 + sway, top); c.lineTo(lerp(x + (i - 1) * 40 + sway, x, th), yy); c.stroke(); });
      c.restore();
    }
    vignette(c, .18, '#6a5a48');
  }

  // ---------- S3 : le laboratoire des années 1960 ----------
  function drawLabStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#D3DDCC'); g.addColorStop(.55, '#E1E8DA'); g.addColorStop(1, '#C5D0BD'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 420, 560, 520, '#FFFFF4', .7);
    c.fillStyle = '#B7C4AE'; c.fillRect(-LM, 1270, W + 2 * LM, 110); c.fillStyle = '#A9B6A0'; c.fillRect(-LM, 1266, W + 2 * LM, 6);
    g = c.createLinearGradient(0, 1380, 0, H); g.addColorStop(0, '#CFC9BA'); g.addColorStop(1, '#B9B2A2'); c.fillStyle = g; c.fillRect(-LM, 1380, W + 2 * LM, H - 1380 + LM);
    // la vitre dépolie (la pièce voisine)
    c.fillStyle = '#9AA394'; c.fillRect(682, 586, 336, 560);
    c.fillStyle = '#E8EEF0'; c.fillRect(700, 604, 300, 524);
    c.fillStyle = '#9AA394'; c.fillRect(844, 604, 12, 524);
  }
  const LAB = prerender(drawLabStatic);
  function scene3(c, t) {
    const z = 1 + .06 * prog(t, T.s3 - .6, T.s4 + .6, 'inOutSine');
    camSafe(c, z, 540, 1040); blit(c, LAB);
    // derrière la vitre : un inconnu, assis
    const un = prog(t, T.inconnu - .4, T.inconnu + .5, 'outCubic');
    c.save(); c.beginPath(); c.rect(700, 604, 300, 524); c.clip(); c.filter = 'blur(7px)'; c.globalAlpha = .35 + .5 * un; c.fillStyle = '#3a3a44'; bustSil(c, 850, 1140, .78, 1); c.restore();
    if (un > 0) glow(c, 850, 860, 260, '#FFFFFF', .25 * un);
    // l'expérimentateur, en blouse grise, derrière
    const lean = prog(t, T.autorite - .4, T.autorite + .4, 'outCubic');
    LIGHT(c, 250, 880, 260, .5);
    sil(c, cc => { standPath(cc, 250 + 30 * lean, 1420, 3.0, { pull: .35 * lean }); }, RIM, 3, { body: '#5f6660' });
    // la table et le générateur
    c.fillStyle = '#6f5a44'; c.fillRect(70, 1230, 940, 26); c.fillRect(100, 1256, 20, 200); c.fillRect(960, 1256, 20, 200);
    let g = c.createLinearGradient(0, 980, 0, 1230); g.addColorStop(0, '#A7ACA6'); g.addColorStop(1, '#868B85'); c.fillStyle = g; c.beginPath(); c.roundRect(110, 980, 860, 250, 14); c.fill();
    c.fillStyle = '#5a5f5a'; c.fillRect(130, 1000, 820, 40); c.font = '600 22px Fraunces'; c.fillStyle = '#E8E4D8'; c.textAlign = 'center'; c.fillText('GÉNÉRATEUR', 540, 1028);
    const nSw = 30, kf = 30 * prog(t, T.decharges - .2, T.s4 - .6, 'linear');
    switchRow(c, 150, 930, 1150, nSw, kf, { h: 52, lamp: u => mix('#F2C27D', '#D8403A', u) });
    c.font = '600 15px Fraunces'; c.fillStyle = '#2a2a2a'; [0, 6, 12, 18, 24, 29].forEach(i => c.fillText(String(15 * (i + 1)), 150 + 26 * (i + .5), 1206));
    c.fillStyle = '#B0342C'; c.font = '800 16px Fraunces'; c.fillText('XXX', 150 + 26 * 28.5 + 13, 1222);
    // le cadran : l'aiguille monte
    c.fillStyle = '#F4F0E2'; c.beginPath(); c.arc(220, 1080, 30, Math.PI, 0); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 3; const na = Math.PI + Math.PI * clamp(kf / 30);
    c.beginPath(); c.moveTo(220, 1080); c.lineTo(220 + Math.cos(na) * 26, 1080 + Math.sin(na) * 26); c.stroke();
    // le participant, de dos, au premier plan : sa main va à l'interrupteur suivant
    const cur = Math.min(29, Math.floor(kf)), hx = 150 + 26 * (cur + .5), hy = 1150;
    LIGHT(c, 300, 1460, 300, .35, '#FFFFFF');
    sil(c, cc => { cc.lineCap = 'round'; cc.lineWidth = 40; cc.beginPath(); cc.moveTo(410, 1772); cc.quadraticCurveTo(lerp(410, hx, .5) + 60, 1440, hx, hy + 24); cc.stroke(); cc.beginPath(); cc.ellipse(hx, hy + 18, 28, 22, 0, 0, 6.283); cc.fill(); bustSil(cc, 220, 1930, .85, 1); }, RIM, -3);
    vignette(c, .2, '#3a4a3a');
  }

  // ---------- S4 : la salle d'audience (la cage de verre vide) ----------
  function drawCourtStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E0CFB2'); g.addColorStop(.5, '#EEE2CC'); g.addColorStop(1, '#D6C3A2'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(140,110,70,.25)'; c.lineWidth = 3; for (let x = -LM; x < W + LM; x += 90) { c.beginPath(); c.moveTo(x, 520); c.lineTo(x, 1500); c.stroke(); }
    [[60, 300], [390, 300], [720, 300]].forEach(([x, w]) => { g = c.createLinearGradient(0, 600, 0, 1180); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#EAF0F4'); c.fillStyle = '#B8A07C'; c.fillRect(x - 10, 590, w + 20, 600); c.fillStyle = g; c.fillRect(x, 600, w, 580); c.fillStyle = '#B8A07C'; c.fillRect(x + w / 2 - 5, 600, 10, 580); c.fillRect(x, 880, w, 8); glow(c, x + w / 2, 880, 260, '#FFFFFF', .6); });
    g = c.createLinearGradient(0, 1500, 0, H); g.addColorStop(0, '#E2D3B8'); g.addColorStop(1, '#CDB794'); c.fillStyle = g; c.fillRect(-LM, 1500, W + 2 * LM, H - 1500 + LM);
    c.fillStyle = '#7A5E40'; c.fillRect(-LM, 1700, W + 2 * LM, 40); c.fillRect(-LM, 1740, W + 2 * LM, 260);
  }
  const COURT = prerender(drawCourtStatic);
  function scene4(c, t) {
    const z = 1 + .1 * prog(t, T.s4 - .6, T.s4b + .6, 'inOutSine');
    camSafe(c, z, 540, 1180); blit(c, COURT);
    // la cage de verre, vide
    const bx = 300, by = 860, bw = 480, bh = 640;
    c.fillStyle = '#6b5a45'; c.fillRect(bx - 20, by + bh, bw + 40, 30);
    c.fillStyle = '#8a6e50'; c.fillRect(bx + 60, by + 470, 360, 18); c.fillRect(bx + 80, by + 488, 14, 150); c.fillRect(bx + 386, by + 488, 14, 150);
    c.fillStyle = '#FBF6EA'; c.save(); c.translate(bx + 170, by + 462); c.rotate(-.06); c.fillRect(-60, -6, 120, 8); c.restore(); c.fillRect(bx + 250, by + 458, 110, 10);
    c.strokeStyle = '#3a3330'; c.lineWidth = 5; c.beginPath(); c.moveTo(bx + 300, by + 470); c.lineTo(bx + 300, by + 400); c.lineTo(bx + 270, by + 380); c.stroke();
    c.fillStyle = '#5e4c3a'; c.fillRect(bx + 200, by + 380, 80, 14); c.fillRect(bx + 206, by + 394, 10, 230); c.fillRect(bx + 264, by + 394, 10, 230); c.fillRect(bx + 200, by + 300, 12, 90);
    c.fillStyle = 'rgba(220,235,240,.28)'; c.fillRect(bx, by, bw, bh);
    c.strokeStyle = '#4a4038'; c.lineWidth = 8; c.strokeRect(bx, by, bw, bh); c.lineWidth = 5; c.beginPath(); c.moveTo(bx, by + 300); c.lineTo(bx + bw, by + 300); c.moveTo(bx + bw / 2, by); c.lineTo(bx + bw / 2, by + 300); c.stroke();
    const sh = (t * .12) % 1; c.save(); c.beginPath(); c.rect(bx, by, bw, bh); c.clip(); c.globalAlpha = .4; c.fillStyle = '#FFFFFF';
    [0, .35].forEach(o => { const x = bx - 200 + ((sh + o) % 1) * (bw + 400); c.beginPath(); c.moveTo(x, by); c.lineTo(x + 60, by); c.lineTo(x - 140, by + bh); c.lineTo(x - 200, by + bh); c.fill(); }); c.restore();
    vignette(c, .2, '#5a4426');
  }
  // ---------- S4 bis : la salle blanche — on cesse de penser ----------
  const CROWD9 = (() => { const out = [], r = rng(91); for (let row = 0; row < 4; row++) { const n = [7, 6, 5, 3][row], y = 860 + row * 96, s = [.85, 1.02, 1.24, 1.5][row], sp = [140, 168, 200, 300][row]; for (let i = 0; i < n; i++) { const x = 540 + (i - (n - 1) / 2) * sp + (row % 2 ? 0 : 20); out.push({ x, y, s, row, off: r(), me: row === 3 && i === 1 }); } } return out; })();
  function drawHallStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E8E5DF'); g.addColorStop(.45, '#F7F5F1'); g.addColorStop(1, '#DCD6CC'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(120,110,96,.18)'; c.lineWidth = 2; for (let k = -8; k <= 8; k++) { c.beginPath(); c.moveTo(540 + k * 40, 900); c.lineTo(540 + k * 260, H + LM); c.stroke(); }
    for (let y = 900, d = 30; y < H + LM; y += d, d *= 1.18) { c.beginPath(); c.moveTo(-LM, y); c.lineTo(W + LM, y); c.stroke(); }
    glow(c, 540, 700, 600, '#FFFFFF', .8);
  }
  const HALL = prerender(drawHallStatic);
  function scene4b(c, t) {
    const z = 1 + .06 * prog(t, T.s4b - .5, T.s5 + .5, 'inOutSine');
    camSafe(c, z, 540, 1160); blit(c, HALL);
    const t0 = T.cessons - .3, t1 = T.memes;
    sil(c, cc => CROWD9.forEach(p => standPath(cc, p.x, p.y + 140, p.s * .95, { stamp: 1 })), RIM, 2);
    CROWD9.forEach(p => {
      const head = [p.x, p.y + 140 - 196 * p.s * .95];
      const off = p.me ? 0 : prog(t, lerp(t0, t1, (3 - p.row) / 4 * .7 + p.off * .3), lerp(t0, t1, (3 - p.row) / 4 * .7 + p.off * .3) + .25);
      const on = p.me ? 1 + .8 * prog(t, T.memes - .2, T.memes + .5, 'outCubic') : 1 - off;
      if (on > .02) { glow(c, head[0], head[1] - 10 * p.s, 34 * p.s * on, '#FFD27A', .8 * Math.min(1, on)); c.fillStyle = rgba('#FFF0C8', Math.min(1, on)); c.beginPath(); c.arc(head[0], head[1] - 10 * p.s, 4.5 * p.s * Math.min(1.4, on), 0, 6.283); c.fill(); }
    });
    vignette(c, .16, '#6a6258');
  }

  // ---------- S5 : le livre dans le rayon de lumière (Actes 5:29) ----------
  function drawStoneStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#DCCBAE'); g.addColorStop(.5, '#EADDC6'); g.addColorStop(1, '#D3BF9C'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.strokeStyle = 'rgba(140,112,74,.22)'; c.lineWidth = 2; for (let y = -LM, row = 0; y < H + LM; y += 70, row++) { c.beginPath(); c.moveTo(-LM, y); c.lineTo(W + LM, y); c.stroke(); for (let x = -LM + (row % 2) * 70; x < W + LM; x += 140) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 70); c.stroke(); } }
    c.fillStyle = '#B49A72'; archPath(c, 800, 1180, 250, 440, false); c.fill();
    g = c.createLinearGradient(0, 760, 0, 1170); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FFF0D0'); c.fillStyle = g; archPath(c, 800, 1170, 220, 420, false); c.fill();
    g = c.createLinearGradient(0, 1560, 0, H); g.addColorStop(0, '#CDB894'); g.addColorStop(1, '#B9A27C'); c.fillStyle = g; c.fillRect(-LM, 1560, W + 2 * LM, H - 1560 + LM);
  }
  const STONE = prerender(drawStoneStatic);
  const MOTES = (() => { const r = rng(5); return Array.from({ length: 40 }, () => ({ u: r(), v: r(), s: .6 + r() * 1.4, p: r() * 6 })); })();
  function scene5(c, t) {
    const z = 1 + .07 * prog(t, T.s5 - .6, T.s5b + .6, 'inOutSine');
    camSafe(c, z, 540, 1120); blit(c, STONE);
    const lit = .6 + .4 * prog(t, T.dieu - .3, T.dieu + .5, 'outCubic');
    c.save(); c.globalCompositeOperation = 'screen'; c.filter = 'blur(14px)'; const g = c.createLinearGradient(800, 700, 450, 1300); g.addColorStop(0, rgba('#FFF4D6', .75 * lit)); g.addColorStop(1, 'rgba(255,244,214,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(700, 800); c.lineTo(900, 800); c.lineTo(640, 1330); c.lineTo(260, 1300); c.closePath(); c.fill(); c.restore();
    MOTES.forEach(m => { const k = (m.u + t * .02 * m.s) % 1, x = lerp(800, 450, k) + (m.v - .5) * 260 * (.4 + k), y = lerp(700, 1280, k) + Math.sin(t * .8 + m.p) * 10; c.fillStyle = rgba('#FFF8E8', .55 * lit); c.beginPath(); c.arc(x, y, m.s * 2, 0, 6.283); c.fill(); });
    // le pupitre et le livre ouvert
    c.fillStyle = '#5a4230'; c.beginPath(); c.moveTo(330, 1280); c.lineTo(560, 1220); c.lineTo(580, 1260); c.lineTo(350, 1330); c.closePath(); c.fill(); c.fillRect(430, 1300, 40, 300); c.fillRect(360, 1590, 180, 26);
    c.save(); c.translate(455, 1230); c.rotate(-.24);
    c.fillStyle = '#F8F0DE'; c.beginPath(); c.moveTo(-140, 0); c.quadraticCurveTo(-70, -26, 0, -6); c.lineTo(0, 30); c.quadraticCurveTo(-70, 10, -140, 34); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(140, 0); c.quadraticCurveTo(70, -26, 0, -6); c.lineTo(0, 30); c.quadraticCurveTo(70, 10, 140, 34); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(90,70,50,.35)'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(-120, 6 + k * 6); c.lineTo(-20, k * 6 - 4); c.moveTo(20, k * 6 - 4); c.lineTo(120, 6 + k * 6); c.stroke(); }
    c.restore();
    glow(c, 455, 1215, 200, '#FFF2CC', .45 * lit);
    vignette(c, .2, '#5a4426');
  }
  // ---------- S5 bis : l'arc et la géométrie (Coran 5:8) ----------
  function drawIwanStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E6D6BA'); g.addColorStop(1, '#D8C4A2'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    c.fillStyle = '#CDB48C'; archPath(c, 540, 1560, 800, 1060, true); c.fill();
    c.fillStyle = '#E2CFAE'; archPath(c, 540, 1560, 740, 1010, true); c.fill();
    c.save(); archPath(c, 540, 1300, 520, 640, true); c.clip();
    g = c.createLinearGradient(0, 660, 0, 1300); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FFF1D2'); c.fillStyle = g; c.fillRect(0, 600, W, 720);
    lattice(c, 280 - 30, 640 - 20, 600, 700, 92, '#9C7A46', 5, 1, 1); c.restore();
    c.strokeStyle = '#B89868'; c.lineWidth = 10; archPath(c, 540, 1300, 520, 640, true); c.stroke();
    g = c.createLinearGradient(0, 1560, 0, H); g.addColorStop(0, '#D9C3A0'); g.addColorStop(1, '#C7AE86'); c.fillStyle = g; c.fillRect(-LM, 1560, W + 2 * LM, H - 1560 + LM);
    // le motif projeté au sol par la lumière
    c.save(); c.beginPath(); c.moveTo(280, 1560); c.lineTo(800, 1560); c.lineTo(1000, H + LM); c.lineTo(80, H + LM); c.clip(); c.globalAlpha = .5; c.fillStyle = '#FFF3D8'; c.fillRect(0, 1560, W, 500);
    c.translate(540, 1560); c.transform(1, 0, 0, .4, 0, 0); c.translate(-540, -1560); lattice(c, 120, 1560, 860, 900, 92, '#A88452', 7, .6, 1); c.restore();
  }
  const IWAN = prerender(drawIwanStatic);
  function scene5b(c, t) {
    const z = 1.04 - .04 * prog(t, T.s5b - .6, T.s6 + .6, 'inOutSine');
    camSafe(c, z, 540, 1120); blit(c, IWAN);
    const j = prog(t, T.justice - .3, T.justice + .6, 'outCubic');
    glow(c, 540, 980, 420, '#FFF6DC', .35 + .3 * j);
    if (j > 0) { c.save(); c.strokeStyle = rgba('#C8A060', .8 * j); c.lineWidth = 4; c.shadowColor = 'rgba(255,220,150,.9)'; c.shadowBlur = 16; c.beginPath(); c.moveTo(540, 660); c.lineTo(540, lerp(660, 1880, j)); c.stroke(); c.restore(); }
    vignette(c, .18, '#6a5030');
  }

  // ---------- S6 : la rangée d'interrupteurs, de la vertu à l'abdication ----------
  function drawRailStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E6DCCB'); g.addColorStop(.5, '#F4EEE3'); g.addColorStop(1, '#DDD1BC'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    glow(c, 540, 1000, 640, '#FFFFFF', .7);
    g = c.createLinearGradient(40, 0, 1040, 0); g.addColorStop(0, '#E9D49E'); g.addColorStop(1, '#A9A4A0'); c.fillStyle = g; c.beginPath(); c.roundRect(30, 930, 1020, 200, 20); c.fill();
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(30, 1120, 1020, 10);
  }
  const RAIL = prerender(drawRailStatic);
  function scene6(c, t) {
    const z = 1.06 - .06 * prog(t, T.s6 - .6, T.s7 + .6, 'inOutSine');
    camSafe(c, z, 540, 1060); blit(c, RAIL);
    const cp = prog(t, T.moment - .3, T.conscience + .3, 'inOutSine'), cx = lerp(80, 960, cp);
    switchRow(c, 60, 1020, 1045, 24, (cx - 60) / 40, { h: 80, plate: '#5a5650', lamp: u => mix('#F2C27D', '#8a8480', u) });
    const v = prog(t, T.vertu - .3, T.vertu + .4, 'outCubic'), a = prog(t, T.abdication - .3, T.abdication + .4, 'outCubic');
    c.textAlign = 'center'; c.font = '700 40px Fraunces'; c.fillStyle = rgba('#9A7430', .55 + .45 * v); c.fillText('VERTU', 170, 1210);
    c.font = '700 30px Fraunces'; c.fillStyle = rgba('#5a5654', .5 + .5 * a); c.fillText('ABDICATION', 880, 1196); c.fillText('DE CONSCIENCE', 880, 1234);
    if (v > 0) glow(c, 170, 1196, 140, '#FFD98A', .4 * v);
    if (cp > 0 && cp < 1.01) {
      const ca = prog(t, T.moment - .3, T.moment + .2) * (1 - prog(t, T.s7 - .5, T.s7 - .1));
      c.save(); c.globalAlpha = ca; c.strokeStyle = '#C0A16A'; c.lineWidth = 4; c.shadowColor = 'rgba(255,214,140,.95)'; c.shadowBlur = 18; c.beginPath(); c.moveTo(cx, 880); c.lineTo(cx, 1150); c.stroke();
      c.font = 'italic 400 110px Instrument'; c.fillStyle = '#8A6420'; c.textAlign = 'center'; c.fillText('?', cx, 860); c.restore();
    }
    vignette(c, .18, '#5a4a36');
  }

  // ---------- S7 : la balance (l'intention et les actes) ----------
  function drawPaperStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#EADFC9'); g.addColorStop(.5, '#F5EDDD'); g.addColorStop(1, '#E3D5BC'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const r = rng(17); c.fillStyle = 'rgba(120,90,50,.05)'; for (let i = 0; i < 900; i++) c.fillRect(-LM + r() * (W + 2 * LM), -LM + r() * (H + 2 * LM), 2, 2);
    glow(c, 540, 1050, 560, '#FFFFFF', .6);
  }
  const PAPER = prerender(drawPaperStatic);
  function scene7(c, t) {
    const z = 1 + .05 * prog(t, T.s7 - .6, T.s8 + .6, 'inOutSine');
    camSafe(c, z, 540, 1080); blit(c, PAPER);
    const tip = prog(t, T.toujours - .2, T.responsable + .3, 'inOutCubic'), osc = Math.sin((t - T.responsable) * 7) * Math.exp(-Math.max(0, t - T.responsable) * 2.6) * .05 * (t > T.responsable ? 1 : 0);
    const ang = .2 * tip + osc, px = 540, py = 860, L = 330;
    const gold = c.createLinearGradient(0, 800, 0, 1600); gold.addColorStop(0, '#E8CD8A'); gold.addColorStop(1, '#9C7A3C');
    c.fillStyle = gold; c.fillRect(px - 9, py, 18, 640); c.beginPath(); c.ellipse(px, 1500, 150, 26, 0, 0, 6.283); c.fill(); c.beginPath(); c.arc(px, py, 22, 0, 6.283); c.fill();
    c.save(); c.translate(px, py); c.rotate(ang); c.fillRect(-L - 10, -8, 2 * L + 20, 16); c.restore();
    const ends = [-1, 1].map(sg => [px + Math.cos(ang) * L * sg, py + Math.sin(ang) * L * sg]);
    ends.forEach(([ex, ey], i) => {
      const pyy = ey + 300;
      c.strokeStyle = '#9C7A3C'; c.lineWidth = 3; [-80, 0, 80].forEach(dx => { c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + dx, pyy); c.stroke(); });
      c.fillStyle = gold; c.beginPath(); c.ellipse(ex, pyy, 110, 24, 0, 0, Math.PI); c.fill();
      if (i === 0) { // une plume : l'intention
        c.save(); c.translate(ex, pyy - 30); c.rotate(-.5); c.fillStyle = '#FFFDF6'; c.strokeStyle = '#C8B48A'; c.lineWidth = 2; c.beginPath(); c.moveTo(-70, 10); c.quadraticCurveTo(0, -40, 70, -6); c.quadraticCurveTo(0, 26, -70, 10); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-80, 14); c.lineTo(70, -4); c.stroke(); c.restore();
      } else { // les actes : des dossiers tamponnés
        for (let k = 0; k < 6; k++) { c.save(); c.translate(ex + (k % 2 ? 6 : -6), pyy - 14 - k * 16); c.rotate((k % 3 - 1) * .05); c.fillStyle = '#FBF7EE'; c.fillRect(-80, -8, 160, 14); c.fillStyle = 'rgba(192,57,43,.8)'; c.fillRect(30, -6, 34, 10); c.restore(); }
      }
      c.font = '700 30px Fraunces'; c.textAlign = 'center'; c.fillStyle = i ? '#7A2E2A' : '#8A6A2A'; c.fillText(i ? 'LES ACTES' : 'L’INTENTION', ex, pyy + 74);
    });
    vignette(c, .18, '#5a4a36');
  }

  // ---------- S8 : le grand bureau vu d'en haut (les questions qui s'éteignent) ----------
  const DESKS = (() => { const out = [], r = rng(77); for (let row = 0; row < 9; row++) for (let col = 0; col < 5; col++) out.push({ x: 540 + (col - 2) * 230, y: 1020 + (row - 4) * 200, me: row === 4 && col === 2, off: r(), ph: r() * 6 }); return out; })();
  function drawFloorStatic(c) {
    c.fillStyle = '#F3F0EA'; c.fillRect(-LM - 900, -LM - 1400, W + 2 * LM + 1800, H + 2 * LM + 2800);
    c.strokeStyle = 'rgba(150,140,124,.16)'; c.lineWidth = 2; for (let x = -1000; x < 2100; x += 115) { c.beginPath(); c.moveTo(x, -1500); c.lineTo(x, 3400); c.stroke(); } for (let y = -1500; y < 3400; y += 100) { c.beginPath(); c.moveTo(-1000, y); c.lineTo(2100, y); c.stroke(); }
  }
  function scene8(c, t) {
    const z = 1.65 - .8 * prog(t, T.s8 - .6, T.fin + .5, 'inOutSine');
    camSafe(c, z, 540, 1000); c.save(); drawFloorStatic(c); c.restore();
    glow(c, 540, 1000, 900, '#FFFFFF', .5);
    const t0 = T.demander - .3, t1 = T.juste - .35;
    DESKS.forEach(d => {
      c.fillStyle = 'rgba(80,70,60,.12)'; c.fillRect(d.x - 82, d.y - 34, 172, 92);
      c.fillStyle = '#E2D6C2'; c.fillRect(d.x - 86, d.y - 40, 172, 86); c.fillStyle = '#3c3a40'; c.fillRect(d.x - 40, d.y - 34, 80, 10);
      c.fillStyle = '#FBF8F1'; c.fillRect(d.x - 60, d.y - 8, 50, 36); c.fillRect(d.x + 14, d.y - 4, 44, 30);
    });
    DESKS.forEach(d => { c.fillStyle = '#A39C92'; c.beginPath(); c.roundRect(d.x - 44, d.y + 82, 88, 70, 18); c.fill(); }); // les chaises
    sil(c, cc => DESKS.forEach(d => { // vu d'en haut : les épaules, la tête, les deux bras posés sur le bureau
      cc.beginPath(); cc.ellipse(d.x, d.y + 96, 58, 25, 0, 0, 6.283); cc.fill();
      cc.lineCap = 'round'; cc.lineWidth = 15; cc.beginPath(); cc.moveTo(d.x - 46, d.y + 92); cc.lineTo(d.x - 34, d.y + 40); cc.moveTo(d.x + 46, d.y + 92); cc.lineTo(d.x + 30, d.y + 38); cc.stroke();
      cc.beginPath(); cc.arc(d.x, d.y + 82, 21, 0, 6.283); cc.fill(); }), RIM, 2);
    c.textAlign = 'center'; c.font = 'italic 400 86px Instrument';
    DESKS.forEach(d => {
      const off = d.me ? 0 : prog(t, lerp(t0, t1, d.off), lerp(t0, t1, d.off) + .3);
      let on = 1 - off; if (d.me) on = 1 - .55 * prog(t, t1 - .3, t1 + .1) + .9 * prog(t, T.juste - .1, T.juste + .5, 'outBack');
      if (on <= .02) return;
      const y = d.y + 40 + Math.sin(t * 1.6 + d.ph) * 4;
      if (d.me) { const bg = Math.max(0, on - .9); glow(c, d.x, y - 30, 70 + 110 * bg, '#FFD27A', .6 + .35 * Math.min(1, bg)); c.save(); c.font = `italic 400 ${Math.round(86 + 80 * bg)}px Instrument`; c.fillStyle = '#8A5A10'; c.fillText('?', d.x, y + 12 * bg); c.restore(); return; }
      glow(c, d.x, y - 26, 60 * on, '#FFD27A', .7 * Math.min(1, on));
      c.fillStyle = rgba('#9C6E1E', Math.min(1, on)); c.fillText('?', d.x, y);
    });
    vignette(c, .14, '#5a5048');
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

  const SCN = [[-1, T.ins, scene1], [T.ins, T.s2, scene1b], [T.s2, T.s3, scene2], [T.s3, T.s4, scene3], [T.s4, T.s4b, scene4], [T.s4b, T.s5, scene4b],
    [T.s5, T.s5b, scene5], [T.s5b, T.s6, scene5b], [T.s6, T.s7, scene6], [T.s7, T.s8, scene7], [T.s8, DUR + 1, scene8]];
  const TRS = [
    { at: T.ins, d: .9, kind: 'dissolve', a: scene1, b: scene1b },
    { at: T.s2, d: 1.1, kind: 'warm', a: scene1b, b: scene2 },
    { at: T.s3, d: 1.1, kind: 'drift', a: scene2, b: scene3 },
    { at: T.s4, d: 1.1, kind: 'dissolve', a: scene3, b: scene4 },
    { at: T.s4b, d: .9, kind: 'dissolve', a: scene4, b: scene4b },
    { at: T.s5, d: 1.1, kind: 'warm', a: scene4b, b: scene5 },
    { at: T.s5b, d: 1.0, kind: 'drift', a: scene5, b: scene5b },
    { at: T.s6, d: 1.1, kind: 'tilt', a: scene5b, b: scene6, o: { dir: 1 } },
    { at: T.s7, d: 1.0, kind: 'dissolve', a: scene6, b: scene7 },
    { at: T.s8, d: 1.1, kind: 'warm', a: scene7, b: scene8 },
  ];
  // le geste régulier du plan large (S1) : un coup de tampon toutes les 1,7 s
  for (let ts = .9; ts < T.ins - .3; ts += 1.7) S1_STAMPS.push(ts);
  // voile discret derrière les textes du haut (décors clairs)
  const TV = [[-1, T.s1c - .2], [T.s2 - .2, T.fin]];
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
    if (tv > 0) { const g = ctx.createLinearGradient(0, 210, 0, 760); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.22, rgba('#0a080c', .52 * tv)); g.addColorStop(.78, rgba('#0a080c', .52 * tv)); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 210, W, 550); }
    const sa = Math.max(subAlpha(chunkAt(t), t), tRJ[0].style.opacity * 1 || 0); // un voile discret derrière les sous-titres (et la citation d'Arendt)
    if (sa > 0) { const g = ctx.createLinearGradient(0, 1230, 0, 1480); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.35, rgba('#0a080c', .34 * sa)); g.addColorStop(.7, rgba('#0a080c', .34 * sa)); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 1230, W, 250); }
    grain(ctx, f, .06);
    if (!COVER) { EH.bug(ctx, t, { out: T.fin - .35 }); EH.endCard(ctx, t, T.fin); } // habillage de la série
    texts(t); subs(t);
  }
  function revealWords(nodes, t, t0, out) { nodes.forEach(n => { n.style.opacity = out > 0 && t > t0 - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const st = +s.dataset.t, p = prog(t, st - .04, st + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * out, blur: (1 - p) * 6 }); }); }); }
  function texts(t) {
    // l'accroche : visible dès la première image
    const ko = 1 - prog(t, T.s1c - .5, T.s1c - .1, 'inCubic'), kz = prog(t, 0, 1.2, 'outCubic');
    tKick.forEach((n, k) => set(n, { o: ko, s: 1.02 - .02 * kz, y: 0, blur: 0 }));
    revealWords(tQ2, t, T.q2, 1 - prog(t, T.s3 - .4, T.s3 - .1, 'inCubic'));
    const e3 = T.s3b - .15;
    slam(tMil, t, T.milgram - .1, e3, .3); fade(tMilSub, t, T.milgram + .35, e3, .6, 8, .3);
    const e3b = T.s4 - .35;
    tFict.forEach((n, k) => fade(n, t, T.croient - .15 + k * .25, e3b, .5, 10, .3)); slam(tCont, t, T.continuer - .1, e3b, .3); fade(tStat, t, T.continuer - .3, e3b, .6, 4, .3);
    const e4 = T.s4b - .3;
    slam(tAr, t, T.arendt - .1, e4, .3); fade(tArSub, t, T.arendt + .4, e4, .6, 8, .3); slam(tBan, t, T.derangeante - .2, e4, .3);
    revealWords(tQ4, t, T.q4, 1 - prog(t, T.s5 - .4, T.s5 - .1, 'inCubic'));
    tRJ.forEach((n, k) => fade(n, t, T.cessons - .2 + k * .25, T.s5 - .35, .6, 8, .3));
    const e5 = T.s5b - .3;
    fade(tAct, t, T.s5 + .3, e5, .5, 8, .3); tActQ.forEach((n, k) => fade(n, t, T.dieu - .7 + k * .45, e5, .6, 12, .3)); fade(tActRef, t, T.hommes, e5, .6, 6, .3);
    const e5b = T.s6 - .35;
    fade(tSur, t, T.coran - .2, e5b, .5, 8, .3); fade(tSurAr, t, T.coran + .1, e5b, .6, 8, .3);
    tSurQ.forEach((n, k) => fade(n, t, T.justice - .3 + k * .35, e5b, .6, 12, .3)); fade(tSurRef, t, T.justice + .9, e5b, .6, 6, .3);
    fade(tPb1, t, T.s6 + .25, T.q6 - .25, .4, 12, .25); slam(tPb2, t, T.probleme - .15, T.q6 - .25, .25);
    revealWords(tQ6, t, T.q6, 1 - prog(t, T.s7 - .4, T.s7 - .1, 'inCubic'));
    revealWords(tQ7, t, T.q7, 1 - prog(t, T.s8 - .4, T.s8 - .1, 'inCubic'));
    revealWords(tQ8, t, T.q8, 1 - prog(t, T.fin - .45, T.fin - .1, 'inCubic'));
  }

  /* ---------- événements sonores (la musique de fond est continue) ---------- */
  [['s2', T.s2], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7], ['s8', T.s8]].forEach(([n, x]) => sfx('sec_' + n, x));
  TRS.forEach(x => sfx('tr_' + x.kind, x.at - x.d / 2, { d: x.d }));
  sfx('signature', 0); sfx('signature', T.fin); sfx('reveal', T.fin);
  sfx('room', 0, { d: T.ins + .5 }); S1_STAMPS.forEach(x => sfx('stamp', x, { g: .5 })); sfx('tick', T.matin - .2, { d: 1.6 });
  [T.consc, T.actes, T.souffrir].forEach(x => sfx('stamp', x, { g: 1 })); sfx('glow', T.humains);
  sfx('threads', T.innocente - .3, { d: T.obeir - T.innocente + .6 }); sfx('question', T.q2);
  sfx('hum', T.s3, { d: T.s4 - T.s3 + .4 }); sfx('switches', T.decharges - .2, { d: T.s4 - .6 - T.decharges + .2, n: 30 }); sfx('glass', T.inconnu - .3); sfx('tension', T.autorite - .3, { d: 1.8 });
  sfx('air', T.s4, { d: T.s4b - T.s4 + .5 }); sfx('glow', T.derangeante); sfx('lightsout', T.cessons - .3, { d: T.memes - T.cessons + .3, n: 34 }); sfx('glow', T.memes);
  sfx('glow', T.dieu); sfx('glow', T.justice);
  sfx('switches', T.moment - .3, { d: T.conscience - T.moment + .6, n: 24 }); sfx('question', T.q6);
  sfx('scale', T.responsable - .4, { d: 1.4 });
  sfx('lightsout', T.demander - .3, { d: T.juste - T.demander, n: 44 }); sfx('glow', T.juste); sfx('question', T.q8);

  window.DURATION = DUR; window.__T = T;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : le bureau au matin, la question de l'épisode, le logo et le nom
    COVER = true; render(2.2); COVER = false;
    tKick.forEach((n, k) => { set(n, { o: 1, s: 1, y: 120, blur: 0 }); });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createLinearGradient(0, 230, 0, 900); g.addColorStop(0, 'rgba(10,8,12,0)'); g.addColorStop(.2, 'rgba(10,8,12,.5)'); g.addColorStop(.8, 'rgba(10,8,12,.5)'); g.addColorStop(1, 'rgba(10,8,12,0)'); ctx.fillStyle = g; ctx.fillRect(0, 230, W, 670);
    EH.icon(ctx, 382, 330, 46); EH.wordmark(ctx, 446, 346, .48, { align: 'left', motto: false });
    SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
