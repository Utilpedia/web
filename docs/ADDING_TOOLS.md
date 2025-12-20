# Adding New Tools

This guide explains how to add new tools to Utilpedia webapp, including the relationship between the webapp and the stdlib (standard library).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         WEBAPP                                   │
│  src/components/tools/dice/DiceTool.tsx                         │
│       ↓ imports                                                 │
│  import { dice } from "@utilpedia/math/core"                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         STDLIB                                   │
│  packages/math/src/core/dice.ts                                 │
│       Pure logic: no UI, no React, no DOM                       │
└─────────────────────────────────────────────────────────────────┘
```

**Separation of concerns:**

- **stdlib**: Pure TypeScript logic (reusable in CLI, servers, other apps)
- **webapp**: React UI components that consume stdlib functions

---

## Quick Start Checklist

### Adding a Placeholder Tool (UI not implemented)

1. Add entry to `src/features/tool-registry/registry.ts`
2. Add translations to `src/messages/en.json`
3. Run `bun run build` (generates sitemap with new tool)
4. Done! The placeholder component renders automatically

### Adding a Full Tool (with implementation)

1. **stdlib**: Implement core logic (if needed)
2. **webapp**: Create React component
3. **registry**: Register tool with component
4. **i18n**: Add translations
5. **docs**: Add Markdown documentation

---

## Step-by-Step: Full Tool Implementation

### 1. Implement Core Logic in stdlib (if needed)

If your tool needs reusable logic, add it to the stdlib first.

**Create the function:**

````typescript
// stdlib/packages/math/src/core/percentage.ts

/**
 * Calculate the percentage of a value.
 *
 * @param value - The base value
 * @param percent - The percentage to calculate
 * @returns The calculated percentage
 *
 * @example
 * ```ts
 * percentOf(200, 15);  // 30 (15% of 200)
 * ```
 *
 * @public
 */
export function percentOf(value: number, percent: number): number {
  return (value * percent) / 100;
}
````

**Export from the entrypoint:**

```typescript
// stdlib/packages/math/src/core/index.ts
export { percentOf } from "./percentage";
```

**Add tests:**

```typescript
// stdlib/packages/math/test/core/percentage.test.ts
import { describe, it, expect } from "vitest";
import { percentOf } from "../../src/core/percentage";

describe("percentOf", () => {
  it("calculates 15% of 200", () => {
    expect(percentOf(200, 15)).toBe(30);
  });
});
```

**Build stdlib:**

```bash
cd stdlib && bun run build
```

### 2. Create the React Component

**Create the component directory:**

```
src/components/tools/percentage/
├── PercentageTool.tsx      # Main component
├── PercentageTool.test.tsx # Tests
└── docs/
    ├── en.md               # English documentation
    ├── es.md               # Spanish documentation (optional)
    └── ja.md               # Japanese documentation (optional)
```

**Implement the component:**

```tsx
// src/components/tools/percentage/PercentageTool.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { percentOf } from "@utilpedia/math/core";

export function PercentageTool() {
  const t = useTranslations("percentageTool");

  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const v = parseFloat(value);
    const p = parseFloat(percent);
    if (!isNaN(v) && !isNaN(p)) {
      setResult(percentOf(v, p));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
        {t("title")}
      </h1>

      {/* Input fields, calculate button, result display */}
      {/* Use CSS variables for theming: var(--foreground), var(--background), etc. */}
    </div>
  );
}
```

### 3. Register the Tool

**Add to registry:**

```typescript
// src/features/tool-registry/registry.ts
import { PercentageTool } from "@/components/tools/percentage/PercentageTool";

export const tools: Tool[] = [
  // ... existing tools
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages easily",
    category: "math",
    component: PercentageTool, // ← Add component
    componentPath: "percentage", // ← Add for docs lookup
    keywords: ["percentage", "percent", "calculate", "math"],
  },
];
```

> **Note:** `tool-slugs.json` is auto-generated from the registry during `postbuild`. No manual update needed.

### 4. Add Translations

**English (required):**

```json
// src/messages/en.json
{
  "tools": {
    "percentage-calculator": {
      "name": "Percentage Calculator",
      "description": "Calculate percentages easily"
    }
  },
  "percentageTool": {
    "title": "Percentage Calculator",
    "value": "Value",
    "percent": "Percentage",
    "result": "Result",
    "calculate": "Calculate"
  }
}
```

**Other locales (optional):**

```json
// src/messages/es.json
{
  "tools": {
    "percentage-calculator": {
      "name": "Calculadora de Porcentajes",
      "description": "Calcula porcentajes fácilmente"
    }
  },
  "percentageTool": {
    "title": "Calculadora de Porcentajes",
    "value": "Valor",
    "percent": "Porcentaje",
    "result": "Resultado",
    "calculate": "Calcular"
  }
}
```

**Mark translation complete:**

```typescript
// src/i18n/translations.ts
export const translatedTools: Record<string, string[]> = {
  es: ["dice-roller", "percentage-calculator"], // ← Add slug
  ja: ["dice-roller"],
};
```

### 5. Add Documentation (Optional)

Create Markdown files in `docs/` folder:

```markdown
<!-- src/components/tools/percentage/docs/en.md -->

## How to Use

Enter a value and percentage to calculate the result.

### Examples

| Value | Percentage | Result |
| ----- | ---------- | ------ |
| 200   | 15%        | 30     |
| 50    | 20%        | 10     |
| 100   | 7.5%       | 7.5    |

### Formula

The percentage is calculated as:
```

result = value × (percentage / 100)

```

