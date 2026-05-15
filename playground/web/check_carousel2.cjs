const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 3000 } });
  
  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.click('text=组件展示');
  await page.waitForTimeout(3000);
  
  // Check if the divs with gradient backgrounds exist
  const divs = await page.locator('.ant-carousel > div > div > div > div > div').all();
  console.log('Number of slide wrapper divs:', divs.length);
  
  for (let i = 0; i < Math.min(divs.length, 5); i++) {
    const style = await divs[i].getAttribute('style');
    console.log(`Slide ${i} style:`, style);
  }
  
  await browser.close();
})();
