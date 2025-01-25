import { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}
      role="alert"
    >
      <ShoppingBag className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-white/80 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}