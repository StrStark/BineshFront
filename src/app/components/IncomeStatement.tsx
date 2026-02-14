import { useCurrentColors } from '../contexts/ThemeColorsContext';
import { TrendingUp, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { financialAPI, formatToPersianNumber } from '../api/financialAPI';

interface IncomeStatementItem {
  title: string;
  amount: string;
  value: number;
  isNegative?: boolean;
  isBold?: boolean;
  isTotal?: boolean;
}

export function IncomeStatement() {
  const colors = useCurrentColors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<IncomeStatementItem[]>([]);
  const [totalIncome, setTotalIncome] = useState('۰');
  const [totalExpense, setTotalExpense] = useState('۰');
  const [netProfit, setNetProfit] = useState('۰');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await financialAPI.getFinancialSummary();
        const profitLoss = response.body.profitLossSheet;
        const balanceSheet = response.body.balanceSheet;

        // Build items array based on API structure
        const newItems: IncomeStatementItem[] = [];

        // Get revenue and expense items from balance sheet
        const revenueSection = balanceSheet.items.mainItems.find(item => item.title === 'درآمد');
        const costSection = balanceSheet.items.mainItems.find(item => item.title === 'قیمت تمام شده');
        const expenseSection = balanceSheet.items.mainItems.find(item => item.title === 'هزینه');

        // Add revenue items
        if (revenueSection) {
          revenueSection.detailedItems.forEach(item => {
            newItems.push({
              title: item.title,
              amount: formatToPersianNumber(Math.abs(item.value)),
              value: item.value,
              isNegative: false,
              isBold: false,
              isTotal: false,
            });
          });
        }

        // Add cost items
        if (costSection) {
          costSection.detailedItems.forEach(item => {
            newItems.push({
              title: item.title,
              amount: formatToPersianNumber(Math.abs(item.value)),
              value: item.value,
              isNegative: true,
              isBold: false,
              isTotal: false,
            });
          });
        }

        // Add gross profit/loss
        if (profitLoss.grossProfitLoss.value.value !== 0) {
          newItems.push({
            title: profitLoss.grossProfitLoss.value.title,
            amount: formatToPersianNumber(Math.abs(profitLoss.grossProfitLoss.value.value)),
            value: profitLoss.grossProfitLoss.value.value,
            isNegative: profitLoss.grossProfitLoss.value.value < 0,
            isBold: true,
            isTotal: true,
          });
        }

        // Add expense items
        if (expenseSection) {
          expenseSection.detailedItems.forEach(item => {
            newItems.push({
              title: item.title,
              amount: formatToPersianNumber(Math.abs(item.value)),
              value: item.value,
              isNegative: true,
              isBold: false,
              isTotal: false,
            });
          });
        }

        // Add operational profit/loss
        if (profitLoss.operationalProfitLoss.value.value !== 0) {
          newItems.push({
            title: profitLoss.operationalProfitLoss.value.title,
            amount: formatToPersianNumber(Math.abs(profitLoss.operationalProfitLoss.value.value)),
            value: profitLoss.operationalProfitLoss.value.value,
            isNegative: profitLoss.operationalProfitLoss.value.value < 0,
            isBold: true,
            isTotal: true,
          });
        }

        // Add profit/loss before tax
        if (profitLoss.profitLossBeforTax.value.value !== 0) {
          newItems.push({
            title: profitLoss.profitLossBeforTax.value.title,
            amount: formatToPersianNumber(Math.abs(profitLoss.profitLossBeforTax.value.value)),
            value: profitLoss.profitLossBeforTax.value.value,
            isNegative: profitLoss.profitLossBeforTax.value.value < 0,
            isBold: true,
            isTotal: true,
          });
        }

        // Add net profit/loss
        if (profitLoss.netProfitLoss.value.value !== 0) {
          newItems.push({
            title: profitLoss.netProfitLoss.value.title,
            amount: formatToPersianNumber(Math.abs(profitLoss.netProfitLoss.value.value)),
            value: profitLoss.netProfitLoss.value.value,
            isNegative: profitLoss.netProfitLoss.value.value < 0,
            isBold: true,
            isTotal: true,
          });
        }

        // Add accumulated profit/loss
        if (profitLoss.accumilatedProfitLoss.value.value !== 0) {
          newItems.push({
            title: profitLoss.accumilatedProfitLoss.value.title,
            amount: formatToPersianNumber(Math.abs(profitLoss.accumilatedProfitLoss.value.value)),
            value: profitLoss.accumilatedProfitLoss.value.value,
            isNegative: profitLoss.accumilatedProfitLoss.value.value < 0,
            isBold: true,
            isTotal: true,
          });
        }

        setItems(newItems);

        // Calculate totals for summary
        let incomeTotal = 0;
        let expenseTotal = 0;

        if (revenueSection) {
          revenueSection.detailedItems.forEach(item => {
            incomeTotal += Math.abs(item.value);
          });
        }

        if (costSection) {
          costSection.detailedItems.forEach(item => {
            expenseTotal += Math.abs(item.value);
          });
        }

        if (expenseSection) {
          expenseSection.detailedItems.forEach(item => {
            expenseTotal += Math.abs(item.value);
          });
        }

        setTotalIncome(formatToPersianNumber(incomeTotal));
        setTotalExpense(formatToPersianNumber(expenseTotal));
        setNetProfit(formatToPersianNumber(profitLoss.netProfitLoss.value.value));

        setError(null);
      } catch (err: any) {
        console.error('Error fetching profit/loss data:', err);
        setError(err.message || 'خطا در دریافت اطلاعات سود و زیان');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="rounded-xl border overflow-hidden p-6"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
        dir="rtl"
      >
        <p style={{ color: colors.textSecondary }}>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl border overflow-hidden p-6"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
        dir="rtl"
      >
        <p style={{ color: colors.error }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
      dir="rtl"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 border-b"
        style={{ borderColor: colors.border }}
      >
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          سود و زیان جامع
        </h2>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:opacity-80"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            color: colors.textPrimary,
          }}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">گزارش‌گیری</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-3 ${
                item.isTotal ? 'border-t' : 'border-b'
              }`}
              style={{
                borderColor: item.isTotal ? colors.border : `${colors.border}66`,
                ...(item.isTotal && {
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                }),
              }}
            >
              <span
                className={`text-sm ${item.isBold ? 'font-bold' : ''}`}
                style={{
                  color: item.isBold ? colors.textPrimary : colors.textSecondary,
                }}
              >
                {item.title}
              </span>
              <span
                className={`text-sm ${item.isBold ? 'font-bold' : ''} ${
                  !item.isBold ? 'opacity-90' : ''
                }`}
                style={{
                  color: item.isNegative
                    ? colors.error
                    : item.isBold
                    ? colors.success
                    : colors.textPrimary,
                }}
              >
                {item.isNegative && '('}
                {item.amount} تومان
                {item.isNegative && ')'}
              </span>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 pt-6 border-t-2" style={{ borderColor: colors.border }}>
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: colors.backgroundSecondary,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                  کل درآمد
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: colors.success }} />
                  <span className="font-bold text-lg" style={{ color: colors.success }}>
                    {totalIncome} تومان
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                  کل هزینه
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 rotate-180" style={{ color: colors.error }} />
                  <span className="font-bold text-lg" style={{ color: colors.error }}>
                    {totalExpense} تومان
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                  سود خالص
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: colors.primary }} />
                  <span className="font-bold text-lg" style={{ color: colors.primary }}>
                    {netProfit} تومان
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mt-6 pt-6 border-t text-center"
              style={{ borderColor: colors.border }}
            >
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                دوره مالی:{' '}
                <span className="font-bold" style={{ color: colors.textPrimary }}>
                  سال جاری
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}