import { useState } from 'react';

interface PaymentStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PaymentStep({ data, onUpdate, onNext, onBack }: PaymentStepProps) {
  const [formData, setFormData] = useState({
    cardNumber: data.cardNumber || '',
    expiryDate: data.expiryDate || '',
    cvv: data.cvv || '',
    nameOnCard: data.nameOnCard || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">
            Name on Card
          </label>
          <input
            type="text"
            id="nameOnCard"
            name="nameOnCard"
            value={formData.nameOnCard}
            onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
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
          Review Order
        </button>
      </div>
    </form>
  );
}