import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { performanceMonitor } from '../performance/monitor';
import type { Product } from '@/types';

export class RecommendationEngine {
  private cache: MemoryCache<Product[]>;
  private productIndex: Map<string, Set<string>>;

  constructor() {
    this.cache = new MemoryCache(10 * 1024 * 1024); // 10MB cache
    this.productIndex = new Map();
  }

  getComplementaryProducts(product: Product | null, allProducts: Product[]): Product[] {
    if (!product || !Array.isArray(allProducts)) return [];

    const startTime = performance.now();
    const cacheKey = `complementary:${product.id}`;
    
    try {
      // Check cache first
      const cached = this.cache.get<Product[]>(cacheKey);
      if (cached) {
        this.trackMetrics('complementary', performance.now() - startTime, true);
        return cached;
      }

      // Build index if needed
      this.ensureIndex(allProducts);

      // Get complementary products using indexed lookups
      const recommendations = this.findComplementaryProducts(product, allProducts);
      
      // Cache results
      this.cache.set(cacheKey, recommendations);
      
      this.trackMetrics('complementary', performance.now() - startTime, false);
      return recommendations;
    } catch (error) {
      console.error('Error generating complementary products:', error);
      this.trackError('complementary', error);
      return [];
    }
  }

  getRelatedProducts(product: Product | null, allProducts: Product[]): Product[] {
    if (!product || !Array.isArray(allProducts)) return [];

    const startTime = performance.now();
    const cacheKey = `related:${product.id}`;
    
    try {
      // Check cache first
      const cached = this.cache.get<Product[]>(cacheKey);
      if (cached) {
        this.trackMetrics('related', performance.now() - startTime, true);
        return cached;
      }

      // Build index if needed
      this.ensureIndex(allProducts);

      // Get related products using indexed lookups
      const recommendations = this.findRelatedProducts(product, allProducts);
      
      // Cache results
      this.cache.set(cacheKey, recommendations);
      
      this.trackMetrics('related', performance.now() - startTime, false);
      return recommendations;
    } catch (error) {
      console.error('Error generating related products:', error);
      this.trackError('related', error);
      return [];
    }
  }

  private ensureIndex(products: Product[]): void {
    if (this.productIndex.size === 0) {
      // Index by category
      products.forEach(product => {
        if (product.category) {
          const categorySet = this.productIndex.get(product.category) || new Set();
          categorySet.add(product.id);
          this.productIndex.set(product.category, categorySet);
        }

        // Index by color
        product.colors?.forEach(color => {
          const colorKey = `color:${color.toLowerCase()}`;
          const colorSet = this.productIndex.get(colorKey) || new Set();
          colorSet.add(product.id);
          this.productIndex.set(colorKey, colorSet);
        });

        // Index by price range
        const priceRange = `price:${Math.floor(product.price / 100) * 100}`;
        const priceSet = this.productIndex.get(priceRange) || new Set();
        priceSet.add(product.id);
        this.productIndex.set(priceRange, priceSet);
      });
    }
  }

  private findComplementaryProducts(product: Product, allProducts: Product[]): Product[] {
    const complementaryIds = new Set<string>();
    
    // Get products from same category
    if (product.category) {
      const categoryProducts = this.productIndex.get(product.category);
      categoryProducts?.forEach(id => {
        if (id !== product.id) complementaryIds.add(id);
      });
    }

    // Get products with similar colors
    product.colors?.forEach(color => {
      const colorKey = `color:${color.toLowerCase()}`;
      const colorProducts = this.productIndex.get(colorKey);
      colorProducts?.forEach(id => {
        if (id !== product.id) complementaryIds.add(id);
      });
    });

    // Convert IDs back to products and limit results
    return Array.from(complementaryIds)
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  }

  private findRelatedProducts(product: Product, allProducts: Product[]): Product[] {
    const relatedIds = new Set<string>();
    
    // Get products in same price range
    const priceRange = `price:${Math.floor(product.price / 100) * 100}`;
    const priceProducts = this.productIndex.get(priceRange);
    priceProducts?.forEach(id => {
      if (id !== product.id) relatedIds.add(id);
    });

    // Get products from same category
    if (product.category) {
      const categoryProducts = this.productIndex.get(product.category);
      categoryProducts?.forEach(id => {
        if (id !== product.id) relatedIds.add(id);
      });
    }

    // Convert IDs back to products and limit results
    return Array.from(relatedIds)
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  }

  private trackMetrics(type: string, duration: number, cacheHit: boolean): void {
    performanceMonitor.trackCustomMetric('recommendations', {
      type,
      duration,
      cacheHit,
      timestamp: Date.now(),
    });
  }

  private trackError(type: string, error: unknown): void {
    performanceMonitor.trackError('recommendations', {
      type,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    });
  }
}

export const recommendationEngine = new RecommendationEngine();