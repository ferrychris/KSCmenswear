// Extending existing types.ts with new interfaces

export interface ClassificationHistory {
  result: ClassificationResult;
  timestamp: string;
}

export interface ClassificationMetadata {
  id: string;
  timestamp: string;
  processingTime: number;
  source: string;
  version: string;
  overridden?: boolean;
  overrideReason?: string;
  overrideTimestamp?: string;
}

// Update ClassificationResult to include metadata
export interface ClassificationResult {
  category: string;
  confidence: ConfidenceScore;
  tags: string[];
  metadata: ClassificationMetadata;
}

// Existing interfaces remain unchanged
export interface ConfidenceScore {
  score: number;
  factors: Array<{
    pattern: string;
    weight: number;
  }>;
}

export interface Pattern {
  keyword: string;
  regex?: RegExp;
  weight: number;
  category?: string;
  relatedTags?: string[];
}