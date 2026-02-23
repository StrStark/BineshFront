import { getCookie } from "../utils/auth";
import { apiPost } from "../utils/apiClient";
import {
  mockSalesSummary,
  mockCustomerCategorizedSales,
  mockSalesRecords,
  mockTopSellingProducts,
} from "./mockData";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";
const USE_MOCK_DATA = false; // Set to true to use mock data instead of API

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
    if (USE_MOCK_DATA) {
      console.log("📦 Using mock data for getSalesSummary");
      return Promise.resolve(mockSalesSummary);
    }

    try {
      // Using apiPost with automatic token refresh
      const data = await apiPost<SalesSummaryResponse>('/SalesApi/GetSalesSummary', request);
      return data;
    } catch (error: any) {
      console.warn('⚠️ getSalesSummary failed, using mock data:', error.message);
      return mockSalesSummary;
    }
  },

  async getCustomerCategorizedSales(request: SalesSummaryRequest): Promise<CustomerCategorizedSalesResponse> {
    if (USE_MOCK_DATA) {
      console.log("📦 Using mock data for getCustomerCategorizedSales");
      return Promise.resolve(mockCustomerCategorizedSales);
    }

    try {
      // Using apiPost with automatic token refresh
      const data = await apiPost<CustomerCategorizedSalesResponse>('/SalesApi/GetCustomerCategorizedSales', request);
      return data;
    } catch (error: any) {
      console.warn('⚠️ getCustomerCategorizedSales failed, using mock data:', error.message);
      return mockCustomerCategorizedSales;
    }
  },

  async getSalesRecords(request: SalesRecordsRequest): Promise<SalesRecordsResponse> {
    if (USE_MOCK_DATA) {
      console.log("📦 Using mock data for getSalesRecords");
      return Promise.resolve(mockSalesRecords);
    }

    try {
      // Using apiPost with automatic token refresh
      const data = await apiPost<SalesRecordsResponse>('/SalesApi/GetSalesRecords', request);
      return data;
    } catch (error: any) {
      console.warn('⚠️ getSalesRecords failed, using mock data:', error.message);
      return mockSalesRecords;
    }
  },

  async getTopSellingProducts(request: SalesSummaryRequest): Promise<TopSellingProductsResponse> {
    if (USE_MOCK_DATA) {
      console.log("📦 Using mock data for getTopSellingProducts");
      return Promise.resolve(mockTopSellingProducts);
    }

    try {
      // Using apiPost with automatic token refresh
      const data = await apiPost<TopSellingProductsResponse>('/SalesApi/GetTopSellingProducts', request);
      return data;
    } catch (error: any) {
      console.warn('⚠️ getTopSellingProducts failed, using mock data:', error.message);
      return mockTopSellingProducts;
    }
  },
};