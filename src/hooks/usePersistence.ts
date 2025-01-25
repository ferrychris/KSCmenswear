import { useCallback } from 'react';
import { persistenceEngine } from '@/lib/persistence/engine';
import type { PersistenceConfig } from '@/lib/persistence/types';

export function usePersistence<T>(key: string, config: PersistenceConfig = {}) {
  const persist = useCallback(async (data: T) => {
    return persistenceEngine.persist(key, data, config);
  }, [key, config]);

  const retrieve = useCallback(async () => {
    return persistenceEngine.retrieve<T>(key, config);
  }, [key, config]);

  return {
    persist,
    retrieve,
  };
}