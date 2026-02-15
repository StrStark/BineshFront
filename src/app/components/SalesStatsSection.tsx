import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { salesAPI } from "../api/salesAPI";
import { TopProductsWidget } from "./TopProductsWidget";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface SalesStatsSectionProps {
  dateRange?: DateRange;
}

export function SalesStatsSection({ dateRange }: SalesStatsSectionProps) {
  const colors = useCurrentColors();
  const [chartData, setChartData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [salesCards, setSalesCards] = useState<any>(null);

  // تاریخ پیش‌فرض
  const defaultFrom = new Date("2020-02-13T09:03:37.211Z");
  const defaultTo = new Date("2026-02-13T09:03:37.211Z");

  // رنگ‌های ثابت برای نمودار
  const CHART_COLORS = [
    "#10B981", // سبز
    "#06B6D4", // آبی
    "#F59E0B", // نارنجی
    "#EC4899", // صورتی
    "#8B5CF6", // بنفش
    "#6B7280", // خاکستری برای "سایر"
  ];

  useEffect(() => {
    const fetchSalesData = async () => {
      const from = dateRange?.from || defaultFrom;
      const to = dateRange?.to || defaultTo;

      setLoading(true);

      try {
        const response = await salesAPI.getSalesSummary({
          dateFilter: {
            startTime: from.toISOString(),
            endTime: to.toISOString(),
            timeFrameUnit: 1,
          },
          categoryDto: {
            productCategory: "",
          },
          provience: {
            provinece: "string",
          },
        });

        if (response.code === 200 && response.status === "success") {
          const soldItems = response.body.soldItems;
          
          // ذخیره salesCards از API
          setSalesCards(response.body.salesCards);
          
          // محاسبه مجموع کل فروش
          const total = soldItems.reduce((sum: number, item: any) => sum + item.value, 0);
          setTotalSales(total);

          // مرتب‌سازی بر اساس مقدار (از بیشترین به کمترین)
          const sortedItems = [...soldItems]
            .filter((item: any) => item.value > 0)
            .sort((a: any, b: any) => b.value - a.value);

          // گرفتن Top 5 و جمع کردن بقیه در "سایر"
          let processedData;
          if (sortedItems.length > 5) {
            const top5 = sortedItems.slice(0, 5);
            const othersValue = sortedItems
              .slice(5)
              .reduce((sum: number, item: any) => sum + item.value, 0);

            processedData = [
              ...top5.map((item: any, index: number) => ({
                name: item.type,
                value: item.value,
                color: CHART_COLORS[index],
              })),
              {
                name: "سایر",
                value: othersValue,
                color: CHART_COLORS[5],
              },
            ];
          } else {
            processedData = sortedItems.map((item: any, index: number) => ({
              name: item.type,
              value: item.value,
              color: CHART_COLORS[index],
            }));
          }

          setChartData(processedData);
        }
      } catch (err) {
        console.error("Error fetching sales data:", err);
        // استفاده از Mock Data در صورت خطا
        const mockData = [
          { name: "فرش", value: 5918364139459, color: CHART_COLORS[0] },
          { name: "سایز", value: 362331106591, color: CHART_COLORS[1] },
          { name: "قالیچه", value: 249233599737, color: CHART_COLORS[2] },
          { name: "دایره", value: 79166005912, color: CHART_COLORS[3] },
          { name: "طاقه گلیم عرض", value: 56049225600, color: CHART_COLORS[4] },
        ];
        
        const mockOthersValue = 29255857400 + 707700004 + 6684055025 + 2789226500 + 50669904250 + 12409740750 + 15916569000;
        
        setChartData([
          ...mockData,
          { name: "سایر", value: mockOthersValue, color: CHART_COLORS[5] }
        ]);
        
        const mockTotal = mockData.reduce((sum, item) => sum + item.value, 0) + mockOthersValue;
        setTotalSales(mockTotal);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [dateRange]);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const centerValue = totalSales.toLocaleString("fa-IR");

  // Stats cards data - ساخت dynamic بر اساس API
  const statsCards = (() => {
    const cards = [];
    
    if (salesCards) {
      // کل فروش
      if (salesCards.totalSales) {
        cards.push({
          icon: DollarSign,
          label: "کل فروش",
          value: salesCards.totalSales.value.toLocaleString("fa-IR"),
          unit: "تومان",
          trend: salesCards.totalSales.growth || 0,
          color: colors.success,
        });
      }
      
      // کل برگشتی
      if (salesCards.returnTotal) {
        cards.push({
          icon: ShoppingCart,
          label: "کل برگشتی",
          value: salesCards.returnTotal.value.toLocaleString("fa-IR"),
          unit: "تومان",
          trend: salesCards.returnTotal.growth || 0,
          color: colors.error,
        });
      }
      
      // فروش محصولات تخفیف‌دار
      if (salesCards.offSales) {
        cards.push({
          icon: Tag,
          label: "فروش محصولات تخفیف‌دار",
          value: salesCards.offSales.value.toLocaleString("fa-IR"),
          unit: "تومان",
          trend: salesCards.offSales.growth || 0,
          color: colors.primary,
        });
      }
      
      // فروش مدل‌های جدید
      if (salesCards.newModelsSales) {
        cards.push({
          icon: Package,
          label: "فروش مدل‌های جدید",
          value: salesCards.newModelsSales.value.toLocaleString("fa-IR"),
          unit: "تومان",
          trend: salesCards.newModelsSales.growth || 0,
          color: colors.warning,
        });
      }
    }
    
    return cards;
  })();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      return (
        <div
          className="px-3 py-2 rounded-lg border shadow-lg"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
          dir="rtl"
        >
          <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            {data.name}
          </p>
          <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
            {data.value.toLocaleString("fa-IR")} تومان
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {percentage.replace(".", "/")}٪
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
      {/* Left side - Stats Cards (2/3 width) */}
      <div className="lg:col-span-1">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend > 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <div
                key={index}
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}22` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: isPositive ? `${colors.success}22` : `${colors.error}22`,
                      color: isPositive ? colors.success : colors.error,
                    }}
                  >
                    <TrendIcon className="w-3 h-3" />
                    <span>{Math.abs(stat.trend)}٪</span>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {stat.unit}
                </p>
                <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {isPositive ? "رشد" : "کاهشی"} نسبت به دوره قبل
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <TopProductsWidget dateRange={dateRange} />
      {/* Right side - Donut Chart (1/3 width) */}
      <div className="lg:col-span-1">
        <div
          className="rounded-xl border h-full"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {/* Chart Header */}
          <div className="p-4 text-center border-b" style={{ borderColor: colors.border }}>
            <h3 className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
              فیلتر داده‌ها (براساس تایم)
            </h3>
          </div>

          {/* Donut Chart */}
          <div className="relative" style={{ height: "350px" }}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }}></div>
              </div>
            ) : chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="font-bold text-[18px]" style={{ color: colors.textPrimary }}>
                    {centerValue}
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    تومان
                  </p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  داده‌ای یافت نشد
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="p-4 pt-0">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {chartData.map((item, index) => {
                const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(0) : "0";
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      {item.name}
                    </span>
                    <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                      {percentage}٪
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: colors.border }}>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                دسته‌بندی محصولات (Top 5)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}