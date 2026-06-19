"use client"

import { useState, useEffect, useRef } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface AutoRefreshControlProps {
  onRefresh: () => void;
}

const intervals = [
  { label: "۵ ثانیه", value: 5 },
  { label: "۱۰ ثانیه", value: 10 },
  { label: "۳۰ ثانیه", value: 30 },
  { label: "۶۰ ثانیه", value: 60 },
];

export function AutoRefreshControl({ onRefresh }: AutoRefreshControlProps) {
  const colors = useCurrentColors();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(5);
  const [showIntervalMenu, setShowIntervalMenu] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      // Reset countdown
      setCountdown(selectedInterval);
      
      // Set up countdown timer
      countdownRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return selectedInterval;
          }
          return prev - 1;
        });
      }, 1000);

      // Set up refresh interval
      intervalRef.current = window.setInterval(() => {
        onRefresh();
      }, selectedInterval * 1000);
    } else {
      // Clear timers when auto-refresh is disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [autoRefresh, selectedInterval, onRefresh]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowIntervalMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIntervalChange = (value: number) => {
    setSelectedInterval(value);
    setCountdown(value);
    setShowIntervalMenu(false);
  };

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Auto-refresh Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            style={{ color: autoRefresh ? colors.primary : colors.textSecondary }}
          />
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            به‌روزرسانی خودکار
          </span>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{
            backgroundColor: autoRefresh ? colors.primary : colors.border,
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoRefresh ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Interval Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium block" style={{ color: colors.textSecondary }}>
          بازه زمانی
        </label>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowIntervalMenu(!showIntervalMenu)}
            disabled={!autoRefresh}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          >
            <span>{intervals.find((i) => i.value === selectedInterval)?.label}</span>
            <ChevronDown className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>

          {/* Dropdown Menu */}
          {showIntervalMenu && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg overflow-hidden z-50 animate-fadeIn"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              {intervals.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => handleIntervalChange(interval.value)}
                  className="w-full px-3 py-2 text-right text-sm transition-colors hover:opacity-80"
                  style={{
                    backgroundColor:
                      selectedInterval === interval.value
                        ? colors.backgroundSecondary
                        : "transparent",
                    color:
                      selectedInterval === interval.value
                        ? colors.primary
                        : colors.textPrimary,
                  }}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Countdown Display */}
      {autoRefresh && (
        <div
          className="mt-3 pt-3 border-t flex items-center justify-between text-xs"
          style={{ borderColor: colors.border }}
        >
          <span style={{ color: colors.textSecondary }}>به‌روزرسانی بعدی:</span>
          <span className="font-bold" style={{ color: colors.primary }}>
            {countdown} ثانیه
          </span>
        </div>
      )}
    </div>
  );
}
