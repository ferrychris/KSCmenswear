import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorRecoveryEngine } from './engine';
import { performanceMonitor } from '../performance/monitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: any[];
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastError: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private static readonly MAX_ERROR_COUNT = 3;
  private static readonly ERROR_RESET_TIMEOUT = 60000; // 1 minute
  private errorEngine: ErrorRecoveryEngine;

  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastError: 0,
    };
    this.errorEngine = new ErrorRecoveryEngine();
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const now = Date.now();
    const { onError } = this.props;

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: this.shouldResetErrorCount(prevState.lastError, now)
        ? 1
        : prevState.errorCount + 1,
      lastError: now,
    }));

    // Track error metrics
    performanceMonitor.trackError('error_boundary', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      count: this.state.errorCount,
    });

    // Notify error handlers
    onError?.(error, errorInfo);

    // Attempt recovery
    this.attemptRecovery(error);
  }

  componentDidUpdate(prevProps: Props): void {
    const { error } = this.state;
    const { resetKeys = [] } = this.props;

    if (error !== null && this.didResetKeysChange(prevProps.resetKeys, resetKeys)) {
      this.resetError();
    }
  }

  private shouldResetErrorCount(lastError: number, now: number): boolean {
    return now - lastError > ErrorBoundary.ERROR_RESET_TIMEOUT;
  }

  private didResetKeysChange(prevResetKeys: any[] = [], resetKeys: any[] = []): boolean {
    return (
      prevResetKeys.length !== resetKeys.length ||
      prevResetKeys.some((key, index) => key !== resetKeys[index])
    );
  }

  private async attemptRecovery(error: Error): Promise<void> {
    try {
      await this.errorEngine.withRecovery(
        async () => {
          // Implement recovery strategies
          if (this.isNetworkError(error)) {
            await this.retryWithBackoff();
          } else if (this.isStateError(error)) {
            this.resetState();
          }
        },
        {
          retryStrategy: {
            maxAttempts: 3,
            backoff: 'exponential',
            initialDelay: 1000,
          },
          fallbackStrategy: {
            id: 'error-boundary',
            handler: async () => {
              this.resetError();
            },
          },
        }
      );
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
    }
  }

  private isNetworkError(error: Error): boolean {
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch');
  }

  private isStateError(error: Error): boolean {
    return error.message.toLowerCase().includes('state') ||
           error.message.toLowerCase().includes('prop');
  }

  private async retryWithBackoff(): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, this.state.errorCount - 1), 10000);
    await new Promise(resolve => setTimeout(resolve, delay));
    this.resetError();
  }

  private resetState(): void {
    // Reset component state to initial values
    this.setState({
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastError: 0,
    });
  }

  resetError = (): void => {
    const { onReset } = this.props;
    this.resetState();
    onReset?.();
  };

  render(): ReactNode {
    const { children, fallback } = this.props;
    const { error, errorCount } = this.state;

    if (error !== null) {
      // Show fallback UI if error count exceeds maximum
      if (errorCount >= ErrorBoundary.MAX_ERROR_COUNT) {
        return fallback || this.renderDefaultFallback();
      }

      // Show retry UI for recoverable errors
      return this.renderRecoveryUI();
    }

    return children;
  }

  private renderDefaultFallback(): ReactNode {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We're sorry for the inconvenience. Please try refreshing the page.
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

  private renderRecoveryUI(): ReactNode {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Attempting to recover
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we try to resolve the issue.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <button
              onClick={this.resetError}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}