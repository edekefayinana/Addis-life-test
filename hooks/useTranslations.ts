// Re-export next-intl hooks for convenience
export { useTranslations, useLocale, useMessages } from 'next-intl';

// Type-safe translation hook
import { useTranslations as useNextIntlTranslations } from 'next-intl';

export type TranslationKey =
  | 'common'
  | 'nav'
  | 'home'
  | 'auth'
  | 'properties'
  | 'contact'
  | 'footer';

export function useTypedTranslations<T extends TranslationKey>(namespace: T) {
  return useNextIntlTranslations(namespace);
}
