'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Define the metric interface
interface Metric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Analytics reporting function
function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: {
        metric_id: 'custom_map.metric_id',
        metric_value: 'custom_map.metric_value',
        metric_delta: 'custom_map.metric_delta',
        metric_rating: 'custom_map.metric_rating',
      },
    });
  }

  // Also send to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // You can also send to other analytics services like:
  // - Google Analytics 4
  // - Mixpanel
  // - Custom analytics endpoint
  
  // Example: Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
}

export function WebVitals() {
  useEffect(() => {
    // Core Web Vitals metrics
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaced FID in web-vitals v4
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null; // This component doesn't render anything
}

// Performance observer for additional metrics
export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
            
            // Send to analytics
            if (process.env.NODE_ENV === 'production') {
              fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  type: 'long-task',
                  duration: entry.duration,
                  startTime: entry.startTime,
                  url: window.location.href,
                  timestamp: Date.now(),
                }),
              }).catch(console.error);
            }
          }
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });

      return () => {
        longTaskObserver.disconnect();
      };
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }
  }, []);

  return null;
}

// Resource timing monitor
export function ResourceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          
          // Check for slow resources
          if (resource.duration > 1000) {
            console.warn(`Slow resource detected: ${resource.name} (${resource.duration}ms)`);
            
            // Send to analytics
            if (process.env.NODE_ENV === 'production') {
              fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  type: 'slow-resource',
                  name: resource.name,
                  duration: resource.duration,
                  size: resource.transferSize || 0,
                  url: window.location.href,
                  timestamp: Date.now(),
                }),
              }).catch(console.error);
            }
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      return () => {
        resourceObserver.disconnect();
      };
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }, []);

  return null;
}

// Combined performance monitoring component
export function PerformanceTracker() {
  return (
    <>
      <WebVitals />
      <PerformanceMonitor />
      <ResourceMonitor />
    </>
  );
}

// Hook for manual performance tracking
export function usePerformanceTracker() {
  const trackEvent = (name: string, duration: number, additionalData?: Record<string, any>) => {
    const metric = {
      name,
      value: duration,
      id: `${name}-${Date.now()}`,
      delta: duration,
      rating: duration < 100 ? 'good' as const : duration < 300 ? 'needs-improvement' as const : 'poor' as const,
      ...additionalData,
    };

    sendToAnalytics(metric);
  };

  const measureFunction = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      trackEvent(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      trackEvent(`${name}-error`, duration, { error: true });
      throw error;
    }
  };

  return { trackEvent, measureFunction };
}
