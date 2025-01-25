import { ClassificationEngine } from './engine';
import { OpenAIClassifier } from './openai';
import { ImageAnalyzer } from '../image/analyzer';
import type { ClassificationResult } from './types';

export class HybridClassifier {
  private localClassifier: ClassificationEngine;
  private openaiClassifier: OpenAIClassifier;
  private imageAnalyzer: ImageAnalyzer;

  constructor() {
    this.localClassifier = new ClassificationEngine();
    this.openaiClassifier = new OpenAIClassifier();
    this.imageAnalyzer = new ImageAnalyzer();
  }

  async classify(text: string, imageUrl?: string): Promise<ClassificationResult> {
    try {
      // Run local classification
      const localResult = await this.localClassifier.classify(text);

      // If image URL is provided, get image analysis
      let imageAnalysis;
      if (imageUrl) {
        imageAnalysis = await this.imageAnalyzer.analyzeImage(imageUrl);
      }

      // Get OpenAI classification
      const openaiResult = await this.openaiClassifier.classify(text, imageAnalysis);

      // Combine results with weighted confidence
      return this.combineResults(localResult, openaiResult);
    } catch (error) {
      throw new HybridClassificationError('Hybrid classification failed', { cause: error });
    }
  }

  private combineResults(
    local: ClassificationResult,
    openai: ClassificationResult
  ): ClassificationResult {
    const localWeight = 0.3;
    const openaiWeight = 0.7;

    // Combine confidence scores
    const combinedConfidence = {
      score: (local.confidence.score * localWeight) + (openai.confidence.score * openaiWeight),
      factors: [
        ...local.confidence.factors.map(f => ({
          ...f,
          weight: f.weight * localWeight,
        })),
        ...openai.confidence.factors.map(f => ({
          ...f,
          weight: f.weight * openaiWeight,
        })),
      ],
    };

    // Use OpenAI's category if confidence is high, otherwise use local
    const category = openai.confidence.score > 0.8 
      ? openai.category 
      : local.category;

    // Combine and deduplicate tags
    const tags = Array.from(new Set([...local.tags, ...openai.tags]));

    return {
      category,
      confidence: combinedConfidence,
      tags,
      timestamp: new Date().toISOString(),
    };
  }
}

export class HybridClassificationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'HybridClassificationError';
  }
}