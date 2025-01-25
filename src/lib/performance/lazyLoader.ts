import { useEffect, useRef, useState } from 'react';

export function useLazyLoad<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { elementRef, isVisible };
}

export function useInfiniteScroll(callback: () => void, options = { threshold: 200 }) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      if (
        !isFetching &&
        scrollHeight - scrollTop <= clientHeight + options.threshold
      ) {
        setIsFetching(true);
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, isFetching, options.threshold]);

  return { isFetching, setIsFetching };
}