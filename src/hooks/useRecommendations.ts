import { useState, useEffect } from 'react';
import { recommendationEngine } from '@/lib/recommendations/engine';
import { useProducts } from './useProducts';
import type { Product } from '@/types';

export function useRecommendations(product: Product | null) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const { products } = useProducts();

  useEffect(() => {
    if (product && products.length > 0) {
      const recommendedProducts = recommendationEngine.getComplementaryProducts(
        product,
        products
      );
      setRecommendations(recommendedProducts);
    }
  }, [product, products]);

  return { recommendations };
}