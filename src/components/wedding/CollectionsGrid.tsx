import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    title: 'Wedding Tuxedos',
    description: 'Timeless elegance for your special day',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3859e360-f63d-40d5-35ec-223ffc67f000/public',
    link: '/collections/wedding-tuxedos',
    seo: {
      alt: 'Premium wedding tuxedo collection for grooms and groomsmen',
      caption: 'Luxury wedding tuxedos for your special day',
      keywords: ['wedding tuxedos', 'formal wear', 'groom attire', 'black tie wedding']
    }
  },
  {
    title: 'Wedding Suits',
    description: 'Modern sophistication for the perfect day',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aa23aaf9-ea00-430e-4436-15b8ad71db00/public',
    link: '/collections/wedding-suits',
    seo: {
      alt: 'Premium wedding suit collection featuring modern designs',
      caption: 'Contemporary wedding suits for the modern groom',
      keywords: ['wedding suits', 'groom suits', 'modern wedding attire', 'designer suits']
    }
  },
  {
    title: 'Groomsmen Suits',
    description: 'Coordinated style for your wedding party',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/da3499ff-0251-43d0-0400-460938040000/public',
    link: '/collections/groomsmen-suits',
    seo: {
      alt: 'Coordinated groomsmen suit collection for wedding parties',
      caption: 'Stylish suits for your groomsmen',
      keywords: ['groomsmen suits', 'wedding party attire', 'coordinated suits', 'wedding party']
    }
  },
  {
    title: 'Wedding Ties',
    description: 'The perfect finishing touch',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/0e796052-e8ae-40a0-045c-652028d2df00/public',
    link: '/collections/wedding-ties',
    seo: {
      alt: 'Premium wedding tie and accessories collection',
      caption: 'Elegant ties and accessories for your wedding day',
      keywords: ['wedding ties', 'formal ties', 'wedding accessories', 'groom accessories']
    }
  }
];

export function CollectionsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">
        Wedding Collections
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