import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function WeddingHomePageSEO() {
  // Wedding collection schema with seasonal collections
  const weddingCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${config.baseUrl}/wedding#webpage`,
    name: 'Wedding 2025 Collection | KCT Menswear',
    description: 'Discover our 2025 wedding collection featuring premium suits and tuxedos for grooms and wedding parties. Expert tailoring and personalized styling services available.',
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
            '@id': `${config.baseUrl}/wedding`,
            name: 'Wedding 2025'
          }
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Product',
          name: 'Rustic Wedding Collection 2025',
          description: 'Timeless charm and natural elegance for outdoor and rustic wedding celebrations',
          url: `${config.baseUrl}/collections/rustic-wedding`,
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
        },
        {
          '@type': 'Product',
          name: 'Modern Wedding Collection 2025',
          description: 'Contemporary style for the bold couple',
          url: `${config.baseUrl}/collections/modern-wedding`,
          image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0',
        },
        {
          '@type': 'Product',
          name: 'Summer Wedding Collection 2025',
          description: 'Light and breezy for warm celebrations',
          url: `${config.baseUrl}/collections/summer-wedding`,
          image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c',
        },
        {
          '@type': 'Product',
          name: 'Fall Wedding Collection 2025',
          description: 'Rich colors for autumn ceremonies',
          url: `${config.baseUrl}/collections/fall-wedding`,
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
        }
      ]
    }
  };

  // Service schema for wedding services
  const weddingServicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${config.baseUrl}/wedding#service`,
    name: 'Wedding Suit and Tuxedo Services',
    provider: {
      '@type': 'LocalBusiness',
      name: 'KCT Menswear',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '213 S Kalamazoo Mall',
        addressLocality: 'Kalamazoo',
        addressRegion: 'MI',
        postalCode: '49007',
        addressCountry: 'US'
      }
    },
    areaServed: [
      {
        '@type': 'State',
        name: 'Michigan'
      },
      {
        '@type': 'City',
        name: 'Kalamazoo'
      },
      {
        '@type': 'City',
        name: 'Portage'
      }
    ],
    offers: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Party Coordination',
          description: 'Complete wedding party outfitting and coordination services'
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '199.99',
          priceCurrency: 'USD'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Wedding Suit Tailoring',
          description: 'Expert tailoring services for the perfect fit'
        }
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '312',
      bestRating: '5',
      worstRating: '1'
    }
  };

  // FAQ Schema for wedding-related questions
  const weddingFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How far in advance should I schedule wedding suit fittings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend scheduling initial fittings 3-4 months before your wedding date. This allows time for alterations and ensures the perfect fit for your entire wedding party.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer group discounts for wedding parties?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer special package pricing for wedding parties of 4 or more. The groom\'s suit is complimentary with a qualifying wedding party purchase.'
        }
      },
      {
        '@type': 'Question',
        name: 'What wedding suit styles are trending for 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For 2025, we\'re seeing trends in textured fabrics, earth tones for rustic weddings, and modern slim fits in rich blues and greys. Sustainable materials and personalized details are also popular choices.'
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Wedding Suits & Tuxedos 2025 | KCT Menswear | Expert Wedding Attire</title>
      <meta 
        name="description" 
        content="Discover our 2025 wedding collection. Premium suits and tuxedos for grooms and wedding parties. Expert tailoring, group coordination, and personalized styling services in Kalamazoo and Portage, MI." 
      />
      <meta 
        name="keywords" 
        content="wedding suits 2025, groom tuxedos, wedding party attire, groomsmen suits, wedding tailoring, Kalamazoo wedding suits, Michigan wedding attire, wedding suit rental, custom wedding suits" 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/wedding`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Wedding Collection 2025 | KCT Menswear" />
      <meta 
        property="og:description" 
        content="Create your perfect wedding look with KCT Menswear's 2025 collection. Expert tailoring and personalized styling for grooms and wedding parties." 
      />
      <meta property="og:image" content={`${config.baseUrl}/wedding-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/wedding`} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="Wedding Collection 2025 | KCT Menswear" />
      <meta 
        name="twitter:description" 
        content="Discover our 2025 wedding collection featuring premium suits and tuxedos. Expert tailoring and personalized styling services available." 
      />
      <meta name="twitter:image" content={`${config.baseUrl}/wedding-twitter-card.jpg`} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Local Business Tags */}
      <meta property="business:contact_data:street_address" content="213 S Kalamazoo Mall" />
      <meta property="business:contact_data:locality" content="Kalamazoo" />
      <meta property="business:contact_data:region" content="MI" />
      <meta property="business:contact_data:postal_code" content="49007" />
      <meta property="business:contact_data:country_name" content="USA" />

      {/* Geo Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Voice Search Optimization */}
      <meta 
        name="keywords" 
        content="where to buy wedding suits near me, best wedding tuxedo shop Kalamazoo, wedding suit rental Michigan, groomsmen suit fitting, wedding attire consultation" 
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(weddingCollectionSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(weddingServicesSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(weddingFAQSchema)}
      </script>
    </Helmet>
  );
}