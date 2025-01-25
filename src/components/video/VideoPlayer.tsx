import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Rewind, FastForward, PictureInPicture } from 'lucide-react';
import { HLSVideo } from './HLSVideo';
import { VideoProgressBar } from './VideoProgressBar';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export function VideoPlayer({ src, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleEnteredPiP = () => setIsPiPActive(true);
    const handleExitedPiP = () => setIsPiPActive(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('enterpictureinpicture', handleEnteredPiP);
    video.addEventListener('leavepictureinpicture', handleExitedPiP);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('enterpictureinpicture', handleEnteredPiP);
      video.removeEventListener('leavepictureinpicture', handleExitedPiP);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to toggle Picture-in-Picture:', error);
    }
  };

  const handleSeek = (percent: number) => {
    if (!videoRef.current || !duration) return;
    const time = (percent / 100) * duration;
    videoRef.current.currentTime = time;
  };

  const handleRewind = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
  };

  const handleFastForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
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
      <HLSVideo
        ref={videoRef}
        src={src}
        className={className}
        autoPlay={false}
        muted={isMuted}
        controls={false}
      />

      {/* Custom Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300",
          (!isHovering && isPlaying) && "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <VideoProgressBar
          progress={progress}
          onSeek={handleSeek}
          className="mb-4"
        />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Rewind */}
            <button
              onClick={handleRewind}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <Rewind className="h-5 w-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            {/* Fast Forward */}
            <button
              onClick={handleFastForward}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fast forward 10 seconds"
            >
              <FastForward className="h-5 w-5" />
            </button>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            {/* Time Display */}
            <div className="text-white text-sm">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Picture-in-Picture */}
            <button
              onClick={togglePiP}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label={isPiPActive ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}
            >
              <PictureInPicture className="h-5 w-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}