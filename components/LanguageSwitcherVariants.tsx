'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, type Locale } from '@/i18n/config';
import { Globe, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// VARIANT 1: Classic Toggle (Current Default)
// ============================================
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = () => {
    const newLocale: Locale = locale === 'en' ? 'am' : 'en';

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLocaleChange}
      disabled={isPending}
      className={cn(
        'relative inline-flex h-9 w-[72px] items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        locale === 'en'
          ? 'bg-gray-200 hover:bg-gray-300'
          : 'bg-brand-dark hover:bg-brand-dark/90'
      )}
      aria-label={`Switch to ${locale === 'en' ? 'Amharic' : 'English'}`}
    >
      <span
        className={cn(
          'absolute h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out flex items-center justify-center',
          locale === 'en' ? 'translate-x-1' : 'translate-x-[37px]'
        )}
      >
        <Globe className="h-3.5 w-3.5 text-gray-700" />
      </span>

      <span className="flex w-full items-center justify-between px-2 text-xs font-medium">
        <span
          className={cn(
            'ml-1 transition-colors',
            locale === 'en' ? 'text-gray-700' : 'text-white/60'
          )}
        >
          EN
        </span>
        <span
          className={cn(
            'mr-1 transition-colors',
            locale === 'am' ? 'text-white' : 'text-gray-500'
          )}
        >
          አማ
        </span>
      </span>
    </button>
  );
}

// ============================================
// VARIANT 2: Minimal Toggle (Smaller)
// ============================================
export function LanguageSwitcherMinimal() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = () => {
    const newLocale: Locale = locale === 'en' ? 'am' : 'en';

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLocaleChange}
      disabled={isPending}
      className={cn(
        'relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        locale === 'en'
          ? 'bg-gray-200 hover:bg-gray-300'
          : 'bg-brand-dark hover:bg-brand-dark/90'
      )}
      aria-label={`Switch to ${locale === 'en' ? 'Amharic' : 'English'}`}
    >
      <span
        className={cn(
          'absolute h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out',
          locale === 'en' ? 'translate-x-1' : 'translate-x-8'
        )}
      />
    </button>
  );
}

// ============================================
// VARIANT 3: Segmented Control Style
// ============================================
export function LanguageSwitcherSegmented() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  };

  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => handleLocaleChange('en')}
        disabled={isPending}
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
          locale === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        EN
      </button>
      <button
        onClick={() => handleLocaleChange('am')}
        disabled={isPending}
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
          locale === 'am'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        አማ
      </button>
    </div>
  );
}

// ============================================
// VARIANT 4: Icon Toggle with Text
// ============================================
export function LanguageSwitcherWithIcon() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = () => {
    const newLocale: Locale = locale === 'en' ? 'am' : 'en';

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLocaleChange}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      aria-label={`Switch to ${locale === 'en' ? 'Amharic' : 'English'}`}
    >
      <Languages className="h-4 w-4" />
      <span>{locale === 'en' ? 'EN' : 'አማ'}</span>
    </button>
  );
}

// ============================================
// VARIANT 5: Pill Toggle (iOS Style)
// ============================================
export function LanguageSwitcherPill() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = () => {
    const newLocale: Locale = locale === 'en' ? 'am' : 'en';

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLocaleChange}
      disabled={isPending}
      className={cn(
        'relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        locale === 'en'
          ? 'bg-gradient-to-r from-gray-200 to-gray-300'
          : 'bg-gradient-to-r from-brand-dark/90 to-brand-dark'
      )}
      aria-label={`Switch to ${locale === 'en' ? 'Amharic' : 'English'}`}
    >
      <span
        className={cn(
          'absolute h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-300 ease-out flex items-center justify-center',
          locale === 'en' ? 'translate-x-1' : 'translate-x-9'
        )}
      >
        <span className="text-[10px] font-bold text-gray-700">
          {locale === 'en' ? 'EN' : 'አማ'}
        </span>
      </span>
    </button>
  );
}

// ============================================
// VARIANT 6: Compact Badge Style
// ============================================
export function LanguageSwitcherBadge() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = () => {
    const newLocale: Locale = locale === 'en' ? 'am' : 'en';

    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLocaleChange}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        locale === 'en'
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          : 'bg-brand-dark/10 text-brand-dark hover:bg-brand-dark/20'
      )}
      aria-label={`Switch to ${locale === 'en' ? 'Amharic' : 'English'}`}
    >
      <Globe className="h-3 w-3" />
      <span>{locale === 'en' ? 'English' : 'አማርኛ'}</span>
    </button>
  );
}
