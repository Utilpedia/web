"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { dice } from "@utilpedia/math/core";

type Mode = "total" | "rolls";

export function DiceTool() {
  const t = useTranslations("diceTool");

  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(1);
  const [mode, setMode] = useState<Mode>("total");
  const [result, setResult] = useState<number | number[] | null>(null);

  const handleRoll = () => {
    if (mode === "rolls") {
      setResult(dice(sides, count, "rolls"));
    } else {
      setResult(dice(sides, count, "total"));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* Sides input */}
      <div className="space-y-2">
        <label htmlFor="sides" className="block text-sm font-medium">
          {t("sides")}
        </label>
        <input
          id="sides"
          type="number"
          min={1}
          max={100}
          value={sides}
          onChange={(e) => setSides(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Count input */}
      <div className="space-y-2">
        <label htmlFor="count" className="block text-sm font-medium">
          {t("count")}
        </label>
        <input
          id="count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Mode toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">{t("mode")}</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="total"
              checked={mode === "total"}
              onChange={() => setMode("total")}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span>{t("modeTotal")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="rolls"
              checked={mode === "rolls"}
              onChange={() => setMode("rolls")}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span>{t("modeRolls")}</span>
          </label>
        </div>
      </div>

      {/* Roll button */}
      <button
        onClick={handleRoll}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {t("roll")} {count}d{sides}
      </button>

      {/* Result display */}
      {result !== null && (
        <div className="p-4 bg-gray-100 rounded-md text-center">
          {Array.isArray(result) ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{t("rolls")}</p>
              <p className="text-2xl font-bold">{result.join(", ")}</p>
              <p className="text-sm text-gray-500">
                {t("total")}: {result.reduce((a, b) => a + b, 0)}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{t("total")}</p>
              <p className="text-4xl font-bold">{result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
