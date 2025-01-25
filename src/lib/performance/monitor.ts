import { z } from 'zod';
import { MemoryCache } from './cache';
import type {
  PerformanceMetrics,
  WebVitalsMetric,
  ResourceMetric,
  APIMetric,
  ErrorMetric,
  CustomMetric,
  PerformanceReport,
} from './types';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics>;
  private cache: MemoryCache<any>;
  private observers: Set<(metrics: PerformanceMetrics) => void>;
  private reportingInterval: NodeJS.Timer;

  private constructor() {
    this.metrics = new Map();
    this.cache = new MemoryCache(50 * 1024 * 1024); // 50MB cache
    this.observers = new Set();
    this.initializeMonitoring();
    this.startReporting();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Core Web Vitals Tracking
  trackWebVitals(metric: WebVitalsMetric): void {
    const { name, value, id } = metric;
    
    this.updateMetrics('webVitals', {
      [name]: {
        value,
        timestamp: Date.now(),
        samples: (this.getMetric('webVitals')?.[name]?.samples || 0) + 1,
      },
    });

    // Report to analytics if threshold exceeded
    if (this.isVitalExceedingThreshold(name, value)) {
      this.reportPoorPerformance(name, value, id);
    }
  }

  // Resource Usage Tracking
  trackResourceUsage(resource: ResourceMetric): void {
    const { type, url, duration, size } = resource;
    
    this.updateMetrics('resources', {
      [type]: {
        count: (this.getMetric('resources')?.[type]?.count || 0) + 1,
        totalDuration: (this.getMetric('resources')?.[type]?.totalDuration || 0) + duration,
        totalSize: (this.getMetric('resources')?.[type]?.totalSize || 0) + size,
        items: [
          ...(this.getMetric('resources')?.[type]?.items || []),
          { url, duration, size, timestamp: Date.now() },
        ].slice(-100), // Keep last 100 items
      },
    });
  }

  // API Performance Monitoring
  trackAPICall(metric: APIMetric): void {
    const { endpoint, method, duration, status, error } = metric;
    const key = `${method}:${endpoint}`;

    this.updateMetrics('api', {
      [key]: {
        count: (this.getMetric('api')?.[key]?.count || 0) + 1,
        totalDuration: (this.getMetric('api')?.[key]?.totalDuration || 0) + duration,
        errors: error ? (this.getMetric('api')?.[key]?.errors || 0) + 1 : 0,
        lastStatus: status,
        lastCall: Date.now(),
      },
    });
  }

  // Error Rate Tracking
  trackError(type: string, error: ErrorMetric): void {
    this.updateMetrics('errors', {
      [type]: {
        count: (this.getMetric('errors')?.[type]?.count || 0) + 1,
        lastOccurrence: Date.now(),
        samples: [
          ...(this.getMetric('errors')?.[type]?.samples || []),
          { message: error.message, stack: error.stack, timestamp: Date.now() },
        ].slice(-50), // Keep last 50 errors
      },
    });
  }

  // Custom Performance Metrics
  trackCustomMetric(name: string, value: CustomMetric): void {
    this.updateMetrics('custom', {
      [name]: {
        value,
        timestamp: Date.now(),
        history: [
          ...(this.getMetric('custom')?.[name]?.history || []),
          { value, timestamp: Date.now() },
        ].slice(-100), // Keep last 100 samples
      },
    });
  }

  // Real User Monitoring
  trackUserTiming(label: string, duration: number): void {
    this.updateMetrics('userTiming', {
      [label]: {
        count: (this.getMetric('userTiming')?.[label]?.count || 0) + 1,
        totalDuration: (this.getMetric('userTiming')?.[label]?.totalDuration || 0) + duration,
        average: undefined, // Will be calculated in getMetrics
        samples: [
          ...(this.getMetric('userTiming')?.[label]?.samples || []),
          { duration, timestamp: Date.now() },
        ].slice(-100),
      },
    });
  }

  // Metrics Retrieval
  getMetrics(category?: string): PerformanceMetrics {
    if (category) {
      return this.getMetric(category) || {};
    }

    const allMetrics: PerformanceMetrics = {};
    this.metrics.forEach((value, key) => {
      allMetrics[key] = this.processMetrics(key, value);
    });

    return allMetrics;
  }

  // Performance Report Generation
  generateReport(): PerformanceReport {
    const metrics = this.getMetrics();
    const timestamp = new Date().toISOString();

    return {
      timestamp,
      webVitals: this.summarizeWebVitals(metrics.webVitals),
      resources: this.summarizeResources(metrics.resources),
      api: this.summarizeAPI(metrics.api),
      errors: this.summarizeErrors(metrics.errors),
      custom: metrics.custom,
      recommendations: this.generateRecommendations(metrics),
    };
  }

  // Monitoring Subscription
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  // Private helper methods
  private initializeMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // @ts-ignore
      window.webVitals.onCLS(metric => this.trackWebVitals({ name: 'CLS', ...metric }));
      // @ts-ignore
      window.webVitals.onFID(metric => this.trackWebVitals({ name: 'FID', ...metric }));
      // @ts-ignore
      window.webVitals.onLCP(metric => this.trackWebVitals({ name: 'LCP', ...metric }));
    }

    // Monitor Resource Loading
    this.observeResources();

    // Monitor Long Tasks
    this.observeLongTasks();

    // Monitor Network Requests
    this.observeNetworkRequests();
  }

  private observeResources(): void {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          this.trackResourceUsage({
            type: resource.initiatorType,
            url: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private observeLongTasks(): void {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.trackCustomMetric('longTasks', {
          duration: entry.duration,
          timestamp: entry.startTime,
        });
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  }

  private observeNetworkRequests(): void {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        this.trackAPICall({
          endpoint: args[0].toString(),
          method: args[1]?.method || 'GET',
          duration: performance.now() - startTime,
          status: response.status,
        });
        return response;
      } catch (error) {
        this.trackAPICall({
          endpoint: args[0].toString(),
          method: args[1]?.method || 'GET',
          duration: performance.now() - startTime,
          error: true,
          status: 0,
        });
        throw error;
      }
    };
  }

  private updateMetrics(category: string, data: any): void {
    const currentMetrics = this.metrics.get(category) || {};
    this.metrics.set(category, {
      ...currentMetrics,
      ...data,
    });

    // Notify observers
    this.notifyObservers();
  }

  private getMetric(category: string): any {
    return this.metrics.get(category);
  }

  private processMetrics(category: string, metrics: any): any {
    switch (category) {
      case 'userTiming':
        return this.processUserTimingMetrics(metrics);
      case 'resources':
        return this.processResourceMetrics(metrics);
      case 'api':
        return this.processAPIMetrics(metrics);
      default:
        return metrics;
    }
  }

  private processUserTimingMetrics(metrics: any): any {
    const processed = { ...metrics };
    Object.keys(processed).forEach(key => {
      const { count, totalDuration } = processed[key];
      processed[key].average = totalDuration / count;
    });
    return processed;
  }

  private processResourceMetrics(metrics: any): any {
    const processed = { ...metrics };
    Object.keys(processed).forEach(key => {
      const { count, totalDuration, totalSize } = processed[key];
      processed[key].averageDuration = totalDuration / count;
      processed[key].averageSize = totalSize / count;
    });
    return processed;
  }

  private processAPIMetrics(metrics: any): any {
    const processed = { ...metrics };
    Object.keys(processed).forEach(key => {
      const { count, totalDuration, errors } = processed[key];
      processed[key].averageDuration = totalDuration / count;
      processed[key].errorRate = errors / count;
    });
    return processed;
  }

  private isVitalExceedingThreshold(name: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      CLS: 0.1,
      FID: 100,
      LCP: 2500,
    };
    return value > (thresholds[name] || 0);
  }

  private reportPoorPerformance(metric: string, value: number, id: string): void {
    // Implement reporting logic (e.g., send to analytics service)
    console.warn(`Poor performance detected: ${metric} = ${value} (ID: ${id})`);
  }

  private startReporting(): void {
    this.reportingInterval = setInterval(() => {
      const report = this.generateReport();
      // Implement reporting logic (e.g., send to analytics service)
      console.log('Performance Report:', report);
    }, 60000); // Generate report every minute
  }

  private notifyObservers(): void {
    const metrics = this.getMetrics();
    this.observers.forEach(observer => observer(metrics));
  }

  private summarizeWebVitals(webVitals: any): any {
    if (!webVitals) return {};

    return Object.entries(webVitals).reduce((acc, [name, data]: [string, any]) => {
      acc[name] = {
        value: data.value,
        status: this.getVitalStatus(name, data.value),
      };
      return acc;
    }, {});
  }

  private summarizeResources(resources: any): any {
    if (!resources) return {};

    return Object.entries(resources).reduce((acc, [type, data]: [string, any]) => {
      acc[type] = {
        count: data.count,
        averageSize: data.totalSize / data.count,
        averageDuration: data.totalDuration / data.count,
      };
      return acc;
    }, {});
  }

  private summarizeAPI(api: any): any {
    if (!api) return {};

    return Object.entries(api).reduce((acc, [endpoint, data]: [string, any]) => {
      acc[endpoint] = {
        count: data.count,
        averageDuration: data.totalDuration / data.count,
        errorRate: data.errors / data.count,
      };
      return acc;
    }, {});
  }

  private summarizeErrors(errors: any): any {
    if (!errors) return {};

    return Object.entries(errors).reduce((acc, [type, data]: [string, any]) => {
      acc[type] = {
        count: data.count,
        lastOccurrence: data.lastOccurrence,
      };
      return acc;
    }, {});
  }

  private getVitalStatus(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      LCP: { good: 2500, poor: 4000 },
    };

    const metric = thresholds[name as keyof typeof thresholds];
    if (!metric) return 'good';

    if (value <= metric.good) return 'good';
    if (value <= metric.poor) return 'needs-improvement';
    return 'poor';
  }

  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    // Web Vitals Recommendations
    if (metrics.webVitals) {
      if (this.getVitalStatus('LCP', metrics.webVitals.LCP?.value) !== 'good') {
        recommendations.push('Consider optimizing Largest Contentful Paint by improving server response time and optimizing images');
      }
      if (this.getVitalStatus('FID', metrics.webVitals.FID?.value) !== 'good') {
        recommendations.push('Improve First Input Delay by reducing JavaScript execution time and breaking up long tasks');
      }
      if (this.getVitalStatus('CLS', metrics.webVitals.CLS?.value) !== 'good') {
        recommendations.push('Reduce Cumulative Layout Shift by setting explicit dimensions for images and avoiding dynamic content insertion');
      }
    }

    // Resource Recommendations
    if (metrics.resources) {
      const totalSize = Object.values(metrics.resources).reduce(
        (sum, resource: any) => sum + resource.totalSize,
        0
      );
      if (totalSize > 5000000) { // 5MB threshold
        recommendations.push('Consider optimizing resource size through compression and lazy loading');
      }
    }

    // API Recommendations
    if (metrics.api) {
      Object.entries(metrics.api).forEach(([endpoint, data]: [string, any]) => {
        if (data.averageDuration > 1000) { // 1 second threshold
          recommendations.push(`API endpoint ${endpoint} is slow. Consider optimizing or implementing caching`);
        }
        if (data.errorRate > 0.1) { // 10% error rate threshold
          recommendations.push(`High error rate detected for ${endpoint}. Investigate and implement better error handling`);
        }
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();