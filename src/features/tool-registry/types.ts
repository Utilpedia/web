import type { ComponentType } from "react";

/**
 * Tool category for grouping related tools.
 */
export type ToolCategory = "math" | "text" | "image" | "files" | "dev";

/**
 * Tool definition in the registry.
 *
 * Translations are stored in message files under the "tools" namespace
 * using the pattern: tools.{slug}.name and tools.{slug}.description
 */
export interface Tool {
  /** URL-safe identifier (e.g., "dice-roller") */
  slug: string;

  /** Display name (English default, used as fallback) */
  name: string;

  /** Short description (English default, used as fallback) */
  description: string;

  /** Tool category for grouping */
  category: ToolCategory;

  /** The React component for this tool (undefined = placeholder) */
  component?: ComponentType;

  /** Optional keywords for SEO and search */
  keywords?: string[];
}
