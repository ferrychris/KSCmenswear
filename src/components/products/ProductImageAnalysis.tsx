import { useEffect } from 'react';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';

interface ProductImageAnalysisProps {
  imageUrl: string;
  onAnalysisComplete?: (result: any) => void;
}

export function ProductImageAnalysis({ imageUrl, onAnalysisComplete }: ProductImageAnalysisProps) {
  const { analyzeImage, loading, error, result } = useImageAnalysis();

  useEffect(() => {
    if (imageUrl) {
      analyzeImage(imageUrl)
        .then(result => {
          onAnalysisComplete?.(result);
        })
        .catch(console.error);
    }
  }, [imageUrl, analyzeImage, onAnalysisComplete]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Failed to analyze image: {error.message}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Colors</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {result.colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 rounded-full px-3 py-1 text-sm border"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color.color }}
              />
              <span>{color.name} ({Math.round(color.percentage * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {result.patterns.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">Patterns</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.patterns.map((pattern, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.materials.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">Materials</h3>
          <div className="mt-2 space-y-2">
            {result.materials.map((material, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{material.name}</span>
                <span className="text-gray-500">
                  {Math.round(material.confidence * 100)}% confidence
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result.quality.isValid && (
        <div className="rounded-md bg-yellow-50 p-4">
          <h3 className="text-lg font-medium text-yellow-800">Image Quality Recommendations</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-yellow-700">
            {result.quality.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}