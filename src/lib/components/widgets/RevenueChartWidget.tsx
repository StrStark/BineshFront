"use client"

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { allSalesData } from "../../data/salesData";
import { useMemo } from "react";

export function RevenueChartWidget() {
  const colors = useCurrentColors();

  const revenueStats = useMemo(() => {
    const paid = allSalesData
      .filter(s => s.paymentStatus === "پرداخت شده")
      .reduce((sum, s) => sum + s.amount, 0);
    
    const pending = allSalesData
      .filter(s => s.paymentStatus === "در انتظار")
      .reduce((sum, s) => sum + s.amount, 0);
    
    const cancelled = allSalesData
      .filter(s => s.paymentStatus === "لغو شده")
      .reduce((sum, s) => sum + s.amount, 0);

    const total = paid + pending + cancelled;
    const paidPercentage = total > 0 ? ((paid / total) * 100).toFixed(1) : "0";

    return { paid, pending, cancelled, total, paidPercentage };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          درآمد و مالی
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <DollarSign className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* کل درآمد */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.primary + "10",
            borderColor: colors.primary + "30",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              کل درآمد
            </p>
            <TrendingUp className="w-4 h-4" style={{ color: colors.success }} />
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            {(revenueStats.total / 1000000).toFixed(1)} میلیون
          </p>
          <p className="text-xs" style={{ color: colors.success }}>
            {revenueStats.paidPercentage}% دریافت شده
          </p>
        </div>

        {/* تفکیک درآمد */}
        <div className="space-y-2">
          <div
            className="p-3 rounded-lg flex items-center justify-between"
            style={{
              backgroundColor: colors.success + "15",
              borderLeft: `4px solid ${colors.success}`
            }}
          >
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                دریافت شده
              </p>
              <p className="text-sm font-bold" style={{ color: colors.success }}>
                {(revenueStats.paid / 1000000).toFixed(1)} م
              </p>
            </div>
            <TrendingUp className="w-5 h-5" style={{ color: colors.success }} />
          </div>

          <div
            className="p-3 rounded-lg flex items-center justify-between"
            style={{
              backgroundColor: colors.warning + "15",
              borderLeft: `4px solid ${colors.warning}`
            }}
          >
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                در انتظار
              </p>
              <p className="text-sm font-bold" style={{ color: colors.warning }}>
                {(revenueStats.pending / 1000000).toFixed(1)} م
              </p>
            </div>
            <DollarSign className="w-5 h-5" style={{ color: colors.warning }} />
          </div>

          <div
            className="p-3 rounded-lg flex items-center justify-between"
            style={{
              backgroundColor: colors.error + "15",
              borderLeft: `4px solid ${colors.error}`
            }}
          >
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                لغو شده
              </p>
              <p className="text-sm font-bold" style={{ color: colors.error }}>
                {(revenueStats.cancelled / 1000000).toFixed(1)} م
              </p>
            </div>
            <TrendingDown className="w-5 h-5" style={{ color: colors.error }} />
          </div>
        </div>
      </div>
    </div>
  );
}
