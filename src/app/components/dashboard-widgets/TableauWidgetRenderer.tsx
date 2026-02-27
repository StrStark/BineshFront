import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { TableauWidgetConfig } from "./TableauStyleWidgetBuilder";

// ─── داده‌های نمونه (مشابه Builder) ────────────────────────────────────────
const sampleData: Record<string, Record<string, any>[]> = {
  sales_summary: [
    { type: "فروش مستقیم", value: 450, returned: 32 },
    { type: "آنلاین", value: 320, returned: 18 },
    { type: "نمایشگاه", value: 280, returned: 12 },
    { type: "شراکت", value: 190, returned: 8 },
    { type: "تلفنی", value: 145, returned: 6 },
  ],
  top_selling_products: [
    { productName: "محصول الف", count: 120, totalAmount: 540, growth: 12 },
    { productName: "محصول ب", count: 95, totalAmount: 420, growth: 8 },
    { productName: "محصول ج", count: 78, totalAmount: 350, growth: -3 },
    { productName: "محصول د", count: 64, totalAmount: 280, growth: 15 },
  ],
  exhibition_visits: [
    { fullName: "علی رضایی", company: "شرکت آلفا", city: "تهران", province: "تهران", followUpStatus: "پیگیری شده", priority: "بالا", count: 45 },
    { fullName: "مریم احمدی", company: "شرکت بتا", city: "اصفهان", province: "اصفهان", followUpStatus: "در انتظار", priority: "متوسط", count: 32 },
    { fullName: "رضا کریمی", company: "شرکت گاما", city: "شیراز", province: "فارس", followUpStatus: "بدون پیگیری", priority: "پایین", count: 18 },
    { fullName: "سارا محمدی", company: "شرکت دلتا", city: "مشهد", province: "خراسان رضوی", followUpStatus: "پیگیری شده", priority: "متوسط", count: 27 },
  ],
  customers_list: [
    { customerName: "شرکت الف", totalPurchase: 1500, orderCount: 12 },
    { customerName: "شرکت ب", totalPurchase: 980, orderCount: 8 },
    { customerName: "شرکت ج", totalPurchase: 750, orderCount: 6 },
  ],
  total_calls: [
    { day: "شنبه", calls: 45, missed: 8 },
    { day: "یکشنبه", calls: 62, missed: 12 },
    { day: "دوشنبه", calls: 58, missed: 6 },
    { day: "سه‌شنبه", calls: 71, missed: 15 },
    { day: "چهارشنبه", calls: 53, missed: 9 },
  ],
  agents_performance: [
    { agentName: "علی محمدی", callsAnswered: 87, avgDuration: 4.5, satisfaction: 4.2 },
    { agentName: "مریم احمدی", callsAnswered: 92, avgDuration: 3.8, satisfaction: 4.7 },
    { agentName: "رضا کریمی", callsAnswered: 76, avgDuration: 5.1, satisfaction: 3.9 },
  ],
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

interface Props {
  config: TableauWidgetConfig;
}

export function TableauWidgetRenderer({ config }: Props) {
  const colors = useCurrentColors();

  const chartData = useMemo(() => {
    if (!config.dataSources.length) return null;
    const ds = config.dataSources[0];
    let data: Record<string, any>[] = sampleData[ds.tableId] || [];
    if (!data.length) return null;

    const xField =
      config.columns.find(f => f.field.type === "dimension") ||
      config.rows.find(f => f.field.type === "dimension");
    const yFields = config.values.filter(f => f.field.type === "measure");
    if (!xField || !yFields.length) return null;

    const xKey = xField.field.id.split(".").pop()!;
    const yKeys = yFields.map(f => f.field.id.split(".").pop()!);
    return { data, xKey, yKeys, yMeasureFields: yFields };
  }, [config]);

  const tooltipStyle = {
    borderRadius: "8px",
    fontSize: "12px",
    direction: "rtl" as const,
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    color: colors.textPrimary,
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs opacity-40" style={{ color: colors.textSecondary }}>
          داده‌ای برای نمایش وجود ندارد
        </p>
      </div>
    );
  }

  const { data, xKey, yKeys, yMeasureFields } = chartData;
  const commonProps = { data, margin: { top: 8, right: 8, left: 0, bottom: 20 } };

  // ── Table ─────────────────────────────────────────────────────────────────
  if (config.chartType === "table") {
    const allKeys = [xKey, ...yKeys];
    const headers = [
      (config.columns.find(f => f.field.type === "dimension") || config.rows.find(f => f.field.type === "dimension"))?.field.name,
      ...yMeasureFields.map(f => f.field.name),
    ].filter(Boolean);
    return (
      <div className="w-full h-full overflow-auto" dir="rtl">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: colors.backgroundSecondary }}>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-right font-semibold"
                  style={{ color: colors.textPrimary, borderBottom: "1px solid " + colors.border }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: "1px solid " + colors.border, backgroundColor: ri % 2 === 0 ? "transparent" : colors.backgroundSecondary + "60" }}>
                {allKeys.map((k, ki) => (
                  <td key={ki} className="px-3 py-2" style={{ color: colors.textPrimary }}>{row[k]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Pie / Donut ───────────────────────────────────────────────────────────
  if (config.chartType === "pie") {
    const pieData = data.map(d => ({
      name: String(d[xKey] ?? ""),
      value: yKeys[0] ? (d[yKeys[0]] ?? 0) : 1,
    })).filter(d => d.name);
    const total = pieData.reduce((s, d) => s + (d.value || 0), 0);
    return (
      <div className="w-full h-full flex flex-col items-center gap-1" dir="rtl">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
              dataKey="value" paddingAngle={2} stroke="none">
              {pieData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [v, ""]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-2">
          {pieData.map((d, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>{d.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold mt-1" style={{ color: colors.textPrimary }}>
          مجموع: {total.toLocaleString("fa-IR")}
        </p>
      </div>
    );
  }

  // ── Line ──────────────────────────────────────────────────────────────────
  if (config.chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
          <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: colors.textSecondary }} />
          <YAxis tick={{ fontSize: 10, fill: colors.textSecondary }} width={32} />
          <Tooltip contentStyle={tooltipStyle} />
          {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
          {yKeys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} name={yMeasureFields[i]?.field.name || k}
              stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // ── Area ──────────────────────────────────────────────────────────────────
  if (config.chartType === "area") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
          <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: colors.textSecondary }} />
          <YAxis tick={{ fontSize: 10, fill: colors.textSecondary }} width={32} />
          <Tooltip contentStyle={tooltipStyle} />
          {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
          {yKeys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} name={yMeasureFields[i]?.field.name || k}
              fill={CHART_COLORS[i % CHART_COLORS.length] + "40"}
              stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // ── Scatter ────────────────────────────────────────────────────────────────
  if (config.chartType === "scatter") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
          <XAxis dataKey={xKey} type="category" tick={{ fontSize: 10, fill: colors.textSecondary }} />
          <YAxis dataKey={yKeys[0] || "value"} type="number" tick={{ fontSize: 10, fill: colors.textSecondary }} width={32} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name={yMeasureFields[0]?.field.name || yKeys[0]} data={data} fill={CHART_COLORS[0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  // ── Bar (default) ─────────────────────────────────────────────────────────
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: colors.textSecondary }} />
        <YAxis tick={{ fontSize: 10, fill: colors.textSecondary }} width={32} />
        <Tooltip contentStyle={tooltipStyle} />
        {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
        {yKeys.map((k, i) => (
          <Bar key={k} dataKey={k} name={yMeasureFields[i]?.field.name || k}
            fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
