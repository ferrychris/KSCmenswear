import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from './types';

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isCartOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      activeFilters: [],
      searchQuery: '',

      toggleCart: () =>
        set((state) => ({ isCartOpen: !state.isCartOpen })),

      toggleSearch: () =>
        set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      setActiveFilters: (filters: string[]) =>
        set({ activeFilters: filters }),

      setSearchQuery: (query: string) =>
        set({ searchQuery: query }),
    }),
    {
      name: 'kct-ui-storage',
      partialize: (state) => ({
        activeFilters: state.activeFilters,
        searchQuery: state.searchQuery,
      }),
    }
  )
);