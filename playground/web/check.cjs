const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 4000 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const text = await page.locator('body').innerText();
  console.log('=== Page text (first 1500 chars) ===');
  console.log(text.substring(0, 1500));
  console.log('\n=== Key checks ===');
  console.log('流式输入测试:', text.includes('流式输入测试'));
  console.log('WASM 流式渲染结果:', text.includes('WASM 流式渲染结果'));
  console.log('Click Me:', text.includes('Click Me'));
  console.log('Layout Components:', text.includes('Layout Components'));
  console.log('Basic Components:', text.includes('Basic Components'));

  await browser.close();
})();
