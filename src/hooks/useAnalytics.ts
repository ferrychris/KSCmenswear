import { useCallback } from 'react';
import { AnalyticsEngine } from '@/lib/analytics/engine';
import type {
  ProductInteraction,
  SearchAnalytics,
  CartAnalytics,
  VideoEngagement,
  PerformanceMetrics,
  ErrorEvent,
  CustomEvent,
} from '@/lib/analytics/types';

const analyticsEngine = new AnalyticsEngine();

export function useAnalytics(userId: string) {
  const trackPageView = useCallback((page: string) => {
    analyticsEngine.trackPageView(userId, page);
  }, [userId]);

  const trackProductInteraction = useCallback((
    productId: string,
    interaction: ProductInteraction
  ) => {
    analyticsEngine.trackProductInteraction(userId, productId, interaction.action, interaction);
  }, [userId]);

  const trackSearch = useCallback((searchData: SearchAnalytics) => {
    analyticsEngine.trackSearch(userId, searchData);
  }, [userId]);

  const trackCartAction = useCallback((cartData: CartAnalytics) => {
    analyticsEngine.trackCartAction(userId, cartData);
  }, [userId]);

  const trackVideoEngagement = useCallback((videoData: VideoEngagement) => {
    analyticsEngine.trackVideoEngagement(userId, videoData);
  }, [userId]);

  const trackPerformance = useCallback((metrics: PerformanceMetrics) => {
    analyticsEngine.trackPerformance(metrics);
  }, []);

  const trackError = useCallback((error: ErrorEvent) => {
    analyticsEngine.trackError({ ...error, userId });
  }, [userId]);

  const trackCustomEvent = useCallback((event: CustomEvent) => {
    analyticsEngine.trackCustomEvent({ ...event, userId });
  }, [userId]);

  return {
    trackPageView,
    trackProductInteraction,
    trackSearch,
    trackCartAction,
    trackVideoEngagement,
    trackPerformance,
    trackError,
    trackCustomEvent,
  };
}