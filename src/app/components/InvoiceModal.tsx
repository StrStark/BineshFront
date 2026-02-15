import { useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { SaleItem } from "../data/salesData";

interface InvoiceModalProps {
  sale: SaleItem;
  onClose: () => void;
}

export function InvoiceModal({ sale, onClose }: InvoiceModalProps) {
  const colors = useCurrentColors();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  const formatPrice = (price: number) => {
    return formatNumber(price) + " تومان";
  };

  // محاسبه مالیات و جمع کل
  const taxRate = 0.09; // 9% مالیات
  const subtotal = sale.amount;
  const tax = Math.round(subtotal * taxRate);
  const shippingCost = 0; // رایگان
  const total = subtotal + tax + shippingCost;

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
        <head>
          <meta charset="utf-8">
          <title>فاکتور ${sale.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Vazir', 'Tahoma', sans-serif;
              direction: rtl;
              padding: 20mm;
              background: white;
            }
            @media print {
              body { padding: 0; }
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPDF = () => {
    alert("قابلیت دانلود PDF به زودی اضافه می‌شود");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            پیش‌نمایش فاکتور
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{
                backgroundColor: "#10B981",
                color: "#ffffff",
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-bold">دانلود PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
            >
              <Printer className="w-4 h-4" />
              <span className="text-sm font-bold">چاپ</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textSecondary,
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(95vh - 80px)" }}>
          <div ref={invoiceRef} className="p-8" dir="rtl" style={{ backgroundColor: "#ffffff" }}>
            {/* Header با لوگو */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                {/* سمت راست - عنوان */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                    فاکتور فروش
                  </h1>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    شرکت پیشتاز
                  </p>
                </div>

                {/* سمت چپ - شماره فاکتور */}
                <div className="text-left">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg mb-2">
                    <p className="text-xs text-gray-600 mb-1">شماره فاکتور</p>
                    <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {sale.invoiceNumber}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">تاریخ: {sale.date}</p>
                </div>
              </div>

              {/* اطلاعات شرکت */}
              <div className="text-right text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                <p className="mb-1">سیستم یکپارچه مدیریت منابع سازمانی</p>
                <p className="mb-1">تلفن: ۰۲۱-۸۸۷۷۶۶۵۵ | وبسایت: www.binesh-panel.ir</p>
                <p>ماکدور فروش</p>
              </div>
            </div>

            {/* اطلاعات فروشنده و خریدار */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* اطلاعات فروشنده */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: "#F9FAFB",
                  borderColor: "#E5E7EB"
                }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>
                  اطلاعات فروشنده
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>نام خریدار:</span>
                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                      {sale.seller}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>آقای جابر یوسفی</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>فروشنده:</span>
                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                      آقای احمد محمدی
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>دسته‌بندی:</span>
                    <span style={{ color: colors.textPrimary }}>فروش</span>
                  </div>
                </div>
              </div>

              {/* اطلاعات خر��دار */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: "#F9FAFB",
                  borderColor: "#E5E7EB"
                }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>
                  اطلاعات خریدار
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>نام خریدار:</span>
                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                      {sale.customer}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>شماره ماکدور:</span>
                    <span style={{ color: colors.textPrimary }}>IF۰۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>تاریخ صدور:</span>
                    <span style={{ color: colors.textPrimary }}>{sale.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>وضعیت پرداخت:</span>
                    <span style={{ color: colors.textPrimary }}>{sale.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>وضعیت سفارش:</span>
                    <span style={{ color: colors.textPrimary }}>{sale.orderStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* اطلاعات ماکدور */}
            <div 
              className="p-3 rounded-lg mb-6 text-xs"
              style={{ 
                backgroundColor: "#F3F4F6",
                border: "1px solid #E5E7EB"
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span style={{ color: "#6B7280" }}>اطلاعات ماکدور</span>
                </div>
              </div>
            </div>

            {/* جدول محصولات */}
            <div className="mb-6 overflow-hidden rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#1F2937" }}>
                    <th className="px-4 py-3 text-center text-xs font-bold text-white">ردیف</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-white">شرح کالا/خدمات</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-white">تعداد</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-white">قیمت واحد</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-white">قیمت کل (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: "#FFFFFF" }}>
                    <td className="px-4 py-3 text-center text-sm border-b" style={{ borderColor: "#E5E7EB" }}>
                      ۱
                    </td>
                    <td className="px-4 py-3 text-right text-sm border-b" style={{ borderColor: "#E5E7EB" }}>
                      {sale.productName}
                    </td>
                    <td className="px-4 py-3 text-center text-sm border-b" style={{ borderColor: "#E5E7EB" }}>
                      {formatNumber(sale.quantity)} عدد
                    </td>
                    <td className="px-4 py-3 text-center text-sm border-b" style={{ borderColor: "#E5E7EB" }}>
                      {formatPrice(Math.round(sale.amount / sale.quantity))}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold border-b" style={{ borderColor: "#E5E7EB" }}>
                      {formatPrice(sale.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* جمع کل و محاسبات */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* سمت چپ - خالی یا یادداشت */}
              <div></div>

              {/* سمت راست - محاسبات */}
              <div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between py-2">
                    <span style={{ color: "#6B7280" }}>جمع کل:</span>
                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span style={{ color: "#6B7280" }}>مالیات بر ارزش افزوده (۹٪):</span>
                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span style={{ color: "#6B7280" }}>هزینه ارسال:</span>
                    <span style={{ color: colors.textPrimary }}>رایگان</span>
                  </div>
                </div>

                {/* مبلغ قابل پرداخت */}
                <div 
                  className="flex justify-between items-center px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "#1F2937" }}
                >
                  <span className="font-bold text-white">مبلغ قابل پرداخت:</span>
                  <span className="font-bold text-lg text-white">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* مبلغ به حروف */}
                <div 
                  className="mt-3 p-3 rounded-lg text-xs text-center"
                  style={{ 
                    backgroundColor: "#DBEAFE",
                    color: "#1E40AF"
                  }}
                >
                  <p className="mb-1 text-gray-600">مبلغ به حروف:</p>
                  <p className="font-bold">{formatNumber(total)} تومان</p>
                </div>
              </div>
            </div>

            {/* شرایط و ضوابط */}
            <div 
              className="p-4 rounded-lg mb-6"
              style={{ 
                backgroundColor: "#FEF3C7",
                border: "1px solid #FCD34D"
              }}
            >
              <h3 className="text-sm font-bold mb-2" style={{ color: "#92400E" }}>
                شرایط و ضوابط:
              </h3>
              <ul className="text-xs space-y-1" style={{ color: "#78350F", lineHeight: "1.8" }}>
                <li>• کالای فروخته شده در صورت سالم بودن و داشتن برچسب تا ۷ روز قابل بازگشت می‌باشد.</li>
                <li>• خریدار متعهد می‌شود که مبلغ فاکتور را در موعد مقرر پرداخت نماید.</li>
                <li>• این فاکتور با امضای طرفین معتبر است و قابلیت استناد قانونی دارد.</li>
                <li>• در صورت بروز هرگونه اختلاف، مراجع قانونی تهران صالح به رسیدگی می‌باشند.</li>
              </ul>
            </div>

            {/* امضاها */}
            <div className="grid grid-cols-2 gap-8 mb-6 pt-12">
              <div className="text-center">
                <div className="border-t border-dashed pt-2" style={{ borderColor: "#9CA3AF" }}>
                  <p className="text-xs font-bold" style={{ color: "#6B7280" }}>
                    امضای فروشنده
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-dashed pt-2" style={{ borderColor: "#9CA3AF" }}>
                  <p className="text-xs font-bold" style={{ color: "#6B7280" }}>
                    امضای خریدار
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div 
              className="text-center pt-4 border-t text-xs"
              style={{ 
                borderColor: "#E5E7EB",
                color: "#6B7280"
              }}
            >
              <p>این فاکتور توسط سیستم پنل بینش تولید شده است</p>
              <p className="mt-1">آدرس: استان اصفهان، شهرستان کاشان، پارک علم و فناوری دانشگاه سراسری کاشان اتاق</p>
              <p className="mt-1">کد اقتصادی: ۱۲۳۴۵۶۷۸۹۰ | شناسه ملی: ۱۰۱۲۰۳۰۴۰۵۰</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
