import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthProvider } from '@/components/providers/session-provider';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { QueryClientProviderWrapper } from '@/components/providers/query-client-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
          instrumentSans.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryClientProviderWrapper>
            <AuthProvider>
              {children}
              <Toaster
                richColors
                position="bottom-right"
                // toastOptions={{
                //   success: {
                //     style: { background: '#22c55e', color: '#fff' },
                //     iconTheme: { primary: '#22c55e', secondary: '#fff' },
                //   },
                //   error: {
                //     style: { background: '#ef4444', color: '#fff' },
                //     iconTheme: { primary: '#ef4444', secondary: '#fff' },
                //   },
                //   info: {
                //     style: { background: '#0ea5e9', color: '#fff' },
                //     iconTheme: { primary: '#0ea5e9', secondary: '#fff' },
                //   },
                //   warning: {
                //     style: { background: '#f59e42', color: '#fff' },
                //     iconTheme: { primary: '#f59e42', secondary: '#fff' },
                //   },
                // }}
              />
            </AuthProvider>
            <Analytics />
          </QueryClientProviderWrapper>

          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
