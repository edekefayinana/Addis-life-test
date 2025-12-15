import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function AgentBanner() {
  return (
    <section className="pb-10 ">
      <div className="relative overflow-hidden rounded-lg bg-cta-bg text-black shadow-sm py-12 lg:px-36 px-6 ">
        {/* Wavy decorative overlay from reg-vector.png */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-[55%]">
            <Image
              src="/reg-vector.png"
              alt=""
              fill
              className="object-cover object-left"
              style={{
                mixBlendMode: 'multiply',
                opacity: 1,
              }}
            />
            <div
              className="absolute inset-0 "
              style={{
                mixBlendMode: 'multiply',
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10 lg:px-12">
          <div className="space-y-3 max-w-3xl font-instrument ">
            <h3 className="text-2xl md:text-4xl font-semibold text-black text-center md:text-left">
              Join Our Freelance Agent Network
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-black/70 font-light text-center md:text-left">
              Join Addis Life Real Estate&apos;s freelance agent community.
              Access exclusive listings, manage clients, and earn competitive
              commissions through our Agent Portal.
            </p>
          </div>

          <Button
            as="a"
            href="/register"
            variant="secondary"
            size="lg"
            className="rounded-full bg-white text-black hover:bg-white/90 shadow-md px-9 py-6 font-normal"
          >
            Register <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
