"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { CheckCircle2, TrendingUp } from "lucide-react";

export function FirstCallResolutionWidget() {
  const colors = useCurrentColors();

  const fcrRate = 82;
  const target = 85;
  const change = 5.2;

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: colors.success }} />
            <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {fcrRate}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: colors.success }}>
            <TrendingUp className="w-3 h-3" />
            <span>+{change}%</span>
          </div>
        </div>
        <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>
          حل مسئله در اولین تماس
        </p>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="relative">
          <div 
            className="h-3 rounded-full"
            style={{ backgroundColor: colors.border }}
          >
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${fcrRate}%`,
                backgroundColor: colors.success,
              }}
            />
          </div>
          <div 
            className="absolute top-0 w-0.5 h-5 -mt-1"
            style={{ 
              left: `${target}%`,
              backgroundColor: colors.textTertiary
            }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            فعلی: {fcrRate}%
          </span>
          <span className="text-[10px]" style={{ color: colors.textTertiary }}>
            هدف: {target}%
          </span>
        </div>

        <div className="mt-3 p-2 rounded" style={{ backgroundColor: `${colors.success}11` }}>
          <p className="text-[10px] text-center" style={{ color: colors.textSecondary }}>
            78 تماس از 95 تماس در اولین برخورد حل شد
          </p>
        </div>
      </div>
    </div>
  );
}
