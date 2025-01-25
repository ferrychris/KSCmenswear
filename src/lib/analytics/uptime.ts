import { performanceMonitor } from '../performance/monitor';

export class UptimeMonitor {
  private static instance: UptimeMonitor;
  private checkInterval: number;
  private endpoints: Map<string, EndpointConfig>;
  private lastChecks: Map<string, CheckResult>;

  private constructor() {
    this.checkInterval = 60000; // 1 minute
    this.endpoints = new Map();
    this.lastChecks = new Map();
    this.startMonitoring();
  }

  static getInstance(): UptimeMonitor {
    if (!UptimeMonitor.instance) {
      UptimeMonitor.instance = new UptimeMonitor();
    }
    return UptimeMonitor.instance;
  }

  addEndpoint(name: string, config: EndpointConfig): void {
    this.endpoints.set(name, {
      url: config.url,
      method: config.method || 'GET',
      timeout: config.timeout || 5000,
      expectedStatus: config.expectedStatus || 200,
      headers: config.headers || {},
    });
  }

  async checkEndpoint(name: string): Promise<CheckResult> {
    const config = this.endpoints.get(name);
    if (!config) throw new Error(`Endpoint ${name} not found`);

    const startTime = performance.now();
    let status: 'up' | 'down' = 'down';
    let responseTime = 0;
    let error: string | undefined;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      responseTime = performance.now() - startTime;

      status = response.status === config.expectedStatus ? 'up' : 'down';
      if (status === 'down') {
        error = `Unexpected status: ${response.status}`;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    }

    const result: CheckResult = {
      timestamp: new Date().toISOString(),
      status,
      responseTime,
      error,
    };

    this.lastChecks.set(name, result);
    this.trackMetrics(name, result);

    return result;
  }

  async checkAll(): Promise<Map<string, CheckResult>> {
    const results = new Map<string, CheckResult>();
    
    for (const [name] of this.endpoints) {
      results.set(name, await this.checkEndpoint(name));
    }

    return results;
  }

  getLastCheck(name: string): CheckResult | undefined {
    return this.lastChecks.get(name);
  }

  private startMonitoring(): void {
    setInterval(async () => {
      await this.checkAll();
    }, this.checkInterval);
  }

  private trackMetrics(name: string, result: CheckResult): void {
    performanceMonitor.trackCustomMetric('uptime', {
      endpoint: name,
      status: result.status,
      responseTime: result.responseTime,
      error: result.error,
      timestamp: result.timestamp,
    });
  }
}

interface EndpointConfig {
  url: string;
  method?: string;
  timeout?: number;
  expectedStatus?: number;
  headers?: Record<string, string>;
}

interface CheckResult {
  timestamp: string;
  status: 'up' | 'down';
  responseTime: number;
  error?: string;
}

export const uptimeMonitor = UptimeMonitor.getInstance();

// Configure endpoints
uptimeMonitor.addEndpoint('shopify-storefront', {
  url: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  },
});

uptimeMonitor.addEndpoint('main-api', {
  url: import.meta.env.VITE_API_URL || '',
});