import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { initializePerformanceMonitoring } from './performance';
import { initializeAccessibilityTesting } from './accessibility';
import { initializeSecurityTesting } from './security';

// Setup MSW
export const server = setupServer(...handlers);

// Initialize test environment
beforeAll(() => {
  // Start MSW server
  server.listen({ onUnhandledRequest: 'error' });

  // Initialize performance monitoring
  initializePerformanceMonitoring();

  // Initialize accessibility testing
  initializeAccessibilityTesting();

  // Initialize security testing
  initializeSecurityTesting();

  // Mock IntersectionObserver
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

// Reset after each test
afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Cleanup after all tests
afterAll(() => {
  server.close();
});