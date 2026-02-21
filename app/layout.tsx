import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ScrollToTop } from '@/components/ScrollToTop';

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
    'Addis Life | Explore properties, connect with agents, and discover modern living in Addis Ababa.',
  icons: {
    icon: [
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
  keywords: [
    'Addis Ababa',
    'Real Estate',
    'Property Listings',
    'Agent',
    'Modern Living',
    'Next.js',
    'Design System',
    'shadcn',
  ],
  openGraph: {
    title: 'Addis Life',
    description:
      'Explore properties, connect with agents, and discover modern living in Addis Ababa.',
    images: ['/logo.png'],
    url: 'https://addis-life-realstate.vercel.app/',
    siteName: 'Addis Life',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Addis Life',
    description: 'Modern property platform for Addis Ababa.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
          instrumentSans.variable
        )}
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
