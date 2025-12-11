import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Addis Life',
  description:
    'Addis Life | Modern Next.js app following server-component-first, design system, and shadcn-inspired patterns.',
};

import { ScrollToTop } from '@/components/ScrollToTop';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background text-foreground antialiased',
          geistSans.variable,
          geistMono.variable,
          instrumentSans.variable
        )}
      >
        <div className="min-h-screen bg-background p-2 font-sans md:p-2 lg:p-2">
          <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-[1920px] overflow-hidden bg-white md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </div>
        </div>
      </body>
    </html>
  );
}
