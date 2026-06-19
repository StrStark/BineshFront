"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { Users, UserCheck, Clock } from "lucide-react";

const debtors = [
  { name: "شرکت تجارت نوین", amount: 45000000, days: 15, status: "normal" },
  { name: "صنایع فولاد پارس", amount: 38000000, days: 22, status: "normal" },
  { name: "گروه صنعتی سپهر", amount: 52000000, days: 45, status: "warning" },
  { name: "شرکت ساختمانی آسمان", amount: 28000000, days: 8, status: "normal" },
  { name: "کارخانه نساجی رضوان", amount: 65000000, days: 62, status: "critical" },
];

const creditors = [
  { name: "تامین‌کننده مواد اولیه", amount: 32000000, days: 10 },
  { name: "شرکت حمل و نقل", amount: 18000000, days: 5 },
  { name: "بیمه کارکنان", amount: 25000000, days: 20 },
];

export function AccountsWidget() {
  const colors = useCurrentColors();

  const totalDebtors = debtors.reduce((sum, d) => sum + d.amount, 0);
  const totalCreditors = creditors.reduce((sum, c) => sum + c.amount, 0);

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
            بدهکاران و بستانکاران
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            وضعیت حساب‌های دریافتنی و پرداختنی
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + "22" }}
        >
          <Users className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.success + "11", border: `1px solid ${colors.success}33` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4" style={{ color: colors.success }} />
            <span className="text-xs font-semibold" style={{ color: colors.success }}>
              بدهکاران
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {(totalDebtors / 1000000).toLocaleString("fa-IR")}
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
            میلیون تومان
          </p>
        </div>

        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.error + "11", border: `1px solid ${colors.error}33` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: colors.error }} />
            <span className="text-xs font-semibold" style={{ color: colors.error }}>
              بستانکاران
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {(totalCreditors / 1000000).toLocaleString("fa-IR")}
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
            میلیون تومان
          </p>
        </div>
      </div>

      {/* Top Debtors */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
          بزرگترین بدهکاران
        </h3>
        <div className="space-y-3">
          {debtors.slice(0, 3).map((debtor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                  {debtor.name}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {debtor.days.toLocaleString("fa-IR")} روز
                </p>
              </div>
              <div className="text-left mr-2">
                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                  {(debtor.amount / 1000000).toLocaleString("fa-IR")}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  میلیون تومان
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Creditors */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
          بزرگترین بستانکاران
        </h3>
        <div className="space-y-3">
          {creditors.map((creditor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                  {creditor.name}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {creditor.days.toLocaleString("fa-IR")} روز
                </p>
              </div>
              <div className="text-left mr-2">
                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                  {(creditor.amount / 1000000).toLocaleString("fa-IR")}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  میلیون تومان
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
