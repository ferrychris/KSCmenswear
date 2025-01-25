import { ImageOptimizer } from './imageOptimizer';
import { performanceMonitor } from './monitor';

export class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadQueue: Set<string> = new Set();
  private loadedImages: Map<string, HTMLImageElement> = new Map();
  private observer: IntersectionObserver;

  private constructor() {
    // Initialize intersection observer for viewport detection
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.preloadImage(img.dataset.src!);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );
  }

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  preloadCriticalImages(urls: string[]): void {
    const startTime = performance.now();

    Promise.all(
      urls.map(url => 
        ImageOptimizer.preloadImage(url, { width: 1280 })
      )
    ).then(() => {
      performanceMonitor.trackCustomMetric('critical_images_preload', {
        count: urls.length,
        duration: performance.now() - startTime,
      });
    });
  }

  observeImage(element: HTMLImageElement, src: string): void {
    element.dataset.src = src;
    this.observer.observe(element);
  }

  private async preloadImage(url: string): Promise<void> {
    if (this.preloadQueue.has(url) || this.loadedImages.has(url)) {
      return;
    }

    this.preloadQueue.add(url);
    const startTime = performance.now();

    try {
      await ImageOptimizer.preloadImage(url);
      
      performanceMonitor.trackCustomMetric('image_preload', {
        url,
        duration: performance.now() - startTime,
        success: true,
      });
    } catch (error) {
      performanceMonitor.trackCustomMetric('image_preload', {
        url,
        duration: performance.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      this.preloadQueue.delete(url);
    }
  }

  dispose(): void {
    this.observer.disconnect();
    this.preloadQueue.clear();
    this.loadedImages.clear();
  }
}

export const imagePreloader = ImagePreloader.getInstance();