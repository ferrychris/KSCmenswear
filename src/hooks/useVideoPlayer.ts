import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoPlayer } from '@/lib/video/player';
import type { VideoQuality, PlaybackAnalytics } from '@/lib/video/types';

export function useVideoPlayer() {
  const playerRef = useRef<VideoPlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quality, setQuality] = useState<VideoQuality>('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<PlaybackAnalytics | undefined>();

  useEffect(() => {
    playerRef.current = new VideoPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  const loadVideo = useCallback(async (
    src: string,
    options?: {
      initialQuality?: VideoQuality;
      preload?: boolean;
      autoplay?: boolean;
      muted?: boolean;
    }
  ) => {
    if (!playerRef.current || !videoRef.current) return;

    try {
      setLoading(true);
      setError(null);
      await playerRef.current.attachVideo(videoRef.current, src, options);
      setQuality(options?.initialQuality || 'auto');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load video');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeQuality = useCallback((newQuality: VideoQuality) => {
    if (!playerRef.current) return;
    playerRef.current.setQuality(newQuality);
    setQuality(newQuality);
  }, []);

  const generateThumbnail = useCallback(async (
    time: number,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ) => {
    if (!playerRef.current) return null;
    return playerRef.current.generateThumbnail(time, options);
  }, []);

  const getAnalytics = useCallback(() => {
    if (!playerRef.current || !videoRef.current) return;
    const videoAnalytics = playerRef.current.getAnalytics(videoRef.current.src);
    setAnalytics(videoAnalytics);
    return videoAnalytics;
  }, []);

  return {
    videoRef,
    quality,
    loading,
    error,
    analytics,
    loadVideo,
    changeQuality,
    generateThumbnail,
    getAnalytics,
  };
}