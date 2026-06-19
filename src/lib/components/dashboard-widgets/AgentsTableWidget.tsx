"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { User, Phone, Clock } from "lucide-react";

export function AgentsTableWidget() {
  const colors = useCurrentColors();

  // نمونه داده برای کارشناسان
  const agents = [
    { id: 1, name: "سارا احمدی", status: "آنلاین", calls: 45, avgTime: "4:30" },
    { id: 2, name: "حسین کریمی", status: "در حال تماس", calls: 38, avgTime: "5:15" },
    { id: 3, name: "فاطمه حسینی", status: "آنلاین", calls: 42, avgTime: "3:45" },
    { id: 4, name: "محمد رحیمی", status: "استراحت", calls: 35, avgTime: "4:50" },
    { id: 5, name: "مریم نوری", status: "آنلاین", calls: 40, avgTime: "4:20" },
  ];

  const getStatusColor = (status: string) => {
    if (status === "آنلاین") return colors.success;
    if (status === "در حال تماس") return colors.primary;
    if (status === "استراحت") return colors.warning;
    return colors.textSecondary;
  };

  const getStatusDot = (status: string) => {
    return (
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: getStatusColor(status) }}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th className="text-right py-2 px-2" style={{ color: colors.textSecondary }}>کارشناس</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>وضعیت</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>تماس‌ها</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>میانگین</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr 
                key={agent.id}
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
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3" style={{ color: colors.primary }} />
                    <span className="truncate font-medium">{agent.name}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {getStatusDot(agent.status)}
                    <span style={{ color: getStatusColor(agent.status) }}>{agent.status}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center" style={{ color: colors.textPrimary }}>
                  <div className="flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" style={{ color: colors.primary }} />
                    <span className="font-medium">{agent.calls}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{agent.avgTime}</span>
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