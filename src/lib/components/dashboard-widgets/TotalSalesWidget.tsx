"use client"

import { TrendingUp } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'شنبه', مبلغ: 45000000 },
  { name: 'یکشنبه', مبلغ: 52000000 },
  { name: 'دوشنبه', مبلغ: 48000000 },
  { name: 'سه‌شنبه', مبلغ: 61000000 },
  { name: 'چهارشنبه', مبلغ: 55000000 },
  { name: 'پنج‌شنبه', مبلغ: 67000000 },
  { name: 'جمعه', مبلغ: 58000000 },
];

export function TotalSalesWidget() {
  const colors = useCurrentColors();

  const total = data.reduce((sum, item) => sum + item.مبلغ, 0);
  const average = Math.round(total / data.length);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {total.toLocaleString('fa-IR')} تومان
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              فروش این هفته
            </p>
          </div>
          <div 
            className="px-3 py-1 rounded-full flex items-center gap-1"
            style={{ backgroundColor: colors.success + "15" }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: colors.success }} />
            <span className="text-xs font-medium" style={{ color: colors.success }}>
              +12.5%
            </span>
          </div>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          میانگین روزانه: {average.toLocaleString('fa-IR')} تومان
        </p>
      </div>
      
      <div className="flex-1" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis 
              dataKey="name" 
              stroke={colors.textSecondary}
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke={colors.textSecondary}
              style={{ fontSize: '11px' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
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
              formatter={(value: number) => [`${value.toLocaleString('fa-IR')} تومان`, 'مبلغ فروش']}
            />
            <Area 
              type="monotone" 
              dataKey="مبلغ" 
              stroke={colors.primary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
