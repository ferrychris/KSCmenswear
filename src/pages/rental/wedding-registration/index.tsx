import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  package: 'rental' | 'purchase' | '';
  weddingDate: string;
  brideName: string;
  groomName: string;
  email: string;
  phone: string;
  weddingLocation: string;
  partySize: string;
  notes: string;
}

export default function WeddingRegistration() {
  const [formData, setFormData] = useState<FormData>({
    package: '',
    weddingDate: '',
    brideName: '',
    groomName: '',
    email: '',
    phone: '',
    weddingLocation: '',
    partySize: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    alert('Registration submitted successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link 
          to="/rental"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Rentals
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-12">Wedding Registration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Package Selection */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Your Package</h2>
                <div className="space-y-4">
                  <label className="block p-4 border-2 rounded-lg hover:border-indigo-200 cursor-pointer">
                    <input
                      type="radio"
                      name="package"
                      value="rental"
                      checked={formData.package === 'rental'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="font-medium">Rental Package ($199.99)</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Perfect for One-Time Events • Professional Fitting • All Accessories Included • 48-Hour Rental Period
                    </p>
                  </label>

                  <label className="block p-4 border-2 rounded-lg hover:border-indigo-200 cursor-pointer">
                    <input
                      type="radio"
                      name="package"
                      value="purchase"
                      checked={formData.package === 'purchase'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="font-medium">Purchase Package ($229.00)</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Free Suit for Groom with 4+ Groomsmen • Keep Your Custom-Fitted Suit • Lifetime Alterations • Premium Designer Collection
                    </p>
                  </label>
                </div>
              </div>

              {/* Wedding Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Wedding Date</label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bride's Name</label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Groom's Name</label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wedding Location</label>
                    <input
                      type="text"
                      name="weddingLocation"
                      value={formData.weddingLocation}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wedding Party Size</label>
                    <select
                      name="partySize"
                      value={formData.partySize}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select size</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(size => (
                        <option key={size} value={size}>{size} people</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Tell us about any special requirements or preferences..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800"
              >
                Submit Registration
              </button>
            </form>
          </div>

          {/* Package Details Column */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <QrCode className="h-32 w-32 mx-auto mb-4" />
              <p className="text-gray-600">Scan to access this registration page</p>
            </div>

            {/* Rental Package */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Rental Package</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">$199.99 per person</div>
              <p className="text-gray-600 italic mb-4">Perfect for One-Time Events</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                  Premium Suit or Tuxedo Rental
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                  Professional Fitting Service
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                  Complimentary Alterations
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                  All Accessories Included
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                  48-Hour Rental Period
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                  Free Garment Bag
                </li>
              </ul>
            </div>

            {/* Purchase Package */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Purchase Package</h3>
              <div className="text-2xl font-bold text-blue-600 mb-2">$229.00 per person</div>
              <p className="text-gray-600 italic mb-4">Free Suit for Groom with 4+ Groomsmen</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                  Keep Your Custom-Fitted Suit
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                  Premium Designer Collection
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                  Lifetime Alterations
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                  VIP Fitting Experience
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                  Premium Garment Bag
                </li>
                <li className="flex items-center">
                  <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                  Exclusive Member Benefits
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}