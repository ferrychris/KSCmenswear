import { Flower2, Sparkles, Sun, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  {
    title: 'Rustic',
    description: 'Timeless charm and natural elegance',
    icon: Flower2,
    href: '/collections/rustic-wedding',
    color: 'bg-amber-50 text-amber-700',
    iconColor: 'text-amber-600',
  },
  {
    title: 'Modern',
    description: 'Contemporary style for the bold couple',
    icon: Sparkles,
    href: '/collections/modern-wedding',
    color: 'bg-indigo-50 text-indigo-700',
    iconColor: 'text-indigo-600',
  },
  {
    title: 'Summer',
    description: 'Light and breezy for warm celebrations',
    icon: Sun,
    href: '/collections/summer-wedding',
    color: 'bg-blue-50 text-blue-700',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Fall',
    description: 'Rich colors for autumn ceremonies',
    icon: Cloud,
    href: '/collections/fall-wedding',
    color: 'bg-orange-50 text-orange-700',
    iconColor: 'text-orange-600',
  },
];

export function QuickLinks() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className={cn(
              'group relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl',
              link.color
            )}
          >
            <div className="relative z-10">
              <link.icon className={cn('h-8 w-8 mb-4', link.iconColor)} />
              <h3 className="font-semibold">{link.title}</h3>
              <p className="mt-1 text-sm opacity-90">{link.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}