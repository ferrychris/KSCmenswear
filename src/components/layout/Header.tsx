import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ShoppingBag, Menu as MenuIcon, X, ChevronDown, Search } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { config } from '@/config';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    {
      name: 'Wedding',
      href: '/wedding',
      megaMenu: {
        featured: [
          {
            name: 'Wedding Tuxedos',
            href: '/collections/wedding-tuxedos',
            imageSrc: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&q=80',
          },
          {
            name: 'Wedding Suits',
            href: '/collections/wedding-suits',
            imageSrc: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
          },
        ],
        categories: [
          {
            name: 'Collections',
            items: [
              { name: 'Wedding Tuxedos', href: '/collections/wedding-tuxedos' },
              { name: 'Wedding Suits', href: '/collections/wedding-suits' },
              { name: 'Groomsmen Suits', href: '/collections/groomsmen-suits' },
              { name: 'Wedding Ties', href: '/collections/wedding-ties' },
            ],
          },
          {
            name: 'Rental Services',
            items: [
              { name: 'Wedding Rentals', href: '/rental#wedding' },
              { name: 'Group Rentals', href: '/rental#group-rentals' },
              { name: 'Fitting Services', href: '/rental#fitting-services' },
              { name: 'Rental Guide', href: '/rental#rental-guide' },
            ],
          },
          {
            name: 'Services',
            items: [
              { name: 'Wedding Services', href: '/wedding/services' },
              { name: 'Register Wedding', href: '/wedding/sign-up' },
              { name: 'Group Fittings', href: '/wedding#group-fittings' },
              { name: 'Style Guide', href: '/wedding#style-guide' },
              { name: 'Pricing', href: '/rental#pricing' },
            ],
          },
        ],
      },
    },
    {
      name: 'Prom',
      href: '/prom',
      megaMenu: {
        featured: [
          {
            name: 'Sparkle Blazers',
            href: '/collections/sparkle-blazers',
            imageSrc: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&q=80',
          },
          {
            name: 'Prom Tuxedos',
            href: '/collections/prom-tuxedos',
            imageSrc: 'https://images.unsplash.com/photo-1594938298870-9623159c8c99?auto=format&fit=crop&q=80',
          },
        ],
        categories: [
          {
            name: 'Collections',
            items: [
              { name: 'Sparkle Blazers', href: '/collections/sparkle-blazers' },
              { name: 'Prom Tuxedos', href: '/collections/prom-tuxedos' },
              { name: 'Prom Shirts', href: '/collections/prom-shirts' },
              { name: 'Prom Shoes', href: '/collections/prom-shoes' },
              { name: 'Prom Blazers', href: '/collections/prom-blazers' },
              { name: 'Sparkling Vests', href: '/collections/sparkling-vests' },
              { name: 'Prom Bowties', href: '/collections/prom-bowties' },
              { name: 'Prom Vests', href: '/collections/prom-vests' },
            ],
          },
          {
            name: 'Services',
            items: [
              { name: 'Group Fittings', href: '/prom#group-fittings' },
              { name: 'Style Guide', href: '/prom#style-guide' },
              { name: 'Book Appointment', href: '/prom#book-appointment' },
            ],
          },
        ],
      },
    },
    {
      name: 'Suits',
      href: '/collections/suits',
      megaMenu: {
        featured: [
          {
            name: 'Double Breasted Suits',
            href: '/collections/suits/double-breasted',
            imageSrc: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
          },
          {
            name: 'Three Piece Suits',
            href: '/collections/suits/three-piece',
            imageSrc: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
          },
        ],
        categories: [
          {
            name: 'Collections',
            items: [
              { name: 'Two Piece Suits', href: '/collections/suits/two-piece' },
              { name: 'Three Piece Suits', href: '/collections/suits/three-piece' },
              { name: 'Double Breasted', href: '/collections/suits/double-breasted' },
              { name: 'Tuxedos', href: '/collections/suits/tuxedos' },
            ],
          },
          {
            name: 'Shop By Color',
            items: [
              { name: 'Navy Suits', href: '/collections/suits?color=navy' },
              { name: 'Black Suits', href: '/collections/suits?color=black' },
              { name: 'Grey Suits', href: '/collections/suits?color=grey' },
              { name: 'Blue Suits', href: '/collections/suits?color=blue' },
            ],
          },
        ],
      },
    },
    {
      name: 'Accessories',
      href: '/collections/accessories',
      megaMenu: {
        featured: [
          {
            name: 'Ties & Bowties',
            href: '/collections/accessories/ties',
            imageSrc: 'https://images.unsplash.com/photo-1624538000860-24e9d41a0741?auto=format&fit=crop&q=80',
          },
          {
            name: 'Vests',
            href: '/collections/accessories/vests',
            imageSrc: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80',
          },
        ],
        categories: [
          {
            name: 'Neckwear',
            items: [
              { name: 'Classic Ties', href: '/collections/accessories/ties' },
              { name: 'Bow Ties', href: '/collections/accessories/bowties' },
              { name: 'Skinny Ties', href: '/collections/accessories/skinny-ties' },
              { name: 'Wedding Ties', href: '/collections/wedding-ties' },
            ],
          },
          {
            name: 'Other Accessories',
            items: [
              { name: 'Vests', href: '/collections/accessories/vests' },
              { name: 'Pocket Squares', href: '/collections/accessories/pocket-squares' },
              { name: 'Cufflinks', href: '/collections/accessories/cufflinks' },
              { name: 'Suspenders', href: '/collections/accessories/suspenders' },
            ],
          },
        ],
      },
    },
    { name: 'Locations', href: '/locations' },
    { name: 'Blog', href: '/blog' },
  ],
  utility: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Alterations', href: '/alterations' },
  ],
};

