/* =====================================================================
   L'ÉNIGME HUMAINE : modèle « tableau vivant » (à partir de l'EP011)
   Une seule grammaire visuelle, réutilisée à chaque épisode : fond papier fixe, mots qui « claquent »
   au rythme de la voix, surligneur, pictogrammes au trait, cartes, barre de progression, enchaînements secs.
   Un épisode se décrit par une liste de « temps » (BEATS) dans scene.js ; ce moteur dessine tout le reste.
   ===================================================================== */
(function () {
  const W = 1080, H = 1920;
  const P = { paper: '#F4EFE6', ink: '#16131A', rose: '#D9566A', gold: '#C79A3E', blue: '#2F5DA8', soft: '#857E73', hl: 'rgba(240,196,92,.6)', card: '#FFFDF8', green: '#3E8E5A' };
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const pr = (t, a, b) => cl((t - a) / Math.max(1e-6, b - a));
  const oC = p => 1 - Math.pow(1 - p, 3);
  const oB = p => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  const FONTS = { titre: ['900', 'Bodoni'], fort: ['800', 'Inter'], texte: ['600', 'Inter'], ital: ['italic 400', 'Instrument'], ref: ['600', 'Fraunces'] };
  const font = (k, size) => `${FONTS[k][0]} ${size}px ${FONTS[k][1]}`;

  // ---------- fond ----------
  let PAPER = null;
  function paper(c) {
    if (!PAPER) {
      PAPER = document.createElement('canvas'); PAPER.width = W; PAPER.height = H; const p = PAPER.getContext('2d');
      p.fillStyle = P.paper; p.fillRect(0, 0, W, H);
      let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
      p.fillStyle = 'rgba(80,60,30,.035)'; for (let i = 0; i < 3000; i++) p.fillRect(r() * W, r() * H, 2, 2);
      const g = p.createRadialGradient(W / 2, H * .42, 200, W / 2, H * .42, 1200); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(120,96,60,.08)'); p.fillStyle = g; p.fillRect(0, 0, W, H);
    }
    c.drawImage(PAPER, 0, 0);
  }
  // barre de progression (au-dessus de la zone des boutons TikTok)
  function progress(c, p) { const x0 = 90, w = 900, y = 1470; c.fillStyle = 'rgba(22,19,26,.10)'; c.beginPath(); c.roundRect(x0, y, w, 10, 5); c.fill(); c.fillStyle = P.rose; c.beginPath(); c.roundRect(x0, y, Math.max(10, w * cl(p)), 10, 5); c.fill(); }

  // ---------- mots qui « claquent » ----------
  // tokens : [{ txt, t, hl, col, k }] ; renvoie les lignes posées (positions) pour une largeur maximale
  function layout(c, tokens, k, size, maxW, lh = 1.12) {
    c.font = font(k, size); const sp = c.measureText(' ').width;
    const lines = []; let cur = [], w = 0;
    tokens.forEach(tk => { if (tk.br && cur.length) { lines.push({ items: cur, w: w - sp }); cur = []; w = 0; } const tw = c.measureText(tk.txt).width; if (cur.length && w + tw > maxW) { lines.push({ items: cur, w: w - sp }); cur = []; w = 0; } cur.push(Object.assign({ w: tw }, tk)); w += tw + sp; });
    if (cur.length) lines.push({ items: cur, w: w - sp });
    return { lines, size, lh: size * lh, sp, k };
  }
  // choisit la plus grande taille qui tient dans la boîte (largeur, hauteur)
  function fit(c, tokens, k, maxSize, maxW, maxH, lh) { let s = maxSize, L; do { L = layout(c, tokens, k, s, maxW, lh); s -= 4; } while ((L.lines.length * L.lh > maxH || L.lines.some(l => l.w > maxW)) && s > 26); return L; }
  // dessine un bloc de mots centré en (cx, top) ; chaque mot apparaît à son instant t (rebond), le surligneur passe sous les mots hl
  function words(c, L, cx, top, t, o = {}) {
    const col = o.col || P.ink;
    L.lines.forEach((ln, li) => {
      let x = cx - ln.w / 2; const y = top + (li + .82) * L.lh;
      ln.items.forEach(tk => {
        const a = tk.t == null || tk.t < -.5 ? 1 : pr(t, tk.t - .06, tk.t + .16), s = tk.t == null || tk.t < -.5 ? 1 : oB(pr(t, tk.t - .06, tk.t + .3));
        if (a > 0) {
          if (tk.hl) { const hp = tk.t < -.5 ? 1 : oC(pr(t, tk.t, tk.t + .35)); c.fillStyle = tk.hlc || P.hl; c.beginPath(); c.roundRect(x - 10, y - L.size * .58, (tk.w + 20) * hp, L.size * .66, 10); c.fill(); }
          c.save(); c.globalAlpha = a; c.translate(x + tk.w / 2, y - L.size * .3); c.scale(.6 + .4 * s, .6 + .4 * s); c.translate(-(x + tk.w / 2), -(y - L.size * .3));
          c.font = font(tk.k || L.k, L.size); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
          if (L.k === 'titre' || L.k === 'fort') { c.fillStyle = 'rgba(22,19,26,.12)'; c.fillText(tk.txt, x + 4, y + 5); }
          c.fillStyle = tk.col || col; c.fillText(tk.txt, x, y); c.restore();
        }
        x += tk.w + L.sp;
      });
    });
    return top + L.lines.length * L.lh;
  }
  function text(c, txt, x, y, k, size, col, o = {}) { c.save(); c.globalAlpha = o.a == null ? 1 : o.a; c.font = font(k, size); while (c.measureText(txt).width > (o.max || 960) && size > 18) { size -= 2; c.font = font(k, size); } c.textAlign = o.align || 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = col; c.fillText(txt, x, y); c.restore(); }

  // ---------- cartes et pictogrammes ----------
  function card(c, x, y, w, h, a = 1, o = {}) { if (a <= 0) return; c.save(); c.globalAlpha = a; const dy = (1 - a) * 30; c.fillStyle = 'rgba(22,19,26,.10)'; c.beginPath(); c.roundRect(x + 8, y + 10 + dy, w, h, 28); c.fill(); c.fillStyle = o.fill || P.card; c.beginPath(); c.roundRect(x, y + dy, w, h, 28); c.fill(); c.strokeStyle = o.stroke || 'rgba(22,19,26,.85)'; c.lineWidth = 5; c.stroke(); c.restore(); }
  function strike(c, x0, y0, x1, y1, p) { if (p <= 0) return; c.save(); c.strokeStyle = P.rose; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); c.stroke(); c.restore(); }
  // pictogrammes : dessinés au trait, révélés de gauche à droite (p : 0 → 1)
  const IC = {
    telephone(c) { c.roundRect(-70, -130, 140, 260, 26); c.moveTo(-20, 105); c.lineTo(20, 105); },
    lune(c) { c.arc(0, 0, 90, Math.PI * .35, Math.PI * 1.65); c.arc(38, 0, 70, Math.PI * 1.5, Math.PI * .5, true); c.closePath(); },
    horloge(c) { c.arc(0, 0, 110, 0, 6.283); c.moveTo(0, 0); c.lineTo(0, -70); c.moveTo(0, 0); c.lineTo(55, 0); },
    bulle(c) { c.roundRect(-140, -90, 280, 160, 50); c.moveTo(-60, 70); c.lineTo(-90, 125); c.lineTo(-10, 72); },
    points(c) { [-60, 0, 60].forEach(x => { c.moveTo(x + 14, -10); c.arc(x, -10, 14, 0, 6.283); }); },
    coeur(c) { c.moveTo(0, 90); c.bezierCurveTo(-170, -30, -90, -150, 0, -60); c.bezierCurveTo(90, -150, 170, -30, 0, 90); },
    check(c) { c.moveTo(-40, 0); c.lineTo(-10, 30); c.lineTo(45, -35); },
    cube(c) { c.moveTo(0, -100); c.lineTo(95, -50); c.lineTo(95, 60); c.lineTo(0, 110); c.lineTo(-95, 60); c.lineTo(-95, -50); c.closePath(); c.moveTo(-95, -50); c.lineTo(0, 0); c.lineTo(95, -50); c.moveTo(0, 0); c.lineTo(0, 110); },
    visages(c) { // deux personnes face à face, reliées : la rencontre
      [-85, 85].forEach(x => { c.moveTo(x + 32, -60); c.arc(x, -60, 32, 0, 6.283); c.moveTo(x - 62, 110); c.quadraticCurveTo(x, -10, x + 62, 110); });
      c.moveTo(-40, -95); c.quadraticCurveTo(0, -140, 40, -95);
    },
    personnes(c) { for (let i = 0; i < 6; i++) { const x = -150 + (i % 3) * 150, y = i < 3 ? -60 : 90; c.moveTo(x + 26, y - 40); c.arc(x, y - 40, 26, 0, 6.283); c.moveTo(x - 45, y + 50); c.quadraticCurveTo(x, y - 20, x + 45, y + 50); } },
    fleche(c) { c.moveTo(0, 110); c.lineTo(0, -100); c.moveTo(-60, -40); c.lineTo(0, -100); c.lineTo(60, -40); },
    attention(c) { c.moveTo(0, -115); c.lineTo(115, 95); c.lineTo(-115, 95); c.closePath(); c.moveTo(0, -40); c.lineTo(0, 25); c.moveTo(0, 55); c.lineTo(0, 62); },
    miroir(c) { c.ellipse(0, -20, 85, 115, 0, 0, 6.283); c.moveTo(0, 95); c.lineTo(0, 140); c.moveTo(-45, 140); c.lineTo(45, 140); c.moveTo(-40, -70); c.lineTo(-10, -100); },
    personne(c) { c.moveTo(34, -70); c.arc(0, -70, 34, 0, 6.283); c.moveTo(-70, 110); c.quadraticCurveTo(0, -20, 70, 110); },
    commentaire(c) { c.roundRect(-130, -80, 260, 150, 30); c.moveTo(-40, 70); c.lineTo(-40, 120); c.lineTo(10, 70); c.moveTo(-80, -20); c.lineTo(80, -20); c.moveTo(-80, 20); c.lineTo(40, 20); },
    robot(c) { c.roundRect(-95, -80, 190, 160, 30); c.moveTo(-35, -10); c.arc(-40, -10, 6, 0, 6.283); c.moveTo(46, -10); c.arc(40, -10, 6, 0, 6.283); c.moveTo(-35, 35); c.lineTo(35, 35); c.moveTo(0, -80); c.lineTo(0, -120); c.moveTo(12, -128); c.arc(0, -128, 12, 0, 6.283); },
  };
  function icon(c, name, x, y, s, p = 1, col = P.ink, lw = 9) {
    if (p <= 0 || !IC[name]) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.rect(-200, -200, 400 * oC(p), 400); c.clip();
    c.strokeStyle = col; c.lineWidth = lw / s; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); IC[name](c); c.stroke(); c.restore();
  }

  window.TB = { W, H, P, pr, oC, oB, font, paper, progress, layout, fit, words, text, card, strike, icon, IC };
})();
