import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { AIExportButtons } from "./AIExportButtons";

interface LineChartData {
  title?: string;
  data: any[];
  xKey?: string;
  yKeys?: string[];
  lines?: string[]; // Alternative name from API
}

interface AILineChartProps {
  data: LineChartData;
}

export function AILineChart({ data }: AILineChartProps) {
  const colors = useCurrentColors();

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  // Support both 'yKeys' and 'lines' property names
  const yKeys = data.yKeys || data.lines || [];
  
  // Validate yKeys
  if (!Array.isArray(yKeys) || yKeys.length === 0) {
    return (
      <div className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
        کلیدهای داده نامعتبر است
      </div>
    );
  }

  // Auto-detect xKey from first data item if not provided
  const xKey = data.xKey || Object.keys(data.data[0])[0] || "name";

  // Generate colors for each line
  const lineColors = [
    colors.primary,
    colors.success,
    colors.warning,
    colors.error,
    colors.info,
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
          title={data.title || "نمودار خطی"}
          data={data.data}
          columns={[xKey, ...yKeys]}
        />
      </div>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.3} />
            <XAxis
              dataKey={xKey}
              stroke={colors.textSecondary}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke={colors.textSecondary}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.textPrimary,
              }}
              labelStyle={{ color: colors.textPrimary }}
            />
            <Legend
              wrapperStyle={{ color: colors.textPrimary }}
              iconType="circle"
            />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}