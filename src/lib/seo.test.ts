import { describe, it, expect } from "vitest";
import { generateAlternates, generateSitemapAlternates, siteUrl } from "./seo";

describe("seo", () => {
  describe("generateAlternates", () => {
    it("generates correct alternates for root path", () => {
      const result = generateAlternates("/");

      expect(result.canonical).toBe(`${siteUrl}/`);
      expect(result.languages.en).toBe(`${siteUrl}/`);
      expect(result.languages.es).toBe(`${siteUrl}/es/`);
      expect(result.languages.ja).toBe(`${siteUrl}/ja/`);
      expect(result.languages["x-default"]).toBe(`${siteUrl}/`);
    });

    it("generates correct alternates for tool path", () => {
      const result = generateAlternates("/tools/dice-roller");

      expect(result.canonical).toBe(`${siteUrl}/tools/dice-roller`);
      expect(result.languages.en).toBe(`${siteUrl}/tools/dice-roller`);
      expect(result.languages.es).toBe(`${siteUrl}/es/tools/dice-roller`);
      expect(result.languages.ja).toBe(`${siteUrl}/ja/tools/dice-roller`);
      expect(result.languages["x-default"]).toBe(
        `${siteUrl}/tools/dice-roller`
      );
    });

    it("uses absolute URLs", () => {
      const result = generateAlternates("/tools/test");

      // All URLs should be absolute (start with https://)
      expect(result.canonical).toMatch(/^https:\/\//);
      Object.values(result.languages).forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });
  });

  describe("generateSitemapAlternates", () => {
    it("generates alternateRefs for all locales", () => {
      const result = generateSitemapAlternates("/tools/dice-roller");

      expect(result).toHaveLength(3); // en, es, ja

      const en = result.find((r) => r.hreflang === "en");
      const es = result.find((r) => r.hreflang === "es");
      const ja = result.find((r) => r.hreflang === "ja");

      expect(en?.href).toBe(`${siteUrl}/tools/dice-roller`);
      expect(es?.href).toBe(`${siteUrl}/es/tools/dice-roller`);
      expect(ja?.href).toBe(`${siteUrl}/ja/tools/dice-roller`);
    });

    it("default locale has no prefix", () => {
      const result = generateSitemapAlternates("/");
      const en = result.find((r) => r.hreflang === "en");

      expect(en?.href).toBe(`${siteUrl}/`);
      expect(en?.href).not.toContain("/en/");
    });
  });
});
