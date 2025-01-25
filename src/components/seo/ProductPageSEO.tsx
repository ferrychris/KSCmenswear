import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface ProductPageSEOProps {
  product: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string;
          width: number;
          height: number;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
    tags: string[];
  };
  reviews?: Array<{
    author: string;
    rating: number;
    content: string;
    date: string;
  }>;
  relatedProducts?: any[];
  breadcrumbs: Array<{
    name: string;
    path: string;
  }>;
}

export function ProductPageSEO({ product, reviews, relatedProducts, breadcrumbs }: ProductPageSEOProps) {
  const images = product.images.edges.map(edge => edge.node);
  const variants = product.variants.edges.map(edge => edge.node);
  const inStock = variants.some(variant => variant.availableForSale);
  const baseUrl = `${config.baseUrl}/products/${product.handle}`;

  // Calculate aggregate rating if reviews exist
  const aggregateRating = reviews?.length ? {
    '@type': 'AggregateRating',
    ratingValue: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    reviewCount: reviews.length,
    bestRating: '5',
    worstRating: '1',
  } : undefined;

  // Generate product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}#product`,
    name: product.title,
    description: product.description,
    image: images.map(img => img.url),
    url: baseUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'KCT Menswear',
    },
    offers: variants.map(variant => ({
      '@type': 'Offer',
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}?variant=${variant.id}`,
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '1',
            maxValue: '3',
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '2',
            maxValue: '5',
            unitCode: 'DAY'
          }
        }
      }
    })),
    ...(aggregateRating && { aggregateRating }),
    ...(reviews?.length && {
      review: reviews.map(review => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1'
        },
        author: {
          '@type': 'Person',
          name: review.author
        },
        datePublished: review.date,
        reviewBody: review.content
      }))
    })
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
        '@id': `${config.baseUrl}${crumb.path}`,
        name: crumb.name,
      },
    })),
  };

  // Generate related products schema
  const relatedProductsSchema = relatedProducts?.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Related Products',
    itemListElement: relatedProducts.map((relatedProduct, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: relatedProduct.title,
        url: `${config.baseUrl}/products/${relatedProduct.handle}`,
        image: relatedProduct.images?.[0],
      },
    })),
  } : undefined;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{`${product.title} | KCT Menswear`}</title>
      <meta name="description" content={product.description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={baseUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.title} />
      <meta property="og:description" content={product.description} />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:site_name" content="KCT Menswear" />
      {images[0] && (
        <>
          <meta property="og:image" content={images[0].url} />
          <meta property="og:image:width" content={String(images[0].width)} />
          <meta property="og:image:height" content={String(images[0].height)} />
          <meta property="og:image:alt" content={images[0].altText || product.title} />
        </>
      )}

      {/* Product Meta Tags */}
      <meta property="product:price:amount" content={product.priceRange.minVariantPrice.amount} />
      <meta property="product:price:currency" content={product.priceRange.minVariantPrice.currencyCode} />
      <meta property="product:availability" content={inStock ? 'in stock' : 'out of stock'} />
      <meta property="product:condition" content="new" />
      <meta property="product:retailer_item_id" content={product.id} />
      <meta property="product:brand" content="KCT Menswear" />
      {product.tags.map(tag => (
        <meta key={tag} property="product:category" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="product" />
      <meta name="twitter:site" content="@kctmenswear" />
      <meta name="twitter:title" content={product.title} />
      <meta name="twitter:description" content={product.description} />
      {images[0] && (
        <meta name="twitter:image" content={images[0].url} />
      )}
      <meta name="twitter:label1" content="Price" />
      <meta name="twitter:data1" content={`$${product.priceRange.minVariantPrice.amount}`} />
      <meta name="twitter:label2" content="Availability" />
      <meta name="twitter:data2" content={inStock ? 'In Stock' : 'Out of Stock'} />

      {/* Pinterest Rich Pins */}
      <meta name="pinterest:price:amount" content={product.priceRange.minVariantPrice.amount} />
      <meta name="pinterest:price:currency" content={product.priceRange.minVariantPrice.currencyCode} />

      {/* Image Optimization Meta Tags */}
      {images.map((image, index) => (
        <link 
          key={index}
          rel={index === 0 ? 'image_src' : 'preload'}
          as="image"
          href={image.url}
          imagesrcset={`${image.url}?width=400 400w, ${image.url}?width=800 800w, ${image.url}?width=1200 1200w`}
          imagesizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
        />
      ))}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {relatedProductsSchema && (
        <script type="application/ld+json">
          {JSON.stringify(relatedProductsSchema)}
        </script>
      )}
    </Helmet>
  );
}