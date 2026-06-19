"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "شنبه", in: 85, out: 62 },
  { day: "یکشنبه", in: 72, out: 58 },
  { day: "دوشنبه", in: 95, out: 71 },
  { day: "سه‌شنبه", in: 68, out: 65 },
  { day: "چهارشنبه", in: 110, out: 88 },
  { day: "پنجشنبه", in: 92, out: 75 },
  { day: "جمعه", in: 45, out: 38 },
];

export function WarehouseFlowChart() {
  const colors = useCurrentColors();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <p className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
            {payload[0].payload.day}
          </p>
          <p className="text-sm" style={{ color: colors.success }}>
            ورودی: {payload[0].value.toLocaleString("fa-IR")} قلم
          </p>
          <p className="text-sm" style={{ color: colors.error }}>
            خروجی: {payload[1].value.toLocaleString("fa-IR")} قلم
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
          گردش کالا در انبار
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          ورودی و خروجی هفته جاری
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis
            dataKey="day"
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
          />
          <YAxis
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
            domain={[0, 120]}
            ticks={[0, 20, 40, 60, 80, 100, 120]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: "inherit" }}
            formatter={(value) => (value === "in" ? "ورودی (قلم)" : "خروجی (قلم)")}
          />
          <Line
            type="monotone"
            dataKey="in"
            stroke={colors.success}
            strokeWidth={3}
            dot={{ fill: colors.success, r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="out"
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