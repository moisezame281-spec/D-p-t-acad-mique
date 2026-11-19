/* Aperçu : rend quelques instants clés en PNG + planche contact.
   Usage : node tools/preview.js <projet> <dossier-sortie> t1 t2 t3 ...
   (le serveur local doit tourner : python3 -m http.server 8765 dans motion/) */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [project, out, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  page.on('pageerror', e => console.log('pageerror:', e.message));
  await page.goto(`http://localhost:8765/projects/${project}/index.html`);
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error);
  if (err) { console.error(err); process.exit(1); }
  await page.evaluate(() => document.fonts.ready);
  for (const t of times) {
    await page.evaluate(tt => window.renderFrame(tt), parseFloat(t));
    await page.screenshot({ path: path.join(out, `t${String(t).padStart(5, '0')}.png`) });
  }
  await browser.close();
})();
