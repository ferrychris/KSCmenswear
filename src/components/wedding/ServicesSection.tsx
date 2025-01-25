import { Ruler, Users, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
    title: 'Group Weddings',
    description: 'Coordinated styling for the entire wedding party.',
    icon: Users,
    link: '/wedding/sign-up',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Rental',
    description: 'Premium rental options for your special day.',
    icon: Clock,
    link: '/rental',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Style',
    description: 'Find your perfect wedding day look.',
    icon: Shield,
    link: '/collections/wedding',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white py-24">
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
            <Link
              key={service.title}
              to={service.link}
              className={cn(
                'relative overflow-hidden rounded-xl p-6 transition-all duration-300',
                'transform hover:-translate-y-1 hover:shadow-lg',
                service.bgColor
              )}
            >
              <div className={cn('inline-flex rounded-lg p-3', service.bgColor)}>
                <service.icon className={cn('h-6 w-6', service.color)} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}