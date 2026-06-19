"use client"

import { useState, useEffect } from "react";
import { Settings, X, Eye, EyeOff, Plus, Trash2, Tag, Edit2 } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { setColumnSettings } from "../store/filtersSlice";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

export type ColumnType = "text" | "tags";

export interface ColumnOption {
  value: string;
  label: string;
  color?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  customLabel?: string;
  type?: ColumnType;
  options?: ColumnOption[];
  isCustom?: boolean;
}

interface ColumnCustomizerProps {
  tableId: string; // Unique ID for each table to save settings separately
  defaultColumns: { key: string; label: string }[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

export function ColumnCustomizer({
  tableId,
  defaultColumns,
  onColumnsChange,
}: ColumnCustomizerProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState("");
  
  // Add new column modal
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [editingCustomColumn, setEditingCustomColumn] = useState<string | null>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<ColumnType>("text");
  const [newColumnOptions, setNewColumnOptions] = useState<ColumnOption[]>([]);
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionColor, setNewOptionColor] = useState("#0085ff");

  // Load saved settings from localStorage
  useEffect(() => {
    if (!defaultColumns || defaultColumns.length === 0) {
      return;
    }
    
    const savedSettings = localStorage.getItem(`columnSettings_${tableId}`);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        
        // Merge saved settings with default columns
        // This ensures new default columns are added if they don't exist in saved settings
        const defaultKeys = defaultColumns.map(col => col.key);
        const savedKeys = parsed.map((col: ColumnConfig) => col.key);
        
        // Find new columns that exist in defaults but not in saved settings
        const newColumns = defaultColumns.filter(col => !savedKeys.includes(col.key)) || [];
        
        // Migration: Fix duplicate option values
        const migratedParsed = parsed.map((col: ColumnConfig) => {
          if (col.options && col.options.length > 0) {
            const seenValues = new Set<string>();
            const uniqueOptions = col.options.map((opt: ColumnOption) => {
              // If value already exists or doesn't have unique suffix, regenerate it
              if (seenValues.has(opt.value) || !opt.value.includes('_')) {
                const newValue = `${opt.label}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                seenValues.add(newValue);
                return { ...opt, value: newValue };
              }
              seenValues.add(opt.value);
              return opt;
            });
            return { ...col, options: uniqueOptions };
          }
          return col;
        });
        
        // Merge: keep saved settings + add new default columns
        const mergedColumns = [
          ...migratedParsed,
          ...(newColumns || []).map(col => ({
            key: col.key,
            label: col.label,
            visible: true,
            customLabel: undefined,
            isCustom: false,
          }))
        ];
        
        setColumns(mergedColumns);
        // Only call onColumnsChange once during initialization
        setTimeout(() => onColumnsChange(mergedColumns), 0);
        
        // Update localStorage with merged and migrated columns
        localStorage.setItem(`columnSettings_${tableId}`, JSON.stringify(mergedColumns));
      } catch (e) {
        initializeColumns();
      }
    } else {
      initializeColumns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId]);

  const initializeColumns = () => {
    if (!defaultColumns || defaultColumns.length === 0) {
      setColumns([]);
      setTimeout(() => onColumnsChange([]), 0);
      return;
    }
    
    const initialColumns = defaultColumns.map((col) => ({
      key: col.key,
      label: col.label,
      visible: true,
      customLabel: undefined,
      isCustom: false,
    }));
    setColumns(initialColumns);
    setTimeout(() => onColumnsChange(initialColumns), 0);
  };

  // Save settings to localStorage
  const saveSettings = (newColumns: ColumnConfig[]) => {
    localStorage.setItem(`columnSettings_${tableId}`, JSON.stringify(newColumns));
    onColumnsChange(newColumns);
    dispatch(setColumnSettings({ tableId, columns: newColumns }));
  };

  const toggleColumnVisibility = (key: string) => {
    const newColumns = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(newColumns);
    saveSettings(newColumns);
  };

  const startEditing = (key: string) => {
    const column = columns.find((col) => col.key === key);
    if (column) {
      setEditingColumn(key);
      setTempLabel(column.customLabel || column.label);
    }
  };

  const saveCustomLabel = (key: string) => {
    const newColumns = columns.map((col) =>
      col.key === key
        ? { ...col, customLabel: tempLabel.trim() || undefined }
        : col
    );
    setColumns(newColumns);
    saveSettings(newColumns);
    setEditingColumn(null);
    setTempLabel("");
  };

  const deleteCustomColumn = (key: string) => {
    const newColumns = columns.filter((col) => col.key !== key);
    setColumns(newColumns);
    saveSettings(newColumns);
  };

  const addOptionToNewColumn = () => {
    if (!newOptionLabel.trim()) return;
    
    setNewColumnOptions([
      ...newColumnOptions,
      {
        value: `${newOptionLabel.trim()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: newOptionLabel.trim(),
        color: newColumnType === "tags" 
          ? newOptionColor 
          : undefined,
      },
    ]);
    
    setNewOptionLabel("");
    setNewOptionColor("#0085ff");
  };

  const removeOptionFromNewColumn = (index: number) => {
    setNewColumnOptions(newColumnOptions.filter((_, i) => i !== index));
  };

  const createNewColumn = () => {
    if (!newColumnName.trim()) return;

    if (editingCustomColumn) {
      // Update existing column
      const newColumns = columns.map((col) =>
        col.key === editingCustomColumn
          ? {
              ...col,
              label: newColumnName.trim(),
              type: newColumnType,
              options: (newColumnType !== "text" && newColumnOptions.length > 0) ? newColumnOptions : undefined,
            }
          : col
      );
      setColumns(newColumns);
      saveSettings(newColumns);
      setEditingCustomColumn(null);
    } else {
      // Create new column
      const newColumn: ColumnConfig = {
        key: `custom_${Date.now()}`,
        label: newColumnName.trim(),
        visible: true,
        type: newColumnType,
        options: (newColumnType !== "text" && newColumnOptions.length > 0) ? newColumnOptions : undefined,
        isCustom: true,
      };

      const newColumns = [...columns, newColumn];
      setColumns(newColumns);
      saveSettings(newColumns);
    }

    // Reset form
    setIsAddingColumn(false);
    setNewColumnName("");
    setNewColumnType("text");
    setNewColumnOptions([]);
    setNewOptionLabel("");
    setNewOptionColor("#0085ff");
  };

  const startEditingCustomColumn = (key: string) => {
    const column = columns.find((col) => col.key === key);
    if (!column || !column.isCustom) return;

    setEditingCustomColumn(key);
    setNewColumnName(column.label);
    setNewColumnType(column.type || "text");
    setNewColumnOptions(column.options || []);
    setIsAddingColumn(true);
  };

  const cancelColumnForm = () => {
    setIsAddingColumn(false);
    setEditingCustomColumn(null);
    setNewColumnName("");
    setNewColumnType("text");
    setNewColumnOptions([]);
    setNewOptionLabel("");
    setNewOptionColor("#0085ff");
  };

  const visibleCount = columns.filter((col) => col.visible).length;

  const columnTypeLabels: Record<ColumnType, string> = {
    text: "متن ساده",
    tags: "برچسب‌ها (چند انتخای با ورود متن)",
  };

  const colors = useCurrentColors();

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        style={{
          backgroundColor: colors.cardBackground,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: colors.border,
          color: colors.textSecondary
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.cardBackground;
        }}
        title="تنظیمات ستون‌ها"
      >
        <Settings className="w-4 h-4" style={{ color: colors.textSecondary }} />
        <span className="text-sm">ستون‌ها</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none" dir="rtl">
            <div className="rounded-xl w-full max-w-[600px] border pointer-events-auto animate-fadeIn shadow-2xl overflow-hidden"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" style={{ color: colors.primary }} />
                  <h2 className="text-lg" style={{ color: colors.textPrimary }}>
                    شخصی‌سازی ستون‌ها
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats and Add Button */}
              <div className="flex items-center justify-between px-6 py-3 border-b" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {visibleCount} از {columns.length} ستون نمایش داده می‌شود
                </p>
                <button
                  onClick={() => setIsAddingColumn(!isAddingColumn)}
                  className="flex items-center gap-2 px-3 py-1.5 text-white rounded-lg transition-colors text-sm"
                  style={{ backgroundColor: colors.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن ستون</span>
                </button>
              </div>

              {/* Add New Column Form */}
              {isAddingColumn && (
                <div className="p-6 border-b space-y-4" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
                  <h3 className="text-sm" style={{ color: colors.textPrimary }}>
                    {editingCustomColumn ? 'ویرایش ستون' : 'افزودن ستون جدید'}
                  </h3>
                  
                  {/* Column Name */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                      نام ستون
                    </label>
                    <input
                      type="text"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      placeholder="مثال: وضعیت پرداخت"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        color: colors.textPrimary
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    />
                  </div>

                  {/* Column Type */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                      نوع ستون
                    </label>
                    <select
                      value={newColumnType}
                      onChange={(e) => {
                        setNewColumnType(e.target.value as ColumnType);
                        setNewColumnOptions([]);
                      }}
                      className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3cpath%20fill%3D%22%23969696%22%20d%3D%22M6%208L0%202%201.4.6%206%205.2%2010.6.6%2012%202z%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[left_1rem_center] bg-no-repeat shadow-sm"
                      style={{ 
                        paddingLeft: '3rem',
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        color: colors.textPrimary
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    >
                      {(Object.keys(columnTypeLabels) as ColumnType[]).map((type) => (
                        <option key={type} value={type} className="py-2">
                          {columnTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Options for non-text columns */}
                  {newColumnType !== "text" && (
                    <div className="space-y-3">
                      <label className="block text-sm" style={{ color: colors.textSecondary }}>
                        گزینه‌ها / برچسب‌ها
                      </label>
                      
                      {/* Add Option Form */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOptionLabel}
                          onChange={(e) => setNewOptionLabel(e.target.value)}
                          placeholder="نام برچسب"
                          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                          style={{
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = colors.primary;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = colors.border;
                          }}
                        />
                        <input
                          type="color"
                          value={newOptionColor}
                          onChange={(e) => setNewOptionColor(e.target.value)}
                          className="w-12 h-10 border rounded-lg cursor-pointer"
                          style={{ borderColor: colors.border }}
                          title="انتخاب رنگ"
                        />
                        <button
                          onClick={addOptionToNewColumn}
                          className="px-3 py-2 text-white rounded-lg transition-colors"
                          style={{ backgroundColor: colors.primary }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options List */}
                      {newColumnOptions.length > 0 && (
                        <div className="space-y-2">
                          {newColumnOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 rounded-lg border"
                              style={{
                                backgroundColor: colors.cardBackground,
                                borderColor: colors.border
                              }}
                            >
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: option.color || colors.primary }}
                              />
                              <span className="flex-1 text-sm" style={{ color: colors.textPrimary }}>
                                {option.label}
                              </span>
                              <button
                                onClick={() => removeOptionFromNewColumn(index)}
                                className="p-1 rounded transition-colors"
                                style={{ color: colors.error }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${colors.error}22`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={createNewColumn}
                      disabled={!newColumnName.trim() || (newColumnType !== "text" && newColumnOptions.length === 0)}
                      className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: colors.primary }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      {editingCustomColumn ? 'به‌روزرسانی ستون' : 'ایجاد ستون'}
                    </button>
                    <button
                      onClick={cancelColumnForm}
                      className="px-4 py-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.textSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      لغو
                    </button>
                  </div>
                </div>
              )}

              {/* Columns List */}
              {!isAddingColumn && (
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border
                        }}
                      >
                        {/* Visibility Toggle */}
                        <button
                          onClick={() => toggleColumnVisibility(column.key)}
                          className="p-1.5 rounded transition-colors"
                          style={{ 
                            color: column.visible ? colors.primary : colors.textSecondary 
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${column.visible ? colors.primary : colors.textSecondary}22`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title={column.visible ? "مخفی کردن" : "نمایش"}
                        >
                          {column.visible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>

                        {/* Column Name (Editable) */}
                        <div className="flex-1">
                          {editingColumn === column.key ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={tempLabel}
                                onChange={(e) => setTempLabel(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveCustomLabel(column.key);
                                  } else if (e.key === "Escape") {
                                    setEditingColumn(null);
                                    setTempLabel("");
                                  }
                                }}
                                className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                                style={{
                                  backgroundColor: colors.cardBackground,
                                  borderColor: colors.primary,
                                  color: colors.textPrimary
                                }}
                                autoFocus
                                placeholder="نام ستون"
                              />
                              <button
                                onClick={() => saveCustomLabel(column.key)}
                                className="px-3 py-1.5 text-white rounded-lg transition-colors text-sm"
                                style={{ backgroundColor: colors.primary }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '0.9';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                              >
                                ذخیره
                              </button>
                              <button
                                onClick={() => {
                                  setEditingColumn(null);
                                  setTempLabel("");
                                }}
                                className="px-3 py-1.5 rounded-lg transition-colors text-sm"
                                style={{
                                  backgroundColor: colors.backgroundSecondary,
                                  color: colors.textSecondary
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                              >
                                لغو
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(column.key)}
                              className="text-right w-full transition-colors"
                              style={{ color: colors.textPrimary }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.textPrimary;
                              }}
                            >
                              <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {column.customLabel || column.label}
                                  </span>
                                  {column.isCustom && (
                                    <span 
                                      className="px-2 py-0.5 text-xs rounded"
                                      style={{
                                        backgroundColor: `${colors.primary}22`,
                                        color: colors.primary
                                      }}
                                    >
                                      سفارشی
                                    </span>
                                  )}
                                </div>
                                {column.customLabel && (
                                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                                    پیش‌فرض: {column.label}
                                  </span>
                                )}
                                {column.type && column.type !== "text" && (
                                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                                    {columnTypeLabels[column.type]}
                                  </span>
                                )}
                              </div>
                            </button>
                          )}
                        </div>

                        {/* Delete Custom Column */}
                        {column.isCustom && (
                          <>
                            <button
                              onClick={() => startEditingCustomColumn(column.key)}
                              className="p-1.5 rounded transition-colors"
                              style={{ color: colors.primary }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${colors.primary}22`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              title="ویرایش ستون"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCustomColumn(column.key)}
                              className="p-1.5 rounded transition-colors"
                              style={{ color: colors.error }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${colors.error}22`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              title="حذف ستون"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}