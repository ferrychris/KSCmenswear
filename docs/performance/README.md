# Performance Documentation

## Performance Features

### Image Optimization

Images are optimized using the `ImageOptimizer` utility:

```ts
const optimizedUrl = ImageOptimizer.optimizeShopifyImage(url, {
  width: 800,
  quality: 80,
  format: 'webp',
});
```

### Lazy Loading

Components and images use lazy loading:

```ts
const { elementRef, isVisible } = useLazyLoad<HTMLImageElement>();
```

### Code Splitting

The application uses dynamic imports for route-based code splitting:

```ts
const Home = lazy(() => import('@/pages/home'));
```

### Caching

Data is cached using the `MemoryCache` utility:

```ts
const cache = new MemoryCache(50 * 1024 * 1024); // 50MB cache
```

## Performance Monitoring

The `PerformanceMonitor` tracks key metrics:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

## Performance Best Practices

1. Optimize images
2. Implement lazy loading
3. Use code splitting
4. Enable caching
5. Minimize bundle size
6. Reduce server response time
7. Optimize CSS delivery
8. Use CDN for assets