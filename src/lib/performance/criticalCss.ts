import { performanceMonitor } from './monitor';

export class CriticalCssOptimizer {
  private static instance: CriticalCssOptimizer;
  private criticalStyles: Set<string> = new Set();
  private deferredStyles: Set<string> = new Set();

  private constructor() {
    this.initializeCriticalCss();
  }

  static getInstance(): CriticalCssOptimizer {
    if (!CriticalCssOptimizer.instance) {
      CriticalCssOptimizer.instance = new CriticalCssOptimizer();
    }
    return CriticalCssOptimizer.instance;
  }

  private initializeCriticalCss(): void {
    // Extract critical CSS for above-the-fold content
    const extractCriticalCss = () => {
      const startTime = performance.now();

      try {
        const aboveTheFold = document.querySelectorAll('[data-critical="true"]');
        const styles = new Set<string>();

        aboveTheFold.forEach(element => {
          const computedStyle = window.getComputedStyle(element);
          Array.from(computedStyle).forEach(property => {
            const value = computedStyle.getPropertyValue(property);
            if (value) {
              styles.add(`${property}: ${value};`);
            }
          });
        });

        this.criticalStyles = styles;

        performanceMonitor.trackCustomMetric('critical_css_extraction', {
          duration: performance.now() - startTime,
          stylesCount: styles.size,
          success: true,
        });
      } catch (error) {
        performanceMonitor.trackCustomMetric('critical_css_extraction', {
          duration: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        });
      }
    };

    // Extract on load and after dynamic content changes
    window.addEventListener('load', extractCriticalCss);
    const observer = new MutationObserver(extractCriticalCss);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  injectCriticalCss(): void {
    const style = document.createElement('style');
    style.textContent = Array.from(this.criticalStyles).join('\n');
    document.head.appendChild(style);
  }

  deferNonCriticalCss(): void {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      if (link instanceof HTMLLinkElement && !link.dataset.critical) {
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        this.deferredStyles.add(link.href);
      }
    });
  }

  preloadCriticalFonts(): void {
    const fonts = [
      { url: '/fonts/inter-var.woff2', type: 'font/woff2' },
      { url: '/fonts/playfair-display.woff2', type: 'font/woff2' },
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = font.type;
      link.href = font.url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

export const criticalCssOptimizer = CriticalCssOptimizer.getInstance();