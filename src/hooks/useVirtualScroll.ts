import { useState, useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/performance/monitor';

interface VirtualScrollOptions {
  itemHeight: number;
  overscan?: number;
  threshold?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, overscan = 3, threshold = 200 } = options;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateVisibleRange = () => {
      const { scrollTop, clientHeight } = container;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.ceil((scrollTop + clientHeight) / itemHeight);

      // Add overscan
      const newStart = Math.max(0, start - overscan);
      const newEnd = Math.min(items.length, end + overscan);

      setVisibleRange({ start: newStart, end: newEnd });

      // Track scroll performance
      performanceMonitor.trackCustomMetric('virtual_scroll', {
        visibleItems: newEnd - newStart,
        totalItems: items.length,
        scrollPosition: scrollTop,
      });
    };

    const handleScroll = () => {
      if (scrollTimer.current) {
        cancelAnimationFrame(scrollTimer.current);
      }
      scrollTimer.current = requestAnimationFrame(calculateVisibleRange);
    };

    container.addEventListener('scroll', handleScroll);
    calculateVisibleRange();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        cancelAnimationFrame(scrollTimer.current);
      }
    };
  }, [items.length, itemHeight, overscan]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
  };
}