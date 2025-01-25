import { useState, useCallback } from 'react';
import { ImageAnalyzer } from '@/lib/image/analyzer';
import type { ImageAnalysisResult } from '@/lib/image/types';

const imageAnalyzer = new ImageAnalyzer();

export function useImageAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);

  const analyzeImage = useCallback(async (imageUrl: string) => {
    try {
      setLoading(true);
      setError(null);
      const analysisResult = await imageAnalyzer.analyzeImage(imageUrl);
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Image analysis failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analyzeImage,
    loading,
    error,
    result,
  };
}