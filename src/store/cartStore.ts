import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore } from './types';
import { CartItem } from '@/types';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item: CartItem) => {
        const items = get().items;
        // Find existing item by variant ID and selected options
        const existingItem = items.find(
          (i) => 
            i.variantId === item.variantId && 
            i.selectedSize === item.selectedSize && 
            i.selectedColor === item.selectedColor
        );

        if (existingItem) {
          const updatedItems = items.map((i) =>
            i === existingItem
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
          });
        } else {
          const updatedItems = [...items, item];
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
          });
        }

        // Show toast notification
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: 'Item added to cart'
        }));
      },

      removeItem: (variantId: string) => {
        const updatedItems = get().items.filter((item) => item.variantId !== variantId);
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
        });
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity < 1) return;
        
        const updatedItems = get().items.map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item
        );
        
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
        });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },
    }),
    {
      name: 'kct-cart-storage',
      skipHydration: false,
    }
  )
);

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}