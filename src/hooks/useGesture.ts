import { useEffect, useRef } from 'react';
import { GestureEngine } from '@/lib/mobile/gestures';

interface GestureOptions {
  onSwipe?: (direction: string, magnitude: number) => void;
  onPan?: (state: any) => void;
  threshold?: number;
}

export function useGesture(options: GestureOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const gestureEngine = useRef<GestureEngine | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gestureEngine.current = new GestureEngine();
    gestureEngine.current.attach(elementRef.current);

    if (options.onSwipe) {
      gestureEngine.current.on('swipe', (data) => {
        options.onSwipe?.(data.direction, data.magnitude);
      });
    }

    if (options.onPan) {
      gestureEngine.current.on('pan', options.onPan);
    }

    return () => {
      if (gestureEngine.current) {
        gestureEngine.current.detach();
      }
    };
  }, [options]);

  return elementRef;
}