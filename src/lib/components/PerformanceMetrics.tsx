"use client"

import { TrendingUp, TrendingDown, Minus as MinusIcon } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

const metrics: Metric[] = [
  {
    label: "نرخ پاسخگویی",
    value: "94.5%",
    change: 2.3,
    changeLabel: "نسبت به ماه گذشته",
  },
  {
    label: "زمان متوسط انتظار",
    value: "45 ثانیه",
    change: -12.5,
    changeLabel: "بهبود نسبت به هفته گذشته",
  },
  {
    label: "رضایت مشتریان",
    value: "4.2/5",
    change: 0,
    changeLabel: "بدون تغییر",
  },
  {
    label: "تماس‌های حل شده در اولین تماس",
    value: "78%",
    change: 5.2,
    changeLabel: "افزایش این هفته",
  },
];

export function PerformanceMetrics() {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-[#10A242]" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-[#ED3237]" />;
    return <MinusIcon className="w-4 h-4 text-[#969696]" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-[#10A242]";
    if (change < 0) return "text-[#ED3237]";
    return "text-[#969696]";
  };

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142] p-6 transition-colors duration-300" dir="rtl">
      <h3 className="text-lg font-semibold text-[#1c1c1c] dark:text-white mb-4" dir="auto">
        شاخص‌های عملکردی
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[#f7f9fb] dark:bg-[#252b3d] rounded-lg p-4 transition-colors"
          >
            <p className="text-sm text-[#585757] dark:text-[#8b92a8] mb-2" dir="auto">
              {metric.label}
            </p>
            <p className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-3">
              {metric.value}
            </p>
            <div className="flex items-center gap-2">
              {getTrendIcon(metric.change)}
              <div className="flex-1">
                <p className={`text-xs font-medium ${getTrendColor(metric.change)}`}>
                  {metric.change !== 0 &&
                    `${metric.change > 0 ? "+" : ""}${metric.change}%`}
                  {metric.change === 0 && "بدون تغییر"}
                </p>
                <p className="text-xs text-[#969696] dark:text-[#6b7280]" dir="auto">
                  {metric.changeLabel}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}