"use client"

import { Users, UserPlus, TrendingUp, Award } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { useCustomers } from "../../contexts/CustomersContext";
import { useMemo } from "react";

export function CustomersStatsWidget() {
  const colors = useCurrentColors();
  const { customers } = useCustomers();

  const stats = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter(c => (c as any).category === "VIP").length;
    const regular = customers.filter(c => (c as any).category === "عادی").length;
    const wholesale = customers.filter(c => (c as any).category === "عمده‌فروش").length;

    return { total, vip, regular, wholesale };
  }, [customers]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          آمار مشتریان
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Users className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* کل مشتریان */}
        <div
          className="p-3 rounded-lg border"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                کل مشتریان
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {stats.total}
              </p>
            </div>
            <UserPlus className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
        </div>

        {/* دسته‌بندی مشتریان */}
        <div className="space-y-2">
          <div
            className="p-2.5 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: colors.warning + "15" }}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: colors.warning }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                VIP
              </span>
            </div>
            <span className="font-bold" style={{ color: colors.warning }}>
              {stats.vip}
            </span>
          </div>

          <div
            className="p-2.5 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: colors.primary + "15" }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: colors.primary }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                عمده‌فروش
              </span>
            </div>
            <span className="font-bold" style={{ color: colors.primary }}>
              {stats.wholesale}
            </span>
          </div>

          <div
            className="p-2.5 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: colors.success + "15" }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: colors.success }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                عادی
              </span>
            </div>
            <span className="font-bold" style={{ color: colors.success }}>
              {stats.regular}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
