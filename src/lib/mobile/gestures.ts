import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureState {
  startPoint: TouchPoint | null;
  currentPoint: TouchPoint | null;
  velocity: { x: number; y: number };
  distance: { x: number; y: number };
  direction: { x: number; y: number };
}

export class GestureEngine {
  private handlers: Map<string, GestureHandler>;
  private state: GestureState;
  private element: HTMLElement | null = null;
  private touchStartTime: number = 0;
  private isGestureActive: boolean = false;

  constructor() {
    this.handlers = new Map();
    this.state = this.createInitialState();
    this.bindEventListeners = this.bindEventListeners.bind(this);
    this.unbindEventListeners = this.unbindEventListeners.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  attach(element: HTMLElement): void {
    this.element = element;
    this.bindEventListeners();
  }

  detach(): void {
    if (this.element) {
      this.unbindEventListeners();
      this.element = null;
    }
  }

  on(gesture: GestureType, handler: GestureHandler): void {
    this.handlers.set(gesture, handler);
  }

  off(gesture: GestureType): void {
    this.handlers.delete(gesture);
  }

  private createInitialState(): GestureState {
    return {
      startPoint: null,
      currentPoint: null,
      velocity: { x: 0, y: 0 },
      distance: { x: 0, y: 0 },
      direction: { x: 0, y: 0 },
    };
  }

  private bindEventListeners(): void {
    if (!this.element) return;

    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd);
  }

  private unbindEventListeners(): void {
    if (!this.element) return;

    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }

  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartTime = performance.now();
    this.isGestureActive = true;

    this.state.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: this.touchStartTime,
    };

    this.state.currentPoint = { ...this.state.startPoint };
    this.triggerHandler('touchstart', this.state);
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.isGestureActive || !this.state.startPoint) return;

    const touch = event.touches[0];
    const currentTime = performance.now();
    const previousPoint = this.state.currentPoint!;

    this.state.currentPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: currentTime,
    };

    // Update gesture state
    const deltaTime = currentTime - previousPoint.timestamp;
    this.state.velocity = {
      x: (this.state.currentPoint.x - previousPoint.x) / deltaTime,
      y: (this.state.currentPoint.y - previousPoint.y) / deltaTime,
    };

    this.state.distance = {
      x: this.state.currentPoint.x - this.state.startPoint.x,
      y: this.state.currentPoint.y - this.state.startPoint.y,
    };

    this.state.direction = {
      x: Math.sign(this.state.velocity.x),
      y: Math.sign(this.state.velocity.y),
    };

    // Detect and trigger gestures
    this.detectGestures();
    this.triggerHandler('touchmove', this.state);
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (!this.isGestureActive) return;

    const endTime = performance.now();
    const duration = endTime - this.touchStartTime;

    this.triggerHandler('touchend', {
      ...this.state,
      duration,
    });

    // Reset state
    this.state = this.createInitialState();
    this.isGestureActive = false;
  }

  private detectGestures(): void {
    if (!this.state.startPoint || !this.state.currentPoint) return;

    const { distance, velocity } = this.state;
    const absDistance = {
      x: Math.abs(distance.x),
      y: Math.abs(distance.y),
    };

    // Swipe detection
    if (absDistance.x > 50 || absDistance.y > 50) {
      const isHorizontal = absDistance.x > absDistance.y;
      const direction = isHorizontal
        ? distance.x > 0 ? 'right' : 'left'
        : distance.y > 0 ? 'down' : 'up';

      this.triggerHandler('swipe', {
        ...this.state,
        direction,
        magnitude: Math.sqrt(velocity.x ** 2 + velocity.y ** 2),
      });
    }

    // Pan detection
    if (absDistance.x > 10 || absDistance.y > 10) {
      this.triggerHandler('pan', this.state);
    }
  }

  private triggerHandler(type: GestureType, data: any): void {
    const handler = this.handlers.get(type);
    if (handler) {
      handler(data);
      this.trackGestureMetrics(type, data);
    }
  }

  private trackGestureMetrics(type: string, data: any): void {
    performanceMonitor.trackCustomMetric('gesture_performance', {
      type,
      velocity: Math.sqrt(data.velocity?.x ** 2 + data.velocity?.y ** 2) || 0,
      duration: data.duration || 0,
    });
  }
}

// Types
type GestureType = 'touchstart' | 'touchmove' | 'touchend' | 'swipe' | 'pan';
type GestureHandler = (data: any) => void;

// Validation
const TouchPointSchema = z.object({
  x: z.number(),
  y: z.number(),
  timestamp: z.number(),
});

const GestureStateSchema = z.object({
  startPoint: TouchPointSchema.nullable(),
  currentPoint: TouchPointSchema.nullable(),
  velocity: z.object({
    x: z.number(),
    y: z.number(),
  }),
  distance: z.object({
    x: z.number(),
    y: z.number(),
  }),
  direction: z.object({
    x: z.number(),
    y: z.number(),
  }),
});