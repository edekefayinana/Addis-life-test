import { SkeletonBlock, SkeletonLine } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="space-y-10">
      <section className="pt-20 pb-10 md:py-20 px-4 lg:px-0">
        <div className="flex w-full max-w-[1212px] flex-col gap-4 mx-auto items-center justify-center animate-pulse">
          <SkeletonLine className="h-8 w-[520px]" />
          <SkeletonLine className="w-[620px]" />
        </div>
      </section>

      <section className="p-4 lg:p-0">
        <div className="flex flex-col lg:flex-row-reverse w-full gap-12 max-w-[1212px] mx-auto animate-pulse">
          <SkeletonBlock className="lg:w-1/2 h-[520px]" />
          <SkeletonBlock className="w-full lg:max-w-1/2 h-[520px]" />
        </div>
        <div className="mx-auto py-5 lg:py-16 max-w-[1212px] animate-pulse">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonBlock key={idx} className="h-52" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 lg:py-24 mx-4 px-4 lg:px-0 bg-[#F6F8FA] my-4 rounded-3xl">
        <div className="max-w-[1212px] mx-auto animate-pulse">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
            <div className="w-full max-w-[457px] space-y-4">
              <SkeletonLine className="h-7 w-64" />
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-5/6" />
            </div>
            <div className="space-y-5 w-full max-w-[693px]">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonBlock key={idx} className="h-20" />
              ))}
            </div>
          </div>
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
