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

## Documentation

| Guide                                                | Description                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| [Adding Tools](docs/ADDING_TOOLS.md)                 | How to add new tools, stdlib integration, component patterns |
| [Internationalization](docs/INTERNATIONALIZATION.md) | Multi-language support, translations, SEO strategy           |

### Quick Reference

**Add a tool:**

1. Register in `src/features/tool-registry/registry.ts`
2. Add translations to `src/messages/en.json`
3. Create component in `src/components/tools/`

**Add a language:**

1. Add locale to `src/i18n/config.ts`
2. Create `src/messages/{locale}.json`
3. Add to `next-sitemap.config.mjs` locales array
4. Add display name to `src/components/layout/TopBar.tsx`

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
