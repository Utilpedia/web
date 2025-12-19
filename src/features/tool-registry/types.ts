/**
 * Tool category for grouping related tools.
 */
export type ToolCategory = "math" | "text" | "image" | "files" | "dev";

/**
 * Tool definition in the registry.
 */
export interface Tool {
  /** URL-safe identifier (e.g., "dice-roller") */
  slug: string;

  /** Translation key for the tool name */
  nameKey: string;

  /** Translation key for the tool description */
  descriptionKey: string;

  /** Tool category for grouping */
  category: ToolCategory;

  /** Optional keywords for search */
  keywords?: string[];
}
