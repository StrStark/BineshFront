"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

export interface LineChartDataItem {
  name: string;
  [key: string]: string | number;
}

export interface LineChartSeries {
  dataKey: string;
  name?: string;
  strokeWidth?: number;
}

export interface LineChartProps {
  title?: string;
  data: LineChartDataItem[];
  series?: LineChartSeries[];  // Optional حالا
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showDots?: boolean;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  smooth?: boolean;
}

export function LineChart({
  title,
  data,
  series,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showDots = true,
  height = 350,
  xAxisLabel,
  yAxisLabel,
  smooth = true,
}: LineChartProps) {
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
  const autoSeries: LineChartSeries[] = series || (data.length > 0 
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
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
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
              className="w-3 h-1 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
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
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
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
            {autoSeries && autoSeries.map((s, index) => (
              <Line
                key={s.dataKey}
                type={smooth ? "monotone" : "linear"}
                dataKey={s.dataKey}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={s.strokeWidth || 2}
                name={s.name || s.dataKey}
                dot={showDots ? { fill: CHART_COLORS[index % CHART_COLORS.length], r: 4 } : false}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}