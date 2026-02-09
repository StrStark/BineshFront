import { useCurrentColors } from "../contexts/ThemeColorsContext";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from "recharts";
import { Package, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";

// داده‌های محصولات انبار
const warehouseProducts = [
  // محصولات با رسوب بالا (قرمز - نیاز به توجه فوری)
  {
    name: "یخچال ساید LG",
    days: 185,
    price: 38000000,
    quantity: 4,
    category: "بحرانی",
    status: "critical",
  },
  {
    name: "توستر فیلیپس",
    days: 195,
    price: 2300000,
    quantity: 25,
    category: "بحرانی",
    status: "critical",
  },
  {
    name: "گریل برقی",
    days: 205,
    price: 1800000,
    quantity: 30,
    category: "بحرانی",
    status: "critical",
  },
  {
    name: "اتو مسافرتی",
    days: 210,
    price: 1500000,
    quantity: 30,
    category: "بحرانی",
    status: "critical",
  },
  {
    name: "یخچال مینی بار",
    days: 215,
    price: 5800000,
    quantity: 20,
    category: "بحرانی",
    status: "critical",
  },
  {
    name: "بخاری گازی",
    days: 195,
    price: 2900000,
    quantity: 25,
    category: "بحرانی",
    status: "critical",
  },

  // محصولات با رسوب متوسط (نارنجی - نیاز به برنامه‌ریزی)
  {
    name: "مایکروویو LG",
    days: 125,
    price: 8900000,
    quantity: 15,
    category: "هشدار",
    status: "warning",
  },
  {
    name: "گاز رومیزی",
    days: 145,
    price: 4800000,
    quantity: 18,
    category: "هشدار",
    status: "warning",
  },
  {
    name: "ماشین نان‌پز",
    days: 175,
    price: 3500000,
    quantity: 22,
    category: "هشدار",
    status: "warning",
  },
  {
    name: "جاروبرقی فیلیپس",
    days: 120,
    price: 6500000,
    quantity: 14,
    category: "هشدار",
    status: "warning",
  },
  {
    name: "اتو بخار تفال",
    days: 165,
    price: 3200000,
    quantity: 20,
    category: "هشدار",
    status: "warning",
  },
  {
    name: "پنکه برقی",
    days: 160,
    price: 1200000,
    quantity: 35,
    category: "هشدار",
    status: "warning",
  },
  {
    name: "فریزر باکسی",
    days: 185,
    price: 8900000,
    quantity: 14,
    category: "هشدار",
    status: "warning",
  },

  // محصولات با گردش متوسط (آبی - وضعیت نرمال)
  {
    name: "فر برقی سامسونگ",
    days: 45,
    price: 12500000,
    quantity: 8,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "اجاق گاز اخوان",
    days: 55,
    price: 18500000,
    quantity: 5,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "هود آلتون",
    days: 85,
    price: 6200000,
    quantity: 12,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "یخچال ساید بوش",
    days: 50,
    price: 45000000,
    quantity: 3,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "فریزر الکترواستیل",
    days: 95,
    price: 18500000,
    quantity: 9,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "کولر گازی اسپلیت",
    days: 60,
    price: 28000000,
    quantity: 7,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "ماشین لباسشویی LG",
    days: 50,
    price: 24000000,
    quantity: 6,
    category: "نرمال",
    status: "normal",
  },
  {
    name: "ماشین ظرفشویی بوش",
    days: 85,
    price: 32000000,
    quantity: 4,
    category: "نرمال",
    status: "normal",
  },

  // محصولات با گردش سریع (سبز - وضعیت عالی)
  {
    name: "فر توکار بوش",
    days: 28,
    price: 25000000,
    quantity: 4,
    category: "عالی",
    status: "excellent",
  },
  {
    name: "پکیج دیواری ایران‌رادیاتور",
    days: 22,
    price: 35000000,
    quantity: 4,
    category: "عالی",
    status: "excellent",
  },
  {
    name: "یخچال تک",
    days: 38,
    price: 15700000,
    quantity: 8,
    category: "عالی",
    status: "excellent",
  },
  {
    name: "رباتیک کلینر",
    days: 35,
    price: 18500000,
    quantity: 8,
    category: "عالی",
    status: "excellent",
  },
  {
    name: "بلندر شارژی",
    days: 32,
    price: 2500000,
    quantity: 28,
    category: "عالی",
    status: "excellent",
  },
  {
    name: "کولر گازی اینورتر",
    days: 42,
    price: 32000000,
    quantity: 5,
    category: "عالی",
    status: "excellent",
  },
];

// تنظیمات رنگ برای هر وضعیت
const statusConfig = {
  critical: {
    color: "#EF4444",
    label: "بحرانی",
    icon: "🔴",
    gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  },
  warning: {
    color: "#F59E0B",
    label: "هشدار",
    icon: "🟡",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  },
  normal: {
    color: "#3B82F6",
    label: "نرمال",
    icon: "🔵",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
  },
  excellent: {
    color: "#10B981",
    label: "عالی",
    icon: "🟢",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const colors = useCurrentColors();

  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const config = statusConfig[data.status as keyof typeof statusConfig];
    const totalValue = data.price * data.quantity;

    return (
      <div
        className="rounded-xl p-4 border-2 shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: colors.cardBackground + "f8",
          borderColor: config.color,
        }}
      >
        <div
          className="flex items-center gap-2 mb-3 pb-3 border-b"
          style={{ borderColor: colors.border }}
        >
          <span className="text-xl">{config.icon}</span>
          <div>
            <p
              className="font-bold text-sm"
              style={{ color: colors.textPrimary }}
            >
              {data.name}
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
              style={{
                backgroundColor: config.color + "22",
                color: config.color,
                fontWeight: "bold",
              }}
            >
              {config.label}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <Clock
                className="w-3.5 h-3.5"
                style={{ color: colors.textSecondary }}
              />
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                مدت انبار:
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: config.color }}>
              {data.days.toLocaleString("fa-IR")} روز
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <TrendingUp
                className="w-3.5 h-3.5"
                style={{ color: colors.textSecondary }}
              />
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                قیمت واحد:
              </span>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: colors.textPrimary }}
            >
              {(data.price / 1000000).toFixed(1).toLocaleString("fa-IR")} م
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <Package
                className="w-3.5 h-3.5"
                style={{ color: colors.textSecondary }}
              />
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                تعداد:
              </span>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: colors.textPrimary }}
            >
              {data.quantity.toLocaleString("fa-IR")} عدد
            </span>
          </div>

          <div
            className="flex items-center justify-between gap-6 pt-2 mt-2 border-t"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-1.5">
              <AlertTriangle
                className="w-3.5 h-3.5"
                style={{ color: colors.warning }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: colors.textSecondary }}
              >
                ارزش رسوب:
              </span>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: colors.warning }}
            >
              {(totalValue / 1000000).toFixed(0).toLocaleString("fa-IR")} م
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function WarehouseInventoryBubbleChart() {
  const colors = useCurrentColors();

  // محاسبه آمار
  const totalProducts = warehouseProducts.length;
  const criticalCount = warehouseProducts.filter(
    (p) => p.status === "critical",
  ).length;
  const totalValue = warehouseProducts.reduce(
    (sum, p) => sum + p.price * p.quantity ,
    0,
  );
  const avgDays = Math.round(
    warehouseProducts.reduce((sum, p) => sum + p.days, 0) / totalProducts,
  );

  // آماده‌سازی داده‌ها برای نمودار
  const chartData = warehouseProducts.map((product) => ({
    ...product,
    x: product.days,
    y: product.price / 100000, // تبدیل به میلیون
    z: product.quantity * 50, // اندازه حباب
  }));

  return (
    <div
      className="rounded-2xl p-6 border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
                boxShadow: `0 8px 16px ${colors.primary}33`,
              }}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: colors.textPrimary }}
              >
                تحلیل رسوب انبار
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                بررسی محصولات بر اساس مدت زمان انبارش و ارزش مالی
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3">
            <div
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: colors.textSecondary }}
              >
                کل محصولات
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: colors.textPrimary }}
              >
                {totalProducts.toLocaleString("fa-IR")}
              </p>
            </div>
            <div
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.error,
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: colors.textSecondary }}
              >
                وضعیت بحرانی
              </p>
              <p className="text-lg font-bold" style={{ color: colors.error }}>
                {criticalCount.toLocaleString("fa-IR")}
              </p>
            </div>
            <div
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: colors.textSecondary }}
              >
                ارزش کل رسوب
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: colors.warning }}
              >
                {(totalValue / 1000000).toFixed(0).toLocaleString("fa-IR")} م
              </p>
            </div>
            <div
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: colors.textSecondary }}
              >
                میانگین زمان
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: colors.primary }}
              >
                {avgDays.toLocaleString("fa-IR")} روز
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 40, bottom: 70, left: 60 }}>
            <defs>
              {Object.entries(statusConfig).map(([status, config]) => (
                <radialGradient key={status} id={`bubble-${status}`}>
                  <stop
                    offset="0%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={config.color}
                    stopOpacity={0.4}
                  />
                </radialGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.border}
              strokeOpacity={0.5}
            />

            <XAxis
              type="number"
              dataKey="x"
              name="زمان انبار"
              domain={[0, 240]}
              ticks={[0, 40, 80, 120, 160, 200, 240]}
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              label={{
                value: "زمان انبارش (روز) ←",
                position: "insideBottom",
                offset: -25,
                fill: colors.textPrimary,
                fontSize: 13,
                fontWeight: 600,
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              name="قیمت"
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12, opacity: 0.1 }}
              label={{
                value: "↑ قیمت واحد (میلیون تومان)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: colors.textPrimary,
                fontSize: 13,
                fontWeight: 600,
              }}
            />

            <ZAxis type="number" dataKey="z" range={[200, 2000]} name="تعداد" />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                strokeDasharray: "3 3",
                stroke: colors.textSecondary,
                strokeOpacity: 0.5,
              }}
            />

            <Scatter
              data={chartData}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => {
                const config =
                  statusConfig[entry.status as keyof typeof statusConfig];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#bubble-${entry.status})`}
                    style={{ fillOpacity: 0.3}}
                    stroke={config.color}
                    strokeWidth={2}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div
        className="mt-6 pt-4 border-t flex items-center justify-between"
        style={{ borderColor: colors.border }}
      >
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          💡 هر حباب نشان‌دهنده یک محصول است • اندازه حباب = تعداد موجودی
        </p>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")} ●
        </p>
      </div>
    </div>
  );
}
