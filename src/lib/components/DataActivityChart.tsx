"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "شنبه", queries: 12500, inserts: 3200, updates: 1800 },
  { day: "یکشنبه", queries: 13800, inserts: 3500, updates: 2100 },
  { day: "دوشنبه", queries: 15200, inserts: 4100, updates: 2400 },
  { day: "سه‌شنبه", queries: 14500, inserts: 3800, updates: 2200 },
  { day: "چهارشنبه", queries: 16800, inserts: 4500, updates: 2800 },
  { day: "پنجشنبه", queries: 14200, inserts: 3600, updates: 2000 },
  { day: "جمعه", queries: 8500, inserts: 2100, updates: 1200 },
];

export function DataActivityChart() {
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
          <p className="text-sm" style={{ color: colors.primary }}>
            کوئری: {payload[0].value.toLocaleString("fa-IR")}
          </p>
          <p className="text-sm" style={{ color: colors.success }}>
            درج: {payload[1].value.toLocaleString("fa-IR")}
          </p>
          <p className="text-sm" style={{ color: colors.warning }}>
            بروزرسانی: {payload[2].value.toLocaleString("fa-IR")}
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
          فعالیت پایگاه داده
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          تعداد عملیات روی دیتابیس در هفته جاری
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
            domain={[0, 18000]}
            ticks={[0, 3000, 6000, 9000, 12000, 15000, 18000]}
            tickFormatter={(value) => (value / 1000).toLocaleString("fa-IR") + "k"}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: "inherit" }}
            formatter={(value) =>
              value === "queries"
                ? "کوئری"
                : value === "inserts"
                ? "درج"
                : "بروزرسانی"
            }
          />
          <Line
            type="monotone"
            dataKey="queries"
            stroke={colors.primary}
            strokeWidth={3}
            dot={{ fill: colors.primary, r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="inserts"
            stroke={colors.success}
            strokeWidth={3}
            dot={{ fill: colors.success, r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="updates"
            stroke={colors.warning}
            strokeWidth={3}
            dot={{ fill: colors.warning, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}