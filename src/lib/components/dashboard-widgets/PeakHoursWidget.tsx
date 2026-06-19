"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { TrendingUp } from "lucide-react";

const data = [
  { hour: "00", calls: 5 },
  { hour: "02", calls: 3 },
  { hour: "04", calls: 2 },
  { hour: "06", calls: 8 },
  { hour: "08", calls: 25 },
  { hour: "10", calls: 45 },
  { hour: "12", calls: 52 },
  { hour: "14", calls: 48 },
  { hour: "16", calls: 38 },
  { hour: "18", calls: 28 },
  { hour: "20", calls: 15 },
  { hour: "22", calls: 8 },
];

export function PeakHoursWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
            ساعات پربازدید
          </span>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          نمودار توزیع تماس‌ها در 24 ساعت گذشته
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
            />
            <YAxis 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.textPrimary,
              }}
            />
            <Area 
              type="monotone" 
              dataKey="calls" 
              stroke={colors.primary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCalls)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}