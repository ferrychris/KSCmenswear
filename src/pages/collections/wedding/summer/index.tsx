import { useEffect, useRef, useState } from 'react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoFeedback } from '@/components/video/VideoFeedback';
import { VideoSEO } from '@/components/seo/VideoSEO';

const videoData = {
  name: "Summer Wedding Collection 2025",
  description: "Light and airy elegance for your perfect summer celebration. Discover our collection of premium wedding attire perfect for garden parties, beach ceremonies, and outdoor receptions.",
  thumbnailUrl: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80",
  contentUrl: "https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/13fd091d1a06c7cab8c60af9dffc6874/manifest/video.m3u8",
  embedUrl: "https://iframe.cloudflarestream.com/13fd091d1a06c7cab8c60af9dffc6874",
  uploadDate: "2024-03-01",
  duration: "PT3M",
  tags: ["summer wedding", "beach wedding", "garden wedding", "outdoor wedding", "2025 collection"]
};

export default function SummerWeddingCollection() {
  const { products, loading, error } = useShopifyProducts('tag:summer-wedding');

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
      <VideoSEO 
        video={videoData}
        pageUrl="/collections/summer-wedding"
      />

      {/* Video Section */}
      <div className="relative w-full aspect-video bg-black">
        <VideoPlayer
          src={videoData.contentUrl}
          className="w-full h-full object-cover"
        />

        {/* Back Button */}
        <Link
          to="/wedding"
          className="absolute top-4 left-4 inline-flex items-center text-white hover:text-gray-200 z-10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Wedding Collections
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Feedback Section */}
        <div className="mt-8 mb-16">
          <VideoFeedback videoId="summer-wedding" />
        </div>

        {/* Collection Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Summer Wedding Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Light and airy elegance for your perfect summer celebration. 
            Ideal for garden parties, beach ceremonies, and outdoor receptions.
          </p>
        </div>

        {/* Style Guide */}
        <div className="mb-12 bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-blue-900 mb-6">
            Summer Style Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Colors & Fabrics</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Light blues and soft neutrals</li>
                <li>• Breathable linen blends</li>
                <li>• Crisp cotton textures</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Perfect Pairings</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Lightweight suits</li>
                <li>• Pastel accessories</li>
                <li>• Floral accents</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Styling Tips</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Choose breathable materials</li>
                <li>• Opt for lighter colors</li>
                <li>• Consider venue climate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={loading} />
      </div>
    </div>
  );
}