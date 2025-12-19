/**
 * Supported locales for the application.
 * Add new locales here as they become available.
 */
export const locales = ["en", "es", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Cookie name for storing user language preference.
 */
export const LOCALE_COOKIE = "NEXT_LOCALE";
