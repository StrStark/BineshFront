import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter as FilterIcon,
  History,
  X,
  Trash2,
  Download,
  Search, // ← added (was missing)
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  removeFilter,
  clearAllFilters,
  setOpenColumnFilter,
} from "../store/filtersSlice";
import { ColumnCustomizer, ColumnConfig } from "./ColumnCustomizer";
import { PurchaseHistoryModal } from "./PurchaseHistoryModal";
import { FilterPanel } from "./FilterPanel";
import { CustomColumnCell } from "./CustomColumnCell";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { SavedFiltersButton } from "./SavedFiltersButton";
import { getCallHistoryByCustomer, statusLabels } from "../data/callsData";
import { generateInvoicePDF } from "../utils/invoiceGenerator";
import { FilterDropdown } from "./FilterDropdown";
import { CustomerSalesModal } from "./CustomerSalesModal";
import { customerAPI, CustomerSalesData } from "../api/customerAPI";

interface Customer {
  id: string;
  fullName: string;
  isActive: boolean;
  salesCount: number;
  place: string;
}

const defaultColumns: ColumnConfig[] = [
  { key: "fullName", label: "نام مشتری", visible: true },
  { key: "isActive", label: "وضعیت", visible: true },
  { key: "salesCount", label: "تعداد فروش‌ها", visible: true },
  { key: "place", label: "محل", visible: true },
  { key: "history", label: "جزئیات", visible: true },
  { key: "actions", label: "عملیات", visible: true },
];

interface CustomersTableProps {
  customers: Customer[];
  customColumns?: ColumnConfig[];
  setCustomColumns?: (columns: ColumnConfig[]) => void;
  handleEdit?: (customerId: string) => void;
  handleDelete?: (customerId: string) => void;
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  selectedCustomerType?: string;
  selectedProductType?: string;
  onCustomerTypeChange?: (type: string) => void;
  onProductTypeChange?: (type: string) => void;
  customerTypeOptions?: Array<{ value: string; label: string }>;
  productTypeOptions?: Array<{ value: string; label: string }>;
}

