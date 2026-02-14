import { X } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { CustomerSalesData } from "../api/customerAPI";

interface CustomerSalesModalProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    location: string;
    status: string;
    purchaseCount: string;
  };
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
        dir="rtl"
      >
        <div
          className="rounded-lg p-6 w-full max-w-4xl border pointer-events-auto animate-fadeIn max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                فروش‌های مشتری: {customer.name}
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: colors.textSecondary }}
              >
                {customer.location} • {customer.status}
              </p>
            </div>
            <button
              onClick={onClose}
              className="transition-colors p-1 rounded-lg"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.error;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                  style={{ borderColor: colors.primary }}
                />
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  در حال بارگذاری...
                </p>
              </div>
            </div>
          )}

          {/* Sales Data */}
          {!loading && salesData && salesData.items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <th
                      className="text-right px-4 py-3 text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      کد کالا
                    </th>
                    <th
                      className="text-right px-4 py-3 text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      تعداد
                    </th>
                    <th
                      className="text-right px-4 py-3 text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      آخرین فروش
                    </th>
                    <th
                      className="text-right px-4 py-3 text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      قیمت (تومان)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b transition-colors"
                      style={{ borderColor: colors.border }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.backgroundSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.kalaCode}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {item.count.toLocaleString("fa-IR")}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {item.lastSaleDate !== "0001-01-01T00:00:00"
                          ? new Date(item.lastSaleDate).toLocaleDateString(
                              "fa-IR"
                            )
                          : "-"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.price.toLocaleString("fa-IR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && (!salesData || salesData.items.length === 0) && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                هیچ فروشی برای این مشتری ثبت نشده است
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
