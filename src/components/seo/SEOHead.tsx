import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import type { MetaTags, OpenGraphTags, TwitterCard, SchemaMarkup } from '@/lib/seo/types';

interface SEOHeadProps {
  path: string;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  product?: {
    name: string;
    description: string;
    sku: string;
    brand: string;
    price: number;
    currency: string;
    inStock: boolean;
    images: string[];
  };
  article?: {
    headline: string;
    datePublished: string;
    dateModified: string;
    author: string;
  };
}

export function SEOHead({
  path,
  title,
  description,
  type = 'website',
  image,
  noindex = false,
  product,
  article,
}: SEOHeadProps) {
  const {
    generateMetaTags,
    generateOpenGraphTags,
    generateTwitterCard,
    generateSchemaMarkup,
    trackMetrics,
  } = useSEO();

  useEffect(() => {
    // Track page view and initial metrics
    trackMetrics(path, {
      pageViews: 1,
      loadTime: performance.now(),
    });

    // Track performance metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackMetrics(path, {
            loadTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    return () => observer.disconnect();
  }, [path, trackMetrics]);

  const pageData = {
    path,
    title,
    description,
    type,
    image,
    noindex,
    product,
    article,
  };

  const metaTags: MetaTags = generateMetaTags(pageData);
  const openGraphTags: OpenGraphTags = generateOpenGraphTags(pageData);
  const twitterCard: TwitterCard = generateTwitterCard(pageData);
  const schemaMarkup: SchemaMarkup = generateSchemaMarkup(pageData);

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      {metaTags.meta.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}

      {/* OpenGraph Tags */}
      {Object.entries(openGraphTags).map(([property, content]) => (
        <meta key={property} property={property} content={content} />
      ))}

      {/* Twitter Card */}
      {Object.entries(twitterCard).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}

      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />
    </>
  );
}