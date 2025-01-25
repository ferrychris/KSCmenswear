import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  saving: boolean;
  lastSaved?: Date;
  error?: string;
  className?: string;
}

export function AutoSaveIndicator({
  saving,
  lastSaved,
  error,
  className,
}: AutoSaveIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (saving || error) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saving, error]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'flex items-center space-x-2 text-sm',
        error ? 'text-red-600' : 'text-gray-500',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {saving ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Saving...</span>
        </>
      ) : error ? (
        <>
          <span className="text-red-500">Error saving: {error}</span>
        </>
      ) : lastSaved ? (
        <span>
          Last saved{' '}
          {new Intl.RelativeTimeFormat().format(
            Math.round(
              (lastSaved.getTime() - Date.now()) / 1000 / 60
            ),
            'minute'
          )}
        </span>
      ) : null}
    </div>
  );
}