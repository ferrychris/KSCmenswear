import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  // Validate required item data
  if (!item || !item.images || !item.name) {
    console.warn('Invalid cart item:', item);
    return null;
  }

  // Get first image or fallback
  const imageUrl = item.images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80';

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">{formatPrice(item.price)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {item.selectedColor} / {item.selectedSize}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-gray-500">Qty {item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}