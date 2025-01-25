import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, Users, Clock, Shield, Calendar, Sparkles, Sun, Leaf, Snowflake } from 'lucide-react';
import { BookAppointmentModal } from '@/components/wedding/BookAppointmentModal';
import { ProductSlider } from '@/components/wedding/ProductSlider';

const services = [
  {
    title: 'Expert Fitting',
    description: 'Professional tailoring for the perfect fit on your big day.',
    icon: Ruler,
    link: '/alterations',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Group Coordination',
    description: 'Coordinated styling for the entire wedding party.',
    icon: Users,
    link: '/wedding/sign-up',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Rental Services',
    description: 'Premium rental options for your special day.',
    icon: Clock,
    link: '/rental',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Style Guide',
    description: 'Find your perfect wedding day look.',
    icon: Shield,
    link: '/collections/wedding',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
];

const seasonalStyles = [
  {
    season: 'Spring',
    icon: Sparkles,
    title: 'Spring Wedding Attire',
    description: 'Spring is a beautiful and cheerful time of year for a wedding. For a spring wedding, a classic tuxedo or suit in a lighter color such as beige, light grey, or tan would be a good choice. These colors are fresh and spring-like, and will look elegant against the backdrop of blooming flowers and green foliage. Colors such as light blue, pink, and mint green, as well as linen suits that add a touch of laid-back style to the occasion.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
  },
  {
    season: 'Summer',
    icon: Sun,
    title: 'Summertime Menswear Attire',
    description: 'Stylish and fashionable lighter colors such as beige, light grey, and tan that are perfect for keeping the groom and his groomsmen cool and comfortable in the summer heat. For a more casual summer wedding, a linen suit in a light color such as pastel blue or pink would be a stylish and appropriate choice. Khaki or navy suits are also good options for a summer wedding.',
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80',
  },
  {
    season: 'Fall',
    icon: Leaf,
    title: 'Formal Fall Weddings',
    description: 'Darker colors such as black, navy, and charcoal grey that are perfect for creating a sophisticated and elegant look. Choose colors and patterns that reflect the autumn season, such as deep reds, oranges, burgundy, forest green, and yellows. These colors are timeless and sophisticated, and will look elegant against the backdrop of fall foliage.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80',
  },
  {
    season: 'Winter',
    icon: Snowflake,
    title: 'Winter Wonderland Weddings',
    description: 'Winter is a romantic and festive time of year for a wedding, and there are many stylish options for grooms and groomsmen to consider when choosing their attire. A classic tuxedo or suit in a darker color such as black, navy, or charcoal grey would be a good choice. These colors are timeless and sophisticated, and will look elegant against the backdrop of winter scenery.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
  },
];

export default function WeddingServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"
            alt="Wedding Services"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Wedding Services
              </h1>
              <p className="mt-6 text-xl text-gray-100">
                Over 40 years of experience helping couples create their perfect wedding look.
              </p>
              <div className="mt-10 flex gap-x-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
                >
                  Book Appointment
                </button>
                <Link
                  to="/wedding/sign-up"
                  className="rounded-md bg-black/20 px-6 py-3 text-lg font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-black/30"
                >
                  Register Wedding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Slider Section */}
      <ProductSlider />

      {/* Seasonal Wedding Styles */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Wedding Attire by Season
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find the perfect style for your wedding season
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {seasonalStyles.map((style, index) => (
              <div
                key={style.season}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <style.icon className="h-8 w-8 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-900">{style.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600">{style.description}</p>
                </div>
                <div className="flex-1">
                  <img
                    src={style.image}
                    alt={style.title}
                    className="rounded-2xl shadow-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wedding Party Services */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Wedding Party Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive services to ensure your entire wedding party looks perfect
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className={`relative overflow-hidden rounded-xl p-6 ${service.bgColor}`}
              >
                <div className={`inline-flex rounded-lg p-3 ${service.bgColor}`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Start Planning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Let our expert stylists help you create the perfect wedding look
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
              >
                Book Appointment
              </button>
              <Link
                to="/wedding/sign-up"
                className="text-sm font-semibold leading-6 text-white"
              >
                Register Wedding <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}