import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';
import type { 
  ErrorEvent, 
  RetryStrategy, 
  CircuitBreakerConfig,
  FallbackStrategy,
  ErrorMetrics 
} from './types';

export class ErrorRecoveryEngine {
  private retryStrategies: Map<string, RetryStrategy>;
  private circuitBreakers: Map<string, CircuitBreaker>;
  private fallbackStrategies: Map<string, FallbackStrategy>;
  private errorHistory: Map<string, ErrorEvent[]>;

  constructor() {
    this.retryStrategies = new Map();
    this.circuitBreakers = new Map();
    this.fallbackStrategies = new Map();
    this.errorHistory = new Map();

    // Register default network error retry strategy
    this.registerRetryStrategy('network', {
      maxAttempts: 3,
      backoff: 'exponential',
      initialDelay: 1000,
      shouldRetry: (error) => {
        return this.isNetworkError(error) || this.isServerError(error);
      }
    });

    // Register default circuit breaker for network requests
    this.registerCircuitBreaker('network', {
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      monitorInterval: 10000, // 10 seconds
    });
  }

  async withRecovery<T>(
    operation: () => Promise<T>,
    options: RecoveryOptions = {}
  ): Promise<T> {
    const {
      id = 'default',
      retryStrategy = this.retryStrategies.get('network'),
      circuitBreaker: circuitBreakerConfig,
      fallbackStrategy,
      timeout,
    } = options;

    try {
      // Check circuit breaker
      const circuitBreaker = this.getCircuitBreaker(id, circuitBreakerConfig);
      if (!circuitBreaker.canExecute()) {
        throw new CircuitBreakerError('Circuit breaker is open');
      }

      // Execute with timeout if specified
      const result = await this.executeWithTimeout(
        () => this.executeWithRetry(operation, id, retryStrategy),
        timeout
      );

      // Reset circuit breaker on success
      circuitBreaker.onSuccess();

      return result;
    } catch (error) {
      // Track error
      this.trackError(id, error);

      // Update circuit breaker
      const circuitBreaker = this.getCircuitBreaker(id, circuitBreakerConfig);
      circuitBreaker.onError(error);

      // Try fallback if available
      if (fallbackStrategy) {
        return this.executeFallback(fallbackStrategy, error);
      }

      throw error;
    }
  }

