import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/lib/error/boundary';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export function RouteErrorBoundary({ children }: RouteErrorBoundaryProps) {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      onError={(error) => {
        // Log route-specific errors
        console.error('Route error:', error);
      }}
      onReset={() => {
        // Navigate to the homepage on reset
        navigate('/', { replace: true });
      }}
      fallback={<RouteErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
}

function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    // Handle known route errors
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {error.status === 404 ? 'Page not found' : 'Error'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error.statusText}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle unknown errors
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Unexpected Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            An unexpected error occurred. Please try again later.
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}