import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface PolicyPageSEOProps {
  type: 'privacy' | 'terms' | 'policies';
  lastUpdated: string;
}

export function PolicyPageSEO({ type, lastUpdated }: PolicyPageSEOProps) {
  // Legal Document Schema
  const legalDocumentSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalDocument',
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Policy - KCT Menswear`,
    datePublished: lastUpdated,
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      url: config.baseUrl
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'KCT Menswear',
      url: config.baseUrl
    }
  };

  // Organization Reference Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${config.baseUrl}#organization`,
    name: 'KCT Menswear',
    url: config.baseUrl,
    logo: `${config.baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+12693421234',
      contactType: 'customer service',
      email: 'KCTMenswear@gmail.com',
      areaServed: 'US',
      availableLanguage: 'English'
    }
  };

  // Document Metadata Schema
  const documentMetadataSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${config.baseUrl}/${type}#webpage`,
    url: `${config.baseUrl}/${type}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Policy`,
    dateModified: lastUpdated,
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`
      }
    },
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${config.baseUrl}#website`,
      url: config.baseUrl,
      name: 'KCT Menswear',
      description: 'Premium menswear and expert tailoring services'
    }
  };

  const titles = {
    privacy: 'Privacy Policy | KCT Menswear',
    terms: 'Terms of Service | KCT Menswear',
    policies: 'Policies | KCT Menswear'
  };

  const descriptions = {
    privacy: 'Learn how KCT Menswear collects, uses, and protects your personal information. Our privacy policy ensures transparency and security in all our operations.',
    terms: 'Read our terms of service for information about your rights and responsibilities when using KCT Menswear services and purchasing our products.',
    policies: 'View all KCT Menswear policies including shipping, returns, alterations, and more. Clear guidelines for a seamless shopping experience.'
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{titles[type]}</title>
      <meta name="description" content={descriptions[type]} />
      <meta name="last-modified" content={lastUpdated} />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/${type}`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={titles[type]} />
      <meta property="og:description" content={descriptions[type]} />
      <meta property="og:url" content={`${config.baseUrl}/${type}`} />

      {/* Document Meta Tags */}
      <meta name="dc.title" content={titles[type]} />
      <meta name="dc.description" content={descriptions[type]} />
      <meta name="dc.date.modified" content={lastUpdated} />
      <meta name="dc.publisher" content="KCT Menswear" />
      <meta name="dc.format" content="text/html" />
      <meta name="dc.language" content="en-US" />
      <meta name="dc.rights" content="Copyright © 2024 KCT Menswear. All rights reserved." />

      {/* Legal Document Meta Tags */}
      <meta name="document:type" content="legal" />
      <meta name="document:version" content={lastUpdated} />
      <meta name="document:category" content={type} />
      <meta name="document:jurisdiction" content="US" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(legalDocumentSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(documentMetadataSchema)}
      </script>
    </Helmet>
  );
}