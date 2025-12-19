"use client";

import { useLocale } from "next-intl";
import { locales, type Locale } from "@/i18n/config";
import { useLocaleSwitcher } from "@/lib/locale";
import packageJson from "../../../package.json";

const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
};

export function TopBar() {
  const currentLocale = useLocale();
  const { switchLocale } = useLocaleSwitcher();

  return (
    <div
      className="w-full text-xs"
      style={{
        backgroundColor: "var(--background-muted)",
        borderBottom: "1px solid var(--border-muted)",
      }}
    >
      <div className="content-container flex items-center justify-between py-1.5 gap-4">
        {/* Version */}
        <span style={{ color: "var(--foreground-subtle)" }}>
          v{packageJson.version}
        </span>
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="sr-only">
            Language
          </label>
          <select
            id="language-select"
            value={currentLocale}
            onChange={(e) => switchLocale(e.target.value as Locale)}
            className="bg-transparent cursor-pointer focus-ring rounded px-1"
            style={{
              color: "var(--foreground-muted)",
              border: "none",
            }}
          >
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {localeNames[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
