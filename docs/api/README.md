# API Documentation

Documentation for all API endpoints and integrations.

## Shopify Storefront API

### Authentication

The application uses Shopify's Storefront API with the following configuration:

```ts
const config = {
  storeDomain: process.env.VITE_SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: process.env.VITE_SHOPIFY_API_VERSION,
};
```

### Available Queries

#### Get Products

```graphql
query getProducts {
  products(first: 100) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        # ... rest of the fields
      }
    }
  }
}
```

### Error Handling

All API requests are wrapped with error handling and retry logic:

```ts
async function withRetry<T>(request: () => Promise<T>): Promise<T> {
  // See implementation in src/lib/shopify/client.ts
}
```

### Rate Limiting

API requests are rate-limited to prevent overuse:

```ts
const rateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
```