# System Documentation

## Table of Contents
- [Analytics & Monitoring](#analytics--monitoring)
- [Testing](#testing)
- [Infrastructure](#infrastructure)
- [Backup & Recovery](#backup--recovery)
- [Security](#security)

## Analytics & Monitoring

### Google Analytics 4
The application uses Google Analytics 4 for tracking user behavior and site performance.

```typescript
// Initialize tracking
googleAnalytics.init(import.meta.env.VITE_GA4_MEASUREMENT_ID);

// Track page views
googleAnalytics.trackPageView('/collections/suits');

// Track e-commerce events
googleAnalytics.trackProductView(product);
googleAnalytics.trackAddToCart(product, quantity);
googleAnalytics.trackPurchase(order);
```

### Error Tracking (Sentry)
Sentry is integrated for real-time error tracking and monitoring.

```typescript
// Initialize Sentry
initializeSentry();

// Capture errors
captureError(error, {
  context: 'checkout',
  userId: '123'
});

// Set user context
setUserContext(userId, email);
```

### Uptime Monitoring
The application includes a built-in uptime monitoring system.

```typescript
// Configure endpoints
uptimeMonitor.addEndpoint('shopify-storefront', {
  url: `https://${SHOPIFY_STORE_DOMAIN}/api/graphql`,
  method: 'POST',
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN
  }
});

// Check endpoint status
const result = await uptimeMonitor.checkEndpoint('shopify-storefront');
```

## Testing

### Load Testing
Load testing is implemented using Playwright for simulating multiple users.

```typescript
// Run load test
const results = await runLoadTest({
  url: 'https://kctmenswear.com',
  users: 100,
  duration: 300000, // 5 minutes
  thinkTime: 2000  // 2 seconds between actions
});
```

### E2E Testing
End-to-end tests are written using Playwright.

```typescript
// Example E2E test
test('complete checkout process', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="product-card"]');
  await page.selectOption('[data-testid="size-select"]', '42R');
  await page.click('[data-testid="add-to-cart"]');
  // ... more steps
});
```

### Cross-Browser Testing
Cross-browser testing is automated across multiple browsers and devices.

```typescript
// Run cross-browser tests
const results = await runCrossBrowserTests({
  url: 'https://kctmenswear.com',
  scenarios: ['navigation', 'product_interaction', 'cart_flow']
});
```

## Backup & Recovery

### Backup System
The backup system is managed by the BackupEngine class.

```typescript
// Schedule backup
backupEngine.scheduleBackup({
  id: 'daily-backup',
  sources: [
    {
      name: 'user-data',
      collect: async () => {
        // Collect user data
        return { /* user data */ };
      }
    }
  ],
  frequency: 24 * 60 * 60 * 1000, // Daily
  retention: 30 // Keep 30 days of backups
});

// Restore from backup
await backupEngine.restore('user-data');
```

### Recovery Procedures
The RecoveryManager handles system recovery operations.

```typescript
// Register recovery plan
recoveryManager.registerPlan('database', {
  name: 'Database Recovery',
  description: 'Recover from database failures',
  steps: [
    {
      name: 'Verify Backup',
      execute: async () => {
        // Verify backup integrity
      }
    },
    {
      name: 'Restore Data',
      execute: async () => {
        // Restore data from backup
      }
    }
  ]
});

// Execute recovery
await recoveryManager.executeRecovery('database');
```

### Health Checks
Regular health checks monitor system components.

```typescript
// Register health checks
backupEngine.registerHealthCheck('api', {
  check: async () => {
    const response = await fetch('/api/health');
    return {
      healthy: response.ok,
      message: response.ok ? 'API is healthy' : 'API health check failed'
    };
  },
  interval: 60000, // 1 minute
  timeout: 5000 // 5 seconds
});
```

## Security

### Headers
Security headers are configured for all responses:

```typescript
const securityHeaders = {
  'Content-Security-Policy': generateCSPHeader(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
```

### CSRF Protection
CSRF protection is implemented using tokens:

```typescript
// Generate token
const token = csrfProtection.generateToken();

// Validate token
const isValid = csrfProtection.validateToken(token);
```

### Rate Limiting
Rate limiting is implemented for API endpoints:

```typescript
const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
});

const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts
});
```

## Infrastructure

### CI/CD Pipeline
The CI/CD pipeline is configured using GitHub Actions:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
        
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: npm run build
        
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
```

### Cloudflare Configuration
The application is deployed to Cloudflare Pages:

```toml
# wrangler.toml
name = "kct-menswear"
type = "webpack"
route = "kctmenswear.com/*"

[site]
bucket = "./dist"
entry-point = "workers-site"

[env.production]
workers_dev = false
route = "kctmenswear.com/*"
```

### Headers & Redirects
Security headers and redirects are configured in `_headers` and `_redirects` files:

```
# _headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# _redirects
/* /index.html 200
/shop/* /collections/:splat 301
```

## Accessing Backups

To access backups in case of issues:

1. **During Deployment**
   ```typescript
   // Rollback to previous version
   await recoveryManager.executeRecovery('deployment', {
     version: 'previous-stable-version'
   });
   ```

2. **Launch Issues**
   ```typescript
   // Restore critical data
   await backupEngine.restore('critical-data');
   ```

3. **System Failures**
   ```typescript
   // Execute system recovery
   await recoveryManager.executeRecovery('system');
   ```

4. **Data Corruption**
   ```typescript
   // Restore from specific backup
   await backupEngine.restore('user-data', '2024-03-01T12:00:00Z');
   ```

### Monitoring Backup Status

```typescript
// Get backup metrics
const backupMetrics = performanceMonitor.getMetrics('backup_operation');
const recoveryMetrics = performanceMonitor.getMetrics('recovery_operation');
const healthMetrics = performanceMonitor.getMetrics('health_check');

// Generate report
const report = performanceMonitor.generateReport();
```

### Recovery Validation

Each recovery operation includes:
1. Pre-recovery checks
2. Step-by-step recovery execution
3. Post-recovery validation
4. Automatic rollback on failure

The system maintains detailed logs of all operations for auditing and troubleshooting.