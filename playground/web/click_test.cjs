const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 2500 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Click the button inside AGenUISurface
  const button = page.locator('button:has-text("点击与我交互")');
  if (await button.isVisible().catch(() => false)) {
    await button.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/after_click.png', fullPage: true });
    console.log('Screenshot saved: /tmp/after_click.png');
  } else {
    console.log('Button not found');
    await page.screenshot({ path: '/tmp/after_click.png', fullPage: true });
  }

  await browser.close();
})();
