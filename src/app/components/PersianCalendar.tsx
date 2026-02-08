import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import moment from "moment-jalaali";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface PersianCalendarProps {
  value?: DateRange;
  onConfirm: (range: DateRange) => void;
  onCancel: () => void;
}

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export function PersianCalendar({ value, onConfirm, onCancel }: PersianCalendarProps) {
  const colors = useCurrentColors();
  const [tempRange, setTempRange] = useState<DateRange>(
    value || { from: null, to: null }
  );

  const today = moment();
  const todayJalali = moment(today);

  // ماه اول (سمت راست)
  const [rightMonth, setRightMonth] = useState({
    year: todayJalali.jYear(),
    month: todayJalali.jMonth() + 1,
  });

  // ماه دوم (سمت چپ) - ماه بعدی
  const leftMonth = {
    year: rightMonth.month === 12 ? rightMonth.year + 1 : rightMonth.year,
    month: rightMonth.month === 12 ? 1 : rightMonth.month + 1,
  };

  const toPersianNumber = (num: number) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(num)
      .split("")
      .map((digit) => persianDigits[parseInt(digit)] || digit)
      .join("");
  };

  const getDaysInMonth = (year: number, month: number) => {
    return moment.jDaysInMonth(year, month - 1);
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = moment(`${year}/${month}/01`, "jYYYY/jM/jD");
    const dayOfWeek = firstDay.day();
    return dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  };

  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const jalaliToGregorian = (year: number, month: number, day: number): Date => {
    const m = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD");
    return m.toDate();
  };

  const handleDayClick = (year: number, month: number, day: number) => {
    const date = jalaliToGregorian(year, month, day);
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      return;
    }

    if (!tempRange.from || (tempRange.from && tempRange.to)) {
      setTempRange({ from: date, to: null });
    } else {
      if (date < tempRange.from) {
        setTempRange({ from: date, to: tempRange.from });
      } else {
        setTempRange({ from: tempRange.from, to: date });
      }
    }
  };

  const isDateInRange = (year: number, month: number, day: number) => {
    if (!tempRange.from) return false;
    const date = jalaliToGregorian(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(tempRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    if (tempRange.to) {
      const toDate = new Date(tempRange.to);
      toDate.setHours(0, 0, 0, 0);
      return date >= fromDate && date <= toDate;
    } else {
      return date.getTime() === fromDate.getTime();
    }
  };

  const isDateSelected = (year: number, month: number, day: number) => {
    if (!tempRange.from) return false;
    const date = jalaliToGregorian(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(tempRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    if (tempRange.to) {
      const toDate = new Date(tempRange.to);
      toDate.setHours(0, 0, 0, 0);
      return (
        date.getTime() === fromDate.getTime() ||
        date.getTime() === toDate.getTime()
      );
    } else {
      return date.getTime() === fromDate.getTime();
    }
  };

  const goToNextMonth = () => {
    if (rightMonth.month === 12) {
      setRightMonth({ year: rightMonth.year + 1, month: 1 });
    } else {
      setRightMonth({ ...rightMonth, month: rightMonth.month + 1 });
    }
  };

  const goToPrevMonth = () => {
    if (rightMonth.month === 1) {
      setRightMonth({ year: rightMonth.year - 1, month: 12 });
    } else {
      setRightMonth({ ...rightMonth, month: rightMonth.month - 1 });
    }
  };

  const renderCalendar = (year: number, month: number) => {
    const days = generateCalendarDays(year, month);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const todayJalali = moment(today);
    const isTodayInThisMonth = todayJalali.jYear() === year && (todayJalali.jMonth() + 1) === month;
    const todayDay = todayJalali.jDate();

    return (
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
                        <ChevronRight className="w-4 h-4" style={{ color: colors.textSecondary }} />

          </button>
          <div className="px-4 py-1 rounded-lg text-xs font-medium" style={{ 
            backgroundColor: colors.backgroundSecondary,
            color: colors.textPrimary 
          }}>
            {persianMonths[month - 1]} {toPersianNumber(year)}
          </div>
          <button
            onClick={goToPrevMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
             <ChevronLeft className="w-4 h-4" style={{ color: colors.textSecondary }} />

          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs py-1"
              style={{ color: colors.textSecondary }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const date = jalaliToGregorian(year, month, day);
            const isFutureDate = date > today;
            const isInRange = isDateInRange(year, month, day);
            const isSelected = isDateSelected(year, month, day);
            const isToday = isTodayInThisMonth && day === todayDay;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(year, month, day)}
                disabled={isFutureDate}
                className={`aspect-square rounded-md text-xs transition-all flex items-center justify-center relative ${
                  isFutureDate
                    ? "cursor-not-allowed opacity-30"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                style={{
                  color: isFutureDate 
                    ? colors.textSecondary
                    : isSelected
                    ? "#ffffff"
                    : isInRange
                    ? colors.textPrimary
                    : colors.textPrimary,
                  backgroundColor: isSelected 
                    ? colors.primary 
                    : isInRange 
                    ? colors.backgroundSecondary 
                    : 'transparent',
                  border: isToday && !isSelected ? `2px solid ${colors.textSecondary}` : 'none',
                  fontWeight: isToday || isSelected ? 600 : 400,
                }}
              >
                {toPersianNumber(day)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl" onClick={() => onCancel()}>
      <div
        className="rounded-xl shadow-2xl overflow-hidden max-w-3xl w-full"
        style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Calendars */}
        <div className="flex gap-6 p-6">          {renderCalendar(rightMonth.year, rightMonth.month)}
          {renderCalendar(leftMonth.year, leftMonth.month)}

        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 border-t flex items-center gap-3"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={() => onConfirm(tempRange)}
            className="px-6 py-2 rounded-lg text-white transition-all hover:opacity-90 text-sm"
            style={{ backgroundColor: colors.primary }}
          >
            تایید
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            style={{ color: colors.textSecondary }}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}
