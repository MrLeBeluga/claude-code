import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const logs = [];
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (msg) => { if (msg.text().includes('DEBUG yaw')) logs.push(msg.text()); });

await page.goto('http://127.0.0.1:5183/', { waitUntil: 'load' });
await page.waitForTimeout(9000);
await page.mouse.move(640, 360);
await page.mouse.click(640, 360);
await page.waitForTimeout(500);
await page.screenshot({ path: 'test/turndbg-01-spawn.png' });

await page.mouse.move(640 + 900, 360, { steps: 40 });
await page.waitForTimeout(400);
await page.screenshot({ path: 'test/turndbg-02-turned.png' });

console.log('LOGS:\n' + logs.join('\n'));
await browser.close();
