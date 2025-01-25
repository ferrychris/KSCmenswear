import { formatDistanceToNow } from 'date-fns';
import type { ClassificationResult } from '@/lib/classification/types';

interface ClassificationResultProps {
  result: ClassificationResult;
  onOverride?: (overrides: Partial<ClassificationResult>) => void;
}

export function ClassificationResultView({ result, onOverride }: ClassificationResultProps) {
  const confidence = Math.round(result.confidence.score * 100);
  const isOverridden = result.metadata.overridden;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Classification Result</h3>
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(result.metadata.timestamp))} ago
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {result.category}
            </span>
            {isOverridden && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                Overridden
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Confidence</label>
          <div className="mt-1">
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-700">{confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {result.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Confidence Factors
        </label>
        <div className="mt-2 space-y-2">
          {result.confidence.factors.map((factor, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{factor.pattern}</span>
              <span className="text-gray-500">
                {Math.round(factor.weight * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {onOverride && (
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onOverride({})}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Override Classification
          </button>
        </div>
      )}
    </div>
  );
}