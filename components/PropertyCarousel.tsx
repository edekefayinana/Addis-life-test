'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard, PropertyCardProps } from './PropertyCard';

interface PropertyCarouselProps {
  title: string;
  description?: string;
  properties: PropertyCardProps[];
}

export function PropertyCarousel({
  title,
  description,
  properties,
}: PropertyCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      // On desktop, scroll by one item width (approx 1/3 of container). On mobile, scroll full container width.
      const isDesktop = window.innerWidth >= 768;
      const scrollAmount = isDesktop
        ? (containerWidth - 48) / 3 + 24 // item width + gap
        : containerWidth;

      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-accent py-16 my-4 rounded-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {properties.map((prop, idx) => (
            <div
              key={idx}
              className="min-w-[85%] md:min-w-[calc(33.333%-1rem)] flex-none snap-start"
            >
              <PropertyCard {...prop} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 text-base font-medium"
          >
            View All Properties <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
