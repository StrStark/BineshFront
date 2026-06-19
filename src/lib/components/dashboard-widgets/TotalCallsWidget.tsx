"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "شنبه", calls: 45 },
  { name: "یک‌شنبه", calls: 52 },
  { name: "دوشنبه", calls: 38 },
  { name: "سه‌شنبه", calls: 61 },
  { name: "چهارشنبه", calls: 48 },
  { name: "پنج‌شنبه", calls: 55 },
  { name: "جمعه", calls: 42 },
];

export function TotalCallsWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      {/* Stats */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
            1,247
          </span>
          <span className="text-sm" style={{ color: colors.textSecondary }}>
            تماس
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" style={{ color: colors.success }} />
          <span className="text-xs" style={{ color: colors.success }}>
            +12.5%
          </span>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            نسبت به هفته قبل
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
            />
            <YAxis 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.textPrimary,
              }}
              labelStyle={{ color: colors.textPrimary }}
            />
            <Bar dataKey="calls" fill={colors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}