"use client"

import { Package, Layers, TrendingUp } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { allSalesData } from "../../data/salesData";
import { useMemo } from "react";

export function ProductsCategoryWidget() {
  const colors = useCurrentColors();

  const categoryStats = useMemo(() => {
    const categories = allSalesData.reduce((acc, sale) => {
      const cat = sale.category;
      if (!acc[cat]) {
        acc[cat] = { count: 0, revenue: 0 };
      }
      acc[cat].count += sale.quantity;
      if (sale.paymentStatus === "پرداخت شده") {
        acc[cat].revenue += sale.amount;
      }
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const sorted = Object.entries(categories)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 4);

    return sorted;
  }, []);

  const totalProducts = useMemo(() => {
    return allSalesData.reduce((sum, s) => sum + s.quantity, 0);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          دسته‌بندی محصولات
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Package className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* کل محصولات فروخته شده */}
        <div
          className="p-3 rounded-lg border"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                کل محصولات فروخته شده
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {totalProducts}
              </p>
            </div>
            <Layers className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
        </div>

        {/* برترین دسته‌ها */}
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            برترین دسته‌بندی‌ها
          </p>
          {categoryStats.map(([category, data], index) => {
            const colors_array = [colors.primary, colors.success, colors.warning, colors.error];
            const color = colors_array[index % colors_array.length];
            
            return (
              <div
                key={category}
                className="p-2.5 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: color + "15" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm" style={{ color: colors.textPrimary }}>
                    {category}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold" style={{ color }}>
                    {data.count} عدد
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {(data.revenue / 1000000).toFixed(1)} م
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
