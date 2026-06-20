"use client"

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter as FilterIcon, X, Edit, Trash } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface DataTable {
  name: string;
  db: string;
  records: number;
  size: string;
  updated: string;
  status: string;
}

const allTables: DataTable[] = [
  { name: "customers", db: "مشتریان", records: 45680, size: "2.4 GB", updated: "۱۰ دقیقه پیش", status: "active" },
  { name: "sales", db: "فروش", records: 125340, size: "1.8 GB", updated: "۵ دقیقه پیش", status: "active" },
  { name: "inventory", db: "موجودی", records: 8950, size: "1.2 GB", updated: "۱۵ دقیقه پیش", status: "active" },
  { name: "financial", db: "مالی", records: 32180, size: "0.9 GB", updated: "۲۰ دقیقه پیش", status: "active" },
  { name: "calls", db: "تماس‌ها", records: 89450, size: "3.2 GB", updated: "۲ دقیقه پیش", status: "active" },
  { name: "products", db: "محصولات", records: 15230, size: "1.5 GB", updated: "۳۰ دقیقه پیش", status: "active" },
  { name: "warehouse", db: "انبار", records: 12450, size: "0.7 GB", updated: "۴۵ دقیقه پیش", status: "active" },
];

export function DataTablesTable() {
  const colors = useCurrentColors();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const searchFilteredItems = useMemo(() => {
    return allTables.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.db.includes(searchQuery)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(searchFilteredItems.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = searchFilteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, searchQuery]);

  return (
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
          جداول پایگاه داده
        </h2>
      </div>

      {/* Search header */}
      <div
        className="p-4 border-b flex flex-col md:flex-row items-stretch md:items-center gap-3"
        style={{ borderColor: colors.border }}
        dir="rtl"
      >
        {/* Search */}
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 border flex-1"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <FilterIcon
            className="w-4 h-4 flex-shrink-0"
            style={{ color: colors.textSecondary }}
          />
          <input
            type="text"
            placeholder="جستجو در جداول (نام جدول، نام فارسی)"
            className="bg-transparent flex-1 outline-none text-sm placeholder:opacity-60"
            style={{ color: colors.textPrimary }}
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="transition-colors flex-shrink-0"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]" dir="rtl">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                نام جدول
              </th>
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                نام فارسی
              </th>
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                تعداد رکورد
              </th>
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                حجم
              </th>
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                آخرین بروزرسانی
              </th>
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                وضعیت
              </th>
              <th
                className="p-3 text-sm font-medium text-right"
                style={{ color: colors.textSecondary }}
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((table, index) => (
              <tr
                key={table.name}
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
                  className="p-3 text-sm font-mono"
                  style={{ color: colors.primary }}
                >
                  {table.name}
                </td>
                <td
                  className="p-3 text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {table.db}
                </td>
                <td
                  className="p-3 text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {table.records.toLocaleString("fa-IR")}
                </td>
                <td
                  className="p-3 text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {table.size}
                </td>
                <td
                  className="p-3 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {table.updated}
                </td>
                <td className="p-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: colors.success + "22",
                      color: colors.success,
                    }}
                  >
                    فعال
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
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

        {searchFilteredItems.length === 0 && (
          <div
            className="p-8 text-center"
            style={{ color: colors.textSecondary }}
            dir="rtl"
          >
            هیچ جدولی با این جستجو یافت نشد
          </div>
        )}
      </div>

      {/* Pagination */}
      {searchFilteredItems.length > 0 && (
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
              {startIndex + 1} تا {Math.min(endIndex, searchFilteredItems.length)} از{" "}
              {searchFilteredItems.length}
            </span>
          </div>

          <span
            className="text-xs md:text-sm whitespace-nowrap hidden md:inline"
            style={{ color: colors.textSecondary }}
          >
            نمایش {startIndex + 1} تا{" "}
            {Math.min(endIndex, searchFilteredItems.length)} از{" "}
            {searchFilteredItems.length} مورد
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
                            currentPage === page ? colors.primary : colors.border,
                          color:
                            currentPage === page ? "#ffffff" : colors.textPrimary,
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
  );
}
