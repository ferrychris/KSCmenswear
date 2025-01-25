import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function WinterCollectionSEO() {
  // Collection schema with seasonal collections
  const winterCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${config.baseUrl}/collections/winter#webpage`,
    name: 'Winter Collection 2025',
    description: 'Stay warm in style with our premium winter collection featuring luxury sweaters, boots, puffer jackets, and overcoats.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'WebPage',
            '@id': config.baseUrl,
            name: 'Home'
          }
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'WebPage',
            '@id': `${config.baseUrl}/collections/winter`,
            name: 'Winter 2025'
          }
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Product',
          name: 'Winter Sweater Collection',
          description: 'Premium wool and cashmere sweaters for the cold season',
          url: `${config.baseUrl}/collections/winter/sweaters`,
          image: 'https://images.unsplash.com/photo-1608991466857-5aaa2e7e593f',
        },
        {
          '@type': 'Product',
          name: 'Winter Boots Collection',
          description: 'Stylish and weather-resistant boots for winter',
          url: `${config.baseUrl}/collections/winter/boots`,
          image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f',
        },
        {
          '@type': 'Product',
          name: 'Puffer Jacket Collection',
          description: 'Warm and stylish puffer jackets for winter comfort',
          url: `${config.baseUrl}/collections/winter/puffer-jackets`,
          image: 'https://images.unsplash.com/photo-1609803384069-19f3cf521631',
        },
        {
          '@type': 'Product',
          name: 'Overcoat Collection',
          description: 'Classic and modern overcoats for winter elegance',
          url: `${config.baseUrl}/collections/winter/overcoats`,
          image: 'https://images.unsplash.com/photo-1608505362575-8ce12b1a56f4',
        }
      ]
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Winter Collection 2025 | Premium Winter Menswear | KCT Menswear</title>
      <meta 
        name="description" 
        content="Stay warm and stylish this winter with our premium collection of sweaters, boots, puffer jackets, and overcoats. Free shipping over $200." 
      />
      <meta 
        name="keywords" 
        content="winter menswear, men's sweaters, winter boots, puffer jackets, overcoats, winter fashion, winter style, winter collection 2025" 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/collections/winter`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Winter Collection 2025 | Premium Winter Menswear" />
      <meta 
        property="og:description" 
        content="Discover our premium winter collection featuring luxury sweaters, boots, puffer jackets, and overcoats. Stay warm in style." 
      />
      <meta property="og:image" content={`${config.baseUrl}/winter-collection-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/collections/winter`} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="Winter Collection 2025 | Stay Warm in Style" />
      <meta 
        name="twitter:description" 
        content="Explore our premium winter collection featuring luxury sweaters, boots, puffer jackets, and overcoats." 
      />
      <meta name="twitter:image" content={`${config.baseUrl}/winter-twitter-card.jpg`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(winterCollectionSchema)}
      </script>
    </Helmet>
  );
}