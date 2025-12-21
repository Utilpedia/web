import type { Tool } from "./types";
import { DiceTool } from "@/components/tools/dice/DiceTool";
import { SimpleInterestTool } from "@/components/tools/simple-interest/SimpleInterestTool";
import { PantoneConverterTool } from "@/components/tools/pantone-converter/PantoneConverterTool";

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
