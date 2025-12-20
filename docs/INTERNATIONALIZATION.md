# Internationalization (i18n) Strategy

Utilpedia supports multiple languages to maximize global discovery and user experience. This document explains the architecture, workflow, and SEO considerations.

Configuration: [`src/i18n/config.ts`](../src/i18n/config.ts)

---

## URL Structure

We use **locale-prefixed URLs** for non-English content:

| Locale            | Home                | Tool Page                            |
| ----------------- | ------------------- | ------------------------------------ |
| English (default) | `utilpedia.org/`    | `utilpedia.org/tools/dice-roller`    |
| Spanish           | `utilpedia.org/es/` | `utilpedia.org/es/tools/dice-roller` |
| Japanese          | `utilpedia.org/ja/` | `utilpedia.org/ja/tools/dice-roller` |

**Why this approach?**

- Google recommends locale-prefixed or subdomain URLs for international SEO
- English has no prefix (cleaner URLs for default language)
- All pages are statically generated for each locale

---

## Translation Files

UI translations are stored as JSON in `src/messages/`:

```
src/messages/
├── en.json   # English (complete, canonical)
├── es.json   # Spanish
└── ja.json   # Japanese
```

### Structure

```json
{
  "common": {
    "loading": "Loading...",
    "notFound": "Page not found",
    "translationInProgress": "Translation in progress..."
  },
  "nav": {
    "home": "Home",
    "tools": "Tools"
  },
  "home": {
    "title": "The World's Toolbox",
    "subtitle": "Free online utilities..."
  },
  "tools": {
    "dice-roller": {
      "name": "Dice Roller",
      "description": "Roll virtual dice for tabletop games"
    }
  }
}
```

### Fallback Behavior

Missing keys **automatically fall back to English**. This is handled by a deep merge in [`src/i18n/request.ts`](../src/i18n/request.ts):

```typescript
// Locale-specific messages are merged over English
const merged = deepMerge(englishMessages, localeMessages);
```

**Benefits:**

- Partial translations work immediately
- No runtime errors for missing keys
- Translators can work incrementally

---

## User Language Preference

### Detection Priority

1. **Cookie** (`NEXT_LOCALE`) — User's explicit choice
2. **Browser** (`Accept-Language` header) — Browser preference
3. **Default** — English

### Language Switcher

The language selector in the top bar:

1. Sets the `NEXT_LOCALE` cookie
2. Navigates to the appropriate locale URL

### Automatic Redirects

When a user has set a preference, they're redirected to their preferred locale:

| Scenario                                         | Action                                |
| ------------------------------------------------ | ------------------------------------- |
| Preference: `es`, visits `/tools/dice-roller`    | → Redirect to `/es/tools/dice-roller` |
| Preference: `en`, visits `/es/tools/dice-roller` | → Redirect to `/tools/dice-roller`    |
| Preference: `ja`, visits `/es/tools/dice-roller` | → Redirect to `/ja/tools/dice-roller` |

This ensures users always see content in their chosen language, even when clicking external links.

Implementation: [`src/proxy.ts`](../src/proxy.ts)

---

## Translation Manifest

The manifest in [`src/i18n/translations.ts`](../src/i18n/translations.ts) tracks which tools have complete translations:

```typescript
export const translatedTools: Record<string, string[]> = {
  es: ["dice-roller"],
  ja: ["dice-roller"],
};
```

**Purpose:** Controls the "Translation in progress" warning banner on tool pages.

**Important:** This does NOT affect SEO. All locales get `hreflang` tags for all pages, regardless of translation status.

---

## Tool Documentation

Each tool can have locale-specific Markdown documentation in its `docs/` folder:

```
src/components/tools/dice/
├── DiceTool.tsx
├── index.ts
└── docs/
    ├── en.md   # English documentation
    ├── es.md   # Spanish documentation
    └── ja.md   # Japanese documentation
```

### Fallback Chain

1. Try `{locale}.md` (e.g., `es.md`)
2. Fall back to `en.md`
3. If no docs exist, render nothing

When showing fallback content, a notice is displayed: _"This documentation is shown in English..."_