export function CustomersTableWithFilters({
  customers,
  customColumns,
  setCustomColumns,
  handleEdit,
  handleDelete,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  selectedCustomerType,
  selectedProductType,
  onCustomerTypeChange,
  onProductTypeChange,
  customerTypeOptions,
  productTypeOptions,
}: CustomersTableProps) {
  const dispatch = useAppDispatch();
  const TABLE_ID = "customers-table";
  const { activeFilters, openColumnFilter } = useAppSelector(
    (state) => state.filters,
  );
  const tableFilters = activeFilters[TABLE_ID] || [];
  const colors = useCurrentColors();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync local rowsPerPage with controlled prop from parent
  useEffect(() => {
    if (pageSize !== undefined) {
      setRowsPerPage(pageSize);
    }
  }, [pageSize]);
  const [localVisibleColumns, setLocalVisibleColumns] = useState<
    ColumnConfig[]
  >(customColumns || defaultColumns);
  const [isCallHistoryModalOpen, setIsCallHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [customColumnData, setCustomColumnData] = useState<
    Record<string, Record<string, string | string[]>>
  >({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Customer sales modal state
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesData, setSalesData] = useState<CustomerSalesData | null>(null);
  const [salesLoading, setSalesLoading] = useState(false);

    // Rows per page handler (calls parent + resets page)

  // Function to fetch customer sales
  const handleViewSales = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsSalesModalOpen(true);
    setSalesLoading(true);
    setSalesData(null);

    try {
      const response = await customerAPI.getCustomerSales({
        customerIds: {
          ids: [customer.id],
        },
        paggination: {
          pageNumber: 1,
          pageSize: 100,
        },
      });

      if (response.code === 200 && response.body.items.length > 0) {
        setSalesData(response.body.items[0]);
      }
    } catch (error) {
      console.error("Failed to fetch customer sales:", error);
    } finally {
      setSalesLoading(false);
    }
  };

    // Rows per page handler (calls parent + resets page)
  const handleRowsPerPageChange = (newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setRowsPerPage(newSize);
    }
    if (onPageChange) onPageChange(1);
  };

  // Load custom column data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customColumnData_customers-table");
    if (saved) {
      try {
        setCustomColumnData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom column data:", e);
      }
    }
  }, []);

  // Save custom column data to localStorage
  const handleCustomColumnChange = (
    rowId: number,
    columnKey: string,
    value: string | string[],
  ) => {
    setCustomColumnData((prev) => {
      const newData = {
        ...prev,
        [rowId]: {
          ...(prev[rowId] || {}),
          [columnKey]: value,
        },
      };
      localStorage.setItem(
        "customColumnData_customers-table",
        JSON.stringify(newData),
      );
      return newData;
    });
  };

  // Sync local columns with parent when customColumns changes
  useEffect(() => {
    if (customColumns) {
      setLocalVisibleColumns(customColumns);
    }
  }, [customColumns]);

  const handleFilterClick = (column: string) => {
    dispatch(setOpenColumnFilter(column));
  };

  const handleColumnsChange = useCallback(
    (newColumns: ColumnConfig[]) => {
      setLocalVisibleColumns(newColumns);
      if (setCustomColumns) {
        setCustomColumns(newColumns);
      }
    },
    [setCustomColumns],
  );

  // Filter only visible columns
  const activeColumns = localVisibleColumns.filter((col) => col.visible);

  // Render cell content based on column key
  const renderCell = (customer: Customer, column: ColumnConfig) => {
    // Check if this is a custom column
    if (column.isCustom) {
      // Only render custom columns that have actual data
      const hasData = customColumnData[customer.id]?.[column.key];
      if (!hasData && column.type !== "tags") {
        return (
          <td key={column.key} className="p-3">
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              -
            </span>
          </td>
        );
      }
      return (
        <td key={column.key} className="p-3">
          <CustomColumnCell
            column={column}
            rowId={Number(customer.id)}
            value={customColumnData[customer.id]?.[column.key] || ""}
            onChange={handleCustomColumnChange}
          />
        </td>
      );
    }

    // Default columns - only render if data exists in API
    switch (column.key) {
      case "fullName":
        return (
          <td
            key={column.key}
            className="p-3 text-sm text-[#1c1c1c] dark:text-white font-medium"
            dir="auto"
          >
            {customer.fullName}
          </td>
        );
      case "isActive":
        return (
          <td
            key={column.key}
            className="p-3 text-sm text-[#585757] dark:text-[#b8bfc8]"
            dir="ltr"
          >
            {customer.isActive ? "فعال" : "غیرفعال"}
          </td>
        );
      case "salesCount":
        return (
          <td
            key={column.key}
            className="p-3 text-sm text-[#585757] dark:text-[#b8bfc8] text-center"
          >
            {customer.salesCount}
          </td>
        );
      case "place":
        return (
          <td
            key={column.key}
            className="p-3 text-sm text-[#585757] dark:text-[#b8bfc8]"
            dir="rtl"
          >
            {customer.place || "-"}
          </td>
        );
      case "history":
        return (
          <td key={column.key} className="p-3">
            <button
              onClick={() => handleViewSales(customer)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md flex items-center gap-2 whitespace-nowrap"
              style={{
                backgroundColor: colors.primary + "15",
                color: colors.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary + "15";
                e.currentTarget.style.color = colors.primary;
              }}
            >
              <History className="w-4 h-4" />
              <span>جزئیات</span>
            </button>
          </td>
        );
      case "actions":
        return (
          <td key={column.key} className="p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (handleEdit) {
                    handleEdit(customer.id);
                  }
                }}
                className="p-2 text-[#ff9800] hover:bg-[#fff3e0] dark:hover:bg-[#3a2d1a] rounded-lg transition-colors"
                title="ویرایش"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (handleDelete) {
                    handleDelete(customer.id);
                  }
                }}
                className="p-2 text-[#f44336] hover:bg-[#ffcdd2] dark:hover:bg-[#5c2e2e] rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  generateInvoicePDF(
                    customer.id,
                    customer.fullName,
                    "",
                    "",
                  );
                }}
                className="p-2 text-[#4caf50] hover:bg-[#e8f5e9] dark:hover:bg-[#2e5c3a] rounded-lg transition-colors"
                title="دانلود فاکتور"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </td>
        );
      default:
        // For any column not in API response, show dash
        return (
          <td key={column.key} className="p-3">
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              -
            </span>
          </td>
        );
    }
  };

  // Apply filters + search to data
  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Search bar filter (now connected)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((customer) =>
        customer.fullName.toLowerCase().includes(query)
      );
    }

    // Filter by custom tags
    if (selectedTags.length > 0) {
      result = result.filter((customer) => {
        const tagColumns = localVisibleColumns.filter(
          (col) => col.isCustom && col.type === "tags",
        );

        return tagColumns.some((col) => {
          const customerTags = customColumnData[customer.id]?.[col.key];
          if (!customerTags) return false;

          const tagsArray = Array.isArray(customerTags)
            ? customerTags
            : [customerTags];
          return tagsArray.some((tag) => selectedTags.includes(tag));
        });
      });
    }

    tableFilters.forEach((filter) => {
      result = result.filter((customer) => {
        const value = String(customer[filter.column as keyof Customer] || "");
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
          case "hasIncompleteData":
            return value === "" || value === null || value === undefined;
          case "hasCompleteData":
            return value !== "" && value !== null && value !== undefined;
          case "isEmpty":
            return value === "" || value === null || value === undefined;
          default:
            return true;
        }
      });
    });

    return result;
  }, [
    tableFilters,
    customers,
    selectedTags,
    localVisibleColumns,
    customColumnData,
    searchQuery, // ← added
  ]);

  // Reset to page 1 when filters or search change
   // Reset to page 1 when filters or search change
  useEffect(() => {
    if (onPageChange) onPageChange(1);
  }, [tableFilters, searchQuery, onPageChange]);

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

  // Generate page numbers for pagination UI (same as ProductsTableWithFilters)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (effectiveCurrentPage <= 3) {
        // Near start: 1 2 3 4 ... last
        pages.push(2, 3, 4, '...', totalPages);
      } else if (effectiveCurrentPage >= totalPages - 2) {
        // Near end: 1 ... last-3 last-2 last-1 last
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: 1 ... current-1 current current+1 ... last
        pages.push('...', effectiveCurrentPage - 1, effectiveCurrentPage, effectiveCurrentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // ==================== PAGINATION LOGIC ====================
  // Detect if using external (server-side) or internal (client-side) pagination
  const isExternalPagination = currentPage !== undefined && totalCount !== undefined;
  
  const effectiveCurrentPage = currentPage || 1;
  const effectivePageSize = pageSize || rowsPerPage;
  const effectiveTotalCount = isExternalPagination ? totalCount : filteredCustomers.length;
  const totalPages = Math.ceil(effectiveTotalCount / effectivePageSize);

  const startIndex = (effectiveCurrentPage - 1) * effectivePageSize;
  const endIndex = Math.min(startIndex + effectivePageSize, effectiveTotalCount);

  // For external pagination: use customers as-is (already sliced by server)
  // For internal pagination: slice the filtered data
  const paginatedCustomers = useMemo(() => {
    if (isExternalPagination) {
      return customers; // Server already sent the correct page
    }
    return filteredCustomers.slice(startIndex, startIndex + effectivePageSize);
  }, [isExternalPagination, customers, filteredCustomers, startIndex, effectivePageSize]);

  return (
    <div
      className="rounded-lg border overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Header with Saved Filters Button */}
      <div
        className="p-3 md:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
        dir="rtl"
        style={{ borderColor: colors.border }}
      >
        <h2
          className="text-lg md:text-xl font-semibold"
          dir="auto"
          style={{ color: colors.textPrimary }}
        >
          مشتریان
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <SavedFiltersButton tableId="customers-table" />
          <ColumnCustomizer
            tableId="customers-table"
            defaultColumns={customColumns}
            onColumnsChange={setCustomColumns}
          />
        </div>
      </div>
      
      {/* Search Bar (now fully working) */}
      <div
        className="rounded-lg p-4 border"
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
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  {localVisibleColumns.find((c) => c.key === filter.column)
                    ?.customLabel ||
                    localVisibleColumns.find((c) => c.key === filter.column)
                      ?.label ||
                    filter.column}{" "}
                  <span style={{ color: colors.primary }}>
                    {getOperatorLabel(filter.operator)}
                  </span>{" "}
                  {filter.value}
                </span>
                <button
                  onClick={() =>
                    dispatch(
                      removeFilter({ tableId: TABLE_ID, filterId: filter.id }),
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

      {/* Tag Filters */}
      {localVisibleColumns.some(
        (col) =>
          col.isCustom &&
          col.type === "tags" &&
          col.options &&
          col.options.length > 0,
      ) && (
        <div
          className="p-4 border-b"
          dir="rtl"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {localVisibleColumns
              .filter(
                (col) =>
                  col.isCustom &&
                  col.type === "tags" &&
                  col.options &&
                  col.options.length > 0,
              )
              .flatMap((col) => col.options || [])
              .map((option) => {
                const isSelected = selectedTags.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedTags((prev) =>
                        prev.includes(option.value)
                          ? prev.filter((t) => t !== option.value)
                          : [...prev, option.value],
                      );
                    }}
                    className="px-3 py-1.5 border rounded-lg text-sm transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? option.color
                        : colors.cardBackground,
                      borderColor: isSelected ? "transparent" : colors.border,
                      color: isSelected ? "white" : option.color,
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
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
                      {column.key !== "actions" &&
                        !(column.isCustom && column.type === "tags") && (
                          <div
                            className="p-1 rounded transition-colors"
                            style={{
                              color: tableFilters.some(
                                (f) => f.column === column.key,
                              )
                                ? colors.primary
                                : colors.textSecondary,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.cardBackground;
                              e.currentTarget.style.color = colors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = tableFilters.some(
                                (f) => f.column === column.key,
                              )
                                ? colors.primary
                                : colors.textSecondary;
                            }}
                          >
                            <FilterIcon className="w-4 h-4" />
                          </div>
                        )}
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
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
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
                {activeColumns.map((column) => renderCell(customer, column))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div
            className="p-8 text-center text-[#969696] dark:text-[#8b92a8]"
            dir="rtl"
          >
            هیچ مشتری با این فیلترها یافت نشد
          </div>
        )}
      </div>

      {/* Pagination */}
      {effectiveTotalCount > 0 && (
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
                value={effectivePageSize}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
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
                <option value={100}>100 سطر</option>
              </select>
            </div>
            <span
              className="text-xs md:text-sm whitespace-nowrap md:hidden"
              style={{ color: colors.textSecondary }}
            >
              {startIndex + 1} تا {endIndex} از {effectiveTotalCount}
            </span>
          </div>

          <span
            className="text-xs md:text-sm whitespace-nowrap hidden md:inline"
            style={{ color: colors.textSecondary }}
          >
            نمایش {startIndex + 1} تا {endIndex} از {effectiveTotalCount} مورد
          </span>

          {/* Page navigation */}
          <div className="flex items-center gap-1.5 md:gap-2 justify-center md:justify-end">
            <button
              onClick={() =>
                onPageChange && onPageChange(Math.max(1, effectiveCurrentPage - 1))
              }
              disabled={effectiveCurrentPage === 1}
              className="p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                color: colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                if (effectiveCurrentPage !== 1) {
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
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === effectiveCurrentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      console.log(`🔄 صفحه تغییر کرد: ${pageNumber} | API در حال فراخوانی با pageNumber: ${pageNumber}`);
                      onPageChange && onPageChange(pageNumber);
                    }}
                    className="min-w-[32px] h-8 px-2 flex items-center justify-center rounded text-sm transition-colors"
                    style={{
                      backgroundColor: isActive ? colors.primary : colors.cardBackground,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: isActive ? colors.primary : colors.border,
                      color: isActive ? "#ffffff" : colors.textPrimary,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = colors.cardBackground;
                      }
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                onPageChange && onPageChange(Math.min(totalPages, effectiveCurrentPage + 1))
              }
              disabled={effectiveCurrentPage === totalPages}
              className="p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                color: colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                if (effectiveCurrentPage !== totalPages) {
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
            localVisibleColumns.find((c) => c.key === openColumnFilter)
              ?.label || openColumnFilter
          }
          onClose={() => dispatch(setOpenColumnFilter(null))}
        />
      )}

      {/* Call History Modal */}
      {isCallHistoryModalOpen && selectedCustomer && (
        <PurchaseHistoryModal
          isOpen={isCallHistoryModalOpen}
          onClose={() => setIsCallHistoryModalOpen(false)}
          customerName={selectedCustomer.fullName}
          phoneNumber={""}
          purchaseHistory={[
            {
              id: 1,
              date: "1403/10/15",
              invoiceNumber: "1400",
              productName: "فرش 1200 شانه طرح خرید",
              quantity: 1,
              unitPrice: 10000000,
              totalPrice: 10000000,
              paymentStatus: "پرداخت شده",
              orderStatus: "تحویل شده",
            },
            {
              id: 2,
              date: "1403/09/20",
              invoiceNumber: "1325",
              productName: "موکت 700 شانه کد 2054",
              quantity: 2,
              unitPrice: 5500000,
              totalPrice: 11000000,
              paymentStatus: "پرداخت شده",
              orderStatus: "تحویل شده",
            },
            {
              id: 3,
              date: "1403/08/10",
              invoiceNumber: "1256",
              productName: "فرش 1000 شانه طرح کلاسیک",
              quantity: 1,
              unitPrice: 8500000,
              totalPrice: 8500000,
              paymentStatus: "پرداخت شده",
              orderStatus: "تحویل شده",
            },
            {
              id: 4,
              date: "1403/07/05",
              invoiceNumber: "1189",
              productName: "زیر انداز 500 شانه",
              quantity: 3,
              unitPrice: 2000000,
              totalPrice: 6000000,
              paymentStatus: "پرداخت شده",
              orderStatus: "تحویل شده",
            },
            {
              id: 5,
              date: "1403/06/25",
              invoiceNumber: "1145",
              productName: "فرش ماشینی 1500 شانه",
              quantity: 1,
              unitPrice: 12000000,
              totalPrice: 12000000,
              paymentStatus: "در انتظار",
              orderStatus: "در حال ارسال",
            },
          ]}
        />
      )}

      {/* Customer Sales Modal */}
      {isSalesModalOpen && selectedCustomer && (
        <CustomerSalesModal
          customer={{
            id: selectedCustomer.id,
            name: selectedCustomer.fullName,
            phone: "",
            location: selectedCustomer.place || "",
            status: selectedCustomer.isActive ? "فعال" : "غیرفعال",
            purchaseCount: String(selectedCustomer.salesCount),
          }}
          salesData={salesData}
          loading={salesLoading}
          onClose={() => setIsSalesModalOpen(false)}
        />
      )}
    </div>
  );
}