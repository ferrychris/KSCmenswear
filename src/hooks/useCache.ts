import { useCallback } from 'react';
import { CacheEngine } from '@/lib/cache/engine';
import type { CacheOptions, CacheLevel, CacheMetrics } from '@/lib/cache/types';

const cacheEngine = new CacheEngine();

export function useCache() {
  const get = useCallback(async <T>(
    key: string,
    level?: CacheLevel
  ): Promise<T | undefined> => {
    return cacheEngine.get<T>(key, level);
  }, []);

  const set = useCallback(async <T>(
    key: string,
    value: T,
    options?: Partial<CacheOptions>
  ): Promise<void> => {
    return cacheEngine.set(key, value, options);
  }, []);

  const remove = useCallback(async (
    key: string,
    level?: CacheLevel
  ): Promise<boolean> => {
    return cacheEngine.delete(key, level);
  }, []);

  const clear = useCallback(async (level?: CacheLevel): Promise<void> => {
    return cacheEngine.clear(level);
  }, []);

  const getMetrics = useCallback((): CacheMetrics => {
    return cacheEngine.getMetrics();
  }, []);

  return {
    get,
    set,
    remove,
    clear,
    getMetrics,
  };
}