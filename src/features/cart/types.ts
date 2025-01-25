import { CartItem } from '@/types';

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}