"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Trophy, Star } from "lucide-react";

export function TopPerformersWidget() {
  const colors = useCurrentColors();

  const topPerformers = [
    { name: "سارا احمدی", calls: 127, rating: 4.9, rank: 1 },
    { name: "علی رضایی", calls: 118, rating: 4.8, rank: 2 },
    { name: "مریم کریمی", calls: 112, rating: 4.7, rank: 3 },
  ];

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return colors.textTertiary;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5" style={{ color: "#FFD700" }} />
        <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
          برترین کارشناسان
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {topPerformers.map((performer) => (
          <div
            key={performer.rank}
            className="flex items-center gap-3 p-2 rounded-lg transition-colors"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{
                backgroundColor: `${getMedalColor(performer.rank)}22`,
                color: getMedalColor(performer.rank),
              }}
            >
              {performer.rank}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: colors.textPrimary }}>
                {performer.name}
              </p>
              <p className="text-[10px]" style={{ color: colors.textSecondary }}>
                {performer.calls} تماس
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3 h-3 fill-current" style={{ color: "#FFD700" }} />
              <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                {performer.rating}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="mt-3 p-2 rounded text-center"
        style={{ backgroundColor: `${colors.primary}11` }}
      >
        <p className="text-[10px]" style={{ color: colors.textSecondary }}>
          بر اساس تعداد تماس و امتیاز رضایت
        </p>
      </div>
    </div>
  );
}
