import { config } from '@/config';
import { performanceMonitor } from './monitor';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  blur?: boolean;
}

export class ImageOptimizer {
  private static defaultOptions: ImageOptions = {
    width: 800,
    quality: 80,
    format: 'webp',
    blur: false,
  };

  private static preloadQueue = new Set<string>();
  private static preloadedImages = new Map<string, HTMLImageElement>();

  static optimizeShopifyImage(url: string, options: Partial<ImageOptions> = {}): string {
    if (!url) return '';
    
    const opts = { ...this.defaultOptions, ...options };
    const urlObj = new URL(url);
    
    // Remove existing transformation parameters
    urlObj.search = '';
    
    const params = new URLSearchParams();
    if (opts.width) params.append('width', opts.width.toString());
    if (opts.height) params.append('height', opts.height.toString());
    if (opts.format) params.append('format', opts.format);
    if (opts.quality) params.append('quality', opts.quality.toString());
    if (opts.blur) params.append('blur', '20');
    
    return `${urlObj.toString()}?${params.toString()}`;
  }

  static getImageSrcSet(url: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1536]): string {
    return sizes
      .map(size => `${this.optimizeShopifyImage(url, { width: size })} ${size}w`)
      .join(', ');
  }

  static preloadImage(url: string, options: Partial<ImageOptions> = {}): Promise<void> {
    const optimizedUrl = this.optimizeShopifyImage(url, options);
    
    if (this.preloadQueue.has(optimizedUrl)) {
      return Promise.resolve();
    }

    this.preloadQueue.add(optimizedUrl);

    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const img = new Image();

      img.onload = () => {
        this.preloadedImages.set(optimizedUrl, img);
        this.preloadQueue.delete(optimizedUrl);
        
        performanceMonitor.trackCustomMetric('image_preload', {
          url: optimizedUrl,
          duration: performance.now() - startTime,
          success: true,
        });

        resolve();
      };

      img.onerror = (error) => {
        this.preloadQueue.delete(optimizedUrl);
        
        performanceMonitor.trackCustomMetric('image_preload', {
          url: optimizedUrl,
          duration: performance.now() - startTime,
          success: false,
          error: error instanceof Error ? error.message : 'Image load failed',
        });

        reject(error);
      };

      img.src = optimizedUrl;
    });
  }

  static preloadCriticalImages(urls: string[]): void {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.optimizeShopifyImage(url, { width: 1280 });
      document.head.appendChild(link);
    });
  }

  static generateBlurHash(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, 32, 32);
        const imageData = ctx.getImageData(0, 0, 32, 32);
        resolve(this.encodeBlurHash(imageData));
      };

      img.onerror = reject;
      img.src = url;
    });
  }

  private static encodeBlurHash(imageData: ImageData): string {
    // Simple implementation - in production use a proper blurhash library
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.1);
  }
}