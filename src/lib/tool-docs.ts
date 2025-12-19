import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import fs from "fs/promises";
import path from "path";
import { getToolBySlug } from "@/features/tool-registry/registry";

/**
 * Result of loading tool documentation.
 */
export interface ToolDocsResult {
  /** The rendered HTML content */
  html: string;
  /** Whether this is a fallback to English (not the requested locale) */
  isFallback: boolean;
}

/**
 * Get the documentation for a tool in the specified locale.
 *
 * Fallback chain: locale.md -> en.md -> null
 *
 * @param toolSlug - The tool's slug (e.g., "dice-roller")
 * @param locale - The requested locale (e.g., "es")
 * @returns The rendered HTML and fallback status, or null if no docs exist
 */
export async function getToolDocs(
  toolSlug: string,
  locale: string
): Promise<ToolDocsResult | null> {
  const tool = getToolBySlug(toolSlug);
  if (!tool?.componentPath) {
    return null;
  }

  const docsDir = path.join(
    process.cwd(),
    "src/components/tools",
    tool.componentPath,
    "docs"
  );

  // Try locale first, then fall back to English
  const localesToTry = locale === "en" ? ["en"] : [locale, "en"];

  for (const tryLocale of localesToTry) {
    const filePath = path.join(docsDir, `${tryLocale}.md`);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const result = await remark().use(remarkGfm).use(html).process(content);
      return {
        html: result.toString(),
        isFallback: tryLocale !== locale,
      };
    } catch {
      // File doesn't exist, try next locale
      continue;
    }
  }

  return null;
}
