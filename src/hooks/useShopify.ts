import { useState, useCallback } from 'react';
import { shopifyClient } from '@/lib/shopify/client';
import { shopifyCache } from '@/lib/shopify/cache';

export function useShopify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProduct = useCallback(async (handle: string) => {
    const cacheKey = `product:${handle}`;
    const cached = shopifyCache.get(cacheKey);
    if (cached) return cached;

    try {
      setLoading(true);
      setError(null);
      
      const product = await shopifyClient.products.getByHandle(handle);
      
      if (!product) {
        throw new Error('Product not found');
      }

      shopifyCache.set(cacheKey, product);
      return product;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch product');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProduct,
  };
}