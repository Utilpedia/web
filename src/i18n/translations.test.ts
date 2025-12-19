import { describe, it, expect } from "vitest";
import {
  isToolTranslated,
  getTranslatedLocales,
  translatedTools,
} from "./translations";

describe("translations", () => {
  describe("isToolTranslated", () => {
    it("returns true for English (always)", () => {
      expect(isToolTranslated("en", "dice-roller")).toBe(true);
      expect(isToolTranslated("en", "any-tool")).toBe(true);
    });

    it("returns true for translated tools in non-English locales", () => {
      // dice-roller is marked as translated in es and ja
      expect(isToolTranslated("es", "dice-roller")).toBe(true);
      expect(isToolTranslated("ja", "dice-roller")).toBe(true);
    });

    it("returns false for untranslated tools in non-English locales", () => {
      expect(isToolTranslated("es", "unknown-tool")).toBe(false);
      expect(isToolTranslated("ja", "unknown-tool")).toBe(false);
    });

    it("returns false for unknown locales", () => {
      expect(isToolTranslated("xyz", "dice-roller")).toBe(false);
    });
  });

  describe("getTranslatedLocales", () => {
    it("always includes English", () => {
      const locales = getTranslatedLocales("unknown-tool");
      expect(locales).toContain("en");
    });

    it("includes locales where the tool is translated", () => {
      const locales = getTranslatedLocales("dice-roller");
      expect(locales).toContain("en");
      expect(locales).toContain("es");
      expect(locales).toContain("ja");
    });

    it("returns only English when no other translations exist", () => {
      const locales = getTranslatedLocales("unknown-tool");
      expect(locales).toEqual(["en"]);
    });
  });

  describe("translatedTools", () => {
    it("has entries for supported non-English locales", () => {
      expect(translatedTools).toHaveProperty("es");
      expect(translatedTools).toHaveProperty("ja");
    });

    it("entries are arrays", () => {
      expect(Array.isArray(translatedTools.es)).toBe(true);
      expect(Array.isArray(translatedTools.ja)).toBe(true);
    });
  });
});
