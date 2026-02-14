import { Warehouse, Package, AlertCircle, TrendingDown, TrendingUp, Plus, Calendar } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { WarehouseInventoryBubbleChart } from "../components/WarehouseInventoryBubbleChart";
import { WarehouseStatusChart } from "../components/WarehouseStatusChart";
import { WarehouseInventoryTable } from "../components/WarehouseInventoryTable";
import { PersianCalendar } from "../components/PersianCalendar";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { WarehouseFlowChart } from "../components/WarehouseFlowChart";
import { FastMovingProducts } from "../components/FastMovingProducts";
import { useState, useMemo } from "react";

// داده‌های موجودی انبار
const allInventory = [
  {
    id: 1,
    productName: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ",
    category: "فرش",
    warehouse: "انبار ۱",
    quantity: 45,
    unit: "عدد",
    lastUpdate: "1403/09/15",
    status: "normal",
    minStock: 20,
    maxStock: 100,
  },
  {
    id: 2,
    productName: "مبل راحتی 7 نفره چستر",
    category: "مبلمان",
    warehouse: "انبار ۲",
    quantity: 8,
    unit: "دست",
    lastUpdate: "1403/09/14",
    status: "low",
    minStock: 10,
    maxStock: 50,
  },
  {
    id: 3,
    productName: "تابلو فرش دستباف ۱۰۰*۱۵۰",
    category: "تابلو فرش",
    warehouse: "نمایشگاه فرش ۴",
    quantity: 2,
    unit: "عدد",
    lastUpdate: "1403/09/13",
    status: "critical",
    minStock: 5,
    maxStock: 20,
  },
  {
    id: 4,
    productName: "موکت ۷۰۰*۵ شانه تراکم ۲۵۰۰",
    category: "موکت",
    warehouse: "انبار ۳",
    quantity: 150,
    unit: "متر",
    lastUpdate: "1403/09/15",
    status: "excess",
    minStock: 50,
    maxStock: 100,
  },
  {
    id: 5,
    productName: "فرش ماشینی ۱۲۰۰*۹ شانه",
    category: "فرش",
    warehouse: "انبار ۱",
    quantity: 65,
    unit: "عدد",
    lastUpdate: "1403/09/14",
    status: "normal",
    minStock: 30,
    maxStock: 80,
  },
  {
    id: 6,
    productName: "مبل کلاسیک 5 نفره",
    category: "مبلمان",
    warehouse: "انبار ۲",
    quantity: 15,
    unit: "دست",
    lastUpdate: "1403/09/15",
    status: "normal",
    minStock: 10,
    maxStock: 30,
  },
  {
    id: 7,
    productName: "فرش دستباف تبریز",
    category: "فرش",
    warehouse: "نمایشگاه فرش ۴",
    quantity: 3,
    unit: "عدد",
    lastUpdate: "1403/09/12",
    status: "critical",
    minStock: 5,
    maxStock: 15,
  },
  {
    id: 8,
    productName: "کوسن تزئینی",
    category: "کالای ۲",
    warehouse: "انبار ۳",
    quantity: 200,
    unit: "عدد",
    lastUpdate: "1403/09/15",
    status: "excess",
    minStock: 100,
    maxStock: 150,
  },
];

