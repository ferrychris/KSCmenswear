import { GraphQLClient } from 'graphql-request';
import { config } from '@/config';
import { GET_PRODUCTS, GET_PRODUCT } from './queries';
import { MemoryCache } from '../performance/cache';
import { performanceMonitor } from '../performance/monitor';

// Debug logging
console.log('Initializing Shopify client with config:', {
  storeDomain: config.shopify.storeDomain,
  apiVersion: config.shopify.apiVersion,
  hasToken: !!config.shopify.storefrontToken,
});

// Request batching and caching
const cache = new MemoryCache(20 * 1024 * 1024); // 20MB cache
const pendingRequests = new Map<string, Promise<any>>();
const batchWindow = 50; // 50ms batch window

// Construct Shopify Storefront API endpoint
const endpoint = `https://${config.shopify.storeDomain}/api/${config.shopify.apiVersion}/graphql.json`;
console.log('Shopify API Endpoint:', endpoint);

const client = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': config.shopify.storefrontToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br', // Enable compression
  },
  timeout: 10000, // 10 second timeout
  retryConfig: {
    retries: 3,
    retryDelay: 1000,
  },
});

export const shopifyClient = {
  products: {
    list: async (query?: string) => {
      try {
        console.log('Making Shopify API request with query:', query);
        const cacheKey = `products:${query || 'all'}`;
        
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached) {
          console.log('Returning cached products');
          return cached;
        }

        // Check for pending request
        let request = pendingRequests.get(cacheKey);
        if (!request) {
          console.log('Making new API request to Shopify');
          request = client.request(GET_PRODUCTS, { 
            query: query || '',
            first: 250 // Increase product limit
          });
          pendingRequests.set(cacheKey, request);

          // Clear pending request after completion
          setTimeout(() => {
            pendingRequests.delete(cacheKey);
          }, batchWindow);
        }

        const response = await request;
        console.log('Received Shopify API response:', response);
        
        if (!response?.products?.edges) {
          throw new Error('Invalid response format from Shopify API');
        }

        const products = response.products.edges
          .filter((edge: any) => edge?.node) // Filter out invalid edges
          .map(({ node }: any) => {
            // Validate required fields
            if (!node.id || !node.title || !node.priceRange?.minVariantPrice?.amount) {
              console.warn('Skipping invalid product:', node);
              return null;
            }

            try {
              // Extract unique sizes and colors from variants
              const sizes = new Set<string>();
              const colors = new Set<string>();
              
              if (node.variants?.edges) {
                node.variants.edges.forEach(({ node: variant }: any) => {
                  if (variant?.selectedOptions) {
                    variant.selectedOptions.forEach((option: any) => {
                      if (!option?.name || !option?.value) return;
                      
                      const name = option.name.toLowerCase();
                      const value = option.value;
                      
                      if (name === 'size') {
                        sizes.add(value);
                      } else if (name === 'color') {
                        colors.add(value);
                      }
                    });
                  }
                });
              }

              // Default colors if none found
              if (colors.size === 0) {
                colors.add('Black');
              }

              // Default sizes if none found
              if (sizes.size === 0) {
                ['38R', '40R', '42R', '44R', '46R'].forEach(size => sizes.add(size));
              }

              return {
                id: node.id,
                name: node.title,
                handle: node.handle || '',
                description: node.description || '',
                price: parseFloat(node.priceRange.minVariantPrice.amount),
                images: node.images?.edges?.map((edge: any) => edge?.node?.url) || [],
                category: Array.isArray(node.tags) ? node.tags[0] || '' : '',
                sizes: Array.from(sizes),
                colors: Array.from(colors),
                inStock: node.variants?.edges?.some((edge: any) => edge?.node?.availableForSale) || false,
                variantId: node.variants?.edges?.[0]?.node?.id || node.id,
                tags: node.tags || [],
              };
            } catch (err) {
              console.error('Error transforming product:', node.title, err);
              return null;
            }
          })
          .filter(Boolean); // Filter out null products

        // Cache the results
        cache.set(cacheKey, products);

        console.log('Transformed products:', products);
        return products;
      } catch (error) {
        console.error('Error in Shopify client:', error);
        throw error;
      }
    },

    getByHandle: async (handle: string) => {
      try {
        console.log('Making Shopify API request for product:', handle);
        const cacheKey = `product:${handle}`;
        
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached) {
          console.log('Returning cached product');
          return cached;
        }

        const response = await client.request(GET_PRODUCT, { handle });
        
        if (!response?.productByHandle) {
          throw new Error('Product not found');
        }

        const product = response.productByHandle;

        // Extract sizes and colors
        const sizes = new Set<string>();
        const colors = new Set<string>();

        if (product.variants?.edges) {
          product.variants.edges.forEach(({ node }: any) => {
            if (node.selectedOptions) {
              node.selectedOptions.forEach((option: any) => {
                const name = option.name.toLowerCase();
                const value = option.value;
                
                if (name === 'size') {
                  sizes.add(value);
                } else if (name === 'color') {
                  colors.add(value);
                }
              });
            }
          });
        }

        // Default colors and sizes if none found
        if (colors.size === 0) {
          colors.add('Black');
        }

        if (sizes.size === 0) {
          ['38R', '40R', '42R', '44R', '46R'].forEach(size => sizes.add(size));
        }

        const transformedProduct = {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          priceRange: product.priceRange,
          images: product.images,
          variants: product.variants,
          tags: product.tags || [],
          sizes: Array.from(sizes),
          colors: Array.from(colors),
          variantId: product.variants?.edges?.[0]?.node?.id || product.id,
        };

        // Cache the transformed product
        cache.set(cacheKey, transformedProduct);

        return transformedProduct;
      } catch (error) {
        console.error('Error in Shopify client:', error);
        throw error;
      }
    },
  },
};