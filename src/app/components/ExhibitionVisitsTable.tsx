import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
  Edit,
  Trash,
  Phone,
  Building2,
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import {
  useExhibitionVisits,
  ExhibitionVisit,
} from "../contexts/ExhibitionVisitsContext";
import { EditExhibitionVisitModal } from "./EditExhibitionVisitModal";

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
};
const priorityColors = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};
const statusLabels = {
  pending: "در انتظار پیگیری",
  contacted: "تماس گرفته شده",
  converted: "تبدیل به مشتری",
  not_interested: "عدم علاقه",
};
const statusColors = {
  pending: "#6b7280",
  contacted: "#3b82f6",
  converted: "#10b981",
  not_interested: "#ef4444",
};

export function ExhibitionVisitsTable() {
  const colors = useCurrentColors();
  const {
    visits,
    deleteVisit,
    searchTerm,
    setSearchTerm,
    filterStatus,
    filterPriority,
  } = useExhibitionVisits();
  const [editingVisit, setEditingVisit] = useState<ExhibitionVisit | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const matchesSearch =
        visit.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.phoneNumber.includes(searchTerm) ||
        visit.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || visit.followUpStatus === filterStatus;
      const matchesPriority =
        filterPriority === "all" || visit.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [visits, searchTerm, filterStatus, filterPriority]);

  const totalPages = Math.ceil(filteredVisits.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredVisits.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, searchTerm, filterStatus, filterPriority]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`آیا از حذف بازدید "${name}" مطمئن هستید؟`)) {
      deleteVisit(id);
    }
  };

  return (
    <>
      <div
        className="rounded-lg border overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <div
          className="p-3 md:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
          dir="rtl"
          style={{ borderColor: colors.border }}
        >
          <h2
            className="text-lg md:text-xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            بازدیدکنندگان
          </h2>
        </div>{" "}
        {/* Search */}
        <div
          className=" p-4 "
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 sm:py-3 border"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            }}
          >
            <Search
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="جستجو در مشتریان (نام، شماره تلفن، ایمیل)"
              className="bg-transparent flex-1 outline-none text-xs sm:text-sm placeholder:opacity-60"
              style={{ color: colors.textPrimary }}
              dir="rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="transition-colors flex-shrink-0"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]" dir="rtl">
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }}
              >
                <th
                  className="p-3 text-sm font-medium text-right w-[140px]"
                  style={{ color: colors.textSecondary }}
                >
                  نام و نام خانوادگی
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[120px]"
                  style={{ color: colors.textSecondary }}
                >
                  شماره تماس
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[120px]"
                  style={{ color: colors.textSecondary }}
                >
                  شرکت
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[100px]"
                  style={{ color: colors.textSecondary }}
                >
                  شهر
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[150px]"
                  style={{ color: colors.textSecondary }}
                >
                  محصولات مورد علاقه
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[90px]"
                  style={{ color: colors.textSecondary }}
                >
                  اولویت
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[120px]"
                  style={{ color: colors.textSecondary }}
                >
                  وضعیت پیگیری
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[100px]"
                  style={{ color: colors.textSecondary }}
                >
                  تاریخ بازدید
                </th>
                <th
                  className="p-3 text-sm font-medium text-right w-[100px]"
                  style={{ color: colors.textSecondary }}
                >
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((visit) => (
                <tr
                  key={visit.id}
                  className="border-b transition-colors"
                  style={{
                    borderColor: colors.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.backgroundSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td
                    className="p-3 text-sm font-medium max-w-[140px] truncate"
                    style={{ color: colors.textPrimary }}
                  >
                    {visit.fullName}
                  </td>
                  <td
                    className="p-3 text-sm font-mono"
                    style={{ color: colors.textPrimary }}
                    dir="ltr"
                  >
                    {visit.phoneNumber}
                  </td>
                  <td
                    className="p-3 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {visit.company || "—"}
                  </td>
                  <td
                    className="p-3 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {visit.city || "—"}
                  </td>
                  <td
                    className="p-3 text-sm max-w-[200px] truncate"
                    style={{ color: colors.textSecondary }}
                    title={visit.interestedProducts}
                  >
                    {visit.interestedProducts || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: priorityColors[visit.priority] + "22",
                        color: priorityColors[visit.priority],
                      }}
                    >
                      {priorityLabels[visit.priority]}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          statusColors[visit.followUpStatus] + "22",
                        color: statusColors[visit.followUpStatus],
                      }}
                    >
                      {statusLabels[visit.followUpStatus]}
                    </span>
                  </td>
                  <td
                    className="p-3 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {formatDate(visit.visitDate)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingVisit(visit)}
                        className="p-1.5 rounded transition-all hover:opacity-80"
                        style={{
                          backgroundColor: colors.primary + "20",
                          color: colors.primary,
                        }}
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(visit.id, visit.fullName)}
                        className="p-1.5 rounded transition-all hover:opacity-80"
                        style={{
                          backgroundColor: colors.error + "20",
                          color: colors.error,
                        }}
                        title="حذف"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVisits.length === 0 && (
            <div
              className="p-8 text-center"
              style={{ color: colors.textSecondary }}
              dir="rtl"
            >
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">هیچ بازدیدی با این فیلترها یافت نشد</p>
              <p className="text-sm mt-2">
                با کلیک روی دکمه "ثبت بازدیدکننده جدید" شروع کنید
              </p>
            </div>
          )}
        </div>
        {/* Pagination */}
        {filteredVisits.length > 0 && (
          <div
            className="p-3 md:p-4 border-t flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0"
            dir="rtl"
            style={{
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center gap-2 justify-between md:justify-start">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs md:text-sm whitespace-nowrap"
                  style={{ color: colors.textSecondary }}
                >
                  نمایش:
                </span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-2 md:px-3 py-1 md:py-1.5 border rounded-lg text-xs md:text-sm focus:outline-none transition-colors"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value={5}>5 سطر</option>
                  <option value={10}>10 سطر</option>
                  <option value={20}>20 سطر</option>
                  <option value={50}>50 سطر</option>
                </select>
              </div>
              <span
                className="text-xs md:text-sm whitespace-nowrap md:hidden"
                style={{ color: colors.textSecondary }}
              >
                {startIndex + 1} تا {Math.min(endIndex, filteredVisits.length)}{" "}
                از {filteredVisits.length}
              </span>
            </div>
            <span
              className="text-xs md:text-sm whitespace-nowrap hidden md:inline"
              style={{ color: colors.textSecondary }}
            >
              نمایش {startIndex + 1} تا{" "}
              {Math.min(endIndex, filteredVisits.length)} از{" "}
              {filteredVisits.length} مورد
            </span>
            <div className="flex items-center gap-1.5 md:gap-2 justify-center md:justify-end">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  color: colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor =
                      colors.backgroundSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <ChevronRight
                  className="w-5 h-5"
                  style={{ color: colors.textSecondary }}
                />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsis && (
                          <span
                            className="px-2"
                            style={{ color: colors.textSecondary }}
                          >
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded text-sm transition-colors`}
                          style={{
                            backgroundColor:
                              currentPage === page
                                ? colors.primary
                                : colors.cardBackground,
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor:
                              currentPage === page
                                ? colors.primary
                                : colors.border,
                            color:
                              currentPage === page
                                ? "#ffffff"
                                : colors.textPrimary,
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== page) {
                              e.currentTarget.style.backgroundColor =
                                colors.backgroundSecondary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== page) {
                              e.currentTarget.style.backgroundColor =
                                colors.cardBackground;
                            }
                          }}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  color: colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor =
                      colors.backgroundSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <ChevronLeft
                  className="w-5 h-5"
                  style={{ color: colors.textSecondary }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {editingVisit && (
        <EditExhibitionVisitModal
          visit={editingVisit}
          onClose={() => setEditingVisit(null)}
        />
      )}
    </>
  );
}