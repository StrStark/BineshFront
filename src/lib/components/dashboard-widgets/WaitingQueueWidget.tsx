"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Clock, Phone } from "lucide-react";

const queue = [
  { id: 1, customer: "محمد رضایی", waiting: "2:34", priority: "high" },
  { id: 2, customer: "زهرا احمدی", waiting: "1:45", priority: "normal" },
  { id: 3, customer: "علی محمدی", waiting: "0:52", priority: "normal" },
  { id: 4, customer: "فاطمه کریمی", waiting: "3:12", priority: "high" },
];

export function WaitingQueueWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.warning}11` }}
        >
          <Clock className="w-6 h-6" style={{ color: colors.warning }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{queue.length}</p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>در انتظار</p>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {queue.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-lg border"
            style={{ 
              backgroundColor: colors.backgroundSecondary,
              borderColor: item.priority === "high" ? colors.error : colors.border,
              borderWidth: item.priority === "high" ? "2px" : "1px"
            }}
          >
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-xs" style={{ color: colors.textPrimary }}>
                {item.customer}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: colors.warning }} />
              <span className="text-xs" style={{ color: colors.warning }}>
                {item.waiting}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
