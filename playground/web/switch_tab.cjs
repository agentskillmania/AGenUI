const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 4000 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  await page.click('text=组件展示');
  await page.waitForTimeout(3000);
  
  await page.pdf({ path: '/tmp/components.pdf', fullPage: true });
  await browser.close();
})();
