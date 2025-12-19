"use client";

import { useLocale } from "next-intl";
import { locales, type Locale } from "@/i18n/config";
import { useLocaleSwitcher } from "@/lib/locale";

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
      <div className="content-container flex items-center justify-end py-1.5 gap-4">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="sr-only">
            Language
          </label>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--foreground-muted)" }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
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
