import { config } from '@/config';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private static instance: SitemapGenerator;
  private entries: SitemapEntry[] = [];

  private constructor() {}

  static getInstance(): SitemapGenerator {
    if (!SitemapGenerator.instance) {
      SitemapGenerator.instance = new SitemapGenerator();
    }
    return SitemapGenerator.instance;
  }

  addEntry(entry: SitemapEntry): void {
    this.entries.push({
      ...entry,
      loc: `${config.baseUrl}${entry.loc}`,
    });
  }

  generateSitemap(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${this.entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>
  `).join('')}
</urlset>`;
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /profile/
Disallow: /checkout/
Disallow: /cart/

Sitemap: ${config.baseUrl}/sitemap.xml

# Crawl-delay: 10

# Allow product images
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.webp$

# Block certain parameters
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*?page=

# Custom crawl rules
Allow: /collections/
Allow: /products/
Allow: /wedding/
Allow: /prom/
Allow: /about/
Allow: /contact/

# Mobile-first indexing
User-agent: Googlebot-Mobile
Allow: /

# Social media crawlers
User-agent: Twitterbot
Allow: /
User-agent: facebookexternalhit
Allow: /`;
  }
}

export const sitemapGenerator = SitemapGenerator.getInstance();

// Add core pages
sitemapGenerator.addEntry({
  loc: '/',
  changefreq: 'daily',
  priority: 1.0,
});

sitemapGenerator.addEntry({
  loc: '/wedding',
  changefreq: 'weekly',
  priority: 0.9,
});

sitemapGenerator.addEntry({
  loc: '/prom',
  changefreq: 'weekly',
  priority: 0.9,
});

// Add collection pages
[
  '/collections/suits',
  '/collections/wedding-suits',
  '/collections/prom-tuxedos',
  '/collections/accessories',
].forEach(path => {
  sitemapGenerator.addEntry({
    loc: path,
    changefreq: 'weekly',
    priority: 0.8,
  });
});

// Add info pages
[
  '/about',
  '/contact',
  '/locations',
  '/alterations',
  '/rental',
].forEach(path => {
  sitemapGenerator.addEntry({
    loc: path,
    changefreq: 'monthly',
    priority: 0.7,
  });
});