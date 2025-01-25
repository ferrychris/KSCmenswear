import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StepProgress } from '@/components/layout/StepProgress';
import { InitialInfoStep } from '@/components/wedding/steps/InitialInfoStep';
import { ContactInfoStep } from '@/components/wedding/steps/ContactInfoStep';
import { StylePreferencesStep } from '@/components/wedding/steps/StylePreferencesStep';
import { PartyMembersStep } from '@/components/wedding/steps/PartyMembersStep';
import { ConfirmationStep } from '@/components/wedding/steps/ConfirmationStep';

const steps = [
  'Initial Information',
  'Contact Information',
  'Style Preferences',
  'Party Members (Optional)',
  'Confirmation'
];

export default function WeddingSignUp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    initialInfo: {},
    contactInfo: {},
    stylePreferences: {},
    partyMembers: [],
  });

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const skipPartyMembers = () => {
    setCurrentStep(4); // Skip to confirmation step
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <InitialInfoStep
            data={formData.initialInfo}
            onUpdate={(data) => updateFormData('initialInfo', data)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <ContactInfoStep
            data={formData.contactInfo}
            onUpdate={(data) => updateFormData('contactInfo', data)}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 2:
        return (
          <StylePreferencesStep
            data={formData.stylePreferences}
            onUpdate={(data) => updateFormData('stylePreferences', data)}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 3:
        return (
          <PartyMembersStep
            data={formData.partyMembers}
            onUpdate={(data) => updateFormData('partyMembers', data)}
            onNext={nextStep}
            onBack={previousStep}
            onSkip={skipPartyMembers}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            formData={formData}
            onBack={previousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Wedding Registration"
        description="Let's get started with your wedding planning"
        backTo="/wedding/services"
        backLabel="Back to Wedding Services"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <StepProgress 
          steps={steps} 
          currentStep={currentStep} 
          className="mb-12"
        />

        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}