"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { convert, rgbToHex } from "@utilpedia/color";
import type {
  RgbColor,
  RgbaColor,
  HslColor,
  HslaColor,
  HsvColor,
  HsvaColor,
  CmykColor,
  LabColor,
  LchColor,
  OklchColor,
} from "@utilpedia/color";

/**
 * Supported formats for the color converter (excludes pantone and xyz).
 */
export type ConverterFormat =
  | "hex"
  | "rgb"
  | "rgba"
  | "hsl"
  | "hsla"
  | "hsv"
  | "hsva"
  | "cmyk"
  | "lab"
  | "lch"
  | "oklch";

interface ColorConverterToolProps {
  fromFormat: ConverterFormat;
  toFormat: ConverterFormat;
}

/**
 * All available formats for the dropdowns.
 */
const allFormats: ConverterFormat[] = [
  "hex",
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hsv",
  "hsva",
  "cmyk",
  "lab",
  "lch",
  "oklch",
];

/**
 * Format display names for UI.
 */
const formatDisplayNames: Record<ConverterFormat, string> = {
  hex: "HEX",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  hsv: "HSV",
  hsva: "HSVA",
  cmyk: "CMYK",
  lab: "LAB",
  lch: "LCH",
  oklch: "OKLCH",
};

/**
 * Input field configuration for each format.
 */
interface FieldConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  suffix?: string;
}

const formatFields: Record<ConverterFormat, FieldConfig[]> = {
  hex: [{ label: "HEX", min: 0, max: 0, step: 0 }], // Text input, special case
  rgb: [
    { label: "R", min: 0, max: 255, step: 1 },
    { label: "G", min: 0, max: 255, step: 1 },
    { label: "B", min: 0, max: 255, step: 1 },
  ],
  rgba: [
    { label: "R", min: 0, max: 255, step: 1 },
    { label: "G", min: 0, max: 255, step: 1 },
    { label: "B", min: 0, max: 255, step: 1 },
    { label: "A", min: 0, max: 1, step: 0.01 },
  ],
  hsl: [
    { label: "H", min: 0, max: 360, step: 1, suffix: "°" },
    { label: "S", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "L", min: 0, max: 100, step: 1, suffix: "%" },
  ],
  hsla: [
    { label: "H", min: 0, max: 360, step: 1, suffix: "°" },
    { label: "S", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "L", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "A", min: 0, max: 1, step: 0.01 },
  ],
  hsv: [
    { label: "H", min: 0, max: 360, step: 1, suffix: "°" },
    { label: "S", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "V", min: 0, max: 100, step: 1, suffix: "%" },
  ],
  hsva: [
    { label: "H", min: 0, max: 360, step: 1, suffix: "°" },
    { label: "S", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "V", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "A", min: 0, max: 1, step: 0.01 },
  ],
  cmyk: [
    { label: "C", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "M", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "Y", min: 0, max: 100, step: 1, suffix: "%" },
    { label: "K", min: 0, max: 100, step: 1, suffix: "%" },
  ],
  lab: [
    { label: "L", min: 0, max: 100, step: 0.1 },
    { label: "a", min: -128, max: 127, step: 0.1 },
    { label: "b", min: -128, max: 127, step: 0.1 },
  ],
  lch: [
    { label: "L", min: 0, max: 100, step: 0.1 },
    { label: "C", min: 0, max: 150, step: 0.1 },
    { label: "H", min: 0, max: 360, step: 1, suffix: "°" },
  ],
  oklch: [
    { label: "L", min: 0, max: 1, step: 0.001 },
    { label: "C", min: 0, max: 0.4, step: 0.001 },
    { label: "H", min: 0, max: 360, step: 1, suffix: "°" },
  ],
};

/**
 * Default values for each format.
 */
function getDefaultValues(format: ConverterFormat): string[] {
  switch (format) {
    case "hex":
      return ["#ff8000"];
    case "rgb":
      return ["255", "128", "0"];
    case "rgba":
      return ["255", "128", "0", "1"];
    case "hsl":
      return ["30", "100", "50"];
    case "hsla":
      return ["30", "100", "50", "1"];
    case "hsv":
      return ["30", "100", "100"];
    case "hsva":
      return ["30", "100", "100", "1"];
    case "cmyk":
      return ["0", "50", "100", "0"];
    case "lab":
      return ["66", "42", "74"];
    case "lch":
      return ["66", "85", "60"];
    case "oklch":
      return ["0.75", "0.17", "55"];
  }
}

/**
 * Parse input values into the proper color format.
 */
