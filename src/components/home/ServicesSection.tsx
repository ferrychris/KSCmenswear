import { Ruler, Clock, Users, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Expert Tailoring',
    description: 'Professional alterations and custom garments crafted by master tailors with decades of experience.',
    icon: Ruler,
    link: '/alterations',
    color: 'text-burgundy-600',
    bgColor: 'bg-gradient-to-br from-burgundy-50 to-burgundy-100',
    borderColor: 'border-burgundy-200',
    shadowColor: 'shadow-burgundy-100/50',
    iconBg: 'bg-burgundy-100',
  },
  {
    title: 'Wedding Services',
    description: 'Comprehensive wedding party coordination, from style consultation to final fittings.',
    icon: Users,
    link: '/wedding',
    color: 'text-navy-600',
    bgColor: 'bg-gradient-to-br from-navy-50 to-navy-100',
    borderColor: 'border-navy-200',
    shadowColor: 'shadow-navy-100/50',
    iconBg: 'bg-navy-100',
  },
  {
    title: 'Express Service',
    description: 'Quick turnaround when you need it most, with same-day alterations available.',
    icon: Clock,
    link: '/alterations#express',
    color: 'text-charcoal-600',
    bgColor: 'bg-gradient-to-br from-charcoal-50 to-charcoal-100',
    borderColor: 'border-charcoal-200',
    shadowColor: 'shadow-charcoal-100/50',
    iconBg: 'bg-charcoal-100',
  },
  {
    title: 'Perfect Fit Guarantee',
    description: 'Not satisfied with the fit? We\'ll alter it until it\'s perfect, guaranteed.',
    icon: Shield,
    link: '/alterations#guarantee',
    color: 'text-gold-600',
    bgColor: 'bg-gradient-to-br from-gold-50 to-gold-100',
    borderColor: 'border-gold-200',
    shadowColor: 'shadow-gold-100/50',
    iconBg: 'bg-gold-100',
  },
];

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            Premium Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Over 40 years of experience delivering exceptional menswear services
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.link}
              className={`group relative overflow-hidden rounded-2xl border ${service.borderColor} ${service.bgColor} p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${service.shadowColor}`}
            >
              <div className="relative rounded-xl p-6">
                {/* Decorative corner accent */}
                <div className="absolute -top-6 -right-6 h-12 w-12 transform rotate-45 bg-gradient-to-br from-white/40 to-transparent" />
                
                <div className={`relative inline-flex rounded-xl p-3 ${service.iconBg}`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                
                <h3 className={`mt-4 text-xl font-semibold ${service.color}`}>
                  {service.title}
                </h3>
                
                <p className="mt-2 text-sm text-gray-600">
                  {service.description}
                </p>
                
                <div className={`mt-4 inline-flex items-center text-sm font-medium ${service.color} transition-colors`}>
                  Learn more
                  <ArrowRight 
                    className={`ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1`} 
                  />
                </div>

                {/* Decorative bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-20" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
          >
            Schedule a Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}