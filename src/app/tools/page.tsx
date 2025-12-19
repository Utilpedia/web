import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { tools } from "@/features/tool-registry/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse all free online tools available on Utilpedia.",
};

export default async function ToolsPage() {
  const t = await getTranslations();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("common.allTools")}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{t(tool.nameKey)}</h2>
            <p className="text-gray-600">{t(tool.descriptionKey)}</p>
            <span className="inline-block mt-3 text-sm text-blue-600 capitalize">
              {tool.category}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
