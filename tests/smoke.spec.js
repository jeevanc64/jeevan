// tests/smoke.spec.js
// Playwright smoke tests for Chase+ Arena
// Run: npx playwright test tests/smoke.spec.js

const { test, expect } = require('@playwright/test');
const path = require('path');

// Use local file for CI (no server needed for static HTML)
const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('Chase+ Arena — Smoke Tests', () => {

  test('Page loads and title is correct', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page).toHaveTitle(/CHASE/i);
  });

  test('Landing page is visible on load', async ({ page }) => {
    await page.goto(FILE_URL);
    const landing = page.locator('#landingPage');
    await expect(landing).toBeVisible();
  });

  test('Game area is hidden on load', async ({ page }) => {
    await page.goto(FILE_URL);
    const gameArea = page.locator('#gameArea');
    await expect(gameArea).toBeHidden();
  });

  test('Level buttons are present', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('#levelEasy')).toBeVisible();
    await expect(page.locator('#levelMedium')).toBeVisible();
    await expect(page.locator('#levelHard')).toBeVisible();
  });

  test('Selecting MEDIUM level updates button style', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#levelMedium');
    const mediumBtn = page.locator('#levelMedium');
    await expect(mediumBtn).toHaveClass(/selected/);
    // EASY should no longer be selected
    await expect(page.locator('#levelEasy')).not.toHaveClass(/selected/);
  });

  test('Start button triggers name modal', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#startBtn');
    const nameModal = page.locator('#nameModal');
    await expect(nameModal).toBeVisible();
  });

  test('Name modal requires a non-empty name', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#startBtn');
    // Click GO without typing a name — modal should stay open
    await page.click('#nameGoBtn');
    await expect(page.locator('#nameModal')).toBeVisible();
  });

  test('Entering name and starting shows game area', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#startBtn');
    await page.fill('#playerNameInput', 'TestPlayer');
    await page.click('#nameGoBtn');
    // Game area should appear
    await expect(page.locator('#gameArea')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#landingPage')).toBeHidden();
  });

  test('HUD shows score and speed when game starts', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#startBtn');
    await page.fill('#playerNameInput', 'TestPlayer');
    await page.click('#nameGoBtn');
    await expect(page.locator('#ui')).toBeVisible();
    await expect(page.locator('#score')).toHaveText('0');
  });

  test('Leaderboard modal opens and closes', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#lbOpenBtn');
    await expect(page.locator('#leaderboardModal')).toBeVisible();
    await page.click('#lbCloseBtn');
    await expect(page.locator('#leaderboardModal')).toBeHidden();
  });

  test('Leaderboard tabs switch correctly', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('#lbOpenBtn');
    await page.click('[data-level="HARD"]');
    const hardTab = page.locator('[data-level="HARD"]');
    await expect(hardTab).toHaveClass(/active/);
  });

});
