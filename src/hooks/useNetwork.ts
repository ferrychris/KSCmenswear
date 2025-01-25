import { useState, useEffect, useCallback } from 'react';
import { networkEngine } from '@/lib/network/engine';
import { performanceMonitor } from '@/lib/performance/monitor';

interface NetworkStatus {
  online: boolean;
  downlink?: number;
  rtt?: number;
  effectiveType?: string;
}

export function useNetwork() {
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection;
      
      setStatus({
        online: navigator.onLine,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        effectiveType: connection?.effectiveType,
      });

      // Track network metrics
      performanceMonitor.trackCustomMetric('network_status', {
        online: navigator.onLine,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        effectiveType: connection?.effectiveType,
      });
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    }

    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  const fetch = useCallback(async (
    url: string,
    config?: RequestInit & {
      priority?: 'high' | 'low';
      timeout?: number;
      retries?: number;
    }
  ) => {
    return networkEngine.fetch(url, config);
  }, []);

  return {
    ...status,
    fetch,
  };
}