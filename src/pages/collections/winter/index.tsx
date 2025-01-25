import { Link } from 'react-router-dom';
import { ArrowRight, Snowflake } from 'lucide-react';
import { WinterCollectionSEO } from '@/components/seo/WinterCollectionSEO';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';
import { VideoSEO } from '@/components/seo/VideoSEO';

const videoData = {
  name: "Winter Collection 2025",
  description: "Stay warm in style with our premium winter collection featuring luxury sweaters, boots, puffer jackets, and overcoats. Discover the perfect balance of warmth and sophistication for the cold season.",
  thumbnailUrl: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/f6a95174-5825-4abb-e855-d8875fd2e000/public",
  contentUrl: "https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/935c6eb5d6e523fa0153975a826ca4b0/manifest/video.m3u8",
  embedUrl: "https://iframe.cloudflarestream.com/935c6eb5d6e523fa0153975a826ca4b0",
  uploadDate: "2024-03-01",
  duration: "PT2M30S",
  tags: ["winter collection", "winter fashion", "menswear", "winter style", "2025 collection"]
};

const winterCollections = [
  {
    id: 'sweaters',
    title: 'Sweaters',
    description: 'Premium wool and cashmere sweaters',
    image: 'https://images.unsplash.com/photo-1608991466857-5aaa2e7e593f?auto=format&fit=crop&q=80',
    tag: 'winter',
    link: '/collections/winter/sweaters'
  },
  {
    id: 'boots',
    title: 'Boots',
    description: 'Weather-resistant winter boots',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80',
    tag: 'db',
    link: '/collections/winter/boots'
  },
  {
    id: 'puffer-jackets',
    title: 'Puffer Jackets',
    description: 'Warm and stylish puffer jackets',
    image: 'https://images.unsplash.com/photo-1609803384069-19f3cf521631?auto=format&fit=crop&q=80',
    tag: 'puffer',
    link: '/collections/winter/puffer-jackets'
  },
  {
    id: 'overcoats',
    title: 'Overcoats',
    description: 'Classic and modern overcoats',
    image: 'https://images.unsplash.com/photo-1608505362575-8ce12b1a56f4?auto=format&fit=crop&q=80',
    tag: 'wj',
    link: '/collections/winter/overcoats'
  }
];

export default function WinterCollection() {
  return (
    <div className="bg-white">
      <WinterCollectionSEO />
      <VideoSEO 
        video={videoData}
        pageUrl="/collections/winter"
      />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <AutoplayHLSVideo
            src={videoData.contentUrl}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Winter Collection
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Stay warm in style with our premium winter essentials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {winterCollections.map((collection) => (
            <Link
              key={collection.id}
              to={collection.link}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-2xl font-bold text-white">{collection.title}</h3>
                  <p className="text-gray-200">{collection.description}</p>
                  <div className="flex items-center text-white mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-medium">Shop Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Winter Style Guide */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Snowflake className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Winter Style Guide</h2>
            <p className="mt-4 text-lg text-gray-600">
              Master cold-weather fashion with our expert tips
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Layering Essentials</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Start with a quality base layer</li>
                <li>• Add insulating mid-layers</li>
                <li>• Finish with a weather-appropriate outer layer</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Coordination</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Stick to rich, winter-appropriate tones</li>
                <li>• Mix textures for visual interest</li>
                <li>• Use accessories for pops of color</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Protection</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Choose weather-resistant materials</li>
                <li>• Invest in quality winter boots</li>
                <li>• Don't forget winter accessories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}