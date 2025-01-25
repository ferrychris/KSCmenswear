import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

export function HomePageSEO() {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      { href: '/fonts/playfair-display.woff2', as: 'font', type: 'font/woff2' },
    ];

    preloadLinks.forEach(link => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = link.href;
      preloadLink.as = link.as;
      if (link.type) preloadLink.type = link.type;
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
    });
  }, []);

  // Organization schema with both locations
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${config.baseUrl}#organization`,
    name: 'KCT Menswear',
    alternateName: ['Kalamazoo Custom Tailoring', 'KCT'],
    url: config.baseUrl,
    logo: `${config.baseUrl}/logo.png`,
    description: 'Premium menswear and expert tailoring services in Southwest Michigan since 1983, featuring Kalamazoo Custom Tailoring downtown and KCT Menswear in Portage. Nationwide shipping available.',
    foundingDate: '1983',
    areaServed: [
      {
        '@type': 'State',
        name: 'Michigan',
      },
      {
        '@type': 'Country',
        name: 'United States',
      }
    ],
    department: [
      {
        '@type': 'LocalBusiness',
        name: 'Kalamazoo Custom Tailoring',
        alternateName: 'KCT Menswear Downtown',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '213 S Kalamazoo Mall',
          addressLocality: 'Kalamazoo',
          addressRegion: 'MI',
          postalCode: '49007',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 42.2917,
          longitude: -85.5872,
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
    sameAs: [
      'https://www.facebook.com/KCTMenswear/',
      'https://www.instagram.com/kct_menswear/',
      'https://www.pinterest.com/kctmenswear/',
      'https://x.com/KCTMenswear',
      'https://www.tiktok.com/@kctmenswear',
    ],
    priceRange: '$$',
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>KCT Menswear & Kalamazoo Custom Tailoring | Premium Suits & Expert Alterations</title>
      <meta name="description" content="Visit Kalamazoo Custom Tailoring downtown or KCT Menswear in Portage for premium suits, tuxedos, and expert tailoring. Serving Southwest Michigan since 1983 with nationwide delivery available." />
      <meta name="keywords" content="KCT Menswear, Kalamazoo Custom Tailoring, menswear, suits, tuxedos, tailoring, wedding suits, prom tuxedos, Kalamazoo, Michigan, formal wear, custom alterations, nationwide delivery" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={config.baseUrl} />

      {/* Language */}
      <html lang="en" />
      <meta property="og:locale" content="en_US" />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="KCT Menswear & Kalamazoo Custom Tailoring | Premium Menswear & Expert Alterations" />
      <meta property="og:description" content="Premium menswear and expert tailoring at Kalamazoo Custom Tailoring downtown and KCT Menswear in Portage. Visit our stores or shop online with nationwide delivery." />
      <meta property="og:image" content={`${config.baseUrl}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={config.baseUrl} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="KCT Menswear & Kalamazoo Custom Tailoring | Premium Menswear & Expert Alterations" />
      <meta name="twitter:description" content="Premium menswear and expert tailoring in Southwest Michigan. Visit Kalamazoo Custom Tailoring downtown or KCT Menswear in Portage." />
      <meta name="twitter:image" content={`${config.baseUrl}/twitter-card.jpg`} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Geo Tags for Both Locations */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Voice Search Optimization */}
      <meta name="keywords" content="where to buy suits near me, best tailor near me, Kalamazoo Custom Tailoring, KCT Menswear locations, wedding suit alterations, prom tuxedo rental, men's formal wear store, custom suit fitting" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}