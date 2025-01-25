import { Check, Calendar, MapPin, Users, Clock, ChevronLeft } from 'lucide-react';

interface ConfirmationStepProps {
  formData: {
    initialInfo: {
      style: string;
      partySize: number | string;
      eventDate: string;
      role: string;
    };
    contactInfo: {
      groomInfo: {
        name: string;
        email: string;
        phone: string;
      };
      brideInfo: {
        name: string;
        email: string;
        phone: string;
      };
    };
    stylePreferences: {
      colors: string[];
      attireType: string;
      accessories: string[];
      customRequests?: string;
    };
    partyMembers: Array<{
      name: string;
      role: string;
      measurements: {
        chest: string;
        waist: string;
        inseam: string;
        neck: string;
        sleeve: string;
      };
      notes?: string;
    }>;
    appointments: {
      location: string;
      date: string;
      time: string;
      appointmentType: string;
      partySize: string;
      notes?: string;
    };
  };
  onBack: () => void;
}

const locations = {
  downtown: 'Downtown Store',
  mall: 'Crossroads Mall Store',
};

const appointmentTypes = {
  initial: 'Initial Consultation & Measurements',
  followup: 'Follow-up Fitting',
  final: 'Final Fitting',
};

export function ConfirmationStep({ formData, onBack }: ConfirmationStepProps) {
  const handleSubmit = async () => {
    // Here you would typically submit the form data to your backend
    console.log('Submitting form data:', formData);
    
    // For now, just show a success message
    alert('Appointment scheduled successfully! We will send you a confirmation email shortly.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Review Your Information</h1>
        <p className="mt-4 text-gray-600">
          Please review all the details before confirming your appointment
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Style</label>
              <p className="mt-1 text-gray-900">{formData.initialInfo.style}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Date</label>
              <p className="mt-1 text-gray-900">{formatDate(formData.initialInfo.eventDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-gray-900">{formData.initialInfo.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Party Size</label>
              <p className="mt-1 text-gray-900">{formData.initialInfo.partySize} people</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Groom</h3>
              <div className="space-y-3">
                <p className="text-gray-600">Name: <span className="text-gray-900">{formData.contactInfo.groomInfo.name}</span></p>
                <p className="text-gray-600">Email: <span className="text-gray-900">{formData.contactInfo.groomInfo.email}</span></p>
                <p className="text-gray-600">Phone: <span className="text-gray-900">{formData.contactInfo.groomInfo.phone}</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Bride</h3>
              <div className="space-y-3">
                <p className="text-gray-600">Name: <span className="text-gray-900">{formData.contactInfo.brideInfo.name}</span></p>
                <p className="text-gray-600">Email: <span className="text-gray-900">{formData.contactInfo.brideInfo.email}</span></p>
                <p className="text-gray-600">Phone: <span className="text-gray-900">{formData.contactInfo.brideInfo.phone}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style Preferences */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Style Preferences</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Colors</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {formData.stylePreferences.colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attire Type</label>
            <p className="mt-1 text-gray-900">{formData.stylePreferences.attireType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accessories</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {formData.stylePreferences.accessories.map((accessory) => (
                <span
                  key={accessory}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {accessory}
                </span>
              ))}
            </div>
          </div>
          {formData.stylePreferences.customRequests && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Requests</label>
              <p className="mt-1 text-gray-900">{formData.stylePreferences.customRequests}</p>
            </div>
          )}
        </div>
      </div>

      {/* Party Members */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Party Members</h2>
        </div>
        <div className="px-6 py-4">
          <div className="divide-y divide-gray-200">
            {formData.partyMembers.map((member, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-medium text-gray-900 mb-2">
                  {member.name} - {member.role}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                  {Object.entries(member.measurements).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 capitalize">{key}</label>
                      <span className="text-sm text-gray-900">{value}"</span>
                    </div>
                  ))}
                </div>
                {member.notes && (
                  <p className="mt-2 text-sm text-gray-600">{member.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{locations[formData.appointments.location as keyof typeof locations]}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{formatDate(formData.appointments.date)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{formData.appointments.time}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
                  <p className="text-gray-900">
                    {appointmentTypes[formData.appointments.appointmentType as keyof typeof appointmentTypes]}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {formData.appointments.notes && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <p className="mt-1 text-gray-900">{formData.appointments.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center bg-white text-gray-600 px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}