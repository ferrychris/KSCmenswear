import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface TestProviderProps {
  children: ReactNode;
}

export function TestProvider({ children }: TestProviderProps) {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );
}