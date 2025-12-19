import { getTranslations } from "next-intl/server";
import type { Tool } from "@/features/tool-registry/types";

/**
 * Get translated name and description for a tool.
 * Falls back to registry values if no translation exists.
 */
export async function getTranslatedTool(
  tool: Tool,
  locale?: string
): Promise<{ name: string; description: string }> {
  try {
    const t = locale
      ? await getTranslations({ locale, namespace: "tools" })
      : await getTranslations("tools");

    // Try to get translated values, fall back to registry
    const name = t.has(`${tool.slug}.name`)
      ? t(`${tool.slug}.name`)
      : tool.name;

    const description = t.has(`${tool.slug}.description`)
      ? t(`${tool.slug}.description`)
      : tool.description;

    return { name, description };
  } catch {
    // If translations fail, use registry values
    return { name: tool.name, description: tool.description };
  }
}

/**
 * Get translated tools list.
 */
export async function getTranslatedTools(
  tools: Tool[],
  locale?: string
): Promise<
  Array<Tool & { translatedName: string; translatedDescription: string }>
> {
  const translatedTools = await Promise.all(
    tools.map(async (tool) => {
      const { name, description } = await getTranslatedTool(tool, locale);
      return {
        ...tool,
        translatedName: name,
        translatedDescription: description,
      };
    })
  );

  return translatedTools;
}
