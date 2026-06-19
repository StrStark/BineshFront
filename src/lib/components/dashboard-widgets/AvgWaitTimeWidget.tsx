"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Clock, TrendingUp } from "lucide-react";

export function AvgWaitTimeWidget() {
  const colors = useCurrentColors();

  const waitTimeData = [
    { hour: "8", time: 45 },
    { hour: "10", time: 62 },
    { hour: "12", time: 78 },
    { hour: "14", time: 53 },
    { hour: "16", time: 41 },
    { hour: "18", time: 35 },
  ];

  const avgTime = Math.round(
    waitTimeData.reduce((sum, item) => sum + item.time, 0) / waitTimeData.length
  );

  const maxTime = Math.max(...waitTimeData.map(item => item.time));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: colors.warning }} />
            <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {avgTime}
              <span className="text-sm mr-1" style={{ color: colors.textSecondary }}>ثانیه</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: colors.success }}>
            <TrendingUp className="w-3 h-3" />
            <span>-12%</span>
          </div>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          میانگین زمان انتظار امروز
        </p>
      </div>

      <div className="flex-1">
        <svg width="100%" height="80" className="overflow-visible">
          <polyline
            fill="none"
            stroke={colors.warning}
            strokeWidth="2"
            points={waitTimeData
              .map((item, i) => {
                const x = (i / (waitTimeData.length - 1)) * 100;
                const y = 80 - (item.time / maxTime) * 60;
                return `${x}%,${y}`;
              })
              .join(" ")}
          />
          {waitTimeData.map((item, i) => {
            const x = (i / (waitTimeData.length - 1)) * 100;
            const y = 80 - (item.time / maxTime) * 60;
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={y}
                  r="3"
                  fill={colors.warning}
                />
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {waitTimeData.map((item, i) => (
            <span key={i} className="text-[10px]" style={{ color: colors.textTertiary }}>
              {item.hour}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
