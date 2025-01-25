import { performanceMonitor } from '../performance/monitor';

export class GoogleAnalytics {
  private static instance: GoogleAnalytics;
  private initialized: boolean = false;
  private measurementId: string = '';

  private constructor() {}

  static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics();
    }
    return GoogleAnalytics.instance;
  }

  init(measurementId: string): void {
    if (this.initialized) return;

    this.measurementId = measurementId;

    // Initialize Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false // We'll handle this manually
    });

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    this.initialized = true;

    // Track initialization
    performanceMonitor.trackCustomMetric('ga4_init', {
      measurementId,
      timestamp: new Date().toISOString(),
    });
  }

  // Page Views
  trackPageView(path: string, title?: string): void {
    if (!this.initialized) return;

    gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      send_to: this.measurementId
    });
  }

  // E-commerce Events
  trackProductView(product: any): void {
    if (!this.initialized) return;

    gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
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
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
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
      tax: order.tax,
      shipping: order.shipping,
      currency: 'USD',
      items: order.items.map((item: any) => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }

  // User Engagement Events
  trackSearch(searchTerm: string, resultsCount: number): void {
    if (!this.initialized) return;

    gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  trackLogin(method: string): void {
    if (!this.initialized) return;

    gtag('event', 'login', {
      method: method
    });
  }

  trackSignUp(method: string): void {
    if (!this.initialized) return;

    gtag('event', 'sign_up', {
      method: method
    });
  }

  // Custom Events
  trackCustomEvent(eventName: string, params?: any): void {
    if (!this.initialized) return;

    gtag('event', eventName, params);
  }

  // User Properties
  setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized) return;

    gtag('set', 'user_properties', properties);
  }
}

export const googleAnalytics = GoogleAnalytics.getInstance();