"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { Database, HardDrive, Activity, Zap } from "lucide-react";

// فقط یک پایگاه داده داریم که شامل جداول مختلف است
const database = {
  name: "پایگاه داده بینش",
  size: 9.5,
  records: 301600,
  status: "active",
  tables: [
    { name: "مشتریان", size: 2.4, records: 45680 },
    { name: "فروش", size: 1.8, records: 125340 },
    { name: "موجودی", size: 1.2, records: 8950 },
    { name: "مالی", size: 0.9, records: 32180 },
    { name: "تماس‌ها", size: 3.2, records: 89450 },
  ]
};

export function DatabaseOverviewWidget() {
  const colors = useCurrentColors();

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            پایگاه داده
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            وضعیت دیتابیس سیستم
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "22" }}
        >
          <Database className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      {/* Database Info Card */}
      <div
        className="rounded-lg p-4 mb-6"
        style={{ backgroundColor: colors.primary + "11", border: `1px solid ${colors.primary}33` }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: colors.primary }}>
            {database.name}
          </span>
          <span
            className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: colors.success + "22",
              color: colors.success,
            }}
          >
            فعال
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <HardDrive className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                حجم کل
              </span>
            </div>
            <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {database.size.toLocaleString("fa-IR")} GB
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                کل رکوردها
              </span>
            </div>
            <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {(database.records / 1000).toLocaleString("fa-IR")}K
            </p>
          </div>
        </div>
      </div>

      {/* Tables List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold mb-3" style={{ color: colors.textSecondary }}>
          جداول ({database.tables.length.toLocaleString("fa-IR")} جدول)
        </p>
        {database.tables.map((table, index) => {
          const percentage = (table.size / database.size) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {table.name}
                </span>
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  {table.size.toLocaleString("fa-IR")} GB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: colors.backgroundSecondary }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: colors.textSecondary }}>
                  {table.records.toLocaleString("fa-IR")} رکورد
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: colors.success }} />
            <span style={{ color: colors.textSecondary }}>وضعیت سیستم:</span>
          </div>
          <span className="font-semibold" style={{ color: colors.success }}>
            عملکرد عالی
          </span>
        </div>
      </div>
    </div>
  );
}