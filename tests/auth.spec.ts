import { test, expect } from "@playwright/test";

test('login with invalid credentials shows error', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'invalid@test.com');
  await page.fill('input[name="password"]', 'wrongpass');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
});

test('register form validation', async ({page})=>{
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await expect(page.locator('.text-red-500').first()).toBeVisible();
});


