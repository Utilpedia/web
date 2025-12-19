/**
 * Translation manifest - tracks which tools have complete translations.
 *
 * When you add a translation for a tool, add the tool slug to the
 * corresponding locale array. This controls:
 * - Whether the "translation in progress" notice is shown
 * - Which pages get hreflang tags for that locale
 *
 * English is always considered complete.
 */

export const translatedTools: Record<string, string[]> = {
  // Spanish translations
  es: [
    // Add tool slugs here as they're fully translated:
    // "dice-roller",
  ],

  // Japanese translations
  ja: [
    // Add tool slugs here as they're fully translated:
    // "dice-roller",
  ],
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
