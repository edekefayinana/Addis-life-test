import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 m-1 lg:m-4">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="min-h-[90vh] relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-lg  px-12 py-16">
        {/* Decorative clouds */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-6 pt-8 md:px-16">
          <Image
            src="/cloud-1.svg"
            alt=""
            width={160}
            height={80}
            className="h-12 w-auto opacity-80 md:h-16"
          />
          <Image
            src="/cloud-2.svg"
            alt=""
            width={200}
            height={100}
            className="h-14 w-auto opacity-70 md:h-20"
          />
          <Image
            src="/cloud-3.svg"
            alt=""
            width={140}
            height={70}
            className="hidden h-10 w-auto opacity-60 md:inline-block md:h-14"
          />
        </div>

        {/* Large 404 Illustration */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden -translate-y-6 md:-translate-y-10">
          <Image
            src="/404.svg"
            alt="404 - Page not found"
            width={1200}
            height={500}
            priority
            className="w-full max-w-5xl object-contain"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="mb-4 font-sans text-4xl font-bold text-gray-900 md:text-5xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-lg text-gray-600 text-pretty">
            The page you&apos;re looking for may have been moved, renamed, or is
            temporarily unavailable.
          </p>
          <Button
            variant="outline"
            className="h-12 rounded-full px-8 text-base font-medium text-black hover:bg-gray-100"
          >
            <Link href="/" className="flex items-center gap-2">
              <span>Go to Home</span>
            </Link>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Cityscape Illustration (two stacked SVGs on z-axis) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-56 lg:h-64 overflow-hidden">
          <div className="relative h-full w-full">
            {/* Background white skyline */}
            <Image
              src="/not-fount-white.svg"
              alt="City skyline background"
              fill
              priority
              className="object-cover z-0"
            />
            {/* Foreground yellow skyline */}
            <Image
              src="/not-found--yello.svg"
              alt="City skyline foreground"
              fill
              priority
              className="object-cover z-10"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
