import { useState } from "react";
import { ChevronDown, Search, X, Plus, Save } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ReportDownload, ReportSection } from "./ReportDownload";

interface AccountCode {
  code: string;
  name: string;
}

interface AccountMapping {
  id: string;
  title: string;
  description: string;
  category: "income" | "expense" | "asset" | "liability";
  codes?: AccountCode[];
  isExpanded?: boolean;
}

const initialMappings: AccountMapping[] = [
  {
    id: "sales",
    title: "فروش",
    description: "کدهای حساب مرتبط با فروش محصولات",
    category: "income",
    codes: [],
    isExpanded: false,
  },
  {
    id: "operating-expenses",
    title: "هزینه‌های عملیاتی",
    description: "کدهای حساب مرتبط با هزینه‌های روزمره",
    category: "expense",
    codes: [],
    isExpanded: false,
  },
  {
    id: "inventory",
    title: "موجودی کالا",
    description: "کدهای حساب مرتبط با موجودی انبار",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "accounts-receivable",
    title: "حساب‌های دریافتنی",
    description: "کدهای حساب مشتریان و طلب‌ها",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "accounts-payable",
    title: "حساب‌های پرداختنی",
    description: "کدهای حساب تامین‌کنندگان و بدهی‌ها",
    category: "liability",
    codes: [],
    isExpanded: false,
  },
  {
    id: "depreciation",
    title: "هزینه استهلاک",
    description: "کدهای حساب مرتبط با استهلاک دارایی‌ها",
    category: "expense",
    codes: [],
    isExpanded: false,
  },
  {
    id: "other-income",
    title: "درآمد سایر",
    description: "سایر درآمدهای غیر عملیاتی",
    category: "income",
    codes: [],
    isExpanded: false,
  },
  {
    id: "cash",
    title: "نقدینگی",
    description: "کدهای حساب مرتبط با وجه نقد و بانک",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "gross-profit",
    title: "سود و زیان ناخالص",
    description: "کدهای حساب مرتبط با سود ناخالص",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "operating-profit",
    title: "سود و زیان عملیاتی",
    description: "کدهای حساب مرتبط با سود عملیاتی",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "tax",
    title: "مالیات",
    description: "کدهای حساب مرتبط با مالیات",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "net-profit",
    title: "سود و زیان خالص",
    description: "کدهای حساب مرتبط با سود خالص",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
  {
    id: "retained-earnings",
    title: "سود و زیان انباشته",
    description: "کدهای حساب مرتبط با سود انباشته",
    category: "asset",
    codes: [],
    isExpanded: false,
  },
];

// لیست کد حساب‌های نمونه برای جستجو
const availableAccountCodes: AccountCode[] = [
  { code: "1001", name: "صندوق" },
  { code: "1002", name: "بانک ملت" },
  { code: "1003", name: "بانک ملی" },
  { code: "1101", name: "حساب‌های دریافتنی تجاری" },
  { code: "1102", name: "سفته دریافتنی" },
  { code: "1201", name: "موجودی مواد اولیه" },
  { code: "1202", name: "موجودی کالای ساخته شده" },
  { code: "1203", name: "موجودی کالای در جریان ساخت" },
  { code: "2001", name: "حساب‌های پرداختنی تجاری" },
  { code: "2002", name: "سفته پرداختنی" },
  { code: "2101", name: "مالیات بر ارزش افزوده" },
  { code: "3001", name: "سرمایه" },
  { code: "4001", name: "فروش محصولات" },
  { code: "4002", name: "فروش خدمات" },
  { code: "5001", name: "بهای تمام شده کالای فروش رفته" },
  { code: "5101", name: "حقوق و دستمزد" },
  { code: "5102", name: "اجاره" },
  { code: "5103", name: "آب و برق و گاز" },
  { code: "5104", name: "استهلاک" },
  { code: "5105", name: "هزینه تبلیغات" },
  { code: "6001", name: "درآمد سود بانکی" },
  { code: "6002", name: "سود سرمایه‌گذاری" },
  { code: "7001", name: "زیان تسعیر ارز" },
];

export function AccountMappingSettings() {
  const colors = useCurrentColors();
  const [mappings, setMappings] = useState<AccountMapping[]>(initialMappings);
  const [searchQuery, setSearchQuery] = useState("");
  const [excludeQuery, setExcludeQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "income" | "expense" | "asset" | "liability">("all");
  const [showAlert, setShowAlert] = useState(true);
  const [accountSearchQueries, setAccountSearchQueries] = useState<{ [key: string]: string }>({});
  const [savedMappings, setSavedMappings] = useState<AccountMapping[]>(initialMappings);
  const [hasChanges, setHasChanges] = useState(false);

  const getCategoryBadge = (category: AccountMapping["category"]) => {
    const badges = {
      income: { label: "درآمد", bg: "#ecfdf5", border: "#a4f4cf", color: "#007a55" },
      expense: { label: "هزینه", bg: "#fff1f2", border: "#ffccd3", color: "#c70036" },
      asset: { label: "دارایی", bg: "#eff6ff", border: "#bedbff", color: "#1447e6" },
      liability: { label: "بدهی", bg: "#fffbeb", border: "#fee685", color: "#bb4d00" },
    };

    const badge = badges[category];
    return (
      <div
        className="px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: badge.bg,
          border: `1px solid ${badge.border}`,
          color: badge.color,
        }}
      >
        {badge.label}
      </div>
    );
  };

  const toggleExpand = (id: string) => {
    setMappings(
      mappings.map((mapping) =>
        mapping.id === id ? { ...mapping, isExpanded: !mapping.isExpanded } : mapping
      )
    );
  };

  const addAccountCode = (mappingId: string, accountCode: AccountCode) => {
    setMappings(
      mappings.map((mapping) => {
        if (mapping.id === mappingId) {
          const codes = mapping.codes || [];
          // جلوگیری از تکراری بودن
          if (codes.some((c) => c.code === accountCode.code)) {
            return mapping;
          }
          return { ...mapping, codes: [...codes, accountCode] };
        }
        return mapping;
      })
    );
    // پاک کردن جستجو
    setAccountSearchQueries({ ...accountSearchQueries, [mappingId]: "" });
    setHasChanges(true);
  };

  const removeAccountCode = (mappingId: string, codeToRemove: string) => {
    setMappings(
      mappings.map((mapping) => {
        if (mapping.id === mappingId) {
          return {
            ...mapping,
            codes: (mapping.codes || []).filter((c) => c.code !== codeToRemove),
          };
        }
        return mapping;
      })
    );
    setHasChanges(true);
  };

  const filteredMappings = mappings.filter((mapping) => {
    const matchesSearch =
      mapping.title.includes(searchQuery) || mapping.description.includes(searchQuery);
    const matchesExclude =
      !excludeQuery || (!mapping.title.includes(excludeQuery) && !mapping.description.includes(excludeQuery));
    const matchesFilter = activeFilter === "all" || mapping.category === activeFilter;
    return matchesSearch && matchesExclude && matchesFilter;
  });

  // آماده‌سازی داده برای گزارش‌گیری
  const getReportData = (): ReportSection[] => {
    const categoryLabels = {
      income: "درآمد",
      expense: "هزینه",
      asset: "دارایی",
      liability: "بدهی",
    };

    return mappings
      .filter((mapping) => mapping.codes && mapping.codes.length > 0)
      .map((mapping) => ({
        title: mapping.title,
        data: (mapping.codes || []).map((code) => ({
          "کد حساب": code.code,
          "نام حساب": code.name,
          "دسته‌بندی": categoryLabels[mapping.category],
          "توضیحات": mapping.description,
        })),
        headers: ["کد حساب", "نام حساب", "دسته‌بندی", "توضیحات"],
      }));
  };

  return (
    <div className="space-y-6">
      

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            تنظیمات اتصال کدهای حساب
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            هر مورد مالی را به یک یا چند کد حساب از نرم‌افزار حسابداری خود متصل کنید
          </p>
        </div>
        <div className="flex-shrink-0">
          <ReportDownload 
            sections={getReportData()} 
            fileName="تنظیمات اتصال کدهای حساب"
          />
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="rounded-lg border p-4"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeFilter === "all" ? colors.textPrimary : colors.cardBackground,
                color: activeFilter === "all" ? "#ffffff" : colors.textSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              همه
            </button>
            <button
              onClick={() => setActiveFilter("income")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeFilter === "income" ? colors.cardBackground : colors.cardBackground,
                color: activeFilter === "income" ? "#007a55" : colors.textSecondary,
                border: `1px solid ${activeFilter === "income" ? "#a4f4cf" : colors.border}`,
              }}
            >
              درآمد
            </button>
            <button
              onClick={() => setActiveFilter("expense")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeFilter === "expense" ? colors.cardBackground : colors.cardBackground,
                color: activeFilter === "expense" ? "#c70036" : colors.textSecondary,
                border: `1px solid ${activeFilter === "expense" ? "#ffccd3" : colors.border}`,
              }}
            >
              هزینه
            </button>
            <button
              onClick={() => setActiveFilter("asset")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeFilter === "asset" ? colors.cardBackground : colors.cardBackground,
                color: activeFilter === "asset" ? "#1447e6" : colors.textSecondary,
                border: `1px solid ${activeFilter === "asset" ? "#bedbff" : colors.border}`,
              }}
            >
              دارایی
            </button>
            <button
              onClick={() => setActiveFilter("liability")}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeFilter === "liability" ? colors.cardBackground : colors.cardBackground,
                color: activeFilter === "liability" ? "#bb4d00" : colors.textSecondary,
                border: `1px solid ${activeFilter === "liability" ? "#fee685" : colors.border}`,
              }}
            >
              بدهی
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg text-sm"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
              }}
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: colors.textSecondary }}
            />
            {searchQuery && (
              <X
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
                style={{ color: colors.textSecondary }}
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>

          {/* Exclude */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="حذف..."
              value={excludeQuery}
              onChange={(e) => setExcludeQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg text-sm"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
              }}
            />
            <X
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: colors.textSecondary }}
            />
            {excludeQuery && (
              <X
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
                style={{ color: colors.textSecondary }}
                onClick={() => setExcludeQuery("")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mappings List */}
      <div className="space-y-3">
        {filteredMappings.map((mapping) => (
          <div
            key={mapping.id}
            className="rounded-lg border overflow-hidden transition-all"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <button
              onClick={() => toggleExpand(mapping.id)}
              className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3 flex-1">
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mapping.isExpanded ? "rotate-180" : ""
                  }`}
                  style={{ color: colors.textSecondary }}
                />
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryBadge(mapping.category)}
                    <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                      {mapping.title}
                    </h3>
                  </div>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {mapping.description}
                  </p>
                </div>
              </div>
            </button>

            {mapping.isExpanded && (
              <div
                className="px-4 pb-4 pt-2 border-t"
                style={{ borderColor: colors.border }}
              >
                <div className="space-y-3">
                  {/* لیست کدهای متصل شده */}
                  {mapping.codes && mapping.codes.length > 0 && (
                    <div className="space-y-2">
                      {mapping.codes.map((code) => (
                        <div
                          key={code.code}
                          className="flex items-center justify-between p-2 rounded-lg"
                          style={{ backgroundColor: colors.backgroundSecondary }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium"
                              style={{ backgroundColor: colors.primary + "20", color: colors.primary }}
                            >
                              {code.code.substring(0, 1)}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                {code.name}
                              </p>
                              <p className="text-xs" style={{ color: colors.textSecondary }}>
                                کد: {code.code}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAccountCode(mapping.id, code.code)}
                            className="p-1 hover:opacity-70 transition-opacity"
                          >
                            <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* جستجو و افزودن کد جدید */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="جستجوی کد یا نام حساب..."
                        value={accountSearchQueries[mapping.id] || ""}
                        onChange={(e) =>
                          setAccountSearchQueries({ ...accountSearchQueries, [mapping.id]: e.target.value })
                        }
                        className="w-full px-4 py-2 pr-10 rounded-lg text-sm"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.border}`,
                        }}
                      />
                      <Search
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: colors.textSecondary }}
                      />
                      {accountSearchQueries[mapping.id] && (
                        <button
                          onClick={() => setAccountSearchQueries({ ...accountSearchQueries, [mapping.id]: "" })}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        >
                          <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        </button>
                      )}
                    </div>

                    {/* نتایج جستجو */}
                    {accountSearchQueries[mapping.id] && (
                      <div
                        className="max-h-48 overflow-y-auto rounded-lg border"
                        style={{
                          backgroundColor: colors.cardBackground,
                          borderColor: colors.border,
                        }}
                      >
                        {availableAccountCodes
                          .filter(
                            (code) =>
                              code.code.includes(accountSearchQueries[mapping.id]) ||
                              code.name.includes(accountSearchQueries[mapping.id])
                          )
                          .map((code) => (
                            <button
                              key={code.code}
                              onClick={() => addAccountCode(mapping.id, code)}
                              className="w-full p-3 flex items-center gap-3 hover:opacity-80 transition-opacity text-right border-b last:border-b-0"
                              style={{ borderColor: colors.border }}
                            >
                              <div
                                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
                                style={{ backgroundColor: colors.primary + "20", color: colors.primary }}
                              >
                                {code.code}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                  {code.name}
                                </p>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>
                                  کد حساب: {code.code}
                                </p>
                              </div>
                              <Plus className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />
                            </button>
                          ))}
                        {availableAccountCodes.filter(
                          (code) =>
                            code.code.includes(accountSearchQueries[mapping.id]) ||
                            code.name.includes(accountSearchQueries[mapping.id])
                        ).length === 0 && (
                          <div className="p-4 text-center">
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                              موردی یافت نشد
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMappings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            موردی یافت نشد
          </p>
        </div>
      )}

      {/* Save Button */}
      <div
        className="sticky bottom-0 left-0 right-0 p-4 border-t"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <button
          onClick={() => {
            if (hasChanges) {
              setSavedMappings(mappings);
              setHasChanges(false);
            }
          }}
          disabled={!hasChanges}
          className="w-full px-6 py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center justify-center gap-2"
          style={{
            backgroundColor: hasChanges ? colors.primary : colors.backgroundSecondary,
            color: hasChanges ? "#ffffff" : colors.textSecondary,
            border: `1px solid ${hasChanges ? colors.primary : colors.border}`,
            opacity: hasChanges ? 1 : 0.6,
            cursor: hasChanges ? "pointer" : "not-allowed",
          }}
        >
          {hasChanges ? (
            <>
              <Save className="w-4 h-4" />
              <span>اعمال تغییرات</span>
            </>
          ) : (
            <span>تغییری وجود ندارد</span>
          )}
        </button>
      </div>
    </div>
  );
}