import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonLine,
} from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white p-2 shadow-md">
      <SkeletonBlock className="aspect-16/10 w-full rounded-lg" />
      <div className="p-4 pb-2 space-y-3">
        <SkeletonLine className="h-5 w-3/4" />
        <SkeletonLine className="h-4 w-2/3" />
      </div>
      <div className="px-5">
        <div className="h-px w-full bg-slate-200/70" />
      </div>
      <div className="flex items-center justify-between p-4 text-sm">
        <div className="flex items-center gap-2">
          <SkeletonCircle className="h-5 w-5" />
          <SkeletonLine className="h-4 w-12" />
        </div>
        <div className="h-6 w-px bg-slate-200/70" />
        <div className="flex items-center gap-2">
          <SkeletonCircle className="h-5 w-5" />
          <SkeletonLine className="h-4 w-12" />
        </div>
        <div className="h-6 w-px bg-slate-200/70" />
        <div className="flex items-center gap-2">
          <SkeletonCircle className="h-5 w-5" />
          <SkeletonLine className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
