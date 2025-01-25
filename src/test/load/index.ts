import { chromium } from 'playwright';
import { performanceMonitor } from '@/lib/performance/monitor';

interface LoadTestConfig {
  url: string;
  users: number;
  duration: number;
  thinkTime?: number;
}

export async function runLoadTest(config: LoadTestConfig) {
  const startTime = Date.now();
  const results = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    responseTimes: [] as number[],
  };

  try {
    const browser = await chromium.launch();
    const promises = Array(config.users).fill(0).map(async (_, index) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      while (Date.now() - startTime < config.duration) {
        const pageStartTime = Date.now();
        
        try {
          await page.goto(config.url);
          await page.waitForLoadState('networkidle');
          
          const responseTime = Date.now() - pageStartTime;
          results.responseTimes.push(responseTime);
          results.successfulRequests++;
          
          // Simulate user think time
          if (config.thinkTime) {
            await page.waitForTimeout(config.thinkTime);
          }
        } catch (error) {
          results.failedRequests++;
          console.error(`Virtual user ${index} error:`, error);
        }
        
        results.totalRequests++;
      }
    });

    await Promise.all(promises);
    
    // Calculate metrics
    results.averageResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;

    // Track load test results
    performanceMonitor.trackCustomMetric('load_test', {
      ...results,
      duration: Date.now() - startTime,
      users: config.users,
      timestamp: new Date().toISOString(),
    });

    return results;
  } catch (error) {
    console.error('Load test error:', error);
    throw error;
  }
}