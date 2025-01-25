export interface MetaTags {
  title: string;
  meta: Array<Record<string, string>>;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface SitemapConfig {
  pages: Array<{
    path: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>;
  defaultPriority?: number;
  defaultChangefreq?: string;
}

export interface RobotsConfig {
  allowedPaths?: string[];
  disallowedPaths?: string[];
  sitemapUrl?: string;
}

export interface OpenGraphTags {
  'og:title': string;
  'og:description': string;
  'og:url': string;
  'og:type': string;
  'og:image': string;
  'og:site_name': string;
  [key: string]: string;
}

export interface TwitterCard {
  'twitter:card': string;
  'twitter:site': string;
  'twitter:title': string;
  'twitter:description': string;
  'twitter:image': string;
  [key: string]: string;
}

export interface SchemaMarkup {
  '@context': string;
  '@type': string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  [key: string]: any;
}

export interface SEOMetrics {
  pageViews: number;
  bounceRate: number;
  avgTimeOnPage: number;
  searchImpressions: number;
  searchClicks: number;
  searchPosition: number;
  loadTime: number;
  timestamp: string;
}