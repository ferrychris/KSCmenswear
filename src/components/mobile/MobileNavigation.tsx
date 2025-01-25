import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export function MobileNavigation() {
  const location = useLocation();
  const toggleSearch = useUIStore((state) => state.toggleSearch);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', action: toggleSearch },
    { icon: Heart, label: 'Favorites', path: '/profile/favorites' },
    { icon: User, label: 'Profile', path: '/profile/measurements' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-charcoal-200 z-40 md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = item.path ? location.pathname === item.path : false;
          
          const content = (
            <div className={cn(
              "flex flex-col items-center justify-center space-y-1",
              isActive ? "text-indigo-600" : "text-gray-600"
            )}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          );

          return item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className="active:bg-gray-100"
              aria-current={isActive ? 'page' : undefined}
            >
              {content}
            </Link>
          ) : (
            <button
              key={item.label}
              onClick={item.action}
              className="active:bg-gray-100"
              aria-label={item.label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}