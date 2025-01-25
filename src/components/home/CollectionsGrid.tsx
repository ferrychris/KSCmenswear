import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const collections = [
  {
    title: 'Formal Wear',
    description: 'Timeless suits and tuxedos',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public',
    link: '/collections/suits',
    accent: 'from-indigo-500 to-blue-500',
    seo: {
      alt: 'Premium formal wear collection featuring suits and tuxedos',
      caption: 'Elegant formal wear for any occasion',
      keywords: ['formal wear', 'suits', 'tuxedos', 'menswear', 'formal attire']
    }
  },
  {
    title: 'Casual Collection',
    description: 'Effortless everyday style',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/d4b13199-6ffb-447b-f75d-695dfe7e2b00/public',
    link: '/collections/casual',
    accent: 'from-emerald-500 to-teal-500',
    seo: {
      alt: 'Casual menswear collection featuring everyday styles',
      caption: 'Contemporary casual wear for the modern man',
      keywords: ['casual wear', 'everyday style', 'menswear', 'casual attire']
    }
  },
  {
    title: 'Accessories',
    description: 'Complete your look',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3a52e2df-c817-46b2-6a35-bed7ca57ea00/public',
    link: '/collections/accessories',
    accent: 'from-amber-500 to-orange-500',
    seo: {
      alt: 'Premium menswear accessories collection',
      caption: 'Curated accessories to perfect your style',
      keywords: ['accessories', 'ties', 'bowties', 'pocket squares', 'menswear accessories']
    }
  },
  {
    title: 'Winter Collection',
    description: 'Stay warm in style',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/f6a95174-5825-4abb-e855-d8875fd2e000/public',
    link: '/collections/winter',
    accent: 'from-rose-500 to-pink-500',
    seo: {
      alt: 'Winter menswear collection featuring warm and stylish pieces',
      caption: 'Sophisticated winter wear for the cold season',
      keywords: ['winter collection', 'winter wear', 'winter suits', 'winter menswear']
    }
  }
];

export function CollectionsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">
        Latest Collections
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.title}
            to={collection.link}
            className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100"
          >
            <img
              src={collection.imageUrl}
              alt={collection.seo.alt}
              title={collection.seo.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-75 transition-opacity duration-300" style={{ background: `linear-gradient(to right, ${collection.accent})` }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{collection.title}</h3>
              <p className="text-lg text-gray-200 mb-4">{collection.description}</p>
              <div className="flex items-center text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-lg font-medium">Explore Collection</span>
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}