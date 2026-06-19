import { Customer, CustomerSegmentData } from "./types";

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "C001",
    name: "محمد احمدی",
    email: "m.ahmadi@example.com",
    phone: "09121234567",
    totalPurchases: 45000000,
    lastPurchase: "1403/10/12",
    status: "vip",
    segment: "vip",
    joinDate: "1402/03/15",
    orderCount: 23
  },
  {
    id: "C002",
    name: "فاطمه حسینی",
    email: "f.hosseini@example.com",
    phone: "09122345678",
    totalPurchases: 28000000,
    lastPurchase: "1403/10/10",
    status: "active",
    segment: "premium",
    joinDate: "1402/05/20",
    orderCount: 15
  },
  {
    id: "C003",
    name: "علی رضایی",
    email: "a.rezaei@example.com",
    phone: "09123456789",
    totalPurchases: 52000000,
    lastPurchase: "1403/10/14",
    status: "vip",
    segment: "vip",
    joinDate: "1401/11/08",
    orderCount: 31
  },
  {
    id: "C004",
    name: "زهرا محمدی",
    email: "z.mohammadi@example.com",
    phone: "09124567890",
    totalPurchases: 12000000,
    lastPurchase: "1403/10/08",
    status: "active",
    segment: "regular",
    joinDate: "1403/01/12",
    orderCount: 7
  },
  {
    id: "C005",
    name: "حسین کریمی",
    email: "h.karimi@example.com",
    phone: "09125678901",
    totalPurchases: 34000000,
    lastPurchase: "1403/10/13",
    status: "active",
    segment: "premium",
    joinDate: "1402/07/25",
    orderCount: 18
  },
  {
    id: "C006",
    name: "مریم اکبری",
    email: "m.akbari@example.com",
    phone: "09126789012",
    totalPurchases: 8500000,
    lastPurchase: "1403/09/28",
    status: "active",
    segment: "regular",
    joinDate: "1403/02/18",
    orderCount: 5
  },
  {
    id: "C007",
    name: "رضا نوری",
    email: "r.nouri@example.com",
    phone: "09127890123",
    totalPurchases: 61000000,
    lastPurchase: "1403/10/15",
    status: "vip",
    segment: "vip",
    joinDate: "1401/08/14",
    orderCount: 38
  },
  {
    id: "C008",
    name: "سارا جعفری",
    email: "s.jafari@example.com",
    phone: "09128901234",
    totalPurchases: 15000000,
    lastPurchase: "1403/10/05",
    status: "active",
    segment: "regular",
    joinDate: "1402/12/03",
    orderCount: 9
  },
  {
    id: "C009",
    name: "امیر حسینی",
    email: "a.hosseini@example.com",
    phone: "09129012345",
    totalPurchases: 3200000,
    lastPurchase: "1403/08/22",
    status: "inactive",
    segment: "regular",
    joinDate: "1402/09/11",
    orderCount: 2
  },
  {
    id: "C010",
    name: "نگار صادقی",
    email: "n.sadeghi@example.com",
    phone: "09130123456",
    totalPurchases: 42000000,
    lastPurchase: "1403/10/11",
    status: "active",
    segment: "premium",
    joinDate: "1402/04/07",
    orderCount: 21
  },
  {
    id: "C011",
    name: "مهدی رحیمی",
    email: "m.rahimi@example.com",
    phone: "09131234567",
    totalPurchases: 19000000,
    lastPurchase: "1403/10/09",
    status: "active",
    segment: "regular",
    joinDate: "1402/11/19",
    orderCount: 11
  },
  {
    id: "C012",
    name: "لیلا کاظمی",
    email: "l.kazemi@example.com",
    phone: "09132345678",
    totalPurchases: 56000000,
    lastPurchase: "1403/10/14",
    status: "vip",
    segment: "vip",
    joinDate: "1401/10/22",
    orderCount: 29
  },
  {
    id: "C013",
    name: "پوریا مرادی",
    email: "p.moradi@example.com",
    phone: "09133456789",
    totalPurchases: 7800000,
    lastPurchase: "1403/09/15",
    status: "active",
    segment: "regular",
    joinDate: "1403/03/08",
    orderCount: 4
  },
  {
    id: "C014",
    name: "الهام فتحی",
    email: "e.fathi@example.com",
    phone: "09134567890",
    totalPurchases: 38000000,
    lastPurchase: "1403/10/13",
    status: "active",
    segment: "premium",
    joinDate: "1402/06/14",
    orderCount: 19
  },
  {
    id: "C015",
    name: "بهروز شریفی",
    email: "b.sharifi@example.com",
    phone: "09135678901",
    totalPurchases: 4500000,
    lastPurchase: "1403/07/30",
    status: "inactive",
    segment: "regular",
    joinDate: "1402/10/05",
    orderCount: 3
  },
];

export const MOCK_CUSTOMER_SEGMENTS: CustomerSegmentData[] = [
  {
    segment: "مشتریان عادی",
    count: 8,
    percentage: 53,
    color: "#4A90E2"
  },
  {
    segment: "مشتریان ویژه",
    count: 4,
    percentage: 27,
    color: "#7B68EE"
  },
  {
    segment: "مشتریان VIP",
    count: 3,
    percentage: 20,
    color: "#FFD700"
  }
];
