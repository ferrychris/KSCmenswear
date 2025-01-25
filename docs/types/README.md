# TypeScript Type Documentation

## Core Types

### Product

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}
```

### Cart

```ts
interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}
```

### Store Types

```ts
interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  filterProducts: (category?: string, search?: string) => void;
}

interface UIStore {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  activeFilters: string[];
  searchQuery: string;
  toggleCart: () => void;
  toggleMobileMenu: () => void;
  setActiveFilters: (filters: string[]) => void;
  setSearchQuery: (query: string) => void;
}
```

## Type Best Practices

1. Use strict type checking
2. Avoid `any` type
3. Use union types for variants
4. Document complex types
5. Use generics when appropriate
6. Create reusable type utilities
7. Use type guards
8. Maintain type consistency