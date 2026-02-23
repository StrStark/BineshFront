import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

interface CustomWidgetData {
  id: string;
  title: string;
  chartType: "bar" | "line" | "pie" | "area" | "radar" | "table";
  dataPoints: Array<{ label: string; value: number }>;
}

interface CustomChartWidgetProps {
  data: CustomWidgetData;
}

export function CustomChartWidget({ data }: CustomChartWidgetProps) {
  const colors = useCurrentColors();
  const chartColor = colors.primary; // استفاده از رنگ primary theme

  // تبدیل داده‌ها به فرمت مناسب recharts
  const chartData = data.dataPoints.map((point) => ({
    name: point.label,
    value: point.value,
    مقدار: point.value,
  }));

  const renderChart = () => {
    switch (data.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <YAxis stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={chartColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <YAxis stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill={chartColor}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`${chartColor}${Math.max(30, 100 - index * 15).toString(16)}`}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`color-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <YAxis stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fillOpacity={1}
                fill={`url(#color-${data.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke={colors.border} />
              <PolarAngleAxis dataKey="name" stroke={colors.textSecondary} style={{ fontSize: "12px" }} />
              <PolarRadiusAxis stroke={colors.textSecondary} />
              <Radar
                name="مقدار"
                dataKey="value"
                stroke={chartColor}
                fill={chartColor}
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case "table":
        return (
          <div className="w-full h-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr 
                  className="border-b"
                  style={{ borderColor: colors.border }}
                >
                  <th 
                    className="text-right p-3 font-bold"
                    style={{ 
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary 
                    }}
                  >
                    ردیف
                  </th>
                  <th 
                    className="text-right p-3 font-bold"
                    style={{ 
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary 
                    }}
                  >
                    عنوان
                  </th>
                  <th 
                    className="text-right p-3 font-bold"
                    style={{ 
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textPrimary 
                    }}
                  >
                    مقدار
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.dataPoints.map((point, index) => (
                  <tr 
                    key={index}
                    className="border-b hover:bg-opacity-50 transition-colors"
                    style={{ borderColor: colors.border }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="p-3" style={{ color: colors.textSecondary }}>
                      {index + 1}
                    </td>
                    <td className="p-3 font-medium" style={{ color: colors.textPrimary }}>
                      {point.label}
                    </td>
                    <td className="p-3">
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-bold"
                        style={{ 
                          backgroundColor: `${chartColor}15`,
                          color: chartColor 
                        }}
                      >
                        {point.value.toLocaleString('fa-IR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="w-full h-full min-h-[200px]">{renderChart()}</div>;
}