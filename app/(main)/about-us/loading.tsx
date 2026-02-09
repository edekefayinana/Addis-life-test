import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonLine,
} from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="m-4 lg:m-0 space-y-10">
      <section className="mb-10 lg:mb-20 mt-20">
        <div className="max-w-[1212px] mx-auto animate-pulse">
          <div className="flex flex-wrap space-y-7 justify-between items-start">
            <div className="flex flex-col gap-4 w-full max-w-[575px]">
              <SkeletonLine className="h-8 w-80" />
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-5/6" />
              <div className="flex gap-3 mt-3">
                <SkeletonBlock className="h-12 w-36 rounded-full" />
                <SkeletonBlock className="h-12 w-36 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="w-full lg:max-w-[530px] aspect-video" />
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1212px] mt-10 mb-5 mx-auto">
        <SkeletonBlock className="h-[600px] animate-pulse" />
      </section>

      <section className="py-10 lg:py-20">
        <div className="max-w-[1212px] mx-auto animate-pulse">
          <div className="flex flex-wrap space-y-9 justify-between items-start">
            <div className="flex flex-col gap-4 w-full max-w-[537px]">
              <SkeletonLine className="h-7 w-72" />
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-5/6" />
              <SkeletonBlock className="h-12 w-40 rounded-full" />
            </div>
            <div className="relative flex flex-col gap-10 w-full max-w-[574px]">
              <div className="space-y-3">
                <SkeletonLine className="h-6 w-40" />
                <SkeletonLine className="w-full" />
                <SkeletonLine className="w-5/6" />
              </div>
              <div className="space-y-3">
                <SkeletonLine className="h-6 w-40" />
                <SkeletonLine className="w-full" />
                <SkeletonLine className="w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/10 rounded-3xl py-10 lg:py-20 flex flex-col">
        <div className="flex w-full max-w-[1212px] px-3 lg:px-0 mx-auto gap-5 lg:gap-10 flex-col items-center justify-center animate-pulse">
          <div className="flex flex-col w-full max-w-[720px] justify-center items-center gap-3">
            <SkeletonLine className="h-7 w-64" />
            <SkeletonLine className="w-[420px]" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-[1212px] mx-auto w-full">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonBlock key={idx} className="h-56" />
            ))}
          </div>
        </div>
        <span className="w-full mx-auto h-px bg-white/20 my-10 lg:my-16" />
        <div className="flex flex-col gap-7 lg:gap-10 items-center justify-center">
          <SkeletonLine className="h-6 w-48" />
          <div className="flex flex-col md:flex-row w-full mt-5 max-w-[1100px] mx-auto items-center justify-around gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <SkeletonLine className="h-8 w-20" />
                <SkeletonLine className="w-32" />
              </div>
            ))}
          </div>
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
