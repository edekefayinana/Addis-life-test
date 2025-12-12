import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex max-w-[1212px] flex-col mt-32 relative items-center w-full mx-auto justify-center gap-4 py-10">
      <Link
        href={'/blogs'}
        className="absolute flex items-center gap-2 rounded-full border py-1 shadow px-4 top-8 left-0"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <p className="lg:text-lg font-normal">Jan 28, 2025</p>
      <h1 className="lg:text-5xl font-semibold font-instrument leading leading-[120%] w-full max-w-[892px] text-center">
        Finding Your Ideal Property: What Matters Most?
      </h1>
      <p className="lg:text-lg font-normal">
        Learn how to choose the perfect home by focus-ing on location, budget,
        and lifestyle needs.
      </p>
      <Image
        className="w-full mt-4 z-20 h-full max-w-[1265px] max-h-[600px]"
        src="/images/blog-1.png"
        alt="Finding Your Ideal Property: What Matters Most?"
        width={1265}
        height={600}
      />
    </section>
  );
}
