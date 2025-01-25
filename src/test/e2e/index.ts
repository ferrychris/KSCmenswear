import { test, expect } from '@playwright/test';
import { performanceMonitor } from '@/lib/performance/monitor';

export function createE2ETest(
  name: string,
  callback: (page: any) => Promise<void>
) {
  test(name, async ({ page }) => {
    const startTime = performance.now();

    try {
      await callback(page);

      // Track test metrics
      performanceMonitor.trackCustomMetric('e2e_test', {
        name,
        duration: performance.now() - startTime,
        status: 'passed',
      });
    } catch (error) {
      // Track test failure
      performanceMonitor.trackCustomMetric('e2e_test', {
        name,
        duration: performance.now() - startTime,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  });
}