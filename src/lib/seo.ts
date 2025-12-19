import { locales, defaultLocale } from "@/i18n/config";

/**
 * Base URL for the site (used in metadata and sitemaps).
 */
export const siteUrl = process.env.SITE_URL || "https://utilpedia.org";

/**
 * Generate hreflang alternate links for a given path.
 * English (default) has no prefix, other locales are prefixed.
 * Returns ABSOLUTE URLs as recommended by Google.
 *
 * @param path - The path without locale prefix (e.g., "/tools/dice-roller")
 * @returns Object suitable for Next.js Metadata alternates.languages
 */
export function generateAlternates(path: string) {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    const localePath = locale === defaultLocale ? path : `/${locale}${path}`;
    languages[locale] = `${siteUrl}${localePath}`;
  }

  // x-default points to the default locale version
  languages["x-default"] = `${siteUrl}${path}`;

  return {
    canonical: `${siteUrl}${path}`,
    languages,
  };
}

/**
 * Generate full URLs for sitemap alternateRefs.
 */
export function generateSitemapAlternates(path: string) {
  return locales.map((locale) => ({
    href:
      locale === defaultLocale
        ? `${siteUrl}${path}`
        : `${siteUrl}/${locale}${path}`,
    hreflang: locale,
  }));
}
