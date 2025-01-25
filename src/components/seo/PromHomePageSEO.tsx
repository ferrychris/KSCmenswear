import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function PromHomePageSEO() {
  // Product collection schema for prom attire
  const promCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${config.baseUrl}/prom#webpage`,
    name: 'Prom 2025 Collection | KCT Menswear',
    description: 'Shop our 2025 prom collection featuring designer sparkle blazers, tuxedos, and suits. Nationwide shipping available. Find unique prom looks that will make you stand out.',
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
            '@id': `${config.baseUrl}/prom`,
            name: 'Prom 2025'
          }
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Product',
          name: 'Sparkle Blazer Collection 2025',
          description: 'Stand out with our exclusive collection of sparkle blazers',
          url: `${config.baseUrl}/collections/sparkle-blazers`,
          image: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6',
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: '199.99',
            highPrice: '299.99',
            priceCurrency: 'USD',
            offerCount: '50+'
          }
        },
        {
          '@type': 'Product',
          name: 'Prom Tuxedo Collection 2025',
          description: 'Classic and modern tuxedos for a timeless prom look',
          url: `${config.baseUrl}/collections/prom-tuxedos`,
          image: 'https://images.unsplash.com/photo-1594938298870-9623159c8c99',
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: '249.99',
            highPrice: '399.99',
            priceCurrency: 'USD',
            offerCount: '30+'
          }
        }
      ]
    }
  };

  // E-commerce specific schema
  const ecommerceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${config.baseUrl}#organization`,
    name: 'KCT Menswear',
    url: config.baseUrl,
    logo: `${config.baseUrl}/logo.png`,
    description: 'Premium prom attire retailer offering nationwide shipping. Featuring exclusive sparkle blazers, designer tuxedos, and unique prom suits.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '199.99',
      highPrice: '499.99',
      offerCount: '100+',
      priceValidUntil: '2025-06-30'
    }
  };

  // FAQ Schema for prom-related questions
  const promFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When should I order my prom suit or tuxedo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Order your prom attire at least 2-3 months before your event. This ensures plenty of time for shipping, fitting, and any needed alterations. Rush shipping and expedited service available.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer nationwide shipping for prom attire?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer nationwide shipping on all prom suits, tuxedos, and accessories. Free shipping on orders over $200. Express shipping available for last-minute orders.'
        }
      },
      {
        '@type': 'Question',
        name: 'What makes your sparkle blazers unique?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our sparkle blazers feature premium sequin fabrics, expert tailoring, and unique designs you won\'t find anywhere else. Each blazer is carefully crafted to ensure maximum impact and comfort.'
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Prom 2025 Suits, Tuxedos & Sparkle Blazers | KCT Menswear</title>
      <meta 
        name="description" 
        content="Shop unique prom suits, sparkle blazers, and designer tuxedos for Prom 2025. Nationwide shipping available. Stand out with exclusive styles you won't find anywhere else. Free shipping over $200." 
      />
      <meta 
        name="keywords" 
        content="prom 2025, sparkle blazers, prom tuxedos, unique prom suits, designer prom blazers, prom attire online, sequin prom jackets, nationwide prom suit shipping" 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/prom`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Prom 2025 Collection | Exclusive Sparkle Blazers & Designer Tuxedos" />
      <meta 
        property="og:description" 
        content="Discover unique prom styles for 2025. Shop our exclusive collection of sparkle blazers, designer tuxedos, and statement suits. Nationwide shipping available." 
      />
      <meta property="og:image" content={`${config.baseUrl}/prom-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/prom`} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="Prom 2025 Collection | Stand Out with KCT Menswear" />
      <meta 
        name="twitter:description" 
        content="Shop unique prom styles for 2025. Exclusive sparkle blazers, designer tuxedos, and statement suits with nationwide shipping." 
      />
      <meta name="twitter:image" content={`${config.baseUrl}/prom-twitter-card.jpg`} />

      {/* E-commerce Meta Tags */}
      <meta name="price" content="199.99" />
      <meta name="currency" content="USD" />
      <meta name="availability" content="instock" />
      <meta name="shipping" content="Nationwide shipping available" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="revisit-after" content="1 days" />
      <meta name="target" content="all" />
      <meta name="rating" content="safe for kids" />
      <meta name="format-detection" content="telephone=no" />

      {/* Pinterest Rich Pins */}
      <meta property="og:type" content="product.group" />
      <meta property="product:price:amount" content="199.99" />
      <meta property="product:price:currency" content="USD" />
      <meta property="product:availability" content="instock" />

      {/* Mobile App Tags */}
      <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL" />
      <meta name="google-play-app" content="app-id=package-name" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(promCollectionSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(ecommerceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(promFAQSchema)}
      </script>
    </Helmet>
  );
}