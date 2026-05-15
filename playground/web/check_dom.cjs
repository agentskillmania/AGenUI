const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 3000 } });
  
  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.click('text=组件展示');
  await page.waitForTimeout(3000);
  
  // Get Carousel HTML
  const carouselHtml = await page.evaluate(() => {
    const carousel = document.querySelector('.ant-carousel');
    return carousel ? carousel.outerHTML.substring(0, 2000) : 'not found';
  });
  console.log('=== Carousel HTML ===');
  console.log(carouselHtml);
  
  await browser.close();
})();
