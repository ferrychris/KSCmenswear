import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import type { Cart } from '@/lib/cart/types';

interface CartSummaryProps {
  cartId: string;
  onCheckout?: (cart: Cart) => void;
}

export function CartSummary({ cartId, onCheckout }: CartSummaryProps) {
  const { cart, loading, error } = useCart(cartId);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-charcoal-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-charcoal-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-burgundy-500">
        Error loading cart: {error.message}
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif font-semibold text-charcoal-900">Cart Summary</h2>
        <div className="flex items-center text-charcoal-600">
          <ShoppingBag className="w-5 h-5 mr-2" />
          <span>{cart.items.length} items</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-charcoal-600">
          <span>Subtotal</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>

        {cart.discountCode && (
          <div className="flex justify-between text-gold-600">
            <span>Discount</span>
            <span>-{formatPrice(cart.discountCode.value)}</span>
          </div>
        )}

        <div className="flex justify-between text-charcoal-600">
          <span>Shipping</span>
          <span>{formatPrice(cart.shipping)}</span>
        </div>

        <div className="flex justify-between text-charcoal-600">
          <span>Tax</span>
          <span>{formatPrice(cart.tax)}</span>
        </div>

        <div className="border-t border-charcoal-200 pt-4">
          <div className="flex justify-between font-semibold text-lg text-charcoal-900">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <p className="text-sm text-charcoal-500 mt-1">
            Including VAT
          </p>
        </div>

        <button
          onClick={() => onCheckout?.(cart)}
          className="w-full bg-navy-600 text-white py-3 px-4 rounded-md hover:bg-navy-700 transition-colors font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}