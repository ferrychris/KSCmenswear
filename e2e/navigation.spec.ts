import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start from the home page
    await page.goto('/');
    await expect(page).toHaveTitle(/KCT Menswear/);

    // Navigate to products page
    await page.click('text=Shop');
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h1')).toContainText('All Products');

    // Navigate to a product detail page
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/.*products\/.*/);
    await expect(page.locator('button:text("Add to Cart")')).toBeVisible();
  });

  test('cart functionality', async ({ page }) => {
    await page.goto('/products');
    
    // Add a product to cart
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.click();
    
    await page.selectOption('select[name="size"]', 'Small');
    await page.fill('input[type="number"]', '1');
    await page.click('button:text("Add to Cart")');

    // Verify cart updates
    const cartCount = page.locator('.cart-count');
    await expect(cartCount).toHaveText('1');

    // Open cart and verify product
    await page.click('button[aria-label="View cart"]');
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });
});