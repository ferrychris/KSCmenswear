import { Truck, Package, Clock, Globe } from 'lucide-react';

const shippingMethods = [
  {
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 'Free on orders over $200',
    icon: Truck,
  },
  {
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: '$15',
    icon: Clock,
  },
  {
    name: 'International Shipping',
    description: 'Delivery in 7-14 business days',
    price: 'Calculated at checkout',
    icon: Globe,
  },
  {
    name: 'Store Pickup',
    description: 'Available within 24 hours',
    price: 'Free',
    icon: Package,
  },
];

export default function ShippingPolicy() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shipping Information
          </h1>
          
          <div className="mt-8 space-y-12">
            {/* Shipping Methods */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Methods</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {shippingMethods.map((method) => (
                  <div
                    key={method.name}
                    className="relative rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <method.icon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{method.description}</p>
                        <p className="mt-2 text-sm font-medium text-indigo-600">{method.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Policy Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Policy Details</h2>
              <div className="prose prose-indigo max-w-none">
                <p>
                  We strive to process and ship all orders within 1-2 business days. Once your order ships, you'll receive a confirmation email with tracking information.
                </p>
                
                <h3>Processing Time</h3>
                <ul>
                  <li>In-stock items: 1-2 business days</li>
                  <li>Made-to-order items: 2-3 weeks</li>
                  <li>Custom tailored items: 3-4 weeks</li>
                </ul>

                <h3>Delivery Areas</h3>
                <p>
                  We currently ship to the United States, Canada, and select international destinations. For international orders, please note that customs duties and taxes may apply.
                </p>

                <h3>Order Tracking</h3>
                <p>
                  Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account or contacting our customer service team.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}