'use client';
import { HeroSearch } from './HeroSearch';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[98vh] p-4 w-full rounded-2xl flex-col justify-center overflow-hidden text-white">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero-image.jpg")' }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 pb-32 text-center">
        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Discover Premium Real Estate With Confidence
        </h1>
        <p className="max-w-2xl text-lg text-slate-200/90 sm:text-xl">
          Explore ongoing and completed projects, find your ideal property, and
          connect with trusted freelance agents—all in one seamless platform.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-12 z-10 flex justify-center px-6">
        <HeroSearch />
      </div>
    </section>
  );
}
