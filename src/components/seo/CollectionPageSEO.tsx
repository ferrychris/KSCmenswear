import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface CollectionPageSEOProps {
  title: string;
  description: string;
  products: any[];
  breadcrumbs: Array<{
    name: string;
    path: string;
  }>;
  filters?: {
    colors?: string[];
    sizes?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
  sorting?: string;
}

export function CollectionPageSEO({
  title,
  description,
  products,
  breadcrumbs,
  filters,
  sorting,
}: CollectionPageSEOProps) {
  // Ensure we have a valid base URL from config
  const baseUrl = config.baseUrl || 'https://kctmenswear.com';
  
  // Generate canonical URL based on base path without filters
  const canonicalPath = breadcrumbs[breadcrumbs.length - 1].path;
  const canonicalUrl = new URL(canonicalPath, baseUrl).toString();
  
  // Generate current URL with any sorting parameters
  const currentUrl = new URL(canonicalPath, baseUrl);
  if (sorting && sorting !== 'default') {
    currentUrl.searchParams.set('sort', sorting);
  }

  // Generate product list schema
  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images?.[0],
        url: new URL(`/products/${product.handle}`, baseUrl).toString(),
        offers: {
          '@type': 'Offer',
          price: product.priceRange?.minVariantPrice?.amount,
          priceCurrency: 'USD',
          availability: product.availableForSale 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebPage',
        '@id': new URL(crumb.path, baseUrl).toString(),
        name: crumb.name,
      },
    })),
  };

  // Generate collection schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#webpage`,
    name: title,
    description: description,
    url: currentUrl.toString(),
    numberOfItems: products.length,
    hasPart: products.map(product => ({
      '@type': 'Product',
      name: product.title,
      url: new URL(`/products/${product.handle}`, baseUrl).toString(),
    })),
  };

  // Build meta description with active filters
  let metaDescription = description;
  if (filters) {
    const filterDescriptions = [];
    if (filters.colors?.length) {
      filterDescriptions.push(`Available in ${filters.colors.join(', ')}`);
    }
    if (filters.priceRange) {
      filterDescriptions.push(`Priced from $${filters.priceRange.min} to $${filters.priceRange.max}`);
    }
    if (filterDescriptions.length) {
      metaDescription += ` ${filterDescriptions.join('. ')}.`;
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | KCT Menswear</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={
        filters || sorting 
          ? 'noindex, follow' 
          : 'index, follow'
      } />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Pagination and View Links */}
      {filters && (
        <>
          <link rel="prev" href={canonicalUrl} />
          <meta name="robots" content="noindex, follow" />
        </>
      )}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl.toString()} />
      {products[0]?.images?.[0] && (
        <meta property="og:image" content={products[0].images[0]} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {products[0]?.images?.[0] && (
        <meta name="twitter:image" content={products[0].images[0]} />
      )}

      {/* E-commerce Meta Tags */}
      {products.length > 0 && (
        <>
          <meta name="product:availability" content="in stock" />
          <meta name="product:price:amount" content={products[0].priceRange?.minVariantPrice?.amount} />
          <meta name="product:price:currency" content="USD" />
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(productListSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(collectionSchema)}
      </script>
    </Helmet>
  );
}