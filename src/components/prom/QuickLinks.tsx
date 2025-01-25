import { cn } from '@/lib/utils';

const links = [
  {
    title: 'Red',
    description: 'Bold and striking styles',
    href: '/collections/2025-ultimate-red-collection-for-men-red-suits-shoes-accessories-kct-menswear',
    color: 'bg-red-50 text-red-700',
    iconColor: 'text-red-600',
    bgGradient: 'from-red-50 to-red-100',
  },
  {
    title: 'Blue',
    description: 'Classic and sophisticated',
    href: '/collections/prom?color=blue',
    color: 'bg-blue-50 text-blue-700',
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
  },
  {
    title: 'Colorful',
    description: 'Vibrant and unique designs',
    href: '/collections/prom?color=multi',
    color: 'bg-purple-50 text-purple-700',
    iconColor: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
  },
  {
    title: 'Black',
    description: 'Timeless elegance',
    href: '/collections/prom?color=black',
    color: 'bg-gray-900 text-white',
    iconColor: 'text-white',
    bgGradient: 'from-gray-800 to-gray-900',
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
              link.color,
              `bg-gradient-to-br ${link.bgGradient}`
            )}
          >
            <div className="relative z-10">
              <h3 className={cn('font-semibold', link.color === 'bg-gray-900 text-white' ? 'text-white' : '')}>{link.title}</h3>
              <p className={cn('mt-1 text-sm opacity-90', link.color === 'bg-gray-900 text-white' ? 'text-gray-300' : '')}>{link.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}