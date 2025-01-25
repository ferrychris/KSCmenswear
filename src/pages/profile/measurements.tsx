import { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { Ruler, Save } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AutoSaveIndicator } from '@/components/forms/AutoSaveIndicator';
import { ProfilePageSEO } from '@/components/seo/ProfilePageSEO';

export default function Measurements() {
  const { measurements, updateMeasurements } = useProfileStore();
  const [formData, setFormData] = useState(measurements);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(undefined);
      await updateMeasurements(formData);
      setLastSaved(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save measurements');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <ProfilePageSEO page="measurements" userData={{ measurements: formData }} />
      <PageHeader
        title="My Measurements"
        description="Keep track of your measurements for a perfect fit every time"
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Ruler className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Body Measurements</h2>
              </div>
              <AutoSaveIndicator
                saving={saving}
                lastSaved={lastSaved}
                error={error}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'chest', label: 'Chest', unit: 'inches' },
                { key: 'waist', label: 'Waist', unit: 'inches' },
                { key: 'inseam', label: 'Inseam', unit: 'inches' },
                { key: 'neck', label: 'Neck', unit: 'inches' },
                { key: 'sleeve', label: 'Sleeve', unit: 'inches' },
              ].map(({ key, label, unit }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.1"
                      value={formData[key as keyof typeof formData] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: parseFloat(e.target.value),
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">{unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Measurements
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-indigo-900 mb-4">
              Measurement Tips
            </h3>
            <ul className="space-y-3 text-sm text-indigo-800">
              <li>• Measure over undergarments for the most accurate fit</li>
              <li>• Keep the measuring tape snug but not tight</li>
              <li>• Stand naturally while taking measurements</li>
              <li>• For best results, have someone else take your measurements</li>
              <li>• Update your measurements every 6 months or after significant weight changes</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}