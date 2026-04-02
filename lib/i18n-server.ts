import { getTranslations as getNextIntlTranslations } from 'next-intl/server';

/**
 * Get translations for server components and API routes
 *
 * @example
 * const t = await getTranslations('common');
 * return { message: t('success') };
 */
export async function getTranslations(namespace: string) {
  return getNextIntlTranslations(namespace);
}

/**
 * Get current locale in server components
 */
export { getLocale } from 'next-intl/server';
