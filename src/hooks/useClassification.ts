import { useState, useCallback } from 'react';
import { HybridClassifier } from '@/lib/classification/hybrid';
import type { ClassificationResult } from '@/lib/classification/types';

const classifier = new HybridClassifier();

export function useClassification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const classify = useCallback(async (text: string, imageUrl?: string) => {
    try {
      setLoading(true);
      setError(null);
      const classificationResult = await classifier.classify(text, imageUrl);
      setResult(classificationResult);
      return classificationResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Classification failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    classify,
    loading,
    error,
    result,
  };
}