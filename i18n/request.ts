import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from './config';

export default getRequestConfig(async () => {
  // Get locale from cookie or Accept-Language header
  const cookieStore = await cookies();
  const headersList = await headers();

  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;
  const acceptLanguage = headersList.get('accept-language');

  let locale: Locale = defaultLocale;

  // Priority: Cookie > Accept-Language > Default
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,am;q=0.8")
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .find((lang) => locales.includes(lang as Locale)) as Locale | undefined;

    if (preferredLocale) {
      locale = preferredLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
