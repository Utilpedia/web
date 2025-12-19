# Utilpedia Web Application

A Next.js web application providing free online tools for everyone.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0 or later
- Node.js 18+ (for some tooling)

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
```

This will also generate the sitemap via `next-sitemap`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/           # Locale-prefixed routes
│   │   ├── tools/          # Tools section
│   │   │   └── [tool]/     # Individual tool pages
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── brand/              # Logo, Wordmark SVGs
│   ├── layout/             # Header, Sidebar, MobileNav
│   └── tools/              # Tool components (e.g., DiceTool)
├── config/                 # App configuration (navigation)
├── features/
│   └── tool-registry/      # Central tool definitions
├── i18n/                   # Internationalization config
├── lib/                    # Utilities (SEO, locale, tool-i18n)
├── messages/               # Translation files (en.json, es.json, ja.json)
└── test/                   # Test setup
```

## Adding a New Tool

1. **Register the tool** in `src/features/tool-registry/registry.ts`:

```typescript
{
  slug: "my-new-tool",
  name: "My New Tool",
  description: "Description of the tool",
  category: "math", // or "text", "image", "files", "dev"
  component: MyNewTool, // optional, omit for placeholder
  keywords: ["keyword1", "keyword2"],
}
```

2. **Create the component** in `src/components/tools/my-new-tool/MyNewTool.tsx`

3. **Add translations** to each message file (`en.json`, `es.json`, `ja.json`):

```json
"tools": {
  "my-new-tool": {
    "name": "My New Tool",
    "description": "Description of the tool"
  }
}
```

4. **Update tool-slugs.json** for sitemap generation:

```bash
bun run build  # Regenerates sitemap with new tool
```

## Adding a New Language

1. **Add locale to config** in `src/i18n/config.ts`:

```typescript
export const locales = ["en", "es", "ja", "fr"] as const;
```

2. **Create message file** at `src/messages/fr.json` (copy from `en.json`)

3. **Update sitemap config** in `next-sitemap.config.mjs`:

```javascript
const locales = ["en", "es", "ja", "fr"];
```

4. **Add to language picker** in `src/components/layout/TopBar.tsx`:

```typescript
const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
  fr: "Français",
};
```

## Environment Variables

| Variable   | Description                          | Default                 |
| ---------- | ------------------------------------ | ----------------------- |
| `SITE_URL` | Base URL for canonical/hreflang tags | `https://utilpedia.org` |

## Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `bun dev`            | Start development server   |
| `bun run build`      | Production build + sitemap |
| `bun run lint`       | Run ESLint                 |
| `bun run format`     | Format with Prettier       |
| `bun run typecheck`  | TypeScript type checking   |
| `bun run test`       | Run tests with Vitest      |
| `bun run test:watch` | Run tests in watch mode    |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl
- **Validation:** Valibot
- **Testing:** Vitest + Testing Library
- **Utilities:** @utilpedia/stdlib

## License

MIT
