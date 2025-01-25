import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Heart, ShoppingBag, Ruler } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavoritesStore } from '@/store/favoritesStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isProductFavorite = product ? isFavorite(product.id) : false;

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
      variantId: product.variantId || product.id,
    });

    onClose();
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    if (isProductFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  if (!product) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Product Info */}
                  <div>
                    <h2 className="text-2xl font-light text-gray-900 mb-4">
                      {product.name}
                    </h2>
                    <p className="text-2xl font-light text-gray-900 mb-6">
                      {formatPrice(product.price)}
                    </p>

                    {/* Size Selection */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Size</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              'flex h-12 items-center justify-center rounded-none border text-sm font-medium transition-colors',
                              selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 hover:border-gray-900'
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              'flex h-12 items-center justify-center rounded-none border text-sm font-medium transition-colors',
                              selectedColor === color
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 hover:border-gray-900'
                            )}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Quantity</h3>
                      <div className="flex items-center border border-gray-200 w-32">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-12 h-12 flex items-center justify-center border-r border-gray-200 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="w-8 h-12 text-center border-0 focus:ring-0"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-12 h-12 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor}
                        className="flex-1 flex items-center justify-center bg-black text-white py-4 text-sm font-medium hover:bg-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Add to Cart
                      </button>
                      <button
                        onClick={toggleFavorite}
                        className="flex items-center justify-center px-4 border border-gray-200 hover:border-gray-900"
                      >
                        <Heart 
                          className={cn(
                            'h-5 w-5',
                            isProductFavorite ? 'fill-rose-500 text-rose-500' : ''
                          )}
                        />
                      </button>
                    </div>

                    {/* Size Guide */}
                    <button
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 mt-4"
                    >
                      <Ruler className="h-4 w-4 mr-1" />
                      Size Guide
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}