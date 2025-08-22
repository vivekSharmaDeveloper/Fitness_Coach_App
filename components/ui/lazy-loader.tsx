'use client';

import { lazy, Suspense, ComponentType, ReactNode, useState, useEffect, useRef } from 'react';

// Generic lazy loading wrapper with intersection observer
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyWrapper({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-32" />,
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <LazyWrapper fallback={fallback}>
      <Component {...props} />
    </LazyWrapper>
  );

  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Lazy loading hook for custom implementations
export function useLazyLoading(options: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options.rootMargin, options.threshold]);

  return { isVisible, ref: setRef };
}

// Preloader components for different content types
export const ComponentLoader = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse space-y-4 ${className}`}>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const CardLoader = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
    </div>
  </div>
);

export const ChartLoader = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded flex items-end space-x-2 p-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-400 dark:bg-gray-500 rounded-t"
            style={{
              height: `${Math.random() * 80 + 20}%`,
              width: '100%'
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Lazy loaded components with proper suspense boundaries
export const LazyChart = lazy(() => 
  import('@/components/goals/ProgressTracker').then(module => ({ 
    default: module.ProgressTracker 
  }))
);

export const LazyCompletedTasks = lazy(() => 
  import('@/components/goals/CompletedTasks').then(module => ({ 
    default: module.CompletedTasks 
  }))
);

export const LazyRecommendationsSection = lazy(() => 
  import('@/components/goals/RecommendationsSection').then(module => ({ 
    default: module.RecommendationsSection 
  }))
);

// Lazy wrapper for heavy chart components
export function LazyChartWrapper({ children, ...props }: { children: ReactNode } & LazyWrapperProps) {
  return (
    <LazyWrapper fallback={<ChartLoader />} {...props}>
      <Suspense fallback={<ChartLoader />}>
        {children}
      </Suspense>
    </LazyWrapper>
  );
}

// Dynamic import helper
export async function dynamicImport<T = any>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Dynamic import failed after retries');
}
