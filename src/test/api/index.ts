import { rest } from 'msw';
import { server } from '../setup';
import { performanceMonitor } from '@/lib/performance/monitor';

export function mockAPI(
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  response: any,
  options = {}
) {
  server.use(
    rest[method](path, (req, res, ctx) => {
      // Track API metrics
      const startTime = performance.now();
      performanceMonitor.trackAPICall({
        endpoint: path,
        method: method.toUpperCase(),
        duration: performance.now() - startTime,
        status: 200,
      });

      return res(
        ctx.delay(options.delay || 0),
        ctx.status(options.status || 200),
        ctx.json(response)
      );
    })
  );
}

export function mockAPIError(
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  error: any,
  options = {}
) {
  server.use(
    rest[method](path, (req, res, ctx) => {
      // Track API error
      performanceMonitor.trackAPICall({
        endpoint: path,
        method: method.toUpperCase(),
        duration: 0,
        status: options.status || 500,
        error: true,
      });

      return res(
        ctx.delay(options.delay || 0),
        ctx.status(options.status || 500),
        ctx.json(error)
      );
    })
  );
}