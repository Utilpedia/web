import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, LOCALE_COOKIE } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

/**
 * Extract the locale prefix from a pathname, if present.
 * Returns null if no locale prefix found.
 */
function getPathnameLocale(pathname: string): string | null {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return null;
}

/**
 * Remove locale prefix from pathname.
 */
function stripLocalePrefix(pathname: string, locale: string): string {
  if (pathname === `/${locale}`) return "/";
  return pathname.replace(`/${locale}`, "");
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const preferredLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const pathnameLocale = getPathnameLocale(pathname);

  // Only redirect if user has explicitly set a preference
  if (
    preferredLocale &&
    locales.includes(preferredLocale as (typeof locales)[number])
  ) {
    const url = request.nextUrl.clone();

    // Case 1: User prefers English, but is on a non-English path
    // e.g., preference=en, path=/es/tools/dice-roller → redirect to /tools/dice-roller
    if (preferredLocale === defaultLocale && pathnameLocale) {
      url.pathname = stripLocalePrefix(pathname, pathnameLocale);
      return NextResponse.redirect(url);
    }

    // Case 2: User prefers non-English, but is on an English (unprefixed) path
    // e.g., preference=es, path=/tools/dice-roller → redirect to /es/tools/dice-roller
    if (preferredLocale !== defaultLocale && !pathnameLocale) {
      url.pathname = `/${preferredLocale}${pathname}`;
      return NextResponse.redirect(url);
    }

    // Case 3: User prefers a different non-English locale than the URL
    // e.g., preference=fr, path=/es/tools/dice-roller → redirect to /fr/tools/dice-roller
    if (
      preferredLocale !== defaultLocale &&
      pathnameLocale &&
      pathnameLocale !== preferredLocale
    ) {
      url.pathname = `/${preferredLocale}${stripLocalePrefix(pathname, pathnameLocale)}`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
