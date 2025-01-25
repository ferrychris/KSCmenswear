import { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartyMembersStepProps {
  data: PartyMember[];
  onUpdate: (data: PartyMember[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

interface PartyMember {
  id: string;
  name: string;
  role: string;
  measurements: {
    chest: string;
    waist: string;
    inseam: string;
    neck: string;
    sleeve: string;
  };
  notes: string;
}

const roles = [
  'Best Man',
  'Groomsman',
  'Father of the Bride',
  'Father of the Groom',
  'Ring Bearer',
  'Usher'
];

const emptyMeasurements = {
  chest: '',
  waist: '',
  inseam: '',
  neck: '',
  sleeve: ''
};

export function PartyMembersStep({ data, onUpdate, onNext, onBack, onSkip }: PartyMembersStepProps) {
  const [members, setMembers] = useState<PartyMember[]>(
    data.length > 0 ? data : [{
      id: '1',
      name: '',
      role: '',
      measurements: { ...emptyMeasurements },
      notes: ''
    }]
  );

  const addMember = () => {
    setMembers(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: '',
        role: '',
        measurements: { ...emptyMeasurements },
        notes: ''
      }
    ]);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateMember = (id: string, field: string, value: string) => {
    setMembers(prev => prev.map(member => {
      if (member.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...member,
            [parent]: {
              ...member[parent as keyof PartyMember],
              [child]: value
            }
          };
        }
        return { ...member, [field]: value };
      }
      return member;
    }));
  };

  const handleNext = () => {
    onUpdate(members);
    onNext();
  };

  const isValid = members.every(member => 
    member.name && 
    member.role && 
    Object.values(member.measurements).every(m => m)
  );

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Wedding Party Members</h1>
        <p className="mt-4 text-gray-600">
          Add details for each member of your wedding party (optional)
        </p>
      </div>

      <div className="space-y-8">
        {members.map((member, index) => (
          <div 
            key={member.id}
            className="bg-gray-50 rounded-lg p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-600" />
                Party Member {index + 1}
              </h3>
              {members.length > 1 && (
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={member.role}
                  onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Measurements */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Measurements (inches)</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(member.measurements).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateMember(member.id, `measurements.${key}`, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      step="0.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Special Notes
              </label>
              <textarea
                value={member.notes}
                onChange={(e) => updateMember(member.id, 'notes', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Any special requirements or preferences..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Button */}
      <div className="text-center">
        <button
          onClick={addMember}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Member
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="bg-white text-gray-600 px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            onClick={onSkip}
            className="bg-white text-gray-600 px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300"
          >
            Skip for Now
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
    </div>
  );
}