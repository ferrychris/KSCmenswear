import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface ProfilePageSEOProps {
  page: 'measurements' | 'orders' | 'favorites';
  userData?: {
    measurements?: {
      chest?: number;
      waist?: number;
      inseam?: number;
      neck?: number;
      sleeve?: number;
    };
    orders?: Array<{
      id: string;
      date: string;
      total: number;
      status: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
      }>;
    }>;
  };
}

export function ProfilePageSEO({ page, userData }: ProfilePageSEOProps) {
  // Base user profile schema
  const userProfileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${config.baseUrl}/profile/${page}#webpage`,
    name: `My ${page.charAt(0).toUpperCase() + page.slice(1)} | KCT Menswear`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': config.baseUrl,
      name: 'KCT Menswear'
    }
  };

  // Measurements schema
  const measurementsSchema = userData?.measurements ? {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Customer Measurements',
    description: 'Personal body measurements for tailoring and fitting',
    measurementTechnique: 'Professional Tailoring Measurements',
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'Chest',
        value: userData.measurements.chest,
        unitText: 'inches'
      },
      {
        '@type': 'PropertyValue',
        name: 'Waist',
        value: userData.measurements.waist,
        unitText: 'inches'
      },
      {
        '@type': 'PropertyValue',
        name: 'Inseam',
        value: userData.measurements.inseam,
        unitText: 'inches'
      },
      {
        '@type': 'PropertyValue',
        name: 'Neck',
        value: userData.measurements.neck,
        unitText: 'inches'
      },
      {
        '@type': 'PropertyValue',
        name: 'Sleeve',
        value: userData.measurements.sleeve,
        unitText: 'inches'
      }
    ]
  } : undefined;

  // Order history schema
  const orderHistorySchema = userData?.orders ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Order History',
    itemListElement: userData.orders.map((order, index) => ({
      '@type': 'Order',
      orderNumber: order.id,
      orderStatus: order.status,
      orderDate: order.date,
      acceptedOffer: order.items.map(item => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: item.name,
          identifier: item.id
        },
        price: item.price,
        priceCurrency: 'USD',
        quantity: item.quantity
      })),
      totalPrice: {
        '@type': 'PriceSpecification',
        price: order.total,
        priceCurrency: 'USD'
      }
    }))
  } : undefined;

  const titles = {
    measurements: 'My Measurements | KCT Menswear',
    orders: 'Order History | KCT Menswear',
    favorites: 'My Favorites | KCT Menswear'
  };

  const descriptions = {
    measurements: 'View and manage your personal measurements for perfect fitting garments at KCT Menswear.',
    orders: 'Track your order history and view past purchases from KCT Menswear.',
    favorites: 'View your saved items and recently viewed products at KCT Menswear.'
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{titles[page]}</title>
      <meta name="description" content={descriptions[page]} />
      <meta name="robots" content="noindex,nofollow" /> {/* Keep profile pages private */}

      {/* Canonical URL */}
      <link rel="canonical" href={`${config.baseUrl}/profile/${page}`} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={titles[page]} />
      <meta property="og:description" content={descriptions[page]} />
      <meta property="og:url" content={`${config.baseUrl}/profile/${page}`} />
      <meta property="og:site_name" content="KCT Menswear" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(userProfileSchema)}
      </script>

      {page === 'measurements' && measurementsSchema && (
        <script type="application/ld+json">
          {JSON.stringify(measurementsSchema)}
        </script>
      )}

      {page === 'orders' && orderHistorySchema && (
        <script type="application/ld+json">
          {JSON.stringify(orderHistorySchema)}
        </script>
      )}
    </Helmet>
  );
}