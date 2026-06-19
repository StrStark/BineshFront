"use client"

import { useState, useEffect } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

export function PersianDateTime() {
  const colors = useCurrentColors();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // تبدیل تاریخ میلادی به شمسی (ساده شده)
  const getPersianDate = () => {
    return currentTime.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long"
    });
  };

  const getPersianTime = () => {
    return currentTime.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="flex flex-col items-start" dir="ltr">
      <span className="text-xs" style={{ color: colors.textSecondary }}>
        {getPersianDate()}
      </span>
      <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
        {getPersianTime()}
      </span>
    </div>
  );
}
