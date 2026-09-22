import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (err) => console.log('PAGEERROR', err.message));

await page.goto('http://127.0.0.1:5183/', { waitUntil: 'load' });
await page.waitForTimeout(9000);
await page.mouse.move(640, 360);
await page.mouse.click(640, 360);
await page.waitForTimeout(500);

// turn to face the mirror precisely (spawn (0,0,6) -> mirror at (-3,*,7.86))
await page.mouse.move(640 - 966, 360, { steps: 45 });
await page.waitForTimeout(400);
await page.screenshot({ path: 'test/mc-01-facing-mirror.png' });

await page.keyboard.down('KeyW');
await page.waitForTimeout(14000);
await page.keyboard.up('KeyW');
await page.screenshot({ path: 'test/mc-02-at-mirror.png' });

await browser.close();
