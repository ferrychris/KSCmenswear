import { performanceMonitor } from '../performance/monitor';

export class FacebookPixel {
  private static instance: FacebookPixel;
  private initialized: boolean = false;
  private pixelId: string = '';

  private constructor() {}

  static getInstance(): FacebookPixel {
    if (!FacebookPixel.instance) {
      FacebookPixel.instance = new FacebookPixel();
    }
    return FacebookPixel.instance;
  }

  init(pixelId: string): void {
    if (this.initialized) return;

    this.pixelId = pixelId;

    // Initialize Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
    fbq('track', 'PageView');

    this.initialized = true;
    
    // Track initialization
    performanceMonitor.trackCustomMetric('facebook_pixel_init', {
      pixelId,
      timestamp: new Date().toISOString(),
    });
  }

  // Server-side event tracking for Conversions API
  private async sendServerEvent(eventName: string, eventData: any): Promise<void> {
    try {
      const response = await fetch('https://graph.facebook.com/v19.0/' + this.pixelId + '/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: window.location.href,
            action_source: 'website',
            ...eventData
          }],
          access_token: process.env.VITE_FB_ACCESS_TOKEN
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send server event');
      }

      performanceMonitor.trackCustomMetric('facebook_server_event', {
        eventName,
        success: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      performanceMonitor.trackError('facebook_server_event', {
        eventName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // E-commerce Events
  trackProductView(product: any): void {
    if (!this.initialized) return;

    const eventData = {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.title,
      content_category: product.category,
      value: product.price,
      currency: 'USD'
    };

    // Client-side tracking
    fbq('track', 'ViewContent', eventData);

    // Server-side tracking
    this.sendServerEvent('ViewContent', eventData);
  }

  trackAddToCart(product: any, quantity: number): void {
    if (!this.initialized) return;

    const eventData = {
      content_ids: [product.id],
      content_type: 'product',
      content_name: product.title,
      content_category: product.category,
      value: product.price * quantity,
      currency: 'USD',
      contents: [{
        id: product.id,
        quantity: quantity,
        item_price: product.price
      }]
    };

    // Client-side tracking
    fbq('track', 'AddToCart', eventData);

    // Server-side tracking
    this.sendServerEvent('AddToCart', eventData);
  }

  trackPurchase(order: any): void {
    if (!this.initialized) return;

    const eventData = {
      content_ids: order.items.map((item: any) => item.id),
      content_type: 'product',
      value: order.total,
      currency: 'USD',
      num_items: order.items.length,
      contents: order.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }))
    };

    // Client-side tracking
    fbq('track', 'Purchase', eventData);

    // Server-side tracking
    this.sendServerEvent('Purchase', eventData);
  }

  // Lead Generation Events
  trackLead(formType: string, formData: any): void {
    if (!this.initialized) return;

    const eventData = {
      content_name: formType,
      content_category: 'form_submission',
      value: 0,
      currency: 'USD',
      status: 'submitted'
    };

    // Client-side tracking
    fbq('track', 'Lead', eventData);

    // Server-side tracking
    this.sendServerEvent('Lead', eventData);
  }

  // Custom Events
  trackCustomEvent(eventName: string, data?: any): void {
    if (!this.initialized) return;

    // Client-side tracking
    fbq('trackCustom', eventName, data);

    // Server-side tracking
    this.sendServerEvent(eventName, data);
  }
}

export const facebookPixel = FacebookPixel.getInstance();