"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "پاسخ توسط مشتری", value: 30, change: "+3%" },
  { name: "پاسخ توسط کارشناس فروش", value: 25, change: "" },
  { name: "رد توسط مشتری", value: 15, change: "-3%" },
  { name: "رد توسط کارشناس فروش", value: 10, change: "-3%" },
  { name: "عدم پاسخ مشتری", value: 10, change: "" },
  { name: "عدم پاسخ کارشناس", value: 10, change: "" },
];

const COLORS = [
  "#14b8a6",
  "#3b82f6",
  "#f59e0b",
  "#facc15",
  "#ec4863",
  "#ec4899",
];

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6" dir="rtl">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-start gap-2">
          <div className="flex flex-col items-end gap-1 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-base font-semibold"
                style={{ color: entry.color }}
              >
                {entry.payload.value}%
              </span>
              {entry.payload.change && (
                <span
                  className={`text-xs px-2 py-0.5 rounded text-white ${
                    entry.payload.change.startsWith("+")
                      ? "bg-[#14b8a6]"
                      : "bg-[#ff8282]"
                  }`}
                >
                  {entry.payload.change}
                </span>
              )}
            </div>
            <span className="text-sm text-[#333] dark:text-[#b8bfc8]" dir="auto">
              {entry.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export function DonutChart() {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-lg border border-[#d5d5d5] dark:border-[#2a3142] p-6 h-full flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-semibold text-[#1c1c1c] dark:text-white mb-4 text-right" dir="auto">
        نمودار وضعیت تماس‌ها
      </h3>
      <div className="flex-1 flex flex-col justify-center" style={{ minHeight: '280px' }}>
        <ResponsiveContainer width="100%" height={280} minHeight={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-[#0a0a0a] dark:text-white">100</p>
          <p className="text-sm text-black dark:text-[#b8bfc8]" dir="auto">
            تعداد کل تماس‌ها
          </p>
        </div>
      </div>
    </div>
  );
}