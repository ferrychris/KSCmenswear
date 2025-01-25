import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface AutoplayHLSVideoProps {
  src: string;
  className?: string;
}

export function AutoplayHLSVideo({ src, className }: AutoplayHLSVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const initializeVideo = async () => {
      try {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = src;
        } else if (Hls.isSupported()) {
          // Use HLS.js
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          hls.loadSource(src);
          hls.attachMedia(video);
          hlsRef.current = hls;

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // Only attempt to play if the video is still mounted
            if (videoRef.current) {
              video.play().catch(() => {
                // Ignore play() errors since they're expected when navigating away
              });
            }
          });
        }
      } catch (error) {
        console.error('Error initializing video:', error);
      }
    };

    initializeVideo();

    // Cleanup function
    return () => {
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.removeAttribute('src');
        video.load();
      }
      hlsRef.current = null;
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}