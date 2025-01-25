import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuickLinks } from '@/components/prom/QuickLinks';
import { CollectionsGrid } from '@/components/prom/CollectionsGrid';
import { ServicesSection } from '@/components/prom/ServicesSection';
import { useGesture } from '@/hooks/useGesture';
import { cn } from '@/lib/utils';
import { Heart, Share2, Calendar, Phone, Crown, ArrowRight, Video } from 'lucide-react';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';
import { PromHomePageSEO } from '@/components/seo/PromHomePageSEO';
import { adTracker } from '@/lib/ad';

const videos = {
  hero: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/3888d03796d30587bf34e9db80618f65/manifest/video.m3u8',
};

export default function PromHome() {
  const [activeTab, setActiveTab] = useState('featured');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const pullToRefreshRef = useGesture({
    onPan: (state) => {
      if (window.scrollY === 0 && state.distance.y > 50) {
        setIsRefreshing(true);
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1500);
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookAppointment = () => {
    adTracker.trackCustomEvent('prom_cta_click', {
      action: 'book_appointment',
      location: 'prom_hero'
    });
  };

  const handleContactClick = () => {
    adTracker.trackCustomEvent('prom_cta_click', {
      action: 'contact',
      location: 'prom_hero'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'featured':
        return (
          <>
            {/* Quick Links */}
            <div className="mt-48 lg:mt-32">
              <QuickLinks />
            </div>

            {/* Video Feed Button */}
            <div className="mt-24 text-center">
              <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Style Videos
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Get inspired with our latest prom looks and style tips
                </p>
                <Link
                  to="/prom/videos"
                  className="mt-8 inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Watch Style Videos
                </Link>
              </div>
            </div>

            {/* Collections Grid */}
            <div className="mt-24">
              <CollectionsGrid />
            </div>

            {/* CTA Section */}
            <div className="mt-24 relative">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&q=80"
                  alt="Prom 2025"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />
              </div>
              
              <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:items-center">
                  {/* Left Column */}
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                      Make Your Prom Night Unforgettable
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                      Book your appointment today and work with our expert stylists to create the perfect prom look. Exclusive styles, expert tailoring, and a perfect fit guaranteed.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/appointment"
                        onClick={handleBookAppointment}
                        className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Book Your Fitting
                      </Link>
                      <a
                        href="tel:+12693421234"
                        onClick={handleContactClick}
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
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-black font-bold">1</span>
                          <span className="ml-3">Exclusive sparkle blazer collection</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-black font-bold">2</span>
                          <span className="ml-3">Free alterations with every purchase</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-black font-bold">3</span>
                          <span className="ml-3">Group discounts available</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-black font-bold">4</span>
                          <span className="ml-3">Perfect fit guarantee</span>
                        </li>
                      </ul>
                      <Link
                        to="/collections/sparkle-blazers"
                        className="inline-flex items-center text-purple-300 hover:text-purple-200 mt-4"
                      >
                        View Sparkle Blazer Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="mt-24">
              <ServicesSection />
            </div>
          </>
        );
      case 'trending':
        return (
          <div className="px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Now</h2>
            <div className="text-center text-gray-600">
              Coming soon! Check back for trending styles.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen" ref={pullToRefreshRef}>
      <PromHomePageSEO />

      {/* Hero Section */}
      <div className="relative h-screen">
        <AutoplayHLSVideo
          src={videos.hero}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Perfect Prom Look Awaits
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl">
            Discover our exclusive collection of designer tuxedos and suits
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/appointment"
              onClick={handleBookAppointment}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Link>
            
            <Link
              to="/contact"
              onClick={handleContactClick}
              className="inline-flex items-center px-6 py-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="container mx-auto px-4 pb-24">
        {/* Tab Navigation */}
        <div className="flex justify-center mt-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('featured')}
            className={cn(
              'px-4 py-2 font-medium text-sm',
              activeTab === 'featured'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={cn(
              'px-4 py-2 font-medium text-sm',
              activeTab === 'trending'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Trending
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Pull to Refresh Indicator */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 h-1 bg-black/10 transition-transform duration-300',
          isRefreshing ? 'scale-x-100' : 'scale-x-0'
        )}
      >
        <div className="h-full w-full bg-black/20 animate-pulse" />
      </div>
    </div>
  );
}