import { ImageAnalyzer } from './analyzer';
import type { ImageAnalysisResult } from './types';

export class BatchImageProcessor {
  private analyzer: ImageAnalyzer;
  private concurrency: number;

  constructor(analyzer: ImageAnalyzer, concurrency = 5) {
    this.analyzer = analyzer;
    this.concurrency = concurrency;
  }

  async processBatch(imageUrls: string[]): Promise<Map<string, ImageAnalysisResult>> {
    const results = new Map<string, ImageAnalysisResult>();
    const errors = new Map<string, Error>();

    // Process images in chunks to control concurrency
    for (let i = 0; i < imageUrls.length; i += this.concurrency) {
      const chunk = imageUrls.slice(i, i + this.concurrency);
      const promises = chunk.map(async (url) => {
        try {
          const result = await this.analyzer.analyzeImage(url);
          results.set(url, result);
        } catch (error) {
          errors.set(url, error instanceof Error ? error : new Error('Unknown error'));
        }
      });

      await Promise.all(promises);

      // Add delay between chunks to prevent rate limiting
      if (i + this.concurrency < imageUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (errors.size > 0) {
      console.error('Batch processing errors:', errors);
    }

    return results;
  }

  async processWithProgress(
    imageUrls: string[],
    onProgress?: (progress: number) => void
  ): Promise<Map<string, ImageAnalysisResult>> {
    const total = imageUrls.length;
    let processed = 0;
    const results = new Map<string, ImageAnalysisResult>();

    const processChunk = async (urls: string[]) => {
      const chunkResults = await this.processBatch(urls);
      chunkResults.forEach((result, url) => results.set(url, result));
      processed += urls.length;
      onProgress?.(processed / total);
    };

    const chunks = this.chunkArray(imageUrls, this.concurrency);
    for (const chunk of chunks) {
      await processChunk(chunk);
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}