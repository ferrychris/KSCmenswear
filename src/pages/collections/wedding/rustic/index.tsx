import { useEffect, useRef, useState } from 'react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoFeedback } from '@/components/video/VideoFeedback';
import { VideoSEO } from '@/components/seo/VideoSEO';

const videoData = {
  name: "Rustic Wedding Collection 2025",
  description: "Discover our rustic wedding collection featuring timeless charm and natural elegance. Perfect for barn weddings, outdoor ceremonies, and countryside celebrations.",
  thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80",
  contentUrl: "https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/manifest/video.m3u8",
  embedUrl: "https://iframe.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb",
  uploadDate: "2024-03-01",
  duration: "PT3M",
  tags: ["rustic wedding", "barn wedding", "outdoor wedding", "countryside wedding", "2025 collection"]
};

export default function RusticWeddingCollection() {
  const { products, loading, error } = useShopifyProducts('tag:rustic OR tag:rustic-wedding');

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
        pageUrl="/collections/rustic-wedding"
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
          <VideoFeedback videoId="rustic-wedding" />
        </div>

        {/* Collection Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Rustic Wedding Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Timeless charm meets natural elegance in our rustic wedding collection. 
            Perfect for barn weddings, outdoor ceremonies, and countryside celebrations.
          </p>
        </div>

        {/* Style Guide */}
        <div className="mb-12 bg-amber-50 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-6">
            Rustic Style Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-amber-800 mb-2">Colors & Textures</h3>
              <ul className="space-y-2 text-amber-700">
                <li>• Earth tones and warm neutrals</li>
                <li>• Natural fabric textures</li>
                <li>• Vintage-inspired patterns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-amber-800 mb-2">Perfect Pairings</h3>
              <ul className="space-y-2 text-amber-700">
                <li>• Tweed and herringbone</li>
                <li>• Leather accessories</li>
                <li>• Wooden bow ties</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-amber-800 mb-2">Styling Tips</h3>
              <ul className="space-y-2 text-amber-700">
                <li>• Layer different textures</li>
                <li>• Mix vintage and modern</li>
                <li>• Add natural elements</li>
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