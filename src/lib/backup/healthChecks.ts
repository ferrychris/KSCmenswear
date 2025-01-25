import { backupEngine } from './engine';
import { performanceMonitor } from '../performance/monitor';

// Register health checks
export function registerHealthChecks() {
  // API Health Check
  backupEngine.registerHealthCheck('api', {
    check: async () => {
      const startTime = performance.now();
      try {
        const response = await fetch('/api/health');
        const healthy = response.ok;
        
        return {
          healthy,
          message: healthy ? 'API is healthy' : 'API health check failed',
          metrics: {
            responseTime: performance.now() - startTime,
          },
        };
      } catch (error) {
        return {
          healthy: false,
          message: error instanceof Error ? error.message : 'API check failed',
        };
      }
    },
    interval: 60000, // 1 minute
    timeout: 5000, // 5 seconds
  });

  // Database Health Check
  backupEngine.registerHealthCheck('database', {
    check: async () => {
      const startTime = performance.now();
      try {
        const response = await fetch('/api/db/health');
        const data = await response.json();
        
        return {
          healthy: data.status === 'ok',
          message: data.message,
          metrics: {
            responseTime: performance.now() - startTime,
            connections: data.connections,
            queryLatency: data.queryLatency,
          },
        };
      } catch (error) {
        return {
          healthy: false,
          message: error instanceof Error ? error.message : 'Database check failed',
        };
      }
    },
    interval: 300000, // 5 minutes
    timeout: 10000, // 10 seconds
  });

  // Memory Usage Check
  backupEngine.registerHealthCheck('memory', {
    check: async () => {
      const memory = performance.memory;
      const usedMemory = memory.usedJSHeapSize;
      const totalMemory = memory.jsHeapSizeLimit;
      const memoryUsage = usedMemory / totalMemory;

      return {
        healthy: memoryUsage < 0.9, // Less than 90% usage
        message: `Memory usage: ${Math.round(memoryUsage * 100)}%`,
        metrics: {
          usedMemory,
          totalMemory,
          memoryUsage,
        },
      };
    },
    interval: 60000, // 1 minute
    timeout: 1000, // 1 second
  });

  // Cache Health Check
  backupEngine.registerHealthCheck('cache', {
    check: async () => {
      const startTime = performance.now();
      try {
        const response = await fetch('/api/cache/health');
        const data = await response.json();
        
        return {
          healthy: data.status === 'ok',
          message: data.message,
          metrics: {
            responseTime: performance.now() - startTime,
            hitRate: data.hitRate,
            size: data.size,
          },
        };
      } catch (error) {
        return {
          healthy: false,
          message: error instanceof Error ? error.message : 'Cache check failed',
        };
      }
    },
    interval: 300000, // 5 minutes
    timeout: 5000, // 5 seconds
  });
}