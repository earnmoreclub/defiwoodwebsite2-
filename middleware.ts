import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  // No prefix on default (zh-TW), English gets /en
  localePrefix: 'as-needed',
  // Don't redirect / → /en based on browser Accept-Language.
  // Without this, English-language browsers were being redirected from / to /en,
  // so the Chinese version (at the root URL) was unreachable for most users.
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};