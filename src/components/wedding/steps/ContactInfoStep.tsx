import { useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';

interface ContactInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export function ContactInfoStep({ data, onUpdate, onNext, onBack }: ContactInfoStepProps) {
  const [groomInfo, setGroomInfo] = useState<ContactInfo>(data.groomInfo || {
    name: '',
    email: '',
    phone: '',
  });

  const [brideInfo, setBrideInfo] = useState<ContactInfo>(data.brideInfo || {
    name: '',
    email: '',
    phone: '',
  });

  const handleNext = () => {
    onUpdate({
      groomInfo,
      brideInfo,
    });
    onNext();
  };

  const isValid = 
    groomInfo.name && groomInfo.email && groomInfo.phone &&
    brideInfo.name && brideInfo.email && brideInfo.phone;

  const ContactForm = ({ 
    title, 
    info, 
    setInfo 
  }: { 
    title: string; 
    info: ContactInfo; 
    setInfo: (info: ContactInfo) => void;
  }) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      
      {/* Name Input */}
      <div>
        <label htmlFor={`${title.toLowerCase()}-name`} className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id={`${title.toLowerCase()}-name`}
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="John Doe"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor={`${title.toLowerCase()}-email`} className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id={`${title.toLowerCase()}-email`}
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor={`${title.toLowerCase()}-phone`} className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id={`${title.toLowerCase()}-phone`}
            value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="(123) 456-7890"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Contact Information</h1>
        <p className="mt-4 text-gray-600">
          Please provide contact information for both the bride and groom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactForm 
          title="Groom" 
          info={groomInfo} 
          setInfo={setGroomInfo} 
        />
        <ContactForm 
          title="Bride" 
          info={brideInfo} 
          setInfo={setBrideInfo} 
        />
      </div>

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