```

---

## Tool Categories

Tools are organized into categories for navigation:

| Category | Description              | Examples                       |
| -------- | ------------------------ | ------------------------------ |
| `math`   | Calculations, converters | Dice Roller, BMI Calculator    |
| `text`   | Text manipulation        | Word Counter, Case Converter   |
| `image`  | Image processing         | Image Resizer, Color Picker    |
| `files`  | File operations          | PDF Merger, CSV to JSON        |
| `dev`    | Developer utilities      | JSON Formatter, UUID Generator |

```typescript
export type ToolCategory = "math" | "text" | "image" | "files" | "dev";
```

---

## stdlib Integration

### Package Structure

```
stdlib/packages/math/
├── src/
│   ├── core/          # Isomorphic (works everywhere)
│   │   ├── dice.ts
│   │   ├── clamp.ts
│   │   └── index.ts
│   ├── browser/       # Browser-only (DOM APIs)
│   │   └── index.ts
│   └── node/          # Node-only (crypto, fs)
│       ├── randomInt.ts
│       └── index.ts
└── dist/              # Built output
```

### Import Patterns

```typescript
// ✅ Correct: explicit entrypoint
import { dice } from "@utilpedia/math/core";
import { randomInt } from "@utilpedia/math/node";

// ❌ Wrong: bare import
import { dice } from "@utilpedia/math";
```

### When to Use stdlib

| Scenario                     | Where to Put Logic |
| ---------------------------- | ------------------ |
| Pure calculation (no UI)     | stdlib `/core`     |
| Uses DOM APIs (Canvas, etc.) | stdlib `/browser`  |
| Uses Node APIs (crypto, fs)  | stdlib `/node`     |
| React state/hooks            | webapp component   |
| UI layout/styling            | webapp component   |

### Webapp Dependency

The webapp imports stdlib from GitHub:

```json
// webapp/package.json
{
  "dependencies": {
    "@utilpedia/stdlib": "github:Utilpedia/stdlib#v0.1.0"
  }
}
```

To update after stdlib changes:

```bash
cd webapp
bun install @utilpedia/stdlib@github:Utilpedia/stdlib#v0.2.0
```

---

## Component Conventions

### Directory Structure

```
src/components/tools/{name}/
├── {Name}Tool.tsx           # Main component (PascalCase)
├── {Name}Tool.test.tsx      # Tests
├── index.ts                 # Barrel export (optional)
└── docs/
    ├── en.md                # English docs
    ├── es.md                # Spanish docs
    └── ja.md                # Japanese docs
```

### Component Requirements

1. **Client component**: Add `"use client"` directive
2. **Translations**: Use `useTranslations()` for all text
3. **Theming**: Use CSS variables (`var(--foreground)`, etc.)
4. **Accessibility**: Include ARIA labels and keyboard support
5. **Validation**: Use `valibot` for input validation

### Available CSS Variables

```css
/* Colors */
--foreground          /* Primary text */
--foreground-muted    /* Secondary text */
--foreground-subtle   /* Hint text */
--background          /* Main background */
--background-muted    /* Card background */
--border              /* Borders */
--primary             /* Primary button */
--primary-foreground  /* Primary button text */
--destructive         /* Error color */

/* Input states */
--input-border        /* Normal input border */
--input-border-error  /* Error input border */
```

---

## Testing

### Component Tests

```tsx
// src/components/tools/percentage/PercentageTool.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PercentageTool } from "./PercentageTool";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PercentageTool", () => {
  it("renders the title", () => {
    render(<PercentageTool />);
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("calculates percentage correctly", async () => {
    const user = userEvent.setup();
    render(<PercentageTool />);

    await user.type(screen.getByLabelText("value"), "200");
    await user.type(screen.getByLabelText("percent"), "15");
    await user.click(screen.getByRole("button", { name: "calculate" }));

    expect(screen.getByText("30")).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# Specific file
bun run test src/components/tools/percentage/PercentageTool.test.tsx
```

---

## File Reference

| File                                         | Purpose                                        |
| -------------------------------------------- | ---------------------------------------------- |
| `src/features/tool-registry/registry.ts`     | Central tool registry (single source of truth) |
| `src/features/tool-registry/types.ts`        | Tool TypeScript interface                      |
| `src/features/tool-registry/tool-slugs.json` | Auto-generated slugs for sitemap               |
| `scripts/generate-tool-slugs.ts`             | Generates tool-slugs.json from registry        |
| `src/components/tools/`                      | Tool component directory                       |
| `src/components/tools/PlaceholderTool.tsx`   | Shown for unimplemented tools                  |
| `src/messages/*.json`                        | UI translations                                |
| `src/i18n/translations.ts`                   | Translation completion manifest                |
| `src/lib/tool-docs.ts`                       | Markdown documentation loader                  |
| `src/lib/tool-i18n.ts`                       | Tool name/description translation helper       |

---

## Common Patterns

### Input Validation with Valibot

```typescript
import * as v from "valibot";

const schema = v.pipe(
  v.string(),
  v.transform((val) => parseFloat(val)),
  v.number("Must be a number"),
  v.minValue(0, "Must be positive")
);

const result = v.safeParse(schema, inputValue);
if (result.success) {
  // Use result.output
} else {
  // Show result.issues[0]?.message
}
```

### Accessible Form Fields

```tsx
<div className="space-y-2">
  <label htmlFor="value" className="block text-lg font-bold">
    {t("value")}
  </label>
  <input
    id="value"
    type="number"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    aria-invalid={error ? "true" : "false"}
    aria-describedby={error ? "value-error" : undefined}
  />
  {error && (
    <p id="value-error" role="alert" className="text-sm text-red-500">
      {error}
    </p>
  )}
</div>
```

### Result Display with Live Region

```tsx
<output id="result" aria-live="polite">
  {result !== null && result}
</output>
```
