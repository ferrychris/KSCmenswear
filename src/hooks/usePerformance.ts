import { useEffect, useCallback } from 'react';
import { performanceMonitor } from '@/lib/performance/monitor';
import type {
  WebVitalsMetric,
  ResourceMetric,
  APIMetric,
  ErrorMetric,
  CustomMetric,
  PerformanceMetrics,
  PerformanceReport,
} from '@/lib/performance/types';

export function usePerformance() {
  useEffect(() => {
    // Initialize performance monitoring when component mounts
    const unsubscribe = performanceMonitor.subscribe((metrics) => {
      // Handle metrics updates
      console.debug('Performance metrics updated:', metrics);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const trackWebVital = useCallback((metric: WebVitalsMetric) => {
    performanceMonitor.trackWebVitals(metric);
  }, []);

  const trackResourceUsage = useCallback((resource: ResourceMetric) => {
    performanceMonitor.trackResourceUsage(resource);
  }, []);

  const trackAPICall = useCallback((metric: APIMetric) => {
    performanceMonitor.trackAPICall(metric);
  }, []);

  const trackError = useCallback((type: string, error: ErrorMetric) => {
    performanceMonitor.trackError(type, error);
  }, []);

  const trackCustomMetric = useCallback((name: string, value: CustomMetric) => {
    performanceMonitor.trackCustomMetric(name, value);
  }, []);

  const trackUserTiming = useCallback((label: string, duration: number) => {
    performanceMonitor.trackUserTiming(label, duration);
  }, []);

  const getMetrics = useCallback((category?: string): PerformanceMetrics => {
    return performanceMonitor.getMetrics(category);
  }, []);

  const generateReport = useCallback((): PerformanceReport => {
    return performanceMonitor.generateReport();
  }, []);

  return {
    trackWebVital,
    trackResourceUsage,
    trackAPICall,
    trackError,
    trackCustomMetric,
    trackUserTiming,
    getMetrics,
    generateReport,
  };
}