export function WarehousePage() {
  const colors = useCurrentColors();
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return "انتخاب بازه زمانی";
    
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return `${fromDate.toLocaleDateString("fa-IR")} - ${toDate.toLocaleDateString("fa-IR")}`;
  };

  const stats = [
    { icon: Package, label: "کل موجودی", value: "۱,۲۳۴", unit: "قلم", color: colors.primary },
    { icon: TrendingUp, label: "ورودی امروز", value: "۴۸", unit: "قلم", color: colors.success },
    { icon: TrendingDown, label: "خروجی امروز", value: "۳۵", unit: "قلم", color: colors.error },
    { icon: AlertCircle, label: "کمبود موجودی", value: "۱۲", unit: "قلم", color: colors.warning },
  ];

  // آماده‌سازی داده‌ها برای گزارش
  const reportSections: ReportSection[] = useMemo(() => {
    // فیلتر کردن داده‌ها بر اساس تاریخ (در صورت نیاز)
    let filteredData = allInventory;
    
    // محاسبه آمار کلی
    const totalItems = filteredData.length;
    const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);
    const normalStock = filteredData.filter(item => item.status === "normal").length;
    const lowStock = filteredData.filter(item => item.status === "low").length;
    const criticalStock = filteredData.filter(item => item.status === "critical").length;
    const excessStock = filteredData.filter(item => item.status === "excess").length;

    return [
      {
        title: "آمار کلی موجودی",
        data: [
          { 
            "شاخص": "کل اقلام", 
            "مقدار": totalItems.toLocaleString("fa-IR"),
            "درصد": "100%" 
          },
          { 
            "شاخص": "موجودی عادی", 
            "مقدار": normalStock.toLocaleString("fa-IR"),
            "درصد": `${Math.round((normalStock / totalItems) * 100)}%`
          },
          { 
            "شاخص": "موجودی کم", 
            "مقدار": lowStock.toLocaleString("fa-IR"),
            "درصد": `${Math.round((lowStock / totalItems) * 100)}%`
          },
          { 
            "شاخص": "موجودی بحرانی", 
            "مقدار": criticalStock.toLocaleString("fa-IR"),
            "درصد": `${Math.round((criticalStock / totalItems) * 100)}%`
          },
          { 
            "شاخص": "موجودی اضافی", 
            "مقدار": excessStock.toLocaleString("fa-IR"),
            "درصد": `${Math.round((excessStock / totalItems) * 100)}%`
          },
          { 
            "شاخص": "کل موجودی", 
            "مقدار": totalQuantity.toLocaleString("fa-IR"),
            "درصد": "-"
          },
        ],
        headers: ["شاخص", "مقدار", "درصد"]
      },
      {
        title: "لیست موجودی انبار",
        data: filteredData.map(item => ({
          "نام محصول": item.productName,
          "دسته‌بندی": item.category,
          "انبار": item.warehouse,
          "موجودی": item.quantity.toLocaleString("fa-IR"),
          "واحد": item.unit,
          "حداقل موجودی": item.minStock.toLocaleString("fa-IR"),
          "حداکثر موجودی": item.maxStock.toLocaleString("fa-IR"),
          "وضعیت": item.status === "normal" ? "عادی" : 
                   item.status === "low" ? "کم" : 
                   item.status === "critical" ? "بحرانی" : "اضافی",
          "آخرین بروزرسانی": item.lastUpdate,
        })),
        headers: [
          "نام محصول",
          "دسته‌بندی",
          "انبار",
          "موجودی",
          "واحد",
          "حداقل موجودی",
          "حداکثر موجودی",
          "وضعیت",
          "آخرین بروزرسانی"
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
            مدیریت انبار
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            کنترل موجودی و ورود/خروج کالا
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setShowCalendar(true)}
          >
            <Calendar className="w-5 h-5" />
            <span>{formatDateRange()}</span>
          </button>
          <ReportDownload sections={reportSections} fileName="گزارش-انبار" />
          <button
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="w-5 h-5" />
            <span>ثبت ورود/خروج</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                {stat.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Alert & Flow Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <WarehouseFlowChart />
        </div>
      </div>

      {/* Fast Moving Products & Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <FastMovingProducts />
        </div>
        <div className="lg:col-span-2">
          <WarehouseStatusChart />
        </div>
      </div>

      {/* جدول فهرست موجودی با فیلتر */}
      <WarehouseInventoryTable />

      {/* نمودار Bubble Chart برای رسوب انبار */}
      <WarehouseInventoryBubbleChart />

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