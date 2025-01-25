import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { CartItem } from './CartItem';
import { config } from '@/config';

export function CartDrawer() {
  const isOpen = useUIStore((state) => state.isCartOpen);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const { items, total } = useCartStore();

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        alert('Your cart is empty');
        return;
      }

      // Construct line items in Shopify's format
      const lineItems = items.map(item => {
        // Remove 'gid://shopify/ProductVariant/' prefix if present
        const variantId = item.variantId.replace('gid://shopify/ProductVariant/', '');
        return `${variantId}:${item.quantity}`;
      });

      // Construct Shopify checkout URL
      const checkoutUrl = `https://${config.shopify.storeDomain}/cart/${lineItems.join(',')}`;
      
      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('There was an error initiating checkout. Please try again.');
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-charcoal-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-charcoal-400 hover:text-charcoal-500"
                            onClick={toggleCart}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-charcoal-200">
                            {items.map((item, index) => (
                              <CartItem 
                                key={`${item.variantId}-${index}`} 
                                item={item} 
                              />
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-charcoal-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-charcoal-900">
                        <p>Subtotal</p>
                        <p>{formatPrice(total)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-charcoal-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={handleCheckout}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-navy-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-navy-700"
                        >
                          Checkout
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-charcoal-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-navy-600 hover:text-navy-500"
                            onClick={toggleCart}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> →</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}