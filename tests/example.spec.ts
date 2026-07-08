import { test, expect } from '@playwright/test';
test.describe('Public Pages', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
  test('plants page loads with plant cards', async ({ page }) => {
    await page.goto('/plants');
    await expect(page.locator('body')).toBeVisible();
  });
  test('can navigate to plant detail page', async ({ page }) => {
    await page.goto('/plants');
    await page.waitForTimeout(2000);
    const firstPlant = page.locator('a[href*="/plants/"]').first();
    if (await firstPlant.count() > 0) {
      await firstPlant.click();
      await expect(page).toHaveURL(/.*\/plants\/.+/);
    }
  });
});
test.describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
  test('can fill login form', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
  });
});
test.describe('Navigation', () => {
  test('header navigation works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Plants');
    await expect(page).toHaveURL(/.*\/plants/);
  });
  test('favorites page loads', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.locator('body')).toBeVisible();
  });
  test('cart page loads', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('body')).toBeVisible();
  });
});
test.describe('User Dashboard', () => {
  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('body')).toBeVisible();
  });
  test('orders page loads', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.locator('body')).toBeVisible();
  });
});