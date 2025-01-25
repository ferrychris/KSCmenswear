import { useState, useEffect } from 'react';
import { ImageOptimizer } from '@/lib/performance/imageOptimizer';
import { useLazyLoad } from '@/lib/performance/lazyLoader';
import { cn } from '@/lib/utils';
import { performanceMonitor } from '@/lib/performance/monitor';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  blur?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  blur = true,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string>();
  const { elementRef, isVisible } = useLazyLoad<HTMLImageElement>();

  const startTime = performance.now();

  useEffect(() => {
    if (blur && !loaded) {
      ImageOptimizer.generateBlurHash(src)
        .then(setBlurDataUrl)
        .catch(console.error);
    }
  }, [src, blur, loaded]);

  useEffect(() => {
    if (priority) {
      ImageOptimizer.preloadImage(src, { width, height });
    }
  }, [src, width, height, priority]);

  const handleLoad = () => {
    setLoaded(true);
    performanceMonitor.trackCustomMetric('image_load', {
      src,
      duration: performance.now() - startTime,
      success: true,
    });
  };

  const handleError = (error: Error) => {
    setError(true);
    performanceMonitor.trackCustomMetric('image_load', {
      src,
      duration: performance.now() - startTime,
      success: false,
      error: error.message,
    });
  };

  if (error) {
    return (
      <div
        className={cn(
          'bg-gray-100 flex items-center justify-center',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-400">Failed to load image</span>
      </div>
    );
  }

  const optimizedSrc = ImageOptimizer.optimizeShopifyImage(src, { width, height });
  const srcSet = ImageOptimizer.getImageSrcSet(src);

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      {blur && blurDataUrl && !loaded && (
        <img
          src={blurDataUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg transform scale-110"
          aria-hidden="true"
        />
      )}
      
      <img
        ref={elementRef}
        src={optimizedSrc}
        srcSet={priority || isVisible ? srcSet : undefined}
        sizes={`
          (max-width: 640px) 100vw,
          (max-width: 768px) 50vw,
          (max-width: 1024px) 33vw,
          25vw
        `}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={() => handleError(new Error('Image failed to load'))}
        className={cn(
          'transition-opacity duration-300',
          !loaded && 'opacity-0',
          loaded && 'opacity-100'
        )}
        {...props}
      />
    </div>
  );
}