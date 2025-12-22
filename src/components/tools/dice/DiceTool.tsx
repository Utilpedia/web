"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { dice } from "@utilpedia/math/core";
import * as v from "valibot";

type Mode = "total" | "rolls";

const MIN_SIDES = 2;
const MAX_SIDES = 1000;
const MIN_COUNT = 1;
const MAX_COUNT = 100;

const sidesSchema = v.pipe(
  v.string(),
  v.transform((val) => parseInt(val, 10)),
  v.number("Must be a number"),
  v.integer("Must be a whole number"),
  v.minValue(MIN_SIDES, `Minimum ${MIN_SIDES} sides`),
  v.maxValue(MAX_SIDES, `Maximum ${MAX_SIDES} sides`)
);

const countSchema = v.pipe(
  v.string(),
  v.transform((val) => parseInt(val, 10)),
  v.number("Must be a number"),
  v.integer("Must be a whole number"),
  v.minValue(MIN_COUNT, `Minimum ${MIN_COUNT} die`),
  v.maxValue(MAX_COUNT, `Maximum ${MAX_COUNT} dice`)
);

function validate<T>(
  schema: v.GenericSchema<string, T>,
  value: string
): { success: true; data: T } | { success: false; error: string } {
  const result = v.safeParse(schema, value);
  if (result.success) {
    return { success: true, data: result.output };
  }
  return { success: false, error: result.issues[0]?.message ?? "Invalid" };
}

export function DiceTool() {
  const t = useTranslations("diceTool");

  const [sides, setSides] = useState("6");
  const [count, setCount] = useState("1");
  const [mode, setMode] = useState<Mode>("total");
  const [result, setResult] = useState<number | number[] | null>(null);
  const [errors, setErrors] = useState<{ sides?: string; count?: string }>({});

  const handleSidesChange = (value: string) => {
    setSides(value);
    const result = validate(sidesSchema, value);
    setErrors((prev) => ({
      ...prev,
      sides: result.success ? undefined : result.error,
    }));
  };

  const handleCountChange = (value: string) => {
    setCount(value);
    const result = validate(countSchema, value);
    setErrors((prev) => ({
      ...prev,
      count: result.success ? undefined : result.error,
    }));
  };

  const handleRoll = () => {
    const sidesResult = validate(sidesSchema, sides);
    const countResult = validate(countSchema, count);

    setErrors({
      sides: sidesResult.success ? undefined : sidesResult.error,
      count: countResult.success ? undefined : countResult.error,
    });

    if (!sidesResult.success || !countResult.success) {
      setResult(null);
      return;
    }

    if (mode === "rolls") {
      setResult(dice(sidesResult.data, countResult.data, "rolls"));
    } else {
      setResult(dice(sidesResult.data, countResult.data, "total"));
    }
  };

  const hasErrors = Boolean(errors.sides || errors.count);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>

      {/* Number of Sides */}
      <div className="space-y-2">
        <label
          htmlFor="sides"
          className="block text-lg font-bold text-foreground"
        >
          {t("sides")}
        </label>
        <input
          id="sides"
          type="number"
          min={MIN_SIDES}
          max={MAX_SIDES}
          value={sides}
          onChange={(e) => handleSidesChange(e.target.value)}
          aria-invalid={errors.sides ? "true" : "false"}
          aria-describedby={
            errors.sides ? "sides-error sides-hint" : "sides-hint"
          }
          className={`w-full px-3 py-2 focus-ring bg-background text-foreground border ${
            errors.sides ? "border-input-border-error" : "border-input-border"
          }`}
        />
        {errors.sides && (
          <p id="sides-error" className="text-sm text-destructive" role="alert">
            {errors.sides}
          </p>
        )}
        <p id="sides-hint" className="text-xs text-foreground-subtle">
          {t("sidesHint", { min: MIN_SIDES, max: MAX_SIDES })}
        </p>
      </div>

      {/* Number of Dice */}
      <div className="space-y-2">
        <label
          htmlFor="count"
          className="block text-lg font-bold text-foreground"
        >
          {t("count")}
        </label>
        <input
          id="count"
          type="number"
          min={MIN_COUNT}
          max={MAX_COUNT}
          value={count}
          onChange={(e) => handleCountChange(e.target.value)}
          aria-invalid={errors.count ? "true" : "false"}
          aria-describedby={
            errors.count ? "count-error count-hint" : "count-hint"
          }
          className={`w-full px-3 py-2 focus-ring bg-background text-foreground border ${
            errors.count ? "border-input-border-error" : "border-input-border"
          }`}
        />
        {errors.count && (
          <p id="count-error" className="text-sm text-destructive" role="alert">
            {errors.count}
          </p>
        )}
        <p id="count-hint" className="text-xs text-foreground-subtle">
          {t("countHint", { min: MIN_COUNT, max: MAX_COUNT })}
        </p>
      </div>

      {/* Result Display */}
      <div className="space-y-2">
        <label
          htmlFor="result"
          className="block text-lg font-bold text-foreground"
        >
          {mode === "rolls" ? t("rolls") : t("total")}
        </label>
        <output
          id="result"
          aria-live="polite"
          className="block w-full px-3 py-2 min-h-[42px] border border-input-border bg-background text-foreground"
        >
          {result === null
            ? ""
            : Array.isArray(result)
              ? result.join(", ")
              : result.toString()}
        </output>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={mode === "rolls"}
            onChange={(e) => setMode(e.target.checked ? "rolls" : "total")}
            className="w-4 h-4 focus-ring"
          />
          <span className="text-foreground-muted">{t("modeRolls")}</span>
        </label>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={hasErrors}
        className={`px-8 py-3 font-medium tracking-wide uppercase transition-colors focus-ring ${
          hasErrors
            ? "bg-border text-foreground-muted cursor-not-allowed"
            : "bg-primary text-primary-foreground cursor-pointer"
        }`}
      >
        {t("roll")}
      </button>
    </div>
  );
}
