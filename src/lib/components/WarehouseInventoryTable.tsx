"use client"

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ColumnCustomizer, ColumnConfig } from "./ColumnCustomizer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFilter, clearAllFilters, setOpenColumnFilter } from "../store/filtersSlice";
import { FilterPanel } from "./FilterPanel";
import { SavedFiltersButton } from "./SavedFiltersButton";

interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  warehouse: string;
  quantity: number;
  unit: string;
  lastUpdate: string;
  status: "normal" | "low" | "critical" | "excess";
  minStock: number;
  maxStock: number;
}

const defaultColumns: ColumnConfig[] = [
  { key: "productName", label: "نام محصول", visible: true },
  { key: "category", label: "دسته‌بندی", visible: true },
  { key: "warehouse", label: "انبار", visible: true },
  { key: "quantity", label: "موجودی", visible: true },
  { key: "unit", label: "واحد", visible: true },
  { key: "status", label: "وضعیت", visible: true },
  { key: "minStock", label: "حداقل موجودی", visible: true },
  { key: "maxStock", label: "حداکثر موجودی", visible: true },
  { key: "lastUpdate", label: "آخرین بروزرسانی", visible: true },
];

interface WarehouseInventoryTableProps {
  // Props if needed in the future
}

export function WarehouseInventoryTable({}: WarehouseInventoryTableProps) {
  const colors = useCurrentColors();
  const dispatch = useAppDispatch();
  const TABLE_ID = "warehouse-inventory-table";
  const { activeFilters, openColumnFilter } = useAppSelector(
    (state) => state.filters
  );
  const tableFilters = activeFilters[TABLE_ID] || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customColumns, setCustomColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - در واقعیت از API می‌آید
  const allInventory: InventoryItem[] = [
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

  // Filter only visible columns
  const activeColumns = customColumns.filter((col) => col.visible);

  // Render cell content
  const renderCell = (item: InventoryItem, column: ColumnConfig) => {
    switch (column.key) {
      case "productName":
        return (
          <td
            key={column.key}
            className="p-3 text-sm font-medium"
            style={{ color: colors.textPrimary }}
          >
            {item.productName}
          </td>
        );
      case "category":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.category}
          </td>
        );
      case "warehouse":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.warehouse}
          </td>
        );
      case "quantity":
        return (
          <td
            key={column.key}
            className="p-3 text-sm font-medium"
            style={{ color: colors.textPrimary }}
          >
            {item.quantity}
          </td>
        );
      case "unit":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.unit}
          </td>
        );
      case "status":
        const statusConfig = {
          normal: { label: "عادی", color: colors.success, icon: Package },
          low: { label: "کم", color: colors.warning, icon: TrendingDown },
          critical: { label: "بحرانی", color: colors.error, icon: TrendingDown },
          excess: { label: "اضافه", color: colors.primary, icon: TrendingUp },
        };
        const status = statusConfig[item.status];
        const StatusIcon = status.icon;
        return (
          <td key={column.key} className="p-3">
            <div className="flex items-center gap-2">
              <StatusIcon className="w-4 h-4" style={{ color: status.color }} />
              <span
                className="text-sm font-medium"
                style={{ color: status.color }}
              >
                {status.label}
              </span>
            </div>
          </td>
        );
      case "minStock":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.minStock}
          </td>
        );
      case "maxStock":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.maxStock}
          </td>
        );
      case "lastUpdate":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.lastUpdate}
          </td>
        );
      default:
        return <td key={column.key} className="p-3"></td>;
    }
  };

  // Apply search filter
  const searchFilteredItems = useMemo(() => {
    return allInventory.filter(
      (item) =>
        item.productName.includes(searchQuery) ||
        item.category.includes(searchQuery) ||
        item.warehouse.includes(searchQuery)
    );
  }, [searchQuery]);

  // Apply filters to data
  const filteredInventory = useMemo(() => {
    let result = searchFilteredItems;

    tableFilters.forEach((filter) => {
      result = result.filter((item) => {
        const value = String(item[filter.column as keyof InventoryItem] || "");
        const filterValue = filter.value.toLowerCase();
        const cellValue = value.toLowerCase();

        switch (filter.operator) {
          case "equals":
            return cellValue === filterValue;
          case "notEquals":
            return cellValue !== filterValue;
          case "contains":
            return cellValue.includes(filterValue);
          case "greaterThan":
            return Number(cellValue) > Number(filterValue);
          case "lessThan":
            return Number(cellValue) < Number(filterValue);
          case "greaterThanOrEqual":
            return Number(cellValue) >= Number(filterValue);
          case "lessThanOrEqual":
            return Number(cellValue) <= Number(filterValue);
          default:
            return true;
        }
      });
    });

    return result;
  }, [tableFilters, searchFilteredItems]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInventory.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredInventory.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tableFilters, rowsPerPage, searchQuery]);

  const handleFilterClick = (column: string) => {
    dispatch(setOpenColumnFilter(column));
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      equals: "=",
      notEquals: "≠",
      contains: "∋",
      greaterThan: ">",
      lessThan: "<",
      greaterThanOrEqual: "≥",
      lessThanOrEqual: "≤",
    };
    return labels[operator] || operator;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredInventory.length;
    const normal = filteredInventory.filter((i) => i.status === "normal").length;
    const low = filteredInventory.filter((i) => i.status === "low").length;
    const critical = filteredInventory.filter((i) => i.status === "critical").length;
    const excess = filteredInventory.filter((i) => i.status === "excess").length;

    return { total, normal, low, critical, excess };
  }, [filteredInventory]);

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
        <div>
          <h2
            className="text-lg md:text-xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            فهرست موجودی انبار
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span style={{ color: colors.textSecondary }}>
              کل: {stats.total}
            </span>
            <span style={{ color: colors.success }}>عادی: {stats.normal}</span>
            <span style={{ color: colors.warning }}>کم: {stats.low}</span>
            <span style={{ color: colors.error }}>بحرانی: {stats.critical}</span>
            <span style={{ color: colors.primary }}>اضافه: {stats.excess}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <SavedFiltersButton tableId={TABLE_ID} />
          <ColumnCustomizer
            tableId={TABLE_ID}
            defaultColumns={customColumns}
            onColumnsChange={setCustomColumns}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b" style={{ borderColor: colors.border }} dir="rtl">
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 border"
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
            placeholder="جستجو در موجودی (نام محصول، دسته‌بندی، انبار)"
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

      {/* Active Filters Display */}
      {tableFilters.length > 0 && (
        <div
          className="p-4 border-b"
          dir="rtl"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              فیلترهای فعال:
            </span>
            {tableFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-1 px-2 py-1 border rounded text-xs"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <span style={{ color: colors.textPrimary }}>
                  {customColumns.find((c) => c.key === filter.column)
                    ?.customLabel ||
                    customColumns.find((c) => c.key === filter.column)?.label ||
                    filter.column}{" "}
                  <span style={{ color: colors.primary }}>
                    {getOperatorLabel(filter.operator)}
                  </span>{" "}
                  {filter.value}
                </span>
                <button
                  onClick={() =>
                    dispatch(
                      removeFilter({ tableId: TABLE_ID, filterId: filter.id })
                    )
                  }
                  style={{ color: colors.error }}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => dispatch(clearAllFilters(TABLE_ID))}
              className="text-xs hover:underline"
              style={{ color: colors.error }}
            >
              پاک کردن همه
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]" dir="rtl">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              {activeColumns.map((column, index, array) => (
                <th
                  key={column.key}
                  className="p-3 text-sm font-medium text-right"
                  style={{ color: colors.textSecondary }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center justify-between gap-2 group cursor-pointer flex-1"
                      onClick={() => handleFilterClick(column.key)}
                    >
                      <span
                        className="transition-colors text-right flex-1"
                        style={{ color: colors.textSecondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                      >
                        {column.customLabel || column.label}
                      </span>
                      <div
                        className="p-1 rounded transition-colors"
                        style={{
                          color: tableFilters.some((f) => f.column === column.key)
                            ? colors.primary
                            : colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.cardBackground;
                          e.currentTarget.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = tableFilters.some(
                            (f) => f.column === column.key
                          )
                            ? colors.primary
                            : colors.textSecondary;
                        }}
                      >
                        <FilterIcon className="w-4 h-4" />
                      </div>
                    </div>
                    {index < array.length - 1 && (
                      <div
                        className="h-6 w-px"
                        style={{ backgroundColor: colors.border }}
                      ></div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr
                key={item.id}
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
                {activeColumns.map((column) => renderCell(item, column))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div
            className="p-8 text-center"
            style={{ color: colors.textSecondary }}
            dir="rtl"
          >
            هیچ موجودی با این فیلترها یافت نشد
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredInventory.length > 0 && (
        <div
          className="p-3 md:p-4 border-t flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0"
          dir="rtl"
          style={{
            borderColor: colors.border,
          }}
        >
          {/* Rows per page selector */}
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
              {startIndex + 1} تا {Math.min(endIndex, filteredInventory.length)} از{" "}
              {filteredInventory.length}
            </span>
          </div>

          <span
            className="text-xs md:text-sm whitespace-nowrap hidden md:inline"
            style={{ color: colors.textSecondary }}
          >
            نمایش {startIndex + 1} تا{" "}
            {Math.min(endIndex, filteredInventory.length)} از{" "}
            {filteredInventory.length} مورد
          </span>

          {/* Page navigation */}
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

            {/* Page numbers */}
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

      {/* Filter Panel */}
      {openColumnFilter && (
        <FilterPanel
          tableId={TABLE_ID}
          column={openColumnFilter}
          columnLabel={
            customColumns.find((c) => c.key === openColumnFilter)?.label ||
            openColumnFilter
          }
          onClose={() => dispatch(setOpenColumnFilter(null))}
        />
      )}
    </div>
  );
}