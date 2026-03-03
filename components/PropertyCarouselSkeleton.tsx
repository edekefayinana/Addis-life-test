import { PropertyCardSkeleton } from './PropertyCard';

export function PropertyCarouselSkeleton() {
  return (
    <section className="w-full bg-accent py-16 my-4 rounded-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-3">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-6 w-96 animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="min-w-[85%] md:min-w-[calc(33.333%-1rem)] flex-none"
              >
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="h-12 w-48 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}
