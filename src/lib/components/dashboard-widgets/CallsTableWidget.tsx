"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Phone, PhoneOff, PhoneIncoming, PhoneOutgoing, Clock } from "lucide-react";

export function CallsTableWidget() {
  const colors = useCurrentColors();

  // نمونه داده برای 5 تماس اخیر
  const recentCalls = [
    { id: 1, customer: "علی محمدی", agent: "سارا احمدی", type: "ورودی", status: "پاسخ داده شده", duration: "5:23", time: "10:30" },
    { id: 2, customer: "مریم رضایی", agent: "حسین کریمی", type: "خروجی", status: "پاسخ داده شده", duration: "3:15", time: "10:15" },
    { id: 3, customer: "رضا نوری", agent: "فاطمه حسینی", type: "ورودی", status: "از دست رفته", duration: "0:00", time: "10:05" },
    { id: 4, customer: "زهرا کاظمی", agent: "محمد رحیمی", type: "ورودی", status: "پاسخ داده شده", duration: "8:45", time: "09:50" },
    { id: 5, customer: "احمد موسوی", agent: "سارا احمدی", type: "خروجی", status: "پاسخ داده شده", duration: "2:30", time: "09:30" },
  ];

  const getStatusColor = (status: string) => {
    if (status === "پاسخ داده شده") return colors.success;
    if (status === "از دست رفته") return colors.error;
    return colors.warning;
  };

  const getTypeIcon = (type: string) => {
    if (type === "ورودی") return <PhoneIncoming className="w-3 h-3" />;
    return <PhoneOutgoing className="w-3 h-3" />;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th className="text-right py-2 px-2" style={{ color: colors.textSecondary }}>مشتری</th>
              <th className="text-right py-2 px-2" style={{ color: colors.textSecondary }}>کارشناس</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>نوع</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>وضعیت</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>مدت</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call) => (
              <tr 
                key={call.id}
                style={{ borderBottom: `1px solid ${colors.border}` }}
                className="hover:bg-opacity-5 transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primary}11`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td className="py-2 px-2" style={{ color: colors.textPrimary }}>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" style={{ color: colors.primary }} />
                    <span className="truncate">{call.customer}</span>
                  </div>
                </td>
                <td className="py-2 px-2" style={{ color: colors.textSecondary }}>
                  <span className="truncate">{call.agent}</span>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center" style={{ color: call.type === "ورودی" ? colors.success : colors.primary }}>
                    {getTypeIcon(call.type)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `${getStatusColor(call.status)}11`,
                      color: getStatusColor(call.status)
                    }}
                  >
                    {call.status === "از دست رفته" ? <PhoneOff className="w-2.5 h-2.5" /> : <Phone className="w-2.5 h-2.5" />}
                    <span>{call.status}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{call.duration}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
