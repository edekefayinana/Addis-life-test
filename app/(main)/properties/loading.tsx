import { PropertyCardSkeleton } from '@/components/skeletons/PropertyCardSkeleton';
import { SkeletonBlock, SkeletonLine } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1312px] flex-col gap-8 pt-12 pb-16">
      <div className="w-full space-y-6 animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SkeletonLine className="h-7 w-72" />
          <div className="h-12 w-44 rounded-full bg-slate-200/70" />
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="h-12 w-full rounded-full bg-slate-200/70" />
            </div>
            <div className="h-12 w-full rounded-full bg-slate-200/70" />
            <div className="h-12 w-full rounded-full bg-slate-200/70" />
            <div className="h-12 w-full rounded-full bg-slate-200/70" />
          </div>
        </div>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {Array.from({ length: 9 }).map((_, idx) => (
          <PropertyCardSkeleton key={idx} />
        ))}
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-6 animate-pulse">
        <SkeletonBlock className="h-12 w-36 rounded-lg" />
        <div className="flex items-center gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-10 w-10 rounded-full" />
          ))}
        </div>
        <SkeletonBlock className="h-12 w-36 rounded-lg" />
      </div>
    </main>
  );
}
