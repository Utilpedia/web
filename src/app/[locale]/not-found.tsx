import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  // Determine the home link based on locale
  const homeHref = locale === "en" ? "/" : `/${locale}`;

  return (
    <>
      <Header />
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 py-24"
        style={{ color: "var(--foreground)" }}
      >
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p
          className="text-xl mb-8"
          style={{ color: "var(--foreground-muted)" }}
        >
          {t("notFound")}
        </p>

        <Link
          href={homeHref}
          className="px-6 py-3 font-medium rounded-md transition-colors focus-ring"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {t("goHome")}
        </Link>
      </main>
    </>
  );
}
