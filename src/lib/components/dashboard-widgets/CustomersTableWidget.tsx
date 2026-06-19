"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Users, Phone, Calendar } from "lucide-react";

export function CustomersTableWidget() {
  const colors = useCurrentColors();

  // نمونه داده برای مشتریان
  const customers = [
    { id: 1, name: "علی محمدی", phone: "09121234567", calls: 12, lastCall: "امروز" },
    { id: 2, name: "مریم رضایی", phone: "09351234567", calls: 8, lastCall: "دیروز" },
    { id: 3, name: "رضا نوری", phone: "09191234567", calls: 15, lastCall: "امروز" },
    { id: 4, name: "زهرا کاظمی", phone: "09381234567", calls: 6, lastCall: "2 روز پیش" },
    { id: 5, name: "احمد موسوی", phone: "09171234567", calls: 10, lastCall: "دیروز" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th className="text-right py-2 px-2" style={{ color: colors.textSecondary }}>مشتری</th>
              <th className="text-right py-2 px-2" style={{ color: colors.textSecondary }}>شماره تماس</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>تماس‌ها</th>
              <th className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>آخرین تماس</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr 
                key={customer.id}
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
                    <Users className="w-3 h-3" style={{ color: colors.primary }} />
                    <span className="truncate font-medium">{customer.name}</span>
                  </div>
                </td>
                <td className="py-2 px-2" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center gap-1" dir="ltr">
                    <Phone className="w-3 h-3" />
                    <span className="font-mono">{customer.phone}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${colors.primary}11`,
                      color: colors.primary
                    }}
                  >
                    <Phone className="w-2.5 h-2.5" />
                    <span className="font-medium">{customer.calls}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{customer.lastCall}</span>
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