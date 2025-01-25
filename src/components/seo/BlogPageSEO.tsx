import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  url: string;
}

interface BlogPageSEOProps {
  articles: BlogArticle[];
}

export function BlogPageSEO({ articles }: BlogPageSEOProps) {
  // Blog Schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${config.baseUrl}/blog#blog`,
    name: 'KCT Menswear Blog',
    description: 'Expert insights on menswear, style tips, and fashion trends from Southwest Michigan\'s premier menswear destination.',
    url: `${config.baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`
      }
    },
    blogPost: articles.map(article => ({
      '@type': 'BlogPosting',
      '@id': article.url,
      headline: article.title,
      description: article.excerpt,
      image: article.image,
      datePublished: article.date,
      dateModified: article.date,
      author: {
        '@type': 'Organization',
        name: article.author
      },
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
        '@id': article.url
      },
      keywords: article.tags.join(', ')
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
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
          '@id': `${config.baseUrl}/blog`,
          name: 'Blog'
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Style & Substance Blog | KCT Menswear</title>
      <meta 
        name="description" 
        content="Explore expert insights on menswear, style tips, and fashion trends from Southwest Michigan's premier menswear destination. Stay updated with the latest in formal wear and custom tailoring." 
      />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/blog`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Style & Substance Blog | KCT Menswear" />
      <meta 
        property="og:description" 
        content="Expert insights on menswear, style tips, and fashion trends from KCT Menswear." 
      />
      <meta property="og:url" content={`${config.baseUrl}/blog`} />
      <meta property="og:site_name" content="KCT Menswear" />
      {articles[0]?.image && (
        <meta property="og:image" content={articles[0].image} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content="Style & Substance Blog | KCT Menswear" />
      <meta 
        name="twitter:description" 
        content="Expert insights on menswear, style tips, and fashion trends from KCT Menswear." 
      />
      {articles[0]?.image && (
        <meta name="twitter:image" content={articles[0].image} />
      )}

      {/* Article Meta Tags */}
      <meta property="article:publisher" content="https://www.facebook.com/KCTMenswear" />
      {articles.map(article => (
        <meta key={article.id} property="article:tag" content={article.tags.join(', ')} />
      ))}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(blogSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}