"use client"

import { useState, useRef, useEffect } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { addFilter, FilterOperator } from "../store/filtersSlice";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface FilterPanelProps {
  column: string;
  columnLabel: string;
  onClose: () => void;
  tableId: string;
}

const operators: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "مساوی" },
  { value: "notEquals", label: "نامساوی" },
  { value: "greaterThan", label: "بیشتر از" },
  { value: "greaterThanOrEqual", label: "بیشتر یا مساوی" },
  { value: "lessThan", label: "کوچک‌تر از" },
  { value: "lessThanOrEqual", label: "کمتر یا مساوی" },
  { value: "hasIncompleteData", label: "دارای داده ناقص" },
  { value: "hasCompleteData", label: "دارای داده کامل" },
  { value: "contains", label: "شامل متن" },
  { value: "isEmpty", label: "بدون داده" },
];

export function FilterPanel({ column, columnLabel, onClose, tableId }: FilterPanelProps) {
  const dispatch = useAppDispatch();
  const [operator, setOperator] = useState<FilterOperator | null>(null);
  const [value, setValue] = useState("");
  const [isOperatorOpen, setIsOperatorOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOperatorOpen(false);
      }
    };

    if (isOperatorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOperatorOpen]);

  const handleAddFilter = () => {
    if (value.trim() && operator) {
      dispatch(
        addFilter({
          tableId,
          filter: {
            id: Date.now().toString(),
            column,
            operator,
            value: value.trim(),
          }
        })
      );
      setValue("");
      setOperator(null);
      // Don't close - allow multiple filters
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const selectedOperatorLabel = operator ? operators.find(op => op.value === operator)?.label : "انتخاب کنید...";

  const colors = useCurrentColors();

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-[9998] transition-all duration-200"
        onClick={handleBackdropClick}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl w-[500px] max-w-[90vw] z-[9999] animate-fadeIn border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(to left, ${colors.primary}, transparent)`
            }}
          />
          <div 
            className="relative flex items-center justify-between px-6 py-5 border-b"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-1 h-6 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${colors.primary}, ${colors.primary}dd)`
                }}
              />
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                فیلتر {columnLabel}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all duration-200 hover:rotate-90"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Operator Select - Custom Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold" style={{ color: colors.textPrimary }}>
              نوع فیلتر
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOperatorOpen(!isOperatorOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: isOperatorOpen ? colors.primary : colors.border,
                  color: !operator ? colors.textSecondary : colors.textPrimary,
                  boxShadow: isOperatorOpen ? `0 0 0 4px ${colors.primary}20` : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isOperatorOpen) {
                    e.currentTarget.style.borderColor = `${colors.primary}80`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOperatorOpen) {
                    e.currentTarget.style.borderColor = colors.border;
                  }
                }}
              >
                <span>{selectedOperatorLabel}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${isOperatorOpen ? 'rotate-180' : ''}`}
                  style={{ color: isOperatorOpen ? colors.primary : colors.textSecondary }}
                />
              </button>
              
              {/* Dropdown Menu */}
              {isOperatorOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl max-h-72 overflow-y-auto z-[99999]"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border
                  }}
                  dir="rtl"
                >
                  <div className="p-2">
                    {operators.map((op, index) => (
                      <button
                        key={op.value}
                        type="button"
                        onClick={() => {
                          setOperator(op.value);
                          setIsOperatorOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-right text-sm font-medium rounded-lg transition-all duration-150 ${index !== 0 ? 'mt-1' : ''}`}
                        style={{
                          backgroundColor: operator === op.value ? colors.primary : 'transparent',
                          color: operator === op.value ? '#ffffff' : colors.textPrimary
                        }}
                        onMouseEnter={(e) => {
                          if (operator !== op.value) {
                            e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (operator !== op.value) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold" style={{ color: colors.textPrimary }}>
              مقدار فیلتر
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFilter()}
              className="w-full px-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="مقدار مورد نظر را وارد کنید..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAddFilter}
              disabled={!value.trim() || !operator}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-white rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-[0.98]"
              style={{
                background: !value.trim() || !operator 
                  ? '#969696'
                  : `linear-gradient(to left, ${colors.primary}, ${colors.primary}dd)`,
                opacity: !value.trim() || !operator ? 0.4 : 1,
                cursor: !value.trim() || !operator ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (value.trim() && operator) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (value.trim() && operator) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              <Plus className="w-5 h-5" />
              <span>افزودن فیلتر</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl font-bold transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textSecondary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </>
  );
}