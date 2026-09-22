import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';

const errors = [];
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console.error: ' + msg.text()); });

const filePath = path.resolve('dist/index.html');
await page.goto('file://' + filePath, { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'test/file-01-standalone.png' });

console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await browser.close();
