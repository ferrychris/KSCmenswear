import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useUIStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, Crown, Shirt, Bot as Bow } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

const popularCategories = [
  {
    name: 'Prom',
    subcategories: [
      { name: 'Sparkle Blazers', href: '/collections/sparkle-blazers', icon: Sparkles },
      { name: 'Prom Tuxedos', href: '/collections/prom-tuxedos', icon: Crown },
      { name: 'Prom Shirts', href: '/collections/prom-shirts', icon: Shirt },
      { name: 'Prom Bowties', href: '/collections/prom-bowties', icon: Bow },
    ],
  },
  {
    name: 'Wedding',
    subcategories: [
      { name: 'Wedding Tuxedos', href: '/collections/wedding-tuxedos', icon: Crown },
      { name: 'Wedding Suits', href: '/collections/wedding-suits', icon: Shirt },
      { name: 'Groomsmen Suits', href: '/collections/groomsmen-suits', icon: Shirt },
      { name: 'Wedding Ties', href: '/collections/wedding-ties', icon: Bow },
    ],
  },
];

export function SearchOverlay() {
  const isOpen = useUIStore((state) => state.isSearchOpen);
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const navigate = useNavigate();
  const { results, suggestions, loading, search, getSuggestions } = useSearch();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      toggleSearch();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleSearch}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-charcoal-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-charcoal-900/5 transition-all">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-charcoal-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-11 text-charcoal-900 placeholder:text-charcoal-400 focus:ring-0 sm:text-sm"
                  placeholder="Search our collection..."
                  onChange={(e) => {
                    const query = e.target.value;
                    if (query.length >= 2) {
                      getSuggestions(query);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.currentTarget.value);
                    }
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full p-1 text-charcoal-400 hover:text-charcoal-500"
                  onClick={toggleSearch}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {suggestions.length > 0 ? (
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="px-4">
                    <h3 className="text-sm font-medium text-charcoal-500">Suggestions</h3>
                    <ul className="mt-2 -mx-4 divide-y divide-charcoal-100">
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-charcoal-700 hover:bg-charcoal-50"
                            onClick={() => handleSearch(suggestion)}
                          >
                            <Search className="h-4 w-4 text-charcoal-400" />
                            <span>{suggestion}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <h3 className="text-sm font-medium text-charcoal-500 mb-4">Popular Categories</h3>
                  <div className="space-y-6">
                    {popularCategories.map((category) => (
                      <div key={category.name}>
                        <h4 className="text-sm font-serif font-medium text-charcoal-900 mb-3">{category.name}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {category.subcategories.map((subcategory) => (
                            <a
                              key={subcategory.name}
                              href={subcategory.href}
                              onClick={() => toggleSearch()}
                              className="flex items-center gap-2 p-3 text-sm text-charcoal-700 rounded-lg hover:bg-charcoal-50 transition-colors"
                            >
                              <subcategory.icon className="h-5 w-5 text-charcoal-400" />
                              <span>{subcategory.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto"></div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}