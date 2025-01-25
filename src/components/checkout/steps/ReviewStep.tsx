import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

interface ReviewStepProps {
  formData: any;
  items: CartItem[];
  total: number;
  onNext: () => void;
  onBack: () => void;
}

export function ReviewStep({ formData, items, total, onNext, onBack }: ReviewStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review Order</h2>

      {/* Order Summary */}
      <div className="border-t border-b border-gray-200 py-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="flex py-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h4>{item.name}</h4>
                    <p className="ml-4">{formatPrice(item.price)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.selectedColor} / {item.selectedSize}
                  </p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>{formatPrice(total)}</p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
        <div className="text-sm text-gray-600">
          <p>{formData.shipping.firstName} {formData.shipping.lastName}</p>
          <p>{formData.shipping.address}</p>
          <p>{formData.shipping.city}, {formData.shipping.state} {formData.shipping.zipCode}</p>
          <p>{formData.shipping.email}</p>
          <p>{formData.shipping.phone}</p>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <div className="text-sm text-gray-600">
          <p>•••• •••• •••• {formData.payment.cardNumber.slice(-4)}</p>
          <p>Expires {formData.payment.expiryDate}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-white text-gray-600 px-6 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
        >
          Place Order
        </button>
      </div>
    </form>
  );
}