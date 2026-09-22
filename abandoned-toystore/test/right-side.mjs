import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const errors = [];
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (err) => errors.push(err.message));

await page.goto('http://127.0.0.1:5183/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
await page.mouse.move(640, 360);
await page.mouse.click(640, 360);
await page.waitForTimeout(500);

// turn right toward the new cabinet/shelf (spawn faces -Z, turn ~90-120deg right)
await page.mouse.move(1050, 360, { steps: 30 });
await page.waitForTimeout(300);
await page.keyboard.down('KeyW');
await page.waitForTimeout(22000);
await page.keyboard.up('KeyW');
await page.screenshot({ path: 'test/right-01-approach.png' });

// look slightly left/right to frame both new pieces
await page.mouse.move(500, 360, { steps: 25 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'test/right-02-cabinet.png' });

await page.mouse.move(950, 360, { steps: 25 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'test/right-03-shelf.png' });

console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await browser.close();
