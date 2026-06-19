"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { CheckCircle2, XCircle } from "lucide-react";

export function SuccessRateWidget() {
  const colors = useCurrentColors();
  const successRate = 87.5;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Progress Circle */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={colors.border}
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={colors.success}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - successRate / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
            {successRate}%
          </span>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            موفقیت
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div 
          className="flex items-center gap-2 p-2 rounded-lg"
          style={{ backgroundColor: `${colors.success}11` }}
        >
          <CheckCircle2 className="w-4 h-4" style={{ color: colors.success }} />
          <div>
            <p className="text-xs" style={{ color: colors.textSecondary }}>موفق</p>
            <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>1,091</p>
          </div>
        </div>
        <div 
          className="flex items-center gap-2 p-2 rounded-lg"
          style={{ backgroundColor: `${colors.error}11` }}
        >
          <XCircle className="w-4 h-4" style={{ color: colors.error }} />
          <div>
            <p className="text-xs" style={{ color: colors.textSecondary }}>ناموفق</p>
            <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>156</p>
          </div>
        </div>
      </div>
    </div>
  );
}
