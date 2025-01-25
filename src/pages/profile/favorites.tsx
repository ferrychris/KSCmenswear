import { useFavoritesStore } from '@/store/favoritesStore';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Heart, Clock, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfilePageSEO } from '@/components/seo/ProfilePageSEO';

export default function Favorites() {
  const { favorites, recentlyViewed, clearRecentlyViewed } = useFavoritesStore();

  return (
    <div className="bg-white min-h-screen">
      <ProfilePageSEO page="favorites" />
      <PageHeader
        title="My Favorites"
        description="Your saved items and recently viewed products"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Favorites Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-rose-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Saved Items</h2>
            </div>
          </div>
          
          {favorites.length > 0 ? (
            <ProductGrid products={favorites} isLoading={false} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-8">
                Save your favorite items by clicking the heart icon on any product
              </p>
              <a
                href="/collections"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Collections
              </a>
            </div>
          )}
        </div>

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-indigo-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
              </div>
              <button
                onClick={clearRecentlyViewed}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Trash2 className="h-5 w-5 mr-1" />
                Clear History
              </button>
            </div>
            <ProductGrid products={recentlyViewed} isLoading={false} />
          </div>
        )}
      </div>
    </div>
  );
}