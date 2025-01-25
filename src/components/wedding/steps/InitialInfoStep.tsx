import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface InitialInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const styles = [
  'BLACK SUIT',
  'NAVY',
  'LIGHT GREY',
  'DARK GREY',
  'TAN',
  'HUNTER GREEN',
  'MIDNIGHT BLUE',
  'BURGUNDY',
  'MEDIUM GREY'
];

const partyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, '9+'];

const roles = [
  { id: 'bride', label: 'BRIDE', icon: '👰' },
  { id: 'groom', label: 'GROOM', icon: '🤵' },
  { id: 'groomsman', label: 'GROOMSMAN', icon: '👥' },
  { id: 'guest', label: 'GUEST', icon: '👥' }
];

export function InitialInfoStep({ data, onUpdate, onNext }: InitialInfoStepProps) {
  const [selectedStyle, setSelectedStyle] = useState(data.style || '');
  const [partySize, setPartySize] = useState<number | string>(data.partySize || '');
  const [eventDate, setEventDate] = useState(data.eventDate || '');
  const [role, setRole] = useState(data.role || '');

  const handleNext = () => {
    onUpdate({
      style: selectedStyle,
      partySize,
      eventDate,
      role
    });
    onNext();
  };

  const isValid = selectedStyle && partySize && eventDate && role;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">FIRST THINGS FIRST</h1>
      </div>

      {/* Style Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">What type of style are you looking for?</h2>
        <div className="grid grid-cols-3 gap-4">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`p-4 border-2 rounded-lg ${
                selectedStyle === style 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Party Size Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">How many people do you think will need suits?</h2>
        <div className="grid grid-cols-3 gap-4">
          {partyNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setPartySize(number)}
              className={`p-4 border-2 rounded-lg ${
                partySize === number 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Event Date Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">When is the Event?</h2>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full pl-10 p-4 border-2 rounded-lg focus:border-indigo-600 focus:ring-indigo-600"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">What is your role in the wedding?</h2>
        <div className="grid grid-cols-2 gap-4">
          {roles.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setRole(id)}
              className={`p-4 border-2 rounded-lg flex items-center justify-between ${
                role === id 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <span>{label}</span>
              <span className="text-2xl">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="text-center">
        <button
          onClick={handleNext}
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-400"
          disabled={!isValid}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}