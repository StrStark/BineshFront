import { useState, useMemo, useEffect, useCallback, ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Filter as FilterIcon,
  X,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ColumnCustomizer, ColumnConfig } from "./ColumnCustomizer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFilter, clearAllFilters, setOpenColumnFilter } from "../store/filtersSlice";
import { CustomColumnCell } from "./CustomColumnCell";
import { SavedFiltersButton } from "./SavedFiltersButton";

interface GenericTableProps<T extends { id: string | number }> {
  data: T[];
  tableId: string;
  title: string;
  customColumns: ColumnConfig[];
  setCustomColumns?: (columns: ColumnConfig[]) => void;
  renderCell: (item: T, column: ColumnConfig) => ReactNode;
  handleEdit?: (itemId: string | number) => void;
  handleDelete?: (itemId: string | number) => void;
}

export function GenericTableWithFilters<T extends { id: string | number }>({
  data,
  tableId,
  title,
  customColumns,
  setCustomColumns,
  renderCell,
  handleEdit,
  handleDelete,
}: GenericTableProps<T>) {
  const colors = useCurrentColors();
  const dispatch = useAppDispatch();
  const { activeFilters, openColumnFilter } = useAppSelector(
    (state) => state.filters
  );
  const tableFilters = activeFilters[tableId] || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [localVisibleColumns, setLocalVisibleColumns] = useState<ColumnConfig[]>(
    customColumns
  );
  const [customColumnData, setCustomColumnData] = useState<
    Record<string, Record<string, string | string[]>>
  >({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Load custom column data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`customColumnData_${tableId}`);
    if (saved) {
      try {
        setCustomColumnData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom column data:", e);
      }
    }
  }, [tableId]);

  // Save custom column data to localStorage
  const handleCustomColumnChange = (
    rowId: string | number,
    columnKey: string,
    value: string | string[]
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
        `customColumnData_${tableId}`,
        JSON.stringify(newData)
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
    [setCustomColumns]
  );

  // Filter only visible columns
  const activeColumns = localVisibleColumns.filter((col) => col.visible);

  // Render cell content based on column
  const renderCellContent = (item: T, column: ColumnConfig) => {
    // Check if this is a custom column
    if (column.isCustom) {
      return (
        <td key={column.key} className="p-3">
          <CustomColumnCell
            column={column}
            rowId={item.id}
            value={customColumnData[item.id]?.[column.key] || ""}
            onChange={handleCustomColumnChange}
          />
        </td>
      );
    }

    // Actions column
    if (column.key === "actions") {
      return (
        <td key={column.key} className="p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log("View item details:", item.id);
              }}
              className="p-2 rounded-lg transition-colors"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              title="مشاهده جزئیات"
            >
              <Eye className="w-4 h-4" />
            </button>
            {handleEdit && (
              <button
                onClick={() => handleEdit(item.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.warning }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.warning}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="ویرایش"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {handleDelete && (
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.error }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.error}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      );
    }

    // Use custom render function
    return renderCell(item, column);
  };

  // Apply filters to data
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by custom tags
    if (selectedTags.length > 0) {
      result = result.filter((item) => {
        // Get all tag columns
        const tagColumns = localVisibleColumns.filter(
          (col) => col.isCustom && col.type === "tags"
        );

        // Check if any of the selected tags are in this item's data
        return tagColumns.some((col) => {
          const itemTags = customColumnData[item.id]?.[col.key];
          if (!itemTags) return false;

          const tagsArray = Array.isArray(itemTags)
            ? itemTags
            : [itemTags];
          return tagsArray.some((tag) => selectedTags.includes(tag));
        });
      });
    }

    tableFilters.forEach((filter) => {
      result = result.filter((item) => {
        const value = String((item as any)[filter.column] || "");
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
  }, [tableFilters, data, selectedTags, localVisibleColumns, customColumnData]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tableFilters, rowsPerPage]);

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
          {title}
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <SavedFiltersButton tableId={tableId} />
          <ColumnCustomizer
            tableId={tableId}
            defaultColumns={customColumns}
            onColumnsChange={setCustomColumns}
          />
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
                      removeFilter({ tableId: tableId, filterId: filter.id })
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
              onClick={() => dispatch(clearAllFilters(tableId))}
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
          col.options.length > 0
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
                  col.options.length > 0
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
                          : [...prev, option.value]
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
                                (f) => f.column === column.key
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
                                (f) => f.column === column.key
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
                {activeColumns.map((column) => renderCellContent(item, column))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div
            className="p-8 text-center"
            style={{ color: colors.textSecondary }}
            dir="rtl"
          >
            هیچ موردی با این فیلترها یافت نشد
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
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
                <option value={100}>100 سطر</option>
              </select>
            </div>
            <span
              className="text-xs md:text-sm whitespace-nowrap md:hidden"
              style={{ color: colors.textSecondary }}
            >
              {startIndex + 1} تا {Math.min(endIndex, filteredData.length)}{" "}
              از {filteredData.length}
            </span>
          </div>

          <span
            className="text-xs md:text-sm whitespace-nowrap hidden md:inline"
            style={{ color: colors.textSecondary }}
          >
            نمایش {startIndex + 1} تا{" "}
            {Math.min(endIndex, filteredData.length)} از{" "}
            {filteredData.length} مورد
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
                  // Show first page, last page, current page, and neighbors
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
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
