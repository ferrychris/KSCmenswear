import { useEffect, useState } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import type { PerformanceReport } from '@/lib/performance/types';

interface PerformanceMonitorProps {
  interval?: number;
  onReport?: (report: PerformanceReport) => void;
}

export function PerformanceMonitor({
  interval = 60000, // Default to 1 minute
  onReport,
}: PerformanceMonitorProps) {
  const { generateReport } = usePerformance();
  const [lastReport, setLastReport] = useState<PerformanceReport | null>(null);

  useEffect(() => {
    // Generate initial report
    const report = generateReport();
    setLastReport(report);
    onReport?.(report);

    // Set up interval for periodic reporting
    const timer = setInterval(() => {
      const report = generateReport();
      setLastReport(report);
      onReport?.(report);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, generateReport, onReport]);

  if (!lastReport) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>

      {/* Web Vitals */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Core Web Vitals</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(lastReport.webVitals).map(([name, data]) => (
            <div
              key={name}
              className={`p-4 rounded-lg ${
                data.status === 'good'
                  ? 'bg-green-50'
                  : data.status === 'needs-improvement'
                  ? 'bg-yellow-50'
                  : 'bg-red-50'
              }`}
            >
              <div className="text-sm font-medium">{name}</div>
              <div className="text-2xl font-bold">{Math.round(data.value)}</div>
              <div className="text-xs text-gray-500">{data.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Usage */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Resource Usage</h3>
        <div className="space-y-2">
          {Object.entries(lastReport.resources).map(([type, data]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-sm">{type}</span>
              <div className="text-sm">
                <span className="font-medium">{data.count}</span> requests,{' '}
                <span className="font-medium">
                  {Math.round(data.averageSize / 1024)}
                </span>{' '}
                KB avg
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Performance */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">API Performance</h3>
        <div className="space-y-2">
          {Object.entries(lastReport.api).map(([endpoint, data]) => (
            <div key={endpoint} className="flex justify-between items-center">
              <span className="text-sm truncate max-w-[200px]">{endpoint}</span>
              <div className="text-sm">
                <span className="font-medium">
                  {Math.round(data.averageDuration)}
                </span>{' '}
                ms avg,{' '}
                <span
                  className={`${
                    data.errorRate > 0.1 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {Math.round(data.errorRate * 100)}%
                </span>{' '}
                errors
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Summary */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Errors</h3>
        <div className="space-y-2">
          {Object.entries(lastReport.errors).map(([type, data]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-sm">{type}</span>
              <div className="text-sm">
                <span className="font-medium">{data.count}</span> occurrences,
                last:{' '}
                {new Date(data.lastOccurrence).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {lastReport.recommendations.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {lastReport.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-600">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}