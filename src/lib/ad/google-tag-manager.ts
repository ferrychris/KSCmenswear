import { performanceMonitor } from '../performance/monitor';

export class GoogleTagManager {
  private static instance: GoogleTagManager;
  private initialized: boolean = false;
  private containerId: string = '';

  private constructor() {}

  static getInstance(): GoogleTagManager {
    if (!GoogleTagManager.instance) {
      GoogleTagManager.instance = new GoogleTagManager();
    }
    return GoogleTagManager.instance;
  }

  init(containerId: string): void {
    if (this.initialized) return;

    this.containerId = containerId;

    // Initialize Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',containerId);

    // Add noscript iframe
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.appendChild(noscript);

    this.initialized = true;

    // Track initialization
    performanceMonitor.trackCustomMetric('gtm_init', {
      containerId,
      timestamp: new Date().toISOString(),
    });
  }

  // Push data to dataLayer
  push(data: any): void {
    if (!this.initialized) return;

    window.dataLayer.push(data);
  }

  // E-commerce Events
  trackProductView(product: any): void {
    if (!this.initialized) return;

    this.push({
      event: 'view_item',
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price: product.price,
          quantity: 1
        }]
      }
    });
  }

  trackAddToCart(product: any, quantity: number): void {
    if (!this.initialized) return;

    this.push({
      event: 'add_to_cart',
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price: product.price,
          quantity: quantity
        }]
      }
    });
  }

  trackPurchase(order: any): void {
    if (!this.initialized) return;

    this.push({
      event: 'purchase',
      ecommerce: {
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
      }
    });
  }

  // Virtual Pageviews
  trackPageView(path: string, title?: string): void {
    if (!this.initialized) return;

    this.push({
      event: 'virtual_page_view',
      page: {
        path: path,
        title: title
      }
    });
  }

  // User Events
  trackUserEvent(category: string, action: string, label?: string, value?: number): void {
    if (!this.initialized) return;

    this.push({
      event: 'user_event',
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value
    });
  }

  // Custom Events
  trackCustomEvent(eventName: string, data?: any): void {
    if (!this.initialized) return;

    this.push({
      event: eventName,
      ...data
    });
  }
}

export const googleTagManager = GoogleTagManager.getInstance();