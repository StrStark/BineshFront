"use client"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

export interface AreaChartDataItem {
  name: string;
  [key: string]: string | number;
}

export interface AreaChartSeries {
  dataKey: string;
  name?: string;
  fillOpacity?: number;
}

export interface AreaChartProps {
  title?: string;
  data: AreaChartDataItem[];
  series?: AreaChartSeries[];  // Optional حالا
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  smooth?: boolean;
  stacked?: boolean;
}

export function AreaChart({
  title,
  data,
  series,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  height = 350,
  xAxisLabel,
  yAxisLabel,
  smooth = true,
  stacked = false,
}: AreaChartProps) {
  const themeColors = useCurrentColors();
  
  // رنگ‌های ثابت از تم سیستم
  const CHART_COLORS = [
    themeColors.primary,
    "#818cf8",
    "#4ade80",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#fb923c",
    "#ec4899",
  ];

  // استخراج خودکار series از data اگر series داده نشده باشد
  const autoSeries: AreaChartSeries[] = series || (data.length > 0 
    ? Object.keys(data[0])
        .filter(key => key !== 'name')
        .map(key => ({ dataKey: key, name: key }))
    : []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#1a1f2e]/95 backdrop-blur-sm border border-[#e8e8e8] dark:border-[#2a3142] rounded-xl p-4 shadow-xl" dir="rtl">
          <p className="text-sm font-bold text-[#0e1526] dark:text-white mb-3">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-2 last:mb-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-[#585757] dark:text-[#8b92a8]">
                  {entry.name}:
                </span>
              </div>
              <span className="text-sm font-semibold" style={{ color: entry.color }}>
                {entry.value.toLocaleString("fa-IR")}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-6" dir="rtl">
        {payload.map((entry: any, index: number) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7f9fb] dark:bg-[#0e1526]/50 hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div
              className="w-3 h-2 rounded-sm shadow-sm"
              style={{ backgroundColor: entry.color, opacity: 0.8 }}
            />
            <span className="text-xs font-medium text-[#0e1526] dark:text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="group bg-gradient-to-br from-white to-[#f7f9fb] dark:from-[#1a1f2e] dark:to-[#151b2b] border border-[#e8e8e8] dark:border-[#2a3142] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      {title && (
        <div className="flex items-center gap-2 mb-6" dir="rtl">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: themeColors.primary }}></div>
          <h3 className="text-lg font-bold text-[#0e1526] dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {autoSeries.map((s, index) => (
                <linearGradient
                  key={s.dataKey}
                  id={`gradient-${s.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                    stopOpacity={s.fillOpacity || 0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e8e8e8"
                className="dark:stroke-[#2a3142]"
              />
            )}
            <XAxis
              dataKey="name"
              tick={{ fill: "#8b92a8", fontSize: 12 }}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: "insideBottom",
                      offset: -5,
                      style: { fill: "#8b92a8", fontSize: 12 },
                    }
                  : undefined
              }
            />
            <YAxis
              tick={{ fill: "#8b92a8", fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString("fa-IR")}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#8b92a8", fontSize: 12 },
                    }
                  : undefined
              }
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
            {autoSeries.map((s) => (
              <Area
                key={s.dataKey}
                type={smooth ? "monotone" : "linear"}
                dataKey={s.dataKey}
                stroke={CHART_COLORS[autoSeries.indexOf(s) % CHART_COLORS.length]}
                strokeWidth={2}
                fill={`url(#gradient-${s.dataKey})`}
                name={s.name || s.dataKey}
                stackId={stacked ? "1" : undefined}
                animationDuration={1000}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}