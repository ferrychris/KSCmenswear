import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';
import type { 
  FormState, 
  FormField, 
  ValidationResult, 
  FormAnalytics,
  AutoSaveConfig,
  FormConfig,
  FormError 
} from './types';

export class FormEngine {
  private forms: Map<string, FormState>;
  private validators: Map<string, z.ZodSchema>;
  private analytics: Map<string, FormAnalytics>;
  private autoSaveTimers: Map<string, NodeJS.Timeout>;
  private subscribers: Map<string, Set<(state: FormState) => void>>;

  constructor() {
    this.forms = new Map();
    this.validators = new Map();
    this.analytics = new Map();
    this.autoSaveTimers = new Map();
    this.subscribers = new Map();
  }

  // Form Registration
  registerForm(id: string, config: FormConfig): void {
    if (this.forms.has(id)) {
      throw new FormError('Form already registered');
    }

    const initialState: FormState = {
      fields: new Map(),
      errors: new Map(),
      touched: new Set(),
      dirty: false,
      submitting: false,
      valid: true,
      step: 0,
    };

    this.forms.set(id, initialState);
    this.validators.set(id, config.schema);
    this.setupAutoSave(id, config.autoSave);
    this.initializeAnalytics(id);
  }

  // Field Management
  updateField(formId: string, field: FormField): void {
    const form = this.getForm(formId);
    const previousValue = form.fields.get(field.name)?.value;

    form.fields.set(field.name, field);
    form.touched.add(field.name);
    form.dirty = true;

    // Validate field
    const validationResult = this.validateField(formId, field);
    this.updateFieldErrors(formId, field.name, validationResult);

    // Track field change
    this.trackFieldChange(formId, field, previousValue);

    this.notifySubscribers(formId);
  }

  // Validation
  validateForm(formId: string): boolean {
    const form = this.getForm(formId);
    const validator = this.validators.get(formId);

    if (!validator) return true;

    try {
      const formData = this.getFormData(formId);
      validator.parse(formData);
      form.valid = true;
      form.errors.clear();
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.valid = false;
        this.handleValidationErrors(formId, error);
      }
    }

