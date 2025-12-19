import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from "./config";

/**
 * Deep merge two objects, with source values overriding target values.
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/**
 * Load messages for a locale with English fallback.
 * Missing keys in the target locale will fall back to English.
 */
async function loadMessages(locale: Locale) {
  const englishMessages = (await import(`@/messages/en.json`)).default;

  if (locale === "en") {
    return englishMessages;
  }

  const localeMessages = (await import(`@/messages/${locale}.json`)).default;
  return deepMerge(englishMessages, localeMessages);
}

export default getRequestConfig(async () => {
  // 1. Check cookie for user preference
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;

  if (cookieLocale && locales.includes(cookieLocale)) {
    return {
      locale: cookieLocale,
      messages: await loadMessages(cookieLocale),
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
          messages: await loadMessages(browserLocale as Locale),
        };
      }
    }
  }

  // 3. Fall back to default
  return {
    locale: defaultLocale,
    messages: await loadMessages(defaultLocale),
  };
});
