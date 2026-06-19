"use client"

import { Package, CheckCircle, Clock, XCircle } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { allSalesData } from "../../data/salesData";
import { useMemo } from "react";

export function OrdersStatusWidget() {
  const colors = useCurrentColors();

  const orderStats = useMemo(() => {
    const total = allSalesData.length;
    const completed = allSalesData.filter(s => s.orderStatus === "تکمیل شده").length;
    const processing = allSalesData.filter(s => s.orderStatus === "در حال پردازش").length;
    const cancelled = allSalesData.filter(s => s.orderStatus === "لغو شده").length;

    const completedPercentage = total > 0 ? ((completed / total) * 100).toFixed(0) : "0";
    const processingPercentage = total > 0 ? ((processing / total) * 100).toFixed(0) : "0";
    const cancelledPercentage = total > 0 ? ((cancelled / total) * 100).toFixed(0) : "0";

    return {
      total,
      completed,
      processing,
      cancelled,
      completedPercentage,
      processingPercentage,
      cancelledPercentage,
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          وضعیت سفارشات
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Package className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* کل سفارشات */}
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
                کل سفارشات
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {orderStats.total}
              </p>
            </div>
            <Package className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
        </div>

        {/* تفکیک وضعیت */}
        <div className="space-y-2">
          {/* تکمیل شده */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: colors.success + "15" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: colors.success }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  تکمیل شده
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: colors.success }}>
                {orderStats.completed}
              </span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: colors.success,
                  width: `${orderStats.completedPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* در حال پردازش */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: colors.warning + "15" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: colors.warning }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  در حال پردازش
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: colors.warning }}>
                {orderStats.processing}
              </span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: colors.warning,
                  width: `${orderStats.processingPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* لغو شده */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: colors.error + "15" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4" style={{ color: colors.error }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  لغو شده
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: colors.error }}>
                {orderStats.cancelled}
              </span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: colors.error,
                  width: `${orderStats.cancelledPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
