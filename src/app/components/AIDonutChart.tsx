import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { AIExportButtons } from "./AIExportButtons";

interface DonutChartData {
  title?: string;
  data: any[];
  nameKey?: string;
  valueKey?: string;
}

interface AIDonutChartProps {
  data: DonutChartData;
}

export function AIDonutChart({ data }: AIDonutChartProps) {
  const colors = useCurrentColors();

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  // Auto-detect keys from first data item if not provided
  const firstItem = data.data[0];
  const keys = Object.keys(firstItem);
  const nameKey = data.nameKey || keys[0] || "name";
  const valueKey = data.valueKey || keys[1] || "value";

  // Generate colors for each slice
  const chartColors = [
    colors.primary,
    colors.success,
    colors.warning,
    colors.error,
    colors.info,
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
  ];

  return (
    <div className="w-full space-y-2" dir="ltr">
      <div className="flex items-center justify-between" dir="rtl">
        {data.title && (
          <h3 className="text-sm font-medium text-right" style={{ color: colors.textPrimary }}>
            {data.title}
          </h3>
        )}
        <AIExportButtons
          showExcel
          title={data.title || "نمودار دونات"}
          data={data.data}
          columns={[nameKey, valueKey]}
        />
      </div>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.data}
              dataKey={valueKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              label={(entry) => entry[nameKey]}
              labelLine={true}
            >
              {data.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.textPrimary,
              }}
            />
            <Legend
              wrapperStyle={{ color: colors.textPrimary }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}