"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { ColumnConfig, ColumnOption } from "./ColumnCustomizer";

interface CustomColumnCellProps {
  column: ColumnConfig;
  rowId: string | number;
  value: string | string[];
  onChange: (rowId: string | number, columnKey: string, value: string | string[]) => void;
}

export function CustomColumnCell({ column, rowId, value, onChange }: CustomColumnCellProps) {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Handle text input
  if (column.type === "text" || !column.type) {
    return (
      <input
        type="text"
        value={(value as string) || ""}
        onChange={(e) => onChange(rowId, column.key, e.target.value)}
        className="w-full px-2 py-1 border border-[#e8e8e8] dark:border-[#2a3142] rounded bg-white dark:bg-[#1a1f2e] text-[#1c1c1c] dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0085ff] transition-colors"
        placeholder="وارد کنید..."
      />
    );
  }

  // Handle tags (multi-value text input)
  if (column.type === "tags") {
    const tags = Array.isArray(value) ? value : value ? [value] : [];

    const addTag = (tagValue?: string) => {
      const valueToAdd = tagValue || inputValue.trim();
      if (!valueToAdd) return;
      const newTags = [...tags, valueToAdd];
      onChange(rowId, column.key, newTags);
      setInputValue("");
      setIsEditing(false);
    };

    const removeTag = (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      onChange(rowId, column.key, newTags);
    };

    // Get available options that are not already selected
    const availableOptions = column.options?.filter((opt) => !tags.includes(opt.value)) || [];
    const hasOptions = column.options && column.options.length > 0;

    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => {
          const option = column.options?.find((opt) => opt.value === tag);
          return (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: option?.color ? `${option.color}20` : "#0085ff20",
                color: option?.color || "#0085ff",
              }}
            >
              <span>{option?.label || tag}</span>
              <button
                onClick={() => removeTag(index)}
                className="hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        
        {/* Show dropdown if options exist, otherwise show text input */}
        {hasOptions ? (
          availableOptions.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addTag(e.target.value);
                }
              }}
              className="w-6 h-6 flex items-center justify-center border border-dashed border-[#969696] dark:border-[#585757] rounded text-xs text-[#969696] dark:text-[#585757] hover:border-[#0085ff] hover:text-[#0085ff] transition-colors bg-transparent cursor-pointer focus:outline-none appearance-none text-center"
            >
              <option value="">+</option>
              {availableOptions.map((option, idx) => (
                <option key={`${option.value}-${idx}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
        ) : (
          <>
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTag();
                  } else if (e.key === "Escape") {
                    setIsEditing(false);
                    setInputValue("");
                  }
                }}
                onBlur={() => {
                  if (inputValue.trim()) {
                    addTag();
                  } else {
                    setIsEditing(false);
                  }
                }}
                className="px-2 py-0.5 border border-[#0085ff] rounded text-xs bg-white dark:bg-[#1a1f2e] text-[#1c1c1c] dark:text-white focus:outline-none min-w-[60px]"
                placeholder="اضافه کنید..."
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-0.5 border border-dashed border-[#969696] dark:border-[#585757] rounded text-xs text-[#969696] dark:text-[#585757] hover:border-[#0085ff] hover:text-[#0085ff] transition-colors"
              >
                +
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // Handle single select
  if (column.type === "select-single") {
    return (
      <select
        value={(value as string) || ""}
        onChange={(e) => onChange(rowId, column.key, e.target.value)}
        className="w-full px-2 py-1 border border-[#e8e8e8] dark:border-[#2a3142] rounded bg-white dark:bg-[#1a1f2e] text-[#1c1c1c] dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0085ff] transition-colors cursor-pointer"
      >
        <option value="">انتخاب کنید...</option>
        {column.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  // Handle multiple select
  if (column.type === "select-multiple") {
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

    const toggleOption = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(rowId, column.key, newValues);
    };

    return (
      <div className="flex flex-wrap gap-1">
        {selectedValues.map((val) => {
          const option = column.options?.find((opt) => opt.value === val);
          return (
            <div
              key={val}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: option?.color ? `${option.color}20` : "#0085ff20",
                color: option?.color || "#0085ff",
              }}
            >
              <span>{option?.label || val}</span>
              <button
                onClick={() => toggleOption(val)}
                className="hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              toggleOption(e.target.value);
            }
          }}
          className="px-2 py-0.5 border border-[#e8e8e8] dark:border-[#2a3142] rounded text-xs bg-white dark:bg-[#1a1f2e] text-[#1c1c1c] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0085ff] transition-colors cursor-pointer"
        >
          <option value="">افزودن...</option>
          {column.options
            ?.filter((opt) => !selectedValues.includes(opt.value))
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>
    );
  }

  return <span className="text-sm text-[#585757] dark:text-[#8b92a8]">-</span>;
}