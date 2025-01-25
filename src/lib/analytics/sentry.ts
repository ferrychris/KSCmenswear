import * as Sentry from '@sentry/react';
import { performanceMonitor } from '../performance/monitor';

export function initializeSentry() {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'kctmenswear.com'],
        }),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Track error in performance monitor
        performanceMonitor.trackError('sentry', {
          error: event.exception?.values?.[0]?.value || 'Unknown error',
          type: event.exception?.values?.[0]?.type || 'Error',
          url: event.request?.url,
          timestamp: new Date().toISOString(),
        });
        return event;
      },
    });
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

export function setUserContext(userId: string, email?: string) {
  Sentry.setUser({
    id: userId,
    email,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}