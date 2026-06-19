"use client"

import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'موجود', value: 245, color: '#00c853' },
  { name: 'کم موجود', value: 38, color: '#ff9800' },
  { name: 'ناموجود', value: 12, color: '#e92c2c' },
];

export function InventoryStatusWidget() {
  const colors = useCurrentColors();

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          وضعیت انبار
        </p>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          وضعیت موجودی {total} محصول
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
        {/* Chart */}
        <div className="w-full md:w-1/2" style={{ minHeight: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  borderRadius: '8px',
                  fontSize: '12px',
                  direction: 'rtl'
                }}
                formatter={(value: number) => [`${value} محصول`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="w-full md:w-1/2 space-y-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs" style={{ color: colors.textPrimary }}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                  {item.value}
                </span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert */}
      {data[2].value > 0 && (
        <div
          className="mt-3 p-2 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: colors.warning + "15" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: colors.warning }} />
          <p className="text-xs" style={{ color: colors.textPrimary }}>
            {data[1].value + data[2].value} محصول نیاز به بررسی دارد
          </p>
        </div>
      )}
    </div>
  );
}
