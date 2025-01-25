import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';
import { VideoSEO } from '@/components/seo/VideoSEO';

const suitStyles = [
  {
    id: 'two-piece',
    title: '2 Piece Suits',
    description: 'Versatile style for any occasion',
    icon: '🎩',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/5aa4d62a-c0dc-476d-09e7-c4c1da0b9700/public',
    seo: {
      alt: 'Premium two-piece suit collection',
      caption: 'Classic two-piece suits for any occasion',
      keywords: ['two piece suits', 'business suits', 'formal suits', 'classic suits']
    }
  },
  {
    id: 'double-breasted',
    title: 'Double Breasted',
    description: 'Classic sophistication with a modern twist',
    icon: '👔',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/48fa7dfa-1160-4c02-bb59-2a6ae977ed00/public',
    seo: {
      alt: 'Premium double-breasted suit collection',
      caption: 'Sophisticated double-breasted suits with modern styling',
      keywords: ['double breasted suits', 'formal suits', 'luxury suits', 'modern suits']
    }
  },
  {
    id: 'three-piece',
    title: 'Three Piece',
    description: 'Complete sophistication with matching vest',
    icon: '⭐',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/191e8a21-209d-4373-8448-897cd5853500/public',
    seo: {
      alt: 'Premium three-piece suit collection',
      caption: 'Elegant three-piece suits with matching vests',
      keywords: ['three piece suits', 'formal suits', 'wedding suits', 'business suits']
    }
  },
  {
    id: 'tuxedos',
    title: 'Tuxedos',
    description: 'Timeless elegance for formal occasions',
    icon: '✨',
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/6c0448e8-1def-4a5a-3215-7ab1ff415c00/public',
    seo: {
      alt: 'Premium tuxedo collection',
      caption: 'Classic tuxedos for black-tie events',
      keywords: ['tuxedos', 'black tie', 'formal wear', 'evening wear']
    }
  }
];

const videoData = {
  name: "Premium Suit Collections",
  description: "Explore our curated collections of premium suits, crafted for every occasion and style preference. From classic two-piece suits to elegant tuxedos.",
  thumbnailUrl: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/5aa4d62a-c0dc-476d-09e7-c4c1da0b9700/public",
  contentUrl: "https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/923e6922357e8d4044339b70a37aa6e8/manifest/video.m3u8",
  embedUrl: "https://iframe.cloudflarestream.com/923e6922357e8d4044339b70a37aa6e8",
  uploadDate: "2024-03-01",
  duration: "PT2M30S",
  tags: ["suits", "menswear", "formal wear", "tuxedos", "double breasted", "three piece"]
};

export default function SuitCollections() {
  return (
    <div className="bg-white">
      <VideoSEO 
        video={videoData}
        pageUrl="/collections/suits"
      />

      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <AutoplayHLSVideo
            src={videoData.contentUrl}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            SUIT COLLECTIONS
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Discover our curated collections of premium suits, crafted for every occasion and style preference
          </p>
          <div className="mt-10">
            <a
              href="#collections"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
            >
              View All Suits
            </a>
          </div>
        </div>
      </div>

      {/* Shop by Style Section */}
      <div id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Shop by Style</h2>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {suitStyles.map((style) => (
            <Link
              key={style.id}
              to={`/collections/suits/${style.id}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96">
                <img
                  src={style.image}
                  alt={style.seo.alt}
                  title={style.seo.caption}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-2xl font-bold text-white">{style.title}</h3>
                  <p className="text-gray-200">{style.description}</p>
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

      {/* Featured Suits Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Suits</h2>
            <Link 
              to="/collections/suits/all"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suitStyles.map((style) => (
              <div key={style.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={style.image}
                  alt={style.seo.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{style.title}</h3>
                  <div className="flex items-center mt-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">4.9</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}