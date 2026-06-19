"use client"

import { Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { useExhibitionVisits } from "../../contexts/ExhibitionVisitsContext";
import { useMemo } from "react";

export function ExhibitionVisitsWidget() {
  const colors = useCurrentColors();
  const { visits } = useExhibitionVisits();

  const stats = useMemo(() => {
    const total = visits.length;
    const pending = visits.filter(v => v.followUpStatus === "pending").length;
    const contacted = visits.filter(v => v.followUpStatus === "contacted").length;
    const converted = visits.filter(v => v.followUpStatus === "converted").length;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0";

    return { total, pending, contacted, converted, conversionRate };
  }, [visits]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
          بازدید نمایشگاه
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "15" }}
        >
          <Users className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* کل بازدیدها */}
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
                کل بازدیدها
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {stats.total}
              </p>
            </div>
            <TrendingUp className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
        </div>

        {/* نرخ تبدیل */}
        <div
          className="p-3 rounded-lg border"
          style={{
            backgroundColor: colors.success + "15",
            borderColor: colors.success + "30",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                نرخ تبدیل به مشتری
              </p>
              <p className="text-xl font-bold" style={{ color: colors.success }}>
                {stats.conversionRate}%
              </p>
            </div>
            <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
          </div>
        </div>

        {/* وضعیت پیگیری */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className="p-2 rounded-lg text-center"
            style={{ backgroundColor: colors.warning + "15" }}
          >
            <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: colors.warning }} />
            <p className="text-xs mb-0.5" style={{ color: colors.textSecondary }}>
              در انتظار
            </p>
            <p className="text-sm font-bold" style={{ color: colors.warning }}>
              {stats.pending}
            </p>
          </div>
          <div
            className="p-2 rounded-lg text-center"
            style={{ backgroundColor: colors.primary + "15" }}
          >
            <TrendingUp className="w-4 h-4 mx-auto mb-1" style={{ color: colors.primary }} />
            <p className="text-xs mb-0.5" style={{ color: colors.textSecondary }}>
              تماس گرفته
            </p>
            <p className="text-sm font-bold" style={{ color: colors.primary }}>
              {stats.contacted}
            </p>
          </div>
          <div
            className="p-2 rounded-lg text-center"
            style={{ backgroundColor: colors.success + "15" }}
          >
            <CheckCircle className="w-4 h-4 mx-auto mb-1" style={{ color: colors.success }} />
            <p className="text-xs mb-0.5" style={{ color: colors.textSecondary }}>
              تبدیل شده
            </p>
            <p className="text-sm font-bold" style={{ color: colors.success }}>
              {stats.converted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
