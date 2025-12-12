'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/properties', label: 'Properties' },
  { href: '/about-us', label: 'About Us' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact-us', label: 'Contact US' },
];

type HeaderVariant = 'dark' | 'light';

type HeaderProps = {
  variant?: HeaderVariant;
};

const variantStyles: Record<
  HeaderVariant,
  {
    header: string;
    inner: string;
    nav: string;
    navActive: string;
    action: string;
    cta: string;
  }
> = {
  dark: {
    header: 'absolute inset-x-0 top-0 text-white',
    inner: 'text-white',
    nav: 'text-white/90 hover:text-white',
    navActive: 'border-b-2 border-white pb-1 text-white',
    action: 'text-white/90 hover:text-white',
    cta: 'bg-white !text-black hover:bg-white/90 border border-white/30',
  },
  light: {
    header: 'relative bg-white/95 text-foreground border-b border-border',
    inner: 'text-foreground',
    nav: 'text-muted-foreground hover:text-foreground',
    navActive: 'border-b-2 border-brand-dark pb-1 text-foreground',
    action: 'text-foreground hover:text-foreground',
    cta: 'bg-brand-dark !text-white hover:bg-brand-dark/90 border border-brand-dark text-white',
  },
};

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const isDarkRoute = pathname === '/' || pathname === '/blogs';
  const resolvedVariant: HeaderVariant =
    variant ?? (isDarkRoute ? 'dark' : 'light');
  const styles = variantStyles[resolvedVariant];
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className={cn('z-50 w-full', styles.header)}>
      <div
        className={cn(
          `relative mx-auto flex ${
            resolvedVariant === 'dark' ? 'h-24' : 'h-18 md:-mt-4'
          } items-center justify-between transition-colors px-6 sm:px-10 lg:px-24 xl:px-40`,
          styles.inner
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Addis Life Logo"
            width={100}
            height={30}
            className="object-contain"
            priority
          />
        </Link>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'transition-colors',
                  styles.nav,
                  isActive && styles.navActive
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login"
            className={cn(
              'text-base font-medium font-instrument',
              styles.action
            )}
          >
            Login
          </Link>

          <Link
            href="/signup"
            className={cn(
              'rounded-full px-6 py-2.5 text-base font-instrument font-medium transition-colors',
              styles.cta
            )}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-white/10 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 md:hidden',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isMobileOpen}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Addis Life Logo"
              width={100}
              height={30}
              className="object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-full p-2 text-foreground transition hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-6 pb-6 text-base font-medium text-foreground">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 transition hover:bg-gray-100',
                  isActive && 'bg-gray-100 font-semibold'
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-gray-100"
              onClick={() => setIsMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-brand-dark px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-dark/90"
              onClick={() => setIsMobileOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </aside>
    </header>
  );
}
