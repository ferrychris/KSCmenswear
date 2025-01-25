import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookAppointmentModal } from '@/components/wedding/BookAppointmentModal';
import { QuickLinks } from '@/components/home/QuickLinks';
import { CollectionsGrid } from '@/components/home/CollectionsGrid';
import { ServicesSection } from '@/components/home/ServicesSection';
import { Sparkles, Heart, Play, Pause, Ruler, Phone, MapPin, Star } from 'lucide-react';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';
import { HomePageSEO } from '@/components/seo/HomePageSEO';
import { VideoPlayer } from '@/components/video/VideoPlayer';

const videos = {
  header: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/386f4bbf90dba1c6c0a3a33a3e9b6764/manifest/video.m3u8',
  prom: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/6003e03beafc379e3f4fb5b81b703b84/manifest/video.m3u8',
  wedding: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/b8b22c5f800cce8f5969ebe4f1eec173/manifest/video.m3u8',
  rustic: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/manifest/video.m3u8'
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white">
      <HomePageSEO />
      
      {/* Hero Video Header */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <AutoplayHLSVideo
            src={videos.header}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Tailored Perfection
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Handcrafted suits for the modern gentleman
          </p>
          <Link
            to="/collections/suits"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            Explore Suits
          </Link>
        </div>
      </div>
      
      {/* Large Buttons Section */}
      <div className="relative -mt-32 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prom Button */}
            <Link
              to="/prom"
              className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute inset-0">
                <AutoplayHLSVideo
                  src={videos.prom}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              </div>
              <div className="relative p-12 flex flex-col items-center text-center min-h-[400px] justify-center">
                <Sparkles className="h-12 w-12 text-purple-400 mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">Prom 2024</h2>
                <p className="text-xl text-gray-200 mb-8">Make your night unforgettable</p>
                <span className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-full transition-colors hover:bg-purple-700">
                  Explore Prom Collection
                </span>
              </div>
            </Link>

            {/* Wedding Button */}
            <Link
              to="/wedding"
              className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute inset-0">
                <AutoplayHLSVideo
                  src={videos.wedding}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              </div>
              <div className="relative p-12 flex flex-col items-center text-center min-h-[400px] justify-center">
                <Heart className="h-12 w-12 text-rose-400 mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">Wedding 2024</h2>
                <p className="text-xl text-gray-200 mb-8">Create your perfect wedding look</p>
                <span className="inline-flex items-center justify-center px-8 py-4 bg-rose-600 text-white text-lg font-semibold rounded-full transition-colors hover:bg-rose-700">
                  Explore Wedding Collection
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-24">
        <QuickLinks />
      </div>

      {/* Collections Grid */}
      <div className="mt-24">
        <CollectionsGrid />
      </div>

      {/* Rustic Wedding Collection Section */}
      <div className="mt-24">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Rustic Wedding Collection
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Timeless charm meets natural elegance
          </p>
        </div>

        {/* Video Section */}
        <div className="relative w-full aspect-video bg-black">
          <VideoPlayer
            src={videos.rustic}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Explore Button */}
        <div className="text-center mt-8">
          <Link
            to="/collections/rustic-wedding"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-24">
        <ServicesSection />
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}