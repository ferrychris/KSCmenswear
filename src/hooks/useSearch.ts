import { useState, useCallback } from 'react';
import { shopifyClient } from '@/lib/shopify/client';
import { shopifyCache } from '@/lib/shopify/cache';
import type { Product } from '@/types';

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `search:${query}`;
      const cached = shopifyCache.get<Product[]>(cacheKey);
      if (cached) {
        setResults(cached);
        return;
      }

      // Fetch from Shopify
      const shopifyProducts = await shopifyClient.products.list(query);
      
      // Transform Shopify products to our Product type
      const transformedProducts = shopifyProducts.map(product => ({
        id: product.id,
        name: product.title,
        description: product.description,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        images: product.images.edges.map(edge => edge.node.url),
        category: 'Suits', // You might want to get this from product tags or type
        sizes: product.variants.edges.map(edge => edge.node.title),
        colors: product.variants.edges
          .map(edge => edge.node.selectedOptions.find(opt => opt.name === 'Color')?.value)
          .filter((color): color is string => color !== undefined),
        inStock: product.variants.edges.some(edge => edge.node.availableForSale),
      }));

      setResults(transformedProducts);
      shopifyCache.set(cacheKey, transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      // Get popular searches based on product titles
      const products = await shopifyClient.products.list(query);
      const suggestions = products
        .map(product => product.title)
        .slice(0, 5); // Limit to 5 suggestions

      setSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  return {
    results,
    suggestions,
    loading,
    error,
    search,
    getSuggestions,
  };
}