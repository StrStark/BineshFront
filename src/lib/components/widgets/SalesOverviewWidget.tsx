"use client"

import { TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { allSalesData } from "../../data/salesData";
import { useMemo } from "react";

export function SalesOverviewWidget() {
  const colors = useCurrentColors();

  const stats = useMemo(() => {
    const total = allSalesData.length;
    const completed = allSalesData.filter(s => s.orderStatus === "تکمیل شده").length;
    const totalRevenue = allSalesData
      .filter(s => s.paymentStatus === "پرداخت شده")
      .reduce((sum, s) => sum + s.amount, 0);
    const pending = allSalesData.filter(s => s.orderStatus === "در حال پردازش").length;

    return { total, completed, totalRevenue, pending };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          خلاصه فروش
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <ShoppingCart className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* کل فروش */}
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
                کل فروش
              </p>
              <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                {stats.total}
              </p>
            </div>
            <TrendingUp className="w-5 h-5" style={{ color: colors.success }} />
          </div>
        </div>

        {/* درآمد کل */}
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
                درآمد کل
              </p>
              <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {(stats.totalRevenue / 1000000).toFixed(1)} م
              </p>
            </div>
            <DollarSign className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="p-2.5 rounded-lg text-center"
            style={{ backgroundColor: colors.success + "15" }}
          >
            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
              تکمیل شده
            </p>
            <p className="font-bold" style={{ color: colors.success }}>
              {stats.completed}
            </p>
          </div>
          <div
            className="p-2.5 rounded-lg text-center"
            style={{ backgroundColor: colors.warning + "15" }}
          >
            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
              در حال پردازش
            </p>
            <p className="font-bold" style={{ color: colors.warning }}>
              {stats.pending}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
