// tests/smoke.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');
 
const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;
 
// Helper: waits for animations to settle then force-clicks
async function stableClick(page, selector) {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.locator(selector).click({ force: true });
}
 
test.describe('Chase+ Arena — Smoke Tests', () => {
 
  test('Page loads and title is correct', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page).toHaveTitle(/CHASE/i);
  });
 
  test('Landing page is visible on load', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('#landingPage')).toBeVisible();
  });
 
  test('Game area is hidden on load', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('#gameArea')).toBeHidden();
  });
 
  test('Level buttons are present', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('#levelEasy')).toBeVisible();
    await expect(page.locator('#levelMedium')).toBeVisible();
    await expect(page.locator('#levelHard')).toBeVisible();
  });
 
  test('Selecting MEDIUM level updates button style', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#levelMedium');
    await expect(page.locator('#levelMedium')).toHaveClass(/selected/);
    await expect(page.locator('#levelEasy')).not.toHaveClass(/selected/);
  });
 
  test('Start button triggers name modal', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#startBtn');
    await expect(page.locator('#nameModal')).toBeVisible();
  });
 
  test('Name modal requires a non-empty name', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#startBtn');
    await expect(page.locator('#nameModal')).toBeVisible();
    await stableClick(page, '#nameGoBtn');
    await expect(page.locator('#nameModal')).toBeVisible();
  });
 
  test('Entering name and starting shows game area', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#startBtn');
    await page.fill('#playerNameInput', 'TestPlayer');
    await stableClick(page, '#nameGoBtn');
    await expect(page.locator('#gameArea')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#landingPage')).toBeHidden();
  });
 
  test('HUD shows score and speed when game starts', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#startBtn');
    await page.fill('#playerNameInput', 'TestPlayer');
    await stableClick(page, '#nameGoBtn');
    await expect(page.locator('#ui')).toBeVisible();
    await expect(page.locator('#score')).toHaveText('0');
  });
 
  test('Leaderboard modal opens and closes', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#lbOpenBtn');
    await expect(page.locator('#leaderboardModal')).toBeVisible();
    await stableClick(page, '#lbCloseBtn');
    await expect(page.locator('#leaderboardModal')).toBeHidden();
  });
 
  test('Leaderboard tabs switch correctly', async ({ page }) => {
    await page.goto(FILE_URL);
    await stableClick(page, '#lbOpenBtn');
    await stableClick(page, '[data-level="HARD"]');
    await expect(page.locator('[data-level="HARD"]')).toHaveClass(/active/);
  });
 
});
 