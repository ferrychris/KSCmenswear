import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface BlogPostSEOProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    tags: string[];
  };
}

export function BlogPostSEO({ post }: BlogPostSEOProps) {
  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: config.baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`
      }
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${config.baseUrl}/blog`
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    articleBody: post.content.replace(/<[^>]*>/g, ''), // Strip HTML tags
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
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'WebPage',
          '@id': window.location.href,
          name: post.title
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{post.title} | KCT Menswear Blog</title>
      <meta name="description" content={post.excerpt} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.image} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content="KCT Menswear" />
      <meta property="article:published_time" content={post.date} />
      <meta property="article:modified_time" content={post.date} />
      <meta property="article:author" content={post.author} />
      {post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:image" content={post.image} />
      <meta name="twitter:label1" content="Written by" />
      <meta name="twitter:data1" content={post.author} />
      <meta name="twitter:label2" content="Reading time" />
      <meta name="twitter:data2" content={post.readTime} />

      {/* Article Meta Tags */}
      <meta property="article:published_time" content={post.date} />
      <meta property="article:modified_time" content={post.date} />
      <meta property="article:author" content={post.author} />
      <meta property="article:section" content={post.category} />
      {post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}