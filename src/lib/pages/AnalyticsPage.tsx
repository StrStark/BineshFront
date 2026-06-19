"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from "recharts";
import { TrendingUp, TrendingDown, Activity, Target, Users, Clock, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Award, AlertCircle, CheckCircle2, Timer, Zap, Star, BarChart3 } from "lucide-react";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { DateRangePicker } from "../components/DateRangePicker";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";

// داده‌های شاخص‌های کلیدی با جزئیات بیشتر
const kpiData = {
  totalCalls: { value: 2847, change: 15.3, target: 2500, previous: 2467 },
  answerRate: { value: 94.2, change: 5.8, target: 90, previous: 89.1 },
  avgHandleTime: { value: 4.23, change: -8.2, target: 5, previous: 4.61 },
  customerSatisfaction: { value: 4.7, change: 6.8, target: 4.5, previous: 4.4 },
  firstCallResolution: { value: 87.5, change: 12.1, target: 85, previous: 78.1 },
  missedCalls: { value: 165, change: -22.4, target: 200, previous: 213 },
  avgWaitTime: { value: 1.45, change: -15.2, target: 2, previous: 1.71 },
  peakHourLoad: { value: 425, change: 8.9, target: 400, previous: 390 },
};

// داده‌های روند هفتگی پیشرفته
const weeklyTrendData = [
  { 
    day: "شنبه", 
    incoming: 378, 
    outgoing: 142, 
    answered: 356, 
    missed: 22,
    avgTime: 4.2,
    satisfaction: 4.6
  },
  { 
    day: "یکشنبه", 
    incoming: 412, 
    outgoing: 156, 
    answered: 389, 
    missed: 23,
    avgTime: 4.5,
    satisfaction: 4.7
  },
  { 
    day: "دوشنبه", 
    incoming: 445, 
    outgoing: 178, 
    answered: 418, 
    missed: 27,
    avgTime: 4.1,
    satisfaction: 4.8
  },
  { 
    day: "سه‌شنبه", 
    incoming: 398, 
    outgoing: 145, 
    answered: 375, 
    missed: 23,
    avgTime: 4.3,
    satisfaction: 4.6
  },
  { 
    day: "چهارشنبه", 
    incoming: 465, 
    outgoing: 189, 
    answered: 440, 
    missed: 25,
    avgTime: 4.0,
    satisfaction: 4.9
  },
  { 
    day: "پنج‌شنبه", 
    incoming: 389, 
    outgoing: 134, 
    answered: 368, 
    missed: 21,
    avgTime: 4.4,
    satisfaction: 4.7
  },
  { 
    day: "جمعه", 
    incoming: 360, 
    outgoing: 128, 
    answered: 341, 
    missed: 19,
    avgTime: 4.2,
    satisfaction: 4.8
  },
];

// داده‌های توزیع ساعتی با جزئیات
const hourlyDistribution = [
  { hour: "08", calls: 145, answered: 138, avgWait: 1.2, satisfaction: 4.5 },
  { hour: "09", calls: 234, answered: 221, avgWait: 1.5, satisfaction: 4.6 },
  { hour: "10", calls: 312, answered: 295, avgWait: 1.8, satisfaction: 4.7 },
  { hour: "11", calls: 385, answered: 362, avgWait: 2.1, satisfaction: 4.6 },
  { hour: "12", calls: 298, answered: 278, avgWait: 1.9, satisfaction: 4.5 },
  { hour: "13", calls: 245, answered: 232, avgWait: 1.6, satisfaction: 4.6 },
  { hour: "14", calls: 356, answered: 337, avgWait: 1.7, satisfaction: 4.8 },
  { hour: "15", calls: 412, answered: 389, avgWait: 2.0, satisfaction: 4.7 },
  { hour: "16", calls: 425, answered: 401, avgWait: 2.2, satisfaction: 4.6 },
  { hour: "17", calls: 367, answered: 348, avgWait: 1.9, satisfaction: 4.7 },
  { hour: "18", calls: 278, answered: 263, avgWait: 1.5, satisfaction: 4.8 },
  { hour: "19", calls: 189, answered: 179, avgWait: 1.3, satisfaction: 4.6 },
];

