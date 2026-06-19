"use client"

import { Package, TrendingUp, TrendingDown } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

const products = [
  { id: 1, name: "فرش 1200 شانه", sales: 45, revenue: 450000000, trend: 'up', trendValue: 15 },
  { id: 2, name: "موکت 700 شانه", sales: 38, revenue: 380000000, trend: 'up', trendValue: 8 },
  { id: 3, name: "فرش اصفهان", sales: 32, revenue: 480000000, trend: 'down', trendValue: -5 },
  { id: 4, name: "زیرانداز پلی استر", sales: 28, revenue: 168000000, trend: 'up', trendValue: 12 },
  { id: 5, name: "فرش کاشان", sales: 25, revenue: 362500000, trend: 'up', trendValue: 6 },
];

export function TopProductsWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          محبوب‌ترین محصولات
        </p>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          بر اساس تعداد فروش این ماه
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="p-3 rounded-lg border transition-all hover:shadow-md"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.primary + "15" }}
                >
                  <span className="text-xs font-bold" style={{ color: colors.primary }}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
                    {product.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {product.sales} فروش
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {product.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" style={{ color: colors.success }} />
                ) : (
                  <TrendingDown className="w-4 h-4" style={{ color: colors.error }} />
                )}
                <span
                  className="text-xs font-medium"
                  style={{ color: product.trend === 'up' ? colors.success : colors.error }}
                >
                  {product.trendValue > 0 ? '+' : ''}{product.trendValue}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: colors.primary }}>
                {product.revenue.toLocaleString('fa-IR')} تومان
              </p>
              <div
                className="h-1.5 flex-1 rounded-full mx-3"
                style={{ backgroundColor: colors.border }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: colors.primary,
                    width: `${(product.sales / products[0].sales) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
