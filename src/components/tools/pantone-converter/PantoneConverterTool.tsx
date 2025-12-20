"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  searchPantone,
  pantoneToHex,
  convert,
  type PantoneEntry,
} from "@utilpedia/color";

// Simple debounce hook
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function PantoneConverterTool() {
  const t = useTranslations("pantoneConverterTool");

  const [query, setQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<PantoneEntry | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounce search query by 150ms
  const debouncedQuery = useDebouncedValue(query, 150);

  // Search results
  const searchResults = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    try {
      return searchPantone(debouncedQuery).slice(0, 20); // Limit to 20 results
    } catch {
      return [];
    }
  }, [debouncedQuery]);

  // Convert selected color to all formats
  const conversions = useMemo(() => {
    if (!selectedColor) return null;

    try {
      const hex = pantoneToHex(selectedColor.code);
      const rgb = convert("pantone", selectedColor.code, "rgb");
      const cmyk = convert("pantone", selectedColor.code, "cmyk");
      const hsl = convert("pantone", selectedColor.code, "hsl");

      return { hex, rgb, cmyk, hsl };
    } catch {
      return null;
    }
  }, [selectedColor]);

  const handleSelectColor = useCallback((entry: PantoneEntry) => {
    setSelectedColor(entry);
    setQuery(entry.name);
    setFocusedIndex(-1);
  }, []);

  const handleClear = () => {
    setQuery("");
    setSelectedColor(null);
    setFocusedIndex(-1);
  };

  // Keyboard navigation for search results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0 || selectedColor) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && searchResults[focusedIndex]) {
          handleSelectColor(searchResults[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setFocusedIndex(-1);
        break;
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && resultsRef.current) {
      const focusedElement = resultsRef.current.children[
        focusedIndex
      ] as HTMLElement;
      focusedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
        {t("title")}
      </h1>
      {/* Search Input */}
      <div className="space-y-2">
        <label
          htmlFor="pantone-search"
          className="block text-sm font-medium"
          style={{ color: "var(--foreground-muted)" }}
        >
          {t("searchLabel")}
        </label>
        <div className="relative">
          <input
            id="pantone-search"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusedIndex(-1); // Reset focus when typing
              if (selectedColor && e.target.value !== selectedColor.name) {
                setSelectedColor(null);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("searchPlaceholder")}
            className="w-full px-4 py-3 rounded-lg focus-ring"
            style={{
              backgroundColor: "var(--background-muted)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            role="combobox"
            aria-expanded={searchResults.length > 0 && !selectedColor}
            aria-controls="pantone-results"
            aria-activedescendant={
              focusedIndex >= 0 ? `pantone-result-${focusedIndex}` : undefined
            }
            autoComplete="off"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
              style={{ color: "var(--foreground-muted)" }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && !selectedColor && (
        <div
          ref={resultsRef}
          id="pantone-results"
          role="listbox"
          className="rounded-lg overflow-hidden max-h-80 overflow-y-auto"
          style={{
            backgroundColor: "var(--background-muted)",
            border: "1px solid var(--border)",
          }}
        >
          {searchResults.map((entry, index) => (
            <button
              key={entry.code}
              id={`pantone-result-${index}`}
              role="option"
              aria-selected={focusedIndex === index}
              onClick={() => handleSelectColor(entry)}
              onMouseEnter={() => setFocusedIndex(index)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{
                backgroundColor:
                  focusedIndex === index ? "var(--background)" : "transparent",
                borderBottom:
                  index < searchResults.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              {/* Color Swatch */}
              <div
                className="w-8 h-8 rounded flex-shrink-0"
                style={{
                  backgroundColor: entry.hex,
                  border: "1px solid var(--border)",
                }}
              />
              {/* Color Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {entry.name}
                </div>
                <div
                  className="text-sm truncate"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {entry.code}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {query.length >= 2 && searchResults.length === 0 && !selectedColor && (
        <div
          className="text-center py-8"
          style={{ color: "var(--foreground-muted)" }}
        >
          {t("noResults")}
        </div>
      )}

      {/* Selected Color Results */}
      {selectedColor && conversions && (
        <div className="space-y-6">
          {/* Color Preview */}
          <div
            className="p-6 rounded-lg flex items-center gap-6"
            style={{ backgroundColor: "var(--background-muted)" }}
          >
            <div
              className="w-24 h-24 rounded-lg flex-shrink-0"
              style={{
                backgroundColor: conversions.hex,
                border: "2px solid var(--border)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {selectedColor.name}
              </h2>
              <p style={{ color: "var(--foreground-muted)" }}>
                {selectedColor.code}
              </p>
            </div>
          </div>

          {/* Color Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* HEX */}
            <ColorValueCard
              label="HEX"
              value={conversions.hex.toUpperCase()}
              copyValue={conversions.hex}
              copyLabel={t("copy")}
              copiedLabel={t("copied")}
            />

            {/* RGB */}
            <ColorValueCard
              label="RGB"
              value={`rgb(${conversions.rgb[0]}, ${conversions.rgb[1]}, ${conversions.rgb[2]})`}
              copyValue={`rgb(${conversions.rgb[0]}, ${conversions.rgb[1]}, ${conversions.rgb[2]})`}
              copyLabel={t("copy")}
              copiedLabel={t("copied")}
            />

            {/* CMYK */}
            <ColorValueCard
              label="CMYK"
              value={`C:${conversions.cmyk[0]}% M:${conversions.cmyk[1]}% Y:${conversions.cmyk[2]}% K:${conversions.cmyk[3]}%`}
              copyValue={`cmyk(${conversions.cmyk[0]}%, ${conversions.cmyk[1]}%, ${conversions.cmyk[2]}%, ${conversions.cmyk[3]}%)`}
              copyLabel={t("copy")}
              copiedLabel={t("copied")}
            />

            {/* HSL */}
            <ColorValueCard
              label="HSL"
              value={`hsl(${Math.round(conversions.hsl[0])}°, ${Math.round(conversions.hsl[1])}%, ${Math.round(conversions.hsl[2])}%)`}
              copyValue={`hsl(${Math.round(conversions.hsl[0])}, ${Math.round(conversions.hsl[1])}%, ${Math.round(conversions.hsl[2])}%)`}
              copyLabel={t("copy")}
              copiedLabel={t("copied")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ColorValueCardProps {
  label: string;
  value: string;
  copyValue: string;
  copyLabel: string;
  copiedLabel: string;
}

function ColorValueCard({
  label,
  value,
  copyValue,
  copyLabel,
  copiedLabel,
}: ColorValueCardProps) {
  const [copied, setCopied] = useState(false);

  // Clean up timeout on unmount
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: "var(--background-muted)" }}
    >
      <div
        className="text-sm font-medium mb-1"
        style={{ color: "var(--foreground-muted)" }}
      >
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <code
          className="text-lg font-mono"
          style={{ color: "var(--foreground)" }}
        >
          {value}
        </code>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm rounded transition-colors"
          style={{
            backgroundColor: copied ? "var(--primary)" : "var(--border)",
            color: copied ? "var(--primary-foreground)" : "var(--foreground)",
          }}
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}
