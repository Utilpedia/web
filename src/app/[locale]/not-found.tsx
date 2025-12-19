import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ color: "var(--foreground)" }}
    >
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8" style={{ color: "var(--foreground-muted)" }}>
        {t("notFound")}
      </p>

      <Link
        href="/"
        className="px-6 py-3 font-medium rounded-md transition-colors focus-ring"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        {t("goHome")}
      </Link>
    </main>
  );
}
