import { getCookie } from "../utils/auth";
import { mockCustomers, mockCustomersCards } from "./mockData";
import { apiFetch } from "../utils/apiClient";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";
const USE_MOCK_DATA = false;

interface DateFilter {
  startTime: string;
  endTime: string;
  timeFrameUnit: number;
}

interface ProductCategory {
  productCategory: string;
}

interface CustomerCategory {
  customerCategory: string;
}

interface Pagination {
  pageNumber: number;
  pageSize: number;
}

interface GetCustomersCardsRequest {
  dateFilter: DateFilter;
  prodctCategory: ProductCategory;
  custoemrCategory: CustomerCategory;
}

interface GetCustomersRequest {
  dateFilter: DateFilter;
  prodctCategory: ProductCategory;
  custoemrCategory: CustomerCategory;
  paggination: Pagination;
  searchTerm?: string;
}

interface CardData {
  value: number;
  growth: number;
}

interface GetCustomersCardsResponse {
  code: number;
  status: string;
  message: string;
  body: {
    arpu: CardData;
    crr: CardData;
    totalCustomers: number;
    activeCustomers: number;
  };
}

interface CustomerItem {
  id: string;
  fullName: string;
  isActive: boolean;
  salesCount: number;
  place: string;
}

interface GetCustomersResponse {
  code: number;
  status: string;
  message: string;
  body: {
    items: CustomerItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

interface CustomerSaleItem {
  kalaCode: string;
  count: number;
  lastSaleDate: string;
  price: number;
}

interface CustomerSalesData {
  customerId: string;
  items: CustomerSaleItem[];
}

interface GetCustomerSalesRequest {
  customerIds: {
    ids: string[];
  };
  paggination: Pagination;
}

interface GetCustomerSalesResponse {
  code: number;
  status: string;
  message: string;
  body: {
    items: CustomerSalesData[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

async function getCustomersCards(
  request: GetCustomersCardsRequest
): Promise<GetCustomersCardsResponse> {
  if (USE_MOCK_DATA) {
    return mockCustomersCards;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await apiFetch(
      `${API_BASE_URL}/CustomerApi/GetCustomersCards`,
      {
        method: "POST",
        body: JSON.stringify(request),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn(
      "⚠️ getCustomersCards failed, using mock data:",
      error.message
    );
    return mockCustomersCards;
  }
}

async function getCustomers(
  request: GetCustomersRequest
): Promise<GetCustomersResponse> {
  if (USE_MOCK_DATA) {
    return mockCustomers;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await apiFetch(`${API_BASE_URL}/CustomerApi/GetCustomers`, {
      method: "POST",
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn("⚠️ getCustomers failed, using mock data:", error.message);
    return mockCustomers;
  }
}

async function getCustomerSales(
  request: GetCustomerSalesRequest
): Promise<GetCustomerSalesResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await apiFetch(`${API_BASE_URL}/CustomerApi/GetCustomerSales`, {
      method: "POST",
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn("⚠️ getCustomerSales failed:", error.message);
    // Return empty response
    return {
      code: 200,
      status: "mock",
      message: "Using fallback data",
      body: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
      },
    };
  }
}

export const customerAPI = {
  getCustomersCards,
  getCustomers,
  getCustomerSales,
};

export type {
  GetCustomersCardsRequest,
  GetCustomersCardsResponse,
  DateFilter,
  ProductCategory,
  CustomerCategory,
  CardData,
  GetCustomersRequest,
  GetCustomersResponse,
  CustomerItem,
  Pagination,
  CustomerSaleItem,
  CustomerSalesData,
  GetCustomerSalesRequest,
  GetCustomerSalesResponse,
};