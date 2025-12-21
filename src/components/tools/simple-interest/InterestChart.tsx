"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Chart colors
const CHART_COLORS = {
  principal: "#1e40af", // Dark blue
  interest: "#60a5fa", // Light blue
};

interface ChartData {
  period: number;
  principal: number;
  interest: number;
}

interface InterestChartProps {
  data: ChartData[];
  xAxisLabel: string;
  tooltipLabelPrefix: string;
  principalLabel: string;
  interestLabel: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function InterestChart({
  data,
  xAxisLabel,
  tooltipLabelPrefix,
  principalLabel,
  interestLabel,
}: InterestChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis
            dataKey="period"
            stroke="var(--foreground-muted)"
            tick={{ fill: "var(--foreground-muted)" }}
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -5,
              fill: "var(--foreground-muted)",
            }}
          />
          <YAxis
            stroke="var(--foreground-muted)"
            tick={{ fill: "var(--foreground-muted)" }}
            tickFormatter={(value) =>
              value >= 1000
                ? `$${(value / 1000).toFixed(0)}k`
                : `$${value.toFixed(0)}`
            }
          />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? formatCurrency(value) : value
            }
            labelFormatter={(label) => `${tooltipLabelPrefix} ${label}`}
            contentStyle={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          />
          <Legend />
          <Bar
            dataKey="principal"
            stackId="total"
            fill={CHART_COLORS.principal}
            name={principalLabel}
          />
          <Bar
            dataKey="interest"
            stackId="total"
            fill={CHART_COLORS.interest}
            name={interestLabel}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
