import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Plus, Calendar } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { BalanceSheet } from "../components/BalanceSheet";
import { IncomeStatement } from "../components/IncomeStatement";
import { PersianCalendar } from "../components/PersianCalendar";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { CashFlowChart } from "../components/CashFlowChart";
import { ExpenseDistributionChart } from "../components/ExpenseDistributionChart";
import { AccountsWidget } from "../components/AccountsWidget";
import { useState, useMemo } from "react";

// داده‌های تراز‌نامه
const balanceSheetData = {
  assets: [
    {
      title: 'دارایی‌های جاری',
      items: [
        { title: 'موجودی نقد و بانک', amount: '۱,۱۵۱,۵۱۱,۰۰۰' },
        { title: 'حساب‌های دریافتنی', amount: '۸۵۰,۰۰۰,۰۰۰' },
      ],
    },
    {
      title: 'دارایی‌های غیرجاری',
      items: [
        { title: 'املاک و مستغلات', amount: '۵,۰۰۰,۰۰۰,۰۰۰' },
        { title: 'تجهیزات', amount: '۲,۰۰۰,۰۰۰,۰۰۰' },
      ],
    },
  ],
  liabilities: [
    {
      title: 'بدهی‌های جاری',
      items: [
        { title: 'حساب‌های پرداختنی', amount: '۶۵۰,۰۰۰,۰۰۰' },
        { title: 'وام‌های کوتاه‌مدت', amount: '۴۰۰,۰۰۰,۰۰۰' },
      ],
    },
    {
      title: 'بدهی‌های غیرجاری',
      items: [
        { title: 'وام‌های بلندمدت', amount: '۳,۰۰۰,۰۰۰,۰۰۰' },
        { title: 'سایر بدهی‌ها', amount: '۵۰۰,۰۰۰,۰۰۰' },
      ],
    },
  ],
};

// داده‌های سود و زیان
const incomeStatementData = [
  { title: 'فروش', amount: '۲۵,۰۰۰,۰۰۰', type: 'income' },
  { title: 'بهای تمام شده', amount: '۸,۰۰۰,۰۰۰', type: 'expense' },
  { title: 'سود ناخالص', amount: '۱۷,۰۰۰,۰۰۰', type: 'profit' },
  { title: 'هزینه‌های عملیاتی', amount: '۴,۰۰۰,۰۰۰', type: 'expense' },
  { title: 'سود عملیاتی', amount: '۱۳,۰۰۰,۰۰۰', type: 'profit' },
  { title: 'سود خالص', amount: '۱۳,۰۰۰,۰۰۰', type: 'profit' },
];

export function FinancialPage() {
  const colors = useCurrentColors();
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return "انتخاب بازه زمانی";
    
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return `${fromDate.toLocaleDateString("fa-IR")} - ${toDate.toLocaleDateString("fa-IR")}`;
  };

  const stats = [
    { icon: Wallet, label: "موجودی نقدی", value: "۸۵,۰۰۰,۰۰۰", unit: "تومان", color: colors.primary },
    { icon: TrendingUp, label: "درآمد ماه جاری", value: "۲۵,۰۰۰,۰۰۰", unit: "تومان", color: colors.success },
    { icon: TrendingDown, label: "هزینه ماه جاری", value: "۱۲,۰۰۰,۰۰۰", unit: "تومان", color: colors.error },
    { icon: CreditCard, label: "سود ماه جاری", value: "۱۳,۰۰۰,۰۰۰", unit: "تومان", color: colors.purple },
  ];

  // آماده‌سازی داده‌ها برای گزارش
  const reportSections: ReportSection[] = useMemo(() => {
    return [
      {
        title: "آمار کلی مالی",
        data: [
          { 
            "شاخص": "موجودی نقدی", 
            "مقدار": "۸۵,۰۰۰,۰۰۰ تومان",
            "درصد": "-" 
          },
          { 
            "شاخص": "درآمد ماه جاری", 
            "مقدار": "۲۵,۰۰۰,۰۰۰ تومان",
            "درصد": "-"
          },
          { 
            "شاخص": "هزینه ماه جاری", 
            "مقدار": "۱۲,۰۰۰,۰۰۰ تومان",
            "درصد": "-"
          },
          { 
            "شاخص": "سود ماه جاری", 
            "مقدار": "۱۳,۰۰۰,۰۰۰ تومان",
            "درصد": "+108%"
          },
        ],
        headers: ["شاخص", "مقدار", "درصد"]
      },
      {
        title: "تراز‌نامه - دارایی‌ها",
        data: balanceSheetData.assets.flatMap(section => 
          section.items.map(item => ({
            "بخش": section.title,
            "عنوان": item.title,
            "مبلغ": item.amount + " تومان",
          }))
        ),
        headers: ["بخش", "عنوان", "مبلغ"]
      },
      {
        title: "تراز‌نامه - بدهی‌ها",
        data: balanceSheetData.liabilities.flatMap(section => 
          section.items.map(item => ({
            "بخش": section.title,
            "عنوان": item.title,
            "مبلغ": item.amount + " تومان",
          }))
        ),
        headers: ["بخش", "عنوان", "مبلغ"]
      },
      {
        title: "سود و زیان جامع",
        data: incomeStatementData.map(item => ({
          "شرح": item.title,
          "مبلغ": item.amount + " تومان",
          "نوع": item.type === 'income' ? 'درآمد' : 
                item.type === 'expense' ? 'هزینه' : 'سود',
        })),
        headers: ["شرح", "مبلغ", "نوع"]
      }
    ];
  }, [dateRange]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            مدیریت مالی
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            گزارشات مالی و حسابداری
          </p>
        </div>
        {/* <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setShowCalendar(true)}
          >
            <Calendar className="w-5 h-5" />
            <span>{formatDateRange()}</span>
          </button>
          <ReportDownload sections={reportSections} fileName="گزارش-مالی" />
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="w-5 h-5" />
            <span>ثبت تراکنش جدید</span>
          </button>
        </div> */}
      </div>

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

      {/* Cash Flow & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div>
          <AccountsWidget />
        </div>
      </div>

      {/* Expense Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* <ExpenseDistributionChart /> */}
        </div>
      </div>

      {/* تراز‌نامه */}
      <BalanceSheet />

      {/* سود و زیان جامع */}
      <IncomeStatement />

      {/* Calendar Modal */}
      {showCalendar && (
        <PersianCalendar
          value={dateRange}
          onConfirm={(range) => {
            setDateRange(range);
            setShowCalendar(false);
          }}
          onCancel={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}