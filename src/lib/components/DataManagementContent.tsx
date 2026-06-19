"use client"

import { Database, HardDrive, Activity, Zap, Download, Plus, RefreshCw, Check } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { DataActivityChart } from "./DataActivityChart";
import { DataQualityChart } from "./DataQualityChart";
import { AutoBackupSettings } from "./AutoBackupSettings";
import { DataTablesTable } from "./DataTablesTable";
import { useState } from "react";

export function DataManagementContent() {
  const colors = useCurrentColors();
  const [syncing, setSyncing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const handleSaveChanges = () => {
    // تنظیمات قبلاً در localStorage ذخیره شده‌اند
    // فقط نمایش پیام موفقیت
    setShowSuccess(true);
    setHasChanges(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const stats = [
    { icon: Database, label: "پایگاه داده", value: "۱", unit: "دیتابیس", color: colors.primary },
    { icon: HardDrive, label: "حجم کل داده", value: "۹.۵", unit: "گیگابایت", color: colors.success },
    { icon: Activity, label: "کل رکوردها", value: "۳۰۱,۶۰۰", unit: "رکورد", color: colors.warning },
    { icon: Zap, label: "کیفیت داده", value: "۹۴.۲%", unit: "عالی", color: colors.purple },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            مدیریت داده‌ها
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            نظارت، تحلیل و بهبود کیفیت داده‌های سیستم
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:opacity-90 whitespace-nowrap disabled:opacity-50"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "در حال همگام‌سازی..." : "همگام‌سازی"}</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:opacity-90 whitespace-nowrap"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          >
            <Download className="w-5 h-5" />
            <span>پشتیبان‌گیری</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="w-5 h-5" />
            <span>ایجاد جدول جدید</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                {stat.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Data Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <AutoBackupSettings onHasChanges={setHasChanges} />
        </div>
        <div className="lg:col-span-2">
          <DataActivityChart />
        </div>
      </div>

      {/* Data Quality Chart */}
      <DataQualityChart />

      {/* Data Tables List */}
      <DataTablesTable />

      {/* Success Message */}
      {showSuccess && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
          role="alert"
        >
          <span className="font-medium">موفقیت!</span> تغییرات با موفقیت ذخیره شد.
        </div>
      )}

      {/* Sticky Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white shadow-2xl transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: colors.primary }}
          >
            <Check className="w-5 h-5" />
            <span className="font-semibold">اعمال تغییرات</span>
          </button>
        </div>
      )}
    </div>
  );
}