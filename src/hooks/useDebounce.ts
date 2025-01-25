import { useState, useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/performance/monitor';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    startTimeRef.current = Date.now();

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);

      // Track debounce performance
      if (startTimeRef.current) {
        performanceMonitor.trackCustomMetric('debounce', {
          duration: Date.now() - startTimeRef.current,
          value: typeof value === 'object' ? 'object' : value,
        });
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}