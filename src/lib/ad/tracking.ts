import { facebookPixel } from './facebook';
import { googleAds } from './google';
import { performanceMonitor } from '../performance/monitor';

export class AdTracker {
  private static instance: AdTracker;

  private constructor() {
    // Initialize tracking pixels
    facebookPixel.init(import.meta.env.VITE_FB_PIXEL_ID || '');
    googleAds.init(
      import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID || '',
      import.meta.env.VITE_GOOGLE_ADS_REMARKETING_ID || ''
    );
  }

  static getInstance(): AdTracker {
    if (!AdTracker.instance) {
      AdTracker.instance = new AdTracker();
    }
    return AdTracker.instance;
  }

  // Product Events
  trackProductView(product: any): void {
    try {
      facebookPixel.trackProductView(product);
      googleAds.trackProductView(product);

      performanceMonitor.trackCustomMetric('product_view_tracking', {
        productId: product.id,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      performanceMonitor.trackError('product_view_tracking', {
        productId: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  trackAddToCart(product: any, quantity: number): void {
    try {
      facebookPixel.trackAddToCart(product, quantity);
      googleAds.trackAddToCart(product, quantity);

      performanceMonitor.trackCustomMetric('add_to_cart_tracking', {
        productId: product.id,
        quantity,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      performanceMonitor.trackError('add_to_cart_tracking', {
        productId: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  trackPurchase(order: any): void {
    try {
      facebookPixel.trackPurchase(order);
      googleAds.trackPurchase(order);

      // Track purchase conversion
      googleAds.trackConversion('PURCHASE_LABEL', order.total);

      performanceMonitor.trackCustomMetric('purchase_tracking', {
        orderId: order.id,
        total: order.total,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      performanceMonitor.trackError('purchase_tracking', {
        orderId: order.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Lead Generation Events
  trackLead(formType: string, formData: any): void {
    try {
      facebookPixel.trackLead(formType, formData);
      googleAds.trackConversion('LEAD_LABEL');

      performanceMonitor.trackCustomMetric('lead_tracking', {
        formType,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      performanceMonitor.trackError('lead_tracking', {
        formType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Custom Events
  trackCustomEvent(eventName: string, data?: any): void {
    try {
      facebookPixel.trackCustomEvent(eventName, data);
      googleAds.trackCustomEvent(eventName, data);

      performanceMonitor.trackCustomMetric('custom_event_tracking', {
        eventName,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      performanceMonitor.trackError('custom_event_tracking', {
        eventName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Remarketing Events
  trackRemarketing(eventName: string, data?: any): void {
    try {
      googleAds.trackRemarketing(eventName, data);

      performanceMonitor.trackCustomMetric('remarketing_tracking', {
        eventName,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      performanceMonitor.trackError('remarketing_tracking', {
        eventName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const adTracker = AdTracker.getInstance();