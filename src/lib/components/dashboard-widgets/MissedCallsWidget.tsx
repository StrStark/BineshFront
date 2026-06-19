"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { PhoneOff, TrendingDown } from "lucide-react";

export function MissedCallsWidget() {
  const colors = useCurrentColors();

  const missedCallsData = [
    { day: "شنبه", count: 12 },
    { day: "یک‌شنبه", count: 8 },
    { day: "دوشنبه", count: 15 },
    { day: "سه‌شنبه", count: 6 },
    { day: "چهارشنبه", count: 10 },
    { day: "پنج‌شنبه", count: 7 },
    { day: "جمعه", count: 4 },
  ];

  const totalMissed = missedCallsData.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...missedCallsData.map(item => item.count));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PhoneOff className="w-5 h-5" style={{ color: colors.error }} />
            <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {totalMissed}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: colors.error }}>
            <TrendingDown className="w-3 h-3" />
            <span>-23%</span>
          </div>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          تماس‌های از دست رفته این هفته
        </p>
      </div>

      <div className="flex-1 flex items-end gap-1.5">
        {missedCallsData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full rounded-t transition-all"
              style={{ 
                height: `${(item.count / maxCount) * 100}%`,
                backgroundColor: colors.error,
                opacity: 0.7,
                minHeight: '20px'
              }}
            />
            <span className="text-[10px]" style={{ color: colors.textTertiary }}>
              {item.day.substring(0, 2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
