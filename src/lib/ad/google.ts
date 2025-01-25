import { performanceMonitor } from '../performance/monitor';

export class GoogleAds {
  private static instance: GoogleAds;
  private initialized: boolean = false;
  private conversionId: string = '';
  private remarketingId: string = '';

  private constructor() {}

  static getInstance(): GoogleAds {
    if (!GoogleAds.instance) {
      GoogleAds.instance = new GoogleAds();
    }
    return GoogleAds.instance;
  }

  init(conversionId: string, remarketingId: string): void {
    if (this.initialized) return;

    this.conversionId = conversionId;
    this.remarketingId = remarketingId;

    // Initialize Google Ads tracking
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', conversionId);
    gtag('config', remarketingId);

    // Load Google Ads script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
    document.head.appendChild(script);

    this.initialized = true;

    // Track initialization
    performanceMonitor.trackCustomMetric('google_ads_init', {
      conversionId,
      remarketingId,
      timestamp: new Date().toISOString(),
    });
  }

  // E-commerce Events
  trackProductView(product: any): void {
    if (!this.initialized) return;

    gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        id: product.id,
        name: product.title,
        category: product.category,
        price: product.price,
        quantity: 1
      }]
    });
  }

  trackAddToCart(product: any, quantity: number): void {
    if (!this.initialized) return;

    gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        id: product.id,
        name: product.title,
        category: product.category,
        price: product.price,
        quantity: quantity
      }]
    });
  }

  trackPurchase(order: any): void {
    if (!this.initialized) return;

    gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'USD',
      tax: order.tax,
      shipping: order.shipping,
      items: order.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }

  // Conversion Events
  trackConversion(conversionLabel: string, value?: number): void {
    if (!this.initialized) return;

    gtag('event', 'conversion', {
      send_to: `${this.conversionId}/${conversionLabel}`,
      value: value,
      currency: 'USD'
    });
  }

  // Remarketing Events
  trackRemarketing(eventName: string, data?: any): void {
    if (!this.initialized) return;

    gtag('event', eventName, {
      send_to: this.remarketingId,
      ...data
    });
  }

  // Custom Events
  trackCustomEvent(eventName: string, data?: any): void {
    if (!this.initialized) return;

    gtag('event', eventName, data);
  }
}

export const googleAds = GoogleAds.getInstance();