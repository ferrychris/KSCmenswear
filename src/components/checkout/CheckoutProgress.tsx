import { cn } from '@/lib/utils';

interface CheckoutProgressProps {
  currentStep: number;
  steps: string[];
}

export function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step} className="md:flex-1">
            <div
              className={cn(
                "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0",
                index <= currentStep
                  ? "border-indigo-600"
                  : "border-gray-200"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  index <= currentStep ? "text-indigo-600" : "text-gray-500"
                )}
              >
                Step {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}