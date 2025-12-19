import { describe, it, expect } from "vitest";
import { getToolDocs } from "./tool-docs";

/**
 * Integration tests for getToolDocs using real files.
 * Tests the actual dice-roller docs that exist in the codebase.
 */
describe("getToolDocs", () => {
  describe("with existing docs (dice-roller)", () => {
    it("returns English docs with isFallback=false", async () => {
      const result = await getToolDocs("dice-roller", "en");

      expect(result).not.toBeNull();
      expect(result?.isFallback).toBe(false);
      expect(result?.html).toContain("How It Works");
    });

    it("returns Spanish docs with isFallback=false", async () => {
      const result = await getToolDocs("dice-roller", "es");

      expect(result).not.toBeNull();
      expect(result?.isFallback).toBe(false);
      expect(result?.html).toContain("Cómo Funciona");
    });

    it("returns Japanese docs with isFallback=false", async () => {
      const result = await getToolDocs("dice-roller", "ja");

      expect(result).not.toBeNull();
      expect(result?.isFallback).toBe(false);
      expect(result?.html).toContain("仕組み");
    });

    it("falls back to English for unsupported locale", async () => {
      const result = await getToolDocs("dice-roller", "fr");

      expect(result).not.toBeNull();
      expect(result?.isFallback).toBe(true);
      expect(result?.html).toContain("How It Works");
    });

    it("renders markdown tables to HTML", async () => {
      const result = await getToolDocs("dice-roller", "en");

      expect(result?.html).toContain("<table>");
      expect(result?.html).toContain("<th>");
    });
  });

  describe("with no docs", () => {
    it("returns null for tool without componentPath", async () => {
      // percentage-calculator has no componentPath
      const result = await getToolDocs("percentage-calculator", "en");
      expect(result).toBeNull();
    });

    it("returns null for unknown tool", async () => {
      const result = await getToolDocs("nonexistent-tool", "en");
      expect(result).toBeNull();
    });
  });
});
