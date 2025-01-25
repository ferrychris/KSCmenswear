import { useState } from 'react';
import { AutoplayHLSVideo } from '@/components/video/AutoplayHLSVideo';

interface HeroCarouselProps {
  videoSrc: string;
}

export function HeroCarousel({ videoSrc }: HeroCarouselProps) {
  const [isPlaying] = useState(true);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AutoplayHLSVideo
          src={videoSrc}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Wedding 2024
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            Create your perfect wedding look
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/collections/wedding"
              className="rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100"
            >
              View Collection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}