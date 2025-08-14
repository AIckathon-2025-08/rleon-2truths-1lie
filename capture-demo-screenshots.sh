#!/bin/bash

# Two Truths & A Lie - Screenshot Demo Script
# Captures key screenshots for documentation

set -e

echo "📸 Two Truths & A Lie - Demo Screenshot Capture"
echo "==============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create screenshots directory
mkdir -p demo-screenshots

echo -e "\n${BLUE}🎯 Starting screenshot capture demo...${NC}"

# Check if servers are running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Backend not running. Please start: cd backend && npm start"
    exit 1
fi

if ! curl -s http://localhost:5173 > /dev/null; then
    echo "❌ Frontend not running. Please start: cd frontend && npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Both servers are running${NC}"

# Step 1: Create a demo game via API
echo -e "\n${BLUE}📋 Step 1: Creating demo game...${NC}"

GAME_RESPONSE=$(curl -s -X POST http://localhost:3001/api/games \
  -F "name=Demo Candidate Sarah" \
  -F "statements=[\"I have traveled to 25 countries\", \"I can play piano with my feet\", \"I have never eaten chocolate\"]" \
  -F "correctAnswer=1")

GAME_ID=$(echo "$GAME_RESPONSE" | jq -r '.gameId')
VOTING_URL=$(echo "$GAME_RESPONSE" | jq -r '.votingUrl')
RESULTS_URL=$(echo "$GAME_RESPONSE" | jq -r '.resultsUrl')
ADMIN_SECRET=$(echo "$GAME_RESPONSE" | jq -r '.adminSecret')

echo -e "${GREEN}✅ Game created successfully!${NC}"
echo "   Game ID: $GAME_ID"
echo "   Admin Secret: $ADMIN_SECRET"

# Step 2: Use Playwright to capture screenshots
echo -e "\n${BLUE}📸 Step 2: Capturing screenshots...${NC}"

cat > temp-screenshot-script.js << 'EOF'
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
EOF

# Run the screenshot script with environment variables
GAME_ID="$GAME_ID" ADMIN_SECRET="$ADMIN_SECRET" node temp-screenshot-script.js

# Clean up temp file
rm temp-screenshot-script.js

echo -e "\n${GREEN}🎉 Demo screenshots captured successfully!${NC}"
echo -e "\n${YELLOW}📁 Screenshots saved to demo-screenshots/:${NC}"
echo "   01-admin-setup.png           - Admin game creation interface"
echo "   02-voting-interface.png      - Employee voting page"
echo "   03-results-votes-hidden.png  - Results with hidden votes"
echo "   04-dark-theme.png            - Dark theme demonstration"  
echo "   05-admin-controls.png        - Admin reveal controls"
echo "   06-answer-revealed.png       - Final results with answer"
echo "   07-final-results-light.png   - Light theme final view"

echo -e "\n${BLUE}🚀 Ready to update documentation with these screenshots!${NC}"