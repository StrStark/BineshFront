import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts";
import { useState } from "react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

export interface PieChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  title?: string;
  data: PieChartDataItem[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showPercentage?: boolean;
  height?: number;
  interactive?: boolean;
}

export function PieChart({
  title,
  data,
  showLegend = true,
  showTooltip = true,
  showPercentage = true,
  height = 350,
  interactive = true,
}: PieChartProps) {
  const themeColors = useCurrentColors();
  
  // رنگ‌های ثابت از تم سیستم
  const CHART_COLORS = [
    themeColors.primary,
    themeColors.accent,
    "#4ade80",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#fb923c",
    "#ec4899",
  ];
  
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_: any, index: number) => {
    if (interactive) {
      setActiveIndex(index);
    }
  };

  const onPieLeave = () => {
    if (interactive) {
      setActiveIndex(undefined);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white/95 dark:bg-[#1a1f2e]/95 backdrop-blur-sm border border-[#e8e8e8] dark:border-[#2a3142] rounded-xl p-4 shadow-xl" dir="rtl">
          <p className="text-sm font-bold text-[#0e1526] dark:text-white mb-2">
            {payload[0].name}
          </p>
          <div className="flex items-center justify-between gap-6 mb-1">
            <span className="text-xs text-[#585757] dark:text-[#8b92a8]">مقدار:</span>
            <span className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
              {payload[0].value.toLocaleString("fa-IR")}
            </span>
          </div>
          {showPercentage && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs text-[#585757] dark:text-[#8b92a8]">درصد:</span>
              <span className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
                {percentage.replace(".", "/")}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-6" dir="rtl">
        {payload.map((entry: any, index: number) => {
          const percentage = ((data[index].value / total) * 100).toFixed(1);
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7f9fb] dark:bg-[#0e1526]/50 hover:scale-105 transition-transform duration-200 cursor-pointer"
              onMouseEnter={() => interactive && setActiveIndex(index)}
              onMouseLeave={() => interactive && setActiveIndex(undefined)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-[#0e1526] dark:text-white">
                {entry.value}
                {showPercentage && (
                  <span className="text-[#8b92a8] mr-1 font-normal">
                    ({percentage.replace(".", "/")}%)
                  </span>
                )}
              </span>
            </div>
          );
        })}
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
          <RechartsPieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={interactive ? renderActiveShape : undefined}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            {showTooltip && !interactive && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill="#0e1526"
        className="dark:fill-white text-sm font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        dy={8}
        textAnchor="middle"
        fill="#8b92a8"
        className="text-xs"
      >
        {value.toLocaleString("fa-IR")}
      </text>
      <text
        x={cx}
        y={cy + 30}
        dy={8}
        textAnchor="middle"
        fill="#8b92a8"
        className="text-xs"
      >
        {`(${(percent * 100).toFixed(1).replace(".", "/")}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};