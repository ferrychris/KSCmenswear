import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { ShippingStep } from '@/components/checkout/steps/ShippingStep';
import { PaymentStep } from '@/components/checkout/steps/PaymentStep';
import { ReviewStep } from '@/components/checkout/steps/ReviewStep';
import { ConfirmationStep } from '@/components/checkout/steps/ConfirmationStep';
import { performanceMonitor } from '@/lib/performance/monitor';

const steps = [
  'Shipping',
  'Payment',
  'Review',
  'Confirmation'
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    shipping: {},
    payment: {},
  });
  const { items, total } = useCart();

  // Track checkout progress
  const trackCheckoutStep = (step: number) => {
    performanceMonitor.trackCustomMetric('checkout_step', {
      step,
      timestamp: new Date().toISOString(),
    });
  };

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const nextStep = () => {
    const nextStepIndex = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStepIndex);
    trackCheckoutStep(nextStepIndex);
  };

  const previousStep = () => {
    const prevStepIndex = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStepIndex);
    trackCheckoutStep(prevStepIndex);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ShippingStep
            data={formData.shipping}
            onUpdate={(data) => updateFormData('shipping', data)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <PaymentStep
            data={formData.payment}
            onUpdate={(data) => updateFormData('payment', data)}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 2:
        return (
          <ReviewStep
            formData={formData}
            items={items}
            total={total}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            orderNumber="123-456-789"
            email={formData.shipping.email}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Checkout
        </h1>

        <CheckoutProgress currentStep={currentStep} steps={steps} />

        <div className="mt-12 bg-white shadow rounded-lg">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}