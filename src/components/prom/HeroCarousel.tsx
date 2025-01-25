import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&q=80',
    title: 'Prom 2024',
    subtitle: 'Make your night unforgettable',
    ctaText: 'Shop Prom Collection',
    ctaLink: '/collections/prom'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1594938328870-9623159c8c99?auto=format&fit=crop&q=80',
    title: 'Luxury Tuxedos',
    subtitle: 'Stand out in style',
    ctaText: 'Explore Tuxedos',
    ctaLink: '/collections/prom-tuxedos'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&q=80',
    title: 'Sparkle & Shine',
    subtitle: 'Make a dazzling entrance',
    ctaText: 'View Collection',
    ctaLink: '/collections/sparkle-blazers'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            currentSlide === index ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-4 text-xl text-gray-200">
                {slide.subtitle}
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <a
                  href={slide.ctaLink}
                  className="rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100"
                >
                  {slide.ctaText}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="rounded-full bg-black/20 p-2 text-white hover:bg-black/30"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button
          onClick={prevSlide}
          className="rounded-full bg-black/20 p-2 text-white hover:bg-black/30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full bg-black/20 p-2 text-white hover:bg-black/30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}