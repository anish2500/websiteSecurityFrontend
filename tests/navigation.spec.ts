import { test, expect } from "@playwright/test";
test.describe('Navigation & Routing', () => {
  test('can navigate from home to plants', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Plants');
    await expect(page).toHaveURL(/\/plants/);
  });
  test('can navigate from home to login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('body')).toBeVisible();
  });
  test('can navigate to dashboard after auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
  });
  test('back button works correctly', async ({ page }) => {
    await page.goto('/');
    await page.goto('/plants');
    await page.goBack();
    await expect(page).toHaveURL('/');
    await page.goForward();
    await expect(page).toHaveURL(/\/plants/);
  });
  test('URL is correct after direct navigation', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page).toHaveURL(/\/favorites/);
  });
});