import { ErrorBoundary } from '@/lib/error/boundary';
import { useErrorRecovery } from '@/hooks/useErrorRecovery';

interface APIErrorBoundaryProps {
  children: React.ReactNode;
  endpoint: string;
}

export function APIErrorBoundary({ children, endpoint }: APIErrorBoundaryProps) {
  const { withRecovery } = useErrorRecovery();

  return (
    <ErrorBoundary
      onError={async (error) => {
        // Attempt API-specific recovery
        try {
          await withRecovery(
            async () => {
              // Implement API recovery logic
              await fetch(`${endpoint}/health`);
            },
            {
              id: `api-${endpoint}`,
              retryStrategy: {
                maxAttempts: 3,
                backoff: 'exponential',
                initialDelay: 1000,
              },
            }
          );
        } catch (recoveryError) {
          console.error('API recovery failed:', recoveryError);
        }
      }}
      fallback={<APIErrorFallback endpoint={endpoint} />}
    >
      {children}
    </ErrorBoundary>
  );
}

function APIErrorFallback({ endpoint }: { endpoint: string }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            API Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              Failed to connect to {endpoint}. Please try again later.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}