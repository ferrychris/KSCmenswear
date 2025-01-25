import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { sanitizeHtml } from '../security/validation';
import type { ClassificationResult, ConfidenceScore, Pattern } from './types';

export class ClassificationEngine {
  private patterns: Pattern[] = [];
  private cache: MemoryCache<ClassificationResult>;
  
  constructor() {
    this.cache = new MemoryCache(10 * 1024 * 1024); // 10MB cache
  }

  // Local classification based on patterns
  async classify(text: string): Promise<ClassificationResult> {
    const sanitizedText = sanitizeHtml(text).toLowerCase();
    const cacheKey = `classification:${sanitizedText}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const matches = this.findMatches(sanitizedText);
      const confidence = this.calculateConfidence(matches);
      const tags = this.generateTags(matches);
      const category = this.assignCategory(matches, confidence);

      const result: ClassificationResult = {
        category,
        confidence,
        tags,
        timestamp: new Date().toISOString(),
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      throw new ClassificationError('Classification failed', { cause: error });
    }
  }

  // Pattern matching
  private findMatches(text: string): Pattern[] {
    return this.patterns.filter(pattern => 
      pattern.regex.test(text) || 
      text.includes(pattern.keyword.toLowerCase())
    );
  }

  // Confidence calculation
  private calculateConfidence(matches: Pattern[]): ConfidenceScore {
    if (matches.length === 0) return { score: 0, factors: [] };

    const totalWeight = matches.reduce((sum, match) => sum + match.weight, 0);
    const maxPossibleWeight = this.patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
    
    const score = Math.min(totalWeight / maxPossibleWeight, 1);
    const factors = matches.map(match => ({
      pattern: match.keyword,
      weight: match.weight,
    }));

    return { score, factors };
  }

  // Tag generation
  private generateTags(matches: Pattern[]): string[] {
    const tags = new Set<string>();
    
    matches.forEach(match => {
      tags.add(match.keyword);
      match.relatedTags?.forEach(tag => tags.add(tag));
    });

    return Array.from(tags);
  }

  // Category assignment
  private assignCategory(matches: Pattern[], confidence: ConfidenceScore): string {
    if (confidence.score < 0.3) return 'uncategorized';

    const categoryScores = matches.reduce((scores, match) => {
      if (!match.category) return scores;
      scores[match.category] = (scores[match.category] || 0) + match.weight;
      return scores;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)[0];

    return topCategory?.[0] || 'uncategorized';
  }

  // Pattern management
  addPattern(pattern: Pattern): void {
    const validPattern = PatternSchema.parse(pattern);
    this.patterns.push(validPattern);
  }

  clearPatterns(): void {
    this.patterns = [];
  }
}

// Error handling
export class ClassificationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ClassificationError';
  }
}

// Validation schemas
const PatternSchema = z.object({
  keyword: z.string().min(1),
  regex: z.instanceof(RegExp).optional(),
  weight: z.number().min(0).max(1),
  category: z.string().optional(),
  relatedTags: z.array(z.string()).optional(),
});