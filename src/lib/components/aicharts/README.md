# چارت‌های هوشمند پنل بینش

مجموعه کامل نمودارهای حرفه‌ای با پشتیبانی کامل از تم‌بندی سیستم، RTL، Dark Mode و Responsive Design.

## ویژگی‌های کلیدی

✅ **رنگ‌بندی خودکار**: رنگ‌ها از تم فعلی سیستم (بینش/حافظ) گرفته می‌شوند
✅ **استخراج خودکار Series**: در LineChart و AreaChart، series ها خودکار از data شناسایی می‌شوند
✅ **فرمت داده یکسان**: یک data می‌تواند در چندین چارت مختلف استفاده شود
✅ **Dark Mode**: پشتیبانی کامل با تغییر خودکار رنگ‌ها
✅ **RTL Support**: طراحی شده برای زبان فارسی
✅ **Responsive**: کاملاً واکنش‌گرا در تمام سایزها
✅ **Tooltips فارسی**: اعداد با فرمت فارسی و طراحی مدرن

## انواع چارت‌ها

### 1. DonutChart (نمودار حلقه‌ای)
```tsx
import { DonutChart } from "./components/aicharts";

const data = [
  { name: "تهران", value: 35000 },
  { name: "مشهد", value: 25000 },
  { name: "اصفهان", value: 18000 },
];

<DonutChart
  title="توزیع فروش"
  data={data}
  showLegend
  showTooltip
  height={350}
  innerRadius={60}
  outerRadius={100}
/>
```

### 2. PieChart (نمودار دایره‌ای)
```tsx
import { PieChart } from "./components/aicharts";

const data = [
  { name: "محصول A", value: 4500 },
  { name: "محصول B", value: 3200 },
  { name: "محصول C", value: 2800 },
];

<PieChart
  title="سهم محصولات"
  data={data}
  showLegend
  showTooltip
  showPercentage
  interactive
  height={350}
/>
```

### 3. BarChart (نمودار میله‌ای)
```tsx
import { BarChart } from "./components/aicharts";

const data = [
  { name: "فروردین", value: 12000 },
  { name: "اردیبهشت", value: 15000 },
  { name: "خرداد", value: 18000 },
];

// عمودی
<BarChart
  title="فروش ماهانه"
  data={data}
  showGrid
  showTooltip
  height={350}
/>

// افقی
<BarChart
  title="فروش ماهانه"
  data={data}
  showGrid
  showTooltip
  horizontal
  height={350}
/>
```

### 4. LineChart (نمودار خطی)
```tsx
import { LineChart } from "./components/aicharts";

const data = [
  { name: "هفته ۱", فروش: 4000, سود: 2400, هزینه: 1800 },
  { name: "هفته ۲", فروش: 3000, سود: 1398, هزینه: 2100 },
  { name: "هفته ۳", فروش: 2000, سود: 9800, هزینه: 1200 },
];

// استفاده ساده - Series ها خودکار شناسایی می‌شوند
<LineChart
  title="روند هفتگی"
  data={data}
  showGrid
  showLegend
  showTooltip
  showDots
  smooth
  height={350}
/>

// استفاده پیشرفته - با تعریف دستی series (اختیاری)
const series = [
  { dataKey: "فروش", name: "فروش", strokeWidth: 3 },
  { dataKey: "سود", name: "سود", strokeWidth: 2 },
];

<LineChart
  title="روند هفتگی"
  data={data}
  series={series}  // اختیاری
  showGrid
  showLegend
  showTooltip
  showDots
  smooth
  height={350}
/>
```

### 5. AreaChart (نمودار ناحیه‌ای)
```tsx
import { AreaChart } from "./components/aicharts";

const data = [
  { name: "شنبه", بازدید: 4000, تبدیل: 2400, فروش: 2400 },
  { name: "یکشنبه", بازدید: 3000, تبدیل: 1398, فروش: 2210 },
  { name: "دوشنبه", بازدید: 2000, تبدیل: 9800, فروش: 2290 },
];

// استفاده ساده - Series ها خودکار شناسایی می‌شوند
<AreaChart
  title="قیف فروش"
  data={data}
  showGrid
  showLegend
  showTooltip
  smooth
  stacked={false}
  height={350}
/>

// استفاده پیشرفته - با تعریف دستی series (اختیاری)
const series = [
  { dataKey: "بازدید", name: "بازدید", fillOpacity: 0.8 },
  { dataKey: "تبدیل", name: "تبدیل", fillOpacity: 0.6 },
  { dataKey: "فروش", name: "فروش", fillOpacity: 0.4 },
];

<AreaChart
  title="قیف فروش"
  data={data}
  series={series}  // اختیاری
  showGrid
  showLegend
  showTooltip
  smooth
  stacked={false}
  height={350}
/>

// انباشته (Stacked)
<AreaChart
  title="قیف فروش انباشته"
  data={data}
  showGrid
  showLegend
  showTooltip
  smooth
  stacked={true}
  height={350}
/>
```

## فرمت داده‌ها

### برای چارت‌های ساده (Donut, Pie, Bar)
```typescript
interface SimpleDataItem {
  name: string;    // نام آیتم
  value: number;   // مقدار عددی
}
```

