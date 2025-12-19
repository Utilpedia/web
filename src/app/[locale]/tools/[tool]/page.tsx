import { notFound } from "next/navigation";
import {
  getToolBySlug,
  getAllToolSlugs,
} from "@/features/tool-registry/registry";
import { PlaceholderTool } from "@/components/tools/PlaceholderTool";
import { TranslationNotice } from "@/components/TranslationNotice";
import { locales } from "@/i18n/config";
import { generateAlternates } from "@/lib/seo";
import { getTranslatedTool } from "@/lib/tool-i18n";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; tool: string }>;
}

/**
 * Generate static params for all locale + tool combinations.
 */
export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  const params = [];

  for (const locale of locales) {
    for (const tool of slugs) {
      params.push({ locale, tool });
    }
  }

  return params;
}

/**
 * Generate metadata for tool pages from registry.
 * Includes hreflang alternates for all supported locales.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tool: slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { name, description } = await getTranslatedTool(tool, locale);
  const path = `/tools/${slug}`;

  return {
    title: name,
    description: description,
    keywords: tool.keywords,
    alternates: generateAlternates(path),
  };
}

export default async function ToolPage({ params }: Props) {
  const { locale, tool: slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const { name, description } = await getTranslatedTool(tool, locale);

  // Use placeholder if no component is implemented yet
  if (!tool.component) {
    return (
      <>
        <TranslationNotice toolSlug={slug} />
        <PlaceholderTool name={name} description={description} />
      </>
    );
  }

  const ToolComponent = tool.component;
  return (
    <>
      <TranslationNotice toolSlug={slug} />
      <ToolComponent />
    </>
  );
}
