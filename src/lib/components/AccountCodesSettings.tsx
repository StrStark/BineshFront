"use client"

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface AccountCode {
  id: string;
  name: string;
  category: "income" | "expense" | "asset" | "liability";
  description: string;
  isExpanded: boolean;
}

const categoryLabels = {
  income: "درآمد",
  expense: "هزینه",
  asset: "دارایی",
  liability: "بدهی",
};

const categoryColors = {
  income: { bg: "#ecfdf5", border: "#a4f4cf", text: "#007a55" },
  expense: { bg: "#fff1f2", border: "#ffccd3", text: "#c70036" },
  asset: { bg: "#eff6ff", border: "#bedbff", text: "#1447e6" },
  liability: { bg: "#fffbeb", border: "#fee685", text: "#bb4d00" },
};

export function AccountCodesSettings() {
  const colors = useCurrentColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "income" | "expense" | "asset" | "liability">("all");

  const [accountCodes, setAccountCodes] = useState<AccountCode[]>([
    {
      id: "1",
      name: "فروش",
      category: "income",
      description: "کدهای حساب مرتبط با فروش محصولات",
      isExpanded: false,
    },
    {
      id: "2",
      name: "هزینه‌های عملیاتی",
      category: "expense",
      description: "کدهای حساب مرتبط با هزینه‌های روزمره",
      isExpanded: false,
    },
    {
      id: "3",
      name: "موجودی کالا",
      category: "asset",
      description: "کدهای حساب مرتبط با موجودی انبار",
      isExpanded: false,
    },
    {
      id: "4",
      name: "حساب‌های دریافتنی",
      category: "asset",
      description: "کدهای حساب مشتریان و طلب‌ها",
      isExpanded: false,
    },
    {
      id: "5",
      name: "حساب‌های پرداختنی",
      category: "liability",
      description: "کدهای حساب تامین‌کنندگان و بدهی‌ها",
      isExpanded: false,
    },
    {
      id: "6",
      name: "هزینه استهلاک",
      category: "expense",
      description: "کدهای حساب مرتبط با استهلاک دارایی‌ها",
      isExpanded: false,
    },
    {
      id: "7",
      name: "درآمد سایر",
      category: "income",
      description: "سایر درآمدهای غیر عملیاتی",
      isExpanded: false,
    },
    {
      id: "8",
      name: "نقدینگی",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
    {
      id: "9",
      name: "سود و زیان ناخالص",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
    {
      id: "10",
      name: "سود و زیان عملیاتی",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
    {
      id: "11",
      name: "مالیات",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
    {
      id: "12",
      name: "سود و زیان خالص",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
    {
      id: "13",
      name: "سود و زیان انباشته",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
    {
      id: "14",
      name: "حقوق صاحبان سرمایه",
      category: "asset",
      description: "کدهای حساب مرتبط با وجه نقد و بانک",
      isExpanded: false,
    },
  ]);

  const toggleExpand = (id: string) => {
    setAccountCodes((prev) =>
      prev.map((code) =>
        code.id === id ? { ...code, isExpanded: !code.isExpanded } : code
      )
    );
  };

  const filteredCodes = accountCodes.filter((code) => {
    const matchesSearch =
      code.name.includes(searchQuery) || code.description.includes(searchQuery);
    const matchesFilter = activeFilter === "all" || code.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          تنظیمات اتصال کدهای حساب
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          هر مورد مالی را به یک یا چند کد حساب از نرم‌افزار حسابداری خود متصل کنید
        </p>
      </div>

      {/* Filters and Search */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === "all" ? colors.textPrimary : colors.backgroundSecondary,
                color: activeFilter === "all" ? "#ffffff" : colors.textSecondary,
              }}
            >
              همه
            </button>
            <button
              onClick={() => setActiveFilter("liability")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === "liability" ? colors.backgroundSecondary : colors.cardBackground,
                color: activeFilter === "liability" ? colors.textPrimary : colors.textSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              بدهی
            </button>
            <button
              onClick={() => setActiveFilter("asset")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === "asset" ? colors.backgroundSecondary : colors.cardBackground,
                color: activeFilter === "asset" ? colors.textPrimary : colors.textSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              دارایی
            </button>
            <button
              onClick={() => setActiveFilter("expense")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === "expense" ? colors.backgroundSecondary : colors.cardBackground,
                color: activeFilter === "expense" ? colors.textPrimary : colors.textSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              هزینه
            </button>
            <button
              onClick={() => setActiveFilter("income")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === "income" ? colors.backgroundSecondary : colors.cardBackground,
                color: activeFilter === "income" ? colors.textPrimary : colors.textSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              درآمد
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو..."
              className="w-full px-4 py-2 pr-10 rounded-lg text-sm border transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: colors.textSecondary }}
            />
          </div>
        </div>
      </div>

      {/* Account Codes List */}
      <div className="space-y-3">
        {filteredCodes.map((code) => {
          const categoryColor = categoryColors[code.category];
          return (
            <div
              key={code.id}
              className="rounded-lg border transition-all hover:shadow-md"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <button
                onClick={() => toggleExpand(code.id)}
                className="w-full p-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <ChevronDown
                    className="w-4 h-4 mt-1 transition-transform flex-shrink-0"
                    style={{
                      color: colors.textSecondary,
                      transform: code.isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                  <div className="flex-1 text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {code.name}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: categoryColor.bg,
                          border: `1px solid ${categoryColor.border}`,
                          color: categoryColor.text,
                        }}
                      >
                        {categoryLabels[code.category]}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {code.description}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {code.isExpanded && (
                <div
                  className="px-4 pb-4 pt-0 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.backgroundSecondary }}>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      محتوای جزئیات کد حساب "{code.name}" در اینجا نمایش داده می‌شود.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCodes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            موردی یافت نشد
          </p>
        </div>
      )}
    </div>
  );
}
