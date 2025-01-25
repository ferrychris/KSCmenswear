import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CollectionsGrid } from '@/components/home/CollectionsGrid';

export default function Collections() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80"
            alt="Collections"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>
        <div className="relative">
          <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Collections
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Explore our curated collections of premium menswear
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="mt-24">
        <CollectionsGrid />
      </div>

      {/* Featured Categories */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {[
            {
              title: 'Wedding Collection',
              description: 'Timeless elegance for your special day',
              href: '/wedding',
              image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80'
            },
            {
              title: 'Prom 2025',
              description: 'Make your night unforgettable',
              href: '/prom',
              image: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&q=80'
            }
          ].map((category) => (
            <Link
              key={category.title}
              to={category.href}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  <p className="text-gray-200">{category.description}</p>
                  <div className="flex items-center text-white mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-medium">Explore Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}