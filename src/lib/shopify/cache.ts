type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type CacheOptions = {
  ttl: number;
};

class Cache {
  private cache: Map<string, CacheEntry<unknown>>;
  private defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, options?: CacheOptions): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const shopifyCache = new Cache();