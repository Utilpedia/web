import { Header } from "@/components/layout/Header";
import { generateAlternates } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { ProgressLink } from "@/components/utility";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: generateAlternates("/"),
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="min-h-screen">
      <Header />

      <main className="content-container max-w-4xl py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 text-foreground">
          {t("title")}
        </h1>
        <p className="text-xl mb-8 text-foreground-muted">{t("subtitle")}</p>

        <ProgressLink
          href="/tools"
          className="inline-block px-8 py-3 font-medium tracking-wide uppercase transition-colors focus-ring bg-primary text-primary-foreground"
        >
          {t("browseTools")}
        </ProgressLink>
      </main>
    </div>
  );
}
