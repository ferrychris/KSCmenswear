import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface FavoritesStore {
  favorites: Product[];
  recentlyViewed: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyViewed: [],

      addFavorite: (product) => {
        set((state) => ({
          favorites: [...state.favorites, product],
        }));
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }));
      },

      addRecentlyViewed: (product) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id);
          return {
            recentlyViewed: [product, ...filtered].slice(0, 10), // Keep last 10 items
          };
        });
      },

      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },
    }),
    {
      name: 'kct-favorites-storage',
    }
  )
);