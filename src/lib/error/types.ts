export interface ErrorEvent {
  id: string;
  error: Error;
  timestamp: string;
  recovered: boolean;
  recoveryTime: number;
}

export interface RetryStrategy {
  maxAttempts: number;
  backoff: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  shouldRetry?: (error: Error) => boolean;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitorInterval?: number;
}

export interface FallbackStrategy<T = any> {
  id: string;
  handler: (error: unknown) => Promise<T>;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  recoveryRate: number;
  averageRecoveryTime: number;
  circuitBreakerStats: Record<string, any>;
  retryStats: Record<string, any>;
}