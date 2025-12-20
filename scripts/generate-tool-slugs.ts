/**
 * Generates tool-slugs.json from the registry.
 * Run with: bun scripts/generate-tool-slugs.ts
 *
 * This ensures the JSON file stays in sync with registry.ts,
 * which is the single source of truth for tool definitions.
 */

import { writeFileSync } from "fs";
import { tools } from "../src/features/tool-registry/registry";

const slugs = tools.map((tool) => tool.slug);

writeFileSync(
  "./src/features/tool-registry/tool-slugs.json",
  JSON.stringify(slugs, null, 2) + "\n"
);

console.log(`✅ Generated tool-slugs.json with ${slugs.length} tools`);
