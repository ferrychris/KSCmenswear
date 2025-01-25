import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Products() {
  const { products, loading } = useProducts();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = selectedColors.length > 0
    ? products.filter(product => 
        selectedColors.some(color => 
          product.colors.map(c => c.toLowerCase()).includes(color.toLowerCase())
        )
      )
    : products;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Products</h1>
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
            <ProductGrid products={filteredProducts} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}