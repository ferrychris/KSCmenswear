import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { performanceMonitor } from '../performance/monitor';
import type { PlaybackAnalytics, PlaybackError, VideoMetadata, VideoQuality } from './types';

export class VideoPlayer {
  private hls: any;
  private video: HTMLVideoElement | null = null;
  private cache: MemoryCache<ArrayBuffer>;
  private analytics: Map<string, PlaybackAnalytics>;
  private preloadQueue: Set<string>;
  private currentQuality: VideoQuality = 'auto';
  private errorRetries: Map<string, number>;

  constructor() {
    this.cache = new MemoryCache(100 * 1024 * 1024); // 100MB cache
    this.analytics = new Map();
    this.preloadQueue = new Set();
    this.errorRetries = new Map();
    this.initHLS();
  }

  // Initialize HLS.js
  private async initHLS() {
    try {
      const Hls = (await import('hls.js')).default;
      if (Hls.isSupported()) {
        this.hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          progressive: true,
          // Adaptive bitrate settings
          abrEwmaDefaultEstimate: 500000,
          abrEwmaFastLive: 3,
          abrEwmaSlowLive: 9,
          startLevel: -1, // Auto quality selection
          // Error recovery
          fragLoadingMaxRetry: 3,
          manifestLoadingMaxRetry: 3,
          levelLoadingMaxRetry: 3,
        });

        this.setupHLSListeners();
      }
    } catch (error) {
      console.error('Failed to initialize HLS:', error);
    }
  }

  // Attach video element and load source
  async attachVideo(
    videoElement: HTMLVideoElement,
    src: string,
    options: VideoPlayerOptions = {}
  ): Promise<void> {
    try {
      this.video = videoElement;
      
      if (this.hls) {
        this.hls.loadSource(src);
        this.hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = src;
      }

      this.setupVideoListeners();
      this.setInitialQuality(options.initialQuality);
      this.startAnalytics(src);

      if (options.preload) {
        this.preloadVideo(src);
      }
    } catch (error) {
      this.handleError('attach', error);
    }
  }

  // Quality management
  setQuality(quality: VideoQuality): void {
    if (!this.hls) return;

    const levels = this.hls.levels;
    if (quality === 'auto') {
      this.hls.currentLevel = -1;
    } else {
      const levelIndex = levels.findIndex(
        (level: any) => level.height === parseInt(quality)
      );
      if (levelIndex !== -1) {
        this.hls.currentLevel = levelIndex;
      }
    }

    this.currentQuality = quality;
  }

  // Preloading strategy
  async preloadVideo(src: string): Promise<void> {
    if (this.preloadQueue.has(src) || this.cache.get(src)) return;

    try {
      this.preloadQueue.add(src);
      const response = await fetch(src);
      const buffer = await response.arrayBuffer();
      this.cache.set(src, buffer);
    } catch (error) {
      this.handleError('preload', error);
    } finally {
      this.preloadQueue.delete(src);
    }
  }

  // Thumbnail generation
  async generateThumbnail(
    time: number,
    options: ThumbnailOptions = {}
  ): Promise<string> {
    if (!this.video) throw new Error('No video attached');

    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Failed to get canvas context');

      const { width = 160, height = 90, quality = 0.7 } = options;
      canvas.width = width;
      canvas.height = height;

      this.video.currentTime = time;
      await new Promise(resolve => this.video!.addEventListener('seeked', resolve, { once: true }));

      context.drawImage(this.video, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', quality);
    } catch (error) {
      this.handleError('thumbnail', error);
      throw error;
    }
  }

  // Analytics
  getAnalytics(videoId: string): PlaybackAnalytics | undefined {
    return this.analytics.get(videoId);
  }

  // Memory management
  dispose(): void {
    if (this.hls) {
      this.hls.destroy();
    }
    this.removeVideoListeners();
    this.cache.clear();
    this.analytics.clear();
    this.preloadQueue.clear();
    this.errorRetries.clear();
    this.video = null;
  }

  // Private helper methods
  private setupHLSListeners(): void {
    if (!this.hls) return;

    this.hls.on(Hls.Events.MANIFEST_PARSED, (_: any, data: any) => {
      this.trackAnalytics('manifest_parsed', {
        levels: data.levels.length,
        duration: data.duration,
      });
    });

    this.hls.on(Hls.Events.ERROR, (_: any, data: any) => {
      this.handleHLSError(data);
    });

    this.hls.on(Hls.Events.LEVEL_SWITCHED, (_: any, data: any) => {
      this.trackAnalytics('quality_changed', {
        level: data.level,
        bitrate: this.hls.levels[data.level]?.bitrate,
      });
    });
  }

  private setupVideoListeners(): void {
    if (!this.video) return;

    const events = [
      'loadstart',
      'progress',
      'play',
      'pause',
      'seeking',
      'seeked',
      'waiting',
      'playing',
      'error',
    ];

    events.forEach(event => {
      this.video!.addEventListener(event, () => {
        this.trackAnalytics(event, {
          currentTime: this.video!.currentTime,
          buffered: this.getBufferedRanges(),
        });
      });
    });
  }

  private removeVideoListeners(): void {
    if (!this.video) return;

    const events = [
      'loadstart',
      'progress',
      'play',
      'pause',
      'seeking',
      'seeked',
      'waiting',
      'playing',
      'error',
    ];

    events.forEach(event => {
      this.video!.removeEventListener(event, () => {});
    });
  }

  private handleError(type: string, error: unknown): void {
    const playbackError: PlaybackError = {
      type,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      retryCount: (this.errorRetries.get(type) || 0) + 1,
    };

    this.errorRetries.set(type, playbackError.retryCount);
    this.trackAnalytics('error', playbackError);

    if (playbackError.retryCount <= 3) {
      setTimeout(() => {
        this.retryOperation(type);
      }, 1000 * playbackError.retryCount);
    }
  }

  private handleHLSError(data: any): void {
    const { type, details, fatal } = data;
    
    if (fatal) {
      switch (type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          this.hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this.hls.recoverMediaError();
          break;
        default:
          this.hls.destroy();
          break;
      }
    }

    this.trackAnalytics('hls_error', { type, details, fatal });
  }

  private retryOperation(type: string): void {
    switch (type) {
      case 'attach':
        if (this.video && this.hls) {
          this.hls.attachMedia(this.video);
        }
        break;
      case 'preload':
        // Retry preloading will be handled by the preload queue
        break;
      default:
        break;
    }
  }

  private startAnalytics(videoId: string): void {
    const analytics: PlaybackAnalytics = {
      videoId,
      startTime: new Date().toISOString(),
      events: [],
      errors: [],
      qualityChanges: [],
      bufferHealth: [],
      performance: {
        loadTime: 0,
        seekLatency: [],
        bitrateChanges: [],
      },
    };

    this.analytics.set(videoId, analytics);
  }

  private trackAnalytics(event: string, data: any): void {
    if (!this.video) return;

    const videoId = this.video.src;
    const analytics = this.analytics.get(videoId);
    if (!analytics) return;

    const timestamp = new Date().toISOString();

    analytics.events.push({
      type: event,
      timestamp,
      data,
    });

    // Track performance metrics
    switch (event) {
      case 'loadstart':
        analytics.performance.loadTime = performance.now();
        break;
      case 'seeked':
        analytics.performance.seekLatency.push(performance.now() - data.seekStartTime);
        break;
      case 'quality_changed':
        analytics.performance.bitrateChanges.push({
          timestamp,
          bitrate: data.bitrate,
        });
        break;
    }

    // Monitor buffer health
    analytics.bufferHealth.push({
      timestamp,
      ranges: this.getBufferedRanges(),
    });

    performanceMonitor.trackMetric('video_playback', {
      event,
      timestamp,
      data,
    });
  }

  private getBufferedRanges(): Array<{ start: number; end: number }> {
    if (!this.video) return [];

    const ranges = [];
    for (let i = 0; i < this.video.buffered.length; i++) {
      ranges.push({
        start: this.video.buffered.start(i),
        end: this.video.buffered.end(i),
      });
    }
    return ranges;
  }

  private setInitialQuality(quality?: VideoQuality): void {
    if (quality) {
      this.setQuality(quality);
    }
  }
}

// Types and validation
interface VideoPlayerOptions {
  initialQuality?: VideoQuality;
  preload?: boolean;
  autoplay?: boolean;
  muted?: boolean;
}

interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
}

// Validation schemas
export const VideoPlayerOptionsSchema = z.object({
  initialQuality: z.enum(['auto', '240', '360', '480', '720', '1080']).optional(),
  preload: z.boolean().optional(),
  autoplay: z.boolean().optional(),
  muted: z.boolean().optional(),
});

export const ThumbnailOptionsSchema = z.object({
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
  quality: z.number().min(0).max(1).optional(),
});