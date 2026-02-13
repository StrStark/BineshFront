import { getCookie } from "../utils/auth";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";

interface DateFilter {
  startTime: string;
  endTime: string;
  timeFrameUnit: number;
}

interface CategoryDto {
  productCategory: string;
}

interface ProvinceDto {
  provinece: string;
}

interface SalesSummaryRequest {
  dateFilter: DateFilter;
  categoryDto?: CategoryDto;
  provience?: ProvinceDto;
}

interface SoldItem {
  type: string;
  value: number;
  returned: number;
}

interface SalesSummaryResponse {
  code: number;
  status: string;
  message: string;
  body: {
    soldItems: SoldItem[];
  };
}

interface SalesDataPoint {
  type: number;
  count: number;
  onDate: string;
}

interface CustomerCategorizedSalesResponse {
  code: number;
  status: string;
  message: string;
  body: {
    sales: SalesDataPoint[];
  };
}

export const salesAPI = {
  async getSalesSummary(request: SalesSummaryRequest): Promise<SalesSummaryResponse> {
    const token = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/SalesApi/GetSalesSummary`, {
      method: "POST",
      headers: {
        accept: "application/json;odata.metadata=minimal;odata.streaming=true",
        "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },

  async getCustomerCategorizedSales(request: SalesSummaryRequest): Promise<CustomerCategorizedSalesResponse> {
    const token = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/SalesApi/GetCustomercategorizedSales`, {
      method: "POST",
      headers: {
        accept: "application/json;odata.metadata=minimal;odata.streaming=true",
        "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },
};