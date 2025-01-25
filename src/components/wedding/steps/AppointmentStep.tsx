import { useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppointmentStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const locations = [
  {
    id: 'downtown',
    name: 'Downtown Store',
    address: '213 S Kalamazoo Mall, Kalamazoo, MI 49007',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    id: 'mall',
    name: 'Crossroads Mall Store',
    address: '6650 S Westnedge Ave, Portage, MI 49024',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
];

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

const appointmentTypes = [
  {
    id: 'initial',
    name: 'Initial Consultation & Measurements',
    duration: '1 hour',
    description: 'First fitting and style consultation for the wedding party',
  },
  {
    id: 'followup',
    name: 'Follow-up Fitting',
    duration: '30 minutes',
    description: 'Secondary fitting to ensure perfect alterations',
  },
  {
    id: 'final',
    name: 'Final Fitting',
    duration: '45 minutes',
    description: 'Final adjustments and garment pickup',
  },
];

export function AppointmentStep({ data, onUpdate, onNext, onBack }: AppointmentStepProps) {
  const [location, setLocation] = useState(data.location || '');
  const [date, setDate] = useState(data.date || '');
  const [time, setTime] = useState(data.time || '');
  const [appointmentType, setAppointmentType] = useState(data.appointmentType || '');
  const [partySize, setPartySize] = useState(data.partySize || '');
  const [notes, setNotes] = useState(data.notes || '');

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleNext = () => {
    onUpdate({
      location,
      date,
      time,
      appointmentType,
      partySize,
      notes,
    });
    onNext();
  };

  const isValid = location && date && time && appointmentType && partySize;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Schedule Your Appointment</h1>
        <p className="mt-4 text-gray-600">
          Let's find a time for your fitting appointment
        </p>
      </div>

      {/* Location Selection */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Select Location</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setLocation(loc.id)}
              className={cn(
                'p-6 border-2 rounded-lg text-left transition-colors',
                location === loc.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              )}
            >
              <h3 className="font-semibold text-lg">{loc.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{loc.address}</p>
              <p className="text-sm text-gray-500 mt-2">
                Available: {loc.availableDays.join(', ')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Type */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Appointment Type</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {appointmentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setAppointmentType(type.id)}
              className={cn(
                'p-6 border-2 rounded-lg text-left transition-colors',
                appointmentType === type.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              )}
            >
              <h3 className="font-semibold">{type.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              <p className="text-sm font-medium text-indigo-600 mt-2">
                Duration: {type.duration}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Select Date</h2>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            max={maxDateStr}
            className="w-full p-3 border-2 rounded-lg focus:border-indigo-600 focus:ring-indigo-600"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Select Time</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={cn(
                  'p-2 border-2 rounded-lg text-sm transition-colors',
                  time === slot
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Party Size */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Number of People Attending</h2>
        </div>
        <select
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          className="w-full p-3 border-2 rounded-lg focus:border-indigo-600 focus:ring-indigo-600"
        >
          <option value="">Select party size</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((size) => (
            <option key={size} value={size}>{size} people</option>
          ))}
        </select>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Notes or Special Requirements
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Any special requirements or preferences for your appointment..."
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