import { getCookie } from "../utils/auth";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";

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
    const token = getCookie("authToken");
    
    const response = await fetch(`${API_BASE_URL}/FinantialApi/GetFinantialSummary`, {
      method: "GET",
      headers: {
        accept: "application/json;odata.metadata=minimal;odata.streaming=true",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FinancialSummaryResponse = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.message || "Failed to fetch financial summary");
    }

    return data;
  },
};
