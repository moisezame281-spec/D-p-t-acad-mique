/* =====================================================================
   GEXAA MOTION — moteur d'animation image par image
   Tout est une fonction pure du temps t (secondes) : chaque image est
   rendue de façon déterministe, ce qui permet un rendu vidéo parfait.
   ===================================================================== */
(function (global) {
  'use strict';

  const W = 1080, H = 1920, FPS = 30;
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Palette de marque (voir brand/CHARTE.md) ---------- */
  const C = {
    night: '#061733',     // Encre de nuit (fond)
    navy: '#0A2A5E',      // Bleu GEXAA
    ink: '#0A2148',       // Encre d'écriture sur papier
    gold: '#D89C1F',      // Or laurier
    goldLight: '#F3CB6B', // Or lumière
    goldDeep: '#A8740F',  // Or profond (texte sur ivoire)
    green: '#0E8C6E',     // Vert savoir
    greenLight: '#2BC29A',
    ivory: '#F6F1E6',     // Ivoire parchemin
  };

  /* ---------- Courbes d'accélération ---------- */
  const E = {
    linear: x => x,
    inQuad: x => x * x,
    outQuad: x => 1 - (1 - x) * (1 - x),
    inCubic: x => x * x * x,
    outCubic: x => 1 - Math.pow(1 - x, 3),
    inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    outQuart: x => 1 - Math.pow(1 - x, 4),
    inOutQuart: x => x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
    outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
    inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
    inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
    outSine: x => Math.sin(x * Math.PI / 2),
    outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    outBackSoft: x => { const c1 = 1.1, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    outElastic: x => x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI) / 3.2) + 1,
    outBounce: x => {
      const n1 = 7.5625, d1 = 2.75;
      if (x < 1 / d1) return n1 * x * x;
      if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + .75;
      if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + .9375;
      return n1 * (x -= 2.625 / d1) * x + .984375;
    },
  };

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  /** progression 0..1 entre a et b avec easing */
  function prog(t, a, b, ease = 'outExpo') {
    if (t <= a) return 0;
    if (t >= b) return 1;
    const f = typeof ease === 'function' ? ease : E[ease];
    return f((t - a) / (b - a));
  }
  /** keyframes : [[temps, valeur, easing?], ...] — l'easing s'applique au segment qui arrive sur la clé */
  function tw(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, ez] = keys[i];
      if (t <= t1) {
        const [t0, v0] = keys[i - 1];
        return lerp(v0, v1, prog(t, t0, t1, ez || 'inOutCubic'));
      }
    }
    return keys[keys.length - 1][1];
  }
  /** apparition / disparition combinées */
  function inout(t, a, da, b, db, ein = 'outCubic', eout = 'inCubic') {
    return prog(t, a, a + da, ein) * (1 - prog(t, b, b + db, eout));
  }
  /** générateur pseudo-aléatoire déterministe */
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let r = Math.imul(s ^ s >>> 15, 1 | s); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; };
  }

  /* ---------- DOM helpers ---------- */
  function el(tag, parent, attrs = {}, html) {
    const n = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'style') Object.assign(n.style, attrs.style);
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  function sv(tag, parent, attrs = {}) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function svgLayer(parent, z) {
    return sv('svg', parent, { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: `position:absolute;left:0;top:0;overflow:visible;${z != null ? 'z-index:' + z : ''}` });
  }
  /** applique transformations + opacité + flou */
  function set(node, p = {}) {
    const x = p.x || 0, y = p.y || 0, s = p.s == null ? 1 : p.s, r = p.r || 0;
    const sx = p.sx == null ? s : p.sx, sy = p.sy == null ? s : p.sy;
    node.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    if (p.o != null) node.style.opacity = clamp(p.o).toFixed(3);
    if (p.blur != null) node.style.filter = p.blur > .05 ? `blur(${p.blur.toFixed(2)}px)` : 'none';
  }
  /** découpe un élément texte en spans (lettres ou mots) */
  function split(node, mode = 'chars') {
    const text = node.textContent;
    node.innerHTML = '';
    const parts = mode === 'words' ? text.split(/(\s+)/) : Array.from(text);
    const spans = [];
    parts.forEach(part => {
      if (/^\s+$/.test(part)) { node.appendChild(document.createTextNode(' ')); return; }
      const s = el('span', node, { style: { display: 'inline-block', willChange: 'transform,opacity' } });
      s.textContent = part;
      spans.push(s);
    });
    return spans;
  }
  /** animation de texte décalée : chaque span entre avec un léger flou */
  function stagger(spans, t, start, step, dur = .6, opts = {}) {
    const dy = opts.dy == null ? 26 : opts.dy, blur = opts.blur == null ? 8 : opts.blur;
    spans.forEach((s, i) => {
      const p = prog(t, start + i * step, start + i * step + dur, opts.ease || 'outCubic');
      const out = opts.out != null ? prog(t, opts.out + i * (opts.outStep || 0), opts.out + i * (opts.outStep || 0) + (opts.outDur || .45), 'inCubic') : 0;
      set(s, { y: (1 - p) * dy - out * (opts.outDy == null ? 30 : opts.outDy), o: p * (1 - out), blur: (1 - p) * blur + out * blur });
    });
  }

  /* ---------- Polices ---------- */
  const fonts = {};
  async function loadFont(name, url) {
    const buf = await (await fetch(url)).arrayBuffer();
    fonts[name] = opentype.parse(buf);
    return fonts[name];
  }

  /* ---------- Journal des événements sonores (exporté pour la bande-son) ---------- */
  const SFX = [];
  function sfx(type, t, extra = {}) { SFX.push(Object.assign({ type, t: +t.toFixed(3) }, extra)); }

  /* =====================================================================
     SCRIPT — écriture manuscrite "à la plume"
     Chaque glyphe est un tracé plein, révélé par un masque : un trait
     épais qui suit le contour de la lettre (effet encre qui coule).
     ===================================================================== */
  let uid = 0;
  class Script {
    constructor(parent, text, o = {}) {
      const font = fonts[o.font || 'script'];
      let size = o.size || 160;
      const opts = { kerning: true };
      let width = font.getAdvanceWidth(text, size, opts);
      if (o.maxWidth && width > o.maxWidth) { size *= o.maxWidth / width; width = o.maxWidth; }
      const anchor = o.anchor || 'middle';
      let x0 = o.x || 0;
      if (anchor === 'middle') x0 -= width / 2; else if (anchor === 'end') x0 -= width;
      const y = o.y || 0;
      this.size = size; this.width = width; this.x0 = x0; this.y = y;
      this.g = sv('g', parent, { class: 'script' });
      const defs = sv('defs', this.g);
      let fill = o.fill || C.ivory;
      if (o.gradient) {
        const id = 'sg' + (++uid);
        const lg = sv('linearGradient', defs, { id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: y - size * .8, x2: 0, y2: y + size * .25 });
        o.gradient.forEach(([off, col]) => sv('stop', lg, { offset: off, 'stop-color': col }));
        fill = `url(#${id})`;
      }
      const reveal = (o.reveal || .17) * size;
      this.glyphs = [];
      let ci = 0;
      font.forEachGlyph(text, x0, y, size, opts, (glyph, gx, gy) => {
        const d = glyph.getPath(gx, gy, size).toPathData(2);
        const ch = text[ci++];
        if (!d || d.length < 4) { this.glyphs.push({ ch, empty: true }); return; }
        const id = 'gm' + (++uid);
        const mask = sv('mask', defs, { id, maskUnits: 'userSpaceOnUse', x: -W, y: -H, width: 3 * W, height: 3 * H });
        const mp = sv('path', mask, { d, fill: 'none', stroke: '#fff', 'stroke-width': reveal, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        const path = sv('path', this.g, { d, fill, mask: `url(#${id})` });
        const len = path.getTotalLength();
        mp.setAttribute('stroke-dasharray', `${len + 1} ${len + 1}`);
        this.glyphs.push({ ch, path, mp, len, id, state: null });
      });
      const real = this.glyphs.filter(g => !g.empty);
      const total = real.reduce((a, g) => a + Math.pow(g.len, .8), 0);
      let acc = 0;
      real.forEach(g => { g.a = acc / total; acc += Math.pow(g.len, .8); g.b = acc / total; });
      this.real = real;
      this.setProgress(0);
    }
    /** boîte englobante d'une plage de caractères (pour soulignements) */
    bbox(i0, i1) {
      let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
      this.glyphs.slice(i0, i1).forEach(g => {
        if (g.empty) return;
        const b = g.path.getBBox();
        x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.width); y2 = Math.max(y2, b.y + b.height);
      });
      return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
    }
    setProgress(p) {
      const TRAVEL = .14; // part du temps où la plume se déplace sans écrire
      let pen = null;
      this.real.forEach((g, i) => {
        let q = (p - g.a) / (g.b - g.a);
        if (q <= 0) { this._state(g, 'hidden'); return; }
        if (q >= 1) { this._state(g, 'done'); if (i === this.real.length - 1 && p < 1.0001) pen = this._pt(g, 1); return; }
        const travel = i === 0 ? 0 : TRAVEL;
        if (q < travel) {
          this._state(g, 'hidden');
          const prev = this._pt(this.real[i - 1], 1), next = this._pt(g, 0);
          const k = E.inOutSine(q / travel);
          pen = { x: lerp(prev.x, next.x, k), y: lerp(prev.y, next.y, k) - Math.sin(k * Math.PI) * this.size * .12, lift: Math.sin(k * Math.PI) };
          return;
        }
        const r = (q - travel) / (1 - travel);
        this._state(g, 'writing');
        g.mp.setAttribute('stroke-dashoffset', (g.len + 1) * (1 - r));
        pen = this._pt(g, r);
      });
      this.pen = pen;
    }
    _state(g, s) {
      if (g.state === s) return;
      g.state = s;
      if (s === 'done') { g.path.removeAttribute('mask'); g.path.style.visibility = 'visible'; }
      else if (s === 'hidden') { g.path.setAttribute('mask', `url(#${g.id})`); g.path.style.visibility = 'hidden'; }
      else { g.path.setAttribute('mask', `url(#${g.id})`); g.path.style.visibility = 'visible'; }
    }
    _pt(g, r) {
      const p = g.path.getPointAtLength(clamp(r) * g.len);
      const m = this.g.getScreenCTM();
      if (m) { const sp = new DOMPoint(p.x, p.y).matrixTransform(m); return { x: sp.x, y: sp.y, lift: 0 }; }
      return { x: p.x, y: p.y, lift: 0 };
    }
    /** écrit le texte entre start et start+dur ; fait apparaître la plume */
    frame(t, start, dur) {
      const p = clamp((t - start) / dur);
      this.setProgress(p);
      if (t > start - .35 && t < start + dur + .45 && this.real.length) {
        let pt = this.pen || this._pt(p <= 0 ? this.real[0] : this.real[this.real.length - 1], p <= 0 ? 0 : 1);
        const aIn = prog(t, start - .35, start, 'outCubic'), aOut = 1 - prog(t, start + dur, start + dur + .45, 'inCubic');
        const lift = (1 - aIn) + (1 - aOut) + (pt.lift || 0) * .6;
        Pen.show(pt.x, pt.y, Math.min(aIn, aOut), lift, t);
      }
    }
    register(start, dur) { sfx('pen', start, { d: dur, n: this.real.length }); return this; }
  }

  /* =====================================================================
     PEN — la Plume d'Or (signature visuelle n°1)
     ===================================================================== */
  const Pen = {
    init(stage) {
      const s = svgLayer(stage, 90);
      s.style.pointerEvents = 'none';
      const defs = sv('defs', s);
      defs.innerHTML = `
        <linearGradient id="nibGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#9C6A0C"/><stop offset=".35" stop-color="#F6D27A"/>
          <stop offset=".55" stop-color="#E2A934"/><stop offset="1" stop-color="#8A5A08"/></linearGradient>
        <linearGradient id="barrel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#05142E"/><stop offset=".4" stop-color="#2A4C8C"/>
          <stop offset=".6" stop-color="#0E2D63"/><stop offset="1" stop-color="#030C20"/></linearGradient>
        <filter id="penShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="10" dy="16" stdDeviation="9" flood-color="#000" flood-opacity=".38"/></filter>`;
      this.g = sv('g', s, { filter: 'url(#penShadow)' });
      this.inner = sv('g', this.g);
      this.inner.innerHTML = `
        <path d="M-31,-158 L-27,-470 Q0,-486 27,-470 L31,-158 Z" fill="url(#barrel)" stroke="#D89C1F" stroke-width="1.6"/>
        <rect x="-35" y="-176" width="70" height="20" rx="5" fill="url(#nibGold)"/>
        <rect x="-33" y="-200" width="66" height="8" rx="3" fill="url(#nibGold)" opacity=".9"/>
        <path d="M0,0 C-3,-16 -27,-58 -30,-98 L-30,-156 L30,-156 L30,-98 C27,-58 3,-16 0,0 Z" fill="url(#nibGold)" stroke="#6E4706" stroke-width="1.6"/>
        <path d="M0,-3 L0,-74" stroke="#4A3005" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="0" cy="-81" r="6.5" fill="#4A3005"/>
        <path d="M-19,-122 Q0,-131 19,-122 M-22,-138 Q0,-147 22,-138" stroke="#7E560B" stroke-width="1.6" fill="none"/>
        <path d="M-12,-40 C-16,-60 -20,-80 -21,-100" stroke="#FFF3C8" stroke-width="2" fill="none" opacity=".55"/>`;
      this.hide();
    },
    hide() { this.g.style.display = 'none'; this.visible = false; },
    show(x, y, a, lift, t) {
      if (a <= .001) return;
      const wob = Math.sin(t * 7.3) * 1.6 + Math.sin(t * 11.1) * .8;
      const lx = lift * 34, ly = -lift * 46;
      this.g.style.display = '';
      this.g.setAttribute('opacity', clamp(a).toFixed(3));
      this.g.setAttribute('transform', `translate(${(x + lx).toFixed(1)},${(y + ly).toFixed(1)}) rotate(${(33 + wob).toFixed(2)}) scale(.52)`);
    },
  };

  /* =====================================================================
     INK — l'Encre qui se répand (signature n°3) : tache organique
     ===================================================================== */
  const Ink = {
    init(stage) {
      const s = svgLayer(stage, 60);
      s.style.pointerEvents = 'none';
      s.innerHTML = `<defs>
        <filter id="inkF" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="4" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="150" xChannelSelector="R" yChannelSelector="G"/>
        </filter></defs>`;
      this.svg = s;
      this.blobs = sv('g', s, { filter: 'url(#inkF)' });
      this.c = [0, 1, 2].map(() => sv('circle', this.blobs, { r: 0 }));
      s.style.display = 'none';
    },
    /** une transition : la couleur recouvre tout l'écran entre start et start+dur */
    transitions: [],
    add(start, dur, color, cx = W / 2, cy = H / 2) { this.transitions.push({ start, dur, color, cx, cy }); sfx('whoosh', start, { d: dur }); },
    frame(t) {
      const tr = this.transitions.find(o => t >= o.start && t <= o.start + o.dur + .02);
      if (!tr) { this.svg.style.display = 'none'; return; }
      this.svg.style.display = '';
      const p = prog(t, tr.start, tr.start + tr.dur, 'inOutCubic');
      const R = 1500;
      const offs = [[0, 0, 1], [-220, 260, .78], [240, -300, .72]];
      this.c.forEach((c, i) => {
        const [dx, dy, k] = offs[i];
        const pp = clamp(p * (1 + i * .12) - i * .06);
        c.setAttribute('cx', tr.cx + dx * (1 - pp * .6));
        c.setAttribute('cy', tr.cy + dy * (1 - pp * .6));
        c.setAttribute('r', (Math.pow(pp, 1.15) * R * k + (i ? 0 : 20 * (1 - p))).toFixed(1));
        c.setAttribute('fill', tr.color);
      });
    },
  };

  /* =====================================================================
     Poussière d'or (canvas) — déterministe
     ===================================================================== */
  const Dust = {
    init(stage, n = 70) {
      this.cv = el('canvas', stage, { width: W, height: H, style: { position: 'absolute', left: 0, top: 0, zIndex: 80, pointerEvents: 'none' } });
      this.ctx = this.cv.getContext('2d');
      const r = rng(11);
      this.p = Array.from({ length: n }, () => ({ x: r() * W, y: r() * H, v: 12 + r() * 38, a: 8 + r() * 26, f: .2 + r() * .6, ph: r() * 6.28, s: .8 + r() * 2.6, tw: 1 + r() * 3 }));
    },
    frame(t, alpha, color = '243,203,107') {
      const c = this.ctx;
      c.clearRect(0, 0, W, H);
      if (alpha <= .01) return;
      this.p.forEach(p => {
        const y = ((p.y - p.v * t) % (H + 40) + H + 40) % (H + 40) - 20;
        const x = p.x + Math.sin(t * p.f + p.ph) * p.a;
        const a = alpha * (.25 + .75 * Math.pow(.5 + .5 * Math.sin(t * p.tw + p.ph), 2));
        const g = c.createRadialGradient(x, y, 0, x, y, p.s * 3.2);
        g.addColorStop(0, `rgba(${color},${a.toFixed(3)})`);
        g.addColorStop(1, `rgba(${color},0)`);
        c.fillStyle = g;
        c.beginPath(); c.arc(x, y, p.s * 3.2, 0, 6.283); c.fill();
      });
    },
  };

  /* ---------- Scènes ---------- */
  const scenes = [];
  function scene(t0, t1, style = {}) {
    const node = el('div', document.getElementById('stage'), { class: 'scene', style });
    const s = { t0, t1, node, render: null };
    scenes.push(s);
    return s;
  }

  const hooks = [];
  function renderFrame(t) {
    Pen.hide();
    for (const s of scenes) {
      const on = t >= s.t0 && t <= s.t1;
      s.node.style.display = on ? '' : 'none';
      if (on && s.render) s.render(t);
    }
    Ink.frame(t);
    for (const h of hooks) h(t);
  }

  global.GX = { W, H, FPS, C, E, clamp, lerp, prog, tw, inout, rng, el, sv, svgLayer, set, split, stagger, loadFont, fonts, Script, Pen, Ink, Dust, scene, scenes, hooks, renderFrame, SFX, sfx };
})(window);
