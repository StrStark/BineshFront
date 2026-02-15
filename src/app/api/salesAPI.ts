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

interface Pagination {
  pageNumber: number;
  pageSize: number;
}

interface SalesRecordsRequest {
  dateFilter: DateFilter;
  categoryDto?: CategoryDto;
  provience?: ProvinceDto;
  paggination: Pagination;
  searchTerm?: string;
}

interface SalesRecord {
  factorNume: number;
  productDesc: string;
  productCategory: string;
  deliverdQuantity: number;
  customerName: string;
  price: number;
  date: string;
}

interface SalesRecordsResponse {
  code: number;
  status: string;
  message: string;
  body: {
    items: SalesRecord[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

interface TopSellingProduct {
  rank: number;
  productName: string;
  count: number;
  totalAmount: number;
  growth: number;
}

interface TopSellingProductsResponse {
  code: number;
  status: string;
  message: string;
  body: {
    items: TopSellingProduct[];
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

  async getSalesRecords(request: SalesRecordsRequest): Promise<SalesRecordsResponse> {
    const token = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/SalesApi/GetSalesRecords`, {
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

  async getTopSellingProducts(request: SalesSummaryRequest): Promise<TopSellingProductsResponse> {
    const token = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/SalesApi/GetTopSellingProducts`, {
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