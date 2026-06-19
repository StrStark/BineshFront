import { Product, InventoryItem, FastMovingProduct, WarehouseTransaction } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  // Critical Products (4 items)
  {
    id: "P001",
    name: "مبل راحتی چرمی",
    category: "furniture",
    stock: 2,
    minStock: 5,
    maxStock: 20,
    status: "critical",
    daysInStock: 156,
    price: 25000000,
    lastUpdate: "1403/10/15"
  },
  {
    id: "P002",
    name: "میز ناهارخوری 6 نفره",
    category: "furniture",
    stock: 1,
    minStock: 4,
    maxStock: 15,
    status: "critical",
    daysInStock: 178,
    price: 18000000,
    lastUpdate: "1403/10/14"
  },
  {
    id: "P003",
    name: "کمد دیواری مدرن",
    category: "furniture",
    stock: 3,
    minStock: 6,
    maxStock: 18,
    status: "critical",
    daysInStock: 142,
    price: 32000000,
    lastUpdate: "1403/10/13"
  },
  {
    id: "P004",
    name: "لوستر کریستالی",
    category: "lighting",
    stock: 4,
    minStock: 8,
    maxStock: 25,
    status: "critical",
    daysInStock: 189,
    price: 15000000,
    lastUpdate: "1403/10/12"
  },

  // Warning Products (8 items)
  {
    id: "P005",
    name: "صندلی اداری چرخدار",
    category: "furniture",
    stock: 7,
    minStock: 10,
    maxStock: 30,
    status: "warning",
    daysInStock: 98,
    price: 4500000,
    lastUpdate: "1403/10/15"
  },
  {
    id: "P006",
    name: "آباژور رومیزی",
    category: "lighting",
    stock: 9,
    minStock: 12,
    maxStock: 35,
    status: "warning",
    daysInStock: 76,
    price: 2800000,
    lastUpdate: "1403/10/14"
  },
  {
    id: "P007",
    name: "فرش ماشینی 6 متری",
    category: "textile",
    stock: 6,
    minStock: 8,
    maxStock: 20,
    status: "warning",
    daysInStock: 112,
    price: 12000000,
    lastUpdate: "1403/10/13"
  },
  {
    id: "P008",
    name: "آینه دکوراتیو",
    category: "decoration",
    stock: 11,
    minStock: 15,
    maxStock: 40,
    status: "warning",
    daysInStock: 87,
    price: 3200000,
    lastUpdate: "1403/10/12"
  },
  {
    id: "P009",
    name: "کتابخانه چوبی",
    category: "furniture",
    stock: 8,
    minStock: 10,
    maxStock: 25,
    status: "warning",
    daysInStock: 104,
    price: 9500000,
    lastUpdate: "1403/10/11"
  },
  {
    id: "P010",
    name: "پرده مخمل دوخت",
    category: "textile",
    stock: 13,
    minStock: 18,
    maxStock: 50,
    status: "warning",
    daysInStock: 69,
    price: 5600000,
    lastUpdate: "1403/10/10"
  },
  {
    id: "P011",
    name: "گلدان سرامیکی",
    category: "decoration",
    stock: 16,
    minStock: 20,
    maxStock: 60,
    status: "warning",
    daysInStock: 54,
    price: 850000,
    lastUpdate: "1403/10/09"
  },
  {
    id: "P012",
    name: "چراغ خواب LED",
    category: "lighting",
    stock: 14,
    minStock: 18,
    maxStock: 45,
    status: "warning",
    daysInStock: 63,
    price: 1200000,
    lastUpdate: "1403/10/08"
  },

  // Normal Products (10 items)
  {
    id: "P013",
    name: "صندلی غذاخوری",
    category: "furniture",
    stock: 28,
    minStock: 20,
    maxStock: 60,
    status: "normal",
    daysInStock: 42,
    price: 3500000,
    lastUpdate: "1403/10/15"
  },
  {
    id: "P014",
    name: "میز جلو مبلی شیشه‌ای",
    category: "furniture",
    stock: 22,
    minStock: 15,
    maxStock: 45,
    status: "normal",
    daysInStock: 38,
    price: 6200000,
    lastUpdate: "1403/10/14"
  },
  {
    id: "P015",
    name: "تابلو نقاشی مدرن",
    category: "decoration",
    stock: 35,
    minStock: 25,
    maxStock: 70,
    status: "normal",
    daysInStock: 29,
    price: 4100000,
    lastUpdate: "1403/10/13"
  },
  {
    id: "P016",
    name: "کوسن کاناپه",
    category: "textile",
    stock: 48,
    minStock: 30,
    maxStock: 100,
    status: "normal",
    daysInStock: 18,
    price: 650000,
    lastUpdate: "1403/10/12"
  },
  {
    id: "P017",
    name: "سطل زباله استیل",
    category: "decoration",
    stock: 31,
    minStock: 25,
    maxStock: 75,
    status: "normal",
    daysInStock: 35,
    price: 890000,
    lastUpdate: "1403/10/11"
  },
  {
    id: "P018",
    name: "لامپ LED هوشمند",
    category: "lighting",
    stock: 41,
    minStock: 30,
    maxStock: 90,
    status: "normal",
    daysInStock: 24,
    price: 750000,
    lastUpdate: "1403/10/10"
  },
  {
    id: "P019",
    name: "جاکفشی 3 طبقه",
    category: "furniture",
    stock: 26,
    minStock: 20,
    maxStock: 50,
    status: "normal",
    daysInStock: 41,
    price: 2100000,
    lastUpdate: "1403/10/09"
  },
  {
    id: "P020",
    name: "ساعت دیواری چوبی",
    category: "decoration",
    stock: 33,
    minStock: 25,
    maxStock: 65,
    status: "normal",
    daysInStock: 31,
    price: 1850000,
    lastUpdate: "1403/10/08"
  },
  {
    id: "P021",
    name: "پادری فانتزی",
    category: "textile",
    stock: 52,
    minStock: 40,
    maxStock: 120,
    status: "normal",
    daysInStock: 16,
    price: 420000,
    lastUpdate: "1403/10/07"
  },
  {
    id: "P022",
    name: "چراغ سقفی مدرن",
    category: "lighting",
    stock: 29,
    minStock: 22,
    maxStock: 55,
    status: "normal",
    daysInStock: 37,
    price: 3800000,
    lastUpdate: "1403/10/06"
  },

  // Excellent Products (6 items)
  {
    id: "P023",
    name: "کاور مبل 3 نفره",
    category: "textile",
    stock: 64,
    minStock: 30,
    maxStock: 80,
    status: "excellent",
    daysInStock: 8,
    price: 2200000,
    lastUpdate: "1403/10/15"
  },
  {
    id: "P024",
    name: "زیرانداز سفره",
    category: "textile",
    stock: 72,
    minStock: 40,
    maxStock: 90,
    status: "excellent",
    daysInStock: 5,
    price: 350000,
    lastUpdate: "1403/10/14"
  },
  {
    id: "P025",
    name: "جا مدادی رومیزی",
    category: "decoration",
    stock: 88,
    minStock: 50,
    maxStock: 120,
    status: "excellent",
    daysInStock: 3,
    price: 280000,
    lastUpdate: "1403/10/13"
  },
  {
    id: "P026",
    name: "شمعدان شیشه‌ای",
    category: "decoration",
    stock: 76,
    minStock: 45,
    maxStock: 100,
    status: "excellent",
    daysInStock: 6,
    price: 620000,
    lastUpdate: "1403/10/12"
  },
  {
    id: "P027",
    name: "رومیزی گلدار",
    category: "textile",
    stock: 95,
    minStock: 60,
    maxStock: 150,
    status: "excellent",
    daysInStock: 2,
    price: 890000,
    lastUpdate: "1403/10/11"
  },
  {
    id: "P028",
    name: "جاکلیدی دیواری",
    category: "decoration",
    stock: 81,
    minStock: 50,
    maxStock: 110,
    status: "excellent",
    daysInStock: 4,
    price: 450000,
    lastUpdate: "1403/10/10"
  },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { name: "مبلمان اداری", category: "مبلمان", quantity: 156, value: 234000000, status: "high" },
  { name: "لوازم روشنایی", category: "لوستر و چراغ", quantity: 89, value: 125000000, status: "medium" },
  { name: "فرش و موکت", category: "کف‌پوش", quantity: 234, value: 456000000, status: "high" },
  { name: "پرده و کتان", category: "پارچه", quantity: 167, value: 178000000, status: "medium" },
  { name: "میز و صندلی", category: "مب��مان", quantity: 98, value: 298000000, status: "low" },
  { name: "لوازم دکوری", category: "دکوراسیون", quantity: 445, value: 89000000, status: "high" },
];

export const MOCK_WAREHOUSE_FLOW: WarehouseTransaction[] = [
  { date: "1403/09/01", in: 145, out: 89 },
  { date: "1403/09/08", in: 167, out: 112 },
  { date: "1403/09/15", in: 134, out: 98 },
  { date: "1403/09/22", in: 189, out: 134 },
  { date: "1403/09/29", in: 156, out: 145 },
  { date: "1403/10/06", in: 178, out: 156 },
  { date: "1403/10/13", in: 145, out: 123 },
];

export const MOCK_FAST_MOVING_PRODUCTS: FastMovingProduct[] = [
  { name: "مبل راحتی", sales: 245, trend: "up", change: 12.5 },
  { name: "میز ناهارخوری", sales: 189, trend: "up", change: 8.3 },
  { name: "کمد دیواری", sales: 167, trend: "down", change: -5.2 },
  { name: "صندلی اداری", sales: 156, trend: "up", change: 15.7 },
  { name: "لوستر سقفی", sales: 134, trend: "up", change: 6.8 },
];
