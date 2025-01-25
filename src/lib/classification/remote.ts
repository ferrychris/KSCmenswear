import { z } from 'zod';
import { RateLimiter } from '../security/rateLimit';
import type { ClassificationResult } from './types';

export class RemoteClassifier {
  private apiUrl: string;
  private apiKey: string;
  private rateLimiter: RateLimiter;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
  }

  async classify(text: string): Promise<ClassificationResult> {
    if (!this.rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const response = await fetch(`${this.apiUrl}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Classification failed: ${response.statusText}`);
      }

      const data = await response.json();
      return RemoteClassificationSchema.parse(data);
    } catch (error) {
      throw new RemoteClassificationError('Remote classification failed', { cause: error });
    }
  }
}

// Error handling
export class RemoteClassificationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'RemoteClassificationError';
  }
}

// Validation schema
const RemoteClassificationSchema = z.object({
  category: z.string(),
  confidence: z.object({
    score: z.number().min(0).max(1),
    factors: z.array(z.object({
      pattern: z.string(),
      weight: z.number(),
    })),
  }),
  tags: z.array(z.string()),
  timestamp: z.string().datetime(),
});