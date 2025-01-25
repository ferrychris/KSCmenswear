import { test, expect } from '@playwright/test';
import { performanceMonitor } from '@/lib/performance/monitor';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete checkout process', async ({ page }) => {
    const startTime = Date.now();
    
    try {
      // Add product to cart
      await page.click('[data-testid="product-card"]');
      await page.selectOption('[data-testid="size-select"]', '42R');
      await page.click('[data-testid="add-to-cart"]');
      
      // Go to cart
      await page.click('[data-testid="cart-icon"]');
      await page.click('[data-testid="checkout-button"]');

      // Fill shipping info
      await page.fill('[data-testid="shipping-email"]', 'test@example.com');
      await page.fill('[data-testid="shipping-name"]', 'Test User');
      await page.fill('[data-testid="shipping-address"]', '123 Test St');
      await page.click('[data-testid="continue-to-payment"]');

      // Verify redirect to Shopify checkout
      const url = page.url();
      expect(url).toContain('checkout.shopify.com');

      // Track successful test
      performanceMonitor.trackCustomMetric('e2e_test', {
        test: 'checkout_flow',
        duration: Date.now() - startTime,
        status: 'passed',
      });
    } catch (error) {
      // Track failed test
      performanceMonitor.trackCustomMetric('e2e_test', {
        test: 'checkout_flow',
        duration: Date.now() - startTime,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  });
});