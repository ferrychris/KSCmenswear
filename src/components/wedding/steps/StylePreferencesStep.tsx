import { useState } from 'react';
import { Palette, Shirt, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StylePreferencesStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const colors = [
  'Navy',
  'Black',
  'Grey',
  'Burgundy',
  'Forest Green',
  'Royal Blue',
  'Charcoal',
  'Brown',
  'Tan',
];

const attireTypes = [
  { id: 'tuxedo', label: 'Tuxedo', description: 'Classic formal wear for black-tie events' },
  { id: 'suit', label: 'Suit', description: 'Traditional suit for semi-formal to formal occasions' },
  { id: 'modern', label: 'Modern Fit', description: 'Contemporary style with a tailored silhouette' },
  { id: 'slim', label: 'Slim Fit', description: 'Sleek and fitted for a more contemporary look' },
];

const accessories = [
  { id: 'tie', label: 'Tie', icon: '👔' },
  { id: 'bowtie', label: 'Bow Tie', icon: '🎀' },
  { id: 'vest', label: 'Vest', icon: '🦺' },
  { id: 'pocketSquare', label: 'Pocket Square', icon: '🎭' },
  { id: 'cufflinks', label: 'Cufflinks', icon: '✨' },
  { id: 'suspenders', label: 'Suspenders', icon: '🔄' },
];

export function StylePreferencesStep({ data, onUpdate, onNext, onBack }: StylePreferencesStepProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>(data.colors || []);
  const [attireType, setAttireType] = useState(data.attireType || '');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(data.accessories || []);
  const [customRequests, setCustomRequests] = useState(data.customRequests || '');

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleAccessory = (accessoryId: string) => {
    setSelectedAccessories(prev =>
      prev.includes(accessoryId)
        ? prev.filter(a => a !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  const handleNext = () => {
    onUpdate({
      colors: selectedColors,
      attireType,
      accessories: selectedAccessories,
      customRequests,
    });
    onNext();
  };

  const isValid = selectedColors.length > 0 && attireType && selectedAccessories.length > 0;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Style Preferences</h1>
        <p className="mt-4 text-gray-600">
          Let's find the perfect style for your special day
        </p>
      </div>

      {/* Wedding Colors */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Palette className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Wedding Colors</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={cn(
                'p-4 border-2 rounded-lg transition-colors',
                selectedColors.includes(color)
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Attire Type */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Shirt className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Attire Type</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {attireTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setAttireType(type.id)}
              className={cn(
                'p-4 border-2 rounded-lg text-left transition-colors',
                attireType === type.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              )}
            >
              <div className="font-semibold">{type.label}</div>
              <div className="text-sm text-gray-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Accessories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {accessories.map((accessory) => (
            <button
              key={accessory.id}
              onClick={() => toggleAccessory(accessory.id)}
              className={cn(
                'p-4 border-2 rounded-lg transition-colors',
                selectedAccessories.includes(accessory.id)
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span>{accessory.label}</span>
                <span className="text-2xl">{accessory.icon}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Requests */}
      <div>
        <label htmlFor="custom-requests" className="block text-sm font-medium text-gray-700">
          Special Requests or Notes
        </label>
        <textarea
          id="custom-requests"
          rows={4}
          value={customRequests}
          onChange={(e) => setCustomRequests(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Any special requirements or preferences..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="bg-white text-gray-600 px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-400"
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}