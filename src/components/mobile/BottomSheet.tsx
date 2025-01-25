import { useState, useRef, useEffect } from 'react';
import { useGesture } from '@/hooks/useGesture';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 1],
  className,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const sheetRef = useGesture({
    onSwipe: (direction) => {
      if (direction === 'down') {
        onClose();
      }
    },
    onPan: (state) => {
      const { distance } = state;
      const nextSnap = findNearestSnap(1 - distance.y / window.innerHeight);
      setCurrentSnap(nextSnap);
    },
  });

  const findNearestSnap = (position: number): number => {
    return snapPoints.reduce((prev, curr) => 
      Math.abs(curr - position) < Math.abs(prev - position) ? curr : prev
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900 bg-opacity-25">
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transform transition-transform',
          className
        )}
        style={{
          transform: `translateY(${(1 - snapPoints[currentSnap]) * 100}%)`,
          touchAction: 'none',
        }}
      >
        <div className="h-1.5 w-12 bg-charcoal-300 rounded-full mx-auto my-3" />
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}