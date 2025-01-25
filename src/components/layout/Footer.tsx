import { Link } from 'react-router-dom';
import { config } from '@/config';
import { Instagram, Facebook, Twitter, Linkedin, Pointer as Pinterest } from 'lucide-react';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Privacy', href: '/privacy' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/KCTMenswear',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/kct_menswear',
      icon: Instagram,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/kctmenswear',
      icon: Twitter,
    },
    {
      name: 'Pinterest',
      href: 'https://www.pinterest.com/kctmenswear',
      icon: Pinterest,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/kct-menswear',
      icon: Linkedin,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal-50">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link to={item.href} className="text-sm leading-6 text-charcoal-600 hover:text-charcoal-900">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-400 hover:text-charcoal-500"
              aria-label={`Follow us on ${item.name}`}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-charcoal-500">
          &copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}