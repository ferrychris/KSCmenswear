import { Link } from 'react-router-dom';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Ruler, Star, Shield, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const categories = [
  {
    id: 'oxford',
    name: 'Oxford Shoes',
    description: 'Classic closed-lacing dress shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80',
    features: ['Closed lacing system', 'Sleek silhouette', 'Perfect for formal events']
  },
  {
    id: 'derby',
    name: 'Derby Shoes',
    description: 'Versatile open-lacing dress shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80',
    features: ['Open lacing system', 'Comfortable fit', 'Great for business wear']
  },
  {
    id: 'loafer',
    name: 'Loafers',
    description: 'Sophisticated slip-on shoes',
    image: 'https://images.unsplash.com/photo-1614252234498-45a1a647c0c6?auto=format&fit=crop&q=80',
    features: ['Slip-on design', 'Classic penny or tassel styles', 'Perfect for any occasion']
  },
  {
    id: 'monk',
    name: 'Monk Straps',
    description: 'Elegant buckled dress shoes',
    image: 'https://images.unsplash.com/photo-1614252235334-b1b2d9ecf1ff?auto=format&fit=crop&q=80',
    features: ['Single or double buckle', 'Unique style', 'Modern sophistication']
  }
];

const featuredStyles = [
  {
    name: 'Classic Black Oxford',
    price: 199.99,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80',
  },
  {
    name: 'Brown Leather Derby',
    price: 179.99,
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80',
  },
  {
    name: 'Burgundy Penny Loafer',
    price: 159.99,
    rating: 4.7,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1614252234498-45a1a647c0c6?auto=format&fit=crop&q=80',
  }
];

export default function FormalFootwear() {
  const { products: newArrivals, loading } = useShopifyProducts('tag:new-shoes');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80"
            alt="Formal Footwear Collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Formal Footwear
          </h1>
          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Step into sophistication with our premium collection of formal shoes
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
          Shop by Style
        </h2>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-xl font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
                <div className="mt-4 space-y-2">
                  {category.features.map((feature) => (
                    <p key={feature} className="text-sm text-gray-600">• {feature}</p>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    to={`/collections/footwear/${category.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Styles */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Styles</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {featuredStyles.map((product) => (
              <div key={product.name} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-500">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gray-50 p-8">
          <div className="flex items-center gap-x-4">
            <Ruler className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shoe Size Guide</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How to Measure</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Measure your feet in the afternoon (feet swell during the day)</li>
                <li>• Wear the type of socks you'll wear with your shoes</li>
                <li>• Measure both feet - use the larger foot's measurements</li>
                <li>• Stand while measuring for the most accurate size</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Width Guide</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• D: Standard/Medium width</li>
                <li>• E/EE: Wide width</li>
                <li>• EEE/EEEE: Extra wide width</li>
                <li>• Custom widths available upon request</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Care Instructions */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-indigo-50 p-8">
            <div className="flex items-center gap-x-4">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shoe Care Tips</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <h3 className="font-semibold text-gray-900">Regular Maintenance</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Clean after each wear</li>
                  <li>• Use shoe trees to maintain shape</li>
                  <li>• Polish regularly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Leather Care</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Condition leather every 3-4 months</li>
                  <li>• Protect from water damage</li>
                  <li>• Rotate shoes daily</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Storage</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Store in a cool, dry place</li>
                  <li>• Use dust bags when storing</li>
                  <li>• Avoid direct sunlight</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}