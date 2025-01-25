type CacheEntry<T> = {
  value: T;
  timestamp: number;
  size: number;
};

export class MemoryCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private currentSize: number;
  private ttl: number;

  constructor(maxSize = 50 * 1024 * 1024, ttl = 5 * 60 * 1000) { // 50MB default, 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.ttl = ttl;
  }

  set(key: string, value: T): void {
    this.cleanup();

    const size = this.getItemSize(value);
    if (size > this.maxSize) {
      console.warn(`Item size (${size}) exceeds cache max size (${this.maxSize})`);
      return;
    }

    // Make room if needed
    while (this.currentSize + size > this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (!oldestKey) break;
      this.delete(oldestKey);
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      size,
    };

    this.cache.set(key, entry);
    this.currentSize += size;
  }

  get(key: string): T | undefined {
    this.cleanup();
    const entry = this.cache.get(key);
    return entry?.value;
  }

  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.delete(key);
      }
    }
  }

  private getItemSize(item: T): number {
    try {
      const str = JSON.stringify(item);
      return new Blob([str]).size;
    } catch {
      return 0;
    }
  }

  private getOldestKey(): string | undefined {
    let oldestKey: string | undefined;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}