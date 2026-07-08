import { test, expect } from '@playwright/test';
test('cart page displays correctly', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.locator('body')).toBeVisible();
});
test('can add item to cart', async ({ page }) => {
  await page.goto('/plants');
  await page.waitForTimeout(2000);
  const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
  if (await addToCartBtn.count() > 0) {
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
  }
});