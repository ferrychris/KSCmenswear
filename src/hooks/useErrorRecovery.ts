import { useCallback } from 'react';
import { ErrorRecoveryEngine } from '@/lib/error/engine';
import type { RetryStrategy, CircuitBreakerConfig, FallbackStrategy } from '@/lib/error/types';

const errorRecoveryEngine = new ErrorRecoveryEngine();

export function useErrorRecovery() {
  const withRecovery = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      id?: string;
      retryStrategy?: RetryStrategy;
      circuitBreaker?: CircuitBreakerConfig;
      fallbackStrategy?: FallbackStrategy<T>;
      timeout?: number;
    }
  ): Promise<T> => {
    return errorRecoveryEngine.withRecovery(operation, options);
  }, []);

  const registerRetryStrategy = useCallback((
    id: string,
    strategy: RetryStrategy
  ): void => {
    errorRecoveryEngine.registerRetryStrategy(id, strategy);
  }, []);

  const registerCircuitBreaker = useCallback((
    id: string,
    config: CircuitBreakerConfig
  ): void => {
    errorRecoveryEngine.registerCircuitBreaker(id, config);
  }, []);

  const registerFallbackStrategy = useCallback(<T>(
    id: string,
    strategy: FallbackStrategy<T>
  ): void => {
    errorRecoveryEngine.registerFallbackStrategy(id, strategy);
  }, []);

  const getErrorMetrics = useCallback((id?: string) => {
    return errorRecoveryEngine.getErrorMetrics(id);
  }, []);

  return {
    withRecovery,
    registerRetryStrategy,
    registerCircuitBreaker,
    registerFallbackStrategy,
    getErrorMetrics,
  };
}