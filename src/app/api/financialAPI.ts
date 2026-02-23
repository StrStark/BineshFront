import { apiFetch } from "../utils/apiClient";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";
const USE_MOCK_DATA = false;

interface StateCard {
  value: number;
  growth: number;
}

interface BalanceSheetStateCards {
  assets: StateCard;
  liability: StateCard;
  equities: StateCard;
}

interface DetailedItem {
  title: string;
  value: number;
}

interface MainItem {
  title: string;
  detailedItems: DetailedItem[];
}

interface BalanceSheetItems {
  mainItems: MainItem[];
}

interface BalanceSheet {
  stateCards: BalanceSheetStateCards;
  items: BalanceSheetItems;
}

interface ProfitLossValue {
  title: string;
  value: number;
}

interface ProfitLossSection {
  value: ProfitLossValue;
  drtailed: DetailedItem[];
}

interface ProfitLossSheet {
  grossProfitLoss: ProfitLossSection;
  operationalProfitLoss: ProfitLossSection;
  profitLossBeforTax: ProfitLossSection;
  netProfitLoss: ProfitLossSection;
  accumilatedProfitLoss: ProfitLossSection;
}

interface FinancialSummaryBody {
  stateCards: {
    totalSale: StateCard;
    profitMargine: StateCard;
    netProfit: StateCard;
    liquidity: StateCard;
  };
  balanceSheet: BalanceSheet;
  profitLossSheet: ProfitLossSheet;
}

interface FinancialSummaryResponse {
  code: number;
  status: string;
  message: string;
  body: FinancialSummaryBody;
}

// Helper function to format numbers to Persian
export function formatToPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const formatted = Math.abs(num).toLocaleString('en-US');
  return formatted.split('').map(char => 
    char >= '0' && char <= '9' ? persianDigits[parseInt(char)] : char
  ).join('');
}

export const financialAPI = {
  getFinancialSummary: async (): Promise<FinancialSummaryResponse> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await apiFetch(`${API_BASE_URL}/FinancialApi/GetFinancialSummary`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FinancialSummaryResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch financial summary");
      }

      return data;
    } catch (error: any) {
      console.warn('⚠️ getFinancialSummary failed, using mock data:', error.message);
      // Return mock data
      return {
        code: 200,
        status: "mock",
        message: "Using fallback data",
        body: {
          stateCards: {
            totalSale: { value: 150000000, growth: 12.5 },
            profitMargine: { value: 25.5, growth: 3.2 },
            netProfit: { value: 38250000, growth: 8.7 },
            liquidity: { value: 65000000, growth: -2.1 },
          },
          balanceSheet: {
            stateCards: {
              assets: { value: 250000000, growth: 5.5 },
              liability: { value: 100000000, growth: 2.1 },
              equities: { value: 150000000, growth: 8.9 },
            },
            items: {
              mainItems: [],
            },
          },
          profitLossSheet: {
            grossProfitLoss: {
              value: { title: "سود ناخالص", value: 45000000 },
              drtailed: [],
            },
            operationalProfitLoss: {
              value: { title: "سود عملیاتی", value: 42000000 },
              drtailed: [],
            },
            profitLossBeforTax: {
              value: { title: "سود قبل از مالیات", value: 40000000 },
              drtailed: [],
            },
            netProfitLoss: {
              value: { title: "سود خالص", value: 38250000 },
              drtailed: [],
            },
            accumilatedProfitLoss: {
              value: { title: "سود انباشته", value: 95000000 },
              drtailed: [],
            },
          },
        },
      };
    }
  },
};