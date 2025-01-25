import { useState, useEffect } from 'react';
import { performanceMonitor } from '@/lib/performance/monitor';
import type { PerformanceReport } from '@/lib/performance/types';

export function PerformanceDashboard() {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    const updateReport = () => {
      const newReport = performanceMonitor.generateReport();
      setReport(newReport);
    };

    updateReport();

    if (autoRefresh) {
      const interval = setInterval(updateReport, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (!report) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Performance Metrics</h2>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="mr-2"
          />
          Auto-refresh
        </label>
      </div>

      {/* Web Vitals */}
      <div className="mb-8">
        <h3 className="text-md font-medium mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(report.webVitals).map(([name, data]) => (
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
      <div className="mb-8">
        <h3 className="text-md font-medium mb-4">Resource Usage</h3>
        <div className="space-y-2">
          {Object.entries(report.resources).map(([type, data]) => (
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
      <div className="mb-8">
        <h3 className="text-md font-medium mb-4">API Performance</h3>
        <div className="space-y-2">
          {Object.entries(report.api).map(([endpoint, data]) => (
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
      <div className="mb-8">
        <h3 className="text-md font-medium mb-4">Errors</h3>
        <div className="space-y-2">
          {Object.entries(report.errors).map(([type, data]) => (
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
      {report.recommendations.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-4">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {report.recommendations.map((recommendation, index) => (
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