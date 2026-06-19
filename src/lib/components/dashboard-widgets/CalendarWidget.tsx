"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function CalendarWidget() {
  const colors = useCurrentColors();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Persian month names
  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  // Persian day names
  const persianDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  // Convert Gregorian to Jalali
  const gregorianToJalali = (gDate: Date) => {
    const g_y = gDate.getFullYear();
    const g_m = gDate.getMonth() + 1;
    const g_d = gDate.getDate();
    
    let gy = g_y - 1600;
    let gm = g_m - 1;
    let gd = g_d - 1;

    let g_day_no = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);

    for (let i = 0; i < gm; ++i)
      g_day_no += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)))
      g_day_no++;
    g_day_no += gd;

    let j_day_no = g_day_no - 79;

    let j_np = Math.floor(j_day_no / 12053);
    j_day_no %= 12053;

    let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);

    j_day_no %= 1461;

    if (j_day_no >= 366) {
      jy += Math.floor((j_day_no - 1) / 365);
      j_day_no = (j_day_no - 1) % 365;
    }

    let jm, jd;
    if (j_day_no < 186) {
      jm = 1 + Math.floor(j_day_no / 31);
      jd = 1 + (j_day_no % 31);
    } else {
      jm = 7 + Math.floor((j_day_no - 186) / 30);
      jd = 1 + ((j_day_no - 186) % 30);
    }
    
    return { year: jy, month: jm, day: jd };
  };

  // Get days in Jalali month
  const getDaysInJalaliMonth = (year: number, month: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // Check for leap year
    const isLeap = ((year % 33) * 8 + 13) % 33 < 8;
    return isLeap ? 30 : 29;
  };

  // Get first day of month (0 = Saturday in Persian calendar)
  const getFirstDayOfMonth = (year: number, month: number) => {
    // Convert first day of Jalali month to Gregorian
    const gDate = jalaliToGregorian(year, month, 1);
    const dayOfWeek = gDate.getDay(); // 0 = Sunday
    // Convert to Persian week (0 = Saturday)
    return (dayOfWeek + 1) % 7;
  };

  // Convert Jalali to Gregorian
  const jalaliToGregorian = (jy: number, jm: number, jd: number) => {
    let gy, gm, gd;
    jy += 1595;
    let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + 78 + jd;
    if (jm < 7) days += (jm - 1) * 31;
    else days += (jm - 7) * 30 + 186;
    gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    let flag = true;
    if (days >= 36525) {
      days--;
      gy += 100 * Math.floor(days / 36524);
      days %= 36524;
      if (days >= 365) days++;
      else flag = false;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (flag) {
      if (days >= 366) {
        days--;
        gy += Math.floor(days / 365);
        days = days % 365;
      }
    }
    gd = days + 1;
    const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return new Date(gy, gm - 1, gd);
  };

  const jalaliDate = gregorianToJalali(currentDate);
  const daysInMonth = getDaysInJalaliMonth(jalaliDate.year, jalaliDate.month);
  const firstDayOfMonth = getFirstDayOfMonth(jalaliDate.year, jalaliDate.month);

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Navigate months
  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const today = gregorianToJalali(new Date());
  const isToday = (day: number) => {
    return day === today.day && 
           jalaliDate.month === today.month && 
           jalaliDate.year === today.year;
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: colors.textSecondary }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="font-bold" style={{ color: colors.textPrimary }}>
            {persianMonths[jalaliDate.month - 1]} {jalaliDate.year}
          </h3>
        </div>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: colors.textSecondary }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1">
        {persianDays.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium py-2"
            style={{ color: colors.textSecondary }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center text-sm rounded-lg
              ${day ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
              ${isToday(day || 0) ? 'font-bold' : ''}
            `}
            style={{
              color: day ? colors.textPrimary : 'transparent',
              backgroundColor: isToday(day || 0) ? colors.primary : 'transparent',
              ...(isToday(day || 0) && { color: 'white' })
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Today Info */}
      <div 
        className="text-center text-xs p-2 rounded-lg"
        style={{ 
          backgroundColor: colors.backgroundSecondary,
          color: colors.textSecondary 
        }}
      >
        امروز: {persianDays[new Date().getDay()]} {today.day} {persianMonths[today.month - 1]} {today.year}
      </div>
    </div>
  );
}