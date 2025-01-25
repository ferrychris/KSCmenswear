import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  className?: string;
}

export function SkipLink({ href, className }: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50',
        'focus:inline-block focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900',
        'focus:border-2 focus:border-indigo-600 focus:rounded-md focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        isFocused && 'ring-2 ring-offset-2 ring-indigo-500',
        className
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      Skip to main content
    </a>
  );
}