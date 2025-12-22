"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { simpleInterest } from "@utilpedia/math/core";
import * as v from "valibot";
import dynamic from "next/dynamic";

// Lazy load the entire chart component as one unit
const InterestChart = dynamic(
  () => import("./InterestChart").then((mod) => mod.InterestChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] rounded flex items-center justify-center bg-background-muted">
        <div className="w-8 h-8 border-4 rounded-full animate-spin border-border border-t-primary" />
      </div>
    ),
  }
);

interface ChartData {
  period: number;
  principal: number;
  interest: number;
}

type TimeUnit = "years" | "months";
type RatePeriod = "annual" | "monthly";

const principalSchema = v.pipe(
  v.string(),
  v.transform((val) => parseFloat(val)),
  v.number("Must be a number"),
  v.minValue(0.01, "Must be greater than 0")
);

const rateSchema = v.pipe(
  v.string(),
  v.transform((val) => parseFloat(val)),
  v.number("Must be a number"),
  v.minValue(0, "Cannot be negative"),
  v.maxValue(100, "Maximum 100%")
);

const periodSchema = (unit: TimeUnit) =>
  v.pipe(
    v.string(),
    v.transform((val) => parseInt(val, 10)),
    v.number("Must be a number"),
    v.integer("Must be a whole number"),
    v.minValue(1, unit === "years" ? "Minimum 1 year" : "Minimum 1 month"),
    v.maxValue(
      unit === "years" ? 50 : 600,
      unit === "years" ? "Maximum 50 years" : "Maximum 600 months"
    )
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function SimpleInterestTool() {
  const t = useTranslations("simpleInterestTool");

  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("annual");
  const [period, setPeriod] = useState("10");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("years");
  const [errors, setErrors] = useState<{
    principal?: string;
    rate?: string;
    period?: string;
  }>({});
  const [result, setResult] = useState<{
    finalBalance: number;
    totalInterest: number;
    monthlyChartData: ChartData[] | null;
    yearlyChartData: ChartData[];
    canToggleView: boolean;
  } | null>(null);
  const [showMonthlyChart, setShowMonthlyChart] = useState(false);

  const handlePrincipalChange = (value: string) => {
    setPrincipal(value);
    setResult(null);
    const res = validate(principalSchema, value);
    setErrors((prev) => ({
      ...prev,
      principal: res.success ? undefined : res.error,
    }));
  };

  const handleRateChange = (value: string) => {
    setRate(value);
    setResult(null);
    const res = validate(rateSchema, value);
    setErrors((prev) => ({
      ...prev,
      rate: res.success ? undefined : res.error,
    }));
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    setResult(null);
    const res = validate(periodSchema(timeUnit), value);
    setErrors((prev) => ({
      ...prev,
      period: res.success ? undefined : res.error,
    }));
  };

  const handleTimeUnitChange = (unit: TimeUnit) => {
    setTimeUnit(unit);
    setResult(null);
    const res = validate(periodSchema(unit), period);
    setErrors((prev) => ({
      ...prev,
      period: res.success ? undefined : res.error,
    }));
  };

  const handleRatePeriodChange = (rp: RatePeriod) => {
    setRatePeriod(rp);
    setResult(null);
  };

  const handleCalculate = () => {
    const principalResult = validate(principalSchema, principal);
    const rateResult = validate(rateSchema, rate);
    const periodResult = validate(periodSchema(timeUnit), period);

    setErrors({
      principal: principalResult.success ? undefined : principalResult.error,
      rate: rateResult.success ? undefined : rateResult.error,
      period: periodResult.success ? undefined : periodResult.error,
    });

    if (
      !principalResult.success ||
      !rateResult.success ||
      !periodResult.success
    ) {
      setResult(null);
      return;
    }

    const p = principalResult.data;
    const ratePercent = rateResult.data / 100;
    const periodValue = periodResult.data;

    let ratePerPeriod: number;
    if (ratePeriod === "annual" && timeUnit === "months") {
      ratePerPeriod = ratePercent / 12;
    } else if (ratePeriod === "monthly" && timeUnit === "years") {
      ratePerPeriod = ratePercent * 12;
    } else {
      ratePerPeriod = ratePercent;
    }

    const {
      interest: totalInterest,
      finalBalance,
      schedule,
    } = simpleInterest(p, ratePerPeriod, periodValue);

    let monthlyChartData: ChartData[] | null = null;
    let yearlyChartData: ChartData[];

    if (timeUnit === "months") {
      monthlyChartData = schedule
        .filter((entry) => entry.period > 0)
        .map((entry) => ({
          period: entry.period,
          principal: p,
          interest: entry.interestToDate,
        }));

      const yearlyRate = ratePerPeriod * 12;
      const totalYears = Math.ceil(periodValue / 12);
      const { schedule: yearlySchedule } = simpleInterest(
        p,
        yearlyRate,
        totalYears
      );
      yearlyChartData = yearlySchedule
        .filter((entry) => entry.period > 0)
        .map((entry) => ({
          period: entry.period,
          principal: p,
          interest: entry.interestToDate,
        }));
    } else {
      yearlyChartData = schedule
        .filter((entry) => entry.period > 0)
        .map((entry) => ({
          period: entry.period,
          principal: p,
          interest: entry.interestToDate,
        }));
    }

    setShowMonthlyChart(false);

    setResult({
      finalBalance,
      totalInterest,
      monthlyChartData,
      yearlyChartData,
      canToggleView: timeUnit === "months",
    });
  };

  const hasErrors = Boolean(errors.principal || errors.rate || errors.period);

  const chartData =
    showMonthlyChart && result?.monthlyChartData
      ? result.monthlyChartData
      : result?.yearlyChartData;
  const isShowingMonths = showMonthlyChart && result?.monthlyChartData;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>

      {/* Starting Amount */}
      <div className="space-y-2">
        <label
          htmlFor="principal"
          className="block text-lg font-bold text-foreground"
        >
          {t("principal")}
        </label>
        <input
          id="principal"
          type="number"
          min="0.01"
          step="100"
          value={principal}
          onChange={(e) => handlePrincipalChange(e.target.value)}
          aria-invalid={errors.principal ? "true" : "false"}
          aria-describedby={errors.principal ? "principal-error" : undefined}
          className={`w-full px-3 py-2 focus-ring bg-background text-foreground border ${
            errors.principal
              ? "border-input-border-error"
              : "border-input-border"
          }`}
        />
        {errors.principal && (
          <p
            id="principal-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.principal}
          </p>
        )}
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <label
          htmlFor="rate"
          className="block text-lg font-bold text-foreground"
        >
          {ratePeriod === "annual" ? t("rateAnnual") : t("rateMonthly")}
        </label>
        <input
          id="rate"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={rate}
          onChange={(e) => handleRateChange(e.target.value)}
          aria-invalid={errors.rate ? "true" : "false"}
          aria-describedby={errors.rate ? "rate-error" : undefined}
          className={`w-full px-3 py-2 focus-ring bg-background text-foreground border ${
            errors.rate ? "border-input-border-error" : "border-input-border"
          }`}
        />
        <select
          value={ratePeriod}
          onChange={(e) => handleRatePeriodChange(e.target.value as RatePeriod)}
          aria-label={t("ratePeriodLabel")}
          className="w-full px-3 py-2 focus-ring mt-2 border border-input-border bg-background text-foreground"
        >
          <option value="annual">{t("perYear")}</option>
          <option value="monthly">{t("perMonth")}</option>
        </select>
        {errors.rate && (
          <p id="rate-error" className="text-sm text-destructive" role="alert">
            {errors.rate}
          </p>
        )}
      </div>

      {/* Time Period */}
      <div className="space-y-2">
        <label
          htmlFor="period"
          className="block text-lg font-bold text-foreground"
        >
          {t("timePeriod")}
        </label>
        <input
          id="period"
          type="number"
          min="1"
          max={timeUnit === "years" ? 50 : 600}
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          aria-invalid={errors.period ? "true" : "false"}
          aria-describedby={errors.period ? "period-error" : undefined}
          className={`w-full px-3 py-2 focus-ring bg-background text-foreground border ${
            errors.period ? "border-input-border-error" : "border-input-border"
          }`}
        />
        <select
          value={timeUnit}
          onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
          aria-label={t("timeUnitLabel")}
          className="w-full px-3 py-2 focus-ring mt-2 border border-input-border bg-background text-foreground"
        >
          <option value="years">{t("years")}</option>
          <option value="months">{t("months")}</option>
        </select>
        {errors.period && (
          <p
            id="period-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.period}
          </p>
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={hasErrors}
        className={`px-8 py-3 font-medium tracking-wide uppercase transition-colors focus-ring ${
          hasErrors
            ? "bg-border text-foreground-muted cursor-not-allowed"
            : "bg-primary text-primary-foreground cursor-pointer"
        }`}
      >
        {t("calculate")}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="p-4 rounded-lg space-y-2 bg-background-muted">
            <div className="flex justify-between">
              <span className="text-foreground-muted">
                {t("totalInterest")}
              </span>
              <span className="font-bold text-foreground">
                {formatCurrency(result.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">{t("finalBalance")}</span>
              <span className="font-bold text-lg text-primary">
                {formatCurrency(result.finalBalance)}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="p-4 rounded-lg bg-background-muted">
            <h2 className="text-lg font-bold mb-4 text-foreground">
              {t("growthOverTime")}
            </h2>

            {chartData && (
              <InterestChart
                data={chartData}
                xAxisLabel={isShowingMonths ? t("months") : t("years")}
                tooltipLabelPrefix={isShowingMonths ? "Month" : "Year"}
                principalLabel={t("principalLabel")}
                interestLabel={t("interestLabel")}
              />
            )}

            {/* Toggle for monthly/yearly view */}
            {result.canToggleView && (
              <label className="flex items-center gap-2 mt-4 cursor-pointer text-foreground-muted">
                <input
                  type="checkbox"
                  checked={showMonthlyChart}
                  onChange={(e) => setShowMonthlyChart(e.target.checked)}
                  className="w-4 h-4 rounded focus-ring accent-primary"
                />
                <span className="text-sm">{t("showMonthlyBreakdown")}</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
