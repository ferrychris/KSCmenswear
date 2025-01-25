import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { ClassificationEngine } from '../classification/engine';
import type { Collection, CollectionRule, Product } from './types';

export class CollectionEngine {
  private cache: MemoryCache<Collection[]>;
  private classifier: ClassificationEngine;

  constructor() {
    this.cache = new MemoryCache(5 * 1024 * 1024); // 5MB cache
    this.classifier = new ClassificationEngine();
  }

  // Smart collection organization
  async organizeCollections(products: Product[]): Promise<Collection[]> {
    const cacheKey = 'collections';
    const cached = this.cache.get<Collection[]>(cacheKey);
    if (cached) return cached;

    try {
      const collections = await this.generateCollections(products);
      this.cache.set(cacheKey, collections);
      return collections;
    } catch (error) {
      throw new CollectionError('Failed to organize collections', { cause: error });
    }
  }

  // Automated tagging system
  async generateTags(product: Product): Promise<string[]> {
    try {
      const classification = await this.classifier.classify(
        `${product.title} ${product.description}`
      );
      return [...new Set([...classification.tags, ...product.tags])];
    } catch (error) {
      throw new CollectionError('Failed to generate tags', { cause: error });
    }
  }

  // Collection rules engine
  evaluateRules(product: Product, rules: CollectionRule[]): boolean {
    return rules.every(rule => {
      switch (rule.condition) {
        case 'tag':
          return product.tags.includes(rule.value);
        case 'price':
          return this.evaluatePriceRule(product.price, rule);
        case 'title':
          return product.title.toLowerCase().includes(rule.value.toLowerCase());
        case 'vendor':
          return product.vendor === rule.value;
        case 'type':
          return product.type === rule.value;
        default:
          return false;
      }
    });
  }

  // Product categorization
  async categorizeProduct(product: Product): Promise<string[]> {
    try {
      const classification = await this.classifier.classify(
        `${product.title} ${product.description}`
      );
      return [classification.category];
    } catch (error) {
      throw new CollectionError('Failed to categorize product', { cause: error });
    }
  }

  // Tag management
  async manageTags(products: Product[]): Promise<Map<string, number>> {
    const tagFrequency = new Map<string, number>();

    for (const product of products) {
      const tags = await this.generateTags(product);
      tags.forEach(tag => {
        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
      });
    }

    return tagFrequency;
  }

  // Collection synchronization
  async syncCollections(
    localCollections: Collection[],
    remoteCollections: Collection[]
  ): Promise<Collection[]> {
    try {
      const merged = new Map<string, Collection>();

      // Merge remote collections first
      remoteCollections.forEach(collection => {
        merged.set(collection.id, { ...collection, synced: true });
      });

      // Merge local collections, preserving remote data if exists
      localCollections.forEach(collection => {
        const existing = merged.get(collection.id);
        if (existing) {
          merged.set(collection.id, {
            ...collection,
            ...existing,
            synced: true,
          });
        } else {
          merged.set(collection.id, { ...collection, synced: false });
        }
      });

      return Array.from(merged.values());
    } catch (error) {
      throw new CollectionError('Failed to sync collections', { cause: error });
    }
  }

  // Private helper methods
  private async generateCollections(products: Product[]): Promise<Collection[]> {
    const collections = new Map<string, Collection>();

    for (const product of products) {
      const categories = await this.categorizeProduct(product);
      const tags = await this.generateTags(product);

      categories.forEach(category => {
        const existing = collections.get(category) || {
          id: category,
          title: this.formatTitle(category),
          products: [],
          tags: new Set<string>(),
          rules: [],
          synced: false,
        };

        existing.products.push(product);
        tags.forEach(tag => existing.tags.add(tag));
        collections.set(category, existing);
      });
    }

    return Array.from(collections.values()).map(collection => ({
      ...collection,
      tags: Array.from(collection.tags),
    }));
  }

  private evaluatePriceRule(price: number, rule: CollectionRule): boolean {
    const value = parseFloat(rule.value);
    switch (rule.operator) {
      case 'equals':
        return price === value;
      case 'greater_than':
        return price > value;
      case 'less_than':
        return price < value;
      default:
        return false;
    }
  }

  private formatTitle(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Error handling
export class CollectionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CollectionError';
  }
}

// Validation schemas
export const CollectionRuleSchema = z.object({
  condition: z.enum(['tag', 'price', 'title', 'vendor', 'type']),
  operator: z.enum(['equals', 'greater_than', 'less_than']).optional(),
  value: z.string(),
});