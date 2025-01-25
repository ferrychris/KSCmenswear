import { useState, useEffect } from 'react';
import { offlineManager } from '@/lib/mobile/offline';
import { performanceMonitor } from '@/lib/performance/monitor';

export function useOffline<T>(
  storeName: string,
  id?: string,
  initialData?: T
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const loadData = async () => {
      try {
        await offlineManager.initialize();
        const result = id
          ? await offlineManager.getData<T>(storeName, id)
          : await offlineManager.getAllData<T>(storeName);
        
        setData(result);
        performanceMonitor.trackCustomMetric('offline_data_load', {
          store: storeName,
          duration: performance.now() - startTime,
          success: true,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load data');
        setError(error);
        performanceMonitor.trackError('offline_data_load', {
          store: storeName,
          error: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [storeName, id]);

  const saveData = async (newData: T) => {
    const startTime = performance.now();
    try {
      await offlineManager.initialize();
      await offlineManager.saveData(storeName, newData);
      setData(newData);
      performanceMonitor.trackCustomMetric('offline_data_save', {
        store: storeName,
        duration: performance.now() - startTime,
        success: true,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save data');
      setError(error);
      performanceMonitor.trackError('offline_data_save', {
        store: storeName,
        error: error.message,
      });
      throw error;
    }
  };

  const removeData = async () => {
    if (!id) return;

    const startTime = performance.now();
    try {
      await offlineManager.initialize();
      await offlineManager.removeData(storeName, id);
      setData(null);
      performanceMonitor.trackCustomMetric('offline_data_remove', {
        store: storeName,
        duration: performance.now() - startTime,
        success: true,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove data');
      setError(error);
      performanceMonitor.trackError('offline_data_remove', {
        store: storeName,
        error: error.message,
      });
      throw error;
    }
  };

  return {
    data,
    loading,
    error,
    saveData,
    removeData,
  };
}