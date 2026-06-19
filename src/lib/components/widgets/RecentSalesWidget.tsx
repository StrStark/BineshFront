"use client"

import { ShoppingBag, Calendar } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { allSalesData } from "../../data/salesData";
import { useMemo } from "react";

export function RecentSalesWidget() {
  const colors = useCurrentColors();

  const recentSales = useMemo(() => {
    return allSalesData.slice(0, 6);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          فروش‌های اخیر
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <ShoppingBag className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-auto">
        {recentSales.map((sale) => {
          const statusColor =
            sale.paymentStatus === "پرداخت شده"
              ? colors.success
              : sale.paymentStatus === "در انتظار"
              ? colors.warning
              : colors.error;

          return (
            <div
              key={sale.id}
              className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate mb-1" style={{ color: colors.textPrimary }}>
                    {sale.productName}
                  </p>
                  <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                    {sale.customer}
                  </p>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-medium flex-shrink-0 mr-2"
                  style={{
                    backgroundColor: statusColor + "15",
                    color: statusColor,
                  }}
                >
                  {sale.paymentStatus}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{sale.date}</span>
                </div>
                <p className="text-sm font-bold" style={{ color: colors.primary }}>
                  {(sale.amount / 1000000).toFixed(1)} م
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
