import { MapPin, Calendar, Users, Ruler, ArrowRight, Star, Phone, Mail, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';
import { LocationsPageSEO } from '@/components/seo/LocationsPageSEO';

const locations = [
  {
    name: 'Downtown Store',
    address: '213 S Kalamazoo Mall',
    city: 'Kalamazoo, MI 49007',
    phone: '(269) 342-1234',
    hours: {
      'Monday - Friday': '10am - 6pm',
      'Saturday': '10am - 4pm',
      'Sunday': 'Closed'
    }
  },
  {
    name: 'Portage Store - Crossroads Mall',
    address: '6650 S Westnedge Ave',
    city: 'Portage, MI 49024',
    phone: '(269) 323-8070',
    hours: {
      'Monday - Saturday': '10am - 9pm',
      'Sunday': '12pm - 6pm'
    }
  }
];

const servingCities = [
  'Battle Creek', 'Mattawan', 'Paw Paw', 'Plainwell',
  'Richland', 'Schoolcraft', 'Three Rivers', 'Vicksburg'
];

export default function RentalHome() {
  return (
    <div className="bg-white">
      <LocationsPageSEO locations={locations} />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <AutoplayHLSVideo
            src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/b7cc2bb414f3883f38f5cb1865f1daa6/manifest/video.m3u8"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Our Locations
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Visit us in person for expert service and personalized fittings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          {locations.map((location) => (
            <div
              key={location.name}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-8 bg-indigo-50">
                <h2 className="text-2xl font-bold text-gray-900">{location.name}</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-gray-700">{location.address}</p>
                      <p className="text-gray-700">{location.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <p className="ml-3 text-gray-700">{location.phone}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  Store Hours
                </h3>
                <div className="mt-4 space-y-2">
                  {Object.entries(location.hours).map(([days, time]) => (
                    <div key={days} className="flex justify-between">
                      <span className="text-gray-600">{days}</span>
                      <span className="text-gray-900 font-medium">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Area Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Service Area</h2>
          <p className="mt-4 text-lg text-gray-600 text-center">
            Proudly serving the following communities:
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {servingCities.map((city) => (
              <div
                key={city}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-gray-900">{city}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Link */}
        <div className="mt-12 text-center">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Car className="h-5 w-5 mr-2" />
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}