import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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

const GLOBAL_MIN_YEAR = 1350;
const GLOBAL_MAX_YEAR = 1450;

type JalaliDate = { year: number; month: number; day: number } | null;

const toPersianNumber = (num: number) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num)
    .split("")
    .map((digit) => persianDigits[parseInt(digit)] || digit)
    .join("");
};

const getTs = (d: JalaliDate) => {
  if (!d) return 0;
  return moment(`${d.year}/${d.month}/${d.day}`, "jYYYY/jMM/jDD").valueOf();
};

const jalaliToGregorian = (year: number, month: number, day: number): Date => {
  return moment(`${year}/${month}/${day}`, "jYYYY/jMM/jDD").toDate();
};

const YearMonthModal = ({
  isOpen,
  onClose,
  initialYear,
  initialMonth,
  minYear,
  maxYear,
  onConfirm,
  colors,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialYear: number;
  initialMonth: number;
  minYear: number;
  maxYear: number;
  onConfirm: (y: number, m: number) => void;
  colors: any;
}) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  useEffect(() => {
    setSelectedYear(initialYear);
    setSelectedMonth(initialMonth);
  }, [initialYear, initialMonth]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-96 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-5 text-center text-lg font-bold"
          style={{ backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }}
        >
          {persianMonths[selectedMonth - 1]} {toPersianNumber(selectedYear)}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-8">
            <div className="text-sm font-semibold mb-3" style={{ color: colors.textSecondary }}>
              ماه
            </div>
            <div className="grid grid-cols-3 gap-3">
              {persianMonths.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMonth(i + 1)}
                  className="py-3 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: selectedMonth === i + 1 ? colors.primary : colors.backgroundSecondary,
                    color: selectedMonth === i + 1 ? "#fff" : colors.textPrimary,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3" style={{ color: colors.textSecondary }}>
              سال
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-2xl" style={{ borderColor: colors.border }}>
              {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className="w-full py-3 text-center text-sm font-medium transition-all"
                  style={{
                    backgroundColor: y === selectedYear ? colors.primary : "transparent",
                    color: y === selectedYear ? "#fff" : colors.textPrimary,
                  }}
                >
                  {toPersianNumber(y)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <button
            onClick={() => {
              onConfirm(selectedYear, selectedMonth);
              onClose();
            }}
            className="w-full py-4 rounded-2xl text-white font-bold text-base"
            style={{ backgroundColor: colors.primary }}
          >
            انتخاب
          </button>
        </div>
      </div>
    </div>
  );
};

const ShortcutPanel = ({ setGlobalRange, colors }: { setGlobalRange: any; colors: any }) => {
  const today = moment();
  const jy = today.jYear();
  const jm = today.jMonth() + 1;
  const jd = today.jDate();

  const shortcuts = [
    {
      label: "امروز",
      getRange: () => ({
        start: { year: jy, month: jm, day: jd },
        end: { year: jy, month: jm, day: jd },
      }),
    },
    {
      label: "این هفته",
      getRange: () => {
        const dayOfWeek = today.day();
        const daysToSubtract = (dayOfWeek + 1) % 7;
        const weekStart = today.clone().subtract(daysToSubtract, "days");
        return {
          start: { year: weekStart.jYear(), month: weekStart.jMonth() + 1, day: weekStart.jDate() },
          end: { year: jy, month: jm, day: jd },
        };
      },
    },
    {
      label: "هفته قبل",
      getRange: () => {
        const dayOfWeek = today.day();
        const daysToSubtract = (dayOfWeek + 1) % 7;
        const lastStart = today.clone().subtract(daysToSubtract + 7, "days");
        const lastEnd = today.clone().subtract(daysToSubtract + 1, "days");
        return {
          start: { year: lastStart.jYear(), month: lastStart.jMonth() + 1, day: lastStart.jDate() },
          end: { year: lastEnd.jYear(), month: lastEnd.jMonth() + 1, day: lastEnd.jDate() },
        };
      },
    },
    {
      label: "این ماه",
      getRange: () => ({
        start: { year: jy, month: jm, day: 1 },
        end: { year: jy, month: jm, day: jd },
      }),
    },
    {
      label: "ماه قبل",
      getRange: () => {
        const pm = jm === 1 ? 12 : jm - 1;
        const py = jm === 1 ? jy - 1 : jy;
        const daysInPrev = moment.jDaysInMonth(py, pm - 1);
        return {
          start: { year: py, month: pm, day: 1 },
          end: { year: py, month: pm, day: daysInPrev },
        };
      },
    },
    {
      label: "امسال",
      getRange: () => ({
        start: { year: jy, month: 1, day: 1 },
        end: { year: jy, month: jm, day: jd },
      }),
    },
    {
      label: "همه زمان‌ها",
      getRange: () => ({
        start: { year: GLOBAL_MIN_YEAR, month: 1, day: 1 },
        end: { year: GLOBAL_MAX_YEAR, month: 12, day: moment.jDaysInMonth(GLOBAL_MAX_YEAR, 11) },
      }),
    },
  ];

  return (
    <div
      className="w-36 flex flex-col py-3 pr-3 border-r"
      style={{ borderColor: colors.border, backgroundColor: "transparent" }}
    >
      {shortcuts.map((s, i) => {
        const range = s.getRange();
        return (
          <button
            key={i}
            onClick={() => range && setGlobalRange(range.start, range.end)}
            className="py-2.5 pr-3 text-right text-sm font-medium rounded-xl transition-all hover:bg-[#ccc]/50 dark:hover:bg-gray-700/50"
            style={{ color: colors.textPrimary }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
};

export function PersianCalendar({ value, onConfirm, onCancel }: PersianCalendarProps) {
  const colors = useCurrentColors();

  const today = moment();
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [tempStart, setTempStart] = useState<JalaliDate>(null);
  const [tempEnd, setTempEnd] = useState<JalaliDate>(null);

  const [startYear, setStartYear] = useState(today.jYear());
  const [startMonth, setStartMonth] = useState(today.jMonth() + 1);
  const [endYear, setEndYear] = useState(today.jMonth() + 2 > 12 ? today.jYear() + 1 : today.jYear());
  const [endMonth, setEndMonth] = useState(today.jMonth() + 2 > 12 ? 1 : today.jMonth() + 2);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFor, setModalFor] = useState<"start" | "end" | null>(null);

  // Initialize from value if provided
  useEffect(() => {
    if (value?.from) {
      const fromM = moment(value.from);
      const toM = value.to ? moment(value.to) : fromM;
      const startJ: JalaliDate = {
        year: fromM.jYear(),
        month: fromM.jMonth() + 1,
        day: fromM.jDate(),
      };
      const endJ: JalaliDate = {
        year: toM.jYear(),
        month: toM.jMonth() + 1,
        day: toM.jDate(),
      };
      setTempStart(startJ);
      setTempEnd(endJ);

      // Show the end month in the first calendar
      setStartYear(endJ.year);
      setStartMonth(endJ.month);
      let ny = endJ.year;
      let nm = endJ.month + 1;
      if (nm > 12) {
        nm = 1;
        ny++;
      }
      ny = Math.min(GLOBAL_MAX_YEAR, ny);
      setEndYear(ny);
      setEndMonth(nm);
    } else {
      setTempStart(null);
      setTempEnd(null);
    }
  }, [value]);

  const setGlobalRange = (clicked: JalaliDate, fallbackEnd: JalaliDate = null) => {
    if (fallbackEnd !== null) {
      setTempStart(clicked);
      setTempEnd(fallbackEnd);

      const lastDate = fallbackEnd;
      setStartYear(lastDate.year);
      setStartMonth(lastDate.month);
      let nm = lastDate.month + 1;
      let ny = lastDate.year;
      if (nm > 12) {
        nm = 1;
        ny++;
      }
      ny = Math.min(GLOBAL_MAX_YEAR, ny);
      setEndYear(ny);
      setEndMonth(nm);
      return;
    }

    if (!tempStart && !tempEnd) {
      setTempStart(clicked);
      setTempEnd(clicked);
      return;
    }

    const clickedTs = getTs(clicked);
    const startTs = getTs(tempStart);
    const endTs = getTs(tempEnd);
    const minTs = Math.min(startTs, endTs);
    const maxTs = Math.max(startTs, endTs);

    if (clickedTs < minTs) {
      setTempStart(clicked);
      return;
    }
    if (clickedTs > maxTs) {
      setTempEnd(clicked);
      return;
    }

    const leftNumber = tempStart!.day;
    const rightNumber = tempEnd!.day + 31;
    const isEndCal = clicked.year === endYear && clicked.month === endMonth;
    const clickedNumber = clicked.day + (isEndCal ? 31 : 0);

    const distToLeft = Math.abs(clickedNumber - leftNumber);
    const distToRight = Math.abs(clickedNumber - rightNumber);

    if (distToLeft <= distToRight) {
      setTempStart(clicked);
    } else {
      setTempEnd(clicked);
    }
  };

  const handleDayClick = (year: number, month: number, day: number, isEndCalendar: boolean) => {
    const dateG = jalaliToGregorian(year, month, day);
    if (dateG > todayEnd) return;

    const clicked = { year, month, day };
    setGlobalRange(clicked);
  };

  const isInRange = (year: number, month: number, day: number) => {
    const currentTs = getTs({ year, month, day });
    if (!tempStart || !tempEnd) return false;
    const minTs = Math.min(getTs(tempStart), getTs(tempEnd));
    const maxTs = Math.max(getTs(tempStart), getTs(tempEnd));
    return currentTs >= minTs && currentTs <= maxTs;
  };

  const isSelected = (year: number, month: number, day: number) => {
    const currentTs = getTs({ year, month, day });
    return currentTs === getTs(tempStart) || currentTs === getTs(tempEnd);
  };

  const getDaysInMonth = (year: number, month: number) => moment.jDaysInMonth(year, month - 1);

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = moment(`${year}/${month}/01`, "jYYYY/jM/jD");
    const dayOfWeek = firstDay.day();
    return dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  };

  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const changeMonth = (calendar: "start" | "end", delta: number) => {
    if (calendar === "start") {
      let newMonth = startMonth + delta;
      let newYear = startYear;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      } else if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
      if (newYear < GLOBAL_MIN_YEAR || newYear > endYear) return;
      setStartYear(newYear);
      setStartMonth(newMonth);
    } else {
      let newMonth = endMonth + delta;
      let newYear = endYear;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      } else if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
      if (newYear > GLOBAL_MAX_YEAR || newYear < startYear) return;
      setEndYear(newYear);
      setEndMonth(newMonth);
    }
  };

  const renderCalendar = (year: number, month: number, isEndCalendar: boolean) => {
    const days = generateCalendarDays(year, month);
    const isTodayInMonth = today.jYear() === year && today.jMonth() + 1 === month;
    const todayDay = today.jDate();

    return (
      <div className="flex-1">
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => changeMonth(isEndCalendar ? "end" : "start", -1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>

          <button
            onClick={() => {
              setModalFor(isEndCalendar ? "end" : "start");
              setModalOpen(true);
            }}
            className="px-4 py-1 rounded-lg text-xs font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }}
          >
            {persianMonths[month - 1]} {toPersianNumber(year)}
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => changeMonth(isEndCalendar ? "end" : "start", 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs py-1" style={{ color: colors.textSecondary }}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} className="aspect-square" />;

            const dateG = jalaliToGregorian(year, month, day);
            const isFuture = dateG > todayEnd;
            const inRange = isInRange(year, month, day);
            const selected = isSelected(year, month, day);
            const isTodayHere = isTodayInMonth && day === todayDay;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(year, month, day, isEndCalendar)}
                disabled={isFuture}
                className={`aspect-square rounded-md text-xs transition-all flex items-center justify-center relative ${
                  isFuture ? "cursor-not-allowed opacity-30" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                style={{
                  color: selected ? "#ffffff" : inRange ? colors.textPrimary : colors.textPrimary,
                  backgroundColor: selected
                    ? colors.primary
                    : inRange
                    ? colors.backgroundSecondary
                    : "transparent",
                  border: isTodayHere && !selected ? `2px solid ${colors.textSecondary}` : "none",
                  fontWeight: isTodayHere || selected ? 600 : 400,
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

  const handleYearMonthConfirm = (y: number, m: number) => {
    if (modalFor === "start") {
      setStartYear(y);
      setStartMonth(m);
      if (endYear < y || (endYear === y && endMonth <= m)) {
        let nm = m + 1;
        let ny = y;
        if (nm > 12) {
          nm = 1;
          ny++;
        }
        ny = Math.min(GLOBAL_MAX_YEAR, ny);
        setEndMonth(nm);
        setEndYear(ny);
      }
    } else {
      setEndYear(y);
      setEndMonth(m);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        dir="rtl"
        onClick={onCancel}
      >
        <div
          className="rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex p-6 gap-8">
            {renderCalendar(startYear, startMonth, false)}
            {renderCalendar(endYear, endMonth, true)}
            <ShortcutPanel setGlobalRange={setGlobalRange} colors={colors} />
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-end gap-3" style={{ borderColor: colors.border }}>
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              style={{ color: colors.textSecondary }}
            >
              لغو
            </button>
            <button
              onClick={() => {
                onConfirm({
                  from: tempStart ? jalaliToGregorian(tempStart.year, tempStart.month, tempStart.day) : null,
                  to: tempEnd ? jalaliToGregorian(tempEnd.year, tempEnd.month, tempEnd.day) : null,
                });
              }}
              className="px-6 py-2 rounded-lg text-white transition-all hover:opacity-90 text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              تایید
            </button>
          </div>
        </div>
      </div>

      <YearMonthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialYear={modalFor === "start" ? startYear : endYear}
        initialMonth={modalFor === "start" ? startMonth : endMonth}
        minYear={modalFor === "start" ? GLOBAL_MIN_YEAR : startYear}
        maxYear={modalFor === "start" ? endYear : GLOBAL_MAX_YEAR}
        onConfirm={handleYearMonthConfirm}
        colors={colors}
      />
    </>
  );
}