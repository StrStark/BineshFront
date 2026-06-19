"use client"

import { Award, TrendingUp, User } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { allSalesData } from "../../data/salesData";
import { useMemo } from "react";

export function TopSellersWidget() {
  const colors = useCurrentColors();

  const topSellers = useMemo(() => {
    const sellerStats = allSalesData.reduce((acc, sale) => {
      const seller = sale.seller || "نامشخص";
      if (!acc[seller]) {
        acc[seller] = { count: 0, revenue: 0 };
      }
      acc[seller].count += 1;
      if (sale.paymentStatus === "پرداخت شده") {
        acc[seller].revenue += sale.amount;
      }
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    return Object.entries(sellerStats)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          برترین فروشندگان
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Award className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-auto">
        {topSellers.map(([seller, data], index) => {
          const rankColors = [
            colors.warning,
            colors.textSecondary,
            "#CD7F32", // Bronze
            colors.primary,
            colors.success
          ];
          const rankColor = rankColors[index] || colors.textSecondary;

          return (
            <div
              key={seller}
              className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center gap-3">
                {/* رتبه */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: rankColor + "20" }}
                >
                  <span className="text-sm font-bold" style={{ color: rankColor }}>
                    {index + 1}
                  </span>
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} />
                    <p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
                      {seller}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {data.count} فروش
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" style={{ color: colors.success }} />
                      <p className="text-xs font-bold" style={{ color: colors.success }}>
                        {(data.revenue / 1000000).toFixed(1)} م
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
