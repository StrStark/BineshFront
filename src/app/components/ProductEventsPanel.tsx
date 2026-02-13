import { X, TrendingUp, TrendingDown, Package } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import type { ProductEventData } from "../api/productAPI";

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  warehouse: string;
  price: string;
  sales: string;
}

interface ProductEventsPanelProps {
  product: Product;
  eventData: ProductEventData | null;
  loading: boolean;
  onClose: () => void;
}

export function ProductEventsPanel({
  product,
  eventData,
  loading,
  onClose,
}: ProductEventsPanelProps) {
  const colors = useCurrentColors();

  // State labels in Persian
  const stateLabels: Record<string, string> = {
    Receipt: "رسید",
    Issue: "حواله",
    SalesOrConsumptionRequest: "درخواست فروش",
    PurchaseOrProductionRequest: "درخواست خرید",
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "Receipt":
        return "#10b981"; // green
      case "Issue":
        return "#ef4444"; // red
      case "SalesOrConsumptionRequest":
        return "#f59e0b"; // orange
      case "PurchaseOrProductionRequest":
        return "#3b82f6"; // blue
      default:
        return colors.textSecondary;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (date.getFullYear() === 1970) return "نامشخص";
    return new Intl.DateTimeFormat("fa-IR").format(date);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 left-0 h-full w-full md:w-[600px] z-50 shadow-2xl overflow-y-auto"
        style={{
          backgroundColor: colors.backgroundPrimary,
        }}
        dir="rtl"
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 p-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex-1">
            <h2
              className="text-lg font-semibold"
              style={{ color: colors.textPrimary }}
            >
              تاریخچه رویدادهای محصول
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
                style={{ borderColor: colors.primary, borderTopColor: "transparent" }}
              />
            </div>
          ) : eventData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4" style={{ color: "#10b981" }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      خرید
                    </span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    {eventData.buy}
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4" style={{ color: "#ef4444" }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      فروش
                    </span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    {eventData.sell}
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4" style={{ color: colors.primary }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      موجودی
                    </span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    {eventData.stock}
                  </p>
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: colors.textSecondary }}
                >
                  تاریخچه رویدادها ({eventData.items.length})
                </h3>
                {eventData.items.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    }}
                  >
                    {/* Event Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: getStateColor(event.state) + "20",
                            color: getStateColor(event.state),
                          }}
                        >
                          {stateLabels[event.state] || event.state}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          فاکتور: {event.factorNumber}
                        </span>
                      </div>
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span
                          className="text-xs block mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          مقدار ۱
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {event.value1}
                        </span>
                      </div>
                      <div>
                        <span
                          className="text-xs block mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          مقدار ۲
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {event.value2}
                        </span>
                      </div>
                      <div>
                        <span
                          className="text-xs block mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          مقدار ۳
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {event.value3}
                        </span>
                      </div>
                      <div>
                        <span
                          className="text-xs block mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          قیمت
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: colors.primary }}
                        >
                          {formatPrice(event.price)} ریال
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {event.desc && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                        <span
                          className="text-xs block mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          توضیحات
                        </span>
                        <p className="text-sm" style={{ color: colors.textPrimary }}>
                          {event.desc}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: colors.textSecondary }}>
                اطلاعاتی برای نمایش وجود ندارد
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}