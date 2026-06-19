"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

export interface BarChartDataItem {
  name: string;
  value: number;
}

export interface BarChartProps {
  title?: string;
  data: BarChartDataItem[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  horizontal?: boolean;
}

export function BarChart({
  title,
  data,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  height = 350,
  xAxisLabel,
  yAxisLabel,
  horizontal = false,
}: BarChartProps) {
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#1a1f2e]/95 backdrop-blur-sm border border-[#e8e8e8] dark:border-[#2a3142] rounded-xl p-4 shadow-xl" dir="rtl">
          <p className="text-sm font-bold text-[#0e1526] dark:text-white mb-2">
            {payload[0].payload.name}
          </p>
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-[#585757] dark:text-[#8b92a8]">مقدار:</span>
            <span className="text-sm font-semibold" style={{ color: payload[0].fill }}>
              {payload[0].value.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = horizontal ? RechartsBarChart : RechartsBarChart;

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
          <ChartComponent
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e8e8e8"
                className="dark:stroke-[#2a3142]"
              />
            )}
            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  tick={{ fill: "#8b92a8", fontSize: 12 }}
                  tickFormatter={(value) => value.toLocaleString("fa-IR")}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#8b92a8", fontSize: 12 }}
                  width={100}
                />
              </>
            ) : (
              <>
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
              </>
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Bar
              dataKey="value"
              fill={CHART_COLORS[0]}
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
}