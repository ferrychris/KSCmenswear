import { useState, useEffect } from 'react';
import type { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulated product data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Classic Navy Suit',
        description: 'A timeless navy suit for any formal occasion',
        price: 599.99,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80'],
        category: 'Suits',
        sizes: ['38R', '40R', '42R', '44R'],
        colors: ['Navy', 'Black', 'Charcoal'],
        inStock: true,
      },
      {
        id: '2',
        name: 'White Dress Shirt',
        description: 'Premium cotton dress shirt',
        price: 89.99,
        images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80'],
        category: 'Shirts',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Blue', 'Black'],
        inStock: true,
      },
      {
        id: '3',
        name: 'Double-Breasted Suit',
        description: 'Classic double-breasted suit in charcoal',
        price: 799.99,
        images: ['https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80'],
        category: 'Suits',
        sizes: ['38R', '40R', '42R', '44R'],
        colors: ['Charcoal', 'Navy', 'Black'],
        inStock: true,
      },
      {
        id: '4',
        name: 'Burgundy Blazer',
        description: 'Elegant burgundy blazer for special occasions',
        price: 499.99,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80'],
        category: 'Blazers',
        sizes: ['38R', '40R', '42R', '44R'],
        colors: ['Burgundy', 'Navy'],
        inStock: true,
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  return { products, loading, error };
}