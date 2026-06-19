"use client"

import { Database, HardDrive, Activity, Zap, TrendingUp, Download, Plus, RefreshCw } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { DatabaseOverviewWidget } from "../components/DatabaseOverviewWidget";
import { DataActivityChart } from "../components/DataActivityChart";
import { DataQualityChart } from "../components/DataQualityChart";
import { AutoRefreshControl } from "../components/AutoRefreshControl";
import { useState } from "react";

export function DataManagementPage() {
  const colors = useCurrentColors();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
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
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            مدیریت داده‌ها
          </h1>
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

      {/* Database Overview & Data Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <DatabaseOverviewWidget />
          <AutoRefreshControl onRefresh={handleSync} />
        </div>
        <div className="lg:col-span-2">
          <DataActivityChart />
        </div>
      </div>

      {/* Data Quality Chart */}
      <DataQualityChart />

      {/* Data Tables List */}
      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            جداول پایگاه داده
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            لیست تمام جداول و اطلاعات آن‌ها
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead
              className="border-b"
              style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}
            >
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  نام جدول
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  تعداد رکورد
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  حجم
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  آخرین بروزرسانی
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  وضعیت
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.border }}>
              {[
                { name: "customers", db: "مشتریان", records: 45680, size: "2.4 GB", updated: "۱۰ دقیقه پیش", status: "active" },
                { name: "sales", db: "فروش", records: 125340, size: "1.8 GB", updated: "۵ دقیقه پیش", status: "active" },
                { name: "inventory", db: "موجودی", records: 8950, size: "1.2 GB", updated: "۱۵ دقیقه پیش", status: "active" },
                { name: "financial", db: "مالی", records: 32180, size: "0.9 GB", updated: "۲۰ دقیقه پیش", status: "active" },
                { name: "calls", db: "تماس‌ها", records: 89450, size: "3.2 GB", updated: "۲ دقیقه پیش", status: "active" },
              ].map((table, index) => (
                <tr key={index} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: index % 2 === 0 ? colors.cardBackground : colors.backgroundSecondary }}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm" style={{ color: colors.primary }}>
                      {table.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: colors.textPrimary }}>
                    {table.records.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: colors.textPrimary }}>
                    {table.size}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>
                    {table.updated}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: colors.success + "22",
                        color: colors.success,
                      }}
                    >
                      فعال
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}