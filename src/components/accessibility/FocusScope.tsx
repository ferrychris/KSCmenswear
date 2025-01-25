import { useEffect, useRef } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface FocusScopeProps {
  children: React.ReactNode;
  trapped?: boolean;
  active?: boolean;
  onEscape?: () => void;
}

export function FocusScope({
  children,
  trapped = false,
  active = true,
  onEscape,
}: FocusScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const { createFocusTrap } = useAccessibility();

  useEffect(() => {
    if (!trapped || !active || !scopeRef.current) return;

    createFocusTrap('focus-scope', scopeRef.current, {
      escapeDeactivates: Boolean(onEscape),
      clickOutsideDeactivates: false,
    });

    return () => {
      // Cleanup handled by the engine
    };
  }, [trapped, active, createFocusTrap, onEscape]);

  return (
    <div
      ref={scopeRef}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onEscape) {
          onEscape();
        }
      }}
    >
      {children}
    </div>
  );
}