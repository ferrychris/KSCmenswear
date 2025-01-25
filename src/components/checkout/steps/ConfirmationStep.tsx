import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConfirmationStepProps {
  orderNumber: string;
  email: string;
}

export function ConfirmationStep({ orderNumber, email }: ConfirmationStepProps) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
        Thank you for your order!
      </h2>
      
      <p className="mt-2 text-base text-gray-500">
        Order number: {orderNumber}
      </p>
      
      <p className="mt-1 text-sm text-gray-500">
        We'll send a confirmation email to {email} with your order details.
      </p>

      <div className="mt-10">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Continue Shopping
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  );
}