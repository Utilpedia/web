"use client";

import { useRouter, usePathname } from "next/navigation";
import { LOCALE_COOKIE, defaultLocale, type Locale } from "@/i18n/config";

/**
 * Set the user's locale preference cookie and redirect to the appropriate URL.
 */
export function setLocalePreference(locale: Locale) {
  // Set cookie (1 year expiry)
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

/**
 * Hook for language switching functionality.
 */
export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Set the cookie
    setLocalePreference(newLocale);

    // Determine the new path
    let newPath: string;

    // Check if current path has a locale prefix
    const currentLocaleMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const currentLocale = currentLocaleMatch?.[1];

    if (currentLocale) {
      // Replace existing locale prefix
      if (newLocale === defaultLocale) {
        // Remove prefix for default locale
        newPath = pathname.replace(/^\/[a-z]{2}/, "") || "/";
      } else {
        // Replace with new locale
        newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
      }
    } else {
      // No locale prefix currently
      if (newLocale === defaultLocale) {
        newPath = pathname;
      } else {
        newPath = `/${newLocale}${pathname}`;
      }
    }

    router.push(newPath);
  };

  return { switchLocale };
}
