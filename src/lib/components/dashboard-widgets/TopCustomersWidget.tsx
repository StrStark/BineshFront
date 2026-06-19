"use client"

import { Users, Star, ShoppingBag } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

const customers = [
  { id: 1, name: "آقای جابر یوسفی", purchases: 15, revenue: 180000000, satisfaction: 4.8 },
  { id: 2, name: "خانم سارا کریمی", purchases: 12, revenue: 156000000, satisfaction: 4.9 },
  { id: 3, name: "آقای رضا احمدی", purchases: 10, revenue: 142000000, satisfaction: 4.7 },
  { id: 4, name: "خانم مریم حسینی", purchases: 9, revenue: 128000000, satisfaction: 4.6 },
  { id: 5, name: "آقای علی موسوی", purchases: 8, revenue: 115000000, satisfaction: 4.8 },
];

export function TopCustomersWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          مشتریان برتر
        </p>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          بر اساس حجم خرید
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {customers.map((customer, index) => (
          <div
            key={customer.id}
            className="p-3 rounded-lg border transition-all hover:shadow-md"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.primary + "15" }}
              >
                <span className="text-sm font-bold" style={{ color: colors.primary }}>
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {customer.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" style={{ color: colors.warning }} />
                    <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                      {customer.satisfaction}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    <span>{customer.purchases} خرید</span>
                  </div>
                  <span>•</span>
                  <span className="font-medium" style={{ color: colors.primary }}>
                    {customer.revenue.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-3 p-2 rounded-lg text-center"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          مجموع {customers.reduce((sum, c) => sum + c.purchases, 0)} خرید • {customers.reduce((sum, c) => sum + c.revenue, 0).toLocaleString('fa-IR')} تومان
        </p>
      </div>
    </div>
  );
}
