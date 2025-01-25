import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';

type AnimationState = 'idle' | 'running' | 'paused' | 'finished';
type EasingFunction = (t: number) => number;

export class AnimationEngine {
  private animations: Map<string, Animation>;
  private observers: Set<(state: AnimationState) => void>;
  private prefersReducedMotion: boolean;

  constructor() {
    this.animations = new Map();
    this.observers = new Set();
    this.prefersReducedMotion = this.checkReducedMotion();
    this.initializeMediaQueryListener();
  }

  // Animation Registration
  register(id: string, options: AnimationOptions): void {
    if (this.animations.has(id)) {
      throw new Error(`Animation with id ${id} already exists`);
    }

    const animation = new Animation(options);
    this.animations.set(id, animation);
  }

  // Animation Control
  play(id: string): void {
    const animation = this.getAnimation(id);
    if (this.prefersReducedMotion && !animation.options.ignoreReducedMotion) {
      animation.skipToEnd();
      return;
    }
    animation.play();
    this.notifyObservers(animation.state);
  }

  pause(id: string): void {
    const animation = this.getAnimation(id);
    animation.pause();
    this.notifyObservers(animation.state);
  }

  reset(id: string): void {
    const animation = this.getAnimation(id);
    animation.reset();
    this.notifyObservers(animation.state);
  }

  // State Management
  getState(id: string): AnimationState {
    return this.getAnimation(id).state;
  }

  // Observer Pattern
  subscribe(callback: (state: AnimationState) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  // Performance Monitoring
  getPerformanceMetrics(id: string): AnimationMetrics {
    return this.getAnimation(id).metrics;
  }

  // Accessibility
  private checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private initializeMediaQueryListener(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      this.handleReducedMotionChange();
    });
  }

  private handleReducedMotionChange(): void {
    this.animations.forEach((animation) => {
      if (this.prefersReducedMotion && !animation.options.ignoreReducedMotion) {
        animation.skipToEnd();
      }
    });
  }

  // Utility Methods
  private getAnimation(id: string): Animation {
    const animation = this.animations.get(id);
    if (!animation) {
      throw new Error(`Animation with id ${id} not found`);
    }
    return animation;
  }

  private notifyObservers(state: AnimationState): void {
    this.observers.forEach((observer) => observer(state));
  }
}

class Animation {
  private startTime: number | null = null;
  private pausedTime: number | null = null;
  state: AnimationState = 'idle';
  metrics: AnimationMetrics = {
    frameCount: 0,
    averageFrameTime: 0,
    totalTime: 0,
    dropped: 0,
  };

  constructor(public options: AnimationOptions) {
    this.validateOptions();
  }

  play(): void {
    if (this.state === 'running') return;

    if (this.pausedTime) {
      this.startTime = performance.now() - (this.pausedTime - (this.startTime || 0));
      this.pausedTime = null;
    } else {
      this.startTime = performance.now();
    }

    this.state = 'running';
    this.animate();
  }

  pause(): void {
    if (this.state !== 'running') return;
    this.pausedTime = performance.now();
    this.state = 'paused';
  }

  reset(): void {
    this.startTime = null;
    this.pausedTime = null;
    this.state = 'idle';
    this.options.onReset?.();
  }

  skipToEnd(): void {
    this.options.onUpdate?.(1);
    this.options.onComplete?.();
    this.state = 'finished';
  }

  private animate = (): void => {
    if (this.state !== 'running' || !this.startTime) return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.options.duration, 1);
    const easedProgress = this.options.easing?.(progress) ?? progress;

    // Update metrics
    this.updateMetrics(currentTime);

    // Execute animation frame
    this.options.onUpdate?.(easedProgress);

    if (progress < 1) {
      requestAnimationFrame(this.animate);
    } else {
      this.options.onComplete?.();
      this.state = 'finished';
    }
  };

  private validateOptions(): void {
    AnimationOptionsSchema.parse(this.options);
  }

  private updateMetrics(currentTime: number): void {
    this.metrics.frameCount++;
    const frameDuration = currentTime - (this.startTime || 0);
    this.metrics.totalTime = frameDuration;
    this.metrics.averageFrameTime = frameDuration / this.metrics.frameCount;

    // Detect dropped frames (assuming 60fps)
    if (frameDuration > 16.67) {
      this.metrics.dropped++;
    }

    // Report metrics
    performanceMonitor.trackCustomMetric('animation_performance', {
      frameCount: this.metrics.frameCount,
      averageFrameTime: this.metrics.averageFrameTime,
      droppedFrames: this.metrics.dropped,
    });
  }
}

// Types and Validation
interface AnimationOptions {
  duration: number;
  easing?: EasingFunction;
  ignoreReducedMotion?: boolean;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  onReset?: () => void;
}

interface AnimationMetrics {
  frameCount: number;
  averageFrameTime: number;
  totalTime: number;
  dropped: number;
}

const AnimationOptionsSchema = z.object({
  duration: z.number().min(0),
  easing: z.function().optional(),
  ignoreReducedMotion: z.boolean().optional(),
  onUpdate: z.function().optional(),
  onComplete: z.function().optional(),
  onReset: z.function().optional(),
});

// Easing Functions
export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
};