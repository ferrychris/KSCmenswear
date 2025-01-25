import { Ruler, Clock, Shield, CheckCircle } from 'lucide-react';
import { HLSVideo } from '@/components/video/HLSVideo';

const alterationServices = [
  {
    title: 'Prom Alterations',
    description: 'Expert alterations for prom dresses, suits, and tuxedos to ensure you look perfect for your special night',
    price: 'Starting at $20',
    turnaround: '3-5 business days',
    icon: Ruler,
  },
  {
    title: 'Wedding Alterations',
    description: 'Comprehensive alterations for wedding parties, including bridal gowns, suits, and bridesmaid dresses',
    price: 'Starting at $75',
    turnaround: '7-10 business days',
    icon: Shield,
  },
  {
    title: 'Express Service',
    description: 'Rush alterations for time-sensitive needs',
    price: 'Additional $25',
    turnaround: '24-48 hours',
    icon: Clock,
  },
];

const guarantees = [
  {
    title: 'Perfect Fit Guarantee',
    description: "Not satisfied with the fit? We'll adjust it until it's perfect at no additional cost.",
    icon: Shield,
  },
  {
    title: 'Expert Craftsmanship',
    description: 'Our master tailors have decades of experience in fine menswear alterations.',
    icon: CheckCircle,
  },
];

const alterationPrices = [
  {
    title: 'TAKE IN WAIST',
    description: 'Narrow in the waist or Expand waist',
    price: '$12',
  },
  {
    title: 'SLEVEES',
    description: 'Shorten or lengthens sleeves on jacket',
    price: '$32',
  },
  {
    title: 'JACKET TAKE IN SIDES',
    description: 'Slim down your suit jacket by making them more narrow to the body',
    price: '$28',
  },
  {
    title: 'HEM + TAPPER PANTS',
    description: 'Shorten pants and make them skinner',
    price: '$24',
  },
  {
    title: 'CUFF PANTS',
    description: 'Shortne pants with cuff in them.',
    price: '$14',
  },
  {
    title: 'DRESS SHIRT TAKE IN',
    description: 'Slim down your dress shirt by making them more narrow to the body',
    price: '$18',
  },
  {
    title: 'WAIST SEAT CROTCH',
    description: 'Reshaping waist seat and the crotch after narrowing waist',
    price: '$24',
  },
  {
    title: 'ZIPPER REPLACEMENT',
    description: 'Replace zipper on pants',
    price: '$20',
  },
  {
    title: 'FULL ZIPPER REPLACEMENT',
    description: 'Replace full zipper on jacket',
    price: '$48',
  },
  {
    title: 'REGULAR HEM',
    description: 'Shorten Pants',
    price: '$12',
  },
];

export default function Alterations() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <HLSVideo
            src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/50c02a23446907e66cb2180f2f809e1d/manifest/video.m3u8"
            className="h-full w-full object-cover"
            autoPlay={true}
            muted={true}
            controls={false}
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Expert Alterations & Tailoring
              </h1>
              <p className="mt-6 text-xl text-gray-100">
                Professional alterations to ensure your garments fit perfectly. Every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Alteration Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From basic hemming to complete suit restructuring, our expert tailors ensure a perfect fit.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {alterationServices.map((service) => (
            <div
              key={service.title}
              className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
              <p className="mt-4 text-gray-500">{service.description}</p>
              <div className="mt-6 space-y-2">
                <p className="text-lg font-medium text-indigo-600">{service.price}</p>
                <p className="text-sm text-gray-500">Turnaround: {service.turnaround}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alteration Prices Grid */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Alteration Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alterationPrices.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <p className="text-xl font-bold text-indigo-600">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guarantees Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.title}
              className="flex gap-6 items-start rounded-xl border border-gray-200 p-6"
            >
              <div className="flex-shrink-0">
                <guarantee.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{guarantee.title}</h3>
                <p className="mt-2 text-gray-600">{guarantee.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="mt-24 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 text-center">
                Contact Us For More Details
              </h3>
              <form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Message"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    SEND
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900">Ready to Get Started?</h3>
          <p className="mt-4 text-gray-600">
            Visit our store or contact us to schedule your alteration consultation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Schedule Consultation
            </a>
            <a
              href="/locations"
              className="rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Find Store Location
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}