"use client"

import { DonutChart, BarChart, LineChart, AreaChart, PieChart } from "./index";

// Example component showing how to use all charts
export function ChartExamples() {
  // Sample data for DonutChart
  const donutData = [
    { name: "فروش محصول A", value: 4500, color: "#0085ff" },
    { name: "فروش محصول B", value: 3200, color: "#00c2ff" },
    { name: "فروش محصول C", value: 2800, color: "#4ade80" },
    { name: "فروش محصول D", value: 1900, color: "#fbbf24" },
  ];

  // Sample data for BarChart
  const barData = [
    { name: "فروردین", value: 12000 },
    { name: "اردیبهشت", value: 15000 },
    { name: "خرداد", value: 18000 },
    { name: "تیر", value: 14000 },
    { name: "مرداد", value: 20000 },
    { name: "شهریور", value: 17000 },
  ];

  // Sample data for colored BarChart
  const coloredBarData = [
    { name: "دسته ۱", value: 4000, color: "#0085ff" },
    { name: "دسته ۲", value: 3000, color: "#4ade80" },
    { name: "دسته ۳", value: 2000, color: "#fbbf24" },
    { name: "دسته ۴", value: 2780, color: "#f87171" },
    { name: "دسته ۵", value: 1890, color: "#a78bfa" },
  ];

  // Sample data for LineChart
  const lineData = [
    { name: "هفته ۱", فروش: 4000, سود: 2400 },
    { name: "هفته ۲", فروش: 3000, سود: 1398 },
    { name: "هفته ۳", فروش: 2000, سود: 9800 },
    { name: "هفته ۴", فروش: 2780, سود: 3908 },
    { name: "هفته ۵", فروش: 1890, سود: 4800 },
    { name: "هفته ۶", فروش: 2390, سود: 3800 },
  ];

  const lineSeries = [
    { dataKey: "فروش", color: "#0085ff", name: "فروش" },
    { dataKey: "سود", color: "#4ade80", name: "سود" },
  ];

  // Sample data for AreaChart
  const areaData = [
    { name: "شنبه", بازدید: 4000, تبدیل: 2400, فروش: 2400 },
    { name: "یکشنبه", بازدید: 3000, تبدیل: 1398, فروش: 2210 },
    { name: "دوشنبه", بازدید: 2000, تبدیل: 9800, فروش: 2290 },
    { name: "سه‌شنبه", بازدید: 2780, تبدیل: 3908, فروش: 2000 },
    { name: "چهارشنبه", بازدید: 1890, تبدیل: 4800, فروش: 2181 },
    { name: "پنجشنبه", بازدید: 2390, تبدیل: 3800, فروش: 2500 },
  ];

  const areaSeries = [
    { dataKey: "بازدید", color: "#0085ff", name: "بازدید" },
    { dataKey: "تبدیل", color: "#4ade80", name: "تبدیل" },
    { dataKey: "فروش", color: "#fbbf24", name: "فروش" },
  ];

  // Sample data for PieChart
  const pieData = [
    { name: "تهران", value: 35000 },
    { name: "مشهد", value: 25000 },
    { name: "اصفهان", value: 18000 },
    { name: "شیراز", value: 15000 },
    { name: "تبریز", value: 12000 },
    { name: "سایر", value: 8000 },
  ];

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <h1 className="text-2xl font-bold text-[#0e1526] dark:text-white mb-6">
        نمونه چارت‌های هوشمند
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DonutChart Example */}
        <DonutChart
          title="توزیع فروش محصولات"
          data={donutData}
          showLegend
          showTooltip
          height={300}
        />

        {/* PieChart Example */}
        <PieChart
          title="فروش بر اساس شهر"
          data={pieData}
          showLegend
          showTooltip
          showPercentage
          interactive
          height={350}
        />

        {/* BarChart Example */}
        <BarChart
          title="فروش ماهانه"
          data={barData}
          showGrid
          showTooltip
          height={350}
          yAxisLabel="مبلغ (تومان)"
        />

        {/* Colored BarChart Example */}
        <BarChart
          title="فروش بر اساس دسته‌بندی"
          data={coloredBarData}
          showGrid
          showTooltip
          horizontal
          height={350}
        />

        {/* LineChart Example */}
        <LineChart
          title="روند فروش و سود هفتگی"
          data={lineData}
          series={lineSeries}
          showGrid
          showLegend
          showTooltip
          showDots
          smooth
          height={350}
        />

        {/* AreaChart Example */}
        <AreaChart
          title="تحلیل قیف فروش روزانه"
          data={areaData}
          series={areaSeries}
          showGrid
          showLegend
          showTooltip
          smooth
          stacked={false}
          height={350}
        />
      </div>
    </div>
  );
}
