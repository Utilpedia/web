import type { Tool } from "./types";

/**
 * Central registry of all available tools.
 * This is the source of truth for tool metadata.
 */
export const tools: Tool[] = [
  {
    slug: "dice-roller",
    nameKey: "tools.dice-roller.name",
    descriptionKey: "tools.dice-roller.description",
    category: "math",
    keywords: ["dice", "roll", "random", "d20", "tabletop", "rpg"],
  },
];

/**
 * Get a tool by its slug.
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

/**
 * Get all tool slugs for static generation.
 */
export function getAllToolSlugs(): string[] {
  return tools.map((tool) => tool.slug);
}

/**
 * Get tools by category.
 */
export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
