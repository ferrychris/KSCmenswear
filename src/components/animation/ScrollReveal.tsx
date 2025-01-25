import { ReactNode, useEffect, useRef } from 'react';
import { useAnimation } from '@/hooks/useAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { play } = useAnimation('scroll-reveal', {
    duration: 600,
    easing: 'easeOutCubic',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [play, threshold, rootMargin]);

  return (
    <div
      ref={elementRef}
      className={`opacity-0 translate-y-4 transition-all duration-600 ${className}`}
      style={{
        animation: 'none',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}