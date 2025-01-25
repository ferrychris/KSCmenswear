import { useState, useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/performance/monitor';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastUpdated.current;

    if (timeElapsed >= interval) {
      setThrottledValue(value);
      lastUpdated.current = now;

      // Track throttle performance
      performanceMonitor.trackCustomMetric('throttle', {
        interval,
        timeElapsed,
        value: typeof value === 'object' ? 'object' : value,
      });
    } else {
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - timeElapsed);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}