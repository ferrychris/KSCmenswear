import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';

interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[];
  audience?: (user: any) => boolean;
}

interface ExperimentResult {
  experimentId: string;
  variant: string;
  timestamp: string;
  metrics: Record<string, number>;
}

export class ABTestingEngine {
  private experiments: Map<string, Experiment>;
  private results: Map<string, ExperimentResult[]>;
  private activeVariants: Map<string, string>;
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.experiments = new Map();
    this.results = new Map();
    this.activeVariants = new Map();
    this.storage = storage;
    this.loadActiveVariants();
  }

  registerExperiment(experiment: Experiment): void {
    const validatedExperiment = ExperimentSchema.parse(experiment);
    this.experiments.set(validatedExperiment.id, validatedExperiment);
  }

  getVariant(experimentId: string, user?: any): string | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    // Check if variant is already assigned
    let variant = this.activeVariants.get(experimentId);
    if (variant) return variant;

    // Check audience targeting
    if (experiment.audience && user && !experiment.audience(user)) {
      return null;
    }

    // Assign variant based on weights or randomly
    variant = this.assignVariant(experiment);
    this.activeVariants.set(experimentId, variant);
    this.saveActiveVariants();

    return variant;
  }

  trackMetric(experimentId: string, metric: string, value: number): void {
    const variant = this.activeVariants.get(experimentId);
    if (!variant) return;

    const result: ExperimentResult = {
      experimentId,
      variant,
      timestamp: new Date().toISOString(),
      metrics: { [metric]: value },
    };

    const experimentResults = this.results.get(experimentId) || [];
    experimentResults.push(result);
    this.results.set(experimentId, experimentResults);

    performanceMonitor.trackCustomMetric('ab_test_metric', {
      experimentId,
      variant,
      metric,
      value,
    });
  }

  getResults(experimentId: string): ExperimentResult[] {
    return this.results.get(experimentId) || [];
  }

  private assignVariant(experiment: Experiment): string {
    const { variants, weights = [] } = experiment;

    if (weights.length === variants.length) {
      // Weighted random selection
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < variants.length; i++) {
        random -= weights[i];
        if (random <= 0) return variants[i];
      }
    }

    // Equal probability if no weights
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }

  private loadActiveVariants(): void {
    try {
      const stored = this.storage.getItem('ab_variants');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.activeVariants = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Failed to load A/B test variants:', error);
    }
  }

  private saveActiveVariants(): void {
    try {
      const variants = Object.fromEntries(this.activeVariants);
      this.storage.setItem('ab_variants', JSON.stringify(variants));
    } catch (error) {
      console.error('Failed to save A/B test variants:', error);
    }
  }
}

const ExperimentSchema = z.object({
  id: z.string(),
  name: z.string(),
  variants: z.array(z.string()).min(2),
  weights: z.array(z.number()).optional(),
  audience: z.function().optional(),
});

export const abTestingEngine = new ABTestingEngine();