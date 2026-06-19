"use client"

import { Clock, Package, AlertCircle } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

const orders = [
  { id: 1, invoice: "1408", customer: "آقای امیر نوری", status: "در انتظار تایید", priority: "high", time: "2 ساعت پیش" },
  { id: 2, invoice: "1407", customer: "خانم نگار رحیمی", status: "در حال بسته‌بندی", priority: "medium", time: "5 ساعت پیش" },
  { id: 3, invoice: "1406", customer: "آقای مهدی جعفری", status: "آماده ارسال", priority: "low", time: "1 روز پیش" },
  { id: 4, invoice: "1405", customer: "خانم زهرا صادقی", status: "در انتظار پرداخت", priority: "high", time: "3 ساعت پیش" },
];

export function PendingOrdersWidget() {
  const colors = useCurrentColors();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              سفارشات در انتظار
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              {orders.length} سفارش نیاز به پیگیری دارد
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.warning + "15" }}
          >
            <Clock className="w-5 h-5" style={{ color: colors.warning }} />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer group"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border
            }}
          >
            <div className="flex items-start gap-2">
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: getPriorityColor(order.priority) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    فاکتور {order.invoice}
                  </p>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {order.time}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  {order.customer}
                </p>
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: colors.primary + "15",
                    color: colors.primary
                  }}
                >
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-3 p-2 rounded-lg flex items-center gap-2"
        style={{ backgroundColor: colors.warning + "11" }}
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.warning }} />
        <p className="text-xs" style={{ color: colors.textPrimary }}>
          {orders.filter(o => o.priority === 'high').length} سفارش فوری نیاز به توجه دارد
        </p>
      </div>
    </div>
  );
}
