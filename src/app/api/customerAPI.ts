import { getCookie } from "../utils/auth";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";

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
  const token = getCookie("authToken");

  const response = await fetch(`${API_BASE_URL}/CustomerApi/GetCustomersCards`, {
    method: "POST",
    headers: {
      accept: "application/json;odata.metadata=minimal;odata.streaming=true",
      "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function getCustomers(
  request: GetCustomersRequest
): Promise<GetCustomersResponse> {
  const token = getCookie("authToken");

  const response = await fetch(`${API_BASE_URL}/CustomerApi/GetCustomers`, {
    method: "POST",
    headers: {
      accept: "application/json;odata.metadata=minimal;odata.streaming=true",
      "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function getCustomerSales(
  request: GetCustomerSalesRequest
): Promise<GetCustomerSalesResponse> {
  const token = getCookie("authToken");

  const response = await fetch(`${API_BASE_URL}/CustomerApi/GetCustomerSales`, {
    method: "POST",
    headers: {
      accept: "application/json;odata.metadata=minimal;odata.streaming=true",
      "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
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