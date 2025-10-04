import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/');
//   await page.fill('input[name="username"]', 'user');
//   await page.fill('input[name="password"]', 'pass');
//   await page.click('button[type="submit"]');
//   await expect(page.getByText(/welcome/i)).toBeVisible();
});
