export type CacheLevel = 'memory' | 'session';

export interface CacheOptions {
  maxSize?: number;
  maxEntries?: number;
  ttl?: number;
  cleanupInterval?: number;
  levels?: CacheLevel[];
  warmupData?: Record<string, any>;
}

export interface CacheEntry {
  value: any;
  size: number;
  timestamp: number;
  ttl: number;
  metadata: {
    type: string;
    accessCount: number;
    lastAccessed: number;
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  currentSize: number;
  entries: number;
  evictions: number;
  operations: {
    get: OperationStats;
    set: OperationStats;
    delete: OperationStats;
  };
}

export interface OperationStats {
  count: number;
  totalTime: number;
}

export interface CacheMetrics {
  levels: Record<CacheLevel, LevelMetrics>;
  totalSize: number;
  totalEntries: number;
  hitRatio: number;
  performance: {
    averageGetTime: number;
    averageSetTime: number;
  };
}

export interface LevelMetrics {
  size: number;
  entries: number;
  hits: number;
  misses: number;
  hitRatio: number;
  evictions: number;
}

export interface CacheError {
  operation: string;
  message: string;
  key?: string;
  timestamp: string;
}