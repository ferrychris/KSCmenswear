import { Ruler, Clock, Sparkles, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
  {
    title: 'Expert Fitting',
    description: 'Get the perfect fit for your big night with our professional fitting service.',
    icon: Ruler,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Rush Service',
    description: 'Last-minute alterations available to ensure you look your best.',
    icon: Clock,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Style Consultation',
    description: 'Get personalized style advice from our prom fashion experts.',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Satisfaction Guarantee',
    description: "Love your prom look or we'll make it right.",
    icon: Shield,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
];

export function ServicesSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Prom Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to look and feel amazing on your special night.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className={cn(
                'relative overflow-hidden rounded-xl p-6',
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}