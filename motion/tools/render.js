/* Rendu vidéo image par image.
   Usage : node tools/render.js <projet> <sortie-dir> [workers=4] [fps=30] [carte.warp.json]
   - avec une carte temporelle, l'animation ralentit là où la voix off parle plus longtemps
   - lance un serveur HTTP local sur motion/
   - N navigateurs rendent chacun une tranche d'images, envoyée à ffmpeg
   - exporte aussi la liste des événements sonores (sfx.json) */
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const FFMPEG = process.env.FFMPEG || execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim();
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json', '.css': 'text/css' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    }).listen(0, () => res(srv));
  });
}

async function openPage(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('pageerror:', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(err);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

(async () => {
  const [project, outDir, workersArg, fpsArg, warpArg] = process.argv.slice(2);
  const warp = warpArg ? JSON.parse(fs.readFileSync(warpArg, 'utf8')) : null;
  const toAnim = tv => { // temps vidéo -> temps animation
    if (!warp) return tv;
    const A = warp.anchors;
    for (let i = 1; i < A.length; i++) {
      if (tv <= A[i][1]) { const [a0, v0] = A[i - 1], [a1, v1] = A[i]; return a0 + (tv - v0) * (a1 - a0) / Math.max(1e-9, v1 - v0); }
    }
    return Math.min(warp.anim_duration, A[A.length - 1][0] + tv - A[A.length - 1][1]);
  };
  const workers = parseInt(workersArg || '4', 10), fps = parseInt(fpsArg || '30', 10);
  fs.mkdirSync(outDir, { recursive: true });
  const srv = await serve();
  const url = `http://localhost:${srv.address().port}/projects/${project}/index.html`;

  // événements sonores + durée
  const b0 = await chromium.launch();
  const p0 = await openPage(b0, url);
  const { duration, sfx } = await p0.evaluate(() => ({ duration: window.DURATION, sfx: window.SFX }));
  await b0.close();
  fs.writeFileSync(path.join(outDir, 'sfx.json'), JSON.stringify({ duration, fps, sfx }, null, 1));
  const total = Math.round((warp ? warp.duration : duration) * fps);
  console.log(`${total} images, ${workers} workers`);

  const t0 = Date.now();
  let done = 0;
  const per = Math.ceil(total / workers);
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const a = w * per, b = Math.min(total, a + per);
    if (a >= b) return;
    const seg = path.join(outDir, `seg${w}.mp4`);
    const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const browser = await chromium.launch();
    const page = await openPage(browser, url);
    await page.evaluate(() => window.renderFrame(0));
    for (let f = a; f < b; f++) {
      await page.evaluate(t => window.renderFrame(t), Math.min(toAnim(f / fps), duration - 1e-3));
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      done++;
      if (done % 60 === 0) console.log(`  ${done}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    await browser.close();
  }));
  fs.writeFileSync(path.join(outDir, 'segments.txt'), Array.from({ length: workers }, (_, w) => `file 'seg${w}.mp4'`).join('\n'));
  srv.close();
  console.log(`rendu terminé en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
})().catch(e => { console.error(e); process.exit(1); });