Implementation: [`src/lib/tool-docs.ts`](../src/lib/tool-docs.ts)

---

## SEO for Multi-Language

### hreflang Tags

Every page includes `hreflang` alternate links for all locales:

```html
<link
  rel="alternate"
  hreflang="en"
  href="https://utilpedia.org/tools/dice-roller"
/>
<link
  rel="alternate"
  hreflang="es"
  href="https://utilpedia.org/es/tools/dice-roller"
/>
<link
  rel="alternate"
  hreflang="ja"
  href="https://utilpedia.org/ja/tools/dice-roller"
/>
<link
  rel="alternate"
  hreflang="x-default"
  href="https://utilpedia.org/tools/dice-roller"
/>
```

- `x-default` points to the English version (for users with no matching locale)
- All URLs are absolute (Google requirement)

Implementation: [`src/lib/seo.ts`](../src/lib/seo.ts)

### Sitemap

The sitemap includes:

- All pages for all locales
- `xhtml:link` hreflang annotations for each URL
- `x-default` for fallback routing

Generated at build time: [`next-sitemap.config.mjs`](../next-sitemap.config.mjs)

### Canonical URLs

Each locale version has a self-referencing canonical tag. English pages don't include a locale prefix in their canonical URL.

---

## Adding a New Language

### 1. Update Configuration

```typescript
// src/i18n/config.ts
export const locales = ["en", "es", "ja", "fr"] as const; //Add Fr
```

### 2. Create Message File

Create `src/messages/fr.json` with translated content. You can start with a partial translation—missing keys fall back to English.

### 3. Update Sitemap Config

```javascript
// next-sitemap.config.mjs
const locales = ["en", "es", "ja", "fr"]; // Add "fr"
```

### 4. Add Language Display Name

```typescript
// src/components/layout/TopBar.tsx
const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
  fr: "Français", // Add French
};
```

### 5. Regenerate Sitemap

```bash
bun run postbuild
```

---

## Adding Tool Translations

### 1. Translate UI Strings

Add the tool to your locale's message file:

```json
// src/messages/es.json
{
  "tools": {
    "dice-roller": {
      "name": "Lanzador de Dados",
      "description": "Lanza dados virtuales para juegos de mesa"
    }
  }
}
```

### 2. Create Documentation (Optional)

Create `src/components/tools/dice/docs/es.md` with localized help content.

### 3. Mark as Complete

Update the translation manifest:

```typescript
// src/i18n/translations.ts
export const translatedTools: Record<string, string[]> = {
  es: ["dice-roller"], // Add tool slug
  ja: ["dice-roller"],
};
```

This removes the "Translation in progress" warning for that tool.

---

## Technical Stack

| Library                                                | Purpose                                            |
| ------------------------------------------------------ | -------------------------------------------------- |
| [`next-intl`](https://next-intl-docs.vercel.app/)      | React internationalization with Next.js App Router |
| [`remark`](https://github.com/remarkjs/remark)         | Markdown parsing for tool documentation            |
| [`remark-gfm`](https://github.com/remarkjs/remark-gfm) | GitHub Flavored Markdown (tables, strikethrough)   |

---

## Best Practices

1. **Always add keys to `en.json` first** — It's the canonical source
2. **Use nested namespaces** — Organize by feature (`tools.dice-roller.name`)
3. **Keep translations atomic** — One key = one string (avoid embedding HTML)
4. **Test with incomplete translations** — Verify fallback behavior works
5. **Run the build** — Ensure no missing key errors in production

---

## File Reference

| File                       | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `src/i18n/config.ts`       | Locale definitions and constants         |
| `src/i18n/request.ts`      | Message loading with fallback            |
| `src/i18n/translations.ts` | Translation completion manifest          |
| `src/messages/*.json`      | UI translation strings                   |
| `src/lib/seo.ts`           | hreflang and canonical URL generation    |
| `src/lib/tool-docs.ts`     | Markdown documentation loader            |
| `src/proxy.ts`             | Locale detection and redirect middleware |
| `next-sitemap.config.mjs`  | Sitemap generation with hreflang         |
