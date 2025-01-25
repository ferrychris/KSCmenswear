import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    title: 'Prom Tuxedos',
    description: 'Classic elegance redefined',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/a85d3138-06a6-4cf1-57bc-342ccc3f2300/public',
    link: '/collections/prom-tuxedos',
    seo: {
      alt: 'Premium prom tuxedo collection featuring classic and modern designs',
      caption: 'Timeless elegance meets modern style in our tuxedo collection',
      keywords: ['prom tuxedos', 'formal wear', 'designer tuxedos', 'black tie', 'formal attire']
    }
  },
  {
    title: 'Sparkle Blazers',
    description: 'Stand out in style',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/10ad0313-6675-4007-d543-71f010733600/public',
    link: '/collections/sparkle-blazers',
    seo: {
      alt: 'Exclusive sparkle blazer collection for prom and special occasions',
      caption: 'Make a statement with our unique sparkle blazers',
      keywords: ['sparkle blazers', 'sequin blazers', 'prom blazers', 'statement jackets']
    }
  },
  {
    title: 'Prom Blazers',
    description: 'Contemporary style',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/10ad0313-6675-4007-d543-71f010733600/public',
    link: '/collections/prom-blazers',
    seo: {
      alt: 'Designer prom blazer collection featuring modern cuts and styles',
      caption: 'Stand out with our exclusive blazer collection',
      keywords: ['prom blazers', 'designer blazers', 'modern blazers', 'formal jackets']
    }
  },
  {
    title: 'Prom Shirts',
    description: 'Perfect foundation pieces',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/2b34fe36-90cc-475f-6262-88fd29639f00/public',
    link: '/collections/prom-shirts',
    seo: {
      alt: 'Premium dress shirt collection for prom and formal events',
      caption: 'Quality dress shirts for the perfect foundation',
      keywords: ['prom shirts', 'dress shirts', 'formal shirts', 'designer shirts']
    }
  },
  {
    title: 'Prom Shoes',
    description: 'Complete your look',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/a88c55f3-0bec-4188-0a44-fe4f5c567700/public',
    link: '/collections/prom-shoes',
    seo: {
      alt: 'Premium formal shoe collection for prom and special occasions',
      caption: 'Designer shoes to complete your perfect look',
      keywords: ['prom shoes', 'formal shoes', 'dress shoes', 'designer footwear']
    }
  },
  {
    title: 'Sparkling Vests',
    description: 'Add some sparkle',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e3c3e87e-6d09-467a-a2f6-91133592ec00/public',
    link: '/collections/sparkling-vests',
    seo: {
      alt: 'Sparkling vest collection for prom and formal events',
      caption: 'Dazzling vests for a memorable night',
      keywords: ['sparkling vests', 'prom vests', 'sequin vests', 'formal vests']
    }
  },
  {
    title: 'Prom Bowties',
    description: 'The perfect finishing touch',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/15f54e02-470e-440e-ef72-75bf3e79b400/public',
    link: '/collections/prom-bowties',
    seo: {
      alt: 'Premium prom bowtie collection',
      caption: 'Elegant bowties for your prom night',
      keywords: ['prom bowties', 'formal bowties', 'dress bowties', 'designer bowties']
    }
  },
  {
    title: 'Prom Vests',
    description: 'Classic prom style',
    imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aca98635-b699-4bf1-3b8a-2ac3cae2d900/public',
    link: '/collections/prom-vests',
    seo: {
      alt: 'Classic prom vest collection',
      caption: 'Traditional and modern prom vests',
      keywords: ['prom vests', 'formal vests', 'dress vests', 'prom attire']
    }
  }
];

export function CollectionsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
        Prom Collections
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.title}
            to={collection.link}
            className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100"
          >
            <img
              src={collection.imageUrl}
              alt={collection.seo.alt}
              title={collection.seo.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-xl font-semibold text-white">{collection.title}</h3>
              <p className="mt-2 text-gray-200">{collection.description}</p>
              <div className="mt-4 flex items-center text-white">
                <span className="text-sm font-medium">Shop Now</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}