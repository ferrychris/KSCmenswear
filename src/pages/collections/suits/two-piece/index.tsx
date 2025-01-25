import { useState } from 'react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function TwoPieceSuits() {
  const { products, loading, error } = useShopifyProducts('title:suit');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter out any products that have "tuxedo", "three piece", or "double breasted" in the title
  const filteredProducts = products.filter(product => {
    const title = product.name.toLowerCase();
    return (
      title.includes('suit') && 
      !title.includes('tuxedo') && 
      !title.includes('three piece') && 
      !title.includes('double breasted')
    );
  });

  const colorFilteredProducts = selectedColors.length > 0
    ? filteredProducts.filter(product => 
        selectedColors.some(color => 
          product.colors.map(c => c.toLowerCase()).includes(color.toLowerCase())
        )
      )
    : filteredProducts;

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
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80"
          alt="Two Piece Suits"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/collections/suits"
              className="inline-flex items-center text-white hover:text-gray-200 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Collections
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              2 Piece Suits
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Versatile and timeless suits for any occasion
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Our Collection</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Filters */}
          <div className={cn(
            'lg:block',
            showFilters ? 'block' : 'hidden'
          )}>
            <ProductFilters
              selectedColors={selectedColors}
              onColorChange={setSelectedColors}
            />
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3">
            {selectedColors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Filtered by:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map(color => (
                      <span
                        key={color}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                      >
                        {color}
                        <button
                          onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedColors.length > 0 && (
                      <button
                        onClick={() => setSelectedColors([])}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <ProductGrid products={colorFilteredProducts} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}