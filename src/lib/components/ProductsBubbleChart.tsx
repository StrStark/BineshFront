"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { Package } from "lucide-react";

// داده‌های محصولات انبار شده با زمان و مبلغ
const rawData = [
  // دسته پخت
  { category: "پخت", product: "فر برقی", time: 1, amount: 45, quantity: 12 },
  { category: "پخت", product: "مایکروویو", time: 2, amount: 35, quantity: 18 },
  { category: "پخت", product: "توستر", time: 3, amount: 85, quantity: 8 },
  { category: "پخت", product: "اجاق گاز", time: 4, amount: 95, quantity: 15 },
  { category: "پخت", product: "هود", time: 5, amount: 25, quantity: 20 },
  { category: "پخت", product: "سینی پخت", time: 6, amount: 55, quantity: 10 },
  { category: "پخت", product: "قابلمه", time: 7, amount: 15, quantity: 25 },
  
  // دسته نگهداری
  { category: "نگهداری", product: "یخچال", time: 1, amount: 80, quantity: 22 },
  { category: "نگهداری", product: "فریزر", time: 2, amount: 75, quantity: 16 },
  { category: "نگهداری", product: "ساید بای ساید", time: 3, amount: 40, quantity: 14 },
  { category: "نگهداری", product: "یخچال مینی", time: 4, amount: 60, quantity: 9 },
  { category: "نگهداری", product: "فریزر صنعتی", time: 5, amount: 90, quantity: 19 },
  { category: "نگهداری", product: "یخچال شیشه‌ای", time: 6, amount: 70, quantity: 11 },
  { category: "نگهداری", product: "فریزر باکسی", time: 7, amount: 30, quantity: 21 },
  
  // دسته آشپزخانه
  { category: "آشپزخانه", product: "چرخ گوشت", time: 1, amount: 20, quantity: 17 },
  { category: "آشپزخانه", product: "مخلوط کن", time: 2, amount: 50, quantity: 13 },
  { category: "آشپزخانه", product: "غذاساز", time: 3, amount: 65, quantity: 24 },
  { category: "آشپزخانه", product: "آبمیوه گیری", time: 4, amount: 30, quantity: 7 },
  { category: "آشپزخانه", product: "همزن", time: 5, amount: 75, quantity: 23 },
  { category: "آشپزخانه", product: "خردکن", time: 6, amount: 40, quantity: 15 },
  { category: "آشپزخانه", product: "روغن گیر", time: 7, amount: 85, quantity: 12 },
  
  // دسته گرمایشی
  { category: "گرمایشی", product: "پکیج شوفاژ", time: 1, amount: 50, quantity: 20 },
  { category: "گرمایشی", product: "رادیاتور", time: 2, amount: 60, quantity: 14 },
  { category: "گرمایشی", product: "کولر گازی", time: 3, amount: 10, quantity: 18 },
  { category: "گرمایشی", product: "بخاری", time: 4, amount: 20, quantity: 11 },
  { category: "گرمایشی", product: "هیتر", time: 5, amount: 45, quantity: 16 },
  { category: "گرمایشی", product: "فن هیتر", time: 6, amount: 95, quantity: 9 },
  { category: "گرمایشی", product: "شومینه", time: 7, amount: 55, quantity: 22 },
  
  // دسته بهداشتی
  { category: "بهداشتی", product: "ماشین لباسشویی", time: 1, amount: 5, quantity: 25 },
  { category: "بهداشتی", product: "ماشین ظرفشویی", time: 2, amount: 100, quantity: 28 },
  { category: "بهداشتی", product: "جاروبرقی", time: 3, amount: 70, quantity: 13 },
  { category: "بهداشتی", product: "اتو", time: 4, amount: 90, quantity: 19 },
  { category: "بهداشتی", product: "بخارشوی", time: 5, amount: 15, quantity: 17 },
  { category: "بهداشتی", product: "رختخشک کن", time: 6, amount: 35, quantity: 21 },
  { category: "بهداشتی", product: "جارو شارژی", time: 7, amount: 80, quantity: 15 },
];

// محاسبه min و max برای نرمال‌سازی
const minTime = Math.min(...rawData.map(d => d.time));
const maxTime = Math.max(...rawData.map(d => d.time));
const minAmount = Math.min(...rawData.map(d => d.amount));
const maxAmount = Math.max(...rawData.map(d => d.amount));

// نرمال‌سازی داده‌ها
const normalizedData = rawData.map(item => ({
  ...item,
  x: ((item.time - minTime) / (maxTime - minTime)) * 100,
  y: ((item.amount - minAmount) / (maxAmount - minAmount)) * 100,
  z: item.quantity * 30,
}));

