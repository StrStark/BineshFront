// ==========================================
// COMMON TYPES
// ==========================================

export type DateString = string; // Format: "1403/10/15"
export type TimeString = string; // Format: "14:30"
export type DateTimeString = string; // Format: "1403/10/15 - 14:30"
export type CurrencyAmount = number; // In Tomans

// ==========================================
// SUPPORT & TICKETS
// ==========================================

export type TicketStatus = "resolved" | "in-progress" | "open";
export type TicketPriority = "high" | "medium" | "low";
export type MessageSender = "user" | "support";

export interface Message {
  sender: MessageSender;
  text: string;
  time: DateTimeString;
}

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  date: DateString;
  priority: TicketPriority;
  messages: Message[];
}

export interface SupportChannel {
  id: number;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
  contact: string;
  color: string;
  details: {
    label: string;
    value: string;
    copyable: boolean;
  }[];
}

// ==========================================
// PRODUCTS & INVENTORY
// ==========================================

export type ProductStatus = "critical" | "warning" | "normal" | "excellent";
export type ProductCategory = "furniture" | "lighting" | "decoration" | "textile";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  stock: number;
  minStock: number;
  maxStock: number;
  status: ProductStatus;
  daysInStock: number;
  price: CurrencyAmount;
  lastUpdate: DateString;
}

export interface InventoryItem {
  name: string;
  category: string;
  quantity: number;
  value: CurrencyAmount;
  status: "low" | "medium" | "high";
}

// ==========================================
// WAREHOUSE
// ==========================================

export interface WarehouseTransaction {
  date: DateString;
  in: number;
  out: number;
}

export interface FastMovingProduct {
  name: string;
  sales: number;
  trend: "up" | "down";
  change: number;
}

// ==========================================
// SALES
// ==========================================

export type SalesStatus = "completed" | "pending" | "cancelled";

export interface SaleTransaction {
  id: string;
  customerName: string;
  product: string;
  amount: CurrencyAmount;
  status: SalesStatus;
  date: DateString;
  time: TimeString;
}

export interface SalesOverview {
  totalSales: CurrencyAmount;
  totalOrders: number;
  averageOrderValue: CurrencyAmount;
  conversionRate: number;
}

export interface SalesChartData {
  month: string;
  sales: CurrencyAmount;
  target: CurrencyAmount;
}

export interface TopProduct {
  name: string;
  sales: CurrencyAmount;
  quantity: number;
  growth: number;
}

// ==========================================
// CUSTOMERS
// ==========================================

export type CustomerStatus = "active" | "inactive" | "vip";
export type CustomerSegment = "regular" | "premium" | "vip";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: CurrencyAmount;
  lastPurchase: DateString;
  status: CustomerStatus;
  segment: CustomerSegment;
  joinDate: DateString;
  orderCount: number;
}

export interface CustomerSegmentData {
  segment: string;
  count: number;
  percentage: number;
  color: string;
}

// ==========================================
// FINANCIAL
// ==========================================

export type TransactionType = "income" | "expense";
export type ExpenseCategory = 
  | "هزینه‌های پرسنلی"
  | "اجاره و تأسیسات"
  | "بازاریابی و تبلیغات"
  | "خرید کالا"
  | "حمل و نقل"
  | "نگهداری و تعمیرات"
  | "مالیات و بیمه"
  | "آموزش و توسعه"
  | "سایر هزینه‌ها";

export interface Transaction {
  id: string;
  date: DateString;
  description: string;
  amount: CurrencyAmount;
  type: TransactionType;
  category?: ExpenseCategory;
}

export interface ExpenseDetail {
  category: ExpenseCategory;
  currentMonth: CurrencyAmount;
  previousMonth: CurrencyAmount;
  change: number;
  percentage: number;
}

export interface FinancialSummary {
  totalIncome: CurrencyAmount;
  totalExpenses: CurrencyAmount;
  netProfit: CurrencyAmount;
  profitMargin: number;
}

export interface BalanceSheetItem {
  category: string;
  amount: CurrencyAmount;
  percentage: number;
  change: number;
}

export interface BalanceSheet {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: CurrencyAmount;
  totalLiabilities: CurrencyAmount;
  totalEquity: CurrencyAmount;
}

// ==========================================
// ANALYTICS & CHARTS
// ==========================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: DateString;
  value: number;
}

// ==========================================
// DASHBOARD
// ==========================================

export interface DashboardStats {
  totalRevenue: CurrencyAmount;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  activeCustomers: number;
  customersChange: number;
  conversionRate: number;
  conversionChange: number;
}

export interface RecentActivity {
  id: string;
  type: "sale" | "order" | "customer" | "product";
  message: string;
  time: TimeString;
  icon: string;
}

// ==========================================
// AI ASSISTANT
// ==========================================

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: DateTimeString;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}
