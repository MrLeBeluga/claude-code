import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const errors = [];
const consoleMsgs = [];
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));
page.on('console', (msg) => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));

await page.goto('http://127.0.0.1:5183/', { waitUntil: 'load' });
await page.waitForTimeout(9000); // let character/env/mirror finish async loading before locking
await page.mouse.move(640, 360);
await page.mouse.click(640, 360);
await page.waitForTimeout(500);

// spawn view: should show the character from behind in third person
await page.screenshot({ path: 'test/tp-01-spawn.png' });

// turn ~180deg to face the mirror behind spawn
await page.mouse.move(640 + 900, 360, { steps: 40 });
await page.waitForTimeout(400);
await page.screenshot({ path: 'test/tp-02-turned.png' });

// walk toward the mirror to see the reflection up close
await page.keyboard.down('KeyW');
await page.waitForTimeout(25000);
await page.keyboard.up('KeyW');
await page.screenshot({ path: 'test/tp-03-mirror.png' });

console.log('CONSOLE ERRORS:', consoleMsgs.length ? consoleMsgs.join('\n') : 'none');
console.log('PAGE ERRORS:', errors.length ? errors.join('\n') : 'none');
await browser.close();
