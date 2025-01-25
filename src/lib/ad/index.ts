import { googleAnalytics } from './google-analytics';
import { googleTagManager } from './google-tag-manager';
import { googleAds } from './google';
import { facebookPixel } from './facebook';
import { adTracker } from './tracking';

// Initialize all tracking
export function initializeTracking(): void {
  // Initialize Google Analytics 4
  googleAnalytics.init(import.meta.env.VITE_GA4_MEASUREMENT_ID || '');

  // Initialize Google Tag Manager
  googleTagManager.init(import.meta.env.VITE_GTM_CONTAINER_ID || '');

  // Initialize Google Ads
  googleAds.init(
    import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID || '',
    import.meta.env.VITE_GOOGLE_ADS_REMARKETING_ID || ''
  );

  // Initialize Facebook Pixel
  facebookPixel.init(import.meta.env.VITE_FB_PIXEL_ID || '');
}

export {
  googleAnalytics,
  googleTagManager,
  googleAds,
  facebookPixel,
  adTracker,
};