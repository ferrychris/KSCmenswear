import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  private hits: Map<string, number[]>;
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.hits = new Map();
    this.config = {
      windowMs: config.windowMs,
      max: config.max,
      message: config.message || 'Too many requests, please try again later.',
      statusCode: config.statusCode || 429,
      skipFailedRequests: config.skipFailedRequests || false,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
    };

    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), Math.min(this.config.windowMs, 60000));
  }

  /**
   * Check if a request should be rate limited
   */
  checkLimit(key: string): RateLimitInfo {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing hits or initialize new array
    let hits = this.hits.get(key) || [];
    
    // Remove expired hits
    hits = hits.filter(timestamp => timestamp > windowStart);

    // Check if limit is exceeded
    const isLimited = hits.length >= this.config.max;

    // Add current hit if not limited
    if (!isLimited) {
      hits.push(now);
    }

    // Update hits
    this.hits.set(key, hits);

    // Track rate limiting metrics
    performanceMonitor.trackCustomMetric('rate_limit', {
      key,
      hits: hits.length,
      limited: isLimited,
      timestamp: now,
    });

    return {
      limit: this.config.max,
      current: hits.length,
      remaining: Math.max(0, this.config.max - hits.length),
      reset: Math.max(...hits, now) + this.config.windowMs,
    };
  }

  /**
   * Reset rate limit for a key
   */
  resetLimit(key: string): void {
    this.hits.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    for (const [key, hits] of this.hits.entries()) {
      const validHits = hits.filter(timestamp => timestamp > windowStart);
      if (validHits.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, validHits);
      }
    }
  }
}

// Validation schema for rate limit configuration
export const RateLimitConfigSchema = z.object({
  windowMs: z.number().min(0),
  max: z.number().min(1),
  message: z.string().optional(),
  statusCode: z.number().min(400).max(599).optional(),
  skipFailedRequests: z.boolean().optional(),
  skipSuccessfulRequests: z.boolean().optional(),
});

// Create rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
});