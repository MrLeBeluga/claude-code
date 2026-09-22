import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (err) => console.log('PAGEERROR', err.message));

await page.goto('http://127.0.0.1:5183/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
await page.mouse.move(640, 360);
await page.mouse.click(640, 360);
await page.waitForTimeout(500);

// turn to look at the left shelving wall up close
await page.mouse.move(300, 360, { steps: 25 });
await page.waitForTimeout(300);
await page.keyboard.down('KeyW');
await page.waitForTimeout(20000); // walk toward the wall, should be stopped by collider
await page.keyboard.up('KeyW');
await page.screenshot({ path: 'test/tour-01-wall-collision.png' });

// turn to look back across the room toward the entrance
await page.mouse.move(1100, 360, { steps: 30 });
await page.waitForTimeout(400);
await page.screenshot({ path: 'test/tour-02-panorama.png' });

// look down at the floor
await page.mouse.move(640, 500, { steps: 20 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'test/tour-03-floor.png' });

await browser.close();
