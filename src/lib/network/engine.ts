import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';
import { ErrorRecoveryEngine } from '../error/engine';

interface RequestConfig extends RequestInit {
  priority?: 'high' | 'low';
  timeout?: number;
  retries?: number;
  keepAlive?: boolean;
  cache?: RequestCache;
}

interface QueuedRequest {
  priority: 'high' | 'low';
  execute: () => Promise<Response>;
  controller: AbortController;
}

export class NetworkEngine {
  private static instance: NetworkEngine;
  private errorEngine: ErrorRecoveryEngine;
  private requestQueue: QueuedRequest[] = [];
  private activeRequests = 0;
  private readonly MAX_CONCURRENT_REQUESTS = 6;
  private isProcessing = false;

  private constructor() {
    this.errorEngine = new ErrorRecoveryEngine();
    this.initializeKeepAlive();
  }

  static getInstance(): NetworkEngine {
    if (!NetworkEngine.instance) {
      NetworkEngine.instance = new NetworkEngine();
    }
    return NetworkEngine.instance;
  }

  async fetch(url: string, config: RequestConfig = {}): Promise<Response> {
    const {
      priority = 'high',
      timeout = 30000,
      retries = 3,
      keepAlive = true,
      cache = 'default',
      ...fetchConfig
    } = config;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Add keep-alive header
    const headers = new Headers(fetchConfig.headers);
    if (keepAlive) {
      headers.set('Connection', 'keep-alive');
    }

    // Create request execution function
    const execute = () => {
      const startTime = performance.now();
      
      return fetch(url, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
        cache,
      }).then(response => {
        performanceMonitor.trackAPICall({
          endpoint: url,
          method: fetchConfig.method || 'GET',
          duration: performance.now() - startTime,
          status: response.status,
        });
        return response;
      }).catch(error => {
        performanceMonitor.trackAPICall({
          endpoint: url,
          method: fetchConfig.method || 'GET',
          duration: performance.now() - startTime,
          status: 0,
          error: true,
        });
        throw error;
      });
    };

    try {
      // Add request to queue
      const response = await this.queueRequest({
        priority,
        execute,
        controller,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      // Handle retries through error recovery engine
      return this.errorEngine.withRecovery(
        () => this.fetch(url, { ...config, retries: retries - 1 }),
        {
          retryStrategy: {
            maxAttempts: retries,
            backoff: 'exponential',
            initialDelay: 1000,
          },
        }
      );
    }
  }

  private async queueRequest(request: QueuedRequest): Promise<Response> {
    this.requestQueue.push(request);
    this.sortQueue();
    
    if (!this.isProcessing) {
      this.processQueue();
    }

    return new Promise((resolve, reject) => {
      const execute = async () => {
        try {
          const response = await request.execute();
          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      };

      if (this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
        this.activeRequests++;
        execute();
      }
    });
  }

  private sortQueue(): void {
    this.requestQueue.sort((a, b) => 
      a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
    );
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;

    while (
      this.requestQueue.length > 0 &&
      this.activeRequests < this.MAX_CONCURRENT_REQUESTS
    ) {
      const request = this.requestQueue.shift();
      if (!request) continue;

      this.activeRequests++;
      try {
        await request.execute();
      } catch (error) {
        console.error('Request failed:', error);
      } finally {
        this.activeRequests--;
      }
    }

    this.isProcessing = false;
  }

  private initializeKeepAlive(): void {
    // Enable keep-alive connections
    if ('keepalive' in Request.prototype) {
      const originalFetch = window.fetch;
      window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.keepalive === undefined) {
          init = { ...init, keepalive: true };
        }
        return originalFetch(input, init);
      };
    }
  }
}

export const networkEngine = NetworkEngine.getInstance();