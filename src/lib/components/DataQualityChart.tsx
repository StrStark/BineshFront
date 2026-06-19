"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { table: "مشتریان", complete: 42000, incomplete: 3680 },
  { table: "فروش", complete: 118000, incomplete: 7340 },
  { table: "موجودی", complete: 8200, incomplete: 750 },
  { table: "مالی", complete: 30500, incomplete: 1680 },
  { table: "تماس‌ها", complete: 85000, incomplete: 4450 },
];

export function DataQualityChart() {
  const colors = useCurrentColors();
  
  // رنگ‌های پاستیلی برای چارت
  const pastelGreen = "#88D8B0";
  const pastelPink = "#FFB3BA";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].value + payload[1].value;
      const completePercent = Number(((payload[0].value / total) * 100).toFixed(1));
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <p className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
            {payload[0].payload.table}
          </p>
          <p className="text-sm" style={{ color: pastelGreen }}>
            کامل: {payload[0].value.toLocaleString("fa-IR")} ({completePercent.toLocaleString("fa-IR")}%)
          </p>
          <p className="text-sm" style={{ color: pastelPink }}>
            ناقص: {payload[1].value.toLocaleString("fa-IR")}
          </p>
          <p className="text-sm font-semibold mt-2 pt-2 border-t" style={{ color: colors.textPrimary, borderColor: colors.border }}>
            مجموع: {total.toLocaleString("fa-IR")} رکورد
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
          کیفیت داده‌ها
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          مقایسه رکوردهای کامل و ناقص
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis
            dataKey="table"
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
          />
          <YAxis
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
            tickFormatter={(value) => (value / 1000).toLocaleString("fa-IR") + "k"}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: "inherit" }}
            formatter={(value) => (value === "complete" ? "رکورد کامل" : "رکورد ناقص")}
          />
          <Bar dataKey="complete" stackId="a" fill={pastelGreen} radius={[0, 0, 0, 0]} />
          <Bar dataKey="incomplete" stackId="a" fill={pastelPink} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Quality Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.success + "11", border: `1px solid ${colors.success}33` }}
        >
          <p className="text-xs mb-1" style={{ color: colors.success }}>
            کیفیت کلی
          </p>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            ۹۴.۲%
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
            عالی
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.error + "11", border: `1px solid ${colors.error}33` }}
        >
          <p className="text-xs mb-1" style={{ color: colors.error }}>
            نیاز به بهبود
          </p>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            ۱۷,۹۰۰
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
            رکورد ناقص
          </p>
        </div>
      </div>
    </div>
  );
}