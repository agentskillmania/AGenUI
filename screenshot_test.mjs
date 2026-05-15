import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  page.on('pageerror', (err) => {
    console.log('PAGE ERROR:', err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(3000);
  
  const showcaseTab = await page.locator('.ant-tabs-nav-list > div', { hasText: '组件展示' });
  if (await showcaseTab.count() > 0) await showcaseTab.click();
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/tmp/datepicker_before.png' });
  
  const datePicker = await page.locator('.ant-picker').first();
  console.log('DatePicker found:', await datePicker.count());
  if (await datePicker.count() > 0) {
    await datePicker.click();
    await page.waitForTimeout(2000);
    console.log('Popup found:', await page.locator('.ant-picker-dropdown').count());
    await page.screenshot({ path: '/tmp/datepicker_after.png' });
  }
  
  await browser.close();
})();
