import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function PurchasingPageSEO() {
  // Local business schema focused on wedding suit purchasing
  const purchasingSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.baseUrl}/purchasing#localbusiness`,
    name: 'KCT Menswear Wedding Suits',
    alternateName: ['Kalamazoo Custom Tailoring', 'KCT'],
    description: 'Custom wedding suits and tuxedos for purchase in Kalamazoo, Portage, and Southwest Michigan. Tailored to perfection with expert fittings, personalization options, and budget-friendly packages starting at $199.99.',
    url: `${config.baseUrl}/purchasing`,
    telephone: ['+12693421234', '+12693238070'],
    image: [
      'https://example.com/images/wedding-suit-purchasing-kalamazoo.jpg',
      'https://example.com/images/custom-suit-portage.jpg',
    ],
    priceRange: '$$$',
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 42.2917,
        longitude: -85.5872,
      },
      geoRadius: '75000', // 75km radius
    },
    department: [
      {
        '@type': 'LocalBusiness',
        name: 'Kalamazoo Custom Tailoring',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '213 S Kalamazoo Mall',
          addressLocality: 'Kalamazoo',
          addressRegion: 'MI',
          postalCode: '49007',
          addressCountry: 'US',
        },
        telephone: '+12693421234',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '16:00',
          },
        ],
      },
      {
        '@type': 'LocalBusiness',
        name: 'KCT Menswear Portage',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '6650 S Westnedge Ave',
          addressLocality: 'Portage',
          addressRegion: 'MI',
          postalCode: '49024',
          addressCountry: 'US',
        },
        telephone: '+12693238070',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '11:00',
            closes: '20:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '12:00',
            closes: '18:00',
          },
        ],
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Custom Wedding Suits',
          description: 'Tailored wedding suits for grooms and groomsmen with full customization options.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Luxury Tuxedos',
          description: 'Premium tuxedos for weddings, tailored to fit perfectly.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Suit, Shirt, and Tie Packages',
          description: 'Affordable packages starting at $199.99, including a suit, shirt, and tie. Available in three tiers: $199.99, $229.99, and $249.99.',
          price: {
            '@type': 'PriceSpecification',
            priceCurrency: 'USD',
            price: '199.99',
          },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Personalized Suit Fittings',
          description: 'Expert fittings to ensure your suit is perfect for your big day.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Party Packages',
          description: 'Special packages for grooms and groomsmen, including group fittings and discounts.',
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '320',
    },
    review: [
      {
        '@type': 'Review',
        author: 'Michael Taylor',
        datePublished: '2024-10-15',
        reviewBody: 'The custom suit I purchased for my wedding was absolutely perfect. The team at KCT Menswear exceeded my expectations!',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
      },
      {
        '@type': 'Review',
        author: 'Sarah Johnson',
        datePublished: '2024-11-20',
        reviewBody: 'We got suits for the entire wedding party, and they all fit like a dream. Amazing service and quality!',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '4.9',
          bestRating: '5',
        },
      },
    ],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Custom Wedding Suits for Purchase | KCT Menswear</title>
      <meta 
        name="description" 
        content="Discover custom wedding suits and tuxedos for purchase in Kalamazoo, Portage, and Southwest Michigan. Tailored perfection for grooms and wedding parties, with affordable suit packages starting at $199.99." 
      />
      <meta 
        name="keywords" 
        content="custom wedding suits Kalamazoo, buy wedding tuxedo Portage, tailored wedding suits Southwest Michigan, suit shirt tie package $199, affordable wedding suits near me" 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/purchasing`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="business.service" />
      <meta property="og:title" content="Custom Wedding Suits for Purchase | KCT Menswear" />
      <meta 
        property="og:description" 
        content="Discover custom wedding suits and tuxedos for purchase in Kalamazoo, Portage, and Southwest Michigan. Tailored perfection for grooms and wedding parties, with affordable suit packages starting at $199.99." 
      />
      <meta property="og:image" content={`${config.baseUrl}/purchasing-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/purchasing`} />
      <meta property="business:contact_data:street_address" content="213 S Kalamazoo Mall" />
      <meta property="business:contact_data:locality" content="Kalamazoo" />
      <meta property="business:contact_data:region" content="MI" />
      <meta property="business:contact_data:postal_code" content="49007" />
      <meta property="business:contact_data:country_name" content="USA" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="Custom Wedding Suits for Purchase | KCT Menswear" />
      <meta 
        name="twitter:description" 
        content="Discover custom wedding suits and tuxedos for purchase in Kalamazoo, Portage, and Southwest Michigan. Tailored perfection for grooms and wedding parties, with affordable suit packages starting at $199.99." 
      />
      <meta name="twitter:image" content={`${config.baseUrl}/purchasing-twitter-card.jpg`} />

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(purchasingSchema)}
      </script>

      {/* Local SEO Meta Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage, Southwest Michigan" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Voice Search Optimization */}
      <meta 
        name="keywords" 
        content="where to buy a wedding suit near me, custom wedding tuxedo Kalamazoo, groomsmen suits Portage, wedding suit shop Southwest Michigan, suit shirt tie package $199" 
      />
    </Helmet>
  );
}
