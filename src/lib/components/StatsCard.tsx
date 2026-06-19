"use client"

import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  iconBgColor?: string;
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  trend,
  iconBgColor,
}: StatsCardProps) {
  const colors = useCurrentColors();
  
  return (
    <div 
      className="border rounded-lg p-5 flex flex-col gap-6 hover:shadow-lg transition-all duration-300"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-end gap-1">
          <p className="text-2xl font-bold" dir="auto" style={{ color: colors.textPrimary }}>
            {value}
          </p>
          <p className="text-sm" dir="auto" style={{ color: colors.textSecondary }}>
            {label}
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBgColor || colors.backgroundSecondary }}
        >
          <Icon className="w-6 h-6" style={{ color: colors.primary }} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2" dir="rtl">
          <svg
            className={clsx(
              "w-6 h-6",
              trend.direction === "down" && "rotate-180"
            )}
            style={{ color: trend.direction === "up" ? colors.success : colors.error }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 14L12 9L17 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className="text-sm"
            dir="auto"
            style={{ color: colors.textSecondary }}
          >
            {trend.value}
          </p>
        </div>
      )}
    </div>
  );
}