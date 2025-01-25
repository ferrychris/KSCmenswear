import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import type { SearchResult, SearchOptions, SearchAnalytics, FilterOptions } from './types';

export class SearchEngine {
  private cache: MemoryCache<SearchResult[]>;
  private analytics: Map<string, SearchAnalytics>;
  private searchIndex: Map<string, Set<string>>;
  private documents: Map<string, any>;

  constructor() {
    this.cache = new MemoryCache(50 * 1024 * 1024); // 50MB cache
    this.analytics = new Map();
    this.searchIndex = new Map();
    this.documents = new Map();
  }

  // Index management
  async indexDocuments(documents: any[]): Promise<void> {
    try {
      for (const doc of documents) {
        const docId = doc.id.toString();
        this.documents.set(docId, doc);
        
        // Index searchable fields
        const searchableText = this.getSearchableText(doc);
        const tokens = this.tokenize(searchableText);
        
        for (const token of tokens) {
          const normalizedToken = this.normalizeToken(token);
          if (!this.searchIndex.has(normalizedToken)) {
            this.searchIndex.set(normalizedToken, new Set());
          }
          this.searchIndex.get(normalizedToken)?.add(docId);
        }
      }
    } catch (error) {
      throw new SearchError('Failed to index documents', { cause: error });
    }
  }

  // Search functionality
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const startTime = performance.now();
    const cacheKey = this.generateCacheKey(query, options);

    try {
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.trackSearch(query, 'cache_hit', performance.now() - startTime);
        return cached;
      }

      const tokens = this.tokenize(query);
      let results = new Map<string, number>(); // docId -> score

      // Process each search token
      for (const token of tokens) {
        const normalizedToken = this.normalizeToken(token);
        const matches = this.findMatches(normalizedToken, options.fuzzy);

        for (const [docId, score] of matches) {
          results.set(docId, (results.get(docId) || 0) + score);
        }
      }

      // Apply filters
      let filteredResults = this.applyFilters(results, options.filters);

      // Sort by score and convert to SearchResult[]
      const finalResults = await this.formatResults(filteredResults, options);

      // Cache results
      this.cache.set(cacheKey, finalResults);
      
      // Track analytics
      this.trackSearch(query, 'search', performance.now() - startTime);

      return finalResults;
    } catch (error) {
      throw new SearchError('Search failed', { cause: error });
    }
  }

  // Suggestion generation
  async getSuggestions(
    partial: string,
    limit: number = 5
  ): Promise<string[]> {
    try {
      const normalizedPartial = this.normalizeToken(partial);
      const suggestions = new Set<string>();

      for (const token of this.searchIndex.keys()) {
        if (token.startsWith(normalizedPartial)) {
          suggestions.add(token);
        }
      }

      return Array.from(suggestions)
        .sort((a, b) => {
          const scoreA = this.getPopularityScore(a);
          const scoreB = this.getPopularityScore(b);
          return scoreB - scoreA;
        })
        .slice(0, limit);
    } catch (error) {
      throw new SearchError('Failed to generate suggestions', { cause: error });
    }
  }

  // Analytics
  getAnalytics(): SearchAnalytics[] {
    return Array.from(this.analytics.values());
  }

  clearAnalytics(): void {
    this.analytics.clear();
  }

  // Private helper methods
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[\s,.-]+/)
      .filter(token => token.length > 1);
  }

  private normalizeToken(token: string): string {
    return token
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '');
  }

  private findMatches(
    token: string,
    fuzzy: boolean = false
  ): Map<string, number> {
    const matches = new Map<string, number>();

    // Exact matches
    const exactMatches = this.searchIndex.get(token);
    if (exactMatches) {
      exactMatches.forEach(docId => matches.set(docId, 1.0));
    }

    // Fuzzy matches if enabled
    if (fuzzy) {
      for (const [indexToken, docs] of this.searchIndex.entries()) {
        if (indexToken !== token && this.calculateLevenshtein(token, indexToken) <= 2) {
          const score = this.calculateFuzzyScore(token, indexToken);
          docs.forEach(docId => {
            matches.set(docId, Math.max(matches.get(docId) || 0, score));
          });
        }
      }
    }

    return matches;
  }

  private calculateLevenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  private calculateFuzzyScore(query: string, match: string): number {
    const distance = this.calculateLevenshtein(query, match);
    const maxLength = Math.max(query.length, match.length);
    return 1 - (distance / maxLength);
  }

  private applyFilters(
    results: Map<string, number>,
    filters?: FilterOptions
  ): Map<string, number> {
    if (!filters) return results;

    return new Map(
      Array.from(results.entries()).filter(([docId]) => {
        const doc = this.documents.get(docId);
        if (!doc) return false;

        // Category filter
        if (filters.category && doc.category !== filters.category) {
          return false;
        }

        // Tags filter
        if (filters.tags?.length && !filters.tags.every(tag => doc.tags.includes(tag))) {
          return false;
        }

        // Price range filter
        if (filters.priceRange) {
          const { min, max } = filters.priceRange;
          if (
            (min !== undefined && doc.price < min) ||
            (max !== undefined && doc.price > max)
          ) {
            return false;
          }
        }

        return true;
      })
    );
  }

  private async formatResults(
    results: Map<string, number>,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    const formatted = Array.from(results.entries())
      .map(([docId, score]) => ({
        item: this.documents.get(docId),
        score,
      }))
      .sort((a, b) => b.score - a.score);

    if (options.limit) {
      return formatted.slice(0, options.limit);
    }

    return formatted;
  }

  private generateCacheKey(query: string, options: SearchOptions): string {
    return `search:${query}:${JSON.stringify(options)}`;
  }

  private getSearchableText(doc: any): string {
    return [
      doc.title,
      doc.description,
      doc.category,
      ...(doc.tags || []),
    ].filter(Boolean).join(' ');
  }

  private trackSearch(
    query: string,
    type: 'search' | 'cache_hit',
    duration: number
  ): void {
    const timestamp = new Date().toISOString();
    const analytics = this.analytics.get(query) || {
      query,
      count: 0,
      avgDuration: 0,
      lastSearched: timestamp,
      cacheHits: 0,
      totalSearches: 0,
    };

    analytics.count++;
    analytics.lastSearched = timestamp;
    analytics.avgDuration = (
      (analytics.avgDuration * (analytics.count - 1) + duration) /
      analytics.count
    );

    if (type === 'cache_hit') {
      analytics.cacheHits++;
    }
    analytics.totalSearches++;

    this.analytics.set(query, analytics);
  }

  private getPopularityScore(token: string): number {
    const analytics = this.analytics.get(token);
    if (!analytics) return 0;
    return analytics.count;
  }
}

// Error handling
export class SearchError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'SearchError';
  }
}

// Validation schemas
export const SearchOptionsSchema = z.object({
  fuzzy: z.boolean().optional(),
  limit: z.number().min(1).optional(),
  filters: z.object({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  }).optional(),
});