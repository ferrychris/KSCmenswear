import { chromium, firefox, webkit, devices } from 'playwright';
import { performanceMonitor } from '@/lib/performance/monitor';

interface CrossBrowserTestConfig {
  url: string;
  scenarios: string[];
}

export async function runCrossBrowserTests(config: CrossBrowserTestConfig) {
  const browsers = [
    { name: 'chromium', launcher: chromium },
    { name: 'firefox', launcher: firefox },
    { name: 'webkit', launcher: webkit }
  ];

  const mobileDevices = [
    devices['iPhone 13'],
    devices['Pixel 5'],
    devices['iPad Pro 11']
  ];

  const results = {
    desktop: {} as Record<string, any>,
    mobile: {} as Record<string, any>,
  };

  // Test desktop browsers
  for (const browser of browsers) {
    const startTime = Date.now();
    try {
      const instance = await browser.launcher.launch();
      const context = await instance.newContext();
      const page = await context.newPage();

      await page.goto(config.url);
      
      // Run test scenarios
      for (const scenario of config.scenarios) {
        const scenarioStart = Date.now();
        try {
          await runTestScenario(page, scenario);
          results.desktop[`${browser.name}_${scenario}`] = 'passed';
        } catch (error) {
          results.desktop[`${browser.name}_${scenario}`] = 'failed';
          console.error(`${browser.name} ${scenario} failed:`, error);
        }
        
        // Track scenario performance
        performanceMonitor.trackCustomMetric('cross_browser_test', {
          browser: browser.name,
          scenario,
          duration: Date.now() - scenarioStart,
          device: 'desktop',
        });
      }

      await instance.close();
    } catch (error) {
      console.error(`${browser.name} tests failed:`, error);
    }

    // Track browser test duration
    performanceMonitor.trackCustomMetric('cross_browser_suite', {
      browser: browser.name,
      duration: Date.now() - startTime,
      device: 'desktop',
    });
  }

  // Test mobile devices
  for (const device of mobileDevices) {
    const startTime = Date.now();
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext({
        ...device
      });
      const page = await context.newPage();

      await page.goto(config.url);
      
      // Run test scenarios
      for (const scenario of config.scenarios) {
        const scenarioStart = Date.now();
        try {
          await runTestScenario(page, scenario);
          results.mobile[`${device.name}_${scenario}`] = 'passed';
        } catch (error) {
          results.mobile[`${device.name}_${scenario}`] = 'failed';
          console.error(`${device.name} ${scenario} failed:`, error);
        }
        
        // Track scenario performance
        performanceMonitor.trackCustomMetric('cross_browser_test', {
          device: device.name,
          scenario,
          duration: Date.now() - scenarioStart,
          platform: 'mobile',
        });
      }

      await browser.close();
    } catch (error) {
      console.error(`${device.name} tests failed:`, error);
    }

    // Track device test duration
    performanceMonitor.trackCustomMetric('cross_browser_suite', {
      device: device.name,
      duration: Date.now() - startTime,
      platform: 'mobile',
    });
  }

  return results;
}

async function runTestScenario(page: any, scenario: string) {
  switch (scenario) {
    case 'navigation':
      await testNavigation(page);
      break;
    case 'product_interaction':
      await testProductInteraction(page);
      break;
    case 'cart_flow':
      await testCartFlow(page);
      break;
    case 'responsive_layout':
      await testResponsiveLayout(page);
      break;
    default:
      throw new Error(`Unknown test scenario: ${scenario}`);
  }
}

async function testNavigation(page: any) {
  await page.click('[data-testid="nav-collections"]');
  await page.waitForSelector('[data-testid="collections-grid"]');
  
  await page.click('[data-testid="nav-wedding"]');
  await page.waitForSelector('[data-testid="wedding-hero"]');
}

async function testProductInteraction(page: any) {
  await page.click('[data-testid="product-card"]');
  await page.waitForSelector('[data-testid="product-details"]');
  
  await page.selectOption('[data-testid="size-select"]', '42R');
  await page.click('[data-testid="add-to-cart"]');
  
  const cartCount = await page.textContent('[data-testid="cart-count"]');
  if (cartCount !== '1') throw new Error('Product not added to cart');
}

async function testCartFlow(page: any) {
  await page.click('[data-testid="cart-icon"]');
  await page.waitForSelector('[data-testid="cart-drawer"]');
  
  await page.click('[data-testid="checkout-button"]');
  const url = page.url();
  if (!url.includes('checkout.shopify.com')) {
    throw new Error('Checkout redirect failed');
  }
}

async function testResponsiveLayout(page: any) {
  // Test different viewport sizes
  const viewports = [
    { width: 375, height: 667 },  // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1440, height: 900 }, // Desktop
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    
    // Check navigation menu
    const menuVisible = await page.isVisible('[data-testid="desktop-nav"]');
    const mobileMenuVisible = await page.isVisible('[data-testid="mobile-nav"]');
    
    if (viewport.width < 768) {
      if (menuVisible || !mobileMenuVisible) {
        throw new Error('Mobile navigation not displaying correctly');
      }
    } else {
      if (!menuVisible || mobileMenuVisible) {
        throw new Error('Desktop navigation not displaying correctly');
      }
    }
  }
}