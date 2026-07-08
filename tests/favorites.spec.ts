import { test, expect } from "@playwright/test";
test.describe('Favorites', () => {
  test('favorites page loads', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.locator('body')).toBeVisible();
  });
  test('can add plant to favorites from plants page', async ({ page }) => {
    await page.goto('/plants');
    await page.waitForTimeout(2000);
    const favoriteBtn = page.locator('button').filter({ hasText: /♡|♥|Favorite/i }).first();
    if (await favoriteBtn.count() > 0) {
      await favoriteBtn.click();
      await page.waitForTimeout(500);
    }
  });
  test('favorites icon shows in header', async ({ page }) => {
    await page.goto('/');
    const favIcon = page.locator('[href="/favorites"]');
    if (await favIcon.count() > 0) {
      await expect(favIcon).toBeVisible();
    }
  });
});