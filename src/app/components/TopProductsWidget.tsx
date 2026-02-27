import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { TrendingUp, TrendingDown, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { salesAPI } from "../api/salesAPI";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface TopProductsWidgetProps {
  dateRange?: DateRange;
}

export function TopProductsWidget({ dateRange }: TopProductsWidgetProps) {
  const colors = useCurrentColors();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تاریخ پیش‌فرض
  const defaultFrom = new Date("2020-02-13T09:03:37.211Z");
  const defaultTo = new Date("2026-02-13T09:03:37.211Z");

  useEffect(() => {
    const fetchTopProducts = async () => {
      const from = dateRange?.from || defaultFrom;
      const to = dateRange?.to || defaultTo;

      setLoading(true);
      setError(null);

      try {
        const response = await salesAPI.getTopSellingProducts({
          dateFilter: {
            startTime: from.toISOString(),
            endTime: to.toISOString(),
            timeFrameUnit: 1,
          },
          categoryDto: {
            productCategory: "string",
          },
          provience: {
            provinece: "string",
          },
        });

        if (response.code === 200 && response.body?.items) {
          setProducts(response.body.items);
        }
      } catch (err) {
        console.error("Error fetching top products:", err);
        setError("خطا در بارگذاری داده‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [dateRange]);

  // Calculate total count of all products
  const totalCount = products.reduce((sum, product) => sum + product.count, 0);

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            پرفروش‌ترین محصولات
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            برترین محصولات از نظر تعداد فروش
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "22" }}
        >
          <Award className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2" 
            style={{ borderColor: colors.primary }}
          ></div>
        </div>
      ) : error ? (
        <div className="text-center py-8" style={{ color: colors.error }}>
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8" style={{ color: colors.textSecondary }}>
          داده‌ای یافت نشد
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.rank} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{
                  backgroundColor: index === 0 ? colors.primary + "33" : colors.backgroundSecondary,
                  color: index === 0 ? colors.primary : colors.textSecondary,
                }}
              >
                {product.rank.toLocaleString("fa-IR")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0 mr-2">
                    {product.growth > 0 ? (
                      <TrendingUp className="w-3 h-3" style={{ color: colors.success }} />
                    ) : product.growth < 0 ? (
                      <TrendingDown className="w-3 h-3" style={{ color: colors.error }} />
                    ) : (
                      <TrendingUp className="w-3 h-3" style={{ color: colors.textSecondary }} />
                    )}
                    <span
                      className="text-xs font-semibold"
                      style={{ 
                        color: product.growth > 0 
                          ? colors.success 
                          : product.growth < 0 
                          ? colors.error 
                          : colors.textSecondary 
                      }}
                    >
                      {product.growth > 0 ? "+" : ""}
                      {product.growth.toLocaleString("fa-IR")}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: colors.textSecondary }}>
                    {product.count.toLocaleString("fa-IR")} فروش
                  </span>
                  <span className="font-semibold" style={{ color: colors.textPrimary }}>
                    {(product.totalAmount / 1000000).toLocaleString("fa-IR")} میلیون تومان
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full mt-2 overflow-hidden"
                  style={{ backgroundColor: colors.backgroundSecondary }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${totalCount > 0 ? (product.count / totalCount) * 100 : 0}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}