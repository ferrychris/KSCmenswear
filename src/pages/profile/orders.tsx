import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatPrice } from '@/lib/utils';
import { Package, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { ProfilePageSEO } from '@/components/seo/ProfilePageSEO';

export default function Orders() {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Mock data - replace with real API integration
  const mockOrders = [
    {
      id: 'WO123456',
      date: '2024-03-01',
      total: 299.99,
      status: 'Delivered',
      items: [
        {
          id: 'ITEM1',
          name: 'Classic Black Tuxedo',
          price: 299.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
        }
      ],
      tracking: {
        number: '1Z999AA1234567890',
        carrier: 'UPS',
        status: 'Delivered',
        estimatedDelivery: '2024-03-05',
      }
    },
    {
      id: 'WO123457',
      date: '2024-02-15',
      total: 449.98,
      status: 'Processing',
      items: [
        {
          id: 'ITEM2',
          name: 'Navy Blue Suit',
          price: 249.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
        },
        {
          id: 'ITEM3',
          name: 'White Dress Shirt',
          price: 99.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80',
        }
      ],
      tracking: null
    }
  ];

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  return (
    <div className="bg-white min-h-screen">
      <ProfilePageSEO page="orders" userData={{ orders: mockOrders }} />
      <PageHeader
        title="Order History"
        description="View and track your orders"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {mockOrders.length > 0 ? (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className={`text-sm ${
                        order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Package className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      {expandedOrders.has(order.id) ? (
                        <>
                          Show less
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show details
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders.has(order.id) && (
                  <div className="px-6 py-4 bg-gray-50">
                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Information */}
                    {order.tracking && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Tracking Information
                        </h4>
                        <div className="bg-white rounded-lg p-4 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Carrier</span>
                            <span className="font-medium">{order.tracking.carrier}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Tracking Number</span>
                            <a
                              href="#"
                              className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                            >
                              {order.tracking.number}
                              <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-green-600">
                              {order.tracking.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Estimated Delivery</span>
                            <span className="font-medium">
                              {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Invoice
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Request Return
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-8">
              When you place an order, it will appear here
            </p>
            <a
              href="/collections"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Shopping
            </a>
          </div>
        )}
      </div>
    </div>
  );
}