    this.notifySubscribers(formId);
    return form.valid;
  }

  // Form Submission
  async submitForm(
    formId: string,
    onSubmit: (data: any) => Promise<void>
  ): Promise<void> {
    const form = this.getForm(formId);
    const startTime = performance.now();

    try {
      form.submitting = true;
      this.notifySubscribers(formId);

      if (!this.validateForm(formId)) {
        throw new FormError('Form validation failed');
      }

      const formData = this.getFormData(formId);
      await onSubmit(formData);

      // Track successful submission
      this.trackSubmission(formId, {
        success: true,
        duration: performance.now() - startTime,
      });

      // Reset form state
      this.resetForm(formId);
    } catch (error) {
      // Track failed submission
      this.trackSubmission(formId, {
        success: false,
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    } finally {
      form.submitting = false;
      this.notifySubscribers(formId);
    }
  }

  // Multi-step Form Management
  nextStep(formId: string): void {
    const form = this.getForm(formId);
    if (this.validateCurrentStep(formId)) {
      form.step++;
      this.notifySubscribers(formId);
    }
  }

  previousStep(formId: string): void {
    const form = this.getForm(formId);
    if (form.step > 0) {
      form.step--;
      this.notifySubscribers(formId);
    }
  }

  // Auto-save Functionality
  private setupAutoSave(formId: string, config?: AutoSaveConfig): void {
    if (!config?.enabled) return;

    const timer = setInterval(() => {
      const form = this.getForm(formId);
      if (form.dirty) {
        const formData = this.getFormData(formId);
        config.onSave(formData)
          .then(() => {
            form.dirty = false;
            this.trackAutoSave(formId, true);
          })
          .catch((error) => {
            this.trackAutoSave(formId, false, error);
          });
      }
    }, config.interval || 30000);

    this.autoSaveTimers.set(formId, timer);
  }

  // Analytics
  private initializeAnalytics(formId: string): void {
    this.analytics.set(formId, {
      fieldChanges: new Map(),
      submissions: [],
      autoSaves: [],
      performance: {
        averageSubmissionTime: 0,
        validationTimes: [],
        errorRate: 0,
      },
    });
  }

  getAnalytics(formId: string): FormAnalytics {
    return this.analytics.get(formId) || this.initializeAnalytics(formId);
  }

  // State Management
  subscribe(formId: string, callback: (state: FormState) => void): () => void {
    if (!this.subscribers.has(formId)) {
      this.subscribers.set(formId, new Set());
    }
    this.subscribers.get(formId)!.add(callback);
    return () => this.subscribers.get(formId)?.delete(callback);
  }

  // Private helper methods
  private getForm(formId: string): FormState {
    const form = this.forms.get(formId);
    if (!form) {
      throw new FormError('Form not found');
    }
    return form;
  }

  private validateField(formId: string, field: FormField): ValidationResult {
    const validator = this.validators.get(formId);
    if (!validator) return { valid: true, errors: [] };

    try {
      const schema = validator.shape[field.name];
      if (!schema) return { valid: true, errors: [] };

      schema.parse(field.value);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map((e) => e.message),
        };
      }
      return { valid: false, errors: ['Invalid value'] };
    }
  }

  private updateFieldErrors(
    formId: string,
    fieldName: string,
    validation: ValidationResult
  ): void {
    const form = this.getForm(formId);
    if (validation.valid) {
      form.errors.delete(fieldName);
    } else {
      form.errors.set(fieldName, validation.errors);
    }
  }

  private getFormData(formId: string): Record<string, any> {
    const form = this.getForm(formId);
    const data: Record<string, any> = {};
    form.fields.forEach((field, name) => {
      data[name] = field.value;
    });
    return data;
  }

  private validateCurrentStep(formId: string): boolean {
    const form = this.getForm(formId);
    const currentStepFields = Array.from(form.fields.entries())
      .filter(([_, field]) => field.step === form.step);

    return currentStepFields.every(([name]) => {
      const field = form.fields.get(name)!;
      const validation = this.validateField(formId, field);
      this.updateFieldErrors(formId, name, validation);
      return validation.valid;
    });
  }

  private handleValidationErrors(formId: string, error: z.ZodError): void {
    const form = this.getForm(formId);
    error.errors.forEach((err) => {
      const path = err.path[0].toString();
      const currentErrors = form.errors.get(path) || [];
      form.errors.set(path, [...currentErrors, err.message]);
    });
  }

  private resetForm(formId: string): void {
    const form = this.getForm(formId);
    form.fields.forEach((field) => {
      field.value = field.defaultValue;
    });
    form.errors.clear();
    form.touched.clear();
    form.dirty = false;
    form.step = 0;
  }

  private trackFieldChange(
    formId: string,
    field: FormField,
    previousValue: any
  ): void {
    const analytics = this.getAnalytics(formId);
    const fieldAnalytics = analytics.fieldChanges.get(field.name) || {
      changes: 0,
      corrections: 0,
      timeSpent: 0,
    };

    fieldAnalytics.changes++;
    if (previousValue !== undefined && previousValue !== field.value) {
      fieldAnalytics.corrections++;
    }

    analytics.fieldChanges.set(field.name, fieldAnalytics);
    performanceMonitor.trackCustomMetric('form_field_change', {
      formId,
      fieldName: field.name,
      changeCount: fieldAnalytics.changes,
    });
  }

  private trackSubmission(
    formId: string,
    data: { success: boolean; duration: number; error?: string }
  ): void {
    const analytics = this.getAnalytics(formId);
    analytics.submissions.push({
      timestamp: new Date().toISOString(),
      ...data,
    });

    // Update performance metrics
    const successfulSubmissions = analytics.submissions.filter((s) => s.success);
    analytics.performance.averageSubmissionTime = 
      successfulSubmissions.reduce((sum, s) => sum + s.duration, 0) / 
      successfulSubmissions.length;

    analytics.performance.errorRate = 
      (analytics.submissions.length - successfulSubmissions.length) / 
      analytics.submissions.length;

    performanceMonitor.trackCustomMetric('form_submission', {
      formId,
      success: data.success,
      duration: data.duration,
    });
  }

  private trackAutoSave(
    formId: string,
    success: boolean,
    error?: Error
  ): void {
    const analytics = this.getAnalytics(formId);
    analytics.autoSaves.push({
      timestamp: new Date().toISOString(),
      success,
      error: error?.message,
    });

    performanceMonitor.trackCustomMetric('form_auto_save', {
      formId,
      success,
    });
  }

  private notifySubscribers(formId: string): void {
    const form = this.getForm(formId);
    this.subscribers.get(formId)?.forEach((callback) => callback(form));
  }

  dispose(formId: string): void {
    const timer = this.autoSaveTimers.get(formId);
    if (timer) {
      clearInterval(timer);
      this.autoSaveTimers.delete(formId);
    }

    this.forms.delete(formId);
    this.validators.delete(formId);
    this.analytics.delete(formId);
    this.subscribers.delete(formId);
  }
}

export const formEngine = new FormEngine();