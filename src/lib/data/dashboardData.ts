import { DashboardStats, RecentActivity } from "./types";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 450000000,
  revenueChange: 12.5,
  totalOrders: 1248,
  ordersChange: 8.3,
  activeCustomers: 856,
  customersChange: 15.2,
  conversionRate: 3.8,
  conversionChange: 0.5
};

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "A001",
    type: "sale",
    message: "فروش مبل راحتی - 25,000,000 تومان",
    time: "14:30",
    icon: "TrendingUp"
  },
  {
    id: "A002",
    type: "order",
    message: "سفارش جدید از محمد احمدی",
    time: "13:45",
    icon: "ShoppingCart"
  },
  {
    id: "A003",
    type: "customer",
    message: "مشتری جدید: فاطمه حسینی",
    time: "12:20",
    icon: "UserPlus"
  },
  {
    id: "A004",
    type: "product",
    message: "موجودی میز ناهارخوری کم شده",
    time: "11:15",
    icon: "Package"
  },
  {
    id: "A005",
    type: "sale",
    message: "فروش کمد دیواری - 32,000,000 تومان",
    time: "10:30",
    icon: "TrendingUp"
  }
];
