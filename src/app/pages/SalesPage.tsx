import { ShoppingCart, TrendingUp, DollarSign, Package, Plus, Globe, Sparkles, ArrowLeft, Calendar } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { SalesStatsSection } from "../components/SalesStatsSection";
import { SalesTable } from "../components/SalesTable";
import { PersianCalendar } from "../components/PersianCalendar";
import { ProvincesSalesMap } from "../components/ProvincesSalesMap";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { SalesLineChart } from "../components/SalesLineChart";
import { TopProductsWidget } from "../components/TopProductsWidget";
import { TopSellersChart } from "../components/TopSellersChart";
import { useState, useMemo, useEffect } from "react";
import { allSalesData } from "../data/salesData";
import { salesAPI } from "../api/salesAPI";

export function SalesPage() {
  const colors = useCurrentColors();
  
  // تاریخ پیش‌فرض: 2020-02-13 تا 2026-02-13
  const defaultFrom = new Date("2020-02-13T09:03:37.211Z");
  const defaultTo = new Date("2026-02-13T09:03:37.211Z");
  
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: defaultFrom,
    to: defaultTo,
  });
  const [showCalendar, setShowCalendar] = useState(false);

  // Sales chart data state
  const [salesChartData, setSalesChartData] = useState<any[]>([]);
  const [salesChartLoading, setSalesChartLoading] = useState(true);
  const [salesChartError, setSalesChartError] = useState<string | null>(null);

  // Fetch sales chart data
  useEffect(() => {
    const fetchSalesData = async () => {
      if (!dateRange.from || !dateRange.to) return;

      setSalesChartLoading(true);
      setSalesChartError(null);

      try {
        const response = await salesAPI.getCustomerCategorizedSales({
          dateFilter: {
            startTime: dateRange.from.toISOString(),
            endTime: dateRange.to.toISOString(),
            timeFrameUnit: 3, // Monthly
          },
          categoryDto: {
            productCategory: "",
          },
          provience: {
            provinece: "string",
          },
        });

        if (response.code === 200 && response.status === "success") {
          setSalesChartData(response.body.sales);
        } else {
          setSalesChartError("خطا در دریافت داده‌های نمودار");
        }
      } catch (err) {
        console.error("Error fetching sales chart data:", err);
        setSalesChartError("خطا در دریافت داده‌های نمودار");
      } finally {
        setSalesChartLoading(false);
      }
    };

    fetchSalesData();
  }, [dateRange]);

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return "انتخاب بازه زمانی";
    
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return `${fromDate.toLocaleDateString("fa-IR")} - ${toDate.toLocaleDateString("fa-IR")}`;
  };

  // آماده‌سازی داده‌ها برای گزارش
  const reportSections: ReportSection[] = useMemo(() => {
    // فیلتر کردن داده‌ها بر اساس تاریخ (در صورت نیاز)
    let filteredData = allSalesData;
    
    // محاسبه آمار کلی
    const totalSales = filteredData.length;
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
    const completedSales = filteredData.filter(item => item.orderStatus === "تکمیل شده").length;
    const paidSales = filteredData.filter(item => item.paymentStatus === "پرداخت شده").length;

    return [
      {
        title: "آمار کلی فروش",
        data: [
          { 
            "شاخص": "کل فروش", 
            "مقدار": totalSales.toLocaleString("fa-IR"),
            "درصد": "100%" 
          },
          { 
            "شاخص": "سفارشات تکمیل شده", 
            "مقدار": completedSales.toLocaleString("fa-IR"),
            "درصد": `${Math.round((completedSales / totalSales) * 100)}%`
          },
          { 
            "شاخص": "پرداخت شده", 
            "مقدار": paidSales.toLocaleString("fa-IR"),
            "درصد": `${Math.round((paidSales / totalSales) * 100)}%`
          },
          { 
            "شاخص": "مجموع فروش", 
            "مقدار": totalAmount.toLocaleString("fa-IR") + " تومان",
            "درصد": "-"
          },
        ],
        headers: ["شاخص", "مقدار", "درصد"]
      },
      {
        title: "لیست فروش",
        data: filteredData.map(sale => ({
          "شماره فاکتور": sale.invoiceNumber,
          "نام محصول": sale.productName,
          "دسته‌بندی": sale.category,
          "تعداد": sale.quantity.toLocaleString("fa-IR"),
          "مشتری": sale.customer,
          "فروشنده": sale.seller,
          "مبلغ": sale.amount.toLocaleString("fa-IR") + " تومان",
          "تاریخ": sale.date,
          "وضعیت پرداخت": sale.paymentStatus,
          "وضعیت سفارش": sale.orderStatus,
        })),
        headers: [
          "شماره فاکتور",
          "نام محصول",
          "دسته‌بندی",
          "تعداد",
          "مشتری",
          "فروشنده",
          "مبلغ",
          "تاریخ",
          "وضعیت پرداخت",
          "وضعیت سفارش"
        ]
      }
    ];
  }, [dateRange]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            مدیریت فروش
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            ثبت و مدیریت سفارشات و فروش
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="w-5 h-5" />
            <span>{formatDateRange()}</span>
          </button>
          <ReportDownload sections={reportSections} fileName="گزارش-فروش" />
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="w-5 h-5" />
            <span>ثبت فروش جدید</span>
          </button>
        </div>
      </div>

      {/* Stats Section with Donut Chart - حالا با API واقعی */}
      <SalesStatsSection dateRange={dateRange} />

      {/* Sales Line Chart & Top Products */}
      <SalesLineChart data={salesChartData} loading={salesChartLoading} error={salesChartError} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
      
        </div>
        <div>
          {/* <TopProductsWidget /> */}
        </div>
      </div>

      {/* Top Sellers Chart */}
      {/* <TopSellersChart /> */}

      {/* Provinces Sales Map */}
      <ProvincesSalesMap />

      {/* Sales Table */}
      {/* <SalesTable data={allSalesData} /> */}

      {/* Calendar Modal */}
      {showCalendar && (
        <PersianCalendar
          value={dateRange}
          onConfirm={(range) => {
            setDateRange(range);
            setShowCalendar(false);
          }}
          onCancel={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}