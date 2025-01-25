import { Crown, Ruler, Gift, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  {
    title: 'New Arrivals',
    description: 'Latest styles added weekly',
    icon: Crown,
    href: '/collections/new-arrivals',
    color: 'text-gold-600',
    bgColor: 'bg-gradient-to-br from-gold-50 to-gold-100',
    borderColor: 'border-gold-200',
    shadowColor: 'shadow-gold-100/50',
    iconBg: 'bg-gold-100',
  },
  {
    title: 'Custom Tailoring',
    description: 'Perfect fit guaranteed',
    icon: Ruler,
    href: '/services/tailoring',
    color: 'text-burgundy-600',
    bgColor: 'bg-gradient-to-br from-burgundy-50 to-burgundy-100',
    borderColor: 'border-burgundy-200',
    shadowColor: 'shadow-burgundy-100/50',
    iconBg: 'bg-burgundy-100',
  },
  {
    title: 'Collections',
    description: 'Curated seasonal styles',
    icon: Shirt,
    href: '/collections',
    color: 'text-navy-600',
    bgColor: 'bg-gradient-to-br from-navy-50 to-navy-100',
    borderColor: 'border-navy-200',
    shadowColor: 'shadow-navy-100/50',
    iconBg: 'bg-navy-100',
  },
  {
    title: 'Gift Cards',
    description: 'The perfect present',
    icon: Gift,
    href: '/gift-cards',
    color: 'text-charcoal-600',
    bgColor: 'bg-gradient-to-br from-charcoal-50 to-charcoal-100',
    borderColor: 'border-charcoal-200',
    shadowColor: 'shadow-charcoal-100/50',
    iconBg: 'bg-charcoal-100',
  },
];

export function QuickLinks() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className={cn(
              'group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
              link.borderColor,
              link.bgColor,
              link.shadowColor
            )}
          >
            <div className="relative p-6">
              {/* Decorative corner accent */}
              <div className="absolute -top-6 -right-6 h-12 w-12 transform rotate-45 bg-gradient-to-br from-white/40 to-transparent" />
              
              <div className={cn('relative inline-flex rounded-xl p-3', link.iconBg)}>
                <link.icon className={cn('h-6 w-6', link.color)} />
              </div>
              
              <h3 className={cn('mt-4 text-xl font-semibold', link.color)}>
                {link.title}
              </h3>
              
              <p className="mt-2 text-sm text-gray-600">
                {link.description}
              </p>

              {/* Decorative bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-20" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}