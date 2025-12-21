import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { ProgressLink } from "@/components/utility";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  // Determine the home link based on locale
  const homeHref = locale === "en" ? "/" : `/${locale}`;

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-foreground">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8 text-foreground-muted">{t("notFound")}</p>

        <ProgressLink
          href={homeHref}
          className="px-6 py-3 font-medium rounded-md transition-colors focus-ring bg-primary text-primary-foreground"
        >
          {t("goHome")}
        </ProgressLink>
      </main>
    </>
  );
}