  // Error Detection
  private isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('network') ||
        error.message.includes('fetch') ||
        error.message.includes('connection') ||
        error.message.includes('offline') ||
        error.message.toLowerCase().includes('timeout')
      );
    }
    return false;
  }

  private isServerError(error: unknown): boolean {
    if (error instanceof Error) {
      const statusMatch = error.message.match(/status (\d{3})/);
      if (statusMatch) {
        const status = parseInt(statusMatch[1]);
        return status >= 500 && status < 600;
      }
    }
    return false;
  }

  // Retry Strategy Management
  registerRetryStrategy(id: string, strategy: RetryStrategy): void {
    this.retryStrategies.set(id, strategy);
  }

  // Circuit Breaker Management
  registerCircuitBreaker(id: string, config: CircuitBreakerConfig): void {
    this.circuitBreakers.set(id, new CircuitBreaker(config));
  }

  // Fallback Strategy Management
  registerFallbackStrategy<T>(id: string, strategy: FallbackStrategy<T>): void {
    this.fallbackStrategies.set(id, strategy);
  }

  // Error Analytics
  getErrorMetrics(id?: string): ErrorMetrics {
    const errors = id 
      ? this.errorHistory.get(id) || []
      : Array.from(this.errorHistory.values()).flat();

    return {
      totalErrors: errors.length,
      errorsByType: this.groupErrorsByType(errors),
      recoveryRate: this.calculateRecoveryRate(errors),
      averageRecoveryTime: this.calculateAverageRecoveryTime(errors),
      circuitBreakerStats: this.getCircuitBreakerStats(),
      retryStats: this.getRetryStats(),
    };
  }

  // Private helper methods
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    id: string,
    retryStrategy?: RetryStrategy
  ): Promise<T> {
    const strategy = retryStrategy || this.retryStrategies.get(id) || {
      maxAttempts: 3,
      backoff: 'exponential',
      initialDelay: 1000,
    };

    let lastError: Error | undefined;
    let attempt = 0;

    while (attempt < strategy.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Check if we should retry this error
        if (strategy.shouldRetry && !strategy.shouldRetry(lastError)) {
          throw lastError;
        }

        attempt++;

        if (attempt < strategy.maxAttempts) {
          const delay = this.calculateBackoff(attempt, strategy);
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    if (!timeout) return operation();

    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeout);
      }),
    ]);
  }

  private async executeFallback<T>(
    strategy: FallbackStrategy<T>,
    error: unknown
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await strategy.handler(error);
      this.trackFallback(strategy.id, true, performance.now() - startTime);
      return result;
    } catch (fallbackError) {
      this.trackFallback(strategy.id, false, performance.now() - startTime);
      throw fallbackError;
    }
  }

  private getCircuitBreaker(
    id: string,
    config?: CircuitBreakerConfig
  ): CircuitBreaker {
    let circuitBreaker = this.circuitBreakers.get(id);
    
    if (!circuitBreaker && config) {
      circuitBreaker = new CircuitBreaker(config);
      this.circuitBreakers.set(id, circuitBreaker);
    }

    if (!circuitBreaker) {
      circuitBreaker = new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000,
      });
      this.circuitBreakers.set(id, circuitBreaker);
    }

    return circuitBreaker;
  }

  private calculateBackoff(attempt: number, strategy: RetryStrategy): number {
    const { backoff, initialDelay } = strategy;

    switch (backoff) {
      case 'linear':
        return initialDelay * attempt;
      case 'exponential':
        return initialDelay * Math.pow(2, attempt - 1);
      case 'fixed':
        return initialDelay;
      default:
        return initialDelay;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private trackError(id: string, error: unknown): void {
    const errorEvent: ErrorEvent = {
      id,
      error: error instanceof Error ? error : new Error('Unknown error'),
      timestamp: new Date().toISOString(),
      recovered: false,
      recoveryTime: 0,
    };

    const errors = this.errorHistory.get(id) || [];
    errors.push(errorEvent);
    this.errorHistory.set(id, errors);

    performanceMonitor.trackError('error_recovery', {
      id,
      error: errorEvent.error.message,
      timestamp: errorEvent.timestamp,
    });
  }

  private trackFallback(id: string, success: boolean, duration: number): void {
    performanceMonitor.trackMetric('fallback_execution', {
      id,
      success,
      duration,
    });
  }

  private groupErrorsByType(errors: ErrorEvent[]): Record<string, number> {
    return errors.reduce((acc, event) => {
      const type = event.error.name || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateRecoveryRate(errors: ErrorEvent[]): number {
    if (errors.length === 0) return 1;
    const recovered = errors.filter(e => e.recovered).length;
    return recovered / errors.length;
  }

  private calculateAverageRecoveryTime(errors: ErrorEvent[]): number {
    const recoveredErrors = errors.filter(e => e.recovered);
    if (recoveredErrors.length === 0) return 0;
    
    const totalTime = recoveredErrors.reduce((sum, e) => sum + e.recoveryTime, 0);
    return totalTime / recoveredErrors.length;
  }

  private getCircuitBreakerStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    this.circuitBreakers.forEach((breaker, id) => {
      stats[id] = {
        state: breaker.getState(),
        failures: breaker.getFailureCount(),
        lastFailure: breaker.getLastFailure(),
      };
    });

    return stats;
  }

  private getRetryStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    this.retryStrategies.forEach((strategy, id) => {
      stats[id] = {
        maxAttempts: strategy.maxAttempts,
        backoff: strategy.backoff,
        initialDelay: strategy.initialDelay,
      };
    });

    return stats;
  }
}

// Circuit Breaker Implementation
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount: number = 0;
  private lastFailure: number | null = null;
  private readonly config: Required<CircuitBreakerConfig>;

  constructor(config: CircuitBreakerConfig) {
    this.config = {
      failureThreshold: config.failureThreshold,
      resetTimeout: config.resetTimeout,
      monitorInterval: config.monitorInterval || 10000,
    };

    // Start monitoring
    setInterval(() => this.monitor(), this.config.monitorInterval);
  }

  canExecute(): boolean {
    return this.state !== 'open';
  }

  onSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  onError(error: unknown): void {
    this.failureCount++;
    this.lastFailure = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  getLastFailure(): number | null {
    return this.lastFailure;
  }

  private monitor(): void {
    if (
      this.state === 'open' &&
      this.lastFailure &&
      Date.now() - this.lastFailure >= this.config.resetTimeout
    ) {
      this.state = 'half-open';
    }
  }
}

// Error handling
export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

// Types and validation
interface RecoveryOptions {
  id?: string;
  retryStrategy?: RetryStrategy;
  circuitBreaker?: CircuitBreakerConfig;
  fallbackStrategy?: FallbackStrategy<any>;
  timeout?: number;
}

// Validation schemas
const RetryStrategySchema = z.object({
  maxAttempts: z.number().min(1),
  backoff: z.enum(['linear', 'exponential', 'fixed']),
  initialDelay: z.number().min(0),
  shouldRetry: z.function().optional(),
});

const CircuitBreakerConfigSchema = z.object({
  failureThreshold: z.number().min(1),
  resetTimeout: z.number().min(0),
  monitorInterval: z.number().min(0).optional(),
});

const FallbackStrategySchema = z.object({
  id: z.string(),
  handler: z.function(),
});