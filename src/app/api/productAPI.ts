import { getCookie } from "../utils/auth";

const API_BASE_URL = "https://panel.bineshafzar.ir/api";

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
    const token = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/ProductApi/GetProducts`, {
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

  async getProductEvents(request: ProductEventsRequest): Promise<ProductEventsResponse> {
    const token = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/ProductApi/GetProductEvents`, {
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