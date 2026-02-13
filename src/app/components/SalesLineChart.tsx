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
}

// Persian month names
const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

export function SalesLineChart({ data = [], loading = false, error = null }: SalesLineChartProps) {
  const colors = useCurrentColors();

  // Transform API data to chart format
  const chartData = data.map(item => {
    const date = new Date(item.onDate);
    const month = persianMonths[date.getMonth()];
    const year = date.getFullYear();
    
    return {
      month: month,
      sales: item.count,
      orders: item.count, // Using count for both since API doesn't provide separate order count
      fullDate: `${month} ${year}`,
    };
  }).sort((a, b) => {
    // Sort by date
    const dateA = new Date(data.find(d => {
      const date = new Date(d.onDate);
      return persianMonths[date.getMonth()] === a.month;
    })?.onDate || 0);
    const dateB = new Date(data.find(d => {
      const date = new Date(d.onDate);
      return persianMonths[date.getMonth()] === b.month;
    })?.onDate || 0);
    return dateA.getTime() - dateB.getTime();
  });

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
          <p className="text-sm" style={{ color: colors.primary }}>
            تعداد فروش: {payload[0].value.toLocaleString("fa-IR")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-xl border p-[24px]"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
          روند فروش ماهانه
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          نمودار تعداد فروش در بازه زمانی انتخاب شده
        </p>
      </div>

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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="month"
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
              formatter={(value) => (value === "sales" ? "تعداد فروش" : "تعداد سفارش")}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={colors.primary}
              strokeWidth={3}
              dot={{ fill: colors.primary, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
