import type { Tool } from "./types";
import { DiceTool } from "@/components/tools/dice/DiceTool";
import { SimpleInterestTool } from "@/components/tools/simple-interest/SimpleInterestTool";
import { PantoneConverterTool } from "@/components/tools/pantone-converter/PantoneConverterTool";
import * as ColorConverters from "@/components/tools/color-converter";

/**
 * Format display names for registry entries.
 */
const formatNames: Record<string, string> = {
  hex: "HEX",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  hsv: "HSV",
  hsva: "HSVA",
  cmyk: "CMYK",
  lab: "LAB",
  lch: "LCH",
  oklch: "OKLCH",
};

const formats = [
  "hex",
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hsv",
  "hsva",
  "cmyk",
  "lab",
  "lch",
  "oklch",
];

/**
 * Generate color converter tool entries programmatically.
 */
function generateColorConverterTools(): Tool[] {
  const tools: Tool[] = [];

  for (const from of formats) {
    for (const to of formats) {
      if (from === to) continue;

      const fromName = formatNames[from];
      const toName = formatNames[to];
      const slug = `${from}-to-${to}`;

      // Build component name: HexToRgbTool
      const componentName = `${from.charAt(0).toUpperCase() + from.slice(1)}To${to.charAt(0).toUpperCase() + to.slice(1)}Tool`;

      // Get the component from the exports
      const component = (ColorConverters as Record<string, unknown>)[
        componentName
      ] as Tool["component"];

      if (!component) {
        console.warn(`Missing component: ${componentName}`);
        continue;
      }

      tools.push({
        slug,
        name: `${fromName} to ${toName} Converter`,
        description: `Convert ${fromName} color codes to ${toName} values`,
        category: "image",
        component,
        componentPath: "color-converter",
        keywords: [from, to, "color", "convert"],
      });
    }
  }

  return tools;
}

/**
 * Central registry of all available tools.
 * This is the source of truth for tool metadata AND components.
 *
 * Only implemented tools are included here.
 */
export const tools: Tool[] = [
  {
    slug: "dice-roller",
    name: "Dice Roller",
    description: "Roll virtual dice for tabletop games and RPGs",
    category: "math",
    component: DiceTool,
    componentPath: "dice",
    keywords: ["dice", "roll", "random", "d20", "tabletop", "rpg"],
  },
  {
    slug: "simple-interest",
    name: "Simple Interest Calculator",
    description: "Calculate simple interest on savings or loans",
    category: "math",
    component: SimpleInterestTool,
    componentPath: "simple-interest",
    keywords: [
      "interest",
      "simple",
      "savings",
      "loan",
      "calculator",
      "finance",
    ],
  },
  {
    slug: "pantone-converter",
    name: "Pantone Converter",
    description: "Convert Pantone colors to HEX, RGB, and CMYK",
    category: "image",
    component: PantoneConverterTool,
    componentPath: "pantone-converter",
    keywords: ["pantone", "pms", "color", "hex", "rgb", "cmyk", "convert"],
  },
  // All color converter combinations (110 tools)
  ...generateColorConverterTools(),
  {
    slug: "placeholder-example",
    name: "Placeholder Example",
    description:
      "This is a placeholder tool to demonstrate the 'Coming Soon' state",
    category: "dev",
    keywords: ["example", "placeholder", "demo"],
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
