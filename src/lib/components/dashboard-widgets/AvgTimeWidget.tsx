"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Clock } from "lucide-react";

const data = [
  { time: "08:00", duration: 3.2 },
  { time: "10:00", duration: 4.5 },
  { time: "12:00", duration: 5.8 },
  { time: "14:00", duration: 4.2 },
  { time: "16:00", duration: 3.9 },
  { time: "18:00", duration: 5.1 },
];

export function AvgTimeWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      {/* Stats */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5" style={{ color: colors.primary }} />
          <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            4 دقیقه 23 ثانیه
          </span>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          میانگین زمان هر تماس در 24 ساعت گذشته
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
            />
            <YAxis 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
              label={{ value: 'دقیقه', angle: -90, position: 'insideLeft', fill: colors.textSecondary, fontSize: 11 }}
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
            <Line 
              type="monotone" 
              dataKey="duration" 
              stroke={colors.primary} 
              strokeWidth={3}
              dot={{ fill: colors.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}