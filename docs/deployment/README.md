# Deployment Documentation

## Deployment Process

### Prerequisites

1. Node.js 18+
2. npm 9+
3. Environment variables configured

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GA_TRACKING_ID=your_ga_tracking_id
VITE_SHOPIFY_STORE_DOMAIN=your_store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
VITE_SHOPIFY_API_VERSION=2024-01
```

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### Deployment Steps

1. Build the application
2. Configure environment variables
3. Deploy static assets
4. Configure CDN (if used)
5. Verify deployment

### Deployment Providers

The application can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Google Cloud Storage + Cloud CDN

## Post-Deployment

1. Verify all routes work
2. Check performance metrics
3. Monitor error rates
4. Test critical user flows