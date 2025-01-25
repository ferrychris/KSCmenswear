import { RekognitionClient, DetectLabelsCommand, DetectTextCommand, DetectCustomLabelsCommand } from '@aws-sdk/client-rekognition';
import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import { RateLimiter } from '../security/rateLimit';
import { awsConfig } from '@/config/aws';
import type { ImageAnalysisResult, ColorInfo, Feature, MaterialInfo } from './types';

export class ImageAnalyzer {
  private rekognition: RekognitionClient;
  private cache: MemoryCache<ImageAnalysisResult>;
  private rateLimiter: RateLimiter;

  constructor() {
    this.rekognition = new RekognitionClient(awsConfig);
    this.cache = new MemoryCache(50 * 1024 * 1024); // 50MB cache
    this.rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
  }

  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    const cacheKey = `image-analysis:${imageUrl}`;
    const cached = this.cache.get<ImageAnalysisResult>(cacheKey);
    if (cached) return cached;

    if (!this.rateLimiter.canMakeRequest()) {
      throw new ImageAnalysisError('Rate limit exceeded');
    }

    try {
      const imageBuffer = await this.fetchImage(imageUrl);
      
      const [
        colorAnalysis,
        patternAnalysis,
        materialAnalysis,
        featureAnalysis,
        qualityAnalysis
      ] = await Promise.all([
        this.detectColors(imageBuffer),
        this.detectPatterns(imageBuffer),
        this.detectMaterials(imageBuffer),
        this.detectFeatures(imageBuffer),
        this.validateQuality(imageBuffer)
      ]);

      const result: ImageAnalysisResult = {
        colors: colorAnalysis,
        patterns: patternAnalysis,
        materials: materialAnalysis,
        features: featureAnalysis,
        quality: qualityAnalysis,
        metadata: {
          url: imageUrl,
          timestamp: new Date().toISOString(),
          processingTime: 0,
        }
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      throw new ImageAnalysisError('Image analysis failed', { cause: error });
    }
  }

  // Color detection and categorization
  private async detectColors(imageBuffer: Buffer): Promise<ColorInfo[]> {
    const canvas = await this.createCanvas(imageBuffer);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors = new Map<string, number>();

    // Sample pixels at regular intervals
    const sampleSize = Math.floor(imageData.data.length / 1000);
    for (let i = 0; i < imageData.data.length; i += sampleSize) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const hex = this.rgbToHex(r, g, b);
      colors.set(hex, (colors.get(hex) || 0) + 1);
    }

    // Convert to percentage and sort
    const total = Array.from(colors.values()).reduce((a, b) => a + b, 0);
    return Array.from(colors.entries())
      .map(([color, count]) => ({
        color,
        percentage: count / total,
        name: this.getColorName(color),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }

  // Style pattern recognition
  private async detectPatterns(imageBuffer: Buffer): Promise<string[]> {
    const params = {
      Image: { Bytes: imageBuffer },
      MinConfidence: 80,
    };

    const command = new DetectCustomLabelsCommand(params);
    const response = await this.rekognition.send(command);

    return response.CustomLabels
      ?.filter(label => label.Confidence >= 80)
      .map(label => label.Name)
      || [];
  }

  // Material analysis
  private async detectMaterials(imageBuffer: Buffer): Promise<MaterialInfo[]> {
    const params = {
      Image: { Bytes: imageBuffer },
      Features: ['MATERIAL_DETECTION'],
    };

    const command = new DetectLabelsCommand(params);
    const response = await this.rekognition.send(command);

    return response.Labels
      ?.filter(label => label.Categories?.some(c => c.Name === 'Material'))
      .map(label => ({
        name: label.Name,
        confidence: label.Confidence / 100,
        properties: label.Properties?.map(p => ({
          name: p.Name,
          value: p.Value,
        })) || [],
      }))
      || [];
  }

  // Feature detection
  private async detectFeatures(imageBuffer: Buffer): Promise<Feature[]> {
    const features: Feature[] = [];

    // Detect text for labels, sizes, etc.
    const textCommand = new DetectTextCommand({
      Image: { Bytes: imageBuffer },
    });
    const textResponse = await this.rekognition.send(textCommand);

    // Detect clothing features
    const labelCommand = new DetectLabelsCommand({
      Image: { Bytes: imageBuffer },
      Features: ['GENERAL_LABELS'],
    });
    const labelResponse = await this.rekognition.send(labelCommand);

    // Process detected features
    labelResponse.Labels?.forEach(label => {
      if (this.isClothingFeature(label.Name)) {
        features.push({
          type: label.Name,
          confidence: label.Confidence / 100,
          location: label.Geometry?.BoundingBox || null,
        });
      }
    });

    return features;
  }

  // Image quality validation
  private async validateQuality(imageBuffer: Buffer): Promise<QualityAnalysis> {
    const canvas = await this.createCanvas(imageBuffer);
    const { width, height } = canvas;

    return {
      dimensions: { width, height },
      aspectRatio: width / height,
      resolution: width * height,
      format: this.getImageFormat(imageBuffer),
      isValid: this.validateImageSpecs({ width, height }),
      recommendations: this.generateQualityRecommendations({ width, height }),
    };
  }

  // Utility methods
  private async fetchImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async createCanvas(buffer: Buffer): Promise<HTMLCanvasElement> {
    const img = new Image();
    const blob = new Blob([buffer]);
    img.src = URL.createObjectURL(blob);

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    return canvas;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  private getColorName(hex: string): string {
    // Implement color naming logic or use a color naming library
    return hex;
  }

  private isClothingFeature(name: string): boolean {
    const features = ['Button', 'Zipper', 'Collar', 'Pocket', 'Lapel'];
    return features.some(f => name.includes(f));
  }

  private validateImageSpecs(dimensions: { width: number; height: number }): boolean {
    const { width, height } = dimensions;
    const minDimension = 800;
    const maxDimension = 4000;
    const aspectRatioMin = 0.5;
    const aspectRatioMax = 2;

    return (
      width >= minDimension &&
      width <= maxDimension &&
      height >= minDimension &&
      height <= maxDimension &&
      width / height >= aspectRatioMin &&
      width / height <= aspectRatioMax
    );
  }

  private generateQualityRecommendations(dimensions: { width: number; height: number }): string[] {
    const recommendations: string[] = [];
    const { width, height } = dimensions;

    if (width < 800 || height < 800) {
      recommendations.push('Increase image resolution to at least 800x800 pixels');
    }
    if (width > 4000 || height > 4000) {
      recommendations.push('Reduce image size to maximum 4000x4000 pixels');
    }
    if (width / height < 0.5 || width / height > 2) {
      recommendations.push('Adjust aspect ratio to be between 1:2 and 2:1');
    }

    return recommendations;
  }

  private getImageFormat(buffer: Buffer): string {
    const signature = buffer.toString('hex', 0, 4);
    switch (signature) {
      case '89504e47':
        return 'image/png';
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2':
        return 'image/jpeg';
      case '47494638':
        return 'image/gif';
      default:
        return 'unknown';
    }
  }
}

// Error handling
export class ImageAnalysisError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ImageAnalysisError';
  }
}

// Validation schemas
export const ColorSchema = z.object({
  color: z.string(),
  percentage: z.number().min(0).max(1),
  name: z.string(),
});

export const FeatureSchema = z.object({
  type: z.string(),
  confidence: z.number().min(0).max(1),
  location: z.object({
    left: z.number(),
    top: z.number(),
    width: z.number(),
    height: z.number(),
  }).nullable(),
});

export const MaterialSchema = z.object({
  name: z.string(),
  confidence: z.number().min(0).max(1),
  properties: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })),
});