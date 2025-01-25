import { useEffect, useCallback } from 'react';
import { accessibilityEngine } from '@/lib/accessibility/engine';

export function useAccessibility() {
  const announce = useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    accessibilityEngine.announce(message, priority);
  }, []);

  const createFocusTrap = useCallback((
    id: string,
    element: HTMLElement,
    options = {}
  ) => {
    accessibilityEngine.createFocusTrap(id, element, options);
  }, []);

  const registerKeyboardShortcut = useCallback((
    key: string,
    callback: () => void
  ) => {
    return accessibilityEngine.registerKeyboardShortcut(key, callback);
  }, []);

  const checkColorContrast = useCallback((
    foreground: string,
    background: string
  ) => {
    return accessibilityEngine.checkColorContrast(foreground, background);
  }, []);

  const prefersReducedMotion = useCallback(() => {
    return accessibilityEngine.prefersReducedMotion();
  }, []);

  return {
    announce,
    createFocusTrap,
    registerKeyboardShortcut,
    checkColorContrast,
    prefersReducedMotion,
  };
}