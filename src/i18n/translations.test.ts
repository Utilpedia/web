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

    it("returns false for non-English locales by default", () => {
      // Since translatedTools arrays are empty by default
      expect(isToolTranslated("es", "dice-roller")).toBe(false);
      expect(isToolTranslated("ja", "dice-roller")).toBe(false);
    });

    it("returns false for unknown locales", () => {
      expect(isToolTranslated("xyz", "dice-roller")).toBe(false);
    });
  });

  describe("getTranslatedLocales", () => {
    it("always includes English", () => {
      const locales = getTranslatedLocales("dice-roller");
      expect(locales).toContain("en");
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
