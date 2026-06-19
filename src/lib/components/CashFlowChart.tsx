"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "فروردین", income: 25000000, expense: 12000000 },
  { month: "اردیبهشت", income: 28000000, expense: 13500000 },
  { month: "خرداد", income: 26000000, expense: 12800000 },
  { month: "تیر", income: 32000000, expense: 15000000 },
  { month: "مرداد", income: 29000000, expense: 14200000 },
  { month: "شهریور", income: 35000000, expense: 16500000 },
  { month: "مهر", income: 38000000, expense: 17200000 },
  { month: "آبان", income: 36000000, expense: 16800000 },
  { month: "آذر", income: 42000000, expense: 19000000 },
  { month: "دی", income: 45000000, expense: 20500000 },
];

export function CashFlowChart() {
  const colors = useCurrentColors();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const profit = payload[0].value - payload[1].value;
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <p className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
            {payload[0].payload.month}
          </p>
          <p className="text-sm" style={{ color: colors.success }}>
            درآمد: {(payload[0].value / 1000000).toLocaleString("fa-IR")} میلیون
          </p>
          <p className="text-sm" style={{ color: colors.error }}>
            هزینه: {(payload[1].value / 1000000).toLocaleString("fa-IR")} میلیون
          </p>
          <p className="text-sm font-semibold mt-2" style={{ color: colors.primary }}>
            سود: {(profit / 1000000).toLocaleString("fa-IR")} میلیون
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
          جریان نقدینگی
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          مقایسه درآمد و هزینه ماهانه
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis
            dataKey="month"
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
          />
          <YAxis
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
            domain={[10000000, 50000000]}
            ticks={[10000000, 20000000, 30000000, 40000000, 50000000]}
            tickFormatter={(value) => (value / 1000000).toLocaleString("fa-IR") + "م"}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: "inherit" }}
            formatter={(value) =>
              value === "income" ? "درآمد (میلیون تومان)" : "هزینه (میلیون تومان)"
            }
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke={colors.success}
            strokeWidth={3}
            dot={{ fill: colors.success, r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke={colors.error}
            strokeWidth={3}
            dot={{ fill: colors.error, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}