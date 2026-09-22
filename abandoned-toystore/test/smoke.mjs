import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const errors = [];
const consoleMsgs = [];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

page.on('console', (msg) => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => errors.push(err.message));

await page.goto('http://127.0.0.1:5183/', { waitUntil: 'load' });
await page.waitForTimeout(1500);

await page.screenshot({ path: 'test/shot-01-menu.png' });

await page.mouse.move(640, 360); // establish baseline cursor position first
await page.mouse.click(640, 360);
await page.waitForTimeout(600);

await page.screenshot({ path: 'test/shot-02-locked.png' });

// Headless software rendering here runs at only a couple of fps, so the
// simulated clock (delta-time based) lags far behind wall-clock time.
// Scale real-world waits up accordingly for movement to register.
await page.keyboard.down('KeyW');
await page.waitForTimeout(30000);
await page.keyboard.up('KeyW');
await page.screenshot({ path: 'test/shot-03-toys.png' });

await page.keyboard.press('KeyE');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'test/shot-04-pickup-attempt.png' });

console.log('CONSOLE MESSAGES:\n' + consoleMsgs.slice(0, 40).join('\n'));
console.log('\nPAGE ERRORS:\n' + (errors.length ? errors.join('\n') : 'none'));

await browser.close();
