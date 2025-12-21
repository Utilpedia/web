import { tools } from "@/features/tool-registry/registry";
import { generateAlternates } from "@/lib/seo";
import { getTranslatedTools } from "@/lib/tool-i18n";
import { getTranslations } from "next-intl/server";
import { ProgressLink } from "@/components/utility";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("allTools"),
    description: "Browse all free online tools available on Utilpedia.",
    alternates: generateAlternates("/tools"),
  };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const translatedTools = await getTranslatedTools(tools, locale);

  return (
    <>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--foreground)" }}
      >
        {t("allTools")}
      </h1>

      <div className="grid gap-4">
        {translatedTools.map((tool) => (
          <ProgressLink
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block p-4 transition-colors focus-ring"
            style={{ border: "1px solid var(--border)" }}
          >
            <h2
              className="text-xl font-bold mb-1"
              style={{ color: "var(--foreground)" }}
            >
              {tool.translatedName}
            </h2>
            <p style={{ color: "var(--foreground-muted)" }}>
              {tool.translatedDescription}
            </p>
          </ProgressLink>
        ))}
      </div>
    </>
  );
}
