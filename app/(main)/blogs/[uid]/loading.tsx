import { BlogCardSkeleton } from '@/components/skeletons/BlogCardSkeleton';
import { SkeletonBlock, SkeletonLine } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="flex flex-col gap-10 py-14 mx-auto px-4">
      <div className="relative mx-auto w-full flex flex-col items-center justify-center max-w-[892px] gap-4 animate-pulse">
        <SkeletonLine className="h-8 w-3/4" />
        <div className="flex flex-col md:flex-row items-center md:gap-4">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-6" />
          <SkeletonLine className="h-4 w-32" />
        </div>
      </div>

      <div className="max-w-[1212px] mx-auto w-full relative aspect-video rounded-2xl overflow-hidden animate-pulse">
        <SkeletonBlock className="h-full w-full rounded-2xl" />
      </div>

      <div className="relative mx-auto w-full px-4 xl:px-0 max-w-[1082px] flex flex-col lg:flex-row gap-16 pt-4 pb-20">
        <div className="hidden lg:flex flex-col gap-3 w-64 animate-pulse">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="h-4 w-48" />
          <SkeletonLine className="h-4 w-44" />
          <SkeletonLine className="h-4 w-36" />
          <SkeletonLine className="h-4 w-40" />
        </div>
        <div className="flex flex-col max-w-[807px] mx-auto w-full animate-pulse">
          <SkeletonLine className="h-6 w-1/2 mb-4" />
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonLine key={idx} className="h-4 w-full mb-3" />
          ))}
          <SkeletonBlock className="h-[320px] w-full rounded-xl my-6" />
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonLine key={`tail-${idx}`} className="h-4 w-full mb-3" />
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-8 max-w-[1230px] mx-auto w-full pt-5 pb-10 px-4 xl:px-0 animate-pulse">
        <SkeletonLine className="h-7 w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <BlogCardSkeleton key={idx} />
          ))}
        </div>
      </section>

      <section className="pb-10">
        <div className="relative overflow-hidden rounded-lg bg-slate-200/60 py-12 lg:px-36 px-6 animate-pulse">
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
