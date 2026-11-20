/* Couverture d'un épisode : appelle window.renderCover() de la page puis enregistre un PNG 1080×1920.
   Usage : node tools/cover.js <projet> <sortie.png>  (serveur local sur le port 8765 dans motion/) */
const { chromium } = require('playwright');
(async () => {
  const [project, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('pageerror:', e.message));
  await p.goto(`http://localhost:8765/projects/${project}/index.html`);
  await p.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await p.evaluate(() => window.__error); if (err) { console.error(err); process.exit(1); }
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.renderCover());
  await p.waitForTimeout(200);
  await p.screenshot({ path: out });
  await b.close();
})();
