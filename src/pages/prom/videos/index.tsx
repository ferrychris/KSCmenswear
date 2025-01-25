import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Hls from 'hls.js';

interface Video {
  id: string;
  src: string;
  title: string;
  description: string;
  productLink?: string;
  likes?: number;
}

export default function PromVideos() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const hlsInstances = useRef<(Hls | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const videos: Video[] = [
    {
      id: 'a9ab22d2732a9eccfe01085f0127188f',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/a9ab22d2732a9eccfe01085f0127188f/manifest/video.m3u8',
      title: 'Prom Style Inspiration',
      description: 'Get inspired with our latest prom looks and styles',
      likes: 124,
      productLink: '/collections/sparkle-blazers'
    },
    {
      id: 'e5193da33f11d8a7c9e040d49d89da68',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/e5193da33f11d8a7c9e040d49d89da68/manifest/video.m3u8',
      title: 'Sparkle Blazer Collection',
      description: 'Stand out with our exclusive sparkle blazers',
      likes: 98,
      productLink: '/collections/sparkle-blazers'
    },
    {
      id: '2e3811499ae08de6d3a57c9811fe6c6c',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/2e3811499ae08de6d3a57c9811fe6c6c/manifest/video.m3u8',
      title: 'Modern Tuxedo Styles',
      description: 'Classic elegance meets modern design',
      likes: 156,
      productLink: '/collections/prom-tuxedos'
    },
    {
      id: '0e292b2b0a7d9e5b9a0ced80590d4898',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/0e292b2b0a7d9e5b9a0ced80590d4898/manifest/video.m3u8',
      title: 'Prom Night Essentials',
      description: 'Complete your perfect prom look',
      likes: 89,
      productLink: '/collections/prom-accessories'
    },
    {
      id: '89027eb56b4470a759bb0bd6e83ebac4',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/89027eb56b4470a759bb0bd6e83ebac4/manifest/video.m3u8',
      title: 'Color Trends 2025',
      description: 'Discover the hottest colors for prom season',
      likes: 167,
      productLink: '/collections/prom'
    },
    {
      id: 'a069add00bdc6e25e89bfeb59d243311',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/a069add00bdc6e25e89bfeb59d243311/manifest/video.m3u8',
      title: 'Styling Tips & Tricks',
      description: 'Expert advice for your perfect look',
      likes: 145,
      productLink: '/collections/prom-accessories'
    },
    {
      id: '965c2718880583e88f4d879d3c2d2122',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/965c2718880583e88f4d879d3c2d2122/manifest/video.m3u8',
      title: 'Behind the Scenes',
      description: 'Take a peek at our latest photo shoot',
      likes: 112,
      productLink: '/collections/prom'
    },
    {
      id: 'f380c467a2cad915c1bc77f0e05feee4',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/f380c467a2cad915c1bc77f0e05feee4/manifest/video.m3u8',
      title: 'Accessory Guide',
      description: 'Perfect finishing touches for your outfit',
      likes: 134,
      productLink: '/collections/prom-accessories'
    },
    {
      id: '5ca7d4ab2ccc70679cdf6da96539dba5',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5ca7d4ab2ccc70679cdf6da96539dba5/manifest/video.m3u8',
      title: 'Group Style Ideas',
      description: 'Coordinate with your prom squad',
      likes: 178,
      productLink: '/collections/prom'
    },
    {
      id: '8ce1e2f11c8672a5ed7f176cc483817e',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/8ce1e2f11c8672a5ed7f176cc483817e/manifest/video.m3u8',
      title: 'Trending Now',
      description: 'See what\'s hot this prom season',
      likes: 203,
      productLink: '/collections/new-arrivals'
    },
    {
      id: 'efaf442247a5e3364fe3018f9a56972a',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/efaf442247a5e3364fe3018f9a56972a/manifest/video.m3u8',
      title: 'Style Spotlight',
      description: 'Featured looks and designer pieces',
      likes: 167,
      productLink: '/collections/prom'
    },
    {
      id: '77c515b506bf3898f7240f3d902f55c7',
      src: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/77c515b506bf3898f7240f3d902f55c7/manifest/video.m3u8',
      title: 'Red Collection Preview',
      description: 'Exclusive look at our red collection',
      likes: 145,
      productLink: '/collections/2025-ultimate-red-collection-for-men-red-suits-shoes-accessories-kct-menswear'
    }
  ];

  useEffect(() => {
    // Initialize video refs and HLS instances arrays
    videoRefs.current = videoRefs.current.slice(0, videos.length);
    hlsInstances.current = hlsInstances.current.slice(0, videos.length);
    
    // Setup Intersection Observer for each video
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const index = parseInt(video.dataset.index || '0');
          
          if (entry.isIntersecting) {
            initializeVideo(index);
            setCurrentVideo(index);
          } else {
            // Cleanup video when out of view
            if (hlsInstances.current[index]) {
              hlsInstances.current[index]?.destroy();
              hlsInstances.current[index] = null;
            }
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      {
        threshold: 0.7, // 70% of the video must be visible
      }
    );

    // Observe all videos
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) observer.observe(videoRef);
    });

    return () => {
      observer.disconnect();
      // Cleanup all HLS instances
      hlsInstances.current.forEach(hls => hls?.destroy());
    };
  }, [videos]);

  const initializeVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const videoSrc = videos[index].src;

    // Cleanup existing HLS instance if any
    if (hlsInstances.current[index]) {
      hlsInstances.current[index]?.destroy();
      hlsInstances.current[index] = null;
    }

    // Check for native HLS support (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.play().catch(console.error);
    }
    // Use HLS.js if supported
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error);
      });

      hlsInstances.current[index] = hls;
    }
  };

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleLike = (videoId: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(videoId)) {
      newLiked.delete(videoId);
    } else {
      newLiked.add(videoId);
    }
    setLiked(newLiked);
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (!containerRef.current) return;
    
    const nextVideo = direction === 'up' ? currentVideo - 1 : currentVideo + 1;
    if (nextVideo >= 0 && nextVideo < videos.length) {
      containerRef.current.scrollTo({
        top: nextVideo * window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Link 
          to="/prom"
          className="inline-flex items-center text-white hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Prom
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-400">
              Our video collection is being prepared. Check back soon!
            </p>
          </div>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {videos.map((video, index) => (
            <div 
              key={video.id}
              className="h-screen snap-start relative"
            >
              <video
                ref={el => videoRefs.current[index] = el}
                data-index={index}
                className="h-full w-full object-cover"
                loop
                playsInline
                onClick={() => handleVideoClick(index)}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/20">
                {/* Video Info */}
                <div className="absolute bottom-20 left-4 right-16 text-white">
                  <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                  <p className="text-sm">{video.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                  <button 
                    onClick={() => handleLike(video.id)}
                    className={cn(
                      "p-3 rounded-full bg-black/20 backdrop-blur-sm transition-colors",
                      liked.has(video.id) && "text-red-500"
                    )}
                  >
                    <Heart className="h-6 w-6" fill={liked.has(video.id) ? "currentColor" : "none"} />
                    <span className="text-xs mt-1">{video.likes || 0}</span>
                  </button>

                  <button className="p-3 rounded-full bg-black/20 backdrop-blur-sm">
                    <Share2 className="h-6 w-6" />
                  </button>

                  {video.productLink && (
                    <Link 
                      to={video.productLink}
                      className="p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                    >
                      <ShoppingBag className="h-6 w-6" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Scroll Indicators */}
              {index > 0 && (
                <button
                  onClick={() => handleScroll('up')}
                  className="absolute top-20 left-1/2 -translate-x-1/2 text-white/80 hover:text-white"
                >
                  ↑ Swipe up for previous
                </button>
              )}
              {index < videos.length - 1 && (
                <button
                  onClick={() => handleScroll('down')}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 hover:text-white"
                >
                  Swipe down for next ↓
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}