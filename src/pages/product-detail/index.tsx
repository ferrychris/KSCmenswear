import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useShopify } from '@/hooks/useShopify';
import { useCart } from '@/hooks/useCart';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPrice } from '@/lib/utils';
import { Heart, Ruler, ShoppingBag, Star, Shield, Truck, Clock, ArrowRight, X, Info, ChevronRight, ChevronLeft, Phone } from 'lucide-react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/lib/utils';
import { useRecommendations } from '@/hooks/useRecommendations';
import { ProductPageSEO } from '@/components/seo/ProductPageSEO';

export default function ProductDetail() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProduct, loading, error } = useShopify();
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const { recommendations = [] } = useRecommendations(product);

  const fromPath = location.state?.from || '/collections';
  const fromName = location.state?.fromName || 'Collections';

  // Get collection name from path for breadcrumbs
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

  // Mock reviews for now - in production, these would come from your backend
  const mockReviews = [
    {
      author: "John D.",
      rating: 5,
      content: "Perfect fit and excellent quality. The tailoring service was outstanding.",
      date: "2024-02-15"
    },
    {
      author: "Michael S.",
      rating: 4,
      content: "Great suit, shipping was fast. Would recommend.",
      date: "2024-02-10"
    }
  ];

  // Construct breadcrumbs based on current location
  const collectionName = getCollectionName(location.pathname);
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...(collectionName ? [{ name: collectionName, path: `/collections/${collectionName.toLowerCase()}` }] : []),
    { name: product?.title || 'Product', path: location.pathname }
  ];

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    async function loadProduct() {
      if (!handle) {
        navigate('/products');
        return;
      }

      try {
        const data = await getProduct(handle);
        setProduct(data);
      } catch (err) {
        console.error('Error loading product:', err);
      }
    }

    loadProduct();
  }, [handle, getProduct, navigate]);

  useEffect(() => {
    if (product && selectedSize) {
      const variant = product.variants.edges.find(({ node }: any) =>
        node.selectedOptions.some((opt: any) =>
          opt.name.toLowerCase() === 'size' &&
          opt.value.toLowerCase() === selectedSize.toLowerCase()
        )
      );
      setSelectedVariant(variant?.node);
    }
  }, [product, selectedSize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for could not be found. It may have been removed or the URL might be incorrect.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isProductFavorite = isFavorite(product.id);

  const colors = new Set<string>();
  product.tags.forEach((tag: string) => {
    if (tag.toLowerCase().includes('black') || 
        tag.toLowerCase().includes('navy') || 
        tag.toLowerCase().includes('grey')) {
      colors.add(tag.split(' ')[0]);
    }
  });
  
  if (colors.size === 0) {
    const titleWords = product.title.toLowerCase().split(' ');
    const commonColors = ['black', 'navy', 'blue', 'gray', 'grey', 'brown', 'tan', 'burgundy'];
    const foundColor = titleWords.find(word => commonColors.includes(word));
    if (foundColor) {
      colors.add(foundColor.charAt(0).toUpperCase() + foundColor.slice(1));
    } else {
      colors.add('Black');
    }
  }

  const sizes = new Set<string>();
  product.variants.edges.forEach(({ node }: any) => {
    node.selectedOptions.forEach((option: any) => {
      if (option.name.toLowerCase() === 'size') {
        sizes.add(option.value);
      }
    });
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    if (!selectedVariant) {
      alert('Selected combination is not available');
      return;
    }

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      name: product.title,
      description: product.description,
      price: parseFloat(selectedVariant.price?.amount || product.priceRange.minVariantPrice.amount),
      images: product.images.edges.map((edge: any) => edge.node.url),
      category: product.tags[0] || '',
      sizes: Array.from(sizes),
      colors: Array.from(colors),
      inStock: selectedVariant.availableForSale,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const toggleFavorite = () => {
    if (isProductFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.title,
        description: product.description,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        images: product.images.edges.map((edge: any) => edge.node.url),
        category: product.tags[0] || '',
        sizes: Array.from(sizes),
        colors: Array.from(colors),
        inStock: true,
        handle: product.handle,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {product && (
        <ProductPageSEO
          product={product}
          reviews={mockReviews}
          relatedProducts={recommendations}
          breadcrumbs={breadcrumbs}
        />
      )}

      {/* Minimal Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={toggleFavorite}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Heart 
              className={`h-6 w-6 ${
                isProductFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
          {/* Image Gallery */}
          <div className="relative bg-gray-100 lg:min-h-[calc(100vh-5rem)]">
            <div className="sticky top-0 h-full">
              <div className="relative h-full">
                <img
                  src={product.images.edges[activeImageIndex]?.node.url}
                  alt={product.images.edges[activeImageIndex]?.node.altText || product.title}
                  className="h-full w-full object-cover"
                />
                
                {/* Image Navigation */}
                {product.images.edges.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => 
                        prev === 0 ? product.images.edges.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => 
                        prev === product.images.edges.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {product.images.edges.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {product.images.edges.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          activeImageIndex === index 
                            ? 'bg-black w-8' 
                            : 'bg-black/50 hover:bg-black/75'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 py-8 lg:px-12 lg:py-16">
            <div className="max-w-xl">
              {/* Title and Price */}
              <div className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight text-gray-900">
                  {product.title}
                </h1>
                <p className="text-3xl font-light tracking-tight text-gray-900">
                  {formatPrice(parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount))}
                </p>
              </div>

              {/* Description */}
              <div className="mt-8">
                <div className="prose prose-sm text-gray-500">
                  <div className="line-clamp-3">
                    {product.description}
                  </div>
                  <button
                    onClick={() => setShowDescription(true)}
                    className="mt-2 text-black hover:text-gray-600 transition-colors underline underline-offset-4"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="mt-12 space-y-8">
                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {Array.from(sizes).map((size) => (
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
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from(colors).map((color) => (
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
                <div>
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
              </div>

              {/* Add to Cart */}
              <div className="mt-12">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || !selectedVariant}
                  className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              {/* Features */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                <div className="flex items-start space-x-2">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-500">2-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Ruler className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Alterations</p>
                    <p className="text-sm text-gray-500">Perfect fit guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New sections below the main product content */}
      <div className="border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Style Guide Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8">How to Style It</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6">
                <h3 className="font-medium text-lg mb-4">Formal Events</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Pair with patent leather oxfords
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Add a silk pocket square
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Classic white dress shirt
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6">
                <h3 className="font-medium text-lg mb-4">Business</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Choose a subtle tie pattern
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Black or brown leather shoes
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Minimal accessories
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6">
                <h3 className="font-medium text-lg mb-4">Casual</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Skip the tie for a relaxed look
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Roll the sleeves slightly
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                    Add a leather belt
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Complete the Look Section */}
          {recommendations.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light">Complete the Look</h2>
                <Link 
                  to="/collections/accessories" 
                  className="text-sm hover:underline"
                >
                  View All Accessories
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendations.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.handle}`}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div>
              <h3 className="font-medium text-lg mb-4">Materials</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Premium Italian wool</li>
                <li>• Silk lining</li>
                <li>• Horn buttons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Fit Details</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Slim fit design</li>
                <li>• True to size</li>
                <li>• Tailored silhouette</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Care Instructions</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Dry clean only</li>
                <li>• Use padded hanger</li>
                <li>• Store in garment bag</li>
              </ul>
            </div>
          </div>

          {/* Customer Service Banner */}
          <div className="bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-medium mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">Our style experts are here to assist you</p>
            <div className="flex justify-center gap-4">
              <a
                href="tel:+12693421234"
                className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      {showDescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={() => setShowDescription(false)} />
            <div className="relative bg-white w-full max-w-2xl p-8">
              <button
                onClick={() => setShowDescription(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="prose prose-sm max-w-none">
                <h2 className="text-2xl font-light mb-6">Product Details</h2>
                <div className="text-gray-600 space-y-4">
                  {product.description}
                </div>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Features</h3>
                    <ul className="mt-4 space-y-2">
                      {product.tags.map((tag: string) => (
                        <li key={tag} className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Care Instructions</h3>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                        Dry clean only
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                        Store on a padded hanger
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mr-2" />
                        Avoid direct sunlight
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}