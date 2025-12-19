"use client";

import { useTranslations } from "next-intl";

interface Props {
  error: Error;
  reset: () => void;
}

export default function ToolError({ reset }: Props) {
  const t = useTranslations("common");

  return (
    <main
      className="max-w-4xl mx-auto px-4 py-8 text-center"
      style={{ color: "var(--foreground)" }}
    >
      <h1 className="text-2xl font-bold mb-4">{t("error")}</h1>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md transition-colors focus-ring"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        {t("tryAgain")}
      </button>
    </main>
  );
}
