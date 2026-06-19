"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Timer, TrendingDown } from "lucide-react";

export function FirstResponseTimeWidget() {
  const colors = useCurrentColors();

  const avgResponseTime = 18; // seconds
  const target = 20;
  const change = -15.3;

  const timeData = [
    { label: "< 10 ثانیه", percentage: 35, color: colors.success },
    { label: "10-20 ثانیه", percentage: 42, color: colors.primary },
    { label: "20-30 ثانیه", percentage: 18, color: colors.warning },
    { label: "> 30 ثانیه", percentage: 5, color: colors.error },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" style={{ color: colors.primary }} />
            <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {avgResponseTime}
              <span className="text-sm mr-1" style={{ color: colors.textSecondary }}>ثانیه</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: colors.success }}>
            <TrendingDown className="w-3 h-3" />
            <span>{change}%</span>
          </div>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          زمان پاسخگویی اول
        </p>
      </div>

      <div className="flex-1 space-y-2">
        {timeData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                {item.label}
              </span>
              <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                {item.percentage}%
              </span>
            </div>
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: colors.border }}
            >
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div 
        className="mt-3 p-2 rounded text-center"
        style={{ 
          backgroundColor: avgResponseTime < target ? `${colors.success}11` : `${colors.warning}11`
        }}
      >
        <p className="text-[10px]" style={{ color: colors.textSecondary }}>
          {avgResponseTime < target ? "✓ زیر هدف قرار دارد" : "⚠ نیاز به بهبود"}
        </p>
      </div>
    </div>
  );
}
