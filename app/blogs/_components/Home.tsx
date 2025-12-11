import React from 'react';

import Image from 'next/image';

export default function Home() {
  return (
    <section className="flex relative py-20 pt-40 m-4 rounded-3xl bg-[#1A1A1A] ">
      <div className="flex w-full max-w-[1212px] text-white flex-col gap-12 mx-auto items-start justify-end">
        <h1 className="lg:text-[64px] max-w-[844px] font-bold leading-[120%]">
          Real Estate Insights and Market Guidance
        </h1>
        <p className="text-lg max-w-[700px] leading-[150%]">
          Stay updated with new listings, market trends, and investment
          opportunities delivered directly to your inbox.
        </p>
        <div className="flex w-full max-w-[587px] bg-white rounded-full overflow-hidden items-center pl-4 pr-1 py-1 h-[56px]">
          <input
            placeholder="Enter your Email"
            className=" w-full text-black pl-4 placeholder:text-black/80 border-0 outline-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          />
          <button className="rounded-full h-full text-base bg-[#003246] font-medium text-white px-8 py-2 shrink-0">
            Subscribe
          </button>
        </div>
      </div>
      <Image
        src={'/images/blogs-hero-bg.svg'}
        width={1000}
        height={690}
        alt="hero bg"
        className="right-0 top-0 absolute h-full"
      />
    </section>
  );
}
