"use client"

import { useState, useRef, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { PersianCalendar } from "./PersianCalendar";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

// تبدیل تاریخ میلادی به شمسی
function gregorianToJalali(gYear: number, gMonth: number, gDay: number) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gYear <= 1600 ? 0 : 979;
  gYear -= gYear <= 1600 ? 621 : 1600;
  let gy2 = gMonth > 2 ? gYear + 1 : gYear;
  let days =
    365 * gYear +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gDay +
    g_d_m[gMonth - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { year: jy, month: jm, day: jd };
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const colors = useCurrentColors();
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(
    value || { from: null, to: null }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const jalali = gregorianToJalali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    
    const year = jalali.year;
    const month = String(jalali.month).padStart(2, "0");
    const day = String(jalali.day).padStart(2, "0");
    
    const dateStr = `${year}/${month}/${day}`;
    
    return dateStr
      .split("")
      .map((char) => {
        const digit = parseInt(char);
        return !isNaN(digit) ? persianDigits[digit] : char;
      })
      .join("");
  };

  const getDisplayText = () => {
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    } else if (range.from) {
      return `از ${formatDate(range.from)}`;
    } else {
      return "انتخاب بازه زمانی";
    }
  };

  const handleConfirm = (newRange: DateRange) => {
    setRange(newRange);
    onChange?.(newRange);
    setIsOpen(false);
  };

  const handleClear = () => {
    const emptyRange = { from: null, to: null };
    setRange(emptyRange);
    onChange?.(emptyRange);
  };

  return (
    <div className="relative" ref={containerRef} dir="rtl">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors justify-between min-w-[200px]"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          color: colors.textPrimary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
          e.currentTarget.style.borderColor = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.cardBackground;
          e.currentTarget.style.borderColor = colors.border;
        }}
      >
        <div className="flex items-center gap-2">
          <Calendar
            className="w-4 h-4 flex-shrink-0"
            style={{ color: colors.primary }}
          />
          <span className="text-sm whitespace-nowrap">{getDisplayText()}</span>
        </div>
        {range.from && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1 rounded hover:bg-opacity-10 transition-colors flex-shrink-0 mr-2"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.error;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <PersianCalendar
            value={range}
            onConfirm={handleConfirm}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}