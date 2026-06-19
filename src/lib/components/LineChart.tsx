"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { hour: "12", value1: 20, value2: 18 },
  { hour: "13", value1: 25, value2: 22 },
  { hour: "14", value1: 23, value2: 20 },
  { hour: "15", value1: 30, value2: 25 },
  { hour: "16", value1: 28, value2: 24 },
  { hour: "17", value1: 35, value2: 30 },
  { hour: "18", value1: 32, value2: 28 },
  { hour: "19", value1: 38, value2: 33 },
  { hour: "20", value1: 42, value2: 36 },
  { hour: "21", value1: 40, value2: 35 },
  { hour: "22", value1: 35, value2: 30 },
  { hour: "23", value1: 30, value2: 25 },
  { hour: "24", value1: 25, value2: 20 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1a1f2e] p-3 border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg shadow-lg" dir="rtl">
        <p className="text-sm text-[#585757] dark:text-[#8b92a8] mb-2" dir="auto">
          ساعت {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function LineChart() {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-lg border border-[#d5d5d5] dark:border-[#2a3142] p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4" dir="rtl">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white dark:bg-[#252b3d] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg text-sm text-[#585757] dark:text-[#8b92a8] hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-colors">
            تاریخ شروع
          </button>
          <button className="px-3 py-1.5 bg-white dark:bg-[#252b3d] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg text-sm text-[#585757] dark:text-[#8b92a8] hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-colors">
            تاریخ پایان
          </button>
          <button className="px-3 py-1.5 bg-white dark:bg-[#252b3d] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg text-sm text-[#585757] dark:text-[#8b92a8] hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-colors">
            نوع نمودار
          </button>
        </div>
        <h3 className="text-lg font-semibold text-[#1c1c1c] dark:text-white" dir="auto">
          نمودار میانگین تماس‌ها در روزهای{" "}
        </h3>
      </div>
      <div style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height={300} minHeight={300}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis
              dataKey="hour"
              reversed
              tick={{ fill: "#585757", fontSize: 12 }}
              axisLine={{ stroke: "#e8e8e8" }}
            />
            <YAxis
              tick={{ fill: "#585757", fontSize: 12 }}
              axisLine={{ stroke: "#e8e8e8" }}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
              label={{
                value: "تعداد تماس",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#585757", fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ direction: "rtl" }}
              formatter={(value) => (
                <span className="text-sm text-[#585757]">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="value1"
              stroke="#f59e0b"
              strokeWidth={2}
              name="روز جاری"
              dot={{ fill: "#f59e0b", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="value2"
              stroke="#3b82f6"
              strokeWidth={2}
              name="روز قبل"
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}