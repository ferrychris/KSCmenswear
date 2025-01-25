import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const locations = [
  {
    id: 'downtown',
    name: 'Downtown Store',
    address: '213 S Kalamazoo Mall, Kalamazoo, MI 49007',
  },
  {
    id: 'mall',
    name: 'Crossroads Mall Store',
    address: '6650 S Westnedge Ave, Portage, MI 49024',
  },
];

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM',
];

export function BookAppointmentModal({ isOpen, onClose }: BookAppointmentModalProps) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ location, date, time, name, email, phone, notes });
    onClose();
  };

  const isValid = location && date && time && name && email && phone;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                      Book an Appointment
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Schedule a consultation with our wedding experts
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      {/* Location Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Select Location
                        </label>
                        <div className="mt-2 grid grid-cols-1 gap-4">
                          {locations.map((loc) => (
                            <button
                              key={loc.id}
                              type="button"
                              onClick={() => setLocation(loc.id)}
                              className={cn(
                                'flex items-start p-4 border-2 rounded-lg text-left',
                                location === loc.id
                                  ? 'border-indigo-600 bg-indigo-50'
                                  : 'border-gray-200 hover:border-indigo-200'
                              )}
                            >
                              <MapPin className="h-5 w-5 text-indigo-600 mt-0.5" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-gray-900">{loc.name}</h4>
                                <p className="text-sm text-gray-500">{loc.address}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date and Time Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Select Date
                          </label>
                          <div className="mt-2 relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              min={minDate}
                              max={maxDateStr}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Select Time
                          </label>
                          <div className="mt-2 relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            <select
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select a time</option>
                              {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="email"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="tel"
                          />
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Additional Notes
                        </label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Any special requirements or preferences..."
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={!isValid}
                          className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:ml-3 sm:w-auto disabled:bg-gray-400"
                        >
                          Book Appointment
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}