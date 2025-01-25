export interface NetworkConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  keepAlive?: boolean;
  priority?: 'high' | 'low';
}

export interface NetworkMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  totalDuration: number;
  averageDuration: number;
}

export interface NetworkError extends Error {
  status?: number;
  retryable?: boolean;
}