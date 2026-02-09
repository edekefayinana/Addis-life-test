import { BlogCardSkeleton } from '@/components/skeletons/BlogCardSkeleton';
import { SkeletonBlock, SkeletonLine } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="space-y-10">
      <section className="relative py-20 pt-40 rounded-3xl bg-slate-900">
        <div className="flex z-30 w-full max-w-[1212px] p-4 lg:p-0 text-white flex-col gap-6 md:gap-9 lg:gap-12 mx-auto items-start justify-end animate-pulse">
          <div className="h-10 w-96 rounded-full bg-white/15" />
          <div className="h-5 w-[520px] rounded-full bg-white/10" />
          <div className="h-12 w-full max-w-[587px] rounded-full bg-white/10" />
        </div>
      </section>

      <section className="flex flex-col gap-3 lg:gap-8 max-w-[1212px] mx-auto px-3 xl:px-0 py-10">
        <div className="animate-pulse space-y-4">
          <SkeletonLine className="h-7 w-64" />
          <div className="flex mx-auto flex-col items-start justify-center lg:flex-row gap-6 lg:gap-8 w-full">
            <SkeletonBlock className="w-full lg:w-1/2 h-[420px]" />
            <div className="flex w-full lg:w-1/2">
              <div className="flex flex-col gap-4 w-full">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-[167px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 max-w-[1212px] mx-auto px-4 xl:px-0 py-10 mb-20 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <BlogCardSkeleton key={idx} />
          ))}
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <div className="flex gap-4">
            <SkeletonBlock className="h-10 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-48 rounded-full" />
            <SkeletonBlock className="h-10 w-24 rounded-full" />
          </div>
          <SkeletonLine className="mt-4 w-40" />
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
