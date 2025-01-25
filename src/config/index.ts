export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
  shopify: {
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'kctmenswear.myshopify.com',
    storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '3ceac7071425e2837fc23d6ef2129f01',
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01',
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
    apiSecret: import.meta.env.VITE_SHOPIFY_API_SECRET,
    accessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    storefrontUrl: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
  },
  siteName: 'KCT Menswear',
  siteDescription: 'Premium menswear for the modern gentleman',
  baseUrl: 'https://kctmenswear.com',
} as const;