import { test, expect } from '@playwright/test';
import { performanceMonitor } from '@/lib/performance/monitor';

test.describe('Shopping Cart', () => {
  test('add and remove items from cart', async ({ page }) => {
    const startTime = Date.now();
    
    try {
      await page.goto('/');

      // Add item to cart
      await page.click('[data-testid="product-card"]');
      await page.selectOption('[data-testid="size-select"]', '42R');
      await page.click('[data-testid="add-to-cart"]');

      // Verify cart count
      const cartCount = await page.textContent('[data-testid="cart-count"]');
      expect(cartCount).toBe('1');

      // Open cart and remove item
      await page.click('[data-testid="cart-icon"]');
      await page.click('[data-testid="remove-item"]');

      // Verify empty cart
      const emptyCartText = await page.textContent('[data-testid="empty-cart"]');
      expect(emptyCartText).toContain('Your cart is empty');

      // Track successful test
      performanceMonitor.trackCustomMetric('e2e_test', {
        test: 'cart_operations',
        duration: Date.now() - startTime,
        status: 'passed',
      });
    } catch (error) {
      // Track failed test
      performanceMonitor.trackCustomMetric('e2e_test', {
        test: 'cart_operations',
        duration: Date.now() - startTime,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  });
});