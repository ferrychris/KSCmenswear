export interface PerformanceMetrics {
  [key: string]: any;
  webVitals?: {
    [key: string]: {
      value: number;
      timestamp: number;
      samples: number;
    };
  };
  resources?: {
    [key: string]: {
      count: number;
      totalDuration: number;
      totalSize: number;
      items: ResourceMetric[];
    };
  };
  api?: {
    [key: string]: {
      count: number;
      totalDuration: number;
      errors: number;
      lastStatus: number;
      lastCall: number;
    };
  };
  errors?: {
    [key: string]: {
      count: number;
      lastOccurrence: number;
      samples: ErrorMetric[];
    };
  };
  custom?: {
    [key: string]: {
      value: any;
      timestamp: number;
      history: Array<{
        value: any;
        timestamp: number;
      }>;
    };
  };
}

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'LCP' | 'TTFB' | 'FCP';
  value: number;
  id: string;
  navigationType?: string;
}

export interface ResourceMetric {
  type: string;
  url: string;
  duration: number;
  size: number;
}

export interface APIMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  error?: boolean;
}

export interface ErrorMetric {
  message: string;
  stack?: string;
  timestamp?: number;
}

export interface CustomMetric {
  value: any;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  timestamp: string;
  webVitals: {
    [key: string]: {
      value: number;
      status: 'good' | 'needs-improvement' | 'poor';
    };
  };
  resources: {
    [key: string]: {
      count: number;
      averageSize: number;
      averageDuration: number;
    };
  };
  api: {
    [key: string]: {
      count: number;
      averageDuration: number;
      errorRate: number;
    };
  };
  errors: {
    [key: string]: {
      count: number;
      lastOccurrence: number;
    };
  };
  custom?: Record<string, any>;
  recommendations: string[];
}