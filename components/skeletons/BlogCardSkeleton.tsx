import { SkeletonBlock, SkeletonLine } from '@/components/ui/skeleton';

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col border p-2 rounded-[24px] overflow-hidden bg-white">
      <SkeletonBlock className="h-[240px] w-full rounded-[14px]" />
      <div className="flex flex-col p-3 gap-4 flex-grow">
        <div className="flex flex-col gap-3 flex-grow">
          <SkeletonLine className="h-5 w-4/5" />
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-2/3" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
