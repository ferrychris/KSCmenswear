import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

export function useCart() {
  const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  return {
    items,
    total,
    addToCart: (product: CartItem) => {
      addItem(product);
    },
    removeFromCart: (itemId: string) => {
      removeItem(itemId);
    },
    updateQuantity: (itemId: string, quantity: number) => {
      updateQuantity(itemId, quantity);
    },
    clearCart,
  };
}