import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { performanceMonitor } from '../performance/monitor';
import type { 
  MetaTags, 
  StructuredData, 
  SitemapConfig,
  RobotsConfig,
  OpenGraphTags,
  TwitterCard,
  SchemaMarkup,
  SEOMetrics 
} from './types';

export class SEOEngine {
  private cache: MemoryCache<any>;
  private metrics: Map<string, SEOMetrics>;
  private defaultConfig: SEOConfig;

  constructor(config: Partial<SEOConfig> = {}) {
    this.cache = new MemoryCache(10 * 1024 * 1024); // 10MB cache
    this.metrics = new Map();
    this.defaultConfig = {
      siteName: config.siteName || 'KCT Menswear',
      baseUrl: config.baseUrl || 'https://kctmenswear.com',
      defaultTitle: config.defaultTitle || 'Premium Menswear | KCT Menswear',
      defaultDescription: config.defaultDescription || 'Premium menswear for the modern gentleman',
      defaultImage: config.defaultImage || '/images/default-og.jpg',
      twitterHandle: config.twitterHandle || '@kctmenswear',
      ...config,
    };
  }

  // Meta Tag Generation
  generateMetaTags(page: PageSEOData): MetaTags {
    const title = page.title || this.defaultConfig.defaultTitle;
    const description = page.description || this.defaultConfig.defaultDescription;

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: page.noindex ? 'noindex,nofollow' : 'index,follow' },
        // Canonical URL
        { rel: 'canonical', href: `${this.defaultConfig.baseUrl}${page.path}` },
        // Language
        { 'http-equiv': 'content-language', content: page.language || 'en' },
        // Additional meta tags
        ...(page.additionalMeta || []),
      ],
    };
  }

  // Structured Data
  generateStructuredData(page: PageSEOData): StructuredData {
    const baseStructure = {
      '@context': 'https://schema.org',
      '@type': page.type || 'WebPage',
      name: page.title || this.defaultConfig.defaultTitle,
      description: page.description || this.defaultConfig.defaultDescription,
      url: `${this.defaultConfig.baseUrl}${page.path}`,
    };

    // Add specific structured data based on page type
    switch (page.type) {
      case 'Product':
        return this.generateProductStructuredData(page, baseStructure);
      case 'Article':
        return this.generateArticleStructuredData(page, baseStructure);
      case 'Organization':
        return this.generateOrganizationStructuredData(baseStructure);
      default:
        return baseStructure;
    }
  }

  // Sitemap Generation
  async generateSitemap(config: SitemapConfig): Promise<string> {
    const { pages, defaultPriority = 0.5, defaultChangefreq = 'weekly' } = config;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${this.defaultConfig.baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq || defaultChangefreq}</changefreq>
    <priority>${page.priority || defaultPriority}</priority>
  </url>
  `).join('')}
</urlset>`;

    return sitemap.trim();
  }

  // Robots.txt Generation
  generateRobots(config: RobotsConfig): string {
    const { allowedPaths = [], disallowedPaths = [], sitemapUrl } = config;

    return `
User-agent: *
${allowedPaths.map(path => `Allow: ${path}`).join('\n')}
${disallowedPaths.map(path => `Disallow: ${path}`).join('\n')}
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}
`.trim();
  }

  // OpenGraph Tags
  generateOpenGraphTags(page: PageSEOData): OpenGraphTags {
    return {
      'og:title': page.title || this.defaultConfig.defaultTitle,
      'og:description': page.description || this.defaultConfig.defaultDescription,
      'og:url': `${this.defaultConfig.baseUrl}${page.path}`,
      'og:type': page.ogType || 'website',
      'og:image': page.image || this.defaultConfig.defaultImage,
      'og:site_name': this.defaultConfig.siteName,
      ...(page.additionalOG || {}),
    };
  }

  // Twitter Card
  generateTwitterCard(page: PageSEOData): TwitterCard {
    return {
      'twitter:card': page.twitterCard || 'summary_large_image',
      'twitter:site': this.defaultConfig.twitterHandle,
      'twitter:title': page.title || this.defaultConfig.defaultTitle,
      'twitter:description': page.description || this.defaultConfig.defaultDescription,
      'twitter:image': page.image || this.defaultConfig.defaultImage,
      ...(page.additionalTwitter || {}),
    };
  }

  // Schema.org Markup
  generateSchemaMarkup(page: PageSEOData): SchemaMarkup {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': page.type || 'WebPage',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.defaultConfig.baseUrl}${page.path}`,
      },
      ...this.generateStructuredData(page),
    };

    return baseSchema;
  }

  // SEO Performance Monitoring
  trackMetrics(page: string, metrics: Partial<SEOMetrics>): void {
    const currentMetrics = this.metrics.get(page) || {
      pageViews: 0,
      bounceRate: 0,
      avgTimeOnPage: 0,
      searchImpressions: 0,
      searchClicks: 0,
      searchPosition: 0,
      loadTime: 0,
      timestamp: new Date().toISOString(),
    };

    this.metrics.set(page, {
      ...currentMetrics,
      ...metrics,
      timestamp: new Date().toISOString(),
    });

    performanceMonitor.trackMetric('seo_performance', {
      page,
      metrics: this.metrics.get(page),
    });
  }

  // Private helper methods
  private generateProductStructuredData(
    page: PageSEOData,
    baseStructure: any
  ): StructuredData {
    if (!page.product) return baseStructure;

    return {
      ...baseStructure,
      '@type': 'Product',
      name: page.product.name,
      description: page.product.description,
      sku: page.product.sku,
      brand: {
        '@type': 'Brand',
        name: page.product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: page.product.price,
        priceCurrency: page.product.currency,
        availability: page.product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
      image: page.product.images,
    };
  }

  private generateArticleStructuredData(
    page: PageSEOData,
    baseStructure: any
  ): StructuredData {
    if (!page.article) return baseStructure;

    return {
      ...baseStructure,
      '@type': 'Article',
      headline: page.article.headline,
      datePublished: page.article.datePublished,
      dateModified: page.article.dateModified,
      author: {
        '@type': 'Person',
        name: page.article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: this.defaultConfig.siteName,
        logo: {
          '@type': 'ImageObject',
          url: this.defaultConfig.defaultImage,
        },
      },
    };
  }

  private generateOrganizationStructuredData(baseStructure: any): StructuredData {
    return {
      ...baseStructure,
      '@type': 'Organization',
      name: this.defaultConfig.siteName,
      logo: this.defaultConfig.defaultImage,
      sameAs: [
        'https://twitter.com/kctmenswear',
        'https://facebook.com/kctmenswear',
        'https://instagram.com/kctmenswear',
      ],
    };
  }
}

