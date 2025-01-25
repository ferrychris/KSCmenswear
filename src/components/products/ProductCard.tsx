import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { useFavoritesStore } from '@/store/favoritesStore';
import { ProductQuickView } from './ProductQuickView';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const location = useLocation();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [showQuickView, setShowQuickView] = useState(false);
  const isProductFavorite = isFavorite(product.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isProductFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setShowQuickView(true);
  };

  // Get collection name from path
  const getCollectionName = (path: string) => {
    const parts = path.split('/');
    const collectionIndex = parts.findIndex(part => part === 'collections');
    if (collectionIndex !== -1 && parts[collectionIndex + 1]) {
      return parts[collectionIndex + 1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return null;
  };

  // Validate required data
  if (!product.name || !product.price || !product.images?.[0]) {
    console.warn('Invalid product data:', product);
    return null;
  }

  return (
    <>
      <Link 
        to={`/products/${product.handle || product.id}`}
        state={{ 
          from: location.pathname,
          fromName: getCollectionName(location.pathname)
        }}
        className="group relative"
      >
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <Heart
                className={cn(
                  'h-5 w-5',
                  isProductFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                )}
              />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <Eye className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
      </Link>

      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}