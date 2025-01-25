import { MapPin, Calendar, Users, Ruler, ArrowRight, Star, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RentalPageSEO } from '@/components/seo/RentalPageSEO';

const locations = [
  {
    name: 'Downtown Kalamazoo Store',
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

const services = [
  {
    icon: Ruler,
    title: 'Expert Fitting Service',
    description: 'Professional measurements and alterations included with every rental'
  },
  {
    icon: Calendar,
    title: 'Flexible Rental Periods',
    description: 'Extended rental periods available for out-of-town events'
  },
  {
    icon: Users,
    title: 'Group Coordination',
    description: 'Specialized service for wedding parties and prom groups'
  }
];

const servingCities = [
  'Battle Creek', 'Mattawan', 'Paw Paw', 'Plainwell',
  'Richland', 'Schoolcraft', 'Three Rivers', 'Vicksburg'
];

export default function RentalHome() {
  return (
    <div className="bg-white">
      <RentalPageSEO />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80"
            alt="Formal wear rentals in Kalamazoo and Portage, Michigan"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Premium Formal Wear Rentals in Southwest Michigan
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Over 40 years of experience serving Kalamazoo, Portage, and surrounding areas with 
                premium tuxedo and suit rentals for weddings, proms, and special occasions.
              </p>
              <div className="mt-10 flex gap-x-6">
                <Link
                  to="/rental/wedding-registration"
                  className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Wedding Registration
                </Link>
                <a
                  href="#locations"
                  className="rounded-md bg-black/20 px-6 py-3 text-lg font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-black/30"
                >
                  Find a Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose KCT Menswear
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience the difference of working with Southwest Michigan's premier formal wear specialists
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <service.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    {service.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{service.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div id="locations" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Locations
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Visit one of our convenient locations in Kalamazoo or Portage
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
            {locations.map((location) => (
              <div
                key={location.name}
                className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-x-4">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-x-4">
                      <div className="flex-auto">
                        <p className="text-sm leading-6 text-gray-600">{location.address}</p>
                        <p className="text-sm leading-6 text-gray-600">{location.city}</p>
                      </div>
                      <a
                        href={`tel:${location.phone}`}
                        className="flex items-center gap-x-2 text-indigo-600 hover:text-indigo-500"
                      >
                        <Phone className="h-5 w-5" />
                        <span className="text-sm">{location.phone}</span>
                      </a>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-900">Store Hours</h4>
                      <dl className="mt-2 space-y-1">
                        {Object.entries(location.hours).map(([days, hours]) => (
                          <div key={days} className="flex justify-between gap-x-4 text-sm leading-6">
                            <dt className="text-gray-600">{days}</dt>
                            <dd className="text-gray-900">{hours}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Area Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Serving Southwest Michigan
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our central locations in Kalamazoo and Portage make us easily accessible to customers 
              throughout Southwest Michigan
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base leading-7 text-gray-600 sm:grid-cols-4">
              {servingCities.map((city) => (
                <div key={city} className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-indigo-600 mr-2" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Look Your Best?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Schedule your fitting appointment today and experience the KCT Menswear difference
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/rental/wedding-registration"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Register Now
              </Link>
              <a
                href="tel:+12693421234"
                className="text-lg font-semibold leading-6 text-white"
              >
                Call Us <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}