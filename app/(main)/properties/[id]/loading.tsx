import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonLine,
} from '@/components/ui/skeleton';
import { PropertyCardSkeleton } from '@/components/skeletons/PropertyCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background mt-[70px]">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-pulse">
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <SkeletonLine className="h-7 w-64" />
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <SkeletonBlock className="h-9 sm:h-11 w-24 rounded-full" />
              <SkeletonBlock className="h-9 sm:h-11 w-24 rounded-full" />
              <SkeletonBlock className="h-9 sm:h-11 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SkeletonBlock className="h-10 w-20 rounded-full" />
            <SkeletonBlock className="h-10 w-20 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 border-b mb-6 overflow-x-auto scrollbar-hide animate-pulse">
          <SkeletonLine className="h-5 w-24" />
          <SkeletonLine className="h-5 w-24" />
          <SkeletonLine className="h-5 w-24" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-12 animate-pulse">
          <SkeletonBlock className="aspect-4/3 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonBlock key={idx} className="aspect-4/3 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="animate-pulse">
              <SkeletonLine className="h-6 w-32 mb-4" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-11/12" />
              <SkeletonLine className="h-4 w-10/12" />
              <SkeletonLine className="h-4 w-24 mt-3" />
            </section>

            <section className="p-4 sm:p-6 bg-white border rounded-2xl animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <SkeletonCircle className="h-10 w-10" />
                    <div className="space-y-2">
                      <SkeletonLine className="h-3 w-20" />
                      <SkeletonLine className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="animate-pulse">
              <SkeletonLine className="h-6 w-48 mb-4 sm:mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-12 rounded-xl" />
                ))}
              </div>
            </section>

            <section className="animate-pulse">
              <SkeletonLine className="h-6 w-32 mb-4 sm:mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-12 rounded-xl" />
                ))}
              </div>
            </section>

            <hr className="my-8 border-t" />

            <section className="animate-pulse">
              <SkeletonLine className="h-6 w-56 mb-4" />
              <SkeletonLine className="h-4 w-full mb-4" />
              <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 sm:gap-6">
                    <SkeletonCircle className="h-6 w-6" />
                    <SkeletonLine className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </section>

            <section className="animate-pulse">
              <SkeletonLine className="h-5 w-28 mb-4" />
              <div className="flex items-start gap-3 mb-4">
                <SkeletonCircle className="h-10 w-10" />
                <SkeletonLine className="h-4 w-72" />
              </div>
              <SkeletonBlock className="h-[360px] rounded-xl" />
            </section>

            <section className="animate-pulse">
              <SkeletonLine className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-16 rounded-lg" />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24 animate-pulse">
              <div className="border rounded-2xl p-4 sm:p-6 bg-white">
                <SkeletonLine className="h-5 w-40 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <SkeletonLine className="h-3 w-28" />
                      <SkeletonBlock className="h-10 rounded-md" />
                    </div>
                  ))}
                  <SkeletonBlock className="h-12 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-8 sm:pb-12 mb-8 sm:mb-12">
        <div className="animate-pulse">
          <SkeletonLine className="h-6 w-48 mb-4 sm:mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
