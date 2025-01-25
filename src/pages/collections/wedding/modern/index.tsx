import { useEffect, useRef, useState } from 'react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HLSVideo } from '@/components/video/HLSVideo';
import { VideoProgressBar } from '@/components/video/VideoProgressBar';
import { VideoFeedback } from '@/components/video/VideoFeedback';

export default function ModernWeddingCollection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  // Using the same tag for now, will update when modern tags are ready
  const { products, loading, error } = useShopifyProducts('tag:rustic OR tag:rustic-wedding');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (percent: number) => {
    if (videoRef.current && duration) {
      const time = (percent / 100) * duration;
      videoRef.current.currentTime = time;
    }
  };

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
      {/* Video Section */}
      <div className="relative w-full aspect-video bg-black">
        <HLSVideo
          ref={videoRef}
          src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/manifest/video.m3u8"
          className="w-full h-full object-cover"
          autoPlay={false}
          muted={isMuted}
          controls={false}
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </button>
                <div className="flex-1 mx-4">
                  <VideoProgressBar
                    progress={progress}
                    onSeek={handleSeek}
                  />
                </div>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <Maximize2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

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
          <VideoFeedback videoId="modern-wedding" />
        </div>

        {/* Collection Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Modern Wedding Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Contemporary sophistication meets minimalist elegance in our modern wedding collection. 
            Perfect for urban venues, rooftop ceremonies, and industrial-chic celebrations.
          </p>
        </div>

        {/* Style Guide */}
        <div className="mb-12 bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
            Modern Style Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Colors & Textures</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Monochromatic palettes</li>
                <li>• Sleek, clean lines</li>
                <li>• Contemporary fabrics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Perfect Pairings</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Slim-fit silhouettes</li>
                <li>• Minimalist accessories</li>
                <li>• Geometric details</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Styling Tips</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Focus on clean lines</li>
                <li>• Choose bold statements</li>
                <li>• Embrace simplicity</li>
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