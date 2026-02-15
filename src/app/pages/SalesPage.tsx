import { ShoppingCart, TrendingUp, DollarSign, Package, Plus, Globe, Sparkles, ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { SalesStatsSection } from "../components/SalesStatsSection";
import { SalesTable } from "../components/SalesTable";
import { PersianCalendar } from "../components/PersianCalendar";
import { ProvincesSalesMap } from "../components/ProvincesSalesMap";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { SalesLineChart } from "../components/SalesLineChart";
import { TopProductsWidget } from "../components/TopProductsWidget";
import { TopSellersChart } from "../components/TopSellersChart";
import { useState, useMemo, useEffect, useRef } from "react";
import { SaleItem } from "../data/salesData";
import { salesAPI } from "../api/salesAPI";

// Helper function to translate product category
const translateCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "Carpet": "فرش",
    "RawMaterials": "مواد اولیه",
    "Accessories": "لوازم جانبی",
  };
  return categoryMap[category] || category;
};

// Helper function to format date to Persian
const formatPersianDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fa-IR");
};

// TimeFrame options
const timeFrameOptions = [
  { value: 1, label: "روزانه" },
  { value: 2, label: "هفتگی" },
  { value: 3, label: "ماهانه" },
  { value: 4, label: "فصلی" },
  { value: 5, label: "سالانه" },
];

