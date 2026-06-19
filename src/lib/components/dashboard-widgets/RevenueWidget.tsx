"use client"

import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'مهر', revenue: 850000000 },
  { month: 'آبان', revenue: 920000000 },
  { month: 'آذر', revenue: 1050000000 },
  { month: 'دی', revenue: 1150000000 },
];

export function RevenueWidget() {
  const colors = useCurrentColors();

  const currentMonth = data[data.length - 1].revenue;
  const previousMonth = data[data.length - 2].revenue;
  const growth = ((currentMonth - previousMonth) / previousMonth) * 100;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {currentMonth.toLocaleString('fa-IR')} تومان
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              درآمد ماه جاری
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full flex items-center gap-1"
            style={{ backgroundColor: colors.success + "15" }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: colors.success }} />
            <span className="text-xs font-medium" style={{ color: colors.success }}>
              +{growth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1" style={{ minHeight: '180px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="month"
              stroke={colors.textSecondary}
              style={{ fontSize: '11px' }}
            />
            <YAxis
              stroke={colors.textSecondary}
              style={{ fontSize: '11px' }}
              tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderRadius: '8px',
                fontSize: '12px',
                direction: 'rtl'
              }}
              labelStyle={{ color: colors.textPrimary }}
              formatter={(value: number) => [`${value.toLocaleString('fa-IR')} تومان`, 'درآمد']}
            />
            <Bar dataKey="revenue" fill={colors.primary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: colors.backgroundSecondary }}
        >
          <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
            میانگین ماهانه
          </p>
          <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
            {(data.reduce((sum, item) => sum + item.revenue, 0) / data.length / 1000000).toFixed(0)}M
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: colors.backgroundSecondary }}
        >
          <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
            رشد نسبت به ماه قبل
          </p>
          <p className="text-sm font-bold" style={{ color: colors.success }}>
            +{growth.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
