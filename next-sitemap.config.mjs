import toolSlugs from "./src/features/tool-registry/tool-slugs.json" with { type: "json" };
import { writeFileSync, mkdirSync } from "fs";

const siteUrl = process.env.SITE_URL || "https://utilpedia.org";
const locales = ["en", "es", "ja"];
const defaultLocale = "en";

/**
 * Generate hreflang links XML for a canonical path.
 * Includes x-default pointing to the English (default) version.
 */
function generateHreflangLinks(canonicalPath) {
  const links = locales.map((locale) => {
    const href =
      locale === defaultLocale
        ? `${siteUrl}${canonicalPath}`
        : `${siteUrl}/${locale}${canonicalPath}`;
    return `<xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`;
  });

  // Add x-default pointing to the default locale (English)
  links.push(
    `<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${canonicalPath}"/>`
  );

  return links.join("");
}

/**
 * Generate a single URL entry for the sitemap.
 */
function generateUrlEntry(loc, canonicalPath, changefreq, priority) {
  const lastmod = new Date().toISOString();
  const hreflangLinks = generateHreflangLinks(canonicalPath);
  return `<url><loc>${siteUrl}${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${hreflangLinks}</url>`;
}

/**
 * Generate the complete sitemap XML.
 */
function generateSitemap() {
  const entries = [];

  // English pages (canonical)
  entries.push(generateUrlEntry("/", "/", "daily", 1.0));
  entries.push(generateUrlEntry("/tools", "/tools", "daily", 0.9));
  for (const slug of toolSlugs) {
    entries.push(generateUrlEntry(`/tools/${slug}`, `/tools/${slug}`, "weekly", 0.8));
  }

  // Non-English locale pages
  for (const locale of locales.filter((l) => l !== defaultLocale)) {
    entries.push(generateUrlEntry(`/${locale}`, "/", "daily", 0.9));
    entries.push(generateUrlEntry(`/${locale}/tools`, "/tools", "daily", 0.8));
    for (const slug of toolSlugs) {
      entries.push(generateUrlEntry(`/${locale}/tools/${slug}`, `/tools/${slug}`, "weekly", 0.7));
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>`;
}

/**
 * Generate robots.txt content.
 */
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;
}

// Generate both files
const sitemapXml = generateSitemap();
const robotsTxt = generateRobotsTxt();

// Write files to public directory
mkdirSync("./public", { recursive: true });
writeFileSync("./public/sitemap.xml", sitemapXml);
writeFileSync("./public/robots.txt", robotsTxt);

console.log("✅ Generated sitemap.xml and robots.txt");

// Export empty config since we're handling generation ourselves
/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  exclude: ["*"],
};

export default config;
