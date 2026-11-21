/* =====================================================================
   L'ÉNIGME HUMAINE — Épisode 003 — « La foi s'oppose-t-elle à la raison ? »
   Format de série (voir series/enigme-humaine/FORMAT.md). Minutage piloté par timeline.json.
   Une grande leçon à travers les siècles. Décors nouveaux :
   la bibliothèque des siècles (voûte à caissons, perspective), le manuscrit RATIO / FIDES,
   l'arche et sa clé de voûte, la Bible au lutrin (lumière naturelle, profondeur de champ),
   la cour à arcades (alternance du jour et de la nuit), la chapelle et le panneau de
   Carlo Crivelli (1476, domaine public), le chiasme de la leçon.
   ===================================================================== */
(async function () {
  const { prog, clamp, lerp, el, set, sfx } = GX;
  const { W, H, rgba, mix, grain, vignette, glow, beam, makeDust, dust, person, lattice, archPath, star8, khatam, rng, off } = CINE;
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', bord: '#541D2A', night: '#19283C', rose: '#E8949A', lamp: '#F2C27D', parch: '#EAD9B6', ink: '#3b2a1a', red: '#8E2F2A' };

  const TL = await (await fetch('timeline.json')).json();
  const SEN = id => TL.sentences.find(s => s.id === id);
  const cue = (id, w, k = 0) => { const ws = SEN(id).words.filter(x => x.w === w); return (ws[k] || ws[0]).start; };
  const DUR = TL.duration;
  await Promise.all(['500 40px Bodoni', '700 40px Bodoni', '900 40px Bodoni', '600 40px Inter', '400 40px Fraunces', '500 40px Fraunces', '600 40px Fraunces', '800 40px Fraunces',
    'italic 600 40px Fraunces', 'italic 700 40px Fraunces', '400 40px Instrument', 'italic 400 40px Instrument', '500 40px Garamond'].map(f => document.fonts.load(f, 'Aaé')));
  await document.fonts.load('400 40px Amiri', 'آل عمران');
  const IMG = new Image(); IMG.src = 'assets/aquinas.jpg'; await IMG.decode();

  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const TX = document.getElementById('txt'), SUBS = document.getElementById('subs');

  /* ---------- repères (tous issus de la voix) ---------- */
  const T = {
    eleve: cue('s1a', 'eleve'), voudrais: cue('s1a', 'voudrais'), reflechisses: cue('s1a', 'reflechisses'), question: cue('s1a', 'question'),
    foi: cue('s1b', 'foi'), oppose: cue('s1b', 'oppose'), reellement: cue('s1b', 'reellement'), raisonQ: cue('s1b', 'raison'), qEnd1: SEN('s1b').end,
    s2: SEN('s2a').start - .55, distinction: cue('s2a', 'distinction'),
    raison2: cue('s2b', 'raison'), examine: cue('s2b', 'examine'), affirmation: cue('s2b', 'affirmation'), coherente: cue('s2b', 'coherente'), repose: cue('s2b', 'repose'),
    foi2: cue('s2c', 'foi'), confiance: cue('s2c', 'confiance'), dieu: cue('s2c', 'dieu'), verite: cue('s2c', 'verite'), revelee: cue('s2c', 'revelee'),
    s3: SEN('s3a').start - .45, deux: cue('s3a', 'deux'), differentes: cue('s3a', 'differentes'), attention: cue('s3b', 'attention'), differente: cue('s3b', 'differente'), ennemie: cue('s3b', 'ennemie'),
    s4: SEN('s4a').start - .45, bible: cue('s4a', 'bible'), thess: cue('s4a', 'thessaloniciens'), examinez: cue('s4b', 'examinez'), choses: cue('s4b', 'choses'), retenez: cue('s4b', 'retenez'), bon: cue('s4b', 'bon'),
    s5: SEN('s5a').start - .45, coran: cue('s5a', 'coran'), sourate: cue('s5a', 'sourate'), creation: cue('s5b', 'creation'), signes: cue('s5b', 'signes'), raison5: cue('s5b', 'raison'), reflexion: cue('s5b', 'reflexion'),
    s6: SEN('s6a').start - .45, thomas: cue('s6a', 'thomas'), theologien: cue('s6a', 'theologien'), distinguait: cue('s6b', 'distinguait'), raison6: cue('s6b', 'raison'), connaitre: cue('s6b', 'connaitre'), depasse: cue('s6b', 'depasse'), revelation: cue('s6b', 'revelation'),
    s7: SEN('s7a').start - .45, lecon: cue('s7a', 'lecon'), croire: cue('s7b', 'croire'), dispense: cue('s7b', 'dispense'), reflechir: cue('s7b', 'reflechir'),
    swap: cue('s7c', 'reflechir'), signifie: cue('s7c', 'signifie'), cesser: cue('s7c', 'cesser'), croire2: cue('s7c', 'croire'),
    s8: SEN('s8a').start - .5, q: SEN('s8a').start, eleve8: cue('s8a', 'eleve'), questions: cue('s8a', 'questions'), peur: cue('s8a', 'peur'), poser: cue('s8a', 'poser'), qEnd: SEN('s8a').end,
  };
  T.title = T.qEnd + .5; T.qWords = SEN('s8a').words; T.phaseB = T.distinguait - .15; T.s5end = SEN('s5b').end;

  /* ---------- texte (DOM) ---------- */
  const tx = (html, cls, style) => el('div', TX, { class: 'tx ' + cls, style: Object.assign({ opacity: 0 }, style) }, html);
  function fit(n, maxW) { const w = n.style.width, d = n.style.display; n.style.width = 'auto'; n.style.display = 'inline-block'; let fs = parseFloat(n.style.fontSize); while (n.offsetWidth > maxW && fs > 10) { fs -= 1; n.style.fontSize = fs + 'px'; } n.style.width = w; n.style.display = d; return n; }
  function slam(n, t, t0, t1, out = .3) { const a = prog(t, t0, t0 + .07, 'linear'), z = prog(t, t0, t0 + .45, 'outExpo'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { s: 1.12 - .12 * z, o: a * o, blur: (1 - a) * 6 }); }
  function wipe(n, t, t0, t1, dur = .7, out = .45) { const p = prog(t, t0, t0 + dur, 'outQuart'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); n.style.clipPath = `inset(-20% ${(100 - p * 100).toFixed(2)}% -20% 0)`; set(n, { x: (1 - p) * 18, o: o * (p > 0 ? 1 : 0) }); }
  function fade(n, t, t0, t1, d = .5, dy = 14, out = .45) { const p = prog(t, t0, t0 + d, 'outCubic'), o = 1 - prog(t, t1, t1 + out, 'inCubic'); set(n, { y: (1 - p) * dy, o: p * o, blur: (1 - p) * 4 }); }
  const grad = (a, b, c) => `background:linear-gradient(180deg,${a} 0%,${b} 55%,${c} 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(0,0,0,.6))`;
  const gspan = (txt, a, b, c, pad = '6px .08em 4px') => `<span style="display:inline-block;padding:${pad};${grad(a, b, c)}">${txt}</span>`;
  const CENTER = { left: '0', width: '1080px', textAlign: 'center' };

  // ouverture (identité de série)
  const tSeries = tx(`<div class="instrument" style="font-style:italic;font-size:132px;line-height:.95;padding:10px 0 6px;${grad('#FFF7F2', '#F8D2CF', '#EE9FA4')}">L’Énigme humaine</div><div class="fraunces" style="font-weight:500;font-size:28px;letter-spacing:.42em;color:${C.rose};margin-top:14px;padding-left:.42em">ÉPISODE&nbsp;&nbsp;003</div>`, '', Object.assign({ top: '150px', textShadow: 'none' }, CENTER));
  // S1 — la question
  const tQ1 = tx(gspan('LA FOI', '#FFF4F2', '#F6C9C6', '#E8949A', '14px .06em 4px'), 'bodoni', Object.assign({ top: '300px', fontWeight: 900, fontSize: '150px', textShadow: 'none' }, CENTER));
  const tQ2 = tx('s’oppose-t-elle', 'instrument', Object.assign({ top: '492px', fontStyle: 'italic', fontSize: '96px' }, CENTER));
  const tQ3 = tx('réellement', 'instrument', Object.assign({ top: '590px', fontStyle: 'italic', fontSize: '96px', color: 'rgba(242,239,232,.86)' }, CENTER));
  const tQ4 = fit(tx(gspan('À LA RAISON&#8239;?', '#FFFFFF', '#F3E6CC', C.gold, '14px .06em 4px'), 'bodoni', Object.assign({ top: '700px', fontWeight: 900, fontSize: '124px', textShadow: 'none' }, CENTER)), 1000);
  // S2 — la distinction (manuscrit)
  const tDist = tx('UNE DISTINCTION', 'fraunces', Object.assign({ top: '196px', fontWeight: 600, fontSize: '30px', letterSpacing: '.3em', paddingLeft: '.3em', color: C.rose }, CENTER));
  const tRai = tx('LA RAISON', 'bodoni', { left: '70px', top: '300px', fontWeight: 900, fontSize: '66px' });
  const tRai2 = tx('examine', 'instrument', { left: '72px', top: '382px', fontStyle: 'italic', fontSize: '58px', color: C.rose });
  const tFoi = tx('LA FOI', 'bodoni', { right: '70px', top: '300px', fontWeight: 900, fontSize: '66px', textAlign: 'right' });
  const tFoi2 = tx('fait confiance', 'instrument', { right: '72px', top: '382px', fontStyle: 'italic', fontSize: '58px', color: C.lamp, textAlign: 'right' });
  // S3 — l'arche
  const tDeux = tx('DEUX DÉMARCHES', 'fraunces', Object.assign({ top: '220px', fontWeight: 600, fontSize: '34px', letterSpacing: '.3em', paddingLeft: '.3em', color: 'rgba(242,239,232,.85)' }, CENTER));
  const tDif = fit(tx('DIFFÉRENTE', 'bodoni', Object.assign({ top: '300px', fontWeight: 900, fontSize: '128px' }, CENTER)), 980);
  const tEnn = tx(gspan('≠ ENNEMIE', '#FFF4F2', '#F6C9C6', '#E8949A', '10px .06em 4px'), 'bodoni', Object.assign({ top: '446px', fontWeight: 900, fontSize: '112px', textShadow: 'none' }, CENTER));
  const tLR = tx('RAISON', 'fraunces', { left: '120px', width: '170px', textAlign: 'center', top: '1686px', fontWeight: 600, fontSize: '28px', letterSpacing: '.24em', color: 'rgba(242,239,232,.8)' });
  const tLF = tx('FOI', 'fraunces', { left: '790px', width: '170px', textAlign: 'center', top: '1686px', fontWeight: 600, fontSize: '28px', letterSpacing: '.24em', color: C.lamp });
  // S4 — la Bible
  const tBib = tx('Dans la Bible', 'fraunces', Object.assign({ top: '168px', fontWeight: 600, fontStyle: 'italic', fontSize: '44px', color: C.rose }, CENTER));
  const tBibRef = tx('1 THESSALONICIENS 5 : 21', 'fraunces', Object.assign({ top: '234px', fontWeight: 600, fontSize: '32px', letterSpacing: '.16em', paddingLeft: '.16em' }, CENTER));
  const tV1 = fit(tx('«&#8239;Examinez toutes choses&#8239;;', 'instrument', Object.assign({ top: '320px', fontStyle: 'italic', fontSize: '96px' }, CENTER)), 1000);
  const tV2 = fit(tx(gspan('retenez ce qui est bon.&#8239;»', '#FFFFFF', '#F6E7C1', C.gold, '4px .1em 6px'), 'instrument', Object.assign({ top: '430px', fontStyle: 'italic', fontSize: '96px', textShadow: 'none' }, CENTER)), 1000);
  const tLSG = tx('trad. Louis Segond, 1910', 'fraunces', Object.assign({ top: '566px', fontWeight: 500, fontSize: '24px', letterSpacing: '.08em', color: 'rgba(242,239,232,.75)' }, CENTER));
  // S5 — le Coran 3:190-191
  const tSour = tx('SOURATE ÂL ‘IMRÂN', 'fraunces', Object.assign({ top: '168px', fontWeight: 600, fontSize: '36px', letterSpacing: '.22em', paddingLeft: '.22em' }, CENTER));
  const tAr = tx('آل عمران', 'amiri', Object.assign({ top: '208px', fontSize: '116px', color: '#F3D9A0', direction: 'rtl' }, CENTER));
  const tVers = tx('3 : 190 – 191', 'fraunces', Object.assign({ top: '398px', fontWeight: 600, fontSize: '34px', letterSpacing: '.2em', paddingLeft: '.2em', color: C.rose }, CENTER));
  const tSig = tx(gspan('DES SIGNES', '#FFFFFF', '#F6E7C1', '#D9B97A', '10px .06em 4px'), 'bodoni', Object.assign({ top: '486px', fontWeight: 900, fontSize: '112px', textShadow: 'none' }, CENTER));
  const tRR = tx('raison · réflexion', 'instrument', Object.assign({ top: '622px', fontStyle: 'italic', fontSize: '74px', color: C.rose }, CENTER));
  // S6 — Thomas d'Aquin
  const tTho = tx('THOMAS D’AQUIN', 'bodoni', Object.assign({ top: '160px', fontWeight: 900, fontSize: '86px', textShadow: 'none' }, CENTER));
  tTho.innerHTML = gspan('THOMAS D’AQUIN', '#FFFFFF', '#F6E7C1', C.gold, '8px .06em 4px'); fit(tTho, 1000);
  const tThoSub = tx('philosophe et théologien · v. 1225 – 1274', 'fraunces', Object.assign({ top: '270px', fontWeight: 500, fontSize: '30px', letterSpacing: '.06em', color: 'rgba(242,239,232,.86)' }, CENTER));
  const tCred = tx('Carlo Crivelli, <i>Saint Thomas d’Aquin</i>, 1476 · National Gallery, Londres · domaine public', 'fraunces', Object.assign({ top: '1240px', fontWeight: 500, fontSize: '19px', color: 'rgba(242,239,232,.62)' }, CENTER));
  const tST = tx('<i>Somme théologique</i>, Iª, q. 1, a. 1', 'fraunces', Object.assign({ top: '800px', fontWeight: 600, fontSize: '26px', color: C.rose }, CENTER));
  const tRev = tx('LA RÉVÉLATION', 'fraunces', { left: '86px', top: '872px', fontWeight: 600, fontSize: '26px', letterSpacing: '.2em', color: '#F3D9A0' });
  const tDep = tx('ce qui dépasse ses capacités', 'instrument', { right: '70px', top: '946px', fontStyle: 'italic', fontSize: '36px', color: C.ivory, textAlign: 'right' });
  const tRH = tx('LA RAISON HUMAINE', 'fraunces', { right: '70px', top: '1196px', fontWeight: 600, fontSize: '26px', letterSpacing: '.2em', color: 'rgba(242,239,232,.85)', textAlign: 'right' });
  const tCon = tx('ce qu’elle peut connaître', 'instrument', { right: '60px', top: '1138px', fontStyle: 'italic', fontSize: '34px', color: C.rose, textAlign: 'right' });
  // S7 — la leçon (chiasme)
  const tLecon = tx('Voici la leçon', 'instrument', Object.assign({ top: '196px', fontStyle: 'italic', fontSize: '66px', color: C.rose }, CENTER));
  const tCroire = tx(gspan('CROIRE', '#FFF4F2', '#F6C9C6', '#E8949A', '12px .06em 4px'), 'bodoni', Object.assign({ top: '0px', fontWeight: 900, fontSize: '136px', textShadow: 'none' }, CENTER));
  const tRefl = fit(tx(gspan('RÉFLÉCHIR', '#FFFFFF', '#F3E6CC', C.gold, '18px .06em 4px'), 'bodoni', Object.assign({ top: '0px', fontWeight: 900, fontSize: '128px', textShadow: 'none' }, CENTER)), 980);
  const tMid1 = tx('ne dispense pas de', 'instrument', Object.assign({ top: '492px', fontStyle: 'italic', fontSize: '66px' }, CENTER));
  const tMid2 = tx('ne signifie pas nécessairement', 'instrument', Object.assign({ top: '474px', fontStyle: 'italic', fontSize: '60px' }, CENTER));
  const tMid3 = tx('cesser de', 'instrument', Object.assign({ top: '544px', fontStyle: 'italic', fontSize: '60px' }, CENTER));
  const SLOT_A = 318, SLOT_B = 618; // positions des deux mots (le chiasme les échange)
  // S8 — la question au spectateur
  const QL = [
    [[['Mais', 0], ['dis-moi,', 1], ['élève&#8239;:', 3]], 64, 300, C.ivory],
    [[['ta', 4], ['foi', 5], ['résiste-t-elle', 6]], 96, 400, C.rose],
    [[['à', 9], ['tes', 10], ['questions,', 11]], 96, 512, C.ivory],
    [[['ou', 12], ['as-tu', 13], ['peur', 15]], 92, 654, C.ivory],
    [[['de', 16], ['les', 17], ['poser&#8239;?', 18]], 104, 764, C.rose]];
  const tQ = QL.map(([ws, fs, y, col]) => tx(ws.map(([w, i]) => `<span class="qw" data-i="${i}" style="display:inline-block;margin:0 .12em">${w}</span>`).join(''), 'instrument', Object.assign({ top: y + 'px', fontStyle: 'italic', fontSize: fs + 'px', color: col, opacity: 1 }, CENTER)));
  const tTitle = tx('L’ÉNIGME<br>HUMAINE.', 'bodoni', Object.assign({ top: '560px', paddingTop: '44px', textShadow: 'none', fontWeight: 900, fontSize: '138px', lineHeight: '.98', whiteSpace: 'normal',
    background: `linear-gradient(100deg, ${C.gold} 0%, #F6E7C1 45%, ${C.ivory} 55%, ${C.gold} 100%)`, backgroundSize: '250% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }, CENTER));
  const tSlogan = tx('Fais ta propre réflexion.', 'instrument', Object.assign({ top: '910px', fontStyle: 'italic', fontSize: '58px', color: C.rose }, CENTER));
  const tFour = tx('FOI · RAISON · SCIENCE · CONSCIENCE', 'fraunces', Object.assign({ top: '1000px', fontWeight: 500, fontSize: '24px', letterSpacing: '.26em', color: 'rgba(242,239,232,.78)' }, CENTER));

  /* ---------- sous-titres (masqués quand la phrase est déjà composée en grand à l'écran) ---------- */
  const NOSUB = new Set(['s1b', 's4b', 's7a', 's7b', 's7c', 's8a']);
  const CHUNKS = TL.sentences.flatMap(s => s.chunks.map(c => Object.assign(c, { sid: s.id })));
  CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1]; c.show = Math.min(c.end + .3, nx ? nx.start - .02 : c.end + .6); });
  function subs(t) {
    const c = CHUNKS.find(k => t >= k.start - .03 && t <= k.show);
    if (!c || NOSUB.has(c.sid) || t >= T.q - .1) { SUBS.style.opacity = 0; return; }
    if (SUBS.dataset.k !== c.text) { SUBS.textContent = c.text; SUBS.dataset.k = c.text; }
    SUBS.style.opacity = (prog(t, c.start - .03, c.start + .06, 'linear') * (1 - prog(t, c.show - .08, c.show, 'linear'))).toFixed(3);
  }
  const cam = (c, z, fx, fy) => c.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 - fy * z);
  const LM = 140; // marge des décors pré-rendus
  const camSafe = (c, z, fx, fy) => { const hw = W / 2 / z, hh = H / 2 / z; cam(c, z, clamp(fx, hw - LM, W - hw + LM), clamp(fy, hh - LM, H - hh + LM)); };
  function prerender(fn, ss = 1.35) { const o = off(Math.round((W + 2 * LM) * ss), Math.round((H + 2 * LM) * ss)), c = o.getContext('2d'); c.setTransform(ss, 0, 0, ss, LM * ss, LM * ss); fn(c); return o; }
  const blit = (c, o) => c.drawImage(o, -LM, -LM, W + 2 * LM, H + 2 * LM);
  const flash = (c, col, a) => { if (a > 0) { c.fillStyle = rgba(col, a); c.fillRect(0, 0, W, H); } };
  const bil = (q, u, v) => [lerp(lerp(q[0][0], q[1][0], u), lerp(q[3][0], q[2][0], u), v), lerp(lerp(q[0][1], q[1][1], u), lerp(q[3][1], q[2][1], u), v)];
  const quad = (c, q) => { c.beginPath(); c.moveTo(...q[0]); c.lineTo(...q[1]); c.lineTo(...q[2]); c.lineTo(...q[3]); c.closePath(); };

  /* ---------- silhouette avec liseré de lumière (même principe que CINE.person) ---------- */
  const _a = off(W, H), _ax = _a.getContext('2d'), _b = off(W, H), _bx = _b.getContext('2d');
  function rimmed(c, fn, o) {
    _ax.setTransform(1, 0, 0, 1, 0, 0); _ax.clearRect(0, 0, W, H); _ax.fillStyle = _ax.strokeStyle = o.body; fn(_ax);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over'; _bx.clearRect(0, 0, W, H); _bx.fillStyle = _bx.strokeStyle = o.rim; fn(_bx);
    _bx.globalCompositeOperation = 'destination-out'; _bx.setTransform(1, 0, 0, 1, -o.dx, -(o.dy || 0)); _bx.fillStyle = _bx.strokeStyle = '#000'; fn(_bx);
    _bx.setTransform(1, 0, 0, 1, 0, 0); _bx.globalCompositeOperation = 'source-over';
    c.drawImage(_a, 0, 0); c.save(); c.globalAlpha = o.rimA; c.drawImage(_b, 0, 0); c.restore();
  }
  const ik = (sx, sy, tx_, ty, l1, l2, bend) => { const dx = tx_ - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), l1 + l2 - .01), a = Math.atan2(dy, dx), b = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) * bend; return [sx + Math.cos(a + b) * l1, sy + Math.sin(a + b) * l1]; };
  /** l'élève, assis de profil (regarde à droite) ; handFace 1 = main sur le front ; headUp 0 = tête baissée → 1 relevée */
  function thinkerPath(c, p) {
    const s = p.s, L = (x, y) => [p.x + x * s, p.y + y * s];
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 8 * s; c.beginPath(); c.moveTo(...L(-36, 8)); c.lineTo(...L(-44, -140)); c.moveTo(...L(-46, 4)); c.lineTo(...L(34, 4)); c.stroke(); // chaise
    c.lineWidth = 6 * s; c.beginPath(); c.moveTo(...L(-38, 8)); c.lineTo(...L(-42, 96)); c.moveTo(...L(28, 8)); c.lineTo(...L(32, 96)); c.stroke();
    c.lineWidth = 17 * s; c.beginPath(); c.moveTo(...L(-6, -6)); c.lineTo(...L(66, -4)); c.lineTo(...L(72, 90)); c.stroke(); // jambes
    c.lineWidth = 10 * s; c.beginPath(); c.moveTo(...L(68, 94)); c.lineTo(...L(90, 95)); c.stroke();
    const ln = p.lean, cs = Math.cos(ln), sn = Math.sin(ln), R = (x, y) => L(x * cs - y * sn, x * sn + y * cs);
    const farSh = R(0, -138), farEl = L(58, -80), farHd = L(150, -76); // bras éloigné, posé sur la table
    c.lineWidth = 15 * s; c.beginPath(); c.moveTo(...farSh); c.lineTo(...farEl); c.lineTo(...farHd); c.stroke();
    c.beginPath(); c.moveTo(...R(-26, 2)); c.quadraticCurveTo(...R(-34, -70), ...R(-22, -138)); c.quadraticCurveTo(...R(-4, -156), ...R(18, -146)); c.quadraticCurveTo(...R(32, -100), ...R(24, 2)); c.closePath(); c.fill(); // torse (sweat)
    c.beginPath(); c.ellipse(...R(-14, -148), 17 * s, 11 * s, ln, 0, 6.283); c.fill(); // capuche
    const nb = R(4, -146), hr = ln + lerp(.5, -.12, p.headUp), hc = Math.cos(hr), hs = Math.sin(hr);
    const Hd = (x, y) => [nb[0] + (x * hc - y * hs) * s, nb[1] + (x * hs + y * hc) * s];
    c.lineWidth = 13 * s; c.beginPath(); c.moveTo(...nb); c.lineTo(...Hd(5, -14)); c.stroke(); // cou
    c.beginPath(); c.ellipse(...Hd(8, -27), 15.5 * s, 17 * s, hr, 0, 6.283); c.fill(); // tête
    c.beginPath(); c.ellipse(...Hd(5, -34), 16 * s, 12 * s, hr - .2, Math.PI, 2 * Math.PI); c.fill(); // cheveux courts
    c.beginPath(); c.moveTo(...Hd(21, -30)); c.lineTo(...Hd(26, -24)); c.lineTo(...Hd(20, -22)); c.fill(); // nez
    const sh = R(6, -136), fore = Hd(18, -38), rest = L(128, -74);
    const hf = clamp(p.handFace), hand = [lerp(rest[0], fore[0], hf), lerp(rest[1], fore[1], hf) - Math.sin(hf * Math.PI) * 18 * s];
    const elb = [lerp(p.x + 62 * s, p.x + 74 * s, hf), lerp(p.y - 82 * s, p.y - 74 * s, hf)];
    c.lineWidth = 16 * s; c.beginPath(); c.moveTo(...sh); c.lineTo(...elb); c.stroke();
    c.lineWidth = 13.5 * s; c.beginPath(); c.moveTo(...elb); c.lineTo(...hand); c.stroke();
    c.beginPath(); c.ellipse(hand[0], hand[1], 9 * s, 7 * s, -.6, 0, 6.283); c.fill();
  }

  /* =====================================================================
     DÉCOR 1, 7 & 8 — LA BIBLIOTHÈQUE DES SIÈCLES (perspective à point de fuite)
     ===================================================================== */
  const VP = { x: 540, y: 640 }, FOC = 760, WALL = 640, FLOOR = 1000, SPRING = -620, Z0 = .75, ZMAX = 4.6;
  const BAYS = [.75, 1.0, 1.3, 1.7, 2.2, 2.85, 3.7, 4.6], BOARDS = [1000, 790, 580, 370, 150, -70, -290, -520];
  const P3 = (X, Y, Z) => [VP.x + FOC * X / (Z * 1000), VP.y + FOC * Y / (Z * 1000)]; // Z en milliers d'unités
  const SPINES = ['#5a2a24', '#3d2b1f', '#2f3a2c', '#4a3a26', '#6b4a2a', '#2a2e3d', '#57372e', '#704c36', '#3a2420', '#4d4030'];
  function drawLibStatic(c, m) {
    const fog = mix('#0a0f1a', '#2c1f14', m), r = rng(31);
    const shade = (col, z) => mix(col, fog, clamp((z - Z0) / (ZMAX - Z0)) * .82);
    c.fillStyle = fog; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    // voûte à caissons
    for (let i = 0; i < BAYS.length - 1; i++) {
      const z1 = BAYS[i], z2 = BAYS[i + 1], [x1, y1] = P3(0, SPRING, z1), r1 = FOC * WALL / z1 / 1000, [x2, y2] = P3(0, SPRING, z2), r2 = FOC * WALL / z2 / 1000;
      const A = (k, u, v) => { const a = Math.PI + (k + u) * Math.PI / 12; return [lerp(x1 + Math.cos(a) * r1, x2 + Math.cos(a) * r2, v), lerp(y1 + Math.sin(a) * r1, y2 + Math.sin(a) * r2, v)]; };
      for (let k = 0; k < 12; k++) {
        quad(c, [A(k, 0, 0), A(k, 1, 0), A(k, 1, 1), A(k, 0, 1)]); c.fillStyle = shade(mix('#2b2620', '#5b4630', m * .6), (z1 + z2) / 2); c.fill();
        quad(c, [A(k, .16, .18), A(k, .84, .18), A(k, .84, .82), A(k, .16, .82)]); c.fillStyle = shade(mix('#15120f', '#33261a', m * .6), (z1 + z2) / 2); c.fill();
        const cc = A(k, .5, .5); c.fillStyle = shade(mix('#6a5634', '#C0A16A', m * .5), (z1 + z2) / 2); c.beginPath(); c.arc(cc[0], cc[1], 9 / ((z1 + z2) / 2), 0, 6.283); c.fill(); // rosace dorée
      }
    }
    for (const z of BAYS) { const [x, y] = P3(0, SPRING, z); c.strokeStyle = shade(mix('#4a4134', '#9a7a52', m), z); c.lineWidth = 34 / z; c.beginPath(); c.arc(x, y, FOC * WALL / z / 1000, Math.PI, 2 * Math.PI); c.stroke(); }
    // mur du fond, lunette et grande fenêtre
    const [fx0, fy0] = P3(-WALL, SPRING, ZMAX), [fx1, fy1] = P3(WALL, FLOOR, ZMAX);
    c.fillStyle = shade('#2a2018', ZMAX); c.fillRect(fx0, fy0, fx1 - fx0, fy1 - fy0);
    c.beginPath(); c.arc(VP.x, fy0, (fx1 - fx0) / 2, Math.PI, 2 * Math.PI); c.fill();
    const wx = FOC * 300 / ZMAX / 1000, wy0 = P3(0, 520, ZMAX)[1], wy1 = P3(0, -1100, ZMAX)[1];
    const lc = mix('#9DB4E2', '#FFD49C', m), g0 = c.createLinearGradient(0, wy1, 0, wy0); g0.addColorStop(0, mix(lc, '#ffffff', .4)); g0.addColorStop(1, lc);
    archPath(c, VP.x, wy0, wx * 2, wy0 - wy1, false); c.fillStyle = g0; c.fill();
    c.strokeStyle = shade('#1a140f', ZMAX - 1); c.lineWidth = 4; c.beginPath(); c.moveTo(VP.x, wy1 + 4); c.lineTo(VP.x, wy0); for (let k = 1; k < 5; k++) { const y = lerp(wy1 + wx, wy0, k / 5); c.moveTo(VP.x - wx, y); c.lineTo(VP.x + wx, y); } c.stroke();
    // sol en damier de marbre
    const fy = P3(0, FLOOR, Z0)[1]; c.fillStyle = shade(mix('#1c1714', '#3a2a1e', m), Z0); c.fillRect(-LM, fy - 2, W + 2 * LM, H + LM - fy + 2);
    for (let z = Z0, j = 0; z < ZMAX; z *= 1.11, j++) {
      const z2 = Math.min(ZMAX, z * 1.11);
      for (let X = -WALL, i = 0; X < WALL; X += 160, i++) { quad(c, [P3(X, FLOOR, z), P3(X + 160, FLOOR, z), P3(X + 160, FLOOR, z2), P3(X, FLOOR, z2)]); c.fillStyle = shade((i + j) % 2 ? mix('#26201b', '#5a4634', m) : mix('#17130f', '#33261b', m), z); c.fill(); }
    }
    // murs de livres, deux étages, balcon
    for (const sd of [-1, 1]) {
      const X = sd * WALL;
      quad(c, [P3(X, FLOOR, Z0), P3(X, FLOOR, ZMAX), P3(X, SPRING, ZMAX), P3(X, SPRING, Z0)]); c.fillStyle = shade('#150f0b', 1.5); c.fill();
      for (let b = 0; b < BOARDS.length - 1; b++) {
        const yb = BOARDS[b], yt = BOARDS[b + 1] + 16, hh = yb - yt;
        for (let i = 0; i < BAYS.length - 1; i++) {
          let z = BAYS[i] * 1.045; const zEnd = BAYS[i + 1];
          while (z < zEnd) {
            const dz = .016 + r() * .02, z2 = Math.min(zEnd, z + dz), top = yb - hh * (.68 + r() * .28), col = SPINES[Math.floor(r() * SPINES.length)];
            quad(c, [P3(X, yb, z), P3(X, yb, z2), P3(X, top, z2), P3(X, top, z)]); c.fillStyle = shade(mix(col, '#E9C690', m * .12 + r() * .05), z); c.fill();
            if (r() < .45) { quad(c, [P3(X, top + 14, z), P3(X, top + 14, z2), P3(X, top + 22, z2), P3(X, top + 22, z)]); c.fillStyle = shade(mix('#7a6034', '#E0C07A', m), z); c.fill(); }
            z = z2 + (r() < .05 ? .03 : .001);
          }
        }
        quad(c, [P3(X, yb, Z0), P3(X, yb, ZMAX), P3(X, yb - 16, ZMAX), P3(X, yb - 16, Z0)]); c.fillStyle = shade(mix('#2c2017', '#7a5a3a', m), 1.4); c.fill(); // planche
      }
      for (const z of BAYS.slice(0, -1)) { const z2 = z * 1.045; quad(c, [P3(X, FLOOR, z), P3(X, FLOOR, z2), P3(X, SPRING, z2), P3(X, SPRING, z)]); c.fillStyle = shade(mix('#2a231c', '#5e4a34', m), z); c.fill();
        quad(c, [P3(X, SPRING + 40, z), P3(X, SPRING + 40, z2), P3(X, SPRING - 10, z2), P3(X, SPRING - 10, z)]); c.fillStyle = shade(mix('#5a4a2e', '#C0A16A', m), z); c.fill(); } // pilastres et chapiteaux
      quad(c, [P3(X, SPRING + 30, Z0), P3(X, SPRING + 30, ZMAX), P3(X, SPRING - 20, ZMAX), P3(X, SPRING - 20, Z0)]); c.fillStyle = shade(mix('#4a3e2a', '#A88A58', m), 1.5); c.fill(); // corniche
      const XR = sd * (WALL - 60); // balcon
      quad(c, [P3(X, 370, Z0), P3(X, 370, ZMAX), P3(XR, 370, ZMAX), P3(XR, 370, Z0)]); c.fillStyle = shade('#120d0a', 1.6); c.fill();
      c.strokeStyle = shade(mix('#3a2e22', '#8a6a44', m), 1.2); c.lineWidth = 3;
      c.beginPath(); c.moveTo(...P3(XR, 260, Z0)); c.lineTo(...P3(XR, 260, ZMAX)); c.stroke();
      for (let z = Z0; z < ZMAX; z *= 1.035) { c.lineWidth = 7 / z; c.beginPath(); c.moveTo(...P3(XR, 370, z)); c.lineTo(...P3(XR, 262, z)); c.stroke(); }
    }
  }
  const LIB = [prerender(c => drawLibStatic(c, 0)), prerender(c => drawLibStatic(c, 1))];
  const libDust = makeDust(150, 61, [0, 300, W, 1400]);
  function drawTable(c, t, st) {
    const ty = 1489;
    let g = c.createLinearGradient(0, ty - 22, 0, ty); g.addColorStop(0, '#120c08'); g.addColorStop(1, mix('#2a1b10', '#7a5232', st.candle * .6));
    c.fillStyle = g; c.beginPath(); c.moveTo(470, ty - 22); c.lineTo(W + 200, ty - 22); c.lineTo(W + 200, ty); c.lineTo(456, ty); c.closePath(); c.fill(); // plateau
    c.fillStyle = '#0c0806'; c.fillRect(456, ty, W, 30); c.fillRect(520, ty + 30, 26, 420); c.fillRect(990, ty + 30, 26, 420);
    // livre ouvert (pages en éventail), pile de livres
    c.fillStyle = mix('#5a4630', '#E9D6AE', st.candle * .7); c.beginPath(); c.moveTo(560, ty - 24); c.quadraticCurveTo(600, ty - 52, 650, ty - 40); c.lineTo(652, ty - 24); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(560, ty - 24); c.quadraticCurveTo(520, ty - 50, 478, ty - 38); c.lineTo(478, ty - 24); c.closePath(); c.fill();
    c.fillStyle = '#1a0f0a'; c.fillRect(474, ty - 26, 182, 5);
    [[880, 120, '#3a1c18'], [872, 136, '#22261c'], [886, 112, '#4a3420']].forEach(([x, w, col], k) => { c.fillStyle = col; c.fillRect(x, ty - 22 - (k + 1) * 26, w, 24); c.fillStyle = rgba('#C0A16A', .5); c.fillRect(x + 8, ty - 22 - (k + 1) * 26 + 10, w - 16, 3); });
    // la bougie
    const fl = st.flicker || 0, cx = 770, cy = ty - 92, wob = Math.sin(t * 11) * 1.6 * (1 + fl * 3) + Math.sin(t * 23) * fl * 2.5;
    c.fillStyle = '#16100c'; c.fillRect(cx - 26, ty - 26, 52, 6); c.fillRect(cx - 5, ty - 40, 10, 16);
    c.fillStyle = '#E9DEC8'; c.fillRect(cx - 9, cy, 18, 52);
    glow(c, cx, cy - 22, 520 * st.candle, C.lamp, .5 * st.candle);
    glow(c, cx, cy - 22, 120, '#FFE2A8', .7 * st.candle);
    c.fillStyle = rgba('#FFE7B0', .95 * st.candle); c.beginPath(); c.ellipse(cx + wob, cy - 18, 6, 17 - fl * 3, wob * .05, 0, 6.283); c.fill();
    c.fillStyle = rgba('#FFFFFF', .8 * st.candle); c.beginPath(); c.ellipse(cx + wob * .6, cy - 13, 2.5, 7, 0, 0, 6.283); c.fill();
  }
  function drawLibrary(c, t, st) {
    blit(c, LIB[0]);
    if (st.dawn > 0) { c.save(); c.globalAlpha = st.dawn; blit(c, LIB[1]); c.restore(); }
    const lc = mix('#9DB4E2', '#FFD49C', st.dawn), win = st.win;
    glow(c, VP.x, 590, 320, lc, .45 * win); glow(c, VP.x, 640, 900, lc, .14 * win);
    beam(c, VP.x, 700, 330, 1660, 760, 1660, lc, .16 * win, 26);
    beam(c, -120, -260, 260, 1500, 620, 1500, lc, .09 * st.shaft, 30); beam(c, 1240, -200, 560, 1520, 900, 1500, lc, .06 * st.shaft, 30);
    dust(c, libDust, t, [0, 300, W, 1400], mix('#DDE6FF', '#FFE9C0', st.dawn), .28 * Math.max(win, st.shaft), (x, y) => clamp(1 - Math.abs(x - 540) / 520) * .8 + .2);
    c.fillStyle = rgba('#000000', .25 * (1 - win)); c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM); // pénombre
    drawTable(c, t, st);
    rimmed(c, cc => thinkerPath(cc, Object.assign({ x: 330, y: 1650, s: 2.3 }, st.pose)), { body: '#08070a', rim: mix(C.lamp, '#FFE4B0', st.dawn), rimA: .55 + .35 * st.candle, dx: 3.4 });
    if (st.motes > 0) { // les questions qui montent du livre
      const r = rng(5);
      for (let k = 0; k < 26; k++) {
        const ph = (t * (.08 + r() * .07) + r()) % 1, x = 560 + (r() - .5) * 160 + Math.sin(t * .8 + k) * 30 * ph, y = 1460 - ph * 900;
        glow(c, x, y, 26, '#FFE2A8', st.motes * (1 - ph) * .55); c.fillStyle = rgba('#FFF4DA', st.motes * (1 - ph) * .9); c.beginPath(); c.arc(x, y, 2.4, 0, 6.283); c.fill();
      }
    }
  }

  function scene1(c, t) {
    const back = prog(t, .2, T.foi, 'inOutSine');
    const z = lerp(1.24, 1.0, back) + prog(t, T.foi, T.qEnd1 + .4, 'inOutSine') * .05, fx = lerp(470, 540, back), fy = lerp(1270, 960, back);
    camSafe(c, z, fx, fy);
    const win = .15 + .85 * prog(t, T.eleve - .2, T.question, 'inOutSine');
    const lift = prog(t, T.reflechisses - .3, T.question + .3, 'inOutCubic');
    drawLibrary(c, t, { dawn: 0, win, shaft: win * .7, candle: 1, pose: { lean: .2 - .05 * lift, handFace: 1 - .15 * lift, headUp: .1 + .3 * lift } });
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = rgba('#05060a', .45 * prog(t, T.foi - .2, T.foi + .3, 'outCubic')); c.fillRect(0, 0, W, H); // la question prend la place
    vignette(c, .55, '#02030a');
    flash(c, '#000000', 1 - prog(t, 0, .8, 'outCubic'));
    flash(c, '#000000', .55 * prog(t, T.raisonQ + .5, T.raisonQ + .56, 'linear'));
    flash(c, '#F3E3C4', prog(t, T.s2 + .1, T.s2 + .5, 'inCubic'));
  }

  /* =====================================================================
     DÉCOR 2 — LE MANUSCRIT OUVERT : RATIO / FIDES
     ===================================================================== */
  const LP = [[96, 560], [540, 604], [540, 1252], [58, 1214]], RP = [[540, 604], [984, 560], [1022, 1214], [540, 1252]];
  function minims(c, q, v0, v1, rows, u0, u1, seed, red) {
    const r = rng(seed);
    for (let j = 0; j < rows; j++) {
      const v = lerp(v0, v1, j / Math.max(1, rows - 1)); let u = u0 + (j === 0 ? 0 : 0);
      while (u < u1 - .02) {
        const wl = .04 + r() * .09, ue = Math.min(u1, u + wl), n = Math.max(2, Math.round((ue - u) * 90));
        c.strokeStyle = red && j % 7 === 0 && u === u0 ? rgba(C.red, .85) : rgba(C.ink, .62); c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k < n; k++) { const [x, y] = bil(q, lerp(u, ue, k / n), v), up = r() < .12 ? 9 : 0, dn = r() < .06 ? 6 : 0; c.moveTo(x, y - 6 - up); c.lineTo(x + .6, y + 5 + dn); }
        c.stroke(); u = ue + .02 + r() * .01;
      }
    }
  }
  function pageShape(c, q, curl) { c.beginPath(); c.moveTo(...q[0]); c.quadraticCurveTo((q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2 - curl, ...q[1]); c.lineTo(...q[2]); c.quadraticCurveTo((q[2][0] + q[3][0]) / 2, (q[2][1] + q[3][1]) / 2 + curl * .6, ...q[3]); c.closePath(); }
  function drawBookStatic(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0f09'); g.addColorStop(.5, '#2c1a10'); g.addColorStop(1, '#120a06');
    c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const r = rng(12); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let k = 0; k < 40; k++) { const y = r() * H; c.beginPath(); c.moveTo(-LM, y); c.bezierCurveTo(300, y + r() * 30, 700, y - r() * 30, W + LM, y + 10); c.stroke(); } // veines du bois
    c.fillStyle = 'rgba(0,0,0,.55)'; c.filter = 'blur(26px)'; c.fillRect(70, 600, 960, 700); c.filter = 'none'; // ombre portée
    c.fillStyle = '#3a1612'; pageShape(c, [[70, 540], [1010, 540], [1050, 1250], [30, 1250]], 10); c.fill(); // couverture de cuir
    for (let k = 6; k > 0; k--) { c.fillStyle = mix('#b89a6a', '#e7d3a8', k / 6); pageShape(c, LP.map(([x, y], i) => [x - (i === 0 || i === 3 ? k * 2.2 : 0), y + k * 2.4]), 14); c.fill(); pageShape(c, RP.map(([x, y], i) => [x + (i === 1 || i === 2 ? k * 2.2 : 0), y + k * 2.4]), 14); c.fill(); }
    for (const [q, gx] of [[LP, 1], [RP, -1]]) {
      pageShape(c, q, 14); g = c.createLinearGradient(gx > 0 ? 90 : 990, 0, 540, 0); g.addColorStop(0, '#EEDDBA'); g.addColorStop(.75, '#E6D2A8'); g.addColorStop(1, '#B49668');
      c.fillStyle = g; c.fill();
      c.save(); pageShape(c, q, 14); c.clip(); const rr = rng(gx > 0 ? 3 : 4); for (let k = 0; k < 160; k++) { c.fillStyle = rgba('#8a6a40', .04 + rr() * .05); c.beginPath(); c.arc(lerp(60, 1020, rr()), lerp(560, 1250, rr()), 4 + rr() * 30, 0, 6.283); c.fill(); } c.restore(); // taches du temps
    }
    // titres latins et lettrines
    const head = (q, word, u) => { const [x, y] = bil(q, u, .065); c.save(); c.font = '500 34px Garamond'; c.fillStyle = C.red; c.textAlign = 'center'; c.letterSpacing = '8px'; c.fillText(word, x, y + 10); c.restore(); };
    head(LP, 'RATIO', .52); head(RP, 'FIDES', .48);
    const initial = (q, ch, u0, v0) => { const a = bil(q, u0, v0), b = bil(q, u0 + .17, v0 + .15); c.fillStyle = rgba(C.red, .9); c.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); c.strokeStyle = '#C0A16A'; c.lineWidth = 3; c.strokeRect(a[0] + 5, a[1] + 5, b[0] - a[0] - 10, b[1] - a[1] - 10); c.font = '500 86px Garamond'; c.fillStyle = '#F3D9A0'; c.textAlign = 'center'; c.fillText(ch, (a[0] + b[0]) / 2, b[1] - 18); };
    initial(LP, 'R', .1, .11); initial(RP, 'F', .1, .11);
    minims(c, LP, .13, .25, 4, .3, .9, 21, false); minims(c, LP, .29, .34, 2, .1, .9, 22, false);
    minims(c, RP, .13, .25, 4, .3, .9, 23, false); minims(c, RP, .29, .93, 19, .1, .9, 24, true);
  }
  const BOOK = prerender(drawBookStatic, 1.4);
  const BLK = []; for (let rr = 1; rr < 4; rr++) for (let k = 0; k <= rr; k++) BLK.push([rr, k]);
  const blockQ = (rr, k) => { const u = .5 + (k - rr / 2) * .17, v = .47 + rr * .08; return [bil(LP, u - .075, v - .033), bil(LP, u + .075, v - .033), bil(LP, u + .075, v + .033), bil(LP, u - .075, v + .033)]; };
  const centerQ = q => [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2];
  function strokeProg(c, pts, p) { // trace une polyligne jusqu'à p (0..1)
    let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = tot * clamp(p); c.beginPath(); c.moveTo(...pts[0]);
    for (let i = 1; i < pts.length && left > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), k = Math.min(1, left / d); c.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); left -= d; }
    c.stroke();
  }
  function handText(c, txt, x, y, p, size, col) { if (p <= 0) return; c.save(); c.font = `italic 400 ${size}px Instrument`; const w = c.measureText(txt).width; c.beginPath(); c.rect(x - 10, y - size, (w + 20) * clamp(p), size * 1.5); c.clip(); c.fillStyle = col; c.fillText(txt, x, y); c.restore(); }
  function scene2(c, t) {
    const z = lerp(1.14, 1.02, prog(t, T.s2, T.s2 + 1.6, 'outCubic')), fx = 540 + lerp(0, -60, prog(t, T.raison2 - .4, T.raison2 + .6, 'inOutSine')) + lerp(0, 130, prog(t, T.foi2 - .5, T.foi2 + .6, 'inOutSine'));
    camSafe(c, z, fx, 930);
    blit(c, BOOK);
    // la distinction : un fil d'or dans la pliure
    const dl = prog(t, T.distinction - .1, T.distinction + .7, 'inOutCubic');
    if (dl > 0) { c.save(); c.strokeStyle = '#F3D9A0'; c.lineWidth = 4; c.shadowColor = '#FFD98A'; c.shadowBlur = 18; strokeProg(c, [[540, 600], [540, 1252]], dl); c.restore(); }
    // la raison : fondations, affirmation, cohérence
    const ink = C.ink, base = prog(t, T.raison2, T.raison2 + .5, 'outCubic');
    c.save(); c.lineCap = 'round'; c.strokeStyle = rgba(ink, .85); c.lineWidth = 3;
    strokeProg(c, [bil(LP, .12, .84), bil(LP, .88, .84)], base);
    BLK.slice().reverse().forEach(([rr, k], i) => { const p = prog(t, T.examine + i * .07, T.examine + i * .07 + .35, 'outCubic'); if (p <= 0) return; const q = blockQ(rr, k); c.lineWidth = 2.6; strokeProg(c, [q[0], q[1], q[2], q[3], q[0]], p); });
    const aff = prog(t, T.affirmation - .05, T.affirmation + .4, 'outCubic'), qa = blockQ(0, 0);
    if (aff > 0) { quad(c, qa); c.fillStyle = rgba(C.rose, .45 * aff); c.fill(); c.strokeStyle = rgba('#7a2a2a', .95); c.lineWidth = 3.4; strokeProg(c, [qa[0], qa[1], qa[2], qa[3], qa[0]], aff); }
    const coh = prog(t, T.coherente - .1, T.coherente + .7, 'inOutCubic');
    if (coh > 0) { c.strokeStyle = rgba('#B8862E', .95); c.lineWidth = 2.6; const all = [[0, 0], ...BLK]; let n = 0; all.forEach(([r1, k1]) => all.forEach(([r2, k2]) => { if (r2 === r1 + 1 && (k2 === k1 || k2 === k1 + 1)) { strokeProg(c, [centerQ(blockQ(r1, k1)), centerQ(blockQ(r2, k2))], clamp(coh * 1.6 - n * .06)); n++; } })); }
    const rep = prog(t, T.repose - .1, T.repose + .9, 'linear');
    if (rep > 0) BLK.forEach(([rr, k]) => { const a = clamp(rep * 3 - (3 - rr)); if (a > 0) { quad(c, blockQ(rr, k)); c.fillStyle = rgba('#D9A548', .5 * a); c.fill(); } });
    c.restore();
    const [hx1, hy1] = bil(LP, .1, .43), [hx2, hy2] = bil(LP, .16, .92);
    handText(c, 'cohérente ?', hx1, hy1, prog(t, T.coherente - .05, T.coherente + .6, 'linear'), 38, '#7a2424');
    handText(c, 'sur quoi repose-t-elle ?', hx2, hy2, prog(t, T.repose - .35, T.repose + .7, 'linear'), 36, '#7a2424');
    // la foi : la lumière reçue d'en haut
    const fa = prog(t, T.foi2 - .2, T.foi2 + .8, 'outCubic');
    beam(c, 790, -260, 560, 1250, 1010, 1200, '#FFE9B8', .3 * fa, 34);
    const conf = prog(t, T.confiance - .1, T.confiance + .6, 'outCubic'), [ix, iy] = bil(RP, .185, .185);
    glow(c, ix, iy, 160, '#FFD98A', .55 * conf);
    const rv = prog(t, T.verite - .2, T.revelee + .7, 'inOutSine');
    if (rv > 0) { c.save(); pageShape(c, RP, 14); c.clip(); c.globalCompositeOperation = 'screen'; const yy = lerp(560, 1290, rv), g = c.createLinearGradient(0, yy - 380, 0, yy); g.addColorStop(0, rgba('#FFE2A0', 0)); g.addColorStop(.7, rgba('#FFE2A0', .32)); g.addColorStop(1, rgba('#FFF6DC', .55)); c.fillStyle = g; c.fillRect(540, 520, 520, yy - 520); c.restore(); }
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .55, '#0a0503');
    flash(c, '#F3E3C4', 1 - prog(t, T.s2 + .5, T.s2 + 1.1, 'outCubic'));
    flash(c, '#05070c', prog(t, T.s3 - .4, T.s3, 'inCubic'));
  }

  /* =====================================================================
     DÉCOR 3 — L'ARCHE : deux moitiés différentes, une clé de voûte
     ===================================================================== */
  const AR = { x: 540, y: 1130, ri: 270, ro: 400, floor: 1650 };
  const vousPath = (c, i) => { const a0 = Math.PI + i * Math.PI / 9, a1 = Math.PI + (i + 1) * Math.PI / 9; c.beginPath(); c.arc(AR.x, AR.y, AR.ro, a0, a1); c.arc(AR.x, AR.y, AR.ri, a1, a0, true); c.closePath(); };
  const vousC = i => { const a = Math.PI + (i + .5) * Math.PI / 9; return [AR.x + Math.cos(a) * 335, AR.y + Math.sin(a) * 335]; };
  function stoneFill(c, x0, y0, x1, y1) { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#A89C88'); g.addColorStop(1, '#5E564B'); return g; }
  function lightFill(c, x0, y0, x1, y1, a) { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba('#FFF4D6', .95 * a)); g.addColorStop(1, rgba('#E2B45C', .8 * a)); return g; }
  const archDust = makeDust(90, 8, [100, 600, 880, 1100]);
  function scene3(c, t) {
    const z = lerp(1.1, 1.0, prog(t, T.s3, T.attention, 'inOutSine')) + prog(t, T.ennemie, T.s4, 'outCubic') * .04;
    cam(c, z, 540, 1060);
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05070d'); g.addColorStop(.6, '#0e1524'); g.addColorStop(1, '#06080e');
    c.fillStyle = g; c.fillRect(-200, -200, W + 400, H + 400);
    for (const x of [-40, 220, 860, 1120]) { c.fillStyle = 'rgba(30,40,60,.35)'; c.fillRect(x - 30, 200, 60, 1500); } // colonnade lointaine
    const key = prog(t, T.ennemie - .05, T.ennemie + .45, 'outBack'), landed = prog(t, T.ennemie + .3, T.ennemie + .36, 'linear');
    const through = prog(t, T.ennemie + .3, T.ennemie + 1.6, 'outCubic');
    glow(c, 540, 1240, 520, '#FFD9A0', .15 + .55 * through); glow(c, 540, 1300, 1100, '#F6C27A', .25 * through);
    g = c.createLinearGradient(0, AR.floor, 0, H); g.addColorStop(0, '#141a26'); g.addColorStop(1, '#05060a'); c.fillStyle = g; c.fillRect(-200, AR.floor, W + 400, H);
    // pile gauche : la raison bâtit, pierre après pierre
    for (let k = 0; k < 4; k++) { const p = prog(t, T.s3 + .1 + k * .18, T.s3 + .5 + k * .18, 'outCubic'); if (p <= 0) continue;
      const y1 = AR.floor - k * 130, y0 = y1 - 130; c.save(); c.globalAlpha = p; c.translate(0, (1 - p) * 60);
      c.fillStyle = stoneFill(c, 140, y0, 270, y1); c.fillRect(140, y0 + 2, 130, 126); c.strokeStyle = 'rgba(15,12,10,.8)'; c.lineWidth = 3; c.strokeRect(140, y0 + 2, 130, 126);
      c.strokeStyle = 'rgba(242,239,232,.35)'; c.lineWidth = 1.6; c.beginPath(); c.arc(205, y0 + 66, 34, 0, 6.283); c.moveTo(171, y0 + 100); c.lineTo(239, y0 + 32); c.stroke(); c.restore(); }
    // pile droite : la foi reçoit, colonne de lumière
    const lp = prog(t, T.differentes - .3, T.differentes + .7, 'inOutCubic');
    if (lp > 0) { c.save(); c.beginPath(); c.rect(810, AR.y, 130, (AR.floor - AR.y) * lp); c.clip(); c.fillStyle = lightFill(c, 810, AR.y, 940, AR.floor, 1); c.fillRect(810, AR.y, 130, AR.floor - AR.y); c.restore(); glow(c, 875, AR.y + (AR.floor - AR.y) * lp, 140, '#FFE7B0', .5 * lp); beam(c, 875, -300, 800, AR.y, 950, AR.y, '#FFE7B0', .18 * lp, 24); }
    // voussoirs
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      const left = i < 4, p = left ? prog(t, T.deux + i * .16, T.deux + i * .16 + .45, 'outBack') : prog(t, T.differentes + (8 - i) * .14, T.differentes + (8 - i) * .14 + .55, 'outCubic');
      if (p <= 0) continue;
      const [cx, cy] = vousC(i); c.save();
      if (left) { c.translate(cx, cy); c.rotate((1 - p) * -.8); c.translate(-cx - (1 - p) * 260, -cy + (1 - p) * 300); }
      else c.translate(0, -(1 - p) * 700);
      vousPath(c, i);
      if (left) { c.fillStyle = stoneFill(c, cx - 60, cy - 60, cx + 60, cy + 60); c.fill(); c.strokeStyle = 'rgba(15,12,10,.85)'; c.lineWidth = 3; c.stroke(); c.strokeStyle = 'rgba(242,239,232,.3)'; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, 22, 0, 6.283); c.stroke(); }
      else { c.fillStyle = lightFill(c, cx - 60, cy - 60, cx + 60, cy + 60, p); c.fill(); c.strokeStyle = rgba('#FFF6DC', .9 * p); c.lineWidth = 2; c.stroke(); }
      c.restore();
      if (!left) glow(c, cx, cy - (1 - p) * 700, 120, '#FFE7B0', .35 * p);
    }
    // la clé de voûte : moitié pierre, moitié lumière
    if (key > 0) {
      const [kx, ky] = vousC(4); c.save(); c.translate(0, -(1 - key) * 760);
      vousPath(c, 4); const kg = c.createLinearGradient(kx - 60, 0, kx + 60, 0); kg.addColorStop(0, '#A89C88'); kg.addColorStop(.48, '#8a8070'); kg.addColorStop(.52, '#F6DFA6'); kg.addColorStop(1, '#E2B45C');
      c.fillStyle = kg; c.fill(); c.strokeStyle = '#FFF0C8'; c.lineWidth = 3; c.stroke(); c.restore();
      glow(c, kx, ky, 300, '#FFE7B0', .7 * landed * (1 - prog(t, T.ennemie + .4, T.ennemie + 1.6, 'outCubic') * .6));
    }
    // tremblement d'avant la clé (« Mais attention »)
    dust(c, archDust, t, [100, 600, 880, 1100], '#FFF0D0', .55 * through, (x, y) => 1);
    // reflet au sol
    c.save(); c.globalAlpha = .12 + .1 * through; c.translate(0, 2 * AR.floor); c.scale(1, -1); c.filter = 'blur(6px)';
    for (let i = 0; i < 9; i++) { const ok = i === 4 ? landed : (i < 4 ? prog(t, T.deux + i * .16 + .45, T.deux + i * .16 + .5, 'linear') : prog(t, T.differentes + (8 - i) * .14 + .55, T.differentes + (8 - i) * .14 + .6, 'linear')); if (ok <= 0) continue; vousPath(c, i); c.fillStyle = i < 4 ? '#6a6050' : '#E2B45C'; c.fill(); }
    c.restore();
    c.setTransform(1, 0, 0, 1, 0, 0);
    const shake = prog(t, T.attention - .1, T.attention + .2, 'linear') * (1 - prog(t, T.attention + .3, T.attention + .8, 'linear'));
    if (shake > 0) { c.save(); c.globalAlpha = .2 * shake; c.drawImage(cv, Math.sin(t * 60) * 4, 0); c.restore(); }
    flash(c, '#FFF3D6', .65 * landed * (1 - prog(t, T.ennemie + .36, T.ennemie + .9, 'outCubic')));
    vignette(c, .55, '#020308');
    flash(c, '#05070c', 1 - prog(t, T.s3, T.s3 + .55, 'outCubic'));
    flash(c, '#F4EBDD', prog(t, T.s4 - .4, T.s4, 'inCubic'));
  }

  /* =====================================================================
     DÉCOR 4 — LA BIBLE AU LUTRIN (lumière naturelle, profondeur de champ)
     ===================================================================== */
  const BL = [[214, 880], [540, 906], [540, 1266], [140, 1240]], BR = [[540, 906], [866, 880], [940, 1240], [540, 1266]];
  function drawBibleBg(c) {
    const o = off(W + 2 * LM, H + 2 * LM), x = o.getContext('2d'); x.translate(LM, LM);
    let g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#2a2018'); g.addColorStop(1, '#4a3a2c'); x.fillStyle = g; x.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    // la fenêtre (à droite), feuillages au-dehors
    x.fillStyle = '#C9D2C4'; x.fillRect(560, 60, 470, 1060);
    const r = rng(41); for (let k = 0; k < 60; k++) { x.fillStyle = rgba(r() < .5 ? '#5f7a4a' : '#8aa060', .55 + r() * .3); x.beginPath(); x.arc(560 + r() * 470, 80 + r() * 900, 30 + r() * 70, 0, 6.283); x.fill(); }
    x.fillStyle = rgba('#FFF2D0', .5); x.fillRect(560, 60, 470, 1060);
    x.fillStyle = '#1e1610'; x.fillRect(540, 40, 40, 1100); x.fillRect(1010, 40, 40, 1100); x.fillRect(780, 40, 26, 1100); x.fillRect(540, 560, 510, 26); x.fillRect(540, 1110, 510, 40);
    x.fillStyle = '#1a130d'; x.fillRect(-LM, 1150, 560, 30); for (let k = 0; k < 9; k++) { x.fillStyle = SPINES[k]; x.fillRect(30 + k * 52, 900 + (k % 3) * 20, 44, 250 - (k % 3) * 20); } // étagère floue à gauche
    c.filter = 'blur(16px)'; c.drawImage(o, -LM, -LM); c.filter = 'none';
    beam(c, 1000, 200, 200, 1300, 700, 1500, '#FFF0C8', .28, 40);
    // le lutrin et le livre, nets
    c.fillStyle = '#1a110b'; c.fillRect(505, 1290, 70, 700); c.fillRect(380, 1860, 320, 40);
    c.fillStyle = '#2a1a10'; quad(c, [[180, 860], [900, 860], [990, 1290], [90, 1290]]); c.fill();
    c.fillStyle = '#120a06'; quad(c, [[90, 1290], [990, 1290], [990, 1318], [90, 1318]]); c.fill();
    c.fillStyle = '#100907'; pageShape(c, [[196, 866], [884, 866], [962, 1262], [118, 1262]], 6); c.fill(); // couverture
    c.fillStyle = '#C9A24A'; pageShape(c, [[150, 1244], [930, 1244], [936, 1256], [144, 1256]], 0); c.fill(); // tranche dorée
    for (const q of [BL, BR]) { pageShape(c, q, 10); g = c.createLinearGradient(q === BL ? 150 : 930, 0, 540, 0); g.addColorStop(0, '#F2E8D4'); g.addColorStop(.8, '#E8DBC0'); g.addColorStop(1, '#BBA67E'); c.fillStyle = g; c.fill(); }
    const lines = (q, u0, u1, v0, v1, n, seed) => { const rr = rng(seed); for (let j = 0; j < n; j++) { const v = lerp(v0, v1, j / (n - 1)); let u = u0; while (u < u1 - .01) { const ue = Math.min(u1, u + .03 + rr() * .07); const [x0, y0] = bil(q, u, v), [x1, y1] = bil(q, ue, v); c.strokeStyle = rgba('#3a3028', .5); c.lineWidth = 2.2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); u = ue + .012; } } };
    lines(BL, .1, .47, .08, .93, 26, 1); lines(BL, .53, .9, .08, .93, 26, 2); lines(BR, .1, .47, .22, .93, 22, 3); lines(BR, .53, .9, .08, .93, 26, 4);
    const [nx, ny] = bil(BR, .17, .16); c.font = '500 70px Garamond'; c.fillStyle = '#7a2a22'; c.textAlign = 'center'; c.fillText('5', nx, ny + 10); // chapitre 5
    c.strokeStyle = '#8E2F2A'; c.lineWidth = 9; c.lineCap = 'butt'; c.beginPath(); c.moveTo(548, 1262); c.bezierCurveTo(560, 1330, 530, 1380, 552, 1440); c.stroke(); // signet
  }
  const BIBLE = prerender(drawBibleBg, 1.35);
  function scene4(c, t) {
    const z = lerp(1.12, 1.0, prog(t, T.s4, T.s5, 'inOutSine'));
    camSafe(c, z, 540, 1000 + prog(t, T.s4, T.s5, 'linear') * 40);
    blit(c, BIBLE);
    const sw = prog(t, T.s4, T.s5 + .5, 'linear'); // le soleil glisse sur les pages
    c.save(); quad(c, [[140, 880], [940, 880], [940, 1266], [140, 1266]]); c.clip(); c.globalCompositeOperation = 'screen';
    const sx = lerp(-200, 1300, sw), g = c.createLinearGradient(sx - 300, 0, sx + 300, 0); g.addColorStop(0, rgba('#FFE9B8', 0)); g.addColorStop(.5, rgba('#FFE9B8', .3)); g.addColorStop(1, rgba('#FFE9B8', 0)); c.fillStyle = g; c.fillRect(0, 800, W, 600);
    c.restore();
    const ex = prog(t, T.examinez - .1, T.choses + .5, 'inOutSine'); // la loupe de lumière parcourt les lignes
    if (ex > 0 && ex < 1) { const row = Math.floor(ex * 4), u = (ex * 4) % 1, [lx, ly] = row % 2 ? bil(BL, lerp(.9, .1, u), .2 + row * .18) : bil(BL, lerp(.1, .9, u), .2 + row * .18); glow(c, lx + (row > 1 ? 400 : 0), ly, 90, '#FFF6DC', .55 * Math.sin(ex * Math.PI)); }
    const keep = prog(t, T.retenez - .05, T.bon + .5, 'inOutCubic'), [a0, a1] = [bil(BR, .53, .62), bil(BR, .9, .62)];
    if (keep > 0) { c.save(); c.strokeStyle = '#D9A548'; c.lineWidth = 5; c.shadowColor = '#FFD98A'; c.shadowBlur = 16; c.lineCap = 'round'; strokeProg(c, [[a0[0], a0[1] + 8], [a1[0], a1[1] + 8]], keep); c.restore(); glow(c, lerp(a0[0], a1[0], keep), a0[1], 120, '#FFE2A0', .6 * keep); }
    c.setTransform(1, 0, 0, 1, 0, 0);
    glow(c, 110, 1700, 260, '#F6C27A', .35); c.save(); c.filter = 'blur(10px)'; for (const [x, y, r] of [[80, 1640, 50], [190, 1760, 34], [960, 1720, 44]]) { c.fillStyle = rgba('#FFE2B0', .18); c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); } c.restore(); // bokeh de premier plan
    c.fillStyle = 'rgba(8,6,4,.35)'; c.fillRect(0, 0, W, 660); // lisibilité du verset
    vignette(c, .5, '#0a0603');
    flash(c, '#F4EBDD', 1 - prog(t, T.s4, T.s4 + .6, 'outCubic'));
    flash(c, '#D9A070', prog(t, T.s5 - .4, T.s5, 'inCubic'));
  }

  /* =====================================================================
     DÉCOR 5 — LA COUR À ARCADES : l'alternance du jour et de la nuit
     ===================================================================== */
  const FL = 1300, HZ = 1180;
  const tile = (() => { const o = off(256, 256), x = o.getContext('2d'); x.fillStyle = '#E6D8BE'; x.fillRect(0, 0, 256, 256);
    for (const [cx, cy] of [[0, 0], [256, 0], [0, 256], [256, 256], [128, 128]]) { x.fillStyle = '#2c5a6a'; star8(x, cx, cy, 64, 34); x.fill(); x.fillStyle = '#E6D8BE'; star8(x, cx, cy, 40, 22); x.fill(); x.fillStyle = '#a5553a'; star8(x, cx, cy, 20, 11); x.fill(); }
    x.strokeStyle = '#2c5a6a'; x.lineWidth = 5; for (const [cx, cy] of [[128, 0], [0, 128], [256, 128], [128, 256]]) { khatam(x, cx, cy, 46); x.stroke(); } return o; })();
  function drawFloorStatic(c) {
    const pat = c.createPattern(tile, 'repeat');
    for (let y = FL; y < H + LM; y += 2) { const a = (y - HZ) / 460, v = 160000 / (y - HZ); pat.setTransform(new DOMMatrix([a, 0, 0, a, 540, y - a * v])); c.fillStyle = pat; c.fillRect(-LM, y, W + 2 * LM, 2.5); }
    const g = c.createLinearGradient(0, FL, 0, FL + 260); g.addColorStop(0, 'rgba(40,30,20,.55)'); g.addColorStop(1, 'rgba(40,30,20,0)'); c.fillStyle = g; c.fillRect(-LM, FL, W + 2 * LM, 260);
  }
  const FLOORC = prerender(drawFloorStatic, 1.2);
  const PIERS = [95, 395, 685, 985], OPEN = [[245, 230], [540, 220], [835, 230]];
  const courtStars = (() => { const r = rng(77); return Array.from({ length: 220 }, () => ({ x: r() * W, y: r() * 860, s: .5 + r() * 1.7, ph: r() * 6.3, tw: .5 + r() * 1.5 })); })();
  const ROS = (() => { const pts = []; for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, R = i % 2 ? 175 : 300; pts.push([540 + Math.cos(a) * R, 520 + Math.sin(a) * R]); } return pts; })();
  function skyCol(day) { const top = day > .5 ? mix('#2b2f5c', '#5F8FB8', (day - .5) * 2) : mix('#040818', '#2b2f5c', day * 2), bot = day > .5 ? mix('#E3906A', '#F0D6A8', (day - .5) * 2) : mix('#1a2a52', '#E3906A', day * 2); return [top, bot]; }
  function drawArcadeFront(c, day, lamp) {
    const stone = mix('#1f2840', '#B08A62', day), dark = mix('#141a2c', '#7a5a3e', day);
    c.save(); c.beginPath(); c.rect(-LM, 640, W + 2 * LM, FL - 640); for (const [x, w] of OPEN) archPath(c, x, FL, w, 470, true); c.clip('evenodd');
    c.fillStyle = stone; c.fillRect(-LM, 640, W + 2 * LM, FL - 640);
    c.fillStyle = dark; c.fillRect(-LM, 700, W + 2 * LM, 96); lattice(c, -40, 712, W + 80, 80, 40, mix('#3a4a70', '#E9D3A0', day), 1.6, .8); // frise
    for (let x = -LM; x < W + LM; x += 54) { c.fillStyle = stone; c.fillRect(x, 610, 30, 32); } // merlons
    for (const x of PIERS) { c.fillStyle = dark; c.fillRect(x - 35, 1180, 70, 120); lattice(c, x - 32, 1190, 64, 100, 32, mix('#2c4a6a', '#2c5a6a', day), 1.4, .9); } // zellige au pied des piliers
    c.restore();
    for (const [x, w] of OPEN) { c.save(); archPath(c, x, FL, w, 470, true); c.strokeStyle = mix('#3a4a70', '#E9C990', day); c.lineWidth = 6; c.stroke(); c.restore();
      if (lamp > 0) { c.fillStyle = rgba('#FFD08A', .9 * lamp); c.beginPath(); c.moveTo(x, 940); c.lineTo(x + 16, 968); c.lineTo(x, 1000); c.lineTo(x - 16, 968); c.closePath(); c.fill(); c.strokeStyle = rgba('#3a2a1a', lamp); c.lineWidth = 2; c.beginPath(); c.moveTo(x, 830); c.lineTo(x, 940); c.stroke(); glow(c, x, 968, 200, '#FFC878', .55 * lamp); } }
  }
  function drawCourt(c, t, st) {
    const day = st.day, [top, bot] = skyCol(day);
    let g = c.createLinearGradient(0, -LM, 0, FL); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, FL + LM);
    const sp = st.sun, sx = lerp(140, 940, sp), sy = 900 - Math.sin(sp * Math.PI) * 410;
    if (day > .3) { glow(c, sx, sy, 420, '#FFF2D0', .6 * clamp((day - .3) / .4)); c.fillStyle = rgba('#FFF8E8', clamp((day - .3) / .3)); c.beginPath(); c.arc(sx, sy, 46, 0, 6.283); c.fill(); }
    const night = clamp((.55 - day) / .4);
    for (const s of courtStars) { const a = night * (.35 + .65 * Math.pow(.5 + .5 * Math.sin(t * s.tw + s.ph), 2)); if (a > .01) { c.fillStyle = rgba('#EEF2FF', a); c.beginPath(); c.arc(s.x, s.y, s.s, 0, 6.283); c.fill(); } }
    const sg = st.signs; // les signes : les étoiles se relient en géométrie
    if (sg > 0) { c.save(); c.strokeStyle = rgba('#F3D9A0', .8 * sg); c.lineWidth = 2.4; c.shadowColor = '#FFD98A'; c.shadowBlur = 12;
      for (const off_ of [6, 3]) { const pts = []; for (let i = 0; i <= 16; i++) pts.push(ROS[(i * off_) % 16]); strokeProg(c, pts, clamp(sg * 1.3 - (off_ === 3 ? .3 : 0))); }
      c.restore(); for (const [x, y] of ROS) { glow(c, x, y, 40, '#FFF2D0', .7 * sg); c.fillStyle = rgba('#FFFFFF', sg); c.beginPath(); c.arc(x, y, 3.2, 0, 6.283); c.fill(); } }
    c.fillStyle = mix('#0c1226', '#9a7a5a', day); c.beginPath(); c.arc(540, 620, 150, Math.PI, 2 * Math.PI); c.fill(); c.fillRect(380, 610, 320, 40); c.fillRect(905, 330, 34, 320); c.beginPath(); c.moveTo(900, 330); c.lineTo(922, 270); c.lineTo(944, 330); c.fill(); // coupole et minaret lointains
    blit(c, FLOORC);
    c.fillStyle = rgba('#0a1430', .72 * (1 - day)); c.fillRect(-LM, FL, W + 2 * LM, H + LM - FL); // la nuit sur le dallage
    if (day > .45) { const a = clamp((day - .45) / .35), Ls = lerp(1.25, .45, Math.sin(sp * Math.PI)), sh = (540 - sx) / 520; // la lumière à travers les arcs
      c.save(); c.globalCompositeOperation = 'screen'; for (const [x, w] of OPEN) { c.save(); c.transform(1, 0, sh * -.9, -Ls * .62, x, FL); archPath(c, 0, 0, w, 470, true); c.fillStyle = rgba('#FFE2A8', .42 * a); c.fill(); c.restore(); } c.restore(); }
    drawArcadeFront(c, day, st.lamp);
    // le bassin : il reflète le ciel (la réflexion)
    const pq = [[350, 1440], [730, 1440], [880, 1770], [200, 1770]];
    c.fillStyle = mix('#3a3a4a', '#E9DCC4', day * .8); quad(c, [[330, 1424], [750, 1424], [906, 1790], [174, 1790]]); c.fill();
    c.save(); quad(c, pq); c.clip(); g = c.createLinearGradient(0, 1440, 0, 1770); g.addColorStop(0, bot); g.addColorStop(1, top); c.fillStyle = g; c.fillRect(150, 1430, 780, 360);
    for (const s of courtStars) { const a = night * .5; if (a > .02 && s.y < 700) { c.fillStyle = rgba('#EEF2FF', a); c.beginPath(); c.arc(s.x, 1440 + (860 - s.y) * .38, s.s * .8, 0, 6.283); c.fill(); } }
    if (sg > 0) { c.save(); c.translate(0, 1440 + 860 * .38); c.scale(1, -.38); c.strokeStyle = rgba('#F3D9A0', .5 * sg * (.6 + .4 * st.refl)); c.lineWidth = 3; for (const off_ of [6, 3]) { c.beginPath(); for (let i = 0; i <= 16; i++) { const p = ROS[(i * off_) % 16]; i ? c.lineTo(p[0], p[1] + 0) : c.moveTo(p[0], p[1]); } c.stroke(); } c.restore(); }
    c.strokeStyle = rgba('#FFFFFF', .12 + .18 * st.refl); c.lineWidth = 2; for (let k = 0; k < 10; k++) { const y = 1460 + k * 32, w = 120 + k * 30; c.beginPath(); c.moveTo(540 - w + Math.sin(t * 1.3 + k) * 14, y); c.lineTo(540 + w + Math.sin(t * 1.3 + k) * 14, y); c.stroke(); }
    if (st.drop > 0) for (let k = 0; k < 3; k++) { const ph = clamp(st.drop - k * .18); if (ph > 0 && ph < 1) { c.strokeStyle = rgba('#FFF6DC', (1 - ph) * .7); c.lineWidth = 2.5; c.beginPath(); c.ellipse(540, 1600, ph * 260, ph * 70, 0, 0, 6.283); c.stroke(); } }
    c.restore();
  }
  function scene5(c, t) {
    const z = lerp(1.1, 1.0, prog(t, T.s5, T.s6, 'inOutSine'));
    camSafe(c, z, 540, lerp(1000, 940, prog(t, T.s5, T.s6, 'inOutSine')));
    const cyc = prog(t, T.s5 + .2, T.signes - .2, 'inOutSine');
    drawCourt(c, t, { day: 1 - cyc, sun: lerp(.2, .98, cyc), signs: prog(t, T.signes - .15, T.signes + 1.3, 'inOutCubic'), lamp: clamp((.5 - (1 - cyc)) * 2.5), refl: prog(t, T.reflexion - .1, T.reflexion + .6, 'outCubic'), drop: prog(t, T.reflexion - .1, T.reflexion + 1.6, 'linear') });
    c.setTransform(1, 0, 0, 1, 0, 0);
    const tg = c.createLinearGradient(0, 0, 0, 760); tg.addColorStop(0, 'rgba(12,10,26,.62)'); tg.addColorStop(.75, 'rgba(12,10,26,.3)'); tg.addColorStop(1, 'rgba(12,10,26,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 760); // lisibilité des titres sur le ciel de jour
    vignette(c, .45, '#040610');
    flash(c, '#D9A070', 1 - prog(t, T.s5, T.s5 + .6, 'outCubic'));
    flash(c, '#14060a', prog(t, T.s6 - .4, T.s6, 'inCubic'));
  }

  /* =====================================================================
     DÉCOR 6 — LA CHAPELLE ET LE PANNEAU DE CRIVELLI ; les deux niveaux de Thomas
     ===================================================================== */
  function drawChapelBg(c) {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d0507'); g.addColorStop(.5, '#26090f'); g.addColorStop(1, '#0a0405'); c.fillStyle = g; c.fillRect(-LM, -LM, W + 2 * LM, H + 2 * LM);
    const o = off(W, H), x = o.getContext('2d'), r = rng(19), COL = ['#2b4c9e', '#9e2b3a', '#c9a24a', '#2f7a5a', '#6a3a8a'];
    for (const [cx, w] of [[150, 150], [540, 200], [930, 150]]) {
      x.save(); archPath(x, cx, 1180, w, 1040, true); x.clip(); x.fillStyle = '#0a0608'; x.fillRect(cx - w, 100, w * 2, 1100);
      for (let yy = 140; yy < 1180; yy += 34) for (let xx = cx - w / 2; xx < cx + w / 2; xx += 30) { x.fillStyle = rgba(COL[Math.floor(r() * COL.length)], .35 + r() * .35); x.fillRect(xx + 2, yy + 2, 26, 30); }
      x.restore(); x.save(); archPath(x, cx, 1180, w, 1040, true); x.strokeStyle = '#3a2a20'; x.lineWidth = 10; x.stroke(); x.restore();
    }
    c.filter = 'blur(7px)'; c.globalAlpha = .75; c.drawImage(o, 0, 0); c.globalAlpha = 1; c.filter = 'none';
    g = c.createLinearGradient(0, 1300, 0, H); g.addColorStop(0, '#1a0a0c'); g.addColorStop(1, '#060203'); c.fillStyle = g; c.fillRect(-LM, 1320, W + 2 * LM, H);
  }
  const CHAPEL = prerender(drawChapelBg, 1.2);
  function candle(c, t, x, y, h, k) {
    c.fillStyle = '#1a120c'; c.fillRect(x - 20, y, 40, 10); c.fillRect(x - 5, y - 30, 10, 30); c.fillStyle = '#E9DEC8'; c.fillRect(x - 8, y - 30 - h, 16, h);
    const wob = Math.sin(t * 9 + k) * 1.6 + Math.sin(t * 21 + k * 2) * .8, fy = y - 30 - h - 14;
    glow(c, x, fy, 360, C.lamp, .32); glow(c, x, fy, 70, '#FFE2A8', .7);
    c.fillStyle = 'rgba(255,231,176,.95)'; c.beginPath(); c.ellipse(x + wob, fy, 6, 16, wob * .05, 0, 6.283); c.fill();
  }
  function drawPanel(c, t, x, y, w, h, kb, sheen) {
    const pad = 22;
    c.fillStyle = 'rgba(0,0,0,.6)'; c.filter = 'blur(20px)'; c.fillRect(x - pad + 14, y - pad + 24, w + pad * 2, h + pad * 2); c.filter = 'none';
    // couronnement gothique
    c.save(); c.beginPath(); c.moveTo(x - pad, y - pad); c.quadraticCurveTo(x - pad, y - pad - w * .08, x + w / 2, y - pad - w * .12); c.quadraticCurveTo(x + w + pad, y - pad - w * .08, x + w + pad, y - pad); c.closePath();
    let g = c.createLinearGradient(x, y - w * .12, x + w, y); g.addColorStop(0, '#6a4a1c'); g.addColorStop(.5, '#E9C77A'); g.addColorStop(1, '#7a5420'); c.fillStyle = g; c.fill();
    c.strokeStyle = '#3a2410'; c.lineWidth = 3; c.stroke(); c.restore();
    g = c.createLinearGradient(x - pad, y, x + w + pad, y + h); g.addColorStop(0, '#7a5420'); g.addColorStop(.35, '#F0D08A'); g.addColorStop(.6, '#9a6a28'); g.addColorStop(1, '#5a3a14');
    c.fillStyle = g; c.fillRect(x - pad, y - pad, w + pad * 2, h + pad * 2);
    c.fillStyle = '#2a1808'; c.fillRect(x - 4, y - 4, w + 8, h + 8);
    const iw = IMG.naturalWidth, ih = IMG.naturalHeight, sw = iw / kb.z, sh = ih / kb.z, scx = clamp(kb.cx * iw, sw / 2, iw - sw / 2), scy = clamp(kb.cy * ih, sh / 2, ih - sh / 2);
    c.drawImage(IMG, scx - sw / 2, scy - sh / 2, sw, sh, x, y, w, h);
    g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(20,6,8,.15)'); g.addColorStop(1, 'rgba(255,190,110,.12)'); c.fillStyle = g; c.fillRect(x, y, w, h); // lumière des bougies
    if (sheen > 0 && sheen < 1) { c.save(); c.beginPath(); c.rect(x - pad, y - pad - w * .12, w + pad * 2, h + pad * 2 + w * .12); c.clip(); c.globalCompositeOperation = 'screen'; const sx = lerp(x - 300, x + w + 300, sheen); g = c.createLinearGradient(sx - 120, y, sx + 120, y + 240); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,.35)'); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(x - pad, y - pad - w * .12, w + pad * 2, h + pad * 2 + w * .12); c.restore(); }
  }
  const STEPS = 7, ST0 = [104, 1252], STW = 76, STR = 24;
  function scene6(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    const z = lerp(1.06, 1.0, prog(t, T.s6, T.s7, 'inOutSine')); cam(c, z, 540, 960);
    blit(c, CHAPEL);
    const pb = prog(t, T.phaseB, T.phaseB + .9, 'inOutCubic');
    const A = [270, 400, 540, 810], B = [400, 362, 280, 420], R = A.map((v, i) => lerp(v, B[i], pb));
    candle(c, t, 150, 1440, 120, 0); candle(c, t, 930, 1440, 120, 2); candle(c, t, 220, 1500, 70, 4); candle(c, t, 860, 1500, 70, 6);
    const kz = lerp(1, 1.18, prog(t, T.s6, T.phaseB, 'inOutSine')) * (1 - pb) + pb;
    drawPanel(c, t, R[0], R[1], R[2], R[3], { z: kz, cx: lerp(.5, .43, (kz - 1) / .18), cy: lerp(.5, .3, (kz - 1) / .18) }, prog(t, T.s6 + .3, T.s6 + 2.2, 'inOutSine'));
    // les deux niveaux
    const pd = clamp((pb - .5) / .5);
    if (pd > 0) {
      const lim = 1000, rv = prog(t, T.revelation - .2, T.revelation + .8, 'outCubic');
      c.fillStyle = rgba('#0a0405', .55 * pd); c.fillRect(0, 840, W, 430);
      // rosace : la révélation
      const rx = 540, ry = 905, rr = 58; c.save(); c.globalAlpha = pd; c.strokeStyle = mix('#7a6034', '#F3D9A0', rv); c.lineWidth = 3;
      c.beginPath(); c.arc(rx, ry, rr, 0, 6.283); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.arc(rx + Math.cos(a) * rr * .55, ry + Math.sin(a) * rr * .55, rr * .38, 0, 6.283); c.stroke(); } c.restore();
      glow(c, rx, ry, 220, '#FFE2A0', .7 * rv);
      if (rv > 0) { c.save(); c.globalCompositeOperation = 'screen'; for (let i = -3; i <= 3; i++) beam(c, rx, ry + 30, rx + i * 70 - 40, 1240, rx + i * 70 + 40, 1240, '#FFE9B8', .1 * rv, 10); c.restore(); }
      // la limite
      const ll = prog(t, T.depasse - .2, T.depasse + .6, 'inOutCubic');
      c.save(); c.setLineDash([14, 12]); c.strokeStyle = rgba('#F3D9A0', .9 * pd); c.lineWidth = 3; strokeProg(c, [[90, lim], [990, lim]], ll); c.restore();
      // l'escalier : la raison monte, marche après marche
      for (let k = 0; k < STEPS; k++) { const p = prog(t, T.raison6 - .1 + k * .1, T.raison6 + .25 + k * .1, 'outCubic'); if (p <= 0) continue;
        const x = ST0[0] + k * STW, y = ST0[1] - (k + 1) * STR; c.globalAlpha = p; c.fillStyle = stoneFill(c, x, y, x + STW, ST0[1]); c.fillRect(x, y, STW + 1, ST0[1] - y); c.strokeStyle = 'rgba(10,6,4,.8)'; c.lineWidth = 2; c.strokeRect(x, y, STW, ST0[1] - y); c.globalAlpha = 1; }
      const climb = prog(t, T.connaitre - .3, T.depasse + .2, 'inOutSine'), kf = climb * (STEPS - 1), px = ST0[0] + kf * STW + STW * .5, py = ST0[1] - (Math.floor(kf) + 1) * STR - (kf % 1) * STR * 0;
      person(c, { x: px, y: py, s: .52, f: 1, walk: climb > 0 && climb < 1 ? t * 7 : null, head: -.35 * rv }, { rim: '#FFE2A0', rimA: .5 + .5 * rv, rimDx: 1, body: '#0a0607', alpha: pd });
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
    vignette(c, .55, '#070203');
    flash(c, '#14060a', 1 - prog(t, T.s6, T.s6 + .55, 'outCubic'));
    flash(c, '#F6E3B8', prog(t, T.s7 - .4, T.s7, 'inCubic'));
  }

  /* ---------- Scène 7 : la leçon (la bibliothèque à l'aube, le chiasme) ---------- */
  function scene7(c, t) {
    const z = lerp(1.08, 1.0, prog(t, T.s7, T.s8, 'inOutSine'));
    camSafe(c, z, 540, lerp(1060, 960, prog(t, T.s7, T.s8, 'inOutSine')));
    const up = prog(t, T.s7, T.lecon + .6, 'inOutCubic');
    drawLibrary(c, t, { dawn: 1, win: 1, shaft: 1, candle: .5, pose: { lean: lerp(.18, .02, up), handFace: lerp(.6, 0, up), headUp: lerp(.3, .95, up) } });
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = 'rgba(14,9,5,.5)'; c.fillRect(0, 0, W, H); // le texte d'abord
    // les arcs du chiasme (dessinés pendant l'échange)
    const sp = prog(t, T.swap - .05, T.swap + .9, 'inOutCubic');
    if (sp > 0) { c.save(); c.lineWidth = 3; c.lineCap = 'round'; c.shadowColor = '#FFD98A'; c.shadowBlur = 14;
      c.strokeStyle = rgba('#E8949A', .8); strokeProg(c, Array.from({ length: 30 }, (_, i) => { const u = i / 29; return [540 - Math.sin(u * Math.PI) * 330, lerp(SLOT_A + 80, SLOT_B + 80, u)]; }), sp);
      c.strokeStyle = rgba('#F3D9A0', .8); strokeProg(c, Array.from({ length: 30 }, (_, i) => { const u = i / 29; return [540 + Math.sin(u * Math.PI) * 330, lerp(SLOT_B + 80, SLOT_A + 80, u)]; }), sp); c.restore(); }
    vignette(c, .5, '#0a0603');
    flash(c, '#F6E3B8', 1 - prog(t, T.s7, T.s7 + .6, 'outCubic'));
    flash(c, '#030306', .8 * prog(t, T.s8 - .4, T.s8, 'inCubic'));
  }

  /* ---------- Scène 8 : la question à l'élève ---------- */
  function scene8(c, t) {
    const push = prog(t, T.s8, T.qEnd, 'inOutSine'), out = prog(t, T.qEnd - .2, T.title + .4, 'inOutCubic');
    camSafe(c, lerp(1.06, 1.36, push) - out * .04, lerp(560, 520, push), lerp(1080, 1250, push));
    const fear = prog(t, T.peur - .15, T.peur + .3, 'outCubic') * (1 - prog(t, T.poser - .1, T.poser + .5, 'inOutCubic')), brave = prog(t, T.poser - .2, T.poser + .9, 'inOutCubic');
    drawLibrary(c, t, { dawn: .25 * brave, win: .35 + .3 * brave, shaft: .3, candle: 1, flicker: fear, motes: prog(t, T.questions - .3, T.questions + .8, 'outCubic') * (1 - .6 * fear),
      pose: { lean: .12 + .1 * fear - .1 * brave, handFace: lerp(.1, .95, fear) * (1 - brave), headUp: lerp(.55, .1, fear) * (1 - brave) + brave } });
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = rgba('#05060a', .5 + .1 * fear); c.fillRect(0, 0, W, H);
    c.fillStyle = rgba('#05060a', .45 * prog(t, T.qEnd, T.title + .4, 'inOutCubic')); c.fillRect(0, 0, W, H);
    vignette(c, .6);
    flash(c, '#030306', .8 * (1 - prog(t, T.s8, T.s8 + .6, 'outCubic')));
  }

  /* =====================================================================
     MONTAGE
     ===================================================================== */
  const scenes = [[0, T.s2 + .5, scene1], [T.s2 + .5, T.s3, scene2], [T.s3, T.s4, scene3], [T.s4, T.s5, scene4], [T.s5, T.s6, scene5], [T.s6, T.s7, scene6], [T.s7, T.s8, scene7], [T.s8, DUR + 1, scene8]];
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
    (function () { const p = prog(t, .25, 1.4, 'outCubic'), o = 1 - prog(t, T.question - .4, T.question, 'inCubic'); set(tSeries, { y: (1 - p) * 20, s: 1.04 - .04 * p, o: p * o, blur: (1 - p) * 10 }); })();
    const q1 = T.s2 + .25;
    slam(tQ1, t, T.foi - .04, q1, .3); fade(tQ2, t, T.oppose - .05, q1, .45, 14, .3); fade(tQ3, t, T.reellement - .05, q1, .45, 14, .3); slam(tQ4, t, T.raisonQ - .04, q1, .3);
    fade(tDist, t, T.distinction - .1, T.s3 - .3, .6, 10, .3);
    wipe(tRai, t, T.raison2 - .05, T.s3 - .3, .7, .3); fade(tRai2, t, T.examine - .05, T.s3 - .3, .5, 10, .3);
    wipe(tFoi, t, T.foi2 - .05, T.s3 - .3, .7, .3); fade(tFoi2, t, T.confiance - .1, T.s3 - .3, .5, 10, .3);
    fade(tDeux, t, T.deux - .05, T.s4 - .3, .6, 10, .3); fade(tLR, t, T.s3 + .5, T.s4 - .3, .5, 8, .3); fade(tLF, t, T.differentes, T.s4 - .3, .5, 8, .3);
    slam(tDif, t, T.differente - .04, T.s4 - .3, .3); slam(tEnn, t, T.ennemie - .02, T.s4 - .3, .3);
    fade(tBib, t, T.bible - .1, T.s5 - .3, .6, 10, .3); fade(tBibRef, t, T.thess - .1, T.s5 - .3, .6, 10, .3);
    fade(tV1, t, T.examinez - .08, T.s5 - .3, .6, 16, .3); fade(tV2, t, T.retenez - .08, T.s5 - .3, .7, 16, .3); fade(tLSG, t, T.retenez + .5, T.s5 - .3, .6, 6, .3);
    const sDim = 1 - .75 * prog(t, T.signes - .2, T.signes + .3, 'linear');
    fade(tSour, t, T.coran - .1, T.s6 - .3, .6, 10, .3); fade(tAr, t, T.coran + .15, T.s6 - .3, .8, 10, .3); fade(tVers, t, T.sourate + .2, T.s6 - .3, .6, 10, .3);
    [tSour, tAr, tVers].forEach(n => { n.style.opacity = (parseFloat(n.style.opacity) * sDim).toFixed(3); });
    slam(tSig, t, T.signes - .03, T.s6 - .3, .3); fade(tRR, t, T.raison5 - .05, T.s6 - .3, .6, 12, .3);
    fade(tTho, t, T.thomas - .1, T.s7 - .3, .7, 12, .3); fade(tThoSub, t, T.thomas + .5, T.s7 - .3, .6, 8, .3);
    fade(tCred, t, T.thomas + .4, T.phaseB, .6, 0, .3); fade(tST, t, T.phaseB + .7, T.s7 - .3, .6, 8, .3);
    fade(tRev, t, T.phaseB + .6, T.s7 - .3, .6, 8, .3); fade(tRH, t, T.raison6, T.s7 - .3, .6, 8, .3); fade(tCon, t, T.connaitre - .1, T.s7 - .3, .6, 8, .3); fade(tDep, t, T.depasse - .05, T.s7 - .3, .6, 8, .3);
    if (t > T.revelation) tRev.style.color = mix('#F3D9A0', '#FFFFFF', prog(t, T.revelation, T.revelation + .5, 'linear'));
    // le chiasme
    fade(tLecon, t, T.lecon - .15, T.s8 - .3, .6, 10, .3);
    const sp = prog(t, T.swap - .05, T.swap + .9, 'inOutCubic'), end7 = 1 - prog(t, T.s8 - .3, T.s8, 'inCubic');
    const pc = prog(t, T.croire - .04, T.croire + .4, 'outCubic'), pr = prog(t, T.reflechir - .04, T.reflechir + .4, 'outCubic');
    set(tCroire, { x: -Math.sin(sp * Math.PI) * 300, y: lerp(SLOT_A, SLOT_B, sp) + (1 - pc) * 16, o: pc * end7, blur: (1 - pc) * 5 });
    set(tRefl, { x: Math.sin(sp * Math.PI) * 300, y: lerp(SLOT_B, SLOT_A, sp) + (1 - pr) * 16, o: pr * end7, blur: (1 - pr) * 5 });
    fade(tMid1, t, T.dispense - .1, T.swap - .2, .5, 10, .25);
    fade(tMid2, t, T.signifie - .1, T.s8 - .3, .5, 10, .3); fade(tMid3, t, T.cesser - .1, T.s8 - .3, .5, 10, .3);
    // la question, mot après mot
    const W_ = T.qWords, outQ = 1 - prog(t, T.title - .25, T.title + .15, 'inCubic');
    tQ.forEach(n => { n.style.opacity = outQ > 0 && t > T.q - .2 ? 1 : 0; n.querySelectorAll('.qw').forEach(s => { const w = W_[+s.dataset.i] || W_[W_.length - 1], p = prog(t, w.start - .04, w.start + .35, 'outCubic'); set(s, { y: (1 - p) * 16, o: p * outQ, blur: (1 - p) * 6 }); }); });
    const tp = prog(t, T.title, T.title + 1.2, 'outCubic');
    set(tTitle, { o: tp, y: (1 - tp) * 18, blur: (1 - tp) * 8 });
    tTitle.style.backgroundPosition = `${(100 - prog(t, T.title + .2, T.title + 1.8, 'inOutSine') * 100).toFixed(1)}% 0`;
    fade(tSlogan, t, T.title + .7, 1e9, .7, 8); fade(tFour, t, T.title + 1.2, 1e9, .7, 6);
  }

  /* ---------- événements sonores (le mixage et la musique en découlent) ---------- */
  [['s1', 0], ['s2', T.s2 + .3], ['s3', T.s3], ['s4', T.s4], ['s5', T.s5], ['s6', T.s6], ['s7', T.s7], ['s8', T.s8]].forEach(([n, x]) => sfx('sec_' + n, x));
  sfx('library', 0, { d: T.s2 + .4 }); sfx('candle', .4, { d: T.s2 }); sfx('light', T.eleve - .2);
  sfx('slam', T.foi - .04); sfx('slam', T.raisonQ - .04); sfx('cut', T.raisonQ + .55, { d: T.s2 + .45 - T.raisonQ - .55 });
  sfx('page', T.s2 + .45); sfx('line', T.distinction); [T.examine, T.affirmation, T.coherente, T.repose].forEach(x => sfx('quill', x)); sfx('glow', T.foi2); sfx('shimmer', T.revelee);
  for (let k = 0; k < 4; k++) sfx('stone', T.s3 + .5 + k * .18); for (let i = 0; i < 4; i++) sfx('stone', T.deux + i * .16 + .4); for (let i = 5; i < 9; i++) sfx('glass', T.differentes + (8 - i) * .14 + .5);
  sfx('tension', T.attention - .3, { d: T.ennemie + .3 - T.attention }); sfx('keystone', T.ennemie + .32);
  sfx('daylight', T.s4); sfx('page', T.s4 + .4); sfx('lens', T.examinez); sfx('gold', T.retenez);
  sfx('fountain', T.s5, { d: T.s6 - T.s5 + .3 }); sfx('dusk', T.signes - 1.6); sfx('stars', T.signes); sfx('drop', T.reflexion);
  sfx('candle', T.s6, { d: T.s7 - T.s6 }); sfx('frame', T.phaseB); for (let k = 0; k < STEPS; k++) sfx('step_soft', T.raison6 + .2 + k * .1); sfx('revelation', T.revelation);
  sfx('dawn', T.s7); sfx('swap', T.swap - .05); sfx('chime', T.croire2);
  sfx('question', T.q); sfx('flicker', T.peur); sfx('reveal', T.title);

  window.DURATION = DUR;
  window.renderFrame = render;
  window.SFX = GX.SFX;
  window.renderCover = function () { // couverture : la bibliothèque, l'élève, la question
    render(T.raisonQ + .5);
    set(tSeries, { o: 1, blur: 0, s: 1, y: -10 }); [tQ1, tQ2, tQ3, tQ4].forEach(n => set(n, { o: 1, blur: 0, s: 1 })); SUBS.style.opacity = 0;
  };

  render(0);
  window.__ready = true;
})().catch(e => { window.__error = String(e && e.stack || e); console.error(e); });
