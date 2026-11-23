/* =====================================================================
   L'ÉNIGME HUMAINE : identité de la série (logo B, « la serrure humaine »)
   Dessiné par code, sans image externe. Utilisé par :
     - motion/brand/enigme/logo.html (fichiers du logo) ;
     - chaque épisode à partir de l'EP009 (logo à l'ouverture, logo en haut de l'écran, carton de fin).
   Couleurs de la série : charbon #111216, ivoire #F2EFE8, or #C0A16A, rose #E8949A, bordeaux #541D2A.
   ===================================================================== */
(function () {
  const C = { coal: '#111216', ivory: '#F2EFE8', gold: '#C0A16A', rose: '#E8949A', bord: '#541D2A' };
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const pr = (t, a, b) => cl((t - a) / (b - a));
  const oC = p => 1 - Math.pow(1 - p, 3), ioS = p => .5 - .5 * Math.cos(Math.PI * p);
  function goldGrad(c, x0, y0, x1, y1) { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#7A5A22'); g.addColorStop(.35, '#F3DFA8'); g.addColorStop(.6, '#C0A16A'); g.addColorStop(1, '#6A4A18'); return g; }

  // la silhouette en trou de serrure : une tête, un cou, des épaules, puis le corps qui s'évase
  function keyholePath(c, x, y, r) {
    const hr = r * .21, hy = y - r * .22, by = y + r * .6, a = .5, sx = 1.0, sy = 1.75, bx = 1.55;
    const x1 = x + Math.sin(a) * hr, y1 = hy + Math.cos(a) * hr, shx = x + sx * hr, shy = hy + sy * hr;
    c.beginPath();
    c.arc(x, hy, hr, Math.PI / 2 + a, Math.PI / 2 - a + 2 * Math.PI); // la tête, ouverte en bas
    c.bezierCurveTo(x1 - hr * .02, y1 + hr * .35, shx - hr * .55, shy - hr * .25, shx, shy); // le cou, puis l'épaule qui s'évase
    c.lineTo(x + bx * hr, by); c.quadraticCurveTo(x, by + r * .06, x - bx * hr, by); // le corps et sa base arrondie
    c.lineTo(2 * x - shx, shy);
    c.bezierCurveTo(2 * x - shx + hr * .55, shy - hr * .25, 2 * x - x1 + hr * .02, y1 + hr * .35, 2 * x - x1, y1);
    c.closePath();
  }

  /* icon(c, x, y, r, o) : le logo rond.
     o.light : 0 → 1, la lumière qui traverse la serrure (1 = allumé)
     o.ring  : 0 → 1, l'anneau doré qui se trace (1 = complet)
     o.flat  : vrai pour une version sans dégradé de fond (petites tailles)  */
  function icon(c, x, y, r, o = {}) {
    const L = o.light == null ? 1 : o.light, R = o.ring == null ? 1 : o.ring;
    c.save();
    // le disque : charbon, réchauffé de bordeaux au centre
    const bg = c.createRadialGradient(x, y - r * .1, r * .05, x, y, r);
    bg.addColorStop(0, o.flat ? C.coal : '#2B1519'); bg.addColorStop(.62, '#17121A'); bg.addColorStop(1, C.coal);
    c.fillStyle = bg; c.beginPath(); c.arc(x, y, r, 0, 2 * Math.PI); c.fill();
    c.save(); c.beginPath(); c.arc(x, y, r * .9, 0, 2 * Math.PI); c.clip();
    // les rayons très doux : la lumière qui passe par la serrure
    if (L > 0 && !o.flat) {
      c.globalCompositeOperation = 'lighter';
      const hg = c.createRadialGradient(x, y - r * .05, r * .1, x, y - r * .05, r * .95);
      hg.addColorStop(0, `rgba(243,223,168,${(.22 * L).toFixed(3)})`); hg.addColorStop(.5, `rgba(192,161,106,${(.07 * L).toFixed(3)})`); hg.addColorStop(1, 'rgba(192,161,106,0)');
      c.fillStyle = hg; c.fillRect(x - r, y - r, 2 * r, 2 * r);
      c.globalCompositeOperation = 'source-over';
    }
    // la serrure humaine
    const g = c.createLinearGradient(0, y - r * .45, 0, y + r * .66);
    const mixc = (a, b, k) => { const p = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
    g.addColorStop(0, mixc('#2a2026', '#FFF8EA', L)); g.addColorStop(.55, mixc('#231a20', '#F3DFA8', L)); g.addColorStop(1, mixc('#1d161b', '#C0A16A', L));
    c.shadowColor = `rgba(243,223,168,${(.75 * L).toFixed(3)})`; c.shadowBlur = r * (.08 + .14 * L); c.fillStyle = g;
    keyholePath(c, x, y, r); c.fill();
    c.shadowBlur = 0;
    if (L > 0) { // un cœur de lumière plus vif dans la tête
      c.globalCompositeOperation = 'lighter';
      const hy = y - r * .22, kg = c.createRadialGradient(x, hy, 0, x, hy, r * .3);
      kg.addColorStop(0, `rgba(255,250,235,${(.28 * L).toFixed(3)})`); kg.addColorStop(1, 'rgba(255,250,235,0)');
      c.fillStyle = kg; c.beginPath(); c.arc(x, hy, r * .32, 0, 2 * Math.PI); c.fill();
      c.globalCompositeOperation = 'source-over';
    }
    c.restore();
    // l'anneau doré (double filet)
    if (R > 0) {
      const w = r * .045, a0 = -Math.PI / 2, a1 = a0 + 2 * Math.PI * R;
      c.lineCap = 'round'; c.strokeStyle = goldGrad(c, x - r, y - r, x + r, y + r);
      c.lineWidth = w; c.beginPath(); c.arc(x, y, r - w / 2, a0, a1); c.stroke();
      c.lineWidth = w * .25; c.beginPath(); c.arc(x, y, r - w * 1.9, a0, a1); c.stroke();
    }
    c.restore();
  }

  // le nom de la série (Instrument Serif italique, rose) et la devise (Fraunces, or)
  function wordmark(c, x, y, s, o = {}) {
    c.save(); c.textAlign = o.align || 'center'; c.textBaseline = 'alphabetic';
    c.font = `italic 400 ${Math.round(118 * s)}px Instrument`;
    const g = c.createLinearGradient(0, y - 90 * s, 0, y + 10 * s); g.addColorStop(0, o.light ? '#7A2E3A' : '#FFF7F2'); g.addColorStop(1, o.light ? '#541D2A' : '#EE9FA4');
    c.fillStyle = g; if (o.shadow) { c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 18 * s; c.shadowOffsetY = 3 * s; }
    c.fillText('L’Énigme humaine', x, y);
    if (o.motto !== false) {
      c.shadowBlur = 0; c.font = `600 ${Math.round(24 * s)}px Fraunces`; c.fillStyle = o.light ? '#8A6A2A' : C.gold;
      c.letterSpacing = `${(.32 * 24 * s).toFixed(1)}px`; c.fillText('FAIS TA PROPRE RÉFLEXION', x + (c.textAlign === 'center' ? 4 * s : 0), y + 62 * s);
    }
    c.restore();
  }

  /* bug(c, t, o) : le logo en haut de l'écran, pendant toute la vidéo.
     0 → 0,45 s : il s'allume (l'anneau se trace, la lumière traverse la serrure, un éclat), avec la signature sonore.
     Le nom s'affiche à côté jusqu'à o.hold (3,4 s), puis se replie : il ne reste que le logo, discret, en haut à gauche, dans la zone sûre de TikTok (sous les onglets, loin des boutons).
     o.out : instant où il s'efface (carton de fin). */
  const BUG = { x: 92, y: 206, r: 40 };
  function bug(c, t, o = {}) {
    const out = o.out == null ? 1e9 : o.out, hold = o.hold == null ? 3.4 : o.hold;
    const fade = 1 - pr(t, out - .35, out);
    if (fade <= 0) return;
    const R = oC(pr(t, 0, .32)), L = oC(pr(t, .1, .45));
    const a = (.92 - .1 * pr(t, 1.6, 2.6)) * fade; // un peu plus discret après les premières secondes
    const { x, y, r } = BUG;
    c.save(); c.globalAlpha = a;
    // une pastille sombre translucide, lisible sur fond clair comme sur fond sombre
    const shut = ioS(pr(t, hold, hold + .6)), pw = oC(pr(t, .15, .65)) * (1 - shut), ww = 282 * pw, ph = r + 8;
    c.save(); c.beginPath(); c.moveTo(x, y - ph); c.lineTo(x + ww, y - ph); c.arc(x + ww, y, ph, -Math.PI / 2, Math.PI / 2); c.lineTo(x, y + ph); c.arc(x, y, ph, Math.PI / 2, 3 * Math.PI / 2); c.closePath();
    c.fillStyle = 'rgba(17,18,22,.55)'; c.fill(); c.lineWidth = 1.5; c.strokeStyle = `rgba(192,161,106,${(.45 * pw).toFixed(3)})`; c.stroke(); c.restore();
    icon(c, x, y, r, { light: L, ring: R });
    // l'éclat à l'allumage
    const fl = Math.sin(Math.PI * pr(t, .18, .62));
    if (fl > 0) { c.globalCompositeOperation = 'lighter'; const fg = c.createRadialGradient(x, y - r * .25, 0, x, y - r * .25, r * 2.6); fg.addColorStop(0, `rgba(255,240,205,${(.55 * fl).toFixed(3)})`); fg.addColorStop(1, 'rgba(255,240,205,0)'); c.fillStyle = fg; c.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); c.globalCompositeOperation = 'source-over'; }
    // le nom, qui glisse depuis le logo
    const wp = oC(pr(t, .2, .7)) * (1 - ioS(pr(t, hold - .1, hold + .35)));
    if (wp > 0) {
      c.save(); c.beginPath(); c.rect(x + r + 4, y - 60, Math.max(0, ww + ph - r - 10), 120); c.clip();
      c.globalAlpha = a * wp; c.translate(-40 * (1 - wp), 0);
      wordmark(c, x + r + 16, y + 12, .34, { align: 'left', motto: false });
      c.restore();
    }
    c.restore();
  }

  /* endCard(c, t, t0, o) : le carton de fin. Le fond s'assombrit à partir de t0 - 0,5 s ;
     à t0, le logo s'allume au centre (même signature sonore, mêmes instants que l'ouverture), puis le nom, la devise et l'appel à suivre.
     o.cta : la phrase d'appel (une ligne), o.cta2 : une seconde ligne facultative. */
  const CTA = 'Suis la série';
  const CTA2 = 'une nouvelle question chaque semaine';
  function endCard(c, t, t0, o = {}) {
    if (t < t0 - .5) return;
    const W = c.canvas.width, H = c.canvas.height;
    const veil = ioS(pr(t, t0 - .5, t0 + .1)); // le fond s'assombrit juste avant que le logo s'allume
    c.save();
    c.fillStyle = `rgba(17,18,22,${(.9 * veil).toFixed(3)})`; c.fillRect(0, 0, W, H);
    const v = c.createRadialGradient(W / 2, H * .4, 40, W / 2, H * .4, 900); v.addColorStop(0, `rgba(84,29,42,${(.42 * veil).toFixed(3)})`); v.addColorStop(1, 'rgba(84,29,42,0)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
    const R = oC(pr(t, t0, t0 + .36)), L = oC(pr(t, t0 + .1, t0 + .48)), zs = 1.06 - .06 * oC(pr(t, t0, t0 + 1.6));
    const cx = W / 2, cy = H * .37, r = 230 * zs;
    if (R > 0) icon(c, cx, cy, r, { light: L, ring: R });
    const fl = Math.sin(Math.PI * pr(t, t0 + .2, t0 + .8));
    if (fl > 0) { c.globalCompositeOperation = 'lighter'; const fg = c.createRadialGradient(cx, cy - r * .25, 0, cx, cy - r * .25, r * 2.2); fg.addColorStop(0, `rgba(255,240,205,${(.35 * fl).toFixed(3)})`); fg.addColorStop(1, 'rgba(255,240,205,0)'); c.fillStyle = fg; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; }
    const wp = oC(pr(t, t0 + .45, t0 + 1.1));
    if (wp > 0) { c.save(); c.globalAlpha = wp; c.translate(0, 14 * (1 - wp)); wordmark(c, cx, cy + r + 170, 1.02); c.restore(); }
    const cp = oC(pr(t, t0 + .9, t0 + 1.5));
    if (cp > 0) {
      c.save(); c.globalAlpha = cp; c.translate(0, 12 * (1 - cp)); c.textAlign = 'center';
      const y1 = cy + r + 330;
      c.font = '600 46px Fraunces'; c.fillStyle = C.ivory; c.fillText(o.cta || CTA, cx, y1);
      if ((o.cta2 || CTA2)) { c.font = 'italic 400 50px Instrument'; c.fillStyle = C.rose; c.fillText(o.cta2 || CTA2, cx, y1 + 64); }
      // un trait doré qui se trace sous l'appel
      const lp = oC(pr(t, t0 + 1.1, t0 + 1.8));
      c.strokeStyle = goldGrad(c, cx - 160, 0, cx + 160, 0); c.lineWidth = 3; c.beginPath(); c.moveTo(cx - 150 * lp, y1 + 104); c.lineTo(cx + 150 * lp, y1 + 104); c.stroke();
      c.restore();
    }
    c.restore();
  }

  window.EH = { C, icon, wordmark, bug, endCard, keyholePath, BUG, CTA, CTA2,
    // instants des deux notes de la signature sonore, relatifs au départ du logo (pour score.py)
    SIGNATURE: [.02, .24] };
})();
