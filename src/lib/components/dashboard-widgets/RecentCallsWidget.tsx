"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";

const calls = [
  { id: 1, customer: "رضا احمدی", time: "10:45", type: "incoming", duration: "4:23", status: "completed" },
  { id: 2, customer: "سارا محمدی", time: "10:32", type: "outgoing", duration: "2:15", status: "completed" },
  { id: 3, customer: "علی کریمی", time: "10:18", type: "missed", duration: "-", status: "missed" },
  { id: 4, customer: "مریم رضایی", time: "10:05", type: "incoming", duration: "5:42", status: "completed" },
  { id: 5, customer: "حسین نوری", time: "09:51", type: "outgoing", duration: "1:33", status: "completed" },
];

export function RecentCallsWidget() {
  const colors = useCurrentColors();

  const getCallIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="w-3 h-3" style={{ color: colors.success }} />;
      case "outgoing":
        return <PhoneOutgoing className="w-3 h-3" style={{ color: colors.primary }} />;
      case "missed":
        return <PhoneMissed className="w-3 h-3" style={{ color: colors.error }} />;
      default:
        return <Phone className="w-3 h-3" style={{ color: colors.textSecondary }} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5" style={{ color: colors.primary }} />
        <h4 className="text-sm font-bold" style={{ color: colors.textPrimary }}>
          آخرین تماس‌ها
        </h4>
      </div>

      {/* Calls List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between p-2 rounded-lg transition-colors"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="flex items-center gap-2">
              {getCallIcon(call.type)}
              <div>
                <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                  {call.customer}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {call.time}
                </p>
              </div>
            </div>
            <span 
              className="text-xs px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: call.status === "missed" ? `${colors.error}11` : `${colors.success}11`,
                color: call.status === "missed" ? colors.error : colors.success
              }}
            >
              {call.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
