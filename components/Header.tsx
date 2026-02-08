'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/', label: 'Home' },
  // { href: '/projects', label: 'Projects' },
  { href: '/properties', label: 'Properties' },
  { href: '/about-us', label: 'About Us' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact-us', label: 'Contact US' },
];

const propertyMenuItems = [
  { href: '/properties?type=rent', label: 'Rent' },
  { href: '/properties?type=sale', label: 'Sale' },
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
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const propertiesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isPropertiesOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (propertiesRef.current?.contains(target)) return;
      setIsPropertiesOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPropertiesOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPropertiesOpen]);

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
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium leading-none md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.href === '/properties') {
              return (
                <div
                  key={item.href}
                  ref={propertiesRef}
                  className="relative"
                  onMouseEnter={() => setIsPropertiesOpen(true)}
                  onMouseLeave={() => setIsPropertiesOpen(false)}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 top-full h-2"
                  />
                  <button
                    type="button"
                    className={cn(
                      'inline-flex h-6 items-center gap-1 transition-colors focus:outline-none',
                      styles.nav,
                      isActive && styles.navActive
                    )}
                    aria-haspopup="menu"
                    aria-expanded={isPropertiesOpen}
                    onClick={() => setIsPropertiesOpen((prev) => !prev)}
                  >
                    {item.label}
                  </button>
                  {isPropertiesOpen && (
                    <div className="absolute left-1/2 top-full z-50 mt-2 w-44 -translate-x-1/2 rounded-lg border border-border bg-white/95 p-1 text-sm text-foreground shadow-lg">
                      {propertyMenuItems.map((menuItem) => (
                        <Link
                          key={menuItem.href}
                          href={menuItem.href}
                          className="block w-full rounded-md px-3 py-2 transition hover:bg-gray-100"
                          onClick={() => setIsPropertiesOpen(false)}
                        >
                          {menuItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex h-6 items-center transition-colors',
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
        <div className="md:hidden">
          <DropdownMenu open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-white/10">
              <Menu className="h-6 w-6" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="flex w-56 flex-col gap-2 rounded-xl border border-border bg-white/95 p-2 shadow-lg"
            >
              {navItems.map((item) => {
                if (item.href === '/properties') {
                  return (
                    <DropdownMenuSub key={item.href}>
                      <DropdownMenuSubTrigger className="cursor-pointer px-3 text-base font-medium text-foreground">
                        {item.label}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="flex flex-col gap-1 rounded-xl border border-border bg-white p-1 shadow-lg">
                          {propertyMenuItems.map((menuItem) => (
                            <DropdownMenuItem
                              key={menuItem.href}
                              className="p-0"
                              asChild
                            >
                              <Link
                                href={menuItem.href}
                                className="w-full rounded-md px-3 py-2 text-base transition hover:bg-gray-100"
                              >
                                {menuItem.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  );
                }

                return (
                  <DropdownMenuItem key={item.href} className="p-0" asChild>
                    <Link
                      href={item.href}
                      className="w-full rounded-lg px-3 py-2 text-base font-medium text-foreground transition hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />

              <DropdownMenuItem className="p-0" asChild>
                <Link
                  href="/login"
                  className="w-full rounded-full px-4 py-2 text-center text-sm font-medium text-foreground transition hover:bg-gray-100"
                >
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0" asChild>
                <Link
                  href="/signup"
                  className="w-full rounded-full bg-brand-dark px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-dark/90"
                >
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
