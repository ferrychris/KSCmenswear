import { useState, useEffect } from 'react';
import { shopifyClient } from '@/lib/shopify/client';
import type { Product } from '@/types';

export function useShopifyProducts(query?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching products with query:', query);
        const shopifyProducts = await shopifyClient.products.list(query);
        
        if (!shopifyProducts?.length) {
          console.log('No products returned from Shopify');
          setProducts([]);
          return;
        }

        console.log('Raw Shopify products:', shopifyProducts);

        // Use the products directly since they're already transformed in the client
        setProducts(shopifyProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query]);

  return { products, loading, error };
}