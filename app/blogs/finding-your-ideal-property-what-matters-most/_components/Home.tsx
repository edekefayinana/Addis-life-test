import Image from 'next/image';
import React from 'react';

export default function Home() {
  return (
    <section className="flex flex-col items-center w-full mx-auto justify-center gap-4 py-10">
      <p className="lg:text-lg font-normal">Jan 28, 2025</p>
      <h1 className="lg:text-5xl font-semibold leading leading-[120%] w-full max-w-[892px] text-center">
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
