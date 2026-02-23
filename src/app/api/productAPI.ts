import { getCookie } from "../utils/auth";
import { mockProducts } from "./mockData";
import { apiFetch } from "../utils/apiClient";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";
const USE_MOCK_DATA = false;

interface CategoryDto {
  productCategory: string;
}

interface Pagination {
  pageNumber: number;
  pageSize: number;
}

interface ProductsRequest {
  categoryDto: CategoryDto;
  paggination: Pagination;
  searchTerm?: string;
}

interface ProductItem {
  productId: string;
  productName: string;
  detailedType: string;
  category: number;
  priceUnit: number;
  totalSale: number;
}

interface ProductsResponse {
  code: number;
  status: string;
  message: string;
  body: {
    items: ProductItem[];
  };
}

interface ProductEventsRequest {
  listDto: {
    productIdList: string[];
  };
  paggination: Pagination;
}

interface ProductEventItem {
  state: string;
  date: string;
  factorNumber: number;
  value1: string;
  value2: string;
  value3: string;
  price: number;
  desc: string | null;
}

interface ProductEvents {
  productId: string;
  items: ProductEventItem[];
  buy: number;
  sell: number;
  stock: number;
}

interface ProductEventsResponse {
  code: number;
  status: string;
  message: string;
  body: {
    items: ProductEvents[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const productAPI = {
  async getProducts(request: ProductsRequest): Promise<ProductsResponse> {
    if (USE_MOCK_DATA) {
      return mockProducts;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await apiFetch(`${API_BASE_URL}/ProductApi/GetProducts`, {
        method: "POST",
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.warn('⚠️ getProducts failed, using mock data:', error.message);
      return mockProducts;
    }
  },

  async getProductEvents(request: ProductEventsRequest): Promise<ProductEventsResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await apiFetch(`${API_BASE_URL}/ProductApi/GetProductEvents`, {
        method: "POST",
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.warn('⚠️ getProductEvents failed:', error.message);
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
  },
};

export type {
  ProductsRequest,
  ProductsResponse,
  ProductItem,
  ProductEventsRequest,
  ProductEventsResponse,
  ProductEventItem,
  ProductEvents,
  Pagination,
};