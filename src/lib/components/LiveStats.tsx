"use client"

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

export function LiveStats() {
  const colors = useCurrentColors();
  const [onlineAgents, setOnlineAgents] = useState(12);
  const [activeCalls, setActiveCalls] = useState(8);
  const [queuedCalls, setQueuedCalls] = useState(3);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      setQueuedCalls((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="rounded-lg border p-4 transition-all duration-300 hover:shadow-lg cursor-pointer" 
      dir="rtl"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 animate-pulse" style={{ color: colors.success }} />
        <h3 className="text-base font-semibold" dir="auto" style={{ color: colors.textPrimary }}>
          وضعیت لحظه‌ای
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: colors.success }}>{onlineAgents}</p>
          <p className="text-xs mt-1" dir="auto" style={{ color: colors.textSecondary }}>
            کارشناس آنلاین
          </p>
        </div>
        <div className="text-center border-x" style={{ borderColor: colors.border }}>
          <p className="text-2xl font-bold" style={{ color: colors.primary }}>{activeCalls}</p>
          <p className="text-xs mt-1" dir="auto" style={{ color: colors.textSecondary }}>
            تماس فعال
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#f59e0b]">{queuedCalls}</p>
          <p className="text-xs mt-1" dir="auto" style={{ color: colors.textSecondary }}>
            در صف انتظار
          </p>
        </div>
      </div>
    </div>
  );
}