import { NextRequest, NextResponse } from 'next/server';
import {
  defaultLocale,
  locales,
  LOCALE_COOKIE,
  type Locale,
} from './i18n/config';

export function middleware(request: NextRequest) {
  // Get locale from cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;

  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');

  let locale: Locale = defaultLocale;

  // Priority: Cookie > Accept-Language > Default
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .find((lang) => locales.includes(lang as Locale)) as Locale | undefined;

    if (preferredLocale) {
      locale = preferredLocale;
    }
  }

  // Create response
  const response = NextResponse.next();

  // Set locale cookie if not already set or different
  if (!cookieLocale || cookieLocale !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
