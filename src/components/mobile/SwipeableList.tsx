import { useRef } from 'react';
import { useGesture } from '@/hooks/useGesture';
import { cn } from '@/lib/utils';

interface SwipeableListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onSwipe?: (item: T, direction: 'left' | 'right') => void;
  className?: string;
}

export function SwipeableList<T>({
  items,
  renderItem,
  onSwipe,
  className,
}: SwipeableListProps<T>) {
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const handleSwipe = (index: number, direction: string) => {
    if (direction === 'left' || direction === 'right') {
      onSwipe?.(items[index], direction);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => {
        const gestureRef = useGesture({
          onSwipe: (direction) => handleSwipe(index, direction),
        });

        return (
          <div
            key={index}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(index, el);
              }
              // @ts-ignore - Combine refs
              gestureRef.current = el;
            }}
            className="transform transition-transform touch-pan-y bg-white rounded-lg shadow-sm hover:shadow-md"
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}