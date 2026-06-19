"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { Zap, TrendingUp } from "lucide-react";

const fastMovingItems = [
  { name: "فرش ۴۰۰*۳ شانه پرستیژ", turnover: 45, days: 8, trend: 12 },
  { name: "مبل راحتی 7 نفره چستر", turnover: 38, days: 10, trend: 8 },
  { name: "موکت ۷۰۰*۵ شانه تراکم ۲۵۰۰", turnover: 35, days: 11, trend: 15 },
  { name: "کوسن تزئینی", turnover: 32, days: 9, trend: 5 },
  { name: "فرش ماشینی ۱۲۰۰*۹ شانه", turnover: 28, days: 12, trend: -3 },
];

export function FastMovingProducts() {
  const colors = useCurrentColors();

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            محصولات پرگردش
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            کالاهای با سرعت فروش بالا
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.success + "22" }}
        >
          <Zap className="w-5 h-5" style={{ color: colors.success }} />
        </div>
      </div>

      <div className="space-y-4">
        {fastMovingItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{
                backgroundColor: index < 2 ? colors.success + "33" : colors.backgroundSecondary,
                color: index < 2 ? colors.success : colors.textSecondary,
              }}
            >
              {(index + 1).toLocaleString("fa-IR")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0 mr-2">
                  <TrendingUp
                    className="w-3 h-3"
                    style={{ color: item.trend > 0 ? colors.success : colors.error }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: item.trend > 0 ? colors.success : colors.error }}
                  >
                    {item.trend > 0 ? "+" : ""}
                    {item.trend.toLocaleString("fa-IR")}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: colors.textSecondary }}>
                  {item.turnover.toLocaleString("fa-IR")} گردش در ماه
                </span>
                <span className="font-semibold" style={{ color: colors.primary }}>
                  هر {item.days.toLocaleString("fa-IR")} روز
                </span>
              </div>
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.turnover / fastMovingItems[0].turnover) * 100}%`,
                    backgroundColor: colors.success,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
