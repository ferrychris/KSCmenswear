import { z } from 'zod';

export interface FormState {
  fields: Map<string, FormField>;
  errors: Map<string, string[]>;
  touched: Set<string>;
  dirty: boolean;
  submitting: boolean;
  valid: boolean;
  step: number;
}

export interface FormField {
  name: string;
  value: any;
  defaultValue: any;
  type: string;
  label: string;
  required: boolean;
  disabled: boolean;
  step?: number;
  validation?: z.ZodSchema;
  dependencies?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface FormAnalytics {
  fieldChanges: Map<string, FieldAnalytics>;
  submissions: SubmissionAnalytics[];
  autoSaves: AutoSaveAnalytics[];
  performance: FormPerformance;
}

export interface FieldAnalytics {
  changes: number;
  corrections: number;
  timeSpent: number;
}

export interface SubmissionAnalytics {
  timestamp: string;
  success: boolean;
  duration: number;
  error?: string;
}

export interface AutoSaveAnalytics {
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface FormPerformance {
  averageSubmissionTime: number;
  validationTimes: number[];
  errorRate: number;
}

export interface AutoSaveConfig {
  enabled: boolean;
  interval?: number;
  onSave: (data: any) => Promise<void>;
}

export interface FormConfig {
  schema: z.ZodSchema;
  autoSave?: AutoSaveConfig;
  steps?: number;
}

export class FormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormError';
  }
}