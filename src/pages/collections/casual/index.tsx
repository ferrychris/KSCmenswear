import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ArrowLeft, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CasualCollection() {
  const { products, loading, error } = useShopifyProducts('tag:casual');

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Error Loading Products</h1>
            <p className="mt-4 text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80"
          alt="Casual Collection"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/"
              className="inline-flex items-center text-white hover:text-gray-200 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Collections
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Casual Collection
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Effortless everyday style for the modern gentleman
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shirt className="h-8 w-8 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Casual Collection</h2>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Discover our collection of casual menswear, perfect for everyday style. From comfortable 
            dress shirts to versatile blazers, each piece is crafted with quality and designed for 
            both style and comfort.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="font-medium text-emerald-900">Quality Materials</h3>
              <p className="mt-2 text-sm text-emerald-700">Premium fabrics for lasting comfort</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="font-medium text-emerald-900">Versatile Style</h3>
              <p className="mt-2 text-sm text-emerald-700">Perfect for any casual occasion</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="font-medium text-emerald-900">Expert Tailoring</h3>
              <p className="mt-2 text-sm text-emerald-700">Custom fit for your comfort</p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Style Guide</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Casual Dress Code</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Smart casual for business settings</li>
                  <li>• Weekend wear for social events</li>
                  <li>• Versatile pieces for any occasion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Styling Tips</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Mix and match pieces</li>
                  <li>• Layer for different looks</li>
                  <li>• Accessorize appropriately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ProductGrid products={products} isLoading={loading} />
      </div>
    </div>
  );
}