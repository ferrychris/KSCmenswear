import { z } from 'zod';
import { HybridClassifier } from './hybrid';
import { ImageAnalyzer } from '../image/analyzer';
import { MemoryCache } from '../performance/cache';
import type { ClassificationResult, ClassificationHistory } from './types';

export class ClassificationPipeline {
  private classifier: HybridClassifier;
  private imageAnalyzer: ImageAnalyzer;
  private cache: MemoryCache<ClassificationResult>;
  private history: Map<string, ClassificationHistory[]>;
  private rules: ClassificationRule[];

  constructor() {
    this.classifier = new HybridClassifier();
    this.imageAnalyzer = new ImageAnalyzer();
    this.cache = new MemoryCache(20 * 1024 * 1024); // 20MB cache
    this.history = new Map();
    this.rules = [];
  }

  async classify(
    text: string,
    imageUrl?: string,
    options: ClassificationOptions = {}
  ): Promise<ClassificationResult> {
    const cacheKey = `${text}:${imageUrl || ''}`;
    
    try {
      // Check cache unless bypass is requested
      if (!options.bypassCache) {
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;
      }

      // Run classification pipeline
      const result = await this.runPipeline(text, imageUrl);
      
      // Apply custom rules
      const finalResult = this.applyRules(result);
      
      // Store in cache and history
      this.cache.set(cacheKey, finalResult);
      this.addToHistory(cacheKey, finalResult);

      return finalResult;
    } catch (error) {
      throw new ClassificationPipelineError('Classification pipeline failed', { cause: error });
    }
  }

  // Rule management
  addRule(rule: ClassificationRule): void {
    const validRule = ClassificationRuleSchema.parse(rule);
    this.rules.push(validRule);
  }

  clearRules(): void {
    this.rules = [];
  }

  // Manual override
  async override(
    originalResult: ClassificationResult,
    overrides: Partial<ClassificationResult>,
    reason: string
  ): Promise<ClassificationResult> {
    const updatedResult = {
      ...originalResult,
      ...overrides,
      metadata: {
        ...originalResult.metadata,
        overridden: true,
        overrideReason: reason,
        overrideTimestamp: new Date().toISOString(),
      },
    };

    // Update cache and history
    const cacheKey = originalResult.metadata.id;
    this.cache.set(cacheKey, updatedResult);
    this.addToHistory(cacheKey, updatedResult);

    return updatedResult;
  }

  // Performance metrics
  getMetrics(): ClassificationMetrics {
    const totalClassifications = Array.from(this.history.values())
      .reduce((sum, hist) => sum + hist.length, 0);

    const accuracyStats = this.calculateAccuracyStats();
    const latencyStats = this.calculateLatencyStats();

    return {
      totalClassifications,
      accuracy: accuracyStats,
      latency: latencyStats,
      cacheHitRate: this.calculateCacheHitRate(),
      timestamp: new Date().toISOString(),
    };
  }

  // History management
  getHistory(id: string): ClassificationHistory[] {
    return this.history.get(id) || [];
  }

  clearHistory(): void {
    this.history.clear();
  }

  // Private methods
  private async runPipeline(
    text: string,
    imageUrl?: string
  ): Promise<ClassificationResult> {
    const startTime = performance.now();

    // Run classification
    const classificationResult = await this.classifier.classify(text, imageUrl);

    // Add metadata
    const result: ClassificationResult = {
      ...classificationResult,
      metadata: {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTime: performance.now() - startTime,
        source: 'pipeline',
        version: '1.0',
      },
    };

    return result;
  }

  private applyRules(result: ClassificationResult): ClassificationResult {
    let updatedResult = { ...result };

    for (const rule of this.rules) {
      if (this.evaluateRule(updatedResult, rule)) {
        updatedResult = {
          ...updatedResult,
          category: rule.targetCategory,
          confidence: {
            ...updatedResult.confidence,
            factors: [
              ...updatedResult.confidence.factors,
              { pattern: rule.name, weight: rule.weight },
            ],
          },
        };
      }
    }

    return updatedResult;
  }

  private evaluateRule(
    result: ClassificationResult,
    rule: ClassificationRule
  ): boolean {
    switch (rule.condition.type) {
      case 'confidence':
        return result.confidence.score >= rule.condition.threshold;
      case 'tag':
        return result.tags.includes(rule.condition.tag);
      case 'category':
        return result.category === rule.condition.category;
      default:
        return false;
    }
  }

  private addToHistory(id: string, result: ClassificationResult): void {
    const history = this.history.get(id) || [];
    history.push({
      result,
      timestamp: new Date().toISOString(),
    });
    this.history.set(id, history);
  }

  private calculateAccuracyStats(): AccuracyStats {
    // Implementation would compare against known correct classifications
    return {
      overall: 0.95,
      byCategory: new Map(),
      confidence: {
        mean: 0.85,
        stdDev: 0.1,
      },
    };
  }

  private calculateLatencyStats(): LatencyStats {
    const latencies = Array.from(this.history.values())
      .flat()
      .map(h => h.result.metadata.processingTime);

    return {
      mean: this.calculateMean(latencies),
      p95: this.calculatePercentile(latencies, 95),
      p99: this.calculatePercentile(latencies, 99),
    };
  }

  private calculateCacheHitRate(): number {
    // Implementation would track cache hits/misses
    return 0.75;
  }

  private calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

// Types and schemas
interface ClassificationOptions {
  bypassCache?: boolean;
  customRules?: ClassificationRule[];
}

interface ClassificationRule {
  name: string;
  condition: RuleCondition;
  targetCategory: string;
  weight: number;
}

type RuleCondition =
  | { type: 'confidence'; threshold: number }
  | { type: 'tag'; tag: string }
  | { type: 'category'; category: string };

interface ClassificationMetrics {
  totalClassifications: number;
  accuracy: AccuracyStats;
  latency: LatencyStats;
  cacheHitRate: number;
  timestamp: string;
}

interface AccuracyStats {
  overall: number;
  byCategory: Map<string, number>;
  confidence: {
    mean: number;
    stdDev: number;
  };
}

interface LatencyStats {
  mean: number;
  p95: number;
  p99: number;
}

// Validation schemas
const RuleConditionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('confidence'),
    threshold: z.number().min(0).max(1),
  }),
  z.object({
    type: z.literal('tag'),
    tag: z.string(),
  }),
  z.object({
    type: z.literal('category'),
    category: z.string(),
  }),
]);

const ClassificationRuleSchema = z.object({
  name: z.string(),
  condition: RuleConditionSchema,
  targetCategory: z.string(),
  weight: z.number().min(0).max(1),
});

// Error handling
export class ClassificationPipelineError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ClassificationPipelineError';
  }
}