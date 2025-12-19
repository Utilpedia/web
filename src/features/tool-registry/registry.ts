import type { Tool } from "./types";
import { DiceTool } from "@/components/tools/dice/DiceTool";

/**
 * Central registry of all available tools.
 * This is the source of truth for tool metadata AND components.
 */
export const tools: Tool[] = [
  {
    slug: "dice-roller",
    name: "Dice Roller",
    description: "Roll virtual dice for tabletop games and RPGs",
    category: "math",
    component: DiceTool,
    keywords: ["dice", "roll", "random", "d20", "tabletop", "rpg"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages easily",
    category: "math",
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    description: "Calculate tips for restaurants and services",
    category: "math",
  },
  {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    description: "Calculate sales tax on purchases",
    category: "math",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    category: "math",
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    description: "Calculate loan payments and interest",
    category: "math",
  },
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    description: "Calculate mortgage payments",
    category: "math",
  },
  {
    slug: "compound-interest",
    name: "Compound Interest",
    description: "Calculate compound interest over time",
    category: "math",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units",
    category: "math",
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, and Kelvin",
    category: "math",
  },
  {
    slug: "length-converter",
    name: "Length Converter",
    description: "Convert between length units",
    category: "math",
  },
  {
    slug: "weight-converter",
    name: "Weight Converter",
    description: "Convert between weight units",
    category: "math",
  },
  {
    slug: "volume-converter",
    name: "Volume Converter",
    description: "Convert between volume units",
    category: "math",
  },
  {
    slug: "area-converter",
    name: "Area Converter",
    description: "Convert between area units",
    category: "math",
  },
  {
    slug: "speed-converter",
    name: "Speed Converter",
    description: "Convert between speed units",
    category: "math",
  },
  {
    slug: "time-converter",
    name: "Time Converter",
    description: "Convert between time units",
    category: "math",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick and convert colors",
    category: "image",
  },
  {
    slug: "hex-to-rgb",
    name: "Hex to RGB",
    description: "Convert hex colors to RGB",
    category: "image",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images in your browser",
    category: "image",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress images without losing quality",
    category: "image",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description: "Crop images to any size",
    category: "image",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for any URL or text",
    category: "image",
  },
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate barcodes for products",
    category: "image",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, and sentences",
    category: "text",
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    description: "Count characters in text",
    category: "text",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text between cases",
    category: "text",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    category: "text",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords",
    category: "text",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique identifiers",
    category: "dev",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes",
    category: "dev",
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode and decode Base64",
    category: "dev",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Encode and decode URLs",
    category: "dev",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and beautify JSON",
    category: "dev",
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON syntax",
    category: "dev",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions",
    category: "dev",
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    description: "Compare two texts",
    category: "text",
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    description: "Preview Markdown in real-time",
    category: "text",
  },
  {
    slug: "html-to-markdown",
    name: "HTML to Markdown",
    description: "Convert HTML to Markdown",
    category: "text",
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV files to JSON",
    category: "files",
  },
  {
    slug: "json-to-csv",
    name: "JSON to CSV",
    description: "Convert JSON to CSV",
    category: "files",
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Merge multiple PDFs into one",
    category: "files",
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    description: "Split PDFs into separate pages",
    category: "files",
  },
  {
    slug: "file-hash-checker",
    name: "File Hash Checker",
    description: "Verify file integrity with hashes",
    category: "files",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to dates",
    category: "dev",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate age from birthdate",
    category: "math",
  },
  {
    slug: "date-difference",
    name: "Date Difference",
    description: "Calculate days between dates",
    category: "math",
  },
  {
    slug: "countdown-timer",
    name: "Countdown Timer",
    description: "Count down to any date",
    category: "math",
  },
  {
    slug: "stopwatch",
    name: "Stopwatch",
    description: "Simple stopwatch timer",
    category: "math",
  },
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    description: "Convert times between timezones",
    category: "math",
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
