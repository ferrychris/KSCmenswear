import { ReactNode, useEffect, useRef } from 'react';
import { useAnimation } from '@/hooks/useAnimation';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FadeIn({
  children,
  duration = 300,
  delay = 0,
  className = '',
}: FadeInProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { play } = useAnimation('fade-in', {
    duration,
    easing: 'easeOutCubic',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      play();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, play]);

  return (
    <div
      ref={elementRef}
      className={`opacity-0 transition-opacity ${className}`}
      style={{
        animation: `fadeIn ${duration}ms ease-out ${delay}ms forwards`,
      }}
    >
      {children}
    </div>
  );
}