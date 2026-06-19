"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "علی احمدی", sales: 45, revenue: 18500000 },
  { name: "زهرا محمدی", sales: 38, revenue: 15200000 },
  { name: "محمد رضایی", sales: 35, revenue: 14000000 },
  { name: "فاطمه کریمی", sales: 32, revenue: 12800000 },
  { name: "حسین نوری", sales: 28, revenue: 11200000 },
];

export function TopSellersChart() {
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
            {payload[0].payload.name}
          </p>
          <p className="text-sm" style={{ color: colors.primary }}>
            تعداد فروش: {payload[0].value.toLocaleString("fa-IR")}
          </p>
          <p className="text-sm" style={{ color: colors.success }}>
            مبلغ: {(payload[1].value / 1000000).toLocaleString("fa-IR")} میلیون تومان
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
          فروشندگان برتر
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          مقایسه عملکرد فروشندگان
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis
            dataKey="name"
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
          />
          <YAxis
            yAxisId="left"
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={colors.textSecondary}
            style={{ fontSize: "12px", fontFamily: "inherit" }}
            tickFormatter={(value) => (value / 1000000).toLocaleString("fa-IR") + "م"}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: "inherit" }}
            formatter={(value) =>
              value === "sales" ? "تعداد فروش" : "مبلغ فروش (میلیون تومان)"
            }
          />
          <Bar yAxisId="left" dataKey="sales" fill={colors.primary} radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="revenue" fill={colors.success} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
