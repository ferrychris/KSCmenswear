import { Modal } from '@/components/ui/Modal';
import { Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType: 'suit' | 'shirt' | 'shoes';
}

export function SizeGuideModal({ isOpen, onClose, productType }: SizeGuideModalProps) {
  const sizeCharts = {
    suit: {
      title: 'Suit Size Guide',
      description: 'Find your perfect suit size with our comprehensive measurement guide.',
      measurements: [
        { size: '36S', chest: '36"', waist: '30"', sleeve: '32"' },
        { size: '38R', chest: '38"', waist: '32"', sleeve: '33"' },
        { size: '40L', chest: '40"', waist: '34"', sleeve: '34"' },
        { size: '42R', chest: '42"', waist: '36"', sleeve: '33"' },
        { size: '44L', chest: '44"', waist: '38"', sleeve: '34"' },
      ],
      howToMeasure: [
        { name: 'Chest', instruction: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
        { name: 'Waist', instruction: 'Measure around your natural waistline, keeping the tape comfortably loose.' },
        { name: 'Sleeve', instruction: 'Measure from shoulder seam to wrist bone with arm slightly bent.' },
      ],
    },
    shirt: {
      title: 'Shirt Size Guide',
      description: 'Find your perfect shirt size with our detailed measurement guide.',
      measurements: [
        { size: 'S', neck: '14-14.5"', chest: '34-36"', sleeve: '32-33"' },
        { size: 'M', neck: '15-15.5"', chest: '38-40"', sleeve: '33-34"' },
        { size: 'L', neck: '16-16.5"', chest: '42-44"', sleeve: '34-35"' },
        { size: 'XL', neck: '17-17.5"', chest: '46-48"', sleeve: '35-36"' },
      ],
      howToMeasure: [
        { name: 'Neck', instruction: 'Measure around the base of your neck where the collar sits.' },
        { name: 'Chest', instruction: 'Measure around the fullest part of your chest, under your armpits.' },
        { name: 'Sleeve', instruction: 'Measure from center back neck, over shoulder, to wrist bone.' },
      ],
    },
    shoes: {
      title: 'Shoe Size Guide',
      description: 'Find your perfect shoe size with our detailed measurement guide.',
      measurements: [
        { size: '8', length: '9.9"', width: 'D' },
        { size: '9', length: '10.2"', width: 'D' },
        { size: '10', length: '10.5"', width: 'D' },
        { size: '11', length: '10.8"', width: 'D' },
        { size: '12', length: '11.1"', width: 'D' },
      ],
      howToMeasure: [
        { name: 'Length', instruction: 'Measure from heel to toe while standing.' },
        { name: 'Width', instruction: 'Measure across the widest part of your foot.' },
      ],
    },
  };

  const chart = sizeCharts[productType];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={chart.title}>
      <div className="mt-4 space-y-6">
        <p className="text-sm text-gray-500">{chart.description}</p>

        {/* Size Chart */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {Object.keys(chart.measurements[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chart.measurements.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">How to Measure</h3>
          <div className="space-y-4">
            {chart.howToMeasure.map((item) => (
              <div key={item.name} className="flex items-start gap-3">
                <Ruler className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Measuring Tips</h3>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Use a flexible measuring tape</li>
            <li>• Keep the tape snug but not tight</li>
            <li>• Measure twice for accuracy</li>
            <li>• When in doubt, size up</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}