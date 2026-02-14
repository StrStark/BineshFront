import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  TrendingUp,
  Printer,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ColumnCustomizer, ColumnConfig } from "./ColumnCustomizer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFilter, clearAllFilters, setOpenColumnFilter } from "../store/filtersSlice";
import { FilterPanel } from "./FilterPanel";
import { SavedFiltersButton } from "./SavedFiltersButton";
import { SaleItem } from "../data/salesData";
import { InvoiceModal } from "./InvoiceModal";

const defaultColumnsConfig: ColumnConfig[] = [
  { key: "invoiceNumber", label: "شماره فاکتور", visible: true },
  { key: "productName", label: "محصول", visible: true },
  { key: "category", label: "دسته", visible: true },
  { key: "quantity", label: "تعداد", visible: true },
  { key: "customer", label: "مشتری", visible: true },
  { key: "seller", label: "فروشنده", visible: true },
  { key: "amount", label: "مبلغ", visible: true },
  { key: "date", label: "تاریخ", visible: true },
  { key: "paymentStatus", label: "وضعیت پرداخت", visible: true },
  { key: "orderStatus", label: "وضعیت سفارش", visible: true },
  { key: "actions", label: "عملیات", visible: true },
];

interface SalesTableProps {
  data?: SaleItem[];
  defaultColumns?: ColumnConfig[];
  totalRecords?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function SalesTable({ 
  data = [], 
  defaultColumns = defaultColumnsConfig,
  totalRecords,
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  onPageChange,
  onPageSizeChange
}: SalesTableProps) {
  const colors = useCurrentColors();
  const dispatch = useAppDispatch();
  const TABLE_ID = "sales-table";
  const { activeFilters, openColumnFilter } = useAppSelector(
    (state) => state.filters
  );
  const tableFilters = activeFilters[TABLE_ID] || [];

  // Use external pagination if provided, otherwise use internal
  const isServerSidePagination = totalRecords !== undefined && onPageChange !== undefined;
  
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);
  const [customColumns, setCustomColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState<SaleItem | null>(null);

  const currentPage = isServerSidePagination ? (externalCurrentPage || 1) : internalCurrentPage;
  const rowsPerPage = isServerSidePagination ? (externalPageSize || 10) : internalRowsPerPage;

  const allSales: SaleItem[] = data;

  const activeColumns = customColumns.filter((col) => col.visible);

  const renderCell = (item: SaleItem, column: ColumnConfig) => {
    switch (column.key) {
      case "invoiceNumber":
        return (
          <td
            key={column.key}
            className="p-3 text-sm font-medium"
            style={{ color: colors.textPrimary }}
          >
            {item.invoiceNumber}
          </td>
        );
      case "productName":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
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
      case "quantity":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textPrimary }}
          >
            {item.quantity} عدد
          </td>
        );
      case "customer":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.customer}
          </td>
        );
      case "seller":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.seller}
          </td>
        );
      case "amount":
        return (
          <td
            key={column.key}
            className="p-3 text-sm font-medium"
            style={{ color: colors.textPrimary }}
          >
            {item.amount.toLocaleString()} تومان
          </td>
        );
      case "date":
        return (
          <td
            key={column.key}
            className="p-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {item.date}
          </td>
        );
      case "paymentStatus":
        const paymentConfig = {
          "پرداخت شده": { color: colors.success, icon: CheckCircle },
          "در انتظار": { color: colors.warning, icon: Clock },
          "لغو شده": { color: colors.error, icon: XCircle },
        };
        const paymentStatus = paymentConfig[item.paymentStatus];
        const PaymentIcon = paymentStatus.icon;
        return (
          <td key={column.key} className="p-3">
            <div className="flex items-center gap-2">
              <PaymentIcon className="w-4 h-4" style={{ color: paymentStatus.color }} />
              <span
                className="text-sm"
                style={{ color: paymentStatus.color }}
              >
                {item.paymentStatus}
              </span>
            </div>
          </td>
        );
      case "orderStatus":
        const orderConfig = {
          "تکمیل شده": { color: colors.success, icon: CheckCircle },
          "در حال پردازش": { color: colors.warning, icon: Clock },
          "لغو شده": { color: colors.error, icon: XCircle },
        };
        const orderStatus = orderConfig[item.orderStatus];
        const OrderIcon = orderStatus.icon;
        return (
          <td key={column.key} className="p-3">
            <div className="flex items-center gap-2">
              <OrderIcon className="w-4 h-4" style={{ color: orderStatus.color }} />
              <span
                className="text-sm"
                style={{ color: orderStatus.color }}
              >
                {item.orderStatus}
              </span>
            </div>
          </td>
        );
      case "actions":
        return (
          <td key={column.key} className="p-3">
            <button
              onClick={() => setSelectedSaleForInvoice(item)}
              className="p-1.5 rounded transition-all hover:opacity-80"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
              title="چاپ فاکتور"
            >
              <Printer className="w-4 h-4" />
            </button>
          </td>
        );
      default:
        return <td key={column.key} className="p-3"></td>;
    }
  };

  const searchFilteredItems = useMemo(() => {
    return allSales.filter(
      (item) =>
        item.invoiceNumber.includes(searchQuery) ||
        item.productName.includes(searchQuery) ||
        item.customer.includes(searchQuery) ||
        item.category.includes(searchQuery)
    );
  }, [searchQuery, allSales]);

  const filteredSales = useMemo(() => {
    let result = searchFilteredItems;

    tableFilters.forEach((filter) => {
      result = result.filter((item) => {
        const value = String(item[filter.column as keyof SaleItem] || "");
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

  // For server-side pagination, use the data as-is, otherwise slice it
  const totalPages = isServerSidePagination 
    ? Math.ceil((totalRecords || 0) / rowsPerPage)
    : Math.ceil(filteredSales.length / rowsPerPage);
  const totalCount = isServerSidePagination ? (totalRecords || 0) : filteredSales.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = isServerSidePagination ? filteredSales : filteredSales.slice(startIndex, endIndex);

  useEffect(() => {
    if (!isServerSidePagination) {
      setInternalCurrentPage(1);
    }
  }, [tableFilters, rowsPerPage, searchQuery, isServerSidePagination]);

  const handlePageChange = (page: number) => {
    if (isServerSidePagination && onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isServerSidePagination && onPageSizeChange) {
      onPageSizeChange(size);
      if (onPageChange) {
        onPageChange(1); // Reset to first page
      }
    } else {
      setInternalRowsPerPage(size);
      setInternalCurrentPage(1);
    }
  };

  const handleFilterClick = (column: string) => {
    dispatch(setOpenColumnFilter(column));
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      equals: "=",
      notEquals: "",
      contains: "∋",
      greaterThan: ">",
      lessThan: "<",
      greaterThanOrEqual: "≥",
      lessThanOrEqual: "≤",
    };
    return labels[operator] || operator;
  };

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
          فروش
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <SavedFiltersButton tableId={TABLE_ID} />
          <ColumnCustomizer
            tableId={TABLE_ID}
            defaultColumns={customColumns}
            onColumnsChange={setCustomColumns}
          />
        </div>
      </div>

      {/* Search and filters header */}
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
            placeholder="جستجو در فروش (شماره فاکتور، محصول، مشتری)"
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

        {/* Quick actions - REMOVED */}
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
        <table className="w-full min-w-[1400px]" dir="rtl">
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

        {filteredSales.length === 0 && (
          <div
            className="p-8 text-center"
            style={{ color: colors.textSecondary }}
            dir="rtl"
          >
            هیچ فروشی با این فیلترها یافت نشد
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredSales.length > 0 && (
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
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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
              {startIndex + 1} تا {Math.min(endIndex, totalCount)} از{" "}
              {totalCount}
            </span>
          </div>

          <span
            className="text-xs md:text-sm whitespace-nowrap hidden md:inline"
            style={{ color: colors.textSecondary }}
          >
            نمایش {startIndex + 1} تا{" "}
            {Math.min(endIndex, totalCount)} از{" "}
            {totalCount} مورد
          </span>

          <div className="flex items-center gap-1.5 md:gap-2 justify-center md:justify-end">
            <button
              onClick={() => handlePageChange((prev) => Math.max(1, prev - 1))}
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
                        onClick={() => handlePageChange(page)}
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
                handlePageChange((prev) => Math.min(totalPages, prev + 1))
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

      {/* Invoice Modal */}
      {selectedSaleForInvoice && (
        <InvoiceModal
          sale={selectedSaleForInvoice}
          onClose={() => setSelectedSaleForInvoice(null)}
        />
      )}
    </div>
  );
}