import { useEffect, useState } from 'react';
import { LiveRegion } from '../accessibility/LiveRegion';
import { cn } from '@/lib/utils';

interface ErrorFeedbackProps {
  error: Error;
  retry?: () => void;
  className?: string;
}

export function ErrorFeedback({
  error,
  retry,
  className,
}: ErrorFeedbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyError = () => {
    navigator.clipboard.writeText(
      `Error: ${error.message}\nStack: ${error.stack}`
    );
    setCopied(true);
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-4',
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
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
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            An error occurred
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
          </div>
          {error.stack && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-red-700 underline hover:text-red-800"
              >
                {showDetails ? 'Hide' : 'Show'} details
              </button>
              {showDetails && (
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
          <div className="mt-4 space-x-4">
            {retry && (
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200"
              >
                Try again
              </button>
            )}
            <button
              type="button"
              onClick={copyError}
              className="inline-flex items-center text-sm text-red-700 hover:text-red-800"
            >
              {copied ? 'Copied!' : 'Copy error'}
            </button>
          </div>
        </div>
      </div>
      <LiveRegion>
        {copied ? 'Error details copied to clipboard' : ''}
      </LiveRegion>
    </div>
  );
}