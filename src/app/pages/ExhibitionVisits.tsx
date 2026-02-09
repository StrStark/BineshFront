import { useState, useMemo } from "react";
import { Search, Filter, Plus, Download, Users, Calendar } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useExhibitionVisits } from "../contexts/ExhibitionVisitsContext";
import { PageHeader } from "../components/PageHeader";
import { ExhibitionVisitsTable } from "../components/ExhibitionVisitsTable";
import { AddExhibitionVisitModal } from "../components/AddExhibitionVisitModal";
import { PersianCalendar } from "../components/PersianCalendar";
import { ReportDownload, ReportSection } from "../components/ReportDownload";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

export default function ExhibitionVisits() {
  const colors = useCurrentColors();
  const {
    visits,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
  } = useExhibitionVisits();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  // فیلتر بر اساس تاریخ
  const filteredVisitsByDate = dateRange.from && dateRange.to
    ? visits.filter((visit) => {
        const visitDate = new Date(visit.visitDate);
        return visitDate >= dateRange.from! && visitDate <= dateRange.to!;
      })
    : visits;

  const stats = {
    total: filteredVisitsByDate.length,
    pending: filteredVisitsByDate.filter((v) => v.followUpStatus === "pending").length,
    contacted: filteredVisitsByDate.filter((v) => v.followUpStatus === "contacted").length,
    converted: filteredVisitsByDate.filter((v) => v.followUpStatus === "converted").length,
    highPriority: filteredVisitsByDate.filter((v) => v.priority === "high").length,
  };

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return "انتخاب بازه زمانی";
    
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return `${fromDate.toLocaleDateString("fa-IR")} - ${toDate.toLocaleDateString("fa-IR")}`;
  };

  // آماده‌سازی داده‌ها برای گزارش
  const reportSections: ReportSection[] = useMemo(() => {
    return [
      {
        title: "آمار کلی بازدیدها",
        data: [
          { 
            "شاخص": "کل بازدیدها", 
            "مقدار": stats.total.toLocaleString("fa-IR"),
            "درصد": "100%" 
          },
          { 
            "شاخص": "در انتظار پیگیری", 
            "مقدار": stats.pending.toLocaleString("fa-IR"),
            "درصد": stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}%` : "0%"
          },
          { 
            "شاخص": "تماس گرفته شده", 
            "مقدار": stats.contacted.toLocaleString("fa-IR"),
            "درصد": stats.total > 0 ? `${Math.round((stats.contacted / stats.total) * 100)}%` : "0%"
          },
          { 
            "شاخص": "تبدیل به مشتری", 
            "مقدار": stats.converted.toLocaleString("fa-IR"),
            "درصد": stats.total > 0 ? `${Math.round((stats.converted / stats.total) * 100)}%` : "0%"
          },
          { 
            "شاخص": "اولویت بالا", 
            "مقدار": stats.highPriority.toLocaleString("fa-IR"),
            "درصد": stats.total > 0 ? `${Math.round((stats.highPriority / stats.total) * 100)}%` : "0%"
          },
        ],
        headers: ["شاخص", "مقدار", "درصد"]
      },
      {
        title: "لیست بازدیدکنندگان",
        data: filteredVisitsByDate.map(visit => ({
          "نام و نام خانوادگی": visit.fullName,
          "شماره تماس": visit.phoneNumber,
          "شرکت": visit.company,
          "شهر": visit.city,
          "استان": visit.province,
          "محصولات مورد علاقه": visit.interestedProducts,
          "اولویت": visit.priority === "high" ? "بالا" : visit.priority === "medium" ? "متوسط" : "کم",
          "وضعیت": visit.followUpStatus === "pending"
            ? "در انتظار"
            : visit.followUpStatus === "contacted"
            ? "تماس گرفته شده"
            : visit.followUpStatus === "converted"
            ? "تبدیل به مشتری"
            : "عدم علاقه",
          "تاریخ بازدید": new Date(visit.visitDate).toLocaleDateString("fa-IR"),
          "توضیحات": visit.notes || "-",
        })),
        headers: [
          "نام و نام خانوادگی",
          "شماره تماس",
          "شرکت",
          "شهر",
          "استان",
          "محصولات مورد علاقه",
          "اولویت",
          "وضعیت",
          "تاریخ بازدید",
          "توضیحات"
        ]
      }
    ];
  }, [filteredVisitsByDate, stats]);

  const exportToCSV = () => {
    const headers = [
      "نام و نام خانوادگی",
      "شماره تماس",
      "شرکت",
      "شهر",
      "استان",
      "محصولات مورد علاقه",
      "اولویت",
      "وضعیت",
      "تاریخ بازدید",
      "توضیحات",
    ];

    const rows = filteredVisitsByDate.map((visit) => [
      visit.fullName,
      visit.phoneNumber,
      visit.company,
      visit.city,
      visit.province,
      visit.interestedProducts,
      visit.priority === "high" ? "زیاد" : visit.priority === "medium" ? "متوسط" : "کم",
      visit.followUpStatus === "pending"
        ? "در انتظار"
        : visit.followUpStatus === "contacted"
        ? "تماس گرفته شده"
        : visit.followUpStatus === "converted"
        ? "تبدیل به مشتری"
        : "عدم علاقه",
      new Date(visit.visitDate).toLocaleDateString("fa-IR"),
      visit.notes,
    ]);

    const csvContent = [
      "\uFEFF" + headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `exhibition-visits-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            بازدید از نمایشگاه
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            مدیریت و پیگیری بازدیدکنندگان نمایشگاه
          </p>
        </div>
        <ReportDownload sections={reportSections} fileName="گزارش-بازدیدکنندگان-نمایشگاه" />
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            className="bg-white dark:bg-[#1a1f2e] rounded-xl border p-4"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">کل بازدیدها</p>
                <p className="text-2xl font-bold dark:text-white">{stats.total}</p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <Users className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-[#1a1f2e] rounded-xl border p-4"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">در انتظار پیگیری</p>
                <p className="text-2xl font-bold dark:text-white">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-[#1a1f2e] rounded-xl border p-4"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">تماس گرفته شده</p>
                <p className="text-2xl font-bold dark:text-white">{stats.contacted}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-[#1a1f2e] rounded-xl border p-4"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">تبدیل به مشتری</p>
                <p className="text-2xl font-bold dark:text-white">{stats.converted}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-[#1a1f2e] rounded-xl border p-4"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">اولویت بالا</p>
                <p className="text-2xl font-bold dark:text-white">{stats.highPriority}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
           <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در نام، شماره تماس، شرکت یا شهر..."
              className="w-full pr-12 pl-4 py-3 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#1a1f2e] dark:text-white dark:border-gray-700"
              style={{
                borderColor: colors.border,
              }}
            />
          </div> 

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">ثبت بازدیدکننده جدید</span>
              <span className="sm:hidden">جدید</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <ExhibitionVisitsTable />
      </div>

      {/* Add Modal */}
      {showAddModal && <AddExhibitionVisitModal onClose={() => setShowAddModal(false)} />}

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