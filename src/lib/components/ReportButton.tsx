"use client"

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileText, FileSpreadsheet, FilePieChart } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface ReportOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  format: string;
}

const reportOptions: ReportOption[] = [
  { id: "excel", label: "دانلود Excel", icon: FileSpreadsheet, format: ".xlsx" },
  { id: "pdf", label: "دانلود PDF", icon: FileText, format: ".pdf" },
  { id: "csv", label: "دانلود CSV", icon: FilePieChart, format: ".csv" },
];

interface ReportButtonProps {
  onDownload?: (format: string) => void;
}

export function ReportButton({ onDownload }: ReportButtonProps) {
  const colors = useCurrentColors();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (option: ReportOption) => {
    setIsOpen(false);
    if (onDownload) {
      onDownload(option.format);
    }
    console.log(`Downloading report as ${option.format}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
        style={{
          backgroundColor: colors.primary,
          color: "#ffffff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
        }}
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">گزارش‌گیری</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 rounded-lg shadow-xl border overflow-hidden z-50 min-w-[180px] animate-fadeIn"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {reportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="w-full px-4 py-3 text-right flex items-center gap-3 transition-colors"
                style={{
                  color: colors.textPrimary,
                  borderTopWidth: index > 0 ? "1px" : "0",
                  borderColor: colors.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ color: colors.primary }}><Icon className="w-4 h-4" /></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    فرمت {option.format}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
