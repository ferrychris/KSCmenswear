# Ad Tracking Implementation Plan

## 1. Shopify Integration Setup

### Facebook/Instagram Shop
```ts
// src/lib/shopify/pixel.ts
export const initFacebookPixel = () => {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', process.env.VITE_FB_PIXEL_ID);
  fbq('track', 'PageView');
};

export const trackFacebookEvent = (eventName: string, data?: any) => {
  if (window.fbq) {
    fbq('track', eventName, data);
  }
};
```

### Google Analytics/Ads
```ts
// src/lib/analytics/google.ts
export const initGoogleAnalytics = () => {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', process.env.VITE_GA_TRACKING_ID);
  gtag('config', process.env.VITE_GOOGLE_ADS_ID);
};

export const trackGoogleEvent = (
  eventName: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (window.gtag) {
    gtag('event', eventName, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};
```

## 2. Event Tracking Implementation

### Product Events
```ts
// src/lib/tracking/events.ts
export const trackProductView = (product: Product) => {
  // Facebook
  trackFacebookEvent('ViewContent', {
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'USD'
  });

  // Google
  trackGoogleEvent('view_item', 'Products', product.name, product.price);
};

export const trackAddToCart = (product: Product, quantity: number) => {
  // Facebook
  trackFacebookEvent('AddToCart', {
    content_ids: [product.id],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'USD'
  });

  // Google
  trackGoogleEvent('add_to_cart', 'Cart', product.name, product.price * quantity);
};

export const trackPurchase = (order: Order) => {
  // Facebook
  trackFacebookEvent('Purchase', {
    content_ids: order.items.map(item => item.id),
    content_type: 'product',
    value: order.total,
    currency: 'USD'
  });

  // Google
  trackGoogleEvent('purchase', 'Checkout', undefined, order.total);
};
```

## 3. Cookie Consent & Privacy

```ts
// src/lib/privacy/consent.ts
export const initCookieConsent = () => {
  return {
    showBanner: true,
    preferences: {
      analytics: false,
      marketing: false
    },
    updateConsent(type: 'analytics' | 'marketing', value: boolean) {
      this.preferences[type] = value;
      if (type === 'analytics' && value) {
        initGoogleAnalytics();
      }
      if (type === 'marketing' && value) {
        initFacebookPixel();
      }
    }
  };
};
```

## 4. Performance Optimization

```ts
// src/lib/tracking/loader.ts
export const loadTrackingScripts = () => {
  // Load scripts based on user consent and route
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return;

  const { analytics, marketing } = JSON.parse(consent);

  if (analytics) {
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + process.env.VITE_GA_TRACKING_ID);
    initGoogleAnalytics();
  }

  if (marketing) {
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    initFacebookPixel();
  }
};

const loadScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
};
```

## 5. Integration Testing

```ts
// src/test/tracking.test.ts
describe('Tracking Integration', () => {
  beforeEach(() => {
    window.fbq = jest.fn();
    window.gtag = jest.fn();
  });

  it('should track product views', () => {
    const product = {
      id: '123',
      name: 'Test Product',
      price: 99.99
    };

    trackProductView(product);

    expect(window.fbq).toHaveBeenCalledWith('track', 'ViewContent', expect.any(Object));
    expect(window.gtag).toHaveBeenCalledWith('event', 'view_item', expect.any(Object));
  });

  // Add more tests for other tracking events
});
```

## Implementation Steps

1. Environment Setup
   - Add tracking IDs to `.env`:
     ```
     VITE_FB_PIXEL_ID=your_pixel_id
     VITE_GA_TRACKING_ID=your_ga_id
     VITE_GOOGLE_ADS_ID=your_ads_id
     ```

2. Cookie Consent
   - Implement consent banner
   - Store user preferences
   - Only load tracking after consent

3. Event Implementation
   - Add tracking to product views
   - Implement cart tracking
   - Add checkout step tracking
   - Track successful purchases

4. Testing & Validation
   - Test in development environment
   - Verify data in analytics dashboards
   - Check for performance impact
   - Validate conversion tracking

5. Documentation
   - Document all tracked events
   - Record conversion setup
   - Note custom audience configurations

## Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test cookie consent functionality
- [ ] Validate tracking events in test environment
- [ ] Check performance metrics
- [ ] Verify GDPR/CCPA compliance
- [ ] Test cross-device tracking
- [ ] Document implementation details