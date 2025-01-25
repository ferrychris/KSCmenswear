import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shirt, Bot as Bow, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';
import { VideoSEO } from '@/components/seo/VideoSEO';

const categories = [
  {
    id: 'ties',
    name: 'Ties & Bowties',
    description: 'Classic and designer neckwear',
    image: 'https://images.unsplash.com/photo-1624538000860-24e9d41a0741?auto=format&fit=crop&q=80',
    icon: Bow,
    subcategories: [
      { name: 'Classic Ties', href: '/collections/accessories/ties' },
      { name: 'Bow Ties', href: '/collections/accessories/bowties' },
      { name: 'Skinny Ties', href: '/collections/accessories/skinny-ties' },
      { name: 'Wedding Ties', href: '/collections/wedding-ties' }
    ]
  },
  {
    id: 'vests',
    name: 'Vests',
    description: 'Sophisticated layering pieces',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
    icon: Shirt,
    subcategories: [
      { name: 'Classic Vests', href: '/collections/accessories/vests' },
      { name: 'Tuxedo Vests', href: '/collections/accessories/tuxedo-vests' },
      { name: 'Wedding Vests', href: '/collections/accessories/wedding-vests' },
      { name: 'Prom Vests', href: '/collections/prom-vests' }
    ]
  },
  {
    id: 'accessories',
    name: 'Other Accessories',
    description: 'Essential finishing touches',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
    icon: Sparkles,
    subcategories: [
      { name: 'Pocket Squares', href: '/collections/accessories/pocket-squares' },
      { name: 'Cufflinks', href: '/collections/accessories/cufflinks' },
      { name: 'Tie Bars', href: '/collections/accessories/tie-bars' },
      { name: 'Suspenders', href: '/collections/accessories/suspenders' }
    ]
  }
];

const videoData = {
  name: "Premium Accessories Collection",
  description: "Complete your look with our premium collection of accessories. From classic ties to modern accessories, find the perfect finishing touches for any outfit.",
  thumbnailUrl: "https://images.unsplash.com/photo-1624538000860-24e9d41a0741?auto=format&fit=crop&q=80",
  contentUrl: "https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/de9e4f4d01d05caf5c8383a98138b783/manifest/video.m3u8",
  embedUrl: "https://iframe.cloudflarestream.com/de9e4f4d01d05caf5c8383a98138b783",
  uploadDate: "2024-03-01",
  duration: "PT2M30S",
  tags: ["accessories", "ties", "bowties", "vests", "menswear", "formal wear"]
};

export default function AccessoriesHome() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  return (
    <div className="min-h-screen bg-white">
      <VideoSEO 
        video={videoData}
        pageUrl="/collections/accessories"
      />

      {/* Video Hero Section */}
      <div className="relative h-[60vh]">
        <div className="absolute inset-0">
          <AutoplayHLSVideo
            src={videoData.contentUrl}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/collections"
              className="inline-flex items-center text-white hover:text-gray-200 mb-4"
            >
              <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
              Back to Collections
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Accessories
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Complete your look with our premium collection
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-charcoal-200">
        <div className="flex overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'flex-none px-6 py-4 text-sm font-medium transition-colors relative',
                activeCategory === category.id 
                  ? 'text-burgundy-600' 
                  : 'text-charcoal-600'
              )}
            >
              {category.name}
              {activeCategory === category.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category Content */}
      <div className="px-4 py-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              'space-y-6',
              activeCategory === category.id ? 'block' : 'hidden'
            )}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <category.icon className="h-6 w-6 text-burgundy-600" />
              <h2 className="text-xl font-semibold text-charcoal-900">{category.name}</h2>
            </div>

            {/* Subcategories */}
            <div className="space-y-4">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.name}
                  to={subcategory.href}
                  className="block bg-white rounded-lg shadow-sm border border-charcoal-100 p-4 hover:border-burgundy-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-900">{subcategory.name}</span>
                    <ChevronRight className="h-5 w-5 text-charcoal-400" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Image */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                  {category.name} Collection
                </h3>
                <p className="text-charcoal-600">{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}