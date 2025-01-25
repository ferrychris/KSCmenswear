import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function RentalPageSEO() {
  // Local business schema focused on rental services
  const rentalSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.baseUrl}/rental#localbusiness`,
    name: 'KCT Menswear Rentals',
    alternateName: ['Kalamazoo Custom Tailoring', 'KCT'],
    description: 'Premium suit and tuxedo rentals for weddings in Kalamazoo, Portage, and Southwest Michigan. Expert fittings, group discounts, and accessories included. Serving the community since 1983.',
    url: `${config.baseUrl}/rental`,
    telephone: ['+12693421234', '+12693238070'],
    image: [
      'https://example.com/images/wedding-suit-rental-kalamazoo.jpg',
      'https://example.com/images/group-suit-rentals-portage.jpg',
    ],
    priceRange: '$$',
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
          '@type': 'Service',
          name: 'Wedding Tuxedo Rental',
          description: 'Premium tuxedo rentals for weddings with expert fitting and alterations included.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Prom Tuxedo Rental',
          description: 'Stylish tuxedo and suit rentals for prom with professional fitting services.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Group Wedding Rentals',
          description: 'Coordinated wedding party rentals with group fittings and discounts.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Accessories Rental',
          description: 'Coordinated rental accessories like ties, vests, shoes, and pocket squares for wedding parties.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Same Day Alterations',
          description: 'Rush alterations service available for rental garments.',
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '250',
    },
    review: [
      {
        '@type': 'Review',
        author: 'John Doe',
        datePublished: '2024-10-05',
        reviewBody: 'KCT Menswear made our wedding day stress-free. The suits fit perfectly, and the group fitting was seamless!',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
      },
      {
        '@type': 'Review',
        author: 'Emily Smith',
        datePublished: '2024-11-15',
        reviewBody: 'Great experience! The tuxedos looked amazing, and the service was exceptional.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '4.8',
          bestRating: '5',
        },
      },
    ],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Wedding Suit & Tuxedo Rentals | KCT Menswear</title>
      <meta 
        name="description" 
        content="Find premium wedding suit and tuxedo rentals in Kalamazoo, Portage, and Southwest Michigan. Expert fittings, group discounts, and accessories included. Perfect for grooms, groomsmen, and wedding parties." 
      />
      <meta 
        name="keywords" 
        content="wedding tuxedo rental Kalamazoo, wedding suit rental near me, tuxedo rental Portage, rent suits for wedding groomsmen, group wedding rentals, tuxedo rental Southwest Michigan" 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/rental`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="business.service" />
      <meta property="og:title" content="Wedding Suit & Tuxedo Rentals | KCT Menswear" />
      <meta 
        property="og:description" 
        content="Find premium wedding suit and tuxedo rentals with expert fittings and group discounts in Kalamazoo, Portage, and Southwest Michigan." 
      />
      <meta property="og:image" content={`${config.baseUrl}/rental-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/rental`} />
      <meta property="business:contact_data:street_address" content="213 S Kalamazoo Mall" />
      <meta property="business:contact_data:locality" content="Kalamazoo" />
      <meta property="business:contact_data:region" content="MI" />
      <meta property="business:contact_data:postal_code" content="49007" />
      <meta property="business:contact_data:country_name" content="USA" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="Wedding Suit & Tuxedo Rentals | KCT Menswear" />
      <meta 
        name="twitter:description" 
        content="Find premium wedding suit and tuxedo rentals with expert fittings and group discounts in Kalamazoo, Portage, and Southwest Michigan." 
      />
      <meta name="twitter:image" content={`${config.baseUrl}/rental-twitter-card.jpg`} />

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(rentalSchema)}
      </script>

      {/* Local SEO Meta Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage, Southwest Michigan" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Voice Search Optimization */}
      <meta 
        name="keywords" 
        content="where to rent a tuxedo near me, wedding tuxedo rental prices, group wedding rentals Kalamazoo, rent groomsmen suits Portage, same day tuxedo rental Southwest Michigan" 
      />
    </Helmet>
  );
}