export function SalesPage() {
  const colors = useCurrentColors();
  
  // تاریخ پیش‌فرض: 2020-02-13 تا 2026-02-13
  const defaultFrom = new Date("2000-02-14T00:00:00.000Z");
  const defaultTo = new Date("2026-02-14T23:59:59.999Z");
  
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: defaultFrom,
    to: defaultTo,
  });
  const [showCalendar, setShowCalendar] = useState(false);

  // TimeFrame state for chart
  const [timeFrame, setTimeFrame] = useState(3); // Default: Month (3)
  const [showTimeFrameDropdown, setShowTimeFrameDropdown] = useState(false);
  const timeFrameDropdownRef = useRef<HTMLDivElement>(null);

  // Sales chart data state
  const [salesChartData, setSalesChartData] = useState<any[]>([]);
  const [salesChartLoading, setSalesChartLoading] = useState(true);
  const [salesChartError, setSalesChartError] = useState<string | null>(null);

  // Sales records state
  const [salesRecords, setSalesRecords] = useState<SaleItem[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
            timeFrameUnit: timeFrame, // Use dynamic timeFrame
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
  }, [dateRange, timeFrame]); // Add timeFrame to dependencies

  // Fetch sales records data
  useEffect(() => {
    const fetchSalesRecords = async () => {
      if (!dateRange.from || !dateRange.to) return;

      setSalesLoading(true);
      setSalesError(null);

      try {
        const response = await salesAPI.getSalesRecords({
          dateFilter: {
            startTime: dateRange.from.toISOString(),
            endTime: dateRange.to.toISOString(),
            timeFrameUnit: 5,
          },
          categoryDto: {
            productCategory: "",
          },
          provience: {
            provinece: "string",
          },
          paggination: {
            pageNumber: currentPage,
            pageSize: pageSize,
          },
          searchTerm: debouncedSearchTerm,
        });

        if (response.code === 200 && response.status === "success") {
          // Transform API data to SaleItem format
          const transformedData: SaleItem[] = response.body.items.map((item, index) => ({
            id: `${item.factorNume}-${index}`,
            invoiceNumber: item.factorNume.toString(),
            productName: item.productDesc,
            category: translateCategory(item.productCategory),
            quantity: item.deliverdQuantity,
            customer: item.customerName,
            amount: item.price,
            date: formatPersianDate(item.date),
          }));

          setSalesRecords(transformedData);
          setTotalRecords(response.body.totalCount);
        } else {
          setSalesError("خطا در دریافت داده‌های فروش");
        }
      } catch (err) {
        console.error("Error fetching sales records:", err);
        setSalesError("خطا در دریافت داده‌های فروش");
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSalesRecords();
  }, [dateRange, currentPage, pageSize, debouncedSearchTerm]);

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return "انتخاب بازه زمانی";
    
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return `${fromDate.toLocaleDateString("fa-IR")} - ${toDate.toLocaleDateString("fa-IR")}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeFrameDropdownRef.current && !timeFrameDropdownRef.current.contains(event.target as Node)) {
        setShowTimeFrameDropdown(false);
      }
    };

    if (showTimeFrameDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeFrameDropdown]);

  // آماده‌سازی داده‌ها برای گزارش
  const reportSections: ReportSection[] = useMemo(() => {
    // استفاده از داده‌های واقعی API
    const filteredData = salesRecords;
    
    // محاسبه آمار کلی
    const totalSales = totalRecords;
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);

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
          "مبلغ": sale.amount.toLocaleString("fa-IR") + " تومان",
          "تاریخ": sale.date,
        })),
        headers: [
          "شماره فاکتور",
          "نام محصول",
          "دسته‌بندی",
          "تعداد",
          "مشتری",
          "مبلغ",
          "تاریخ",
        ]
      }
    ];
  }, [salesRecords, totalRecords]);

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
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="w-5 h-5" />
            <span>{formatDateRange()}</span>
          </button>
          <ReportDownload sections={reportSections} fileName="گزارش-فروش" />
          
        </div>
      </div>

      {/* Stats Section with Donut Chart - حالا با API واقعی */}
      <SalesStatsSection dateRange={dateRange} /> 
      {/* Sales Line Chart with TimeFrame Selector */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* TimeFrame Selector */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
              روند فروش
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              نمودار تعداد فروش در بازه زمانی انتخاب شده
            </p>
          </div>
          
          {/* TimeFrame Buttons */}
          <div className="relative" ref={timeFrameDropdownRef}>
            <button
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
              onClick={() => setShowTimeFrameDropdown(!showTimeFrameDropdown)}
            >
              <span>{timeFrameOptions.find(option => option.value === timeFrame)?.label}</span>
              <ChevronDown 
                className="w-5 h-5 transition-transform" 
                style={{ 
                  transform: showTimeFrameDropdown ? 'rotate(180deg)' : 'rotate(0deg)' 
                }}
              />
            </button>
            {showTimeFrameDropdown && (
              <div
                className="absolute left-0 top-full mt-2 rounded-lg shadow-lg z-10 overflow-hidden min-w-[150px]"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border,
                }}
              >
                {timeFrameOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeFrame(option.value);
                      setShowTimeFrameDropdown(false);
                    }}
                    className="px-4 py-3 block w-full text-right transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: timeFrame === option.value ? colors.primary : "transparent",
                      color: timeFrame === option.value ? "#ffffff" : colors.textPrimary,
                    }}
                    onMouseEnter={(e) => {
                      if (timeFrame !== option.value) {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (timeFrame !== option.value) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart Component (without header since we moved it above) */}
        <SalesLineChart 
          data={salesChartData} 
          loading={salesChartLoading} 
          error={salesChartError}
          hideHeader={true}
        />
      </div>

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

      {/* Sales Table - Now with real API data */}
      {salesLoading ? (
        <div
          className="rounded-lg border p-12 flex items-center justify-center"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }}></div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              در حال بارگذاری داده‌های فروش...
            </p>
          </div>
        </div>
      ) : salesError ? (
        <div
          className="rounded-lg border p-12 flex items-center justify-center"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <p className="text-sm" style={{ color: colors.error }}>
            {salesError}
          </p>
        </div>
      ) : (
        <SalesTable 
          data={salesRecords}
          totalRecords={totalRecords}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <PersianCalendar
          value={dateRange}
          onConfirm={(range) => {
            setDateRange(range);
            setShowCalendar(false);
            setCurrentPage(1); // Reset to first page when date changes
          }}
          onCancel={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}