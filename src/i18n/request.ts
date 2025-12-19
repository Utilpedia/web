import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from "./config";

export default getRequestConfig(async () => {
  // 1. Check cookie for user preference
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;

  if (cookieLocale && locales.includes(cookieLocale)) {
    return {
      locale: cookieLocale,
      messages: (await import(`@/messages/${cookieLocale}.json`)).default,
    };
  }

  // 2. Check Accept-Language header
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");

  if (acceptLanguage) {
    // Parse Accept-Language and find first matching locale
    const browserLocales = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0]?.trim().split("-")[0])
      .filter(Boolean);

    for (const browserLocale of browserLocales) {
      if (locales.includes(browserLocale as Locale)) {
        return {
          locale: browserLocale as Locale,
          messages: (await import(`@/messages/${browserLocale}.json`)).default,
        };
      }
    }
  }

  // 3. Fall back to default
  return {
    locale: defaultLocale,
    messages: (await import(`@/messages/${defaultLocale}.json`)).default,
  };
});
