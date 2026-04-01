'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
    nav: 'hover:text-foreground',
    navActive: 'border-b-2 border-brand-dark pb-1 text-foreground',
    action: 'text-foreground hover:text-foreground',
    cta: 'bg-brand-dark !text-white hover:bg-brand-dark/90 border border-brand-dark text-white',
  },
};

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations('nav');

  const isDarkRoute = pathname === '/' || pathname === '/blogs';
  const resolvedVariant: HeaderVariant =
    variant ?? (isDarkRoute ? 'dark' : 'light');
  const styles = variantStyles[resolvedVariant];
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const propertiesRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';
  const isAgent = session?.user?.role === 'AGENT';

  // Navigation items with translations
  const navItems = [
    { href: '/', label: t('home') },
    { href: '/properties', label: t('properties') },
    { href: '/current-progress', label: t('progress') },
    { href: '/about-us', label: t('aboutUs') },
    { href: '/blogs', label: t('blogs') },
    { href: '/contact-us', label: t('contactUs') },
  ];

  const propertyMenuItems = [
    { href: '/properties?listingType=RENT', label: t('rent') },
    { href: '/properties?listingType=SALE', label: t('sale') },
  ];

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

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (profileRef.current?.contains(target)) return;
      setIsProfileOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

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
            src="/logo.png"
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
                      `inline-flex h-6 items-center gap-1 transition-colors focus:outline-none`,
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
        <div className="hidden items-center gap-4 md:flex">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div
              ref={profileRef}
              className="relative"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 transition-colors',
                  resolvedVariant === 'dark'
                    ? 'border-white/30 hover:bg-white/10'
                    : 'border-gray-300 hover:bg-gray-100'
                )}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    resolvedVariant === 'dark' ? 'bg-white/20' : 'bg-gray-200'
                  )}
                >
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  {session?.user?.name || t('account')}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white px-4 py-4">
                    <p className="text-base font-semibold text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {session?.user?.email}
                    </p>
                    {(isAdmin || isAgent) && (
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                        {isAdmin ? t('admin') : t('agent')}
                      </span>
                    )}
                  </div>

                  <div className="py-2">
                    {(isAdmin || isAgent) && (
                      <>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium !text-gray-700 transition hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {isAdmin ? t('adminDashboard') : t('dashboard')}
                        </Link>
                        <Link
                          href="/admin/inventory"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium !text-gray-700 transition hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          {t('inventory')}
                        </Link>
                        <div className="my-1 border-t border-gray-100" />
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  'text-base font-medium font-instrument',
                  styles.action
                )}
              >
                {t('login')}
              </Link>

              <Link
                href="/apply"
                className={cn(
                  'rounded-full px-6 py-2.5 text-base font-instrument font-medium transition-colors',
                  styles.cta
                )}
              >
                {t('signup')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-white/10"
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
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
        id="mobile-drawer"
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

            if (item.href === '/properties') {
              return (
                <div key={item.href} className="flex flex-col gap-2">
                  <Link
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
                  <div className="ml-3 flex flex-col gap-1">
                    {propertyMenuItems.map((menuItem) => (
                      <Link
                        key={menuItem.href}
                        href={menuItem.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-gray-100 hover:text-foreground"
                      >
                        {menuItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

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

          {/* Language Switcher in Mobile */}
          <div className="mt-2 px-3">
            <LanguageSwitcher />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="mb-2 rounded-xl bg-gradient-to-br from-gray-50 to-white px-4 py-4 ring-1 ring-gray-200">
                  <p className="text-base font-semibold text-gray-900">
                    {session?.user?.name}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {session?.user?.email}
                  </p>
                  {(isAdmin || isAgent) && (
                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                      {isAdmin ? t('admin') : t('agent')}
                    </span>
                  )}
                </div>

                {(isAdmin || isAgent) && (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {isAdmin ? t('adminDashboard') : t('dashboard')}
                    </Link>
                    <Link
                      href="/admin/inventory"
                      className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      {t('inventoryManagement')}
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-center text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-gray-100"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/apply"
                  className="rounded-full bg-brand-dark px-4 py-2 text-center text-sm font-semibold !text-white hover:bg-brand-dark/90"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </nav>
      </aside>
    </header>
  );
}
