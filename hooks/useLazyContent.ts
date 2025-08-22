'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyContentOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export function useLazyContent(options: UseLazyContentOptions = {}) {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = node;

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce && observerRef.current) {
                observerRef.current.disconnect();
              }
            }, delay);
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { rootMargin, threshold }
      );

      observerRef.current.observe(node);
    }
  }, [rootMargin, threshold, triggerOnce, delay]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const loadContent = useCallback(async (loadFn: () => Promise<any>) => {
    if (isLoaded) return;

    try {
      setError(null);
      await loadFn();
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    }
  }, [isLoaded]);

  return {
    ref: setRef,
    isVisible,
    isLoaded,
    error,
    loadContent
  };
}

// Hook for lazy loading images with base64 placeholders
export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const { ref, isVisible } = useLazyContent({ triggerOnce: true });

  useEffect(() => {
    if (!isVisible || !src) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setError(true);
    };
    img.src = src;
  }, [isVisible, src]);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    error,
    isVisible
  };
}

// Hook for lazy loading with retry mechanism
export function useLazyContentWithRetry<T>(
  loadFn: () => Promise<T>,
  options: UseLazyContentOptions & { maxRetries?: number } = {}
) {
  const { maxRetries = 3, ...lazyOptions } = options;
  const [data, setData] = useState<T | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { ref, isVisible, error, loadContent } = useLazyContent(lazyOptions);

  useEffect(() => {
    if (isVisible && !data && retryCount < maxRetries) {
      loadContent(async () => {
        try {
          const result = await loadFn();
          setData(result);
          return result;
        } catch (err) {
          setRetryCount(prev => prev + 1);
          throw err;
        }
      });
    }
  }, [isVisible, data, retryCount, maxRetries, loadContent, loadFn]);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(0);
      setData(null);
    }
  }, [retryCount, maxRetries]);

  return {
    ref,
    data,
    isVisible,
    error,
    retryCount,
    retry,
    canRetry: retryCount < maxRetries
  };
}

// Hook for progressive image loading
export function useProgressiveImage(lowQualitySrc: string, highQualitySrc: string) {
  const [src, setSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const { ref, isVisible } = useLazyContent();

  useEffect(() => {
    if (!isVisible) return;

    // Load high quality image
    const img = new Image();
    img.onload = () => {
      setSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
    img.src = highQualitySrc;
  }, [isVisible, highQualitySrc]);

  return {
    ref,
    src,
    isHighQualityLoaded,
    isVisible
  };
}

// Utility function to create blur data URL
export function createBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create a gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}
