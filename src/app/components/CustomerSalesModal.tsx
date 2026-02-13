import { X, ShoppingCart, Calendar, Package } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import type { CustomerSalesData } from "../api/customerAPI";

interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  status: string;
  purchaseCount: string;
}

interface CustomerSalesModalProps {
  customer: Customer;
  salesData: CustomerSalesData | null;
  loading: boolean;
  onClose: () => void;
}

export function CustomerSalesModal({
  customer,
  salesData,
  loading,
  onClose,
}: CustomerSalesModalProps) {
  const colors = useCurrentColors();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (date.getFullYear() === 1970) return "نامشخص";
    return new Intl.DateTimeFormat("fa-IR").format(date);
  };

  const totalAmount = salesData?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  const totalItems = salesData?.items.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] z-50 shadow-2xl overflow-hidden rounded-lg"
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
              جزئیات خریدهای مشتری
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {customer.name}
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
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)", backgroundColor: "#fff" }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div
                className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mb-4"
                style={{ borderColor: colors.primary, borderTopColor: "transparent" }}
              />
              <p className="text-sm" style={{ color: colors.textSecondary }}>در حال بارگذاری...</p>
            </div>
          ) : salesData && salesData.items.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                  className="p-5 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.primary + "30",
                    background: `linear-gradient(135deg, ${colors.cardBackground} 0%, ${colors.backgroundSecondary} 100%)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: colors.primary + "20",
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" style={{ color: colors.primary }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      تعداد خریدها
                    </span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    {salesData.items.length.toLocaleString("fa-IR")}
                  </p>
                </div>

                <div
                  className="p-5 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: "#10b98130",
                    background: `linear-gradient(135deg, ${colors.cardBackground} 0%, ${colors.backgroundSecondary} 100%)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: "#10b98120",
                      }}
                    >
                      <Package className="w-5 h-5" style={{ color: "#10b981" }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      کل اقلام
                    </span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    {totalItems.toLocaleString("fa-IR")}
                  </p>
                </div>

                <div
                  className="p-5 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: "#f59e0b30",
                    background: `linear-gradient(135deg, ${colors.cardBackground} 0%, ${colors.backgroundSecondary} 100%)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: "#f59e0b20",
                      }}
                    >
                      <Calendar className="w-5 h-5" style={{ color: "#f59e0b" }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      مجموع خرید
                    </span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: colors.primary }}>
                    {formatPrice(totalAmount)} ریال
                  </p>
                </div>
              </div>

              {/* Sales Table */}
              <div
                className="rounded-xl border shadow-xl overflow-hidden"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className="border-b-2"
                        style={{
                          backgroundColor: colors.primary + "10",
                          borderColor: colors.primary + "30",
                        }}
                      >
                        <th
                          className="p-4 text-right text-sm font-bold"
                          style={{
                            color: colors.textPrimary,
                          }}
                        >
                          ردیف
                        </th>
                        <th
                          className="p-4 text-right text-sm font-bold"
                          style={{
                            color: colors.textPrimary,
                          }}
                        >
                          کد کالا
                        </th>
                        <th
                          className="p-4 text-right text-sm font-bold"
                          style={{
                            color: colors.textPrimary,
                          }}
                        >
                          تعداد
                        </th>
                        <th
                          className="p-4 text-right text-sm font-bold"
                          style={{
                            color: colors.textPrimary,
                          }}
                        >
                          آخرین تاریخ فروش
                        </th>
                        <th
                          className="p-4 text-right text-sm font-bold"
                          style={{
                            color: colors.textPrimary,
                          }}
                        >
                          قیمت (ریال)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: colors.cardBackground }}>
                      {salesData.items.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b transition-all duration-200"
                          style={{ 
                            borderColor: colors.border,
                            backgroundColor: colors.cardBackground,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary + "08";
                            e.currentTarget.style.transform = "scale(1.01)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.cardBackground;
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <td
                            className="p-4 text-sm font-medium"
                            style={{
                              color: colors.textSecondary,
                            }}
                          >
                            <div
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: colors.primary + "15",
                                color: colors.primary,
                              }}
                            >
                              {(index + 1).toLocaleString("fa-IR")}
                            </div>
                          </td>
                          <td
                            className="p-4 text-sm font-mono"
                            style={{
                              color: colors.textPrimary,
                            }}
                          >
                            <code
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: colors.backgroundSecondary,
                              }}
                            >
                              {item.kalaCode}
                            </code>
                          </td>
                          <td
                            className="p-4 text-sm font-semibold"
                            style={{
                              color: colors.textSecondary,
                            }}
                          >
                            <span
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: "#10b98120",
                                color: "#10b981",
                              }}
                            >
                              {item.count.toLocaleString("fa-IR")}
                            </span>
                          </td>
                          <td
                            className="p-4 text-sm"
                            style={{
                              color: colors.textSecondary,
                            }}
                          >
                            {formatDate(item.lastSaleDate)}
                          </td>
                          <td
                            className="p-4 text-sm font-bold"
                            style={{
                              color: colors.primary,
                            }}
                          >
                            {formatPrice(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  backgroundColor: colors.primary + "15",
                }}
              >
                <ShoppingCart className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <p className="text-lg font-medium" style={{ color: colors.textSecondary }}>
                هیچ خریدی برای این مشتری یافت نشد
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}