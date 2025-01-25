import { useState, useEffect } from 'react';
import { BookAppointmentModal } from '@/components/wedding/BookAppointmentModal';
import { HeroCarousel } from '@/components/wedding/HeroCarousel';
import { QuickLinks } from '@/components/wedding/QuickLinks';
import { CollectionsGrid } from '@/components/wedding/CollectionsGrid';
import { ServicesSection } from '@/components/wedding/ServicesSection';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, Phone } from 'lucide-react';
import { WeddingHomePageSEO } from '@/components/seo/WeddingHomePageSEO';

const videos = {
  hero: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/b8b22c5f800cce8f5969ebe4f1eec173/manifest/video.m3u8',
};

export default function WeddingHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <WeddingHomePageSEO />

      {/* Hero Section */}
      <HeroCarousel videoSrc={videos.hero} />
      
      {/* Quick Links */}
      <div className="relative -mt-32 z-10">
        <QuickLinks />
      </div>

      {/* Collections Grid */}
      <div className="mt-24">
        <CollectionsGrid />
      </div>

      {/* Services Section */}
      <div className="mt-24">
        <ServicesSection />
      </div>

      {/* Call to Action Section */}
      <div className="relative bg-charcoal-900 mt-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"
            alt="Wedding suits and tuxedos"
            className="h-full w-full object-cover opacity-25"
          />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:items-center">
            {/* Left Column */}
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Let's Create Your Perfect Wedding Look
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                With over 40 years of experience, our expert stylists will help you find the perfect attire for your special day. Book your appointment today and experience the KCT difference.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-md bg-burgundy-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-burgundy-700 transition-colors"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Consultation
                </button>
                <a
                  href="tel:+12693421234"
                  className="inline-flex items-center justify-center rounded-md bg-white/10 backdrop-blur-sm px-6 py-3 text-base font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call (269) 342-1234
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
              <div className="text-white space-y-6">
                <h3 className="text-2xl font-semibold">Why Choose KCT Menswear?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-500 flex items-center justify-center text-charcoal-900 font-bold">1</span>
                    <span className="ml-3">Expert stylists with decades of experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-500 flex items-center justify-center text-charcoal-900 font-bold">2</span>
                    <span className="ml-3">Complimentary alterations with every purchase</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-500 flex items-center justify-center text-charcoal-900 font-bold">3</span>
                    <span className="ml-3">Group coordination for wedding parties</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-500 flex items-center justify-center text-charcoal-900 font-bold">4</span>
                    <span className="ml-3">Price match guarantee on identical items</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}