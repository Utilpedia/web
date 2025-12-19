"use client";

import { useLocale, useTranslations } from "next-intl";
import { isToolTranslated } from "@/i18n/translations";

interface TranslationNoticeProps {
  /** The tool slug to check translation status for */
  toolSlug: string;
}

/**
 * Shows a notice when viewing content that isn't fully translated.
 * Uses the translation manifest to determine if the current locale
 * has a complete translation for this tool.
 */
export function TranslationNotice({ toolSlug }: TranslationNoticeProps) {
  const locale = useLocale();
  const t = useTranslations("common");

  // Check if this tool has a translation for the current locale
  const isTranslated = isToolTranslated(locale, toolSlug);

  if (isTranslated) {
    return null;
  }

  return (
    <div
      className="mb-4 px-4 py-3 rounded-md text-sm"
      style={{
        backgroundColor: "var(--background-muted)",
        borderLeft: "4px solid var(--primary)",
        color: "var(--foreground-muted)",
      }}
      role="status"
    >
      <p>
        <strong>{t("translationInProgress")}</strong>
        {" — "}
        {t("translationNotice")}
      </p>
    </div>
  );
}
