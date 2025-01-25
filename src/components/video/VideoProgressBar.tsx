import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface VideoProgressBarProps {
  progress: number;
  onSeek: (percent: number) => void;
  className?: string;
}

export function VideoProgressBar({
  progress,
  onSeek,
  className
}: VideoProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div
      ref={progressBarRef}
      className={cn(
        "relative h-1 flex-1 bg-white/20 rounded-full cursor-pointer",
        "hover:h-2 transition-all duration-200",
        className
      )}
      onClick={handleClick}
    >
      <div
        className="absolute inset-y-0 left-0 bg-white rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}