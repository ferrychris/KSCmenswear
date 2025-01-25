import { forwardRef, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';

interface HLSVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const HLSVideo = forwardRef<HTMLVideoElement, HLSVideoProps>(({
  src,
  className,
  autoPlay = false,
  muted = false,
  controls = true,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const video = ref ? (ref as React.MutableRefObject<HTMLVideoElement>).current : videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    } else if (Hls.isSupported()) {
      // Use HLS.js
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, [src, ref]);

  useEffect(() => {
    const video = ref ? (ref as React.MutableRefObject<HTMLVideoElement>).current : videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [ref, isDragging]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = ref ? (ref as React.MutableRefObject<HTMLVideoElement>).current : videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const time = percent * duration;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={ref || videoRef}
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
      />

      {/* Custom Controls */}
      {controls && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300",
            (!isHovering && isPlaying) && "opacity-0"
          )}
        >
          {/* Progress Bar */}
          <div 
            className="relative h-1 bg-white/30 cursor-pointer mb-4"
            onClick={handleSeek}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div 
              className="absolute h-full bg-white"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Time Display */}
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  );
});

HLSVideo.displayName = 'HLSVideo';