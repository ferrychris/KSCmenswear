import { useState, useEffect } from 'react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

export function ProductSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products, loading } = useShopifyProducts('tag:bun-wedding-suit');

  useEffect(() => {
    if (!loading && products.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((current) => (current + 1) % products.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(timer);
    }
  }, [loading, products.length]);

  const nextSlide = () => {
    if (products.length) {
      setCurrentIndex((current) => (current + 1) % products.length);
    }
  };

  const prevSlide = () => {
    if (products.length) {
      setCurrentIndex((current) => (current - 1 + products.length) % products.length);
    }
  };

  if (loading || !products.length) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Find the perfect look</h2>
          <p className="mt-4 text-lg text-gray-600">
            KCT Menswear wedding suit line. Want KCT Menswear to do your wedding? Our expert tailors and wedding staff will gather your groomsmen online, get measurements, and send them off!
          </p>
        </div>

        <div className="relative">
          <div className="flex transition-transform duration-500 ease-in-out" 
               style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {products.map((product, index) => (
              <div
                key={product.id}
                className="w-full flex-shrink-0 px-4"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="mx-auto max-w-sm">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-[500px] object-cover rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="mt-1 text-gray-600">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/collections/wedding"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View All Wedding Collections
          </Link>
        </div>
      </div>
    </div>
  );
}