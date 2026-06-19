"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Star } from "lucide-react";

const data = [
  { rating: "1 ستاره", count: 12, stars: 1 },
  { rating: "2 ستاره", count: 18, stars: 2 },
  { rating: "3 ستاره", count: 45, stars: 3 },
  { rating: "4 ستاره", count: 89, stars: 4 },
  { rating: "5 ستاره", count: 156, stars: 5 },
];

export function SatisfactionWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.warning}11` }}
        >
          <Star className="w-6 h-6" fill={colors.warning} stroke={colors.warning} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>4.6</p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>از 5 ستاره</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis 
              type="number"
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
            />
            <YAxis 
              type="category"
              dataKey="rating" 
              tick={{ fill: colors.textSecondary, fontSize: 11 }}
              stroke={colors.border}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.textPrimary,
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors.warning} opacity={0.3 + (index * 0.15)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}