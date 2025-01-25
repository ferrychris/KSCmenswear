import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function AlterationsPageSEO() {
  // Local business schema focused on alterations services for men and women
  const alterationsSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.baseUrl}/alterations#localbusiness`,
    name: 'KCT Menswear & Alterations',
    alternateName: ['Kalamazoo Custom Tailoring', 'KCT'],
    description: 'Expert alterations for men and women in Kalamazoo, Portage, and Southwest Michigan. Professional tailoring for suits, tuxedos, bridal and wedding dresses, prom gowns, and more.',
    url: `${config.baseUrl}/alterations`,
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
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Suit Alterations',
          description: 'Professional suit alterations and tailoring services for formalwear and business attire.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Alterations',
          description: 'Expert tailoring for wedding suits, tuxedos, and bridal party outfits.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Bridal Dress Alterations',
          description: 'Tailoring and alterations for bridal and wedding dresses.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Prom Dress Alterations',
          description: 'Custom alterations for prom and evening gowns.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Same-Day Alterations',
          description: 'Rush alterations service available for last-minute tailoring needs.',
        },
      },
    ],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Expert Suit & Dress Alterations | Kalamazoo Custom Tailoring & KCT Menswear</title>
      <meta
        name="description"
        content="Professional alterations for men and women in Kalamazoo, Portage, and Southwest Michigan. Tailoring for suits, tuxedos, bridal and wedding dresses, prom gowns, and more."
      />
      <meta
        name="keywords"
        content="suit alterations Kalamazoo, wedding dress alterations Portage, prom dress tailoring near me, tuxedo alterations Southwest Michigan, bridal alterations, women's clothing alterations"
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/alterations`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="business.service" />
      <meta property="og:title" content="Expert Suit & Dress Alterations | Kalamazoo Custom Tailoring & KCT Menswear" />
      <meta
        property="og:description"
        content="Professional alterations for suits, tuxedos, bridal and wedding dresses, prom gowns, and other women's clothing in Southwest Michigan."
      />
      <meta property="og:image" content={`${config.baseUrl}/alterations-og.jpg`} />
      <meta property="og:url" content={`${config.baseUrl}/alterations`} />

      {/* Local Business Schema */}
      <script type="application/ld+json">{JSON.stringify(alterationsSchema)}</script>

      {/* Local SEO Meta Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage, Southwest Michigan" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Voice Search Optimization */}
      <meta
        name="keywords"
        content="where to get suit alterations near me, Kalamazoo Custom Tailoring, bridal dress tailoring, prom dress alterations, tuxedo tailoring Southwest Michigan, same-day alterations Kalamazoo"
      />
    </Helmet>
  );
}