// داده‌های عملکرد کارشناسان با رتبه‌بندی
const agentPerformance = [
  { 
    name: "سارا محمدی", 
    calls: 289, 
    answered: 278, 
    avgTime: 3.8, 
    satisfaction: 4.9,
    fcr: 92.5,
    rank: 1
  },
  { 
    name: "رضا احمدی", 
    calls: 267, 
    answered: 256, 
    avgTime: 4.1, 
    satisfaction: 4.8,
    fcr: 89.3,
    rank: 2
  },
  { 
    name: "مریم کریمی", 
    calls: 245, 
    answered: 234, 
    avgTime: 4.3, 
    satisfaction: 4.7,
    fcr: 87.8,
    rank: 3
  },
  { 
    name: "علی نوری", 
    calls: 223, 
    answered: 210, 
    avgTime: 4.5, 
    satisfaction: 4.6,
    fcr: 85.2,
    rank: 4
  },
  { 
    name: "فاطمه رضایی", 
    calls: 201, 
    answered: 189, 
    avgTime: 4.8, 
    satisfaction: 4.5,
    fcr: 82.7,
    rank: 5
  },
];

// داده‌های نوع تماس با اولویت
const callTypeData = [
  { name: "پشتیبانی فنی", value: 987, priority: "بالا", avgTime: 6.2, color: "#0085ff" },
  { name: "فروش و بازاریابی", value: 654, priority: "متوسط", avgTime: 5.1, color: "#00c853" },
  { name: "شکایات و انتقادات", value: 421, priority: "بالا", avgTime: 7.8, color: "#e92c2c" },
  { name: "مشاوره و راهنمایی", value: 512, priority: "متوسط", avgTime: 4.5, color: "#9c27b0" },
  { name: "پیگیری سفارش", value: 273, priority: "پایین", avgTime: 3.2, color: "#ff9800" },
];

// داده‌های زمان پاسخگویی
const responseTimeData = [
  { range: "< 30 ثانیه", count: 1245, percentage: 43.7, status: "عالی" },
  { range: "30-60 ثانیه", count: 892, percentage: 31.3, status: "خوب" },
  { range: "1-2 دقیقه", count: 456, percentage: 16.0, status: "متوسط" },
  { range: "2-5 دقیقه", count: 189, percentage: 6.6, status: "ضعیف" },
  { range: "> 5 دقیقه", count: 65, percentage: 2.3, status: "بحرانی" },
];

// داده‌های رضایت مشتری ماهانه
const satisfactionTrend = [
  { month: "فروردین", score: 4.3, trend: 0 },
  { month: "اردیبهشت", score: 4.5, trend: 4.6 },
  { month: "خرداد", score: 4.6, trend: 2.2 },
  { month: "تیر", score: 4.7, trend: 2.1 },
];

// داده‌های عملکرد بر اساس کانال
const channelPerformance = [
  { channel: "تلفن", calls: 1567, satisfaction: 4.7, avgTime: 4.2 },
  { channel: "ایمیل", calls: 623, satisfaction: 4.5, avgTime: 12.5 },
  { channel: "چت", calls: 456, satisfaction: 4.8, avgTime: 3.8 },
  { channel: "شبکه اجتماعی", calls: 201, satisfaction: 4.6, avgTime: 5.3 },
];

// داده‌های Radar برای تحلیل جامع
const radarData = [
  { metric: "پاسخگویی", value: 94.2, fullMark: 100 },
  { metric: "رضایت", value: 94.0, fullMark: 100 },
  { metric: "سرعت", value: 84.6, fullMark: 100 },
  { metric: "حل مشکل", value: 87.5, fullMark: 100 },
  { metric: "کیفیت", value: 91.2, fullMark: 100 },
];

