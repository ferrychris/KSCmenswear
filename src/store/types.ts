```diff
 export interface UIStore {
   isCartOpen: boolean;
   isMobileMenuOpen: boolean;
+  isSearchOpen: boolean;
   activeFilters: string[];
   searchQuery: string;
   toggleCart: () => void;
+  toggleSearch: () => void;
   toggleMobileMenu: () => void;
   setActiveFilters: (filters: string[]) => void;
   setSearchQuery: (query: string) => void;
 }
```