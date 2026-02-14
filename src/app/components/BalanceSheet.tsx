import { useCurrentColors } from '../contexts/ThemeColorsContext';
import { FileText, TrendingUp, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { financialAPI, formatToPersianNumber } from '../api/financialAPI';

interface BalanceItem {
  title: string;
  amount: string;
  value: number;
}

interface BalanceSection {
  title: string;
  items: BalanceItem[];
}

export function BalanceSheet() {
  const colors = useCurrentColors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<BalanceSection[]>([]);
  const [liabilities, setLiabilities] = useState<BalanceSection[]>([]);
  const [equities, setEquities] = useState<BalanceSection[]>([]);
  const [summaryCards, setSummaryCards] = useState([
    {
      title: 'دارایی‌ها',
      amount: '۰',
      unit: 'تومان',
      growth: '۰%',
      icon: FileText,
      value: 0,
      growthValue: 0,
    },
    {
      title: 'بدهی‌ها',
      amount: '۰',
      unit: 'تومان',
      growth: '۰%',
      icon: FileText,
      value: 0,
      growthValue: 0,
    },
    {
      title: 'حقوق صاحبان سهام',
      amount: '۰',
      unit: 'تومان',
      growth: '۰%',
      icon: FileText,
      value: 0,
      growthValue: 0,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await financialAPI.getFinancialSummary();
        const balanceSheet = response.body.balanceSheet;

        // Update summary cards
        const newSummaryCards = [
          {
            title: 'دارایی‌ها',
            amount: formatToPersianNumber(balanceSheet.stateCards.assets.value),
            unit: 'تومان',
            growth: `${balanceSheet.stateCards.assets.growth >= 0 ? '+' : ''}${formatToPersianNumber(balanceSheet.stateCards.assets.growth)}%`,
            icon: FileText,
            value: balanceSheet.stateCards.assets.value,
            growthValue: balanceSheet.stateCards.assets.growth,
          },
          {
            title: 'بدهی‌ها',
            amount: formatToPersianNumber(balanceSheet.stateCards.liability.value),
            unit: 'تومان',
            growth: `${balanceSheet.stateCards.liability.growth >= 0 ? '+' : ''}${formatToPersianNumber(balanceSheet.stateCards.liability.growth)}%`,
            icon: FileText,
            value: balanceSheet.stateCards.liability.value,
            growthValue: balanceSheet.stateCards.liability.growth,
          },
          {
            title: 'حقوق صاحبان سهام',
            amount: formatToPersianNumber(balanceSheet.stateCards.equities.value),
            unit: 'تومان',
            growth: `${balanceSheet.stateCards.equities.growth >= 0 ? '+' : ''}${formatToPersianNumber(balanceSheet.stateCards.equities.growth)}%`,
            icon: FileText,
            value: balanceSheet.stateCards.equities.value,
            growthValue: balanceSheet.stateCards.equities.growth,
          },
        ];
        setSummaryCards(newSummaryCards);

        // Process main items
        const assetsSections: BalanceSection[] = [];
        const liabilitiesSections: BalanceSection[] = [];
        const equitiesSections: BalanceSection[] = [];

        balanceSheet.items.mainItems.forEach((mainItem) => {
          const section: BalanceSection = {
            title: mainItem.title,
            items: mainItem.detailedItems.map((item) => ({
              title: item.title,
              amount: formatToPersianNumber(item.value),
              value: item.value,
            })),
          };

          // Categorize based on title
          const titleLower = mainItem.title.toLowerCase();
          if (titleLower.includes('دارایی') || titleLower.includes('انتظامی') && !titleLower.includes('طرف')) {
            assetsSections.push(section);
          } else if (titleLower.includes('بدهی')) {
            liabilitiesSections.push(section);
          } else if (titleLower.includes('حقوق') || titleLower.includes('سهام')) {
            equitiesSections.push(section);
          }
        });

        setAssets(assetsSections);
        setLiabilities(liabilitiesSections);
        setEquities(equitiesSections);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching financial data:', err);
        setError(err.message || 'خطا در دریافت اطلاعات مالی');
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

  const totalAssets = summaryCards[0].amount;
  const totalLiabilities = summaryCards[1].amount;
  const totalEquities = summaryCards[2].amount;

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
          تراز‌نامه
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const isPositiveGrowth = card.growthValue >= 0;
          return (
            <div
              key={index}
              className="rounded-lg border p-6"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.cardBackground }}
                >
                  <Icon className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                {card.title}
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {card.amount}
                </span>
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {card.unit}
                </span>
              </div>
              <div 
                className="flex items-center gap-1 text-xs" 
                style={{ color: isPositiveGrowth ? colors.success : colors.error }}
              >
                <TrendingUp className={`w-3 h-3 ${!isPositiveGrowth ? 'rotate-180' : ''}`} />
                <span>{card.growth} رشد نسبت به دوره قبل</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance Sheet Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* دارایی‌ها */}
        <div>
          <div
            className="rounded-lg p-4 mb-4"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h3 className="font-bold" style={{ color: colors.textPrimary }}>
              دارایی‌ها
            </h3>
          </div>

          <div className="space-y-6">
            {assets.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between py-2 border-b"
                      style={{ borderColor: colors.border }}
                    >
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {item.title}
                      </span>
                      <span 
                        className="text-sm font-bold" 
                        style={{ color: item.value < 0 ? colors.error : colors.textPrimary }}
                      >
                        {item.value < 0 && '('}
                        {item.amount}
                        {item.value < 0 && ')'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Assets */}
            <div
              className="pt-4 mt-4 border-t-2"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold" style={{ color: colors.textPrimary }}>
                  مجموع دارایی‌ها
                </span>
                <span className="font-bold text-lg" style={{ color: colors.primary }}>
                  {totalAssets}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* بدهی‌ها و حقوق صاحبان سهام */}
        <div>
          {/* بدهی‌ها */}
          <div
            className="rounded-lg p-4 mb-4"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <h3 className="font-bold" style={{ color: colors.textPrimary }}>
              بدهی‌ها و حقوق صاحبان سهام
            </h3>
          </div>

          <div className="space-y-6">
            {/* Liabilities */}
            {liabilities.map((section, sectionIndex) => (
              <div key={`liab-${sectionIndex}`}>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between py-2 border-b"
                      style={{ borderColor: colors.border }}
                    >
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {item.title}
                      </span>
                      <span 
                        className="text-sm font-bold" 
                        style={{ color: item.value < 0 ? colors.error : colors.textPrimary }}
                      >
                        {item.value < 0 && '('}
                        {item.amount}
                        {item.value < 0 && ')'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Equities */}
            {equities.map((section, sectionIndex) => (
              <div key={`equity-${sectionIndex}`}>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between py-2 border-b"
                      style={{ borderColor: colors.border }}
                    >
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {item.title}
                      </span>
                      <span 
                        className="text-sm font-bold" 
                        style={{ color: item.value < 0 ? colors.error : colors.textPrimary }}
                      >
                        {item.value < 0 && '('}
                        {item.amount}
                        {item.value < 0 && ')'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Liabilities & Equities */}
            <div
              className="pt-4 mt-4 border-t-2"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold" style={{ color: colors.textPrimary }}>
                  مجموع بدهی‌ها
                </span>
                <span className="font-bold text-lg" style={{ color: colors.error }}>
                  {totalLiabilities}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold" style={{ color: colors.textPrimary }}>
                  مجموع حقوق صاحبان سهام
                </span>
                <span className="font-bold text-lg" style={{ color: colors.success }}>
                  {totalEquities}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}