function parseInputToColor(
  format: ConverterFormat,
  values: string[]
): { color: unknown; valid: boolean } {
  try {
    switch (format) {
      case "hex": {
        const hex = values[0]?.trim() ?? "";
        // Validate hex format
        if (
          !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(
            hex
          )
        ) {
          return { color: null, valid: false };
        }
        return { color: hex, valid: true };
      }
      case "rgb": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as RgbColor, valid: true };
      }
      case "rgba": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as RgbaColor, valid: true };
      }
      case "hsl": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as HslColor, valid: true };
      }
      case "hsla": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as HslaColor, valid: true };
      }
      case "hsv": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as HsvColor, valid: true };
      }
      case "hsva": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as HsvaColor, valid: true };
      }
      case "cmyk": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as CmykColor, valid: true };
      }
      case "lab": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as LabColor, valid: true };
      }
      case "lch": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as LchColor, valid: true };
      }
      case "oklch": {
        const nums = values.map((v) => parseFloat(v));
        if (nums.some(isNaN)) return { color: null, valid: false };
        return { color: nums as OklchColor, valid: true };
      }
    }
  } catch {
    return { color: null, valid: false };
  }
}

/**
 * Format output value for display.
 */
function formatOutput(format: ConverterFormat, value: unknown): string {
  if (value === null || value === undefined) return "";

  switch (format) {
    case "hex":
      return (value as string).toUpperCase();
    case "rgb": {
      const [r, g, b] = value as RgbColor;
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    case "rgba": {
      const [r, g, b, a] = value as RgbaColor;
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`;
    }
    case "hsl": {
      const [h, s, l] = value as HslColor;
      return `hsl(${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%)`;
    }
    case "hsla": {
      const [h, s, l, a] = value as HslaColor;
      return `hsla(${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%, ${a.toFixed(2)})`;
    }
    case "hsv": {
      const [h, s, v] = value as HsvColor;
      return `hsv(${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(v)}%)`;
    }
    case "hsva": {
      const [h, s, v, a] = value as HsvaColor;
      return `hsva(${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(v)}%, ${a.toFixed(2)})`;
    }
    case "cmyk": {
      const [c, m, y, k] = value as CmykColor;
      return `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k)}%)`;
    }
    case "lab": {
      const [l, a, b] = value as LabColor;
      return `lab(${l.toFixed(1)}, ${a.toFixed(1)}, ${b.toFixed(1)})`;
    }
    case "lch": {
      const [l, c, h] = value as LchColor;
      return `lch(${l.toFixed(1)}, ${c.toFixed(1)}, ${Math.round(h)}°)`;
    }
    case "oklch": {
      const [l, c, h] = value as OklchColor;
      return `oklch(${l.toFixed(3)}, ${c.toFixed(3)}, ${Math.round(h)}°)`;
    }
  }
}

/**
 * Get a hex color for the preview swatch from any format.
 */
function getPreviewHex(
  format: ConverterFormat,
  values: string[]
): string | null {
  const { color, valid } = parseInputToColor(format, values);
  if (!valid || color === null) return null;

  try {
    if (format === "hex") {
      return color as string;
    }
    // Convert to RGB first, then to hex
    const rgb = convert(format, color as never, "rgb") as RgbColor;
    return rgbToHex(rgb);
  } catch {
    return null;
  }
}

export function ColorConverterTool({
  fromFormat: initialFromFormat,
  toFormat: initialToFormat,
}: ColorConverterToolProps) {
  const t = useTranslations("colorConverterTool");

  // State for current formats (can be changed via dropdowns)
  const [currentFrom, setCurrentFrom] =
    useState<ConverterFormat>(initialFromFormat);
  const [currentTo, setCurrentTo] = useState<ConverterFormat>(initialToFormat);

  const [inputValues, setInputValues] = useState<string[]>(() =>
    getDefaultValues(initialFromFormat)
  );
  const [copied, setCopied] = useState(false);

  // Handle "from" format change - reset input values
  const handleFromChange = (newFormat: ConverterFormat) => {
    setCurrentFrom(newFormat);
    setInputValues(getDefaultValues(newFormat));
    // If new "from" equals current "to", swap them
    if (newFormat === currentTo) {
      setCurrentTo(currentFrom);
    }
  };

  // Handle "to" format change
  const handleToChange = (newFormat: ConverterFormat) => {
    setCurrentTo(newFormat);
    // If new "to" equals current "from", swap them
    if (newFormat === currentFrom) {
      setCurrentFrom(currentTo);
      setInputValues(getDefaultValues(currentTo));
    }
  };

  // Swap from/to formats
  const handleSwap = () => {
    const oldFrom = currentFrom;
    const oldTo = currentTo;
    setCurrentFrom(oldTo);
    setCurrentTo(oldFrom);
    setInputValues(getDefaultValues(oldTo));
  };

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  // Convert the input color to the target format
  const conversion = useMemo(() => {
    const { color, valid } = parseInputToColor(currentFrom, inputValues);
    if (!valid || color === null) {
      return { output: null, outputString: "", previewHex: null };
    }

    try {
      const output = convert(currentFrom, color as never, currentTo);
      const outputString = formatOutput(currentTo, output);
      const previewHex = getPreviewHex(currentFrom, inputValues);
      return { output, outputString, previewHex };
    } catch {
      return { output: null, outputString: "", previewHex: null };
    }
  }, [currentFrom, currentTo, inputValues]);

  const handleInputChange = (index: number, value: string) => {
    setInputValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCopy = async () => {
    if (!conversion.outputString) return;
    try {
      await navigator.clipboard.writeText(conversion.outputString);
      setCopied(true);
    } catch {
      // Clipboard API not available
    }
  };

  const fields = formatFields[currentFrom];
  const fromName = formatDisplayNames[currentFrom];
  const toName = formatDisplayNames[currentTo];

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">
        {t("title", { from: fromName, to: toName })}
      </h1>

      {/* Format Selectors - Stacked */}
      <div className="space-y-3 max-w-sm">
        {/* From Format */}
        <div>
          <label
            htmlFor="from-format"
            className="block text-sm font-medium text-foreground-muted mb-1"
          >
            {t("fromLabel")}
          </label>
          <select
            id="from-format"
            value={currentFrom}
            onChange={(e) =>
              handleFromChange(e.target.value as ConverterFormat)
            }
            className="w-full px-3 py-2 focus-ring bg-background border border-input-border text-foreground"
          >
            {allFormats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {formatDisplayNames[fmt]}
              </option>
            ))}
          </select>
        </div>

        {/* To Format */}
        <div>
          <label
            htmlFor="to-format"
            className="block text-sm font-medium text-foreground-muted mb-1"
          >
            {t("toLabel")}
          </label>
          <select
            id="to-format"
            value={currentTo}
            onChange={(e) => handleToChange(e.target.value as ConverterFormat)}
            className="w-full px-3 py-2 focus-ring bg-background border border-input-border text-foreground"
          >
            {allFormats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {formatDisplayNames[fmt]}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="px-3 py-1 text-sm focus-ring bg-background-muted border border-border text-foreground-muted hover:text-foreground transition-colors"
        >
          {t("swap")}
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <label className="block text-lg font-bold text-foreground">
          {t("inputLabel", { format: fromName })}
        </label>

        {currentFrom === "hex" ? (
          // HEX input - single text field
          <input
            type="text"
            value={inputValues[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            placeholder="#ff8000"
            className="w-full px-4 py-3 font-mono text-lg focus-ring bg-background border border-input-border text-foreground"
            spellCheck={false}
          />
        ) : (
          // Numeric inputs for other formats
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {fields.map((field, index) => (
              <div key={field.label} className="space-y-1">
                <label
                  htmlFor={`input-${field.label}`}
                  className="block text-sm font-medium text-foreground-muted"
                >
                  {field.label}
                  {field.suffix && (
                    <span className="text-foreground-subtle ml-0.5">
                      {field.suffix}
                    </span>
                  )}
                </label>
                <input
                  id={`input-${field.label}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={inputValues[index] ?? ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full px-3 py-2 font-mono focus-ring bg-background border border-input-border text-foreground"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview and Output */}
      {conversion.previewHex && (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-background-muted">
          {/* Color Swatch */}
          <div
            className="w-20 h-20 rounded-lg flex-shrink-0 border-2 border-border shadow-md"
            style={{ backgroundColor: conversion.previewHex }}
            aria-label={t("colorPreview")}
          />

          {/* Output */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="text-sm font-medium text-foreground-muted">
              {toName}
            </div>
            <code className="block text-xl font-mono text-foreground break-all">
              {conversion.outputString}
            </code>
            <button
              onClick={handleCopy}
              className={`px-4 py-1.5 text-sm rounded transition-colors ${
                copied
                  ? "bg-primary text-primary-foreground"
                  : "bg-border text-foreground hover:bg-border-muted"
              }`}
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      )}

      {/* Invalid Input Notice */}
      {!conversion.previewHex && inputValues.some((v) => v.trim() !== "") && (
        <div className="p-4 rounded-lg bg-background-muted text-foreground-muted">
          {t("invalidInput")}
        </div>
      )}
    </div>
  );
}
