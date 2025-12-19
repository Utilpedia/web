import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getToolBySlug,
  getAllToolSlugs,
} from "@/features/tool-registry/registry";
import { DiceTool } from "@/components/tools/dice/DiceTool";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tool: string }>;
}

/**
 * Generate static params for all known tools.
 */
export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ tool: slug }));
}

/**
 * Generate metadata for tool pages from registry.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const t = await getTranslations();

  if (!tool) {
    return {
      title: "Tool Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: t(tool.nameKey),
    description: t(tool.descriptionKey),
    keywords: tool.keywords,
  };
}

/**
 * Map tool slugs to their components.
 */
const toolComponents: Record<string, React.ComponentType> = {
  "dice-roller": DiceTool,
};

export default async function ToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const t = await getTranslations();

  if (!tool) {
    notFound();
  }

  const ToolComponent = toolComponents[slug];

  if (!ToolComponent) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t(tool.nameKey)}</h1>
      <p className="text-gray-600 mb-8">{t(tool.descriptionKey)}</p>

      <ToolComponent />
    </main>
  );
}
