import { Product } from '@/types';

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}