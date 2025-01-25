import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MultiStepFormProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  children: ReactNode;
  className?: string;
}

export function MultiStepForm({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isValid,
  isSubmitting,
  children,
  className,
}: MultiStepFormProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <nav aria-label="Progress">
        <ol
          role="list"
          className="flex items-center"
        >
          {[...Array(totalSteps)].map((_, index) => (
            <li
              key={index}
              className={cn(
                'relative',
                index !== totalSteps - 1 && 'flex-1'
              )}
            >
              <div className="flex items-center">
                <span
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                    index < currentStep
                      ? 'bg-indigo-600 text-white'
                      : index === currentStep
                      ? 'border-2 border-indigo-600 text-indigo-600'
                      : 'border-2 border-gray-300 text-gray-500'
                  )}
                >
                  {index + 1}
                </span>
                {index !== totalSteps - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-full',
                      index < currentStep
                        ? 'bg-indigo-600'
                        : 'bg-gray-300'
                    )}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div
        role="group"
        aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        {children}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep === 0 || isSubmitting}
          className={cn(
            'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50',
            (currentStep === 0 || isSubmitting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid || isSubmitting}
          className={cn(
            'px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700',
            (!isValid || isSubmitting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}