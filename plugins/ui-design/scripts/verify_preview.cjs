/* Verify the bundled example in an existing browser; never install dependencies. */
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = path.resolve(__dirname, '..');
const preview = path.join(root, 'skills/ui-design-preview/assets/device-preview');

(async () => {
  const listener = net.createServer();
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  const server = spawn(process.env.PYTHON_EXECUTABLE || 'python', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', preview], { stdio: 'ignore' });
  let launchError;
  server.on('error', error => { launchError = error; });
  const base = `http://127.0.0.1:${port}`;
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (launchError || server.exitCode !== null) break;
      try { ready = (await fetch(base)).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert(ready, 'Preview server did not start; use PYTHON_EXECUTABLE for an actual Python executable, not a shell alias.');
    browser = await chromium.launch(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : { channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/review.html`);
    const phone = page.frameLocator('#phone'), pad = page.frameLocator('#pad');
    const globalPage = page.getByLabel('统一页面', { exact: true });
    await globalPage.selectOption('skills-import');
    await phone.getByRole('dialog', { name: '导入技能' }).waitFor();
    await pad.getByRole('dialog', { name: '导入技能' }).waitFor();
    await page.getByLabel('Phone 页面', { exact: true }).selectOption('model-detail');
    await phone.locator('.mw-detail').waitFor();
    await pad.locator('.mw-detail').waitFor();
    assert.equal(await page.getByLabel('Pad 页面', { exact: true }).inputValue(), 'model-detail');
    await page.getByLabel('同步两端', { exact: true }).uncheck();
    await page.getByLabel('Phone 页面', { exact: true }).selectOption('skills-import');
    await phone.getByRole('dialog', { name: '导入技能' }).waitFor();
    assert.equal(await page.getByLabel('Pad 页面', { exact: true }).inputValue(), 'model-detail');
    await page.getByLabel('同步两端', { exact: true }).check();
    await globalPage.selectOption('plugins-import');
    await pad.getByRole('tab', { name: '压缩文件', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#phone').contentDocument.querySelector('[role=tab][aria-selected=true]')?.textContent.includes('压缩文件'));
    await phone.getByRole('tab', { name: '链接地址', exact: true }).click();
    await phone.getByLabel('来源链接', { exact: true }).fill('https://example.com/private-draft.zip');
    assert.equal(await pad.getByLabel('来源链接', { exact: true }).inputValue(), '');
    const frameSizes = await page.evaluate(() => ['phone', 'pad'].map(id => {
      const win = document.getElementById(id).contentWindow;
      return [win.innerWidth, win.innerHeight];
    }));
    assert.deepEqual(frameSizes, [[390, 884], [768, 1024]]);
    const output = path.resolve(process.env.PREVIEW_EVIDENCE_DIR || path.join(root, 'dist/preview-evidence'));
    fs.mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, 'review.png'), fullPage: true });
    for (const [name, width, height] of [['Mobile', 390, 884], ['Tablet', 768, 1024], ['Desktop', 1280, 1024]]) {
      const candidate = await browser.newPage({ viewport: { width, height } });
      await candidate.goto(`${base}/index.html`);
      await candidate.waitForLoadState('networkidle');
      assert.deepEqual(await candidate.evaluate(() => [innerWidth, innerHeight]), [width, height]);
      assert(await candidate.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} overflow`);
      await candidate.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
      await candidate.close();
    }
    assert.deepEqual(errors, []);
    const receipt = { result: 'PASS', scope: 'Bundled preview example only', checks: ['page synchronization', 'independent mode', 'semantic tab synchronization', 'no private input replay', 'actual frame sizes', 'three logical browser viewports', 'no page errors or failed review resources'], output };
    fs.writeFileSync(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(JSON.stringify(receipt, null, 2));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
