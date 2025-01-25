import { useEffect, useCallback, useState } from 'react';
import { formEngine } from '@/lib/forms/engine';
import type { FormState, FormField, FormConfig } from '@/lib/forms/types';

export function useForm(id: string, config: FormConfig) {
  const [state, setState] = useState<FormState>(() => ({
    fields: new Map(),
    errors: new Map(),
    touched: new Set(),
    dirty: false,
    submitting: false,
    valid: true,
    step: 0,
  }));

  useEffect(() => {
    formEngine.registerForm(id, config);
    const unsubscribe = formEngine.subscribe(id, setState);
    return () => {
      unsubscribe();
      formEngine.dispose(id);
    };
  }, [id, config]);

  const updateField = useCallback((field: FormField) => {
    formEngine.updateField(id, field);
  }, [id]);

  const handleSubmit = useCallback(async (
    onSubmit: (data: any) => Promise<void>
  ) => {
    try {
      await formEngine.submitForm(id, onSubmit);
      return true;
    } catch (error) {
      return false;
    }
  }, [id]);

  const nextStep = useCallback(() => {
    formEngine.nextStep(id);
  }, [id]);

  const previousStep = useCallback(() => {
    formEngine.previousStep(id);
  }, [id]);

  const getAnalytics = useCallback(() => {
    return formEngine.getAnalytics(id);
  }, [id]);

  return {
    state,
    updateField,
    handleSubmit,
    nextStep,
    previousStep,
    getAnalytics,
  };
}