import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { RateLimiter } from '../security/rateLimit';
import type {
  AnalyticsEvent,
  UserSession,
  ProductInteraction,
  SearchAnalytics,
  CartAnalytics,
  VideoEngagement,
  PerformanceMetrics,
  ErrorEvent,
  CustomEvent,
} from './types';

export class AnalyticsEngine {
  private cache: MemoryCache<AnalyticsEvent[]>;
  private sessions: Map<string, UserSession>;
  private rateLimiter: RateLimiter;
  private batchSize: number;
  private batchQueue: AnalyticsEvent[];
  private flushInterval: number;
  private isProcessing: boolean;

  constructor(options: AnalyticsOptions = {}) {
    this.cache = new MemoryCache(100 * 1024 * 1024); // 100MB cache
    this.sessions = new Map();
    this.rateLimiter = new RateLimiter(100, 60000); // 100 events per minute
    this.batchSize = options.batchSize || 50;
    this.batchQueue = [];
    this.flushInterval = options.flushInterval || 30000; // 30 seconds
    this.isProcessing = false;

    this.initializeProcessing();
  }

  // User Behavior Tracking
  trackPageView(userId: string, page: string): void {
    this.trackEvent({
      type: 'page_view',
      userId,
      data: { page },
      timestamp: new Date().toISOString(),
    });

    this.updateSession(userId, 'page_view', { page });
  }

  trackUserAction(userId: string, action: string, data: any): void {
    this.trackEvent({
      type: 'user_action',
      userId,
      data: { action, ...data },
      timestamp: new Date().toISOString(),
    });
  }

  // Product Interaction Analytics
  trackProductView(userId: string, productId: string, data: ProductInteraction): void {
    this.trackEvent({
      type: 'product_view',
      userId,
      data: { productId, ...data },
      timestamp: new Date().toISOString(),
    });
  }

  trackProductInteraction(
    userId: string,
    productId: string,
    interaction: string,
    data: any
  ): void {
    this.trackEvent({
      type: 'product_interaction',
      userId,
      data: { productId, interaction, ...data },
      timestamp: new Date().toISOString(),
    });
  }

  // Search Analytics
  trackSearch(userId: string, data: SearchAnalytics): void {
    this.trackEvent({
      type: 'search',
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Cart Analytics
  trackCartAction(userId: string, data: CartAnalytics): void {
    this.trackEvent({
      type: 'cart',
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Video Engagement Metrics
  trackVideoEngagement(userId: string, data: VideoEngagement): void {
    this.trackEvent({
      type: 'video_engagement',
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Performance Metrics
  trackPerformance(metrics: PerformanceMetrics): void {
    this.trackEvent({
      type: 'performance',
      userId: 'system',
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  }

  // Error Tracking
  trackError(error: ErrorEvent): void {
    this.trackEvent({
      type: 'error',
      userId: error.userId || 'system',
      data: error,
      timestamp: new Date().toISOString(),
    });
  }

  // Custom Event Tracking
  trackCustomEvent(event: CustomEvent): void {
    this.trackEvent({
      type: 'custom',
      userId: event.userId,
      data: event.data,
      timestamp: new Date().toISOString(),
    });
  }

  // Analytics Retrieval
  async getAnalytics(options: GetAnalyticsOptions = {}): Promise<AnalyticsEvent[]> {
    const { type, userId, startDate, endDate, limit } = options;
    let events = this.cache.get('events') || [];

    // Apply filters
    events = events.filter(event => {
      if (type && event.type !== type) return false;
      if (userId && event.userId !== userId) return false;
      if (startDate && new Date(event.timestamp) < new Date(startDate)) return false;
      if (endDate && new Date(event.timestamp) > new Date(endDate)) return false;
      return true;
    });

    // Apply limit
    if (limit) {
      events = events.slice(0, limit);
    }

    return events;
  }

  // Session Management
  getSession(userId: string): UserSession | undefined {
    return this.sessions.get(userId);
  }

  // Private helper methods
  private trackEvent(event: AnalyticsEvent): void {
    if (!this.rateLimiter.canMakeRequest()) {
      console.warn('Analytics rate limit exceeded');
      return;
    }

    try {
      // Validate event
      AnalyticsEventSchema.parse(event);

      // Add to batch queue
      this.batchQueue.push(event);

      // Process batch if size threshold reached
      if (this.batchQueue.length >= this.batchSize) {
        this.processBatch();
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.batchQueue.length === 0) return;

    try {
      this.isProcessing = true;
      const batch = this.batchQueue.splice(0, this.batchSize);
      
      // Store in cache
      const events = this.cache.get('events') || [];
      events.push(...batch);
      this.cache.set('events', events);

      // Here you would typically send to an analytics service
      // await this.sendToAnalyticsService(batch);
    } catch (error) {
      console.error('Failed to process analytics batch:', error);
      // Retry failed events
      this.batchQueue.unshift(...this.batchQueue);
    } finally {
      this.isProcessing = false;
    }
  }

  private updateSession(userId: string, action: string, data: any): void {
    const session = this.sessions.get(userId) || {
      userId,
      startTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      pageViews: 0,
      actions: [],
    };

    session.lastActive = new Date().toISOString();
    session.pageViews += action === 'page_view' ? 1 : 0;
    session.actions.push({
      action,
      timestamp: new Date().toISOString(),
      data,
    });

    this.sessions.set(userId, session);
  }

  private initializeProcessing(): void {
    setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.processBatch();
      }
    }, this.flushInterval);
  }
}

// Types and validation
interface AnalyticsOptions {
  batchSize?: number;
  flushInterval?: number;
}

interface GetAnalyticsOptions {
  type?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// Validation schemas
const AnalyticsEventSchema = z.object({
  type: z.string(),
  userId: z.string(),
  data: z.any(),
  timestamp: z.string().datetime(),
});