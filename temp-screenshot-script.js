const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Get URLs from environment or use defaults
  const gameId = process.env.GAME_ID;
  const adminSecret = process.env.ADMIN_SECRET;
  const votingUrl = `http://localhost:5173/vote/${gameId}`;
  const resultsUrl = `http://localhost:5173/results/${gameId}`;

  console.log('📸 Capturing admin setup page...');
  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/01-admin-setup.png', fullPage: true });

  console.log('📸 Capturing voting interface...');
  await page.goto(votingUrl);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/02-voting-interface.png', fullPage: true });

  console.log('📸 Capturing results page (votes hidden)...');
  await page.goto(resultsUrl);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/03-results-votes-hidden.png', fullPage: true });

  console.log('📸 Capturing dark theme...');
  await page.click('button:has-text("Truth in the Light")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'demo-screenshots/04-dark-theme.png', fullPage: true });

  console.log('📸 Capturing admin controls...');
  await page.click('button:has-text("Show Admin Controls")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'demo-screenshots/05-admin-controls.png', fullPage: true });

  console.log('📸 Capturing answer reveal...');
  await page.fill('input[type="password"]', adminSecret);
  await page.click('button:has-text("Reveal Answer")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/06-answer-revealed.png', fullPage: true });

  console.log('📸 Switching back to light theme for final shot...');
  await page.click('button:has-text("Lies in the Dark")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'demo-screenshots/07-final-results-light.png', fullPage: true });

  await browser.close();
  console.log('✅ All screenshots captured successfully!');
})();
