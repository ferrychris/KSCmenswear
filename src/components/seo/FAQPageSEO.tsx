import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQPageSEOProps {
  faqs: FAQItem[];
}

export function FAQPageSEO({ faqs }: FAQPageSEOProps) {
  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  // Help Center Schema
  const helpCenterSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KCT Menswear Help Center',
    url: `${config.baseUrl}/faq`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Support Article Schema
  const supportArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Frequently Asked Questions',
    description: 'Find answers to common questions about KCT Menswear products, services, and policies.',
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${config.baseUrl}/faq`
    },
    articleSection: Array.from(new Set(faqs.map(faq => faq.category)))
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Frequently Asked Questions | KCT Menswear Help Center</title>
      <meta 
        name="description" 
        content="Find answers to common questions about KCT Menswear's products, services, shipping, returns, and alterations. Expert support available 7 days a week." 
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/faq`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="KCT Menswear Help Center - FAQ" />
      <meta 
        property="og:description" 
        content="Get quick answers to common questions about our products, services, and policies. Expert support available 7 days a week." 
      />
      <meta property="og:url" content={`${config.baseUrl}/faq`} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Help Center Meta Tags */}
      <meta name="help-center:type" content="faq" />
      <meta name="help-center:categories" content={Array.from(new Set(faqs.map(faq => faq.category))).join(',')} />
      <meta name="help-center:support-email" content="KCTMenswear@gmail.com" />
      <meta name="help-center:support-phone" content="+12693421234" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(helpCenterSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(supportArticleSchema)}
      </script>
    </Helmet>
  );
}