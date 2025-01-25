import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TouchFeedbackProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  activeClassName?: string;
  disabled?: boolean;
}

export function TouchFeedback({
  children,
  onPress,
  className,
  activeClassName = 'bg-charcoal-100',
  disabled = false,
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (!disabled) {
      setIsPressed(false);
      onPress?.();
    }
  };

  return (
    <div
      className={cn(
        'transition-colors duration-100',
        className,
        isPressed && !disabled && activeClassName
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsPressed(false)}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
}