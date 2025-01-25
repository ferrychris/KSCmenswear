import { useState, useCallback } from 'react';
import { ClassificationPipeline } from '@/lib/classification/pipeline';
import type { ClassificationResult, ClassificationHistory } from '@/lib/classification/types';

const pipeline = new ClassificationPipeline();

export function useClassificationPipeline() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<ClassificationHistory[]>([]);

  const classify = useCallback(async (
    text: string,
    imageUrl?: string,
    options?: { bypassCache?: boolean }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const classificationResult = await pipeline.classify(text, imageUrl, options);
      setResult(classificationResult);
      setHistory(pipeline.getHistory(classificationResult.metadata.id));
      return classificationResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Classification failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const override = useCallback(async (
    originalResult: ClassificationResult,
    overrides: Partial<ClassificationResult>,
    reason: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedResult = await pipeline.override(originalResult, overrides, reason);
      setResult(updatedResult);
      setHistory(pipeline.getHistory(updatedResult.metadata.id));
      return updatedResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Override failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMetrics = useCallback(() => {
    return pipeline.getMetrics();
  }, []);

  return {
    classify,
    override,
    getMetrics,
    loading,
    error,
    result,
    history,
  };
}