// Types and validation
interface SEOConfig {
  siteName: string;
  baseUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle: string;
}

interface PageSEOData {
  path: string;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  language?: string;
  ogType?: string;
  twitterCard?: string;
  additionalMeta?: Array<Record<string, string>>;
  additionalOG?: Record<string, string>;
  additionalTwitter?: Record<string, string>;
  product?: ProductSEOData;
  article?: ArticleSEOData;
}

interface ProductSEOData {
  name: string;
  description: string;
  sku: string;
  brand: string;
  price: number;
  currency: string;
  inStock: boolean;
  images: string[];
}

interface ArticleSEOData {
  headline: string;
  datePublished: string;
  dateModified: string;
  author: string;
}

// Validation schemas
const SEOConfigSchema = z.object({
  siteName: z.string(),
  baseUrl: z.string().url(),
  defaultTitle: z.string(),
  defaultDescription: z.string(),
  defaultImage: z.string(),
  twitterHandle: z.string(),
});

const PageSEODataSchema = z.object({
  path: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional(),
  language: z.string().optional(),
  ogType: z.string().optional(),
  twitterCard: z.string().optional(),
  additionalMeta: z.array(z.record(z.string())).optional(),
  additionalOG: z.record(z.string()).optional(),
  additionalTwitter: z.record(z.string()).optional(),
  product: z.object({
    name: z.string(),
    description: z.string(),
    sku: z.string(),
    brand: z.string(),
    price: z.number(),
    currency: z.string(),
    inStock: z.boolean(),
    images: z.array(z.string()),
  }).optional(),
  article: z.object({
    headline: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    author: z.string(),
  }).optional(),
});