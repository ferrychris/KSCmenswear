import { MemoryCache } from '../performance/cache';
import type { Collection, Product } from './types';

export class CollectionCache {
  private static instance: CollectionCache;
  private cache: MemoryCache<unknown>;

  private constructor() {
    this.cache = new MemoryCache(10 * 1024 * 1024); // 10MB cache
  }

  static getInstance(): CollectionCache {
    if (!CollectionCache.instance) {
      CollectionCache.instance = new CollectionCache();
    }
    return CollectionCache.instance;
  }

  // Collection caching
  setCollection(id: string, collection: Collection): void {
    this.cache.set(`collection:${id}`, collection);
  }

  getCollection(id: string): Collection | null {
    return this.cache.get(`collection:${id}`);
  }

  // Product caching
  setProduct(id: string, product: Product): void {
    this.cache.set(`product:${id}`, product);
  }

  getProduct(id: string): Product | null {
    return this.cache.get(`product:${id}`);
  }

  // Tag caching
  setTags(collectionId: string, tags: string[]): void {
    this.cache.set(`tags:${collectionId}`, tags);
  }

  getTags(collectionId: string): string[] | null {
    return this.cache.get(`tags:${collectionId}`);
  }

  // Cache invalidation
  invalidateCollection(id: string): void {
    this.cache.delete(`collection:${id}`);
    this.cache.delete(`tags:${id}`);
  }

  invalidateProduct(id: string): void {
    this.cache.delete(`product:${id}`);
  }

  clear(): void {
    this.cache.clear();
  }
}