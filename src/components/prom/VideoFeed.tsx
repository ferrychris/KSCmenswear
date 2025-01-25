import { useState, useRef, useEffect } from 'react';
import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Video {
  id: string;
  src: string;
  title: string;
  description: string;
  productLink?: string;
  likes?: number;
}

interface VideoFeedProps {
  videos: Video[];
}

export function VideoFeed({ videos }: VideoFeedProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize video refs array
    videoRefs.current = videoRefs.current.slice(0, videos.length);
    
    // Setup Intersection Observer for each video
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play();
            setCurrentVideo(parseInt(video.dataset.index || '0'));
          } else {
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

    return () => observer.disconnect();
  }, [videos]);

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
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
    <div 
      ref={containerRef}
      className="h-[100vh] overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {videos.map((video, index) => (
        <div 
          key={video.id}
          className="h-[100vh] snap-start relative"
        >
          <video
            ref={el => videoRefs.current[index] = el}
            data-index={index}
            src={video.src}
            className="h-full w-full object-cover"
            loop
            muted
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
              className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 hover:text-white"
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
  );
}