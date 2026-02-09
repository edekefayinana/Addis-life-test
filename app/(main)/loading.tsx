import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonLine,
} from '@/components/ui/skeleton';
import { PropertyCardSkeleton } from '@/components/skeletons/PropertyCardSkeleton';

export default function Loading() {
  return (
    <main className="space-y-10">
      <section className="relative min-h-[98vh] w-full rounded-2xl bg-slate-200/60 p-4 animate-pulse" />

      <section className="w-full bg-accent py-16 my-4 rounded-lg">
        <div className="container mx-auto px-4 md:px-6 animate-pulse">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="space-y-3">
              <SkeletonLine className="h-7 w-64" />
              <SkeletonLine className="w-96" />
            </div>
            <div className="flex gap-2">
              <SkeletonCircle className="h-10 w-10" />
              <SkeletonCircle className="h-10 w-10" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <SkeletonBlock className="h-12 w-56 rounded-full" />
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16 px-2 md:px-6 lg:px-8 animate-pulse">
        <SkeletonLine className="h-7 w-72 mb-8" />
        <div className="grid gap-5 md:grid-cols-13 lg:gap-5 items-center">
          <SkeletonBlock className="min-h-[300px] md:col-span-7" />
          <div className="md:col-span-6 p-8 bg-slate-200/70 rounded-lg">
            <div className="space-y-4">
              <SkeletonLine className="w-40" />
              <SkeletonLine className="h-5 w-full" />
              <SkeletonLine className="h-5 w-5/6" />
            </div>
            <div className="mt-8 flex items-center gap-8">
              <div className="space-y-2">
                <SkeletonLine className="h-8 w-20" />
                <SkeletonLine className="w-24" />
              </div>
              <div className="h-12 w-px bg-slate-200/70" />
              <div className="space-y-2">
                <SkeletonLine className="h-8 w-16" />
                <SkeletonLine className="w-32" />
              </div>
            </div>
            <div className="mt-8 h-12 w-44 rounded-full bg-slate-200/70" />
          </div>
        </div>
      </section>

      <section className="bg-brand-dark py-20 text-white rounded-lg">
        <div className="container mx-auto px-4 lg:px-8 animate-pulse">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col justify-center lg:col-span-5 space-y-4">
              <div className="h-8 w-72 rounded-full bg-white/15" />
              <div className="h-5 w-full rounded-full bg-white/10" />
              <div className="h-5 w-5/6 rounded-full bg-white/10" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white/10 p-8 min-h-[180px]"
                />
              ))}
            </div>
          </div>
          <div className="mt-24 border-t border-white/10 pt-12 text-center w-full">
            <div className="h-4 w-48 mx-auto rounded-full bg-white/10" />
            <div className="mt-6 flex justify-center gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-8 w-20 rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-20 px-4 lg:px-8 animate-pulse">
        <div className="mb-16 text-center space-y-4">
          <SkeletonLine className="mx-auto h-8 w-72" />
          <SkeletonLine className="mx-auto w-[520px]" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px]">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-[300px]" />
          ))}
        </div>
      </section>

      <section className="w-full bg-[var(--testimonial-bg)] py-14 md:py-20 rounded-lg">
        <div className="container mx-auto px-4 md:px-6 animate-pulse">
          <div className="text-center mb-10 md:mb-14 space-y-4">
            <SkeletonLine className="mx-auto h-8 w-72" />
            <SkeletonLine className="mx-auto w-[520px]" />
          </div>
          <div className="mx-auto py-8 flex flex-col gap-8 md:flex-row md:items-stretch">
            <SkeletonBlock className="w-full md:w-[48%] aspect-video" />
            <div className="flex-1 space-y-6">
              <SkeletonCircle className="h-10 w-10" />
              <SkeletonLine className="h-6 w-full" />
              <SkeletonLine className="h-6 w-5/6" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SkeletonCircle className="h-12 w-12" />
                  <div className="space-y-2">
                    <SkeletonLine className="w-32" />
                    <SkeletonLine className="w-20" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <SkeletonCircle className="h-12 w-12" />
                  <SkeletonCircle className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-20 px-4 md:px-6 animate-pulse">
        <div className="mb-10 text-center space-y-4">
          <SkeletonLine className="mx-auto h-7 w-64" />
          <SkeletonLine className="mx-auto w-[420px]" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-80" />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <SkeletonBlock className="h-12 w-48 rounded-full" />
        </div>
      </section>

      <section className="pb-10 animate-pulse">
        <div className="relative overflow-hidden rounded-lg bg-slate-200/60 py-12 lg:px-36 px-6">
          <div className="relative flex flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10 lg:px-12">
            <div className="space-y-4 max-w-3xl">
              <SkeletonLine className="h-7 w-72" />
              <SkeletonLine className="w-[520px]" />
            </div>
            <SkeletonBlock className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
