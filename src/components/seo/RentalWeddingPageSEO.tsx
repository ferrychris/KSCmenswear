import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function RentalWeddingPageSEO() {
  // Local business schema focused on wedding rentals
  const weddingRentalSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.baseUrl}/rental/wedding#localbusiness`,
    name: 'KCT Menswear Wedding Rentals',
    description: 'Premium wedding suit and tuxedo rentals in Kalamazoo and Portage. Expert fitting and alterations included. Group wedding services available.',
    url: `${config.baseUrl}/rental/wedding`,
    telephone: ['+12693421234', '+12693238070'],
    image: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0',
    ],
    priceRange: '$$',
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 42.2917,
        longitude: -85.5872,
      },
      geoRadius: '50000', // 50km radius
    },
    department: [
      {
        '@type': 'LocalBusiness',
        name: 'KCT Menswear Downtown Wedding Department',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '213 S Kalamazoo Mall',
          addressLocality: 'Kalamazoo',
          addressRegion: 'MI',
          postalCode: '49007',
          addressCountry: 'US',
        },
        telephone: '+12693421234',
      },
      {
        '@type': 'LocalBusiness',
        name: 'KCT Menswear Portage Wedding Department',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '6650 S Westnedge Ave',
          addressLocality: 'Portage',
          addressRegion: 'MI',
          postalCode: '49024',
          addressCountry: 'US',
        },
        telephone: '+12693238070',
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Tuxedo Rental',
          description: 'Premium tuxedo rentals for weddings with expert fitting',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Group Wedding Services',
          description: 'Coordinated wedding party rentals and fittings',
        },
      },
    ],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Wedding Suit & Tuxedo Rentals | KCT Menswear | Kalamazoo & Portage</title>
      <meta name="description" content="Premium wedding suit and tuxedo rentals in Kalamazoo and Portage. Expert fitting and alterations included. Group wedding services available. Schedule your consultation today!" />
      <meta name="keywords" content="wedding tuxedo rental near me, wedding suit rental, groomsmen suits, wedding party rentals, Kalamazoo wedding attire, Portage tuxedo rental, group wedding rentals" />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/rental/wedding`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="business.service" />
      <meta property="og:title" content="Wedding Suit & Tuxedo Rentals | KCT Menswear" />
      <meta property="og:description" content="Premium wedding suit and tuxedo rentals with expert fitting in Kalamazoo and Portage. Group wedding services available." />
      <meta property="og:image" content={`${config.baseUrl}/wedding-rental-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/rental/wedding`} />
      <meta property="business:contact_data:street_address" content="213 S Kalamazoo Mall" />
      <meta property="business:contact_data:locality" content="Kalamazoo" />
      <meta property="business:contact_data:region" content="MI" />
      <meta property="business:contact_data:postal_code" content="49007" />
      <meta property="business:contact_data:country_name" content="USA" />

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(weddingRentalSchema)}
      </script>

      {/* Local SEO Meta Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Voice Search Optimization */}
      <meta name="keywords" content="where to rent a tuxedo near me, wedding suit rental prices, how to rent suits for wedding party, best tuxedo rental near me, wedding attire rental" />
    </Helmet>
  );
}