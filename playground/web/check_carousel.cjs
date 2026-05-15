const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 3000 } });
  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Click components tab
  await page.click('text=组件展示');
  await page.waitForTimeout(3000);
  
  const text = await page.locator('body').innerText();
  console.log('\n=== Page text (first 2000 chars) ===');
  console.log(text.substring(0, 2000));
  
  await browser.close();
})();
