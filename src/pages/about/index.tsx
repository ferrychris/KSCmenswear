import { useState } from 'react';
import { Calendar, Users, Star, Ruler, Award, MapPin, History, Sparkles } from 'lucide-react';
import { AboutPageSEO } from '@/components/seo/AboutPageSEO';

const timeline = [
  {
    year: 1983,
    title: 'Our Beginning',
    description: 'KCT Menswear (Kalamazoo Custom Tailoring) opens its doors, bringing expert tailoring to Southwest Michigan.',
  },
  {
    year: 1993,
    title: 'Expanding Services',
    description: 'Introduced formal wear rentals and expanded wedding services to meet growing demand.',
  },
  {
    year: 2003,
    title: 'Second Location',
    description: 'Opened our Portage location at Crossroads Mall to better serve the community.',
  },
  {
    year: 2013,
    title: 'Modern Evolution',
    description: 'Expanded our collection to include modern designer brands while maintaining our commitment to quality.',
  },
  {
    year: 2023,
    title: '40 Years of Excellence',
    description: 'Celebrating four decades of serving Southwest Michigan with premium menswear and expert tailoring.',
  },
];

const stats = [
  { label: 'Years of Experience', value: '40+' },
  { label: 'Satisfied Customers', value: '100K+' },
  { label: 'Expert Tailors', value: '15+' },
  { label: 'Cities Served', value: '20+' },
];

const expertise = [
  {
    icon: Ruler,
    title: 'Custom Tailoring',
    description: 'Expert alterations and bespoke garments crafted to your exact measurements.',
  },
  {
    icon: Users,
    title: 'Wedding Specialists',
    description: 'Coordinated styling and fittings for entire wedding parties.',
  },
  {
    icon: Star,
    title: 'Premium Selection',
    description: 'Curated collection of high-quality suits, tuxedos, and accessories.',
  },
  {
    icon: Sparkles,
    title: 'Trending Styles',
    description: 'Latest fashion trends and timeless classics for every occasion.',
  },
];

const servingCities = [
  'Kalamazoo', 'Portage', 'Battle Creek', 'Mattawan', 
  'Paw Paw', 'Plainwell', 'Richland', 'Schoolcraft', 
  'Three Rivers', 'Vicksburg'
];

export default function About() {
  const [activeYear, setActiveYear] = useState(timeline[timeline.length - 1].year);

  return (
    <div className="bg-white">
      <AboutPageSEO 
        timeline={timeline}
        teamMembers={[
          {
            name: 'Master Tailor',
            role: 'Head of Alterations',
            bio: 'Over 30 years of experience in custom tailoring and alterations.'
          },
          {
            name: 'Style Consultant',
            role: 'Wedding Specialist',
            bio: 'Expert in wedding party coordination and formal wear styling.'
          }
        ]} 
      />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80"
            alt="KCT Menswear storefront"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Our Story
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Since 1983, KCT Menswear has been Southwest Michigan's premier destination for 
                exceptional menswear and expert tailoring services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Four Decades of Excellence
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                From humble beginnings as Kalamazoo Custom Tailoring to becoming the region's 
                leading menswear destination.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              Our Journey
            </h2>
            <div className="mt-16">
              {/* Timeline Navigation */}
              <div className="flex justify-between mb-12">
                {timeline.map((item) => (
                  <button
                    key={item.year}
                    onClick={() => setActiveYear(item.year)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                      activeYear === item.year
                        ? 'text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {item.year}
                    {activeYear === item.year && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Timeline Content */}
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className={`transition-opacity duration-300 ${
                    activeYear === item.year ? 'opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-lg text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Expertise
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Combining traditional craftsmanship with modern style to deliver exceptional 
              service and quality.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {expertise.map((item) => (
                <div key={item.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <item.icon className="h-5 w-5 flex-none text-indigo-600" />
                    {item.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{item.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Service Area Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Serving Southwest Michigan
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Our central locations in Kalamazoo and Portage make us easily accessible to 
                customers throughout Southwest Michigan.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {servingCities.map((city) => (
                  <div key={city} className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80"
                alt="Store interior"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Award-Winning Service</h3>
                    <p className="text-sm text-gray-600">Voted Best Menswear Store 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Experience the KCT Difference
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Visit one of our locations today and discover why we've been Southwest Michigan's 
              trusted name in menswear for over 40 years.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/contact"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact Us
              </a>
              <a
                href="/locations"
                className="text-sm font-semibold leading-6 text-white"
              >
                Find a Store <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}