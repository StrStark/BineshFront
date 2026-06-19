"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Award } from "lucide-react";

export function ServiceQualityWidget() {
  const colors = useCurrentColors();

  const qualityScore = 86;
  const metrics = [
    { label: "تخصص", value: 90, color: colors.success },
    { label: "رفتار", value: 94, color: colors.success },
    { label: "سرعت", value: 80, color: colors.primary },
    { label: "حل مسئله", value: 82, color: colors.primary },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.success;
    if (score >= 80) return colors.primary;
    if (score >= 70) return colors.warning;
    return colors.error;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-5 h-5" style={{ color: getScoreColor(qualityScore) }} />
          <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
            {qualityScore}%
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
          امتیاز کیفیت خدمات
        </p>

        {/* Circular Progress */}
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke={colors.border}
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke={getScoreColor(qualityScore)}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(qualityScore / 100) * 201} 201`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
              {qualityScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {metric.label}
              </span>
              <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                {metric.value}%
              </span>
            </div>
            <div 
              className="h-1.5 rounded-full"
              style={{ backgroundColor: colors.border }}
            >
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${metric.value}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}