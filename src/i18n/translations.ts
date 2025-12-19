/**
 * Translation manifest - tracks which tools have complete translations.
 *
 * When you finish translating a tool, add its slug to the locale array.
 * This controls whether the "translation in progress" notice is shown.
 *
 * Note: hreflang SEO is NOT affected—all locales get hreflang for all tools.
 * English is always considered complete.
 */

export const translatedTools: Record<string, string[]> = {
  // Spanish translations
  es: ["dice-roller"],

  // Japanese translations
  ja: ["dice-roller"],
};

/**
 * Check if a tool has a complete translation for a given locale.
 */
export function isToolTranslated(locale: string, toolSlug: string): boolean {
  // English is always complete
  if (locale === "en") return true;

  return translatedTools[locale]?.includes(toolSlug) ?? false;
}

/**
 * Get all locales that have a complete translation for a tool.
 */
export function getTranslatedLocales(toolSlug: string): string[] {
  const locales = ["en"]; // English always included

  for (const [locale, tools] of Object.entries(translatedTools)) {
    if (tools.includes(toolSlug)) {
      locales.push(locale);
    }
  }

  return locales;
}
