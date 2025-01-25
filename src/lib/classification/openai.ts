import { openaiConfig } from '@/config/openai';
import { RateLimiter } from '../security/rateLimit';
import { MemoryCache } from '../performance/cache';
import type { ClassificationResult } from './types';

export class OpenAIClassifier {
  private cache: MemoryCache<ClassificationResult>;
  private rateLimiter: RateLimiter;

  constructor() {
    this.cache = new MemoryCache(10 * 1024 * 1024); // 10MB cache
    this.rateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
  }

  async classify(text: string, imageAnalysis?: any): Promise<ClassificationResult> {
    const cacheKey = `openai:${text}`;
    const cached = this.cache.get<ClassificationResult>(cacheKey);
    if (cached) return cached;

    if (!this.rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: openaiConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a fashion product classifier. Analyze the provided product description and image analysis to provide accurate categorization, tags, and confidence scores.',
            },
            {
              role: 'user',
              content: `
                Product Description: ${text}
                Image Analysis: ${JSON.stringify(imageAnalysis, null, 2)}
                
                Please provide:
                1. Primary category
                2. Relevant tags
                3. Confidence score (0-1)
                4. Reasoning for classification
                
                Format the response as JSON.
              `,
            },
          ],
          max_tokens: openaiConfig.maxTokens,
          temperature: openaiConfig.temperature,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      const classificationResult: ClassificationResult = {
        category: result.category,
        confidence: {
          score: result.confidence_score,
          factors: result.reasoning.map((reason: string) => ({
            pattern: reason,
            weight: 1 / result.reasoning.length,
          })),
        },
        tags: result.tags,
        timestamp: new Date().toISOString(),
      };

      this.cache.set(cacheKey, classificationResult);
      return classificationResult;
    } catch (error) {
      throw new OpenAIClassificationError('OpenAI classification failed', { cause: error });
    }
  }
}

export class OpenAIClassificationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'OpenAIClassificationError';
  }
}