### برای چارت‌های چند بعدی (Line, Area)
```typescript
interface MultiSeriesDataItem {
  name: string;              // نام دسته (محور X)
  [key: string]: number;     // مقادیر مختلف
}

// مثال:
const data = [
  { name: "هفته ۱", فروش: 4000, سود: 2400 },
  { name: "هفته ۲", فروش: 3000, سود: 1398 },
];
```

### تعریف سری‌ها (Series)
```typescript
// برای LineChart
interface LineChartSeries {
  dataKey: string;        // کلید داده در data object
  name?: string;          // نام نمایشی
  strokeWidth?: number;   // ضخامت خط (پیش‌فرض: 2)
}

// برای AreaChart
interface AreaChartSeries {
  dataKey: string;        // کلید داده در data object
  name?: string;          // نام نمایشی
  fillOpacity?: number;   // شفافیت پر شدن (پیش‌فرض: 0.8)
}
```

## رنگ‌بندی

تمام چارت‌ها از پالت رنگی زیر استفاده می‌کنند که خودکار از تم سیستم می‌گیرند:

```javascript
const CHART_COLORS = [
  themeColors.primary,    // رنگ اصلی تم (آبی بینش یا سبز حافظ)
  themeColors.accent,     // رنگ تاکیدی تم
  "#4ade80",              // سبز
  "#fbbf24",              // طلایی
  "#f87171",              // قرمز
  "#a78bfa",              // بنفش
  "#fb923c",              // نارنجی
  "#ec4899",              // صورتی
];
```

## Props مشترک

همه چارت‌ها از props های زیر پشتیبانی می‌کنند:

| Prop | Type | Default | توضیحات |
|------|------|---------|---------|
| `title` | `string` | - | عنوان چارت |
| `data` | `Array` | **required** | داده‌های چارت |
| `showLegend` | `boolean` | `true` | نمایش راهنما |
| `showTooltip` | `boolean` | `true` | نمایش Tooltip |
| `height` | `number` | `350` | ارتفاع چارت (px) |

## Props اختصاصی

### DonutChart & PieChart
- `innerRadius`: شعاع داخلی (فقط Donut)
- `outerRadius`: شعاع خارجی
- `showPercentage`: نمایش درصد (فقط Pie)
- `interactive`: فعال‌سازی افکت hover (فقط Pie)

### BarChart
- `horizontal`: نمودار افقی
- `showGrid`: نمایش گرید
- `xAxisLabel`: برچسب محور X
- `yAxisLabel`: برچسب محور Y

### LineChart
- `series`: آرایه سری‌ها
- `showDots`: نمایش نقاط
- `smooth`: خطوط صاف
- `showGrid`: نمایش گرید

### AreaChart
- `series`: آرایه سری‌ها
- `stacked`: حالت انباشته
- `smooth`: خطوط صاف
- `showGrid`: نمایش گرید

## نمونه‌های کاربردی

### استفاده از یک داده در چند چارت

```tsx
const cityData = [
  { name: "تهران", value: 35000 },
  { name: "مشهد", value: 25000 },
  { name: "اصفهان", value: 18000 },
];

// همان data در سه چارت مختلف
<DonutChart title="نمودار حلقه‌ای" data={cityData} />
<PieChart title="نمودار دایره‌ای" data={cityData} />
<BarChart title="نمودار میله‌ای" data={cityData} />
```

### مقایسه Stacked و Normal

```tsx
const data = [
  { name: "شنبه", موبایل: 4000, تبلت: 2400, دسکتاپ: 2400 },
  { name: "یکشنبه", موبایل: 3000, تبلت: 1398, دسکتاپ: 2210 },
];

const series = [
  { dataKey: "موبایل", name: "موبایل" },
  { dataKey: "تبلت", name: "تبلت" },
  { dataKey: "دسکتاپ", name: "دسکتاپ" },
];

<AreaChart title="معمولی" data={data} series={series} stacked={false} />
<AreaChart title="انباشته" data={data} series={series} stacked={true} />
```

## نکات مهم

1. **رنگ‌ها خودکار هستند**: نیازی به تعریف color در props نیست - رنگ‌ها از تم سیستم می‌آیند
2. **Series خودکار استخراج می‌شوند**: در LineChart و AreaChart نیازی به تعریف series نیست (البته اختیاری هستند)
3. **فرمت یکسان**: یک JSON برای همه چارت‌ها قابل استفاده است
4. **Responsive**: همه چارت‌ها با ResponsiveContainer ساخته شده‌اند
5. **اعداد فارسی**: تمام اعداد خودکار به فرمت فارسی تبدیل می‌شوند
6. **Dark Mode**: رنگ‌ها خودکار با تم تاریک تطبیق می‌یابند

## مثال سریع

```tsx
// فقط یک JSON کافی است!
const data = [
  { name: "هفته ۱", فروش: 4000, سود: 2400 },
  { name: "هفته ۲", فروش: 3000, سود: 1398 },
];

// در چند چارت مختلف استفاده کنید
<LineChart data={data} title="روند فروش" />
<AreaChart data={data} title="ناحیه فروش" stacked={false} />
<AreaChart data={data} title="ناحیه انباشته" stacked={true} />
```