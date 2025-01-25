import { PerformanceObserver } from 'perf_hooks';
import { performanceMonitor } from '@/lib/performance/monitor';

export function initializePerformanceMonitoring() {
  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      performanceMonitor.trackWebVital({
        name: entry.name as any,
        value: entry.startTime,
        id: entry.id,
      });
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

  // Track custom metrics
  global.beforeEach(() => {
    performance.mark('test-start');
  });

  global.afterEach(() => {
    performance.mark('test-end');
    performance.measure('test-duration', 'test-start', 'test-end');
  });
}