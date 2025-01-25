import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface LocationsPageSEOProps {
  locations: Array<{
    name: string;
    address: string;
    city: string;
    phone: string;
    hours: Record<string, string>;
  }>;
}

export function LocationsPageSEO({ locations }: LocationsPageSEOProps) {
  // Video Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'KCT Menswear Store Locations',
    description: 'Take a virtual tour of our premium menswear stores in Kalamazoo and Portage. Experience our expert tailoring services and premium suit collections.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
    uploadDate: '2024-03-01',
    contentUrl: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/b7cc2bb414f3883f38f5cb1865f1daa6/manifest/video.m3u8',
    embedUrl: 'https://iframe.cloudflarestream.com/b7cc2bb414f3883f38f5cb1865f1daa6',
    duration: 'PT2M30S',
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`
      }
    }
  };

  // Store Locations Schema
  const storeLocationsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${config.baseUrl}#organization`,
    name: 'KCT Menswear',
    url: config.baseUrl,
    logo: `${config.baseUrl}/logo.png`,
    department: locations.map(location => ({
      '@type': 'ClothingStore',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
        addressLocality: location.city.split(',')[0],
        addressRegion: 'MI',
        postalCode: location.city.split(' ').pop(),
        addressCountry: 'US'
      },
      telephone: location.phone,
      openingHoursSpecification: Object.entries(location.hours).map(([days, hours]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split(' - '),
        opens: hours.split(' - ')[0],
        closes: hours.split(' - ')[1]
      }))
    }))
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Store Locations | KCT Menswear | Kalamazoo & Portage, MI</title>
      <meta 
        name="description" 
        content="Visit KCT Menswear in Kalamazoo and Portage for expert tailoring and premium menswear. Two convenient locations with expert staff ready to serve you." 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/locations`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="KCT Menswear Store Locations" />
      <meta 
        property="og:description" 
        content="Find your nearest KCT Menswear location in Southwest Michigan. Expert tailoring and premium menswear in Kalamazoo and Portage." 
      />
      <meta property="og:url" content={`${config.baseUrl}/locations`} />

      {/* Video Meta Tags */}
      <meta property="og:video" content={videoSchema.contentUrl} />
      <meta property="og:video:secure_url" content={videoSchema.contentUrl} />
      <meta property="og:video:type" content="application/x-mpegURL" />
      <meta property="og:video:width" content="1920" />
      <meta property="og:video:height" content="1080" />

      {/* Local Business Meta Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo, Portage" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(storeLocationsSchema)}
      </script>
    </Helmet>
  );
}