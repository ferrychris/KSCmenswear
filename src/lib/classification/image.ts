import { z } from 'zod';
import { RateLimiter } from '../security/rateLimit';
import type { ImageAnalysisResult } from './types';

export class ImageAnalyzer {
  private apiUrl: string;
  private apiKey: string;
  private rateLimiter: RateLimiter;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
  }

  async analyze(imageUrl: string): Promise<ImageAnalysisResult> {
    if (!this.rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const response = await fetch(`${this.apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Image analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      return ImageAnalysisSchema.parse(data);
    } catch (error) {
      throw new ImageAnalysisError('Image analysis failed', { cause: error });
    }
  }

  // Local image feature extraction
  async extractFeatures(imageUrl: string): Promise<Record<string, number>> {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return this.computeImageFeatures(imageData);
    } catch (error) {
      throw new ImageAnalysisError('Feature extraction failed', { cause: error });
    }
  }

  private computeImageFeatures(imageData: ImageData): Record<string, number> {
    const { data, width, height } = imageData;
    const features: Record<string, number> = {
      averageBrightness: 0,
      colorDiversity: 0,
      edgeIntensity: 0,
    };

    // Calculate average brightness
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += (r + g + b) / 3;
    }
    features.averageBrightness = totalBrightness / (width * height);

    return features;
  }
}

// Error handling
export class ImageAnalysisError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ImageAnalysisError';
  }
}

// Validation schema
const ImageAnalysisSchema = z.object({
  objects: z.array(z.object({
    label: z.string(),
    confidence: z.number().min(0).max(1),
    boundingBox: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    }),
  })),
  tags: z.array(z.string()),
  colors: z.array(z.object({
    color: z.string(),
    percentage: z.number(),
  })),
  metadata: z.object({
    width: z.number(),
    height: z.number(),
    format: z.string(),
  }),
});