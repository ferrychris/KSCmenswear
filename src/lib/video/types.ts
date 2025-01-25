export type VideoQuality = 'auto' | '240' | '360' | '480' | '720' | '1080';

export interface VideoMetadata {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  qualities: VideoQuality[];
  hlsUrl: string;
  size: number;
}

export interface PlaybackAnalytics {
  videoId: string;
  startTime: string;
  events: PlaybackEvent[];
  errors: PlaybackError[];
  qualityChanges: QualityChange[];
  bufferHealth: BufferHealth[];
  performance: {
    loadTime: number;
    seekLatency: number[];
    bitrateChanges: BitrateChange[];
  };
}

export interface PlaybackEvent {
  type: string;
  timestamp: string;
  data: any;
}

export interface PlaybackError {
  type: string;
  message: string;
  timestamp: string;
  retryCount: number;
}

export interface QualityChange {
  timestamp: string;
  from: VideoQuality;
  to: VideoQuality;
  reason: 'auto' | 'manual' | 'bandwidth' | 'error';
}

export interface BufferHealth {
  timestamp: string;
  ranges: Array<{
    start: number;
    end: number;
  }>;
}

export interface BitrateChange {
  timestamp: string;
  bitrate: number;
}