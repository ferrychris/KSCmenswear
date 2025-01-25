import { create } from 'zustand';
import { ProductStore } from './types';
import { config } from '@/config';

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${config.apiUrl}/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const products = await response.json();
      set({ products, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false 
      });
    }
  },

  fetchProductById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${config.apiUrl}/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const product = await response.json();
      set({ selectedProduct: product, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false 
      });
    }
  },

  filterProducts: (category?: string, search?: string) => {
    const { products } = get();
    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    set({ products: filteredProducts });
  },
}));