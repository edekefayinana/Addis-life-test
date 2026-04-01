'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = () => {
    const newLocale: Locale = locale === 'en' ? 'am' : 'en';

    startTransition(() => {
      // Set cookie
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

      // Refresh the current route without full page reload
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
      {/* Sliding indicator */}
      <span
        className={cn(
          'absolute h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out flex items-center justify-center',
          locale === 'en' ? 'translate-x-1' : 'translate-x-[37px]'
        )}
      >
        <Globe className="h-3.5 w-3.5 text-gray-700" />
      </span>

      {/* Labels */}
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
