import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';

export class AccessibilityEngine {
  private focusTraps: Map<string, FocusTrap>;
  private announcements: string[];
  private observers: Set<(announcement: string) => void>;
  private reducedMotion: boolean;

  constructor() {
    this.focusTraps = new Map();
    this.announcements = [];
    this.observers = new Set();
    this.reducedMotion = this.checkReducedMotion();
    this.initializeMediaListeners();
  }

  // Focus Management
  createFocusTrap(id: string, element: HTMLElement, options: FocusTrapOptions = {}): void {
    if (this.focusTraps.has(id)) {
      throw new Error(`Focus trap with id ${id} already exists`);
    }

    const trap = new FocusTrap(element, options);
    this.focusTraps.set(id, trap);
  }

  activateFocusTrap(id: string): void {
    const trap = this.focusTraps.get(id);
    if (!trap) return;
    trap.activate();
  }

  deactivateFocusTrap(id: string): void {
    const trap = this.focusTraps.get(id);
    if (!trap) return;
    trap.deactivate();
  }

  // Live Region Management
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    this.announcements.push(message);
    this.observers.forEach(observer => observer(message));
    
    performanceMonitor.trackCustomMetric('accessibility_announcement', {
      message,
      priority,
      timestamp: Date.now(),
    });
  }

  // Keyboard Navigation
  registerKeyboardShortcut(key: string, callback: () => void): () => void {
    const handler = (event: KeyboardEvent) => {
      if (this.matchesKeyboardShortcut(event, key)) {
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }

  // Motion Preferences
  prefersReducedMotion(): boolean {
    return this.reducedMotion;
  }

  // Color Contrast
  checkColorContrast(foreground: string, background: string): ContrastResult {
    const ratio = this.calculateContrastRatio(foreground, background);
    return {
      ratio,
      passes: {
        AA: ratio >= 4.5,
        AAA: ratio >= 7,
        'AA-large': ratio >= 3,
        'AAA-large': ratio >= 4.5,
      },
    };
  }

  // Private helper methods
  private initializeMediaListeners(): void {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', (event) => {
      this.reducedMotion = event.matches;
    });

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', () => {
      this.validateColorContrast();
    });
  }

  private checkReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private matchesKeyboardShortcut(event: KeyboardEvent, shortcut: string): boolean {
    const parts = shortcut.toLowerCase().split('+');
    const key = parts.pop() as string;

    const modifiers = {
      ctrl: parts.includes('ctrl'),
      alt: parts.includes('alt'),
      shift: parts.includes('shift'),
      meta: parts.includes('meta'),
    };

    return (
      event.key.toLowerCase() === key &&
      event.ctrlKey === modifiers.ctrl &&
      event.altKey === modifiers.alt &&
      event.shiftKey === modifiers.shift &&
      event.metaKey === modifiers.meta
    );
  }

  private calculateContrastRatio(foreground: string, background: string): number {
    const fg = this.getLuminance(this.hexToRgb(foreground));
    const bg = this.getLuminance(this.hexToRgb(background));
    const lighter = Math.max(fg, bg);
    const darker = Math.min(fg, bg);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw new Error('Invalid hex color');
    
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  }

  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private validateColorContrast(): void {
    // Implement color contrast validation for theme colors
    performanceMonitor.trackCustomMetric('accessibility_color_contrast', {
      timestamp: Date.now(),
      validations: {
        primary: this.checkColorContrast('#ffffff', '#000000'),
        // Add more theme color combinations
      },
    });
  }
}

class FocusTrap {
  private element: HTMLElement;
  private options: Required<FocusTrapOptions>;
  private previousActiveElement: HTMLElement | null = null;

  constructor(element: HTMLElement, options: FocusTrapOptions = {}) {
    this.element = element;
    this.options = {
      initialFocus: options.initialFocus || true,
      returnFocus: options.returnFocus || true,
      escapeDeactivates: options.escapeDeactivates || true,
      clickOutsideDeactivates: options.clickOutsideDeactivates || false,
    };
  }

  activate(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;

    if (this.options.initialFocus) {
      const firstFocusable = this.getFirstFocusableElement();
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    this.element.addEventListener('keydown', this.handleKeyDown);
    if (this.options.clickOutsideDeactivates) {
      document.addEventListener('click', this.handleClickOutside);
    }
  }

  deactivate(): void {
    this.element.removeEventListener('keydown', this.handleKeyDown);
    if (this.options.clickOutsideDeactivates) {
      document.removeEventListener('click', this.handleClickOutside);
    }

    if (this.options.returnFocus && this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.options.escapeDeactivates && event.key === 'Escape') {
      this.deactivate();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = this.getFocusableElements();
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  private handleClickOutside = (event: MouseEvent): void => {
    if (!this.element.contains(event.target as Node)) {
      this.deactivate();
    }
  };

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
  }

  private getFirstFocusableElement(): HTMLElement | null {
    const elements = this.getFocusableElements();
    return elements.length > 0 ? elements[0] : null;
  }
}

// Types and Validation
interface FocusTrapOptions {
  initialFocus?: boolean;
  returnFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
}

interface ContrastResult {
  ratio: number;
  passes: {
    AA: boolean;
    AAA: boolean;
    'AA-large': boolean;
    'AAA-large': boolean;
  };
}

const FocusTrapOptionsSchema = z.object({
  initialFocus: z.boolean().optional(),
  returnFocus: z.boolean().optional(),
  escapeDeactivates: z.boolean().optional(),
  clickOutsideDeactivates: z.boolean().optional(),
});

export const accessibilityEngine = new AccessibilityEngine();