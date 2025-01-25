import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LiveRegionProps {
  children: React.ReactNode;
  'aria-live'?: 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export function LiveRegion({
  children,
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true,
  'aria-relevant': ariaRelevant = 'additions text',
  className,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regionRef.current) {
      // Force screen readers to announce changes
      const clone = regionRef.current.cloneNode(true);
      regionRef.current.parentNode?.replaceChild(clone, regionRef.current);
    }
  }, [children]);

  return (
    <div
      ref={regionRef}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      aria-relevant={ariaRelevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
}