// رنگ‌بندی دسته‌ها با گرادیانت
const categoryConfig: Record<string, { color: string; gradient: string; icon: string }> = {
  "پخت": { 
    color: "#F43F5E", 
    gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
    icon: "🔥"
  },
  "نگهداری": { 
    color: "#FB923C", 
    gradient: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)",
    icon: "❄️"
  },
  "آشپزخانه": { 
    color: "#3B82F6", 
    gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    icon: "🍳"
  },
  "گرمایشی": { 
    color: "#FBBF24", 
    gradient: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
    icon: "🔆"
  },
  "بهداشتی": { 
    color: "#10B981", 
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    icon: "✨"
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const colors = useCurrentColors();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const config = categoryConfig[data.category];
    
    return (
      <div
        className="p-4 rounded-xl border shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: colors.cardBackground + "f5",
          borderColor: config.color,
          borderWidth: "2px",
        }}
      >
        <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: colors.border }}>
          <span className="text-xl">{config.icon}</span>
          <p className="font-bold" style={{ color: colors.textPrimary }}>
            {data.product}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm" style={{ color: colors.textSecondary }}>دسته:</span>
            <span 
              className="text-sm font-bold px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: config.color + "22",
                color: config.color
              }}
            >
              {data.category}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm" style={{ color: colors.textSecondary }}>زمان انبار:</span>
            <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
              {data.time.toLocaleString("fa-IR")} ماه
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm" style={{ color: colors.textSecondary }}>ارزش کالا:</span>
            <span className="text-sm font-bold" style={{ color: config.color }}>
              {data.amount.toLocaleString("fa-IR")}M
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm" style={{ color: colors.textSecondary }}>تعداد:</span>
            <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
              {data.quantity.toLocaleString("fa-IR")} عدد
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ProductsBubbleChart() {
  const colors = useCurrentColors();

  // گروه‌بندی داده‌ها بر اساس دسته‌بندی
  const groupedData = Object.keys(categoryConfig).map(category => ({
    category,
    data: normalizedData.filter(item => item.category === category),
    config: categoryConfig[category],
  }));

  // محاسبه آمار
  const totalProducts = rawData.length;
  const totalValue = rawData.reduce((sum, item) => sum + item.amount, 0);
  const avgTime = (rawData.reduce((sum, item) => sum + item.time, 0) / rawData.length).toFixed(1);

  return (
    <div
      className="rounded-2xl p-6 border-2 relative overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.textSecondary} 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
                boxShadow: `0 8px 16px ${colors.primary}33`
              }}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                تحلیل رسوب انبار
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                بر اساس زمان و ارزش محصولات
              </p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-3">
            <div 
              className="px-4 py-2 rounded-lg border"
              style={{ 
                backgroundColor: colors.cardBackground,
                borderColor: colors.border 
              }}
            >
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>کل محصولات</p>
              <p className="font-bold" style={{ color: colors.textPrimary }}>
                {totalProducts.toLocaleString("fa-IR")}
              </p>
            </div>
            <div 
              className="px-4 py-2 rounded-lg border"
              style={{ 
                backgroundColor: colors.cardBackground,
                borderColor: colors.border 
              }}
            >
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>ارزش کل</p>
              <p className="font-bold" style={{ color: colors.primary }}>
                {totalValue.toLocaleString("fa-IR")}M
              </p>
            </div>
          </div>
        </div>

        {/* Legend با طراحی زیبا */}
        <div className="flex items-center justify-center gap-4 flex-wrap p-4 rounded-xl border" style={{ borderColor: colors.border }}>
          {Object.entries(categoryConfig).map(([category, config]) => (
            <div 
              key={category} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: config.gradient,
                boxShadow: `0 4px 12px ${config.color}33`
              }}
            >
              <span className="text-base">{config.icon}</span>
              <span className="text-sm font-bold text-white">
                {category}
              </span>
              <span className="text-xs text-white opacity-80">
                ({normalizedData.filter(d => d.category === category).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={550}>
          <ScatterChart margin={{ top: 20, right: 40, bottom: 60, left: 40 }}>
            <defs>
              {Object.entries(categoryConfig).map(([category, config]) => (
                <radialGradient key={category} id={`gradient-${category}`}>
                  <stop offset="0%" stopColor={config.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={config.color} stopOpacity={0.3} />
                </radialGradient>
              ))}
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.border} 
              strokeOpacity={0.3}
            />
            
            <XAxis
              type="number"
              dataKey="x"
              name="زمان"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              label={{
                value: "مدت زمان انبارش (نرمال شده) ←",
                position: "insideBottom",
                offset: -20,
                fill: colors.textPrimary,
                fontSize: 13,
                fontWeight: 600,
              }}
            />
            
            <YAxis
              type="number"
              dataKey="y"
              name="ارزش"
              domain={[0, 100]}
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              label={{
                value: "↑ ارزش کالا (نرمال شده)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fill: colors.textPrimary,
                fontSize: 13,
                fontWeight: 600,
              }}
            />
            
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: colors.textSecondary }} />
            
            {groupedData.map(({ category, data, config }) => (
              <Scatter
                key={category}
                name={category}
                data={data}
                fill={`url(#gradient-${category})`}
                stroke={config.color}
                strokeWidth={2}
                fillOpacity={0.7}
                isAnimationActive={true}
                animationDuration={800}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          📊 نرمال‌سازی با الگوریتم Min-Max • اندازه حباب = تعداد محصول
        </p>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          آخرین به‌روزرسانی: ۱۴۰۴/۱۰/۱۳ ●
        </p>
      </div>
    </div>
  );
}