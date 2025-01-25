import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

interface AboutPageSEOProps {
  timeline: TimelineEvent[];
  teamMembers?: TeamMember[];
}

export function AboutPageSEO({ timeline, teamMembers }: AboutPageSEOProps) {
  // Company Schema
  const companySchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${config.baseUrl}#organization`,
    name: 'KCT Menswear',
    alternateName: ['Kalamazoo Custom Tailoring', 'KCT'],
    foundingDate: '1983',
    founder: {
      '@type': 'Person',
      name: 'KCT Founder'
    },
    description: 'Premium menswear retailer and custom tailoring service serving Southwest Michigan since 1983.',
    slogan: 'Tailored Perfection Since 1983',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '15+'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '213 S Kalamazoo Mall',
      addressLocality: 'Kalamazoo',
      addressRegion: 'MI',
      postalCode: '49007',
      addressCountry: 'US'
    },
    url: config.baseUrl,
    telephone: '+12693421234',
    email: 'KCTMenswear@gmail.com',
    sameAs: [
      'https://www.facebook.com/KCTMenswear',
      'https://www.instagram.com/kct_menswear',
      'https://twitter.com/kctmenswear',
      'https://www.linkedin.com/company/kct-menswear',
      'https://www.pinterest.com/kctmenswear'
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 42.2917,
        longitude: -85.5872
      },
      geoRadius: '75000'
    }
  };

  // Timeline Schema
  const timelineSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'KCT Menswear History Timeline',
    itemListElement: timeline.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Event',
        name: event.title,
        description: event.description,
        startDate: `${event.year}-01-01`,
        location: {
          '@type': 'Place',
          name: 'KCT Menswear',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kalamazoo',
            addressRegion: 'MI',
            addressCountry: 'US'
          }
        }
      }
    }))
  };

  // Team Members Schema
  const teamSchema = teamMembers?.length ? {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${config.baseUrl}/about#team`,
    member: teamMembers.map(member => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      image: member.image,
      description: member.bio,
      worksFor: {
        '@type': 'Organization',
        name: 'KCT Menswear'
      }
    }))
  } : undefined;

  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.baseUrl}/about#localbusiness`,
    name: 'KCT Menswear',
    image: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0'
    ],
    '@graph': [
      {
        '@type': 'ClothingStore',
        name: 'KCT Menswear Downtown',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '213 S Kalamazoo Mall',
          addressLocality: 'Kalamazoo',
          addressRegion: 'MI',
          postalCode: '49007',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 42.2917,
          longitude: -85.5872
        },
        telephone: '+12693421234',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '18:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '16:00'
          }
        ]
      },
      {
        '@type': 'ClothingStore',
        name: 'KCT Menswear Portage',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '6650 S Westnedge Ave',
          addressLocality: 'Portage',
          addressRegion: 'MI',
          postalCode: '49024',
          addressCountry: 'US'
        },
        telephone: '+12693238070',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '11:00',
            closes: '20:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '12:00',
            closes: '18:00'
          }
        ]
      }
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
    currenciesAccepted: 'USD'
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>About KCT Menswear | Premium Menswear & Expert Tailoring Since 1983</title>
      <meta 
        name="description" 
        content="Discover the KCT Menswear story - serving Southwest Michigan with premium menswear and expert tailoring since 1983. Two convenient locations in Kalamazoo and Portage." 
      />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/about`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="About KCT Menswear | Our Story Since 1983" />
      <meta 
        property="og:description" 
        content="From humble beginnings to Southwest Michigan's premier menswear destination. Discover the KCT Menswear story of quality, service, and expertise." 
      />
      <meta property="og:url" content={`${config.baseUrl}/about`} />
      <meta property="og:image" content={`${config.baseUrl}/about-og.jpg`} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="About KCT Menswear | Our Story Since 1983" />
      <meta 
        name="twitter:description" 
        content="From humble beginnings to Southwest Michigan's premier menswear destination. Discover the KCT Menswear story." 
      />
      <meta name="twitter:image" content={`${config.baseUrl}/about-twitter-card.jpg`} />

      {/* Local Business Meta Tags */}
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Kalamazoo" />
      <meta name="geo.position" content="42.2917;-85.5872" />
      <meta name="ICBM" content="42.2917, -85.5872" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(companySchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(timelineSchema)}
      </script>
      {teamSchema && (
        <script type="application/ld+json">
          {JSON.stringify(teamSchema)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
}