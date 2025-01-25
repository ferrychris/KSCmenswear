export interface ImageAnalysisResult {
  colors: ColorInfo[];
  patterns: string[];
  materials: MaterialInfo[];
  features: Feature[];
  quality: QualityAnalysis;
  metadata: ImageMetadata;
}

export interface ColorInfo {
  color: string;
  percentage: number;
  name: string;
}

export interface MaterialInfo {
  name: string;
  confidence: number;
  properties: Array<{
    name: string;
    value: string;
  }>;
}

export interface Feature {
  type: string;
  confidence: number;
  location: BoundingBox | null;
}

export interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface QualityAnalysis {
  dimensions: {
    width: number;
    height: number;
  };
  aspectRatio: number;
  resolution: number;
  format: string;
  isValid: boolean;
  recommendations: string[];
}

export interface ImageMetadata {
  url: string;
  timestamp: string;
  processingTime: number;
}