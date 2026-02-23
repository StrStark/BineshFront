/**
 * Mock data برای زمانی که API در دسترس نیست
 */

export const mockSalesSummary = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    soldItems: [
      { type: "کالا", value: 12500000, returned: 150000 },
      { type: "خدمات", value: 8300000, returned: 0 },
      { type: "دیجیتال", value: 5600000, returned: 50000 },
      { type: "مواد اولیه", value: 4200000, returned: 100000 },
      { type: "لوازم جانبی", value: 3100000, returned: 0 },
    ],
    salesCards: {
      totalSales: 33700000,
      totalOrders: 245,
      averageOrderValue: 137551,
      growthRate: 12.5,
    },
  },
};

export const mockCustomerCategorizedSales = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    sales: [
      { type: 1, count: 150, onDate: "2024-01-01" },
      { type: 1, count: 180, onDate: "2024-01-02" },
      { type: 1, count: 165, onDate: "2024-01-03" },
      { type: 1, count: 195, onDate: "2024-01-04" },
      { type: 1, count: 220, onDate: "2024-01-05" },
      { type: 2, count: 120, onDate: "2024-01-01" },
      { type: 2, count: 135, onDate: "2024-01-02" },
      { type: 2, count: 145, onDate: "2024-01-03" },
      { type: 2, count: 160, onDate: "2024-01-04" },
      { type: 2, count: 175, onDate: "2024-01-05" },
    ],
  },
};

export const mockSalesRecords = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    items: [
      {
        factorNume: 1001,
        productDesc: "محصول A",
        productCategory: "الکترونیکی",
        deliverdQuantity: 5,
        customerName: "شرکت الف",
        price: 1500000,
        date: "2024-02-10",
      },
      {
        factorNume: 1002,
        productDesc: "محصول B",
        productCategory: "مواد غذایی",
        deliverdQuantity: 10,
        customerName: "شرکت ب",
        price: 850000,
        date: "2024-02-11",
      },
      {
        factorNume: 1003,
        productDesc: "محصول C",
        productCategory: "پوشاک",
        deliverdQuantity: 15,
        customerName: "شرکت ج",
        price: 650000,
        date: "2024-02-12",
      },
    ],
    totalCount: 3,
    pageNumber: 1,
    pageSize: 10,
  },
};

export const mockTopSellingProducts = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    items: [
      {
        rank: 1,
        productName: "محصول برتر 1",
        count: 150,
        totalAmount: 7500000,
        growth: 15.5,
      },
      {
        rank: 2,
        productName: "محصول برتر 2",
        count: 120,
        totalAmount: 6000000,
        growth: 8.2,
      },
      {
        rank: 3,
        productName: "محصول برتر 3",
        count: 95,
        totalAmount: 4750000,
        growth: -2.1,
      },
      {
        rank: 4,
        productName: "محصول برتر 4",
        count: 80,
        totalAmount: 4000000,
        growth: 5.6,
      },
      {
        rank: 5,
        productName: "محصول برتر 5",
        count: 65,
        totalAmount: 3250000,
        growth: 12.3,
      },
    ],
  },
};

export const mockCustomers = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    items: [
      {
        id: "1",
        fullName: "احمد رضایی",
        phoneNumber: "09121234567",
        customerCategory: "VIP",
        totalPurchaseAmount: 5000000,
        lastPurchaseDate: "2024-02-10",
      },
      {
        id: "2",
        fullName: "مریم احمدی",
        phoneNumber: "09131234567",
        customerCategory: "عادی",
        totalPurchaseAmount: 2500000,
        lastPurchaseDate: "2024-02-12",
      },
      {
        id: "3",
        fullName: "علی محمدی",
        phoneNumber: "09141234567",
        customerCategory: "ویژه",
        totalPurchaseAmount: 3800000,
        lastPurchaseDate: "2024-02-11",
      },
    ],
    totalCount: 3,
    pageNumber: 1,
    pageSize: 10,
  },
};

export const mockProducts = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    items: [
      {
        id: "1",
        name: "محصول نمونه 1",
        category: "الکترونیکی",
        price: 150000,
        stock: 50,
        sales: 120,
      },
      {
        id: "2",
        name: "محصول نمونه 2",
        category: "پوشاک",
        price: 85000,
        stock: 100,
        sales: 95,
      },
      {
        id: "3",
        name: "محصول نمونه 3",
        category: "مواد غذایی",
        price: 45000,
        stock: 200,
        sales: 180,
      },
    ],
    totalCount: 3,
    pageNumber: 1,
    pageSize: 10,
  },
};

export const mockCustomersCards = {
  code: 200,
  status: "success",
  message: "Mock data",
  body: {
    arpu: {
      value: 2500000,
      growth: 8.5,
    },
    crr: {
      value: 75.5,
      growth: 3.2,
    },
  },
};
