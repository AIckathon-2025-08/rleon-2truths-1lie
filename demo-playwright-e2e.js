/**
 * Two Truths & A Lie - Complete E2E Playwright Demo
 * Demonstrates the full workflow with real browser automation
 * Usage: node demo-playwright-e2e.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runE2EDemo() {
  console.log('🎯 Two Truths & A Lie - Complete E2E Browser Demo');
  console.log('='.repeat(50));

  // Ensure screenshot directory exists
  const screenshotDir = path.join(__dirname, 'demo-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Create game via API first
    console.log('\n📋 Step 1: Creating game via API...');
    
    const response = await fetch('http://localhost:3001/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: 'Demo Candidate Sarah',
        statements: JSON.stringify([
          'I have traveled to 25 countries',
          'I can play piano with my feet', 
          'I have never eaten chocolate'
        ]),
        correctAnswer: '1' // Piano with feet is the lie
      })
    });
    
    const gameData = await response.json();
    console.log('✅ Game created:', gameData.gameId);
    console.log('🔑 Admin secret:', gameData.adminSecret);

    // Step 2: Demo admin setup page
    console.log('\n📱 Step 2: Demonstrating Admin Setup Page...');
    await page.goto('http://localhost:5173/admin');
    await page.screenshot({ path: 'demo-screenshots/01-admin-setup.png' });
    console.log('📸 Screenshot: Admin setup page');

    // Step 3: Show voting interface
    console.log('\n🗳️  Step 3: Demonstrating Voting Interface...');
    await page.goto(gameData.votingUrl);
    await page.screenshot({ path: 'demo-screenshots/02-voting-interface.png' });
    console.log('📸 Screenshot: Voting interface');

    // Simulate entering player name
    await page.fill('input[placeholder*="name"]', 'Demo Employee');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Show voting options
    await page.screenshot({ path: 'demo-screenshots/03-voting-options.png' });
    console.log('📸 Screenshot: Voting options displayed');

    // Cast a vote
    await page.click('.statement-card:first-child');
    await page.click('button:has-text("Cast Vote")');
    await page.waitForTimeout(1000);

    // Show vote confirmation
    await page.screenshot({ path: 'demo-screenshots/04-vote-cast.png' });
    console.log('📸 Screenshot: Vote cast confirmation');

    // Step 4: Check results page (votes hidden)
    console.log('\n📊 Step 4: Demonstrating Results Page (Votes Hidden)...');
    await page.goto(gameData.resultsUrl);
    await page.screenshot({ path: 'demo-screenshots/05-results-hidden.png' });
    console.log('📸 Screenshot: Results with hidden votes');

    // Step 5: Demo dark theme
    console.log('\n🌙 Step 5: Demonstrating Dark Theme...');
    await page.click('button:has-text("Truth in the Light")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'demo-screenshots/06-dark-theme.png' });
    console.log('📸 Screenshot: Dark theme activated');

    // Step 6: Admin reveal
    console.log('\n🔓 Step 6: Admin Answer Reveal...');
    await page.click('button:has-text("Show Admin Controls")');
    await page.fill('input[type="password"]', gameData.adminSecret);
    await page.click('button:has-text("Reveal Answer")');
    await page.waitForTimeout(1000);

    // Show final results
    await page.screenshot({ path: 'demo-screenshots/07-answer-revealed.png' });
    console.log('📸 Screenshot: Answer revealed with results');

    // Step 7: Show celebration effects (if any)
    console.log('\n🎉 Step 7: Celebration Effects Demo...');
    await page.waitForTimeout(2000); // Wait for any animations
    await page.screenshot({ path: 'demo-screenshots/08-celebrations.png' });
    console.log('📸 Screenshot: Final results with celebrations');

    // Step 8: Switch back to light theme
    console.log('\n☀️  Step 8: Light Theme Demo...');
    await page.click('button:has-text("Lies in the Dark")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'demo-screenshots/09-light-theme-final.png' });
    console.log('📸 Screenshot: Back to light theme');

    console.log('\n🏆 E2E Demo Complete!');
    console.log('='.repeat(30));
    console.log('\n✅ Features Demonstrated:');
    console.log('  • Admin game creation workflow');
    console.log('  • Employee voting interface');
    console.log('  • Vote hiding for bias prevention');
    console.log('  • Real-time results tracking');
    console.log('  • Secure admin reveal system');
    console.log('  • Dark/light theme switching');
    console.log('  • Professional TestIO branding');
    console.log('  • Celebration effects');
    
    console.log('\n📸 Screenshots saved to demo-screenshots/');
    console.log('   01-admin-setup.png');
    console.log('   02-voting-interface.png');
    console.log('   03-voting-options.png');
    console.log('   04-vote-cast.png');
    console.log('   05-results-hidden.png');
    console.log('   06-dark-theme.png');
    console.log('   07-answer-revealed.png');
    console.log('   08-celebrations.png');
    console.log('   09-light-theme-final.png');

  } catch (error) {
    console.error('❌ Demo error:', error);
  } finally {
    console.log('\n🔄 Keeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close when done');
    // Keep browser open for manual inspection
    // await browser.close();
  }
}

// Error handling for the demo
runE2EDemo().catch(error => {
  console.error('Failed to run E2E demo:', error);
  process.exit(1);
});

module.exports = { runE2EDemo };