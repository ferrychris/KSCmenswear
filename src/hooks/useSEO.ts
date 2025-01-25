import { useCallback } from 'react';
import { SEOEngine } from '@/lib/seo/engine';
import type {
  MetaTags,
  StructuredData,
  SitemapConfig,
  RobotsConfig,
  OpenGraphTags,
  TwitterCard,
  SchemaMarkup,
  SEOMetrics,
} from '@/lib/seo/types';

const seoEngine = new SEOEngine({
  siteName: 'KCT Menswear',
  baseUrl: 'https://kctmenswear.com',
  defaultTitle: 'Premium Menswear | KCT Menswear',
  defaultDescription: 'Premium menswear for the modern gentleman',
  defaultImage: '/images/default-og.jpg',
  twitterHandle: '@kctmenswear',
});

export function useSEO() {
  const generateMetaTags = useCallback((page: any): MetaTags => {
    return seoEngine.generateMetaTags(page);
  }, []);

  const generateStructuredData = useCallback((page: any): StructuredData => {
    return seoEngine.generateStructuredData(page);
  }, []);

  const generateSitemap = useCallback(async (config: SitemapConfig): Promise<string> => {
    return seoEngine.generateSitemap(config);
  }, []);

  const generateRobots = useCallback((config: RobotsConfig): string => {
    return seoEngine.generateRobots(config);
  }, []);

  const generateOpenGraphTags = useCallback((page: any): OpenGraphTags => {
    return seoEngine.generateOpenGraphTags(page);
  }, []);

  const generateTwitterCard = useCallback((page: any): TwitterCard => {
    return seoEngine.generateTwitterCard(page);
  }, []);

  const generateSchemaMarkup = useCallback((page: any): SchemaMarkup => {
    return seoEngine.generateSchemaMarkup(page);
  }, []);

  const trackMetrics = useCallback((page: string, metrics: Partial<SEOMetrics>): void => {
    seoEngine.trackMetrics(page, metrics);
  }, []);

  return {
    generateMetaTags,
    generateStructuredData,
    generateSitemap,
    generateRobots,
    generateOpenGraphTags,
    generateTwitterCard,
    generateSchemaMarkup,
    trackMetrics,
  };
}