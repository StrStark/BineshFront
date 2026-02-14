import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertCircle, TrendingUp } from "lucide-react";

interface SalesDataPoint {
  type: number;
  count: number;
  onDate: string;
}

interface SalesLineChartProps {
  data: SalesDataPoint[];
  loading?: boolean;
  error?: string | null;
  hideHeader?: boolean;
}

// Customer Type mapping to Persian
const customerTypeMap: Record<number, string> = {
  0: "هیچ",
  1: "بدهکاران",
  2: "بستانکار",
  3: "پرسنل",
  4: "راننده",
  5: "بازاریاب",
  6: "شرکا",
  7: "مشتریان خانگی",
  8: "جاری شرکت‌ها و اشخاص",
  9: "طراح و ادیتور",
};

// Colors for different customer types
const customerTypeColors: Record<number, string> = {
  1: "#3b82f6",  // blue
  2: "#10b981",  // green
  3: "#f59e0b",  // amber
  4: "#ef4444",  // red
  5: "#8b5cf6",  // purple
  6: "#ec4899",  // pink
  7: "#06b6d4",  // cyan
  8: "#f97316",  // orange
  9: "#14b8a6",  // teal
};

// Persian date formatter
const formatPersianDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}/${month}`;
};

export function SalesLineChart({ data = [], loading = false, error = null, hideHeader = false }: SalesLineChartProps) {
  const colors = useCurrentColors();

  // Transform API data to chart format - group by date and separate by type
  const chartData = (() => {
    const grouped: Record<string, any> = {};
    
    data.forEach(item => {
      const dateKey = item.onDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: formatPersianDate(item.onDate),
          fullDate: new Date(item.onDate).toLocaleDateString("fa-IR"),
          timestamp: new Date(item.onDate).getTime(),
        };
      }
      
      // Add count for this customer type
      const typeName = `type_${item.type}`;
      grouped[dateKey][typeName] = item.count;
    });

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
  })();

  // Get unique customer types from data
  const customerTypes = Array.from(new Set(data.map(item => item.type))).sort((a, b) => a - b);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <p className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
            {payload[0].payload.fullDate}
          </p>
          {payload.map((entry: any, index: number) => {
            const typeNumber = parseInt(entry.dataKey.replace('type_', ''));
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {customerTypeMap[typeNumber]}: {entry.value.toLocaleString("fa-IR")}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Header - only show if hideHeader is false */}
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            روند فروش ماهانه
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            نمودار تعداد فروش در بازه زمانی انتخاب شده
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.primary }}
            />
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              در حال بارگذاری داده‌ها...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: colors.error }}
            />
            <p className="text-base font-semibold mb-2" style={{ color: colors.textPrimary }}>
              خطا در دریافت اطلاعات
            </p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && chartData.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <TrendingUp
              className="w-12 h-12 mx-auto mb-4 opacity-40"
              style={{ color: colors.textSecondary }}
            />
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              داده‌ای برای نمایش وجود ندارد
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="date"
              stroke={colors.textSecondary}
              style={{ fontSize: "12px", fontFamily: "inherit" }}
            />
            <YAxis
              stroke={colors.textSecondary}
              style={{ fontSize: "12px", fontFamily: "inherit" }}
              tickFormatter={(value) => value.toLocaleString("fa-IR")}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: "inherit" }}
              formatter={(value) => {
                const typeNumber = parseInt(value.replace('type_', ''));
                return customerTypeMap[typeNumber] || value;
              }}
            />
            {/* Create a Line for each customer type */}
            {customerTypes.map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={`type_${type}`}
                name={`type_${type}`}
                stroke={customerTypeColors[type] || colors.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: customerTypeColors[type] || colors.primary }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
}