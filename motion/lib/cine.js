/* =====================================================================
   CINE — boîte à outils « documentaire graphique » sur canvas
   (personnage-silhouette cohérent, lumière, faisceaux, poussière, grain,
   géométrie islamique, arches, bibliothèque, réseau neuronal abstrait…)
   Tout est fonction pure du temps : rendu image par image déterministe.
   ===================================================================== */
(function (global) {
  'use strict';
  const W = 1080, H = 1920;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const off = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let r = Math.imul(s ^ s >>> 15, 1 | s); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; };
  }
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  };
  const mix = (h1, h2, p) => {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    const c = [16, 8, 0].map(s => Math.round(lerp(a >> s & 255, b >> s & 255, p)));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  };

  /* ---------- grain film & vignette ---------- */
  const grainTiles = [];
  function initGrain() {
    for (let k = 0; k < 6; k++) {
      const c = off(256, 256), x = c.getContext('2d'), d = x.createImageData(256, 256), r = rng(100 + k);
      for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - .5) * 200; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      x.putImageData(d, 0, 0); grainTiles.push(c);
    }
  }
  function grain(ctx, frame, alpha = .07) {
    if (!grainTiles.length) initGrain();
    const tile = grainTiles[frame % grainTiles.length];
    ctx.save();
    ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'overlay';
    const p = ctx.createPattern(tile, 'repeat');
    const ox = (frame * 97) % 256, oy = (frame * 57) % 256;
    ctx.translate(-ox, -oy); ctx.fillStyle = p; ctx.fillRect(0, 0, W + 256, H + 256);
    ctx.restore();
  }
  function vignette(ctx, strength = .6, color = '#000000') {
    const g = ctx.createRadialGradient(W / 2, H * .46, H * .25, W / 2, H * .5, H * .78);
    g.addColorStop(0, rgba(color, 0)); g.addColorStop(1, rgba(color, strength));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function glow(ctx, x, y, r, color, alpha = 1, mode = 'screen') {
    if (alpha <= 0.002 || r <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = mode;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, alpha)); g.addColorStop(.35, rgba(color, alpha * .45)); g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.restore();
  }
  /** faisceau lumineux volumétrique : source (sx,sy) vers un segment (ax,ay)-(bx,by) */
  function beam(ctx, sx, sy, ax, ay, bx, by, color, alpha = .5, blur = 18) {
    if (alpha <= 0.002) return;
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    if (blur) ctx.filter = `blur(${blur}px)`;
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    const g = ctx.createLinearGradient(sx, sy, mx, my);
    g.addColorStop(0, rgba(color, alpha)); g.addColorStop(.6, rgba(color, alpha * .45)); g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(sx - 10, sy); ctx.lineTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(sx + 10, sy); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  /** poussière en suspension (déterministe) ; inside(x,y) -> facteur de lumière 0..1 */
  function makeDust(n, seed, box) {
    const r = rng(seed);
    return Array.from({ length: n }, () => ({ x: box[0] + r() * box[2], y: box[1] + r() * box[3], vx: (r() - .5) * 8, vy: -2 - r() * 10, s: .6 + r() * 2.2, ph: r() * 6.28, tw: .5 + r() * 2 }));
  }
  function dust(ctx, parts, t, box, color, alpha, inside) {
    if (alpha <= 0.01) return;
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (const p of parts) {
      const x = box[0] + (((p.x - box[0] + p.vx * t + Math.sin(t * .7 + p.ph) * 14) % box[2]) + box[2]) % box[2];
      const y = box[1] + (((p.y - box[1] + p.vy * t) % box[3]) + box[3]) % box[3];
      const k = inside ? inside(x, y) : 1;
      if (k <= 0.01) continue;
      const a = alpha * k * (.35 + .65 * Math.pow(.5 + .5 * Math.sin(t * p.tw + p.ph), 2));
      ctx.fillStyle = rgba(color, a);
      ctx.beginPath(); ctx.arc(x, y, p.s, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  }

  /* =====================================================================
     LE PERSONNAGE — silhouette unique, cohérente d'une scène à l'autre
     (proportions fixes, coiffure courte, sweat à capuche, téléphone)
     ===================================================================== */
  function ik(sx, sy, tx, ty, l1, l2, bendDir) {
    const dx = tx - sx, dy = ty - sy;
    let d = Math.hypot(dx, dy); d = Math.min(d, l1 + l2 - .01);
    const a = Math.atan2(dy, dx);
    const c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
    const b = Math.acos(c) * bendDir;
    return [sx + Math.cos(a + b) * l1, sy + Math.sin(a + b) * l1];
  }
  /**
   * pose : { x, y (pieds), s (échelle : 1 = 180 px de haut), f (1 regarde à droite, -1 à gauche),
   *          walk (phase en rad ou null), phone (0 bras baissé → 0.5 téléphone à la poitrine → 1 au visage),
   *          head (inclinaison, rad), glow (0..1 écran allumé) }
   * dessine dans ctx avec la couleur "fill" ; renvoie la position du téléphone.
   */
  function personPath(ctx, p) {
    const s = p.s || 1, f = p.f || 1;
    const P = (x, y) => [p.x + x * s * f, p.y + y * s];
    const walk = p.walk;
    const sw = walk == null ? 0 : Math.sin(walk);
    const bob = walk == null ? 0 : Math.abs(Math.cos(walk)) * 2.5;
    const hip = P(0, -92 + bob), sh = P(2, -148 + bob), neck = P(4, -156 + bob);
    const headC = P(7 + (p.head || 0) * 6, -169 + bob + (p.head || 0) * 4);
    const out = {};
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // jambes
    const legs = walk == null ? [[-.06, 0], [.08, 0]] : [[.42 * sw, Math.max(0, -Math.cos(walk)) * .7], [-.42 * sw, Math.max(0, Math.cos(walk)) * .7]];
    legs.forEach(([th, bend], i) => {
      const k = P(Math.sin(th) * 46 + (i ? 3 : -2), -92 + bob + Math.cos(th) * 46);
      const ang = th - bend;
      const ft = [k[0] + Math.sin(ang) * 46 * s * f, k[1] + Math.cos(ang) * 46 * s];
      ctx.lineWidth = 15 * s; ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(k[0], k[1]); ctx.lineTo(ft[0], ft[1]); ctx.stroke();
      ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(ft[0] - 2 * s * f, ft[1]); ctx.lineTo(ft[0] + 13 * s * f, ft[1] + 1); ctx.stroke();
    });
    // torse (sweat)
    ctx.beginPath();
    const tp = [P(-13, -150 + bob), P(13, -151 + bob), P(16, -128 + bob), P(12, -96 + bob), P(-11, -94 + bob), P(-16, -126 + bob)];
    ctx.moveTo(tp[0][0], tp[0][1]);
    for (let i = 1; i < tp.length; i++) ctx.lineTo(tp[i][0], tp[i][1]);
    ctx.closePath(); ctx.fill();
    ctx.lineWidth = 6 * s; ctx.stroke();
    // capuche (dos) et cou
    ctx.beginPath(); ctx.ellipse(...P(-8, -150 + bob), 10 * s, 6 * s, 0, 0, 6.283); ctx.fill();
    ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(neck[0], neck[1]); ctx.stroke();
    // tête + cheveux courts
    ctx.beginPath(); ctx.ellipse(headC[0], headC[1], 11.5 * s, 13 * s, (p.head || 0) * f, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.ellipse(headC[0] - 2 * s * f, headC[1] - 5 * s, 12 * s, 9 * s, -.2 * f, Math.PI, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.moveTo(...P(15 + (p.head || 0) * 6, -170 + bob)); ctx.lineTo(...P(18 + (p.head || 0) * 6, -164 + bob)); ctx.lineTo(...P(14 + (p.head || 0) * 6, -162 + bob)); ctx.fill(); // nez
    // bras : arrière (balancier) puis avant (téléphone)
    const shB = P(-4, -144 + bob), shF = P(6, -144 + bob);
    const armSw = walk == null ? 0 : -sw * .5;
    const hb = [shB[0] + Math.sin(-armSw) * 56 * s * f, shB[1] + Math.cos(armSw) * 56 * s];
    const eb = ik(shB[0], shB[1], hb[0], hb[1], 30 * s, 28 * s, -f);
    ctx.lineWidth = 11 * s; ctx.beginPath(); ctx.moveTo(shB[0], shB[1]); ctx.lineTo(eb[0], eb[1]); ctx.lineTo(hb[0], hb[1]); ctx.stroke();
    const ph = clamp(p.phone || 0);
    let target;
    if (p.hand) target = p.hand; // main posée sur un point précis (épaule, objet…)
    else if (ph <= 0) target = [shF[0] + Math.sin(armSw) * 56 * s * f, shF[1] + Math.cos(armSw) * 56 * s];
    else {
      const down = [shF[0] + 4 * s * f, shF[1] + 56 * s], chest = P(24, -118 + bob), face = P(22, -158 + bob);
      target = ph < .5 ? [lerp(down[0], chest[0], ph * 2), lerp(down[1], chest[1], ph * 2)] : [lerp(chest[0], face[0], (ph - .5) * 2), lerp(chest[1], face[1], (ph - .5) * 2)];
    }
    const ef = ik(shF[0], shF[1], target[0], target[1], 30 * s, 28 * s, f);
    ctx.lineWidth = 11 * s; ctx.beginPath(); ctx.moveTo(shF[0], shF[1]); ctx.lineTo(ef[0], ef[1]); ctx.lineTo(target[0], target[1]); ctx.stroke();
    out.hand = target; out.head = headC;
    return out;
  }
  const _pc = off(W, H), _px = _pc.getContext('2d');
  const _rc = off(W, H), _rx = _rc.getContext('2d');
  /** silhouette + liseré de lumière (rim) du côté de la source */
  function person(ctx, p, o = {}) {
    const body = o.body || '#07080b', rim = o.rim || null, rimA = o.rimA == null ? .9 : o.rimA, alpha = o.alpha == null ? 1 : o.alpha;
    _px.clearRect(0, 0, W, H);
    _px.fillStyle = body; _px.strokeStyle = body;
    const out = personPath(_px, p);
    if (rim) {
      _rx.clearRect(0, 0, W, H);
      _rx.fillStyle = rim; _rx.strokeStyle = rim;
      personPath(_rx, p);
      _rx.globalCompositeOperation = 'destination-out';
      _rx.fillStyle = '#000'; _rx.strokeStyle = '#000';
      const d = (o.rimW || 2.2) * Math.sqrt(p.s || 1);
      personPath(_rx, Object.assign({}, p, { x: p.x - (o.rimDx || 1) * d, y: p.y - (o.rimDy || 0) * d }));
      _rx.globalCompositeOperation = 'source-over';
    }
    ctx.save(); ctx.globalAlpha = alpha;
    if (o.blur) ctx.filter = `blur(${o.blur}px)`;
    ctx.drawImage(_pc, 0, 0);
    if (rim) { ctx.globalAlpha = alpha * rimA; ctx.drawImage(_rc, 0, 0); }
    ctx.restore();
    if (p.glow > 0 && p.phone > .2) {
      const [hx, hy] = out.hand;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = rgba('#DDE8FF', .9 * p.glow);
      ctx.fillRect(hx - 4 * (p.s || 1), hy - 7 * (p.s || 1), 8 * (p.s || 1), 13 * (p.s || 1));
      ctx.restore();
      glow(ctx, hx, hy, 70 * (p.s || 1), '#9FC0FF', .45 * p.glow * alpha);
      glow(ctx, out.head[0], out.head[1], 40 * (p.s || 1), '#9FC0FF', .22 * p.glow * alpha * clamp(p.phone * 1.5));
    }
    return out;
  }

  /* ---------- géométrie islamique (étoile à 8 branches, khatam) ---------- */
  function star8(ctx, cx, cy, R, r) {
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? r : R;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  }
  function khatam(ctx, cx, cy, R) { // deux carrés entrelacés
    ctx.beginPath();
    for (const rot of [0, Math.PI / 4]) {
      for (let i = 0; i < 4; i++) {
        const a = rot + Math.PI / 4 + i * Math.PI / 2;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    }
  }
  /** treillis géométrique dans la zone (x,y,w,h), pas L ; style : stroke color / width */
  function lattice(ctx, x, y, w, h, L, color, lw = 2, alpha = 1, prog = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw;
    const cols = Math.ceil(w / L) + 1, rows = Math.ceil(h / L) + 1;
    let k = 0; const tot = cols * rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (k++ / tot > prog) continue;
      const cx = x + i * L, cy = y + j * L;
      khatam(ctx, cx, cy, L * .36); ctx.stroke();
      star8(ctx, cx, cy, L * .2, L * .1); ctx.stroke();
      ctx.beginPath(); // liaisons en croix vers les voisins
      ctx.moveTo(cx + L * .36, cy); ctx.lineTo(cx + L * .64, cy);
      ctx.moveTo(cx, cy + L * .36); ctx.lineTo(cx, cy + L * .64);
      ctx.stroke();
    }
    ctx.restore();
  }
  /** arc brisé (ogive) ou plein cintre */
  function archPath(ctx, x, y, w, h, pointed) {
    const r = w / 2;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x - r, y - h + (pointed ? r * 1.25 : r));
    if (pointed) {
      ctx.quadraticCurveTo(x - r, y - h + r * .15, x, y - h);
      ctx.quadraticCurveTo(x + r, y - h + r * .15, x + r, y - h + r * 1.25);
    } else ctx.arc(x, y - h + r, r, Math.PI, 0);
    ctx.lineTo(x + r, y);
    ctx.closePath();
  }

  /* ---------- buste classique (profil) ---------- */
  function bustPath(ctx, x, y, s) {
    const P = (a, b) => [x + a * s, y + b * s];
    ctx.beginPath();
    ctx.moveTo(...P(205, 300));
    ctx.bezierCurveTo(...P(214, 262), ...P(232, 230), ...P(228, 196));
    ctx.bezierCurveTo(...P(226, 148), ...P(206, 110), ...P(162, 98));
    ctx.bezierCurveTo(...P(128, 92), ...P(104, 108), ...P(98, 138));
    ctx.bezierCurveTo(...P(96, 150), ...P(100, 156), ...P(96, 164));
    ctx.bezierCurveTo(...P(88, 176), ...P(76, 186), ...P(80, 194));
    ctx.bezierCurveTo(...P(84, 200), ...P(92, 199), ...P(92, 205));
    ctx.bezierCurveTo(...P(86, 214), ...P(84, 222), ...P(80, 232));
    ctx.bezierCurveTo(...P(70, 258), ...P(82, 290), ...P(110, 304));
    ctx.bezierCurveTo(...P(126, 312), ...P(136, 316), ...P(138, 330));
    ctx.bezierCurveTo(...P(126, 352), ...P(96, 368), ...P(86, 396));
    ctx.lineTo(...P(80, 424));
    ctx.lineTo(...P(268, 424));
    ctx.bezierCurveTo(...P(266, 380), ...P(250, 350), ...P(222, 330));
    ctx.bezierCurveTo(...P(210, 322), ...P(204, 312), ...P(205, 300));
    ctx.closePath();
  }
  function bust(ctx, x, y, s, light) {
    // marbre : dégradé + liseré de lumière + détails gravés
    ctx.save();
    bustPath(ctx, x, y, s);
    const g = ctx.createLinearGradient(x + 60 * s, y, x + 260 * s, y + 200 * s);
    g.addColorStop(0, mix('#E9E1D2', '#ffffff', light * .3)); g.addColorStop(.55, '#B9AE9C'); g.addColorStop(1, '#4A4338');
    ctx.fillStyle = g; ctx.fill();
    ctx.clip();
    // ombre portée intérieure côté nuque
    const g2 = ctx.createLinearGradient(x + 150 * s, 0, x + 270 * s, 0);
    g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(10,8,6,.65)');
    ctx.fillStyle = g2; ctx.fillRect(x, y, 300 * s, 440 * s);
    // détails : boucles de cheveux et de barbe, œil, oreille
    ctx.strokeStyle = 'rgba(60,52,42,.55)'; ctx.lineWidth = 2.2 * s; ctx.lineCap = 'round';
    const r = rng(7);
    for (let i = 0; i < 26; i++) { const a = r(), b = r(); const cx = x + (120 + a * 95) * s, cy = y + (104 + b * 60) * s; ctx.beginPath(); ctx.arc(cx, cy, (5 + r() * 6) * s, Math.PI * (.9 + r() * .4), Math.PI * (1.9 + r() * .4)); ctx.stroke(); }
    for (let i = 0; i < 34; i++) { const a = r(), b = r(); const cx = x + (84 + a * 52) * s, cy = y + (212 + b * 86) * s; ctx.beginPath(); ctx.arc(cx, cy, (4 + r() * 5) * s, Math.PI * (.1 + r() * .4), Math.PI * (1.1 + r() * .5)); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x + 104 * s, y + 160 * s); ctx.quadraticCurveTo(x + 114 * s, y + 154 * s, x + 124 * s, y + 161 * s); ctx.stroke(); // paupière
    ctx.beginPath(); ctx.moveTo(x + 98 * s, y + 140 * s); ctx.quadraticCurveTo(x + 114 * s, y + 133 * s, x + 130 * s, y + 141 * s); ctx.stroke(); // arcade
    ctx.beginPath(); ctx.arc(x + 178 * s, y + 186 * s, 13 * s, -Math.PI * .6, Math.PI * .7); ctx.stroke(); // oreille
    ctx.restore();
    // liseré de lumière doré (contre-jour)
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.strokeStyle = rgba('#F3D9A0', .35 + light * .4); ctx.lineWidth = 3 * s;
    ctx.filter = 'blur(1.2px)'; bustPath(ctx, x - 2 * s, y, s); ctx.stroke(); ctx.restore();
  }

  /* ---------- réseau abstrait (cerveau stylisé) ---------- */
  function makeBrain(cx, cy, rx, ry, n, seed) {
    const r = rng(seed), nodes = [];
    while (nodes.length < n) {
      const x = (r() * 2 - 1), y = (r() * 2 - 1);
      // contour : deux lobes et une base aplatie
      const inside = (x * x) / 1 + (y * y) / .62 < 1 && !(y > .38 && Math.abs(x) < .35);
      if (inside) nodes.push({ x: cx + x * rx, y: cy + y * ry * .85, d: r() });
    }
    const edges = [];
    nodes.forEach((a, i) => {
      const near = nodes.map((b, j) => [Math.hypot(a.x - b.x, a.y - b.y), j]).filter(e => e[1] !== i).sort((p, q) => p[0] - q[0]).slice(0, 3);
      near.forEach(([d, j]) => { if (j > i && d < rx * .45) edges.push([i, j, d]); });
    });
    return { nodes, edges };
  }

  global.CINE = { W, H, clamp, lerp, off, rng, rgba, mix, grain, vignette, glow, beam, makeDust, dust, person, personPath, star8, khatam, lattice, archPath, bust, makeBrain };
})(window);
