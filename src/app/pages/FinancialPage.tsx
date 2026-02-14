import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Plus, Calendar } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { BalanceSheet } from "../components/BalanceSheet";
import { IncomeStatement } from "../components/IncomeStatement";
import { PersianCalendar } from "../components/PersianCalendar";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { CashFlowChart } from "../components/CashFlowChart";
import { ExpenseDistributionChart } from "../components/ExpenseDistributionChart";
import { AccountsWidget } from "../components/AccountsWidget";
import { useState, useMemo, useEffect } from "react";
import { financialAPI, formatToPersianNumber } from "../api/financialAPI";

export function FinancialPage() {
  const colors = useCurrentColors();
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { icon: Wallet, label: "فروش کل", value: "۰", unit: "تومان", color: colors.primary, growth: 0 },
    { icon: TrendingUp, label: "حاشیه سود", value: "۰", unit: "تومان", color: colors.success, growth: 0 },
    { icon: TrendingDown, label: "سود خالص", value: "۰", unit: "تومان", color: colors.error, growth: 0 },
    { icon: CreditCard, label: "نقدینگی", value: "۰", unit: "تومان", color: colors.purple, growth: 0 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await financialAPI.getFinancialSummary();
        const stateCards = response.body.stateCards;

        const newStats = [
          { 
            icon: Wallet, 
            label: "فروش کل", 
            value: formatToPersianNumber(stateCards.totalSale.value), 
            unit: "تومان", 
            color: colors.primary,
            growth: stateCards.totalSale.growth
          },
          { 
            icon: TrendingUp, 
            label: "حاشیه سود", 
            value: formatToPersianNumber(stateCards.profitMargine.value), 
            unit: "تومان", 
            color: colors.success,
            growth: stateCards.profitMargine.growth
          },
          { 
            icon: CreditCard, 
            label: "سود خالص", 
            value: formatToPersianNumber(stateCards.netProfit.value), 
            unit: "تومان", 
            color: colors.purple,
            growth: stateCards.netProfit.growth
          },
          { 
            icon: TrendingDown, 
            label: "نقدینگی", 
            value: formatToPersianNumber(stateCards.liquidity.value), 
            unit: "تومان", 
            color: colors.error,
            growth: stateCards.liquidity.growth
          },
        ];

        setStats(newStats);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching financial stats:', err);
        setError(err.message || 'خطا در دریافت آمار مالی');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [colors.primary, colors.success, colors.error, colors.purple]);

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return "انتخاب بازه زمانی";
    
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return `${fromDate.toLocaleDateString("fa-IR")} - ${toDate.toLocaleDateString("fa-IR")}`;
  };

  // آماده‌سازی داده‌ها برای گزارش
  const reportSections: ReportSection[] = useMemo(() => {
    return [
      {
        title: "آمار کلی مالی",
        data: stats.map(stat => ({
          "شاخص": stat.label,
          "مقدار": `${stat.value} ${stat.unit}`,
          "درصد رشد": `${stat.growth >= 0 ? '+' : ''}${formatToPersianNumber(stat.growth)}%`
        })),
        headers: ["شاخص", "مقدار", "درصد رشد"]
      }
    ];
  }, [stats]);

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

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center py-8" style={{ color: colors.textSecondary }}>
          در حال بارگذاری آمار...
        </div>
      ) : error ? (
        <div className="text-center py-8" style={{ color: colors.error }}>
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositiveGrowth = stat.growth >= 0;
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
                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                  {stat.unit}
                </p>
                <div 
                  className="flex items-center gap-1 text-xs"
                  style={{ color: isPositiveGrowth ? colors.success : colors.error }}
                >
                  <TrendingUp className={`w-3 h-3 ${!isPositiveGrowth ? 'rotate-180' : ''}`} />
                  <span>{isPositiveGrowth ? '+' : ''}{formatToPersianNumber(stat.growth)}% نسبت به دوره قبل</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cash Flow & Accounts */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div>
          <AccountsWidget />
        </div>
      </div> */}

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