export function AnalyticsPage() {
  const colors = useCurrentColors();
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("week");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  
  // تابع محاسبه تعداد روزها در بازه زمانی
  const getDaysInRange = (start: Date | null, end: Date | null): number => {
    if (!start || !end) return 7; // پیش‌فرض: یک هفته
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // +1 برای شامل شدن روز آخر
  };

  // تابع تولید داده بر اساس دوره و بازه زمانی
  const generateDataByPeriod = useMemo(() => {
    const daysInRange = getDaysInRange(dateRange.start, dateRange.end);
    
    // محاسبه ضریب بر اساس تعداد روزها
    let multiplier: number;
    if (selectedPeriod === "day") {
      multiplier = 0.14;
    } else if (selectedPeriod === "week") {
      multiplier = 1;
    } else {
      multiplier = 4.3;
    }

    // اگر بازه زمانی انتخاب شده، از آن استفاده کن
    if (dateRange.start && dateRange.end) {
      multiplier = daysInRange / 7; // نرمال‌سازی به یک هفته
    }

    const variance = selectedPeriod === "day" ? 0.8 : selectedPeriod === "week" ? 1 : 1.2;

    return {
      kpi: {
        totalCalls: {
          value: Math.round(kpiData.totalCalls.value * multiplier),
          change: kpiData.totalCalls.change * variance,
          target: Math.round(kpiData.totalCalls.target * multiplier),
          previous: Math.round(kpiData.totalCalls.previous * multiplier),
        },
        answerRate: kpiData.answerRate,
        avgHandleTime: {
          ...kpiData.avgHandleTime,
          value: Number((kpiData.avgHandleTime.value * (selectedPeriod === "day" ? 0.95 : selectedPeriod === "week" ? 1 : 1.05)).toFixed(2)),
        },
        customerSatisfaction: {
          ...kpiData.customerSatisfaction,
          value: Number((kpiData.customerSatisfaction.value * (selectedPeriod === "day" ? 0.98 : selectedPeriod === "week" ? 1 : 1.02)).toFixed(1)),
        },
        firstCallResolution: {
          ...kpiData.firstCallResolution,
          value: Number((kpiData.firstCallResolution.value * (selectedPeriod === "day" ? 0.95 : selectedPeriod === "week" ? 1 : 1.03)).toFixed(1)),
        },
        missedCalls: {
          value: Math.round(kpiData.missedCalls.value * multiplier),
          change: kpiData.missedCalls.change,
          target: Math.round(kpiData.missedCalls.target * multiplier),
          previous: Math.round(kpiData.missedCalls.previous * multiplier),
        },
        avgWaitTime: {
          ...kpiData.avgWaitTime,
          value: Number((kpiData.avgWaitTime.value * (selectedPeriod === "day" ? 0.9 : selectedPeriod === "week" ? 1 : 1.1)).toFixed(2)),
        },
        peakHourLoad: {
          value: Math.round(kpiData.peakHourLoad.value * (selectedPeriod === "day" ? 1 : selectedPeriod === "week" ? 1 : 0.85)),
          change: kpiData.peakHourLoad.change,
          target: Math.round(kpiData.peakHourLoad.target * (selectedPeriod === "day" ? 1 : selectedPeriod === "week" ? 1 : 0.85)),
          previous: Math.round(kpiData.peakHourLoad.previous * (selectedPeriod === "day" ? 1 : selectedPeriod === "week" ? 1 : 0.85)),
        },
      },
    };
  }, [selectedPeriod, dateRange]);

  const currentKpi = generateDataByPeriod.kpi;

  // Helper function for trend badge
  const TrendBadge = ({ value }: { value: number }) => {
    const isPositive = value > 0;
    return (
      <div 
        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
        style={{ 
          backgroundColor: isPositive ? `${colors.success}11` : `${colors.error}11`,
          color: isPositive ? colors.success : colors.error
        }}
      >
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  // Prepare report sections
  const reportSections: ReportSection[] = [
    {
      title: "شاخص‌های کلیدی عملکرد (KPI)",
      data: [
        { "شاخص": "کل تماس‌ها", "مقدار": String(currentKpi.totalCalls.value), "تغییر": `+${currentKpi.totalCalls.change}%` },
        { "شاخص": "نرخ پاسخگویی", "مقدار": `${currentKpi.answerRate.value}%`, "تغییر": `+${currentKpi.answerRate.change}%` },
        { "شاخص": "میانگین زمان رسیدگی", "مقدار": `${currentKpi.avgHandleTime.value} دقیقه`, "تغییر": `${currentKpi.avgHandleTime.change}%` },
        { "شاخص": "رضایت مشتری", "مقدار": String(currentKpi.customerSatisfaction.value), "تغییر": `+${currentKpi.customerSatisfaction.change}%` },
      ],
      headers: ["شاخص", "مقدار", "تغییر"]
    },
    {
      title: "عملکرد کارشناسان",
      data: agentPerformance.map(agent => ({
        "رتبه": String(agent.rank),
        "نام": agent.name,
        "تماس‌ها": String(agent.calls),
        "پاسخ داده": String(agent.answered),
        "میانگین زمان": `${agent.avgTime} دقیقه`,
        "رضایت": String(agent.satisfaction),
        "FCR": `${agent.fcr}%`
      })),
      headers: ["رتبه", "نام", "تماس‌ها", "پاسخ داده", "میانگین زمان", "رضایت", "FCR"]
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            تحلیل داده و گزارش‌های پیشرفته
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            تحلیل جامع عملکرد، روندها و شاخص‌های کلیدی مرکز تماس
          </p>
          {/* Date Range Indicator */}
          {dateRange.start && dateRange.end && (
            <div className="flex items-center gap-2 mt-2">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ 
                  backgroundColor: `${colors.primary}11`,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}33`
                }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  بازه انتخاب شده: {getDaysInRange(dateRange.start, dateRange.end)} روز
                  ({dateRange.start.toLocaleDateString('fa-IR')} - {dateRange.end.toLocaleDateString('fa-IR')})
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Period Selector - Full width (spans 2 columns) */}
          <div 
            className="col-span-2 flex items-center gap-1 p-1 rounded-lg border overflow-x-auto scrollbar-hide"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          >
            {([
              { value: "day", label: "روزانه" },
              { value: "week", label: "هفتگی" },
              { value: "month", label: "ماهانه" },
              { value: "year", label: "سالانه" }
            ] as const).map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className="px-3 md:px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap flex-1"
                style={{
                  backgroundColor: selectedPeriod === period.value ? colors.primary : "transparent",
                  color: selectedPeriod === period.value ? "#ffffff" : colors.textSecondary,
                  fontWeight: selectedPeriod === period.value ? "600" : "400"
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          {/* DateRangePicker - Half width (1 column) */}
           <DateRangePicker onChange={(range) => setDateRange({ start: range.from || new Date(), end: range.to || new Date() })} />
          
          {/* ReportDownload - Half width (1 column) */}
          <ReportDownload sections={reportSections} fileName="گزارش-تحلیل-پیشرفته" />
        </div>
      </div>

      {/* Main KPIs Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Calls */}
        <div 
          className="rounded-xl border p-5 transition-all hover:shadow-lg"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}11` }}
            >
              <Phone className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <TrendBadge value={currentKpi.totalCalls.change} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            {currentKpi.totalCalls.value.toLocaleString()}
          </p>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            مجموع تماس‌ها
          </p>
          <div className="flex items-center justify-between text-xs" style={{ color: colors.textTertiary }}>
            <span>قبلی: {currentKpi.totalCalls.previous.toLocaleString()}</span>
            <span>هدف: {currentKpi.totalCalls.target.toLocaleString()}</span>
          </div>
        </div>

        {/* Answer Rate */}
        <div 
          className="rounded-xl border p-5 transition-all hover:shadow-lg"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.success}11` }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: colors.success }} />
            </div>
            <TrendBadge value={currentKpi.answerRate.change} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            {currentKpi.answerRate.value}%
          </p>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            نرخ پاسخگویی
          </p>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.border }}>
            <div 
              className="h-2 rounded-full transition-all"
              style={{ width: `${currentKpi.answerRate.value}%`, backgroundColor: colors.success }}
            />
          </div>
        </div>

        {/* Avg Handle Time */}
        <div 
          className="rounded-xl border p-5 transition-all hover:shadow-lg"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.warning}11` }}
            >
              <Timer className="w-6 h-6" style={{ color: colors.warning }} />
            </div>
            <TrendBadge value={currentKpi.avgHandleTime.change} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            {currentKpi.avgHandleTime.value} دقیقه
          </p>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            میانگین زمان رسیدگی
          </p>
          <div className="flex items-center justify-between text-xs" style={{ color: colors.textTertiary }}>
            <span>قبلی: {currentKpi.avgHandleTime.previous}</span>
            <span>هدف: {currentKpi.avgHandleTime.target}</span>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div 
          className="rounded-xl border p-5 transition-all hover:shadow-lg"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.warning}11` }}
            >
              <Star className="w-6 h-6" fill={colors.warning} stroke={colors.warning} />
            </div>
            <TrendBadge value={currentKpi.customerSatisfaction.change} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            {currentKpi.customerSatisfaction.value} / 5
          </p>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            رضایت مشتری
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className="w-4 h-4"
                fill={star <= Math.round(currentKpi.customerSatisfaction.value) ? colors.warning : "none"}
                stroke={colors.warning}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Secondary KPIs Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FCR */}
        <div 
          className="rounded-lg border p-4"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                حل در اولین تماس
              </span>
            </div>
            <TrendBadge value={currentKpi.firstCallResolution.change} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {currentKpi.firstCallResolution.value}%
          </p>
        </div>

        {/* Missed Calls */}
        <div 
          className="rounded-lg border p-4"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PhoneMissed className="w-5 h-5" style={{ color: colors.error }} />
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                تماس‌های از دست رفته
              </span>
            </div>
            <TrendBadge value={currentKpi.missedCalls.change} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {currentKpi.missedCalls.value}
          </p>
        </div>

        {/* Avg Wait Time */}
        <div 
          className="rounded-lg border p-4"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: colors.warning }} />
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                متوسط زمان انتظار
              </span>
            </div>
            <TrendBadge value={currentKpi.avgWaitTime.change} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {currentKpi.avgWaitTime.value} دقیقه
          </p>
        </div>

        {/* Peak Hour Load */}
        <div 
          className="rounded-lg border p-4"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                بار اوج ساعت
              </span>
            </div>
            <TrendBadge value={currentKpi.peakHourLoad.change} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {currentKpi.peakHourLoad.value}
          </p>
        </div>
      </div>

      {/* Charts Row 1: Weekly Trend & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend - 2 columns */}
        <div 
          className="lg:col-span-2 rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              روند هفتگی تماس‌ها
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.primary }} />
                <span style={{ color: colors.textSecondary }}>ورودی</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.success }} />
                <span style={{ color: colors.textSecondary }}>پاسخ داده</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.error }} />
                <span style={{ color: colors.textSecondary }}>از دست رفته</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320} minHeight={320}>
            <ComposedChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: colors.textSecondary, fontSize: 12 }}
                stroke={colors.border}
              />
              <YAxis 
                tick={{ fill: colors.textSecondary, fontSize: 12 }}
                stroke={colors.border}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  color: colors.textPrimary,
                }}
              />
              <Bar dataKey="incoming" fill={colors.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="answered" fill={colors.success} radius={[4, 4, 0, 0]} />
              <Line 
                type="monotone" 
                dataKey="missed" 
                stroke={colors.error} 
                strokeWidth={3}
                dot={{ fill: colors.error, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart - 1 column */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            تحلیل جامع عملکرد
          </h3>
          <ResponsiveContainer width="100%" height={320} minHeight={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={colors.border} />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: colors.textSecondary, fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: colors.textSecondary, fontSize: 10 }}
              />
              <Radar 
                name="عملکرد" 
                dataKey="value" 
                stroke={colors.primary} 
                fill={colors.primary} 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Hourly Distribution & Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            توزیع ساعتی تماس‌ها
          </h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <AreaChart data={hourlyDistribution}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis 
                dataKey="hour" 
                tick={{ fill: colors.textSecondary, fontSize: 11 }}
                stroke={colors.border}
              />
              <YAxis 
                tick={{ fill: colors.textSecondary, fontSize: 11 }}
                stroke={colors.border}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                }}
              />
              <Area 
                type="monotone" 
                dataKey="calls" 
                stroke={colors.primary}
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCalls)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            رتبه‌بندی کارشناسان برتر
          </h3>
          <div className="space-y-3">
            {agentPerformance.map((agent, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                  style={{ 
                    backgroundColor: index === 0 ? colors.warning : `${colors.primary}11`,
                    color: index === 0 ? "#ffffff" : colors.primary
                  }}
                >
                  {agent.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {agent.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      {agent.calls} تماس
                    </span>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      •
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: colors.warning }}>
                      <Star className="w-3 h-3" fill={colors.warning} stroke="none" />
                      {agent.satisfaction}
                    </span>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      •
                    </span>
                    <span className="text-xs" style={{ color: colors.success }}>
                      FCR {agent.fcr}%
                    </span>
                  </div>
                </div>
                {index === 0 && (
                  <Award className="w-6 h-6 flex-shrink-0" style={{ color: colors.warning }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 3: Call Types & Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Types */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            توزیع انواع تماس
          </h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <PieChart>
              <Pie
                data={callTypeData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {callTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: colors.textPrimary, fontSize: '12px' }}>
                    {entry.payload.name}
                  </span>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  color: colors.textPrimary,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Distribution */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            توزیع زمان پاسخگویی
          </h3>
          <div className="space-y-3 mt-6">
            {responseTimeData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {item.range}
                    </span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: item.status === "عالی" ? `${colors.success}11` : 
                                        item.status === "خوب" ? `${colors.primary}11` :
                                        item.status === "متوسط" ? `${colors.warning}11` : `${colors.error}11`,
                        color: item.status === "عالی" ? colors.success : 
                               item.status === "خوب" ? colors.primary :
                               item.status === "متوسط" ? colors.warning : colors.error
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {item.count}
                    </span>
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.border }}>
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.status === "عالی" ? colors.success : 
                                      item.status === "خوب" ? colors.primary :
                                      item.status === "متوسط" ? colors.warning : colors.error
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 4: Satisfaction Trend & Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satisfaction Trend */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            روند رضایت مشتری
          </h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <LineChart data={satisfactionTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.success} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis 
                dataKey="month"
                tick={{ fill: colors.textSecondary, fontSize: 11 }}
                stroke={colors.border}
              />
              <YAxis 
                domain={[4.0, 5.0]}
                tick={{ fill: colors.textSecondary, fontSize: 11 }}
                stroke={colors.border}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  padding: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                labelStyle={{ color: colors.textPrimary, fontWeight: "bold", marginBottom: "4px" }}
                itemStyle={{ color: colors.success }}
                formatter={(value: number, name: string) => {
                  if (name === "score") return [value.toFixed(1), "امتیاز رضایت"];
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="none"
                fill="url(#satisfactionGradient)"
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={colors.success} 
                strokeWidth={3}
                dot={{ 
                  fill: colors.cardBackground, 
                  stroke: colors.success,
                  strokeWidth: 3,
                  r: 5 
                }}
                activeDot={{ 
                  r: 7,
                  fill: colors.success,
                  stroke: colors.cardBackground,
                  strokeWidth: 3
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Stats Summary */}
          <div 
            className="mt-4 pt-4 border-t grid grid-cols-3 gap-3"
            style={{ borderColor: colors.border }}
          >
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>میانگین</p>
              <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {(
                  satisfactionTrend.reduce((sum, item) => sum + item.score, 0) /
                  satisfactionTrend.length
                ).toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>بالاترین</p>
              <p className="text-lg font-bold" style={{ color: colors.success }}>
                {Math.max(
                  ...satisfactionTrend.map(item => item.score)
                ).toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>پایین‌ترین</p>
              <p className="text-lg font-bold" style={{ color: colors.warning }}>
                {Math.min(
                  ...satisfactionTrend.map(item => item.score)
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Channel Performance */}
        <div 
          className="rounded-xl border p-6"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            عملکرد بر اساس کانال
          </h3>
          <div className="space-y-4 mt-6">
            {channelPerformance.map((channel, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {channel.channel}
                  </span>
                  <span className="text-lg font-bold" style={{ color: colors.primary }}>
                    {channel.calls}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {channel.channel === "تلفن" && (
                    <div>
                      <span style={{ color: colors.textSecondary }}>رضایت: </span>
                      <span className="font-medium flex items-center gap-1" style={{ color: colors.warning }}>
                        <Star className="w-3 h-3" fill={colors.warning} stroke="none" />
                        {channel.satisfaction}
                      </span>
                    </div>
                  )}
                  <div className={channel.channel === "تلفن" ? "text-left" : ""}>
                    <span style={{ color: colors.textSecondary }}>زمان: </span>
                    <span className="font-medium" style={{ color: colors.textPrimary }}>
                      {channel.avgTime} دقیقه
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}