export function Header() {
  const { toggleCart, toggleSearch } = useUIStore();
  const cartItems = useCartStore((state) => state.items);

  return (
    <Disclosure as="header" className="bg-white">
      {({ open }) => (
        <>
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-b border-charcoal-200">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link to="/" className="text-xl font-serif font-bold text-charcoal-900">
                    {config.siteName}
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden h-full lg:flex">
                  <div className="flex h-full space-x-8">
                    {navigation.main.map((item) => (
                      <div key={item.name} className="relative flex">
                        {item.megaMenu ? (
                          <Menu as="div" className="relative inline-block h-full">
                            <Menu.Button className="inline-flex h-full items-center text-sm font-medium text-charcoal-700 hover:text-charcoal-900">
                              {item.name}
                              <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Menu.Items className="absolute left-0 z-10 mt-px w-screen max-w-md -translate-x-1/4 px-4">
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                  <div className="relative bg-white">
                                    {/* Featured Items */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-4">
                                      {item.megaMenu.featured.map((featured) => (
                                        <div key={featured.name} className="group relative text-base sm:text-sm">
                                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-charcoal-100">
                                            <img
                                              src={featured.imageSrc}
                                              alt={featured.name}
                                              className="object-cover object-center group-hover:opacity-75"
                                            />
                                          </div>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <Link
                                                to={featured.href}
                                                className="mt-2 block font-medium text-charcoal-900"
                                              >
                                                {featured.name}
                                              </Link>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Categories */}
                                    <div className="grid grid-cols-2 divide-x divide-charcoal-200 bg-charcoal-50">
                                      {item.megaMenu.categories.map((category) => (
                                        <div key={category.name} className="p-4">
                                          <p className="font-medium text-charcoal-900">{category.name}</p>
                                          <ul className="mt-4 space-y-4">
                                            {category.items.map((item) => (
                                              <li key={item.name}>
                                                <Menu.Item>
                                                  {({ active }) => (
                                                    <Link
                                                      to={item.href}
                                                      className="text-sm text-charcoal-500 hover:text-charcoal-900"
                                                    >
                                                      {item.name}
                                                    </Link>
                                                  )}
                                                </Menu.Item>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        ) : (
                          <Link
                            to={item.href}
                            className="inline-flex items-center text-sm font-medium text-charcoal-700 hover:text-charcoal-900"
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart, Search, and Mobile Menu */}
                <div className="flex items-center space-x-4">
                  {/* Search Button */}
                  <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-charcoal-900 hover:text-charcoal-600"
                    onClick={toggleSearch}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Search</span>
                    <Search className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Cart Button */}
                  <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-charcoal-900 hover:text-charcoal-600"
                    onClick={toggleCart}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View cart</span>
                    <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-burgundy-600 text-xs text-white flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>

                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative ml-4 inline-flex items-center justify-center rounded-md p-2 text-charcoal-900 hover:bg-charcoal-100 hover:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy-500 lg:hidden">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile menu */}
          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.main.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block py-2 pl-3 pr-4 text-base font-medium text-charcoal-900 hover:bg-charcoal-50"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-charcoal-200 pb-3 pt-4">
              <div className="space-y-1">
                {navigation.utility.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className="block px-4 py-2 text-base font-medium text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-800"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}