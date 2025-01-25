import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { Layout } from '@/components/layout';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { BackToTop } from '@/components/ui/BackToTop';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from '@/components/ui/ToastContainer';

function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <ErrorBoundary>
          <Router>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
              </div>
            }>
              <Layout>
                <AppRoutes />
                <CartDrawer />
                <SearchOverlay />
                <BackToTop />
                <ToastContainer />
              </Layout>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </HelmetProvider>
    </React.StrictMode>
  );
}

export default App;