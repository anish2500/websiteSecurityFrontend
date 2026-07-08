import { test, expect } from "@playwright/test";
test.describe('User Profile', () => {
  test('profile page loads', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('body')).toBeVisible();
  });
  test('user profile page loads', async ({ page }) => {
    await page.goto('/user/profile');
    await expect(page.locator('body')).toBeVisible();
  });
  test('admin profile page loads', async ({ page }) => {
    await page.goto('/admin/adminProfile');
    await expect(page.locator('body')).toBeVisible();
  });
});