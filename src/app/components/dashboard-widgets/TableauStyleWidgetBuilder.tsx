import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  X, Save, Database, BarChart3, PieChart, LineChart, Activity, TrendingUp,
  Table as TableIcon, Plus, Trash2, Filter, GripVertical,
  Layers, Calculator, Hash, Type, Check,
  RefreshCw, Info, Zap, Code2, Sigma, ChevronDown, Search,
  ChartScatter, RotateCcw, Pencil
} from "lucide-react";
import {
  BarChart, Bar, LineChart as ReLineChart, Line,
  PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

export type FieldType = "dimension" | "measure";
export type AggregationType = "sum" | "avg" | "count" | "min" | "max" | "countDistinct";

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  dataType: "string" | "number" | "date";
  sourceTable: string;
  sourceSoftware: string;
}

export interface DroppedField {
  field: Field;
  aggregation?: AggregationType;
  alias?: string;
}

export interface DataSource {
  id: string;
  softwareId: string;
  tableId: string;
  alias?: string;
}

export interface JoinConfig {
  leftSource: string;
  rightSource: string;
  leftKey: string;
  rightKey: string;
  type: "inner" | "left" | "right" | "full";
}

export interface FilterConfig {
  id: string;
  field: string;
  operator: "equals" | "contains" | "greater" | "less" | "between" | "in";
  value: any;
  sourceId: string;
}

// ── فیلتر پیشرفته با چند حالت ──
export type FilterMode = "values" | "range" | "text_condition" | "num_condition" | "date";
export type TextOperator = "contains" | "notContains" | "equals" | "notEquals" | "startsWith" | "endsWith";
export type NumOperator  = "equals" | "notEquals" | "greater" | "greaterEq" | "less" | "lessEq" | "between";
export type DatePreset   = "today" | "yesterday" | "thisWeek" | "thisMonth" | "thisQuarter" | "thisYear" | "custom";

export interface ActiveFilter {
  id: string;
  field: Field;
  mode: FilterMode;
  selectedValues: string[];
  rangeMin?: number;
  rangeMax?: number;
  textOperator?: TextOperator;
  textValue?: string;
  numOperator?: NumOperator;
  numValue?: number;
  numValue2?: number;
  datePreset?: DatePreset;
  dateFrom?: string;
  dateTo?: string;
}

export interface CalculatedField {
  id: string;
  name: string;
  formula: string;
  type: FieldType;
}

export interface TableauWidgetConfig {
  id: string;
  title: string;
  chartType: "bar" | "line" | "pie" | "area" | "radar" | "table" | "scatter";
  dataSources: DataSource[];
  joins: JoinConfig[];
  columns: DroppedField[];
  rows: DroppedField[];
  values: DroppedField[];
  filters: FilterConfig[];
  colorBy?: DroppedField;
  sizeBy?: DroppedField;
  colors?: string[];
  showLegend: boolean;
  showGrid: boolean;
  calculatedFields: CalculatedField[];
  activeFiltersSnapshot?: ActiveFilter[];
}

interface TableauStyleWidgetBuilderProps {
  onSave: (config: TableauWidgetConfig) => void;
  onClose: () => void;
  editWidget?: TableauWidgetConfig;
}

const softwares = [
  {
    id: "data_panel",
    name: "پنل مدیریت داده",
    tables: [
      {
        id: "sales_summary",
        name: "خلاصه فروش",
        fields: [
          { id: "type", name: "نوع", dataType: "string" as const },
          { id: "value", name: "مقدار", dataType: "number" as const },
          { id: "returned", name: "برگشتی", dataType: "number" as const },
        ],
      },
      {
        id: "top_selling_products",
        name: "محصولات پرفروش",
        fields: [
          { id: "productName", name: "نام محصول", dataType: "string" as const },
          { id: "count", name: "تعداد", dataType: "number" as const },
          { id: "totalAmount", name: "مبلغ کل", dataType: "number" as const },
          { id: "growth", name: "رشد", dataType: "number" as const },
        ],
      },
      {
        id: "exhibition_visits",
        name: "بازدید نمایشگاه",
        fields: [
          { id: "fullName", name: "نام و نام خانوادگی", dataType: "string" as const },
          { id: "company", name: "شرکت", dataType: "string" as const },
          { id: "city", name: "شهر", dataType: "string" as const },
          { id: "province", name: "استان", dataType: "string" as const },
          { id: "followUpStatus", name: "وضعیت پیگیری", dataType: "string" as const },
          { id: "priority", name: "اولویت", dataType: "string" as const },
          { id: "count", name: "تعداد", dataType: "number" as const },
        ],
      },
      {
        id: "customers_list",
        name: "لیست مشتریان",
        fields: [
          { id: "customerName", name: "نام مشتری", dataType: "string" as const },
          { id: "totalPurchase", name: "کل خرید", dataType: "number" as const },
          { id: "orderCount", name: "تعداد سفارش", dataType: "number" as const },
        ],
      },
    ],
  },
  {
    id: "call_panel",
    name: "پنل مدیریت تماس",
    tables: [
      {
        id: "total_calls",
        name: "مجموع تماس‌ها",
        fields: [
          { id: "day", name: "روز هفته", dataType: "string" as const },
          { id: "calls", name: "تعداد تماس", dataType: "number" as const },
          { id: "missed", name: "از دست رفته", dataType: "number" as const },
        ],
      },
      {
        id: "agents_performance",
        name: "عملکرد کارشناسان",
        fields: [
          { id: "agentName", name: "نام کارشناس", dataType: "string" as const },
          { id: "callsAnswered", name: "پاسخ داده شده", dataType: "number" as const },
          { id: "avgDuration", name: "میانگین مکالمه", dataType: "number" as const },
          { id: "satisfaction", name: "رضایت", dataType: "number" as const },
        ],
      },
    ],
  },
];

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

const chartTypes = [
  { id: "bar", name: "میله‌ای", icon: BarChart3, color: "#3b82f6" },
  { id: "line", name: "خطی", icon: LineChart, color: "#8b5cf6" },
  { id: "pie", name: "دایره‌ای", icon: PieChart, color: "#ec4899" },
  { id: "area", name: "منطقه‌ای", icon: Activity, color: "#06b6d4" },
  { id: "scatter", name: "پراکندگی", icon: ChartScatter, color: "#f59e0b" },
  { id: "table", name: "جدول", icon: TableIcon, color: "#10b981" },
];

const aggregationTypes: { id: AggregationType; name: string }[] = [
  { id: "sum", name: "جمع" },
  { id: "avg", name: "میانگین" },
  { id: "count", name: "تعداد" },
  { id: "min", name: "حداقل" },
  { id: "max", name: "حداکثر" },
  { id: "countDistinct", name: "تعداد یکتا" },
];

const defaultChartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];


function renderFieldItem(
  field: Field,
  activeDragFieldId: string | undefined,
  handleDragStart: (e: React.DragEvent, f: Field) => void,
  handleDragEnd: () => void,
  colors: any,
  accent: string,
  label: string
) {
  const isDragging = activeDragFieldId === field.id;
  return (
    <div
      key={field.id}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, field)}
      onDragEnd={handleDragEnd}
      className="p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:shadow-sm group flex items-center gap-2 select-none"
      style={{
        backgroundColor: isDragging ? (accent + "15") : colors.cardBackground,
        borderColor: isDragging ? accent : colors.border,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <GripVertical className="w-4 h-4 opacity-30 group-hover:opacity-60 flex-shrink-0" style={{ color: accent }} />
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <span className="text-[13px] flex-1 truncate" style={{ color: colors.textPrimary }}>{field.name}</span>
      <span
        className="text-[11px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        style={{ backgroundColor: accent + "15", color: accent }}
      >
        {label}
      </span>
    </div>
  );
}

export function TableauStyleWidgetBuilder({ onSave, onClose, editWidget }: TableauStyleWidgetBuilderProps) {
  const colors = useCurrentColors();

  const [title, setTitle] = useState(editWidget?.title || "ویجت جدید");
  const [chartType, setChartType] = useState<TableauWidgetConfig["chartType"]>(editWidget?.chartType || "bar");
  const [dataSources, setDataSources] = useState<DataSource[]>(editWidget?.dataSources || []);
  const [joins] = useState<JoinConfig[]>(editWidget?.joins || []);
  const [columns, setColumns] = useState<DroppedField[]>(editWidget?.columns || []);
  const [rows, setRows] = useState<DroppedField[]>(editWidget?.rows || []);
  const [values, setValues] = useState<DroppedField[]>(editWidget?.values || []);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(editWidget?.activeFiltersSnapshot || []);
  const [colorBy, setColorBy] = useState<DroppedField | undefined>(editWidget?.colorBy);
  const [sizeBy, setSizeBy] = useState<DroppedField | undefined>(editWidget?.sizeBy);
  const showLegend = true;
  const showGrid = true;
  const [calculatedFields, setCalculatedFields] = useState<CalculatedField[]>(editWidget?.calculatedFields || []);
  const [showCalcForm, setShowCalcForm] = useState(false);
  const [newCalcName, setNewCalcName] = useState("");
  const [newCalcFormula, setNewCalcFormula] = useState("");
  const [newCalcType, setNewCalcType] = useState<FieldType>("measure");
  const [activePanel, setActivePanel] = useState<"data" | "analytics">("data");
  const [activeDragField, setActiveDragField] = useState<Field | null>(null);
  const draggedFieldRef = useRef<Field | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [editingDataSources, setEditingDataSources] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [shelvesCollapsed, setShelvesCollapsed] = useState(false);

  const currentSchemeColors = defaultChartColors;

  const allFields = useMemo(() => {
    const fields: Field[] = [];
    dataSources.forEach(ds => {
      const software = softwares.find(s => s.id === ds.softwareId);
      const table = software?.tables.find(t => t.id === ds.tableId);
      table?.fields.forEach(field => {
        const fieldType: FieldType = field.dataType === "number" ? "measure" : "dimension";
        fields.push({
          id: `${ds.id}.${field.id}`,
          name: field.name,
          type: fieldType,
          dataType: field.dataType,
          sourceTable: ds.tableId,
          sourceSoftware: ds.softwareId,
        });
      });
    });
    calculatedFields.forEach(cf => {
      fields.push({
        id: `calc.${cf.id}`,
        name: cf.name + " (محاسباتی)",
        type: cf.type,
        dataType: cf.type === "measure" ? "number" : "string",
        sourceTable: "calculated",
        sourceSoftware: "calculated",
      });
    });
    return fields;
  }, [dataSources, calculatedFields]);

  const dimensions = useMemo(() => {
    const dims = allFields.filter(f => f.type === "dimension");
    if (!fieldSearch.trim()) return dims;
    return dims.filter(f => f.name.includes(fieldSearch));
  }, [allFields, fieldSearch]);

  const measures = useMemo(() => {
    const ms = allFields.filter(f => f.type === "measure");
    if (!fieldSearch.trim()) return ms;
    return ms.filter(f => f.name.includes(fieldSearch));
  }, [allFields, fieldSearch]);

  const chartData = useMemo(() => {
    if (dataSources.length === 0) return null;
    const ds = dataSources[0];
    let data = sampleData[ds.tableId];
    if (!data) return null;

    // ── اعمال فیلترهای پیشرفته ──
    activeFilters.forEach(af => {
      const fk = af.field.id.split(".").pop()!;
      if (af.mode === "values") {
        if (af.selectedValues.length > 0)
          data = data.filter((r: any) => af.selectedValues.includes(String(r[fk] ?? "")));
      } else if (af.mode === "range") {
        data = data.filter((r: any) => {
          const v = Number(r[fk]);
          if (af.rangeMin !== undefined && v < af.rangeMin) return false;
          if (af.rangeMax !== undefined && v > af.rangeMax) return false;
          return true;
        });
      } else if (af.mode === "text_condition" && af.textValue) {
        data = data.filter((r: any) => {
          const v = String(r[fk] ?? "").toLowerCase();
          const t = af.textValue!.toLowerCase();
          switch (af.textOperator) {
            case "equals":      return v === t;
            case "notEquals":   return v !== t;
            case "startsWith":  return v.startsWith(t);
            case "endsWith":    return v.endsWith(t);
            case "notContains": return !v.includes(t);
            default:            return v.includes(t);
          }
        });
      } else if (af.mode === "num_condition") {
        data = data.filter((r: any) => {
          const v = Number(r[fk]);
          const a = af.numValue ?? 0, b = af.numValue2 ?? 0;
          switch (af.numOperator) {
            case "equals":    return v === a;
            case "notEquals": return v !== a;
            case "greater":   return v > a;
            case "greaterEq": return v >= a;
            case "less":      return v < a;
            case "lessEq":    return v <= a;
            case "between":   return v >= a && v <= b;
            default:          return true;
          }
        });
      }
    });

    const xField = columns.find(f => f.field.type === "dimension") || rows.find(f => f.field.type === "dimension");
    const yFields = values.filter(f => f.field.type === "measure");
    if (!xField || yFields.length === 0) return null;
    const xKey = xField ? xField.field.id.split(".").pop()! : null;
    const yKeys = yFields.map(f => f.field.id.split(".").pop()!);
    return { data, xKey, yKeys, yMeasureFields: yFields };
  }, [dataSources, columns, rows, values, activeFilters]);

  const hasChartData = chartData !== null;

  const handleDragStart = (e: React.DragEvent, field: Field) => {
    draggedFieldRef.current = field;
    setActiveDragField(field);
    e.dataTransfer.setData("text/plain", field.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    draggedFieldRef.current = null;
    setActiveDragField(null);
  };

  const handleDrop = (shelf: "columns" | "rows" | "values" | "color" | "size" | "filters") => {
    const field = draggedFieldRef.current;
    if (!field) return;
    const dropped: DroppedField = { field, aggregation: field.type === "measure" ? "sum" : undefined };
    if (shelf === "columns") setColumns(prev => [...prev, dropped]);
    else if (shelf === "rows") setRows(prev => [...prev, dropped]);
    else if (shelf === "values") setValues(prev => [...prev, dropped]);
    else if (shelf === "color") setColorBy(dropped);
    else if (shelf === "size") setSizeBy(dropped);
    else if (shelf === "filters") {
      setActiveFilters(prev => {
        if (prev.find(f => f.field.id === field.id)) return prev;
        const tableId = field.sourceTable;
        const rawData = sampleData[tableId] || [];
        const fieldKey = field.id.split(".").pop()!;
        const allVals = Array.from(new Set(rawData.map((d: any) => String(d[fieldKey] ?? "")))).filter(Boolean);
        const defaultMode: FilterMode =
          field.dataType === "number" ? "range" :
          field.dataType === "date"   ? "date"  : "values";
        const numVals = rawData.map((d: any) => Number(d[fieldKey])).filter(v => !isNaN(v));
        return [...prev, {
          id: "filter-" + Date.now(), field,
          mode: defaultMode,
          selectedValues: allVals,
          rangeMin: numVals.length ? Math.min(...numVals) : undefined,
          rangeMax: numVals.length ? Math.max(...numVals) : undefined,
          textOperator: "contains",
          numOperator: "between",
          numValue: numVals.length ? Math.min(...numVals) : 0,
          numValue2: numVals.length ? Math.max(...numVals) : 100,
          datePreset: "thisMonth",
        }];
      });
    }
    draggedFieldRef.current = null;
    setActiveDragField(null);
  };

  const removeFromShelf = (shelf: "columns" | "rows" | "values", index: number) => {
    if (shelf === "columns") setColumns(prev => prev.filter((_, i) => i !== index));
    else if (shelf === "rows") setRows(prev => prev.filter((_, i) => i !== index));
    else if (shelf === "values") setValues(prev => prev.filter((_, i) => i !== index));
  };

  const clearShelf = (shelf: "columns" | "rows" | "values" | "filters") => {
    if (shelf === "columns") setColumns([]);
    else if (shelf === "rows") setRows([]);
    else if (shelf === "values") setValues([]);
    else if (shelf === "filters") setActiveFilters([]);
  };

  const updateAggregation = (shelf: "columns" | "rows" | "values", index: number, agg: AggregationType) => {
    const upd = (arr: DroppedField[]) => arr.map((f, i) => i === index ? { ...f, aggregation: agg } : f);
    if (shelf === "columns") setColumns(upd(columns));
    else if (shelf === "rows") setRows(upd(rows));
    else if (shelf === "values") setValues(upd(values));
  };

  const handleResetAll = () => {
    setColumns([]);
    setRows([]);
    setValues([]);
    setActiveFilters([]);
    setColorBy(undefined);
    setSizeBy(undefined);
  };

  const handleSave = () => {
    if (!title.trim()) { alert("لطفاً عنوان ویجت را وارد کنید"); return; }
    if (dataSources.length === 0) { alert("لطفاً حداقل یک منبع داده اضافه کنید"); return; }
    onSave({
      id: editWidget?.id || ("widget-" + Date.now()),
      title, chartType, dataSources, joins, columns, rows, values,
      filters: [], colorBy, sizeBy,
      colors: currentSchemeColors, showLegend, showGrid, calculatedFields,
      activeFiltersSnapshot: activeFilters,
    });
  };

  const totalFieldsUsed = columns.length + rows.length + values.length + activeFilters.length + (colorBy ? 1 : 0) + (sizeBy ? 1 : 0);

  const renderLiveChart = () => {
    if (!chartData) return null;
    const { data, xKey, yKeys, yMeasureFields } = chartData;
    const COLORS = currentSchemeColors;
    const commonProps = { data, margin: { top: 10, right: 20, left: 0, bottom: 30 } };
    const tooltipStyle = {
      borderRadius: "8px", fontSize: "12px", direction: "rtl" as const,
      backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.textPrimary,
    };

    if (chartType === "table") {
      const allKeys = [...(xKey ? [xKey] : []), ...yKeys];
      const headers = [
        xKey ? (columns.find(f => f.field.type === "dimension") || rows.find(f => f.field.type === "dimension"))?.field.name : null,
        ...yMeasureFields.map(f => f.field.name),
      ].filter(Boolean);
      return (
        <div className="w-full overflow-auto rounded-lg border" style={{ borderColor: colors.border }}>
          <table className="w-full text-sm" dir="rtl">
            <thead>
              <tr style={{ backgroundColor: colors.backgroundSecondary }}>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-2 text-right text-xs"
                    style={{ color: colors.textPrimary, borderBottom: "1px solid " + colors.border }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: "1px solid " + colors.border, backgroundColor: ri % 2 === 0 ? "transparent" : colors.backgroundSecondary + "60" }}>
                  {allKeys.map((key, ki) => (
                    <td key={ki} className="px-4 py-2 text-xs" style={{ color: colors.textPrimary }}>{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (chartType === "pie") {
      const xFieldDef = columns.find(f => f.field.type === "dimension") || rows.find(f => f.field.type === "dimension");
      const xFieldLabel = xFieldDef?.field.name;

      const pieData = xKey
        ? data.map(d => ({
            name: d[xKey] != null ? String(d[xKey]) : (xFieldLabel || xKey),
            value: yKeys[0] ? (d[yKeys[0]] ?? 0) : 1,
          }))
        : yKeys.map((k, i) => ({
            name: yMeasureFields[i]?.field.name || k,
            value: data.reduce((s: number, d: any) => s + (d[k] || 0), 0),
          }));

      const validPieData = pieData.filter(d => d.name && d.name !== "undefined");
      const total = validPieData.reduce((s, d) => s + (d.value || 0), 0);

      return (
        <div className="w-full flex flex-col items-center gap-2" dir="rtl">
          <ResponsiveContainer width="100%" height={240}>
            <RePieChart>
              <Pie
                data={validPieData}
                cx="50%" cy="50%"
                innerRadius={68}
                outerRadius={108}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
              >
                {validPieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke={colors.cardBackground}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: any, name: any) => [
                  typeof value === "number" ? value.toLocaleString("fa-IR") : value,
                  name,
                ]}
              />
            </RePieChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 px-4">
            {validPieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="inline-block rounded-full flex-shrink-0"
                  style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span style={{ color: colors.textPrimary, fontSize: 11 }}>{entry.name}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-0.5"
            style={{ color: colors.textPrimary, fontSize: 15, fontFamily: "YekanBakhFaNum, sans-serif", letterSpacing: "0.05em" }}
          >
            {total.toLocaleString("fa-IR")}
          </div>
        </div>
      );
    }

    if (chartType === "scatter") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.border + "80"} />}
            {xKey && <XAxis dataKey={xKey} type="category" tick={{ fontSize: 11, fill: colors.textSecondary }} name={xKey} />}
            <YAxis dataKey={yKeys[0] || "value"} type="number" tick={{ fontSize: 11, fill: colors.textSecondary }} name={yMeasureFields[0]?.field.name || yKeys[0]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
            {showLegend && <Legend />}
            <Scatter
              name={yMeasureFields[0]?.field.name || yKeys[0]}
              data={data}
              fill={COLORS[0]}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.border + "80"} />}
            {xKey && <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: colors.textSecondary }} />}
            <YAxis tick={{ fontSize: 11, fill: colors.textSecondary }} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            {yKeys.length > 0
              ? yKeys.map((k, i) => (
                  <Area key={k} type="monotone" dataKey={k} name={yMeasureFields[i]?.field.name || k}
                    stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length] + "30"} strokeWidth={2} />
                ))
              : <Area type="monotone" dataKey={Object.keys(data[0] || {})[1] || "value"} stroke={COLORS[0]} fill={COLORS[0] + "30"} strokeWidth={2} />
            }
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <ReLineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.border + "80"} />}
            {xKey && <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: colors.textSecondary }} />}
            <YAxis tick={{ fontSize: 11, fill: colors.textSecondary }} />
            <Tooltip contentStyle={tooltipStyle} />
            {showLegend && <Legend />}
            {yKeys.length > 0
              ? yKeys.map((k, i) => (
                  <Line key={k} type="monotone" dataKey={k} name={yMeasureFields[i]?.field.name || k}
                    stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
                ))
              : <Line type="monotone" dataKey={Object.keys(data[0] || {})[1] || "value"} stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
            }
          </ReLineChart>
        </ResponsiveContainer>
      );
    }

    // Bar (default)
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.border + "80"} />}
          {xKey && <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: colors.textSecondary }} />}
          <YAxis tick={{ fontSize: 11, fill: colors.textSecondary }} />
          <Tooltip contentStyle={tooltipStyle} />
          {showLegend && <Legend />}
          {yKeys.length > 0
            ? yKeys.map((k, i) => (
                <Bar key={k} dataKey={k} name={yMeasureFields[i]?.field.name || k}
                  fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))
            : (() => {
                const numericKey = xKey
                  ? Object.keys(data[0] || {}).find(k => k !== xKey && typeof data[0][k] === "number")
                  : Object.keys(data[0] || {})[1];
                return <Bar dataKey={numericKey || "value"} fill={COLORS[0]} radius={[4, 4, 0, 0]} />;
              })()
          }
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div
        className="fixed inset-4 z-[70] rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.backgroundPrimary, borderColor: colors.border }}
        dir="rtl"
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + "15" }}>
              <BarChart3 className="w-5 h-5" style={{ color: colors.primary }} />
            </div>

              <input
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="text-base bg-transparent border-none outline-none w-52"
                style={{ color: colors.textPrimary }} placeholder="عنوان ویجت..."
              />
              <p className="text-[12px]" style={{ color: colors.textSecondary }}>سازنده حرفه‌ای نمودار</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Chart type selector with tooltips */}
            <div className="flex gap-0.5 p-1 rounded-lg" style={{ backgroundColor: colors.backgroundSecondary }}>
              {chartTypes.map(type => {
                const Icon = type.icon;
                const isActive = chartType === type.id;
                return (
                  <button key={type.id} onClick={() => setChartType(type.id as any)} title={type.name}
                    className="p-2 rounded-md transition-all relative group/ct"
                    style={{
                      backgroundColor: isActive ? colors.cardBackground : "transparent",
                      color: isActive ? type.color : colors.textSecondary,
                      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = colors.border;
                        e.currentTarget.style.color = colors.textPrimary;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.textSecondary;
                      }
                    }}>
                    <Icon className="w-[18px] h-[18px]" />
                  </button>
                );
              })}
            </div>
            <div className="w-px h-7" style={{ backgroundColor: colors.border }} />

            {/* Reset button */}
            {totalFieldsUsed > 0 && (
              <button onClick={handleResetAll}
                className="p-2 rounded-lg transition-all"
                title="پاکسازی همه"
                style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = colors.border;
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  e.currentTarget.style.color = colors.textSecondary;
                }}>
                <RotateCcw className="w-[18px] h-[18px]" />
              </button>
            )}

            <button onClick={handleSave} className="px-4 py-2 rounded-lg text-[13px] flex items-center gap-2 transition-all"
              style={{ backgroundColor: colors.primary, color: "#fff" }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = "0.85";
                e.currentTarget.style.boxShadow = `0 2px 8px ${colors.primary}50`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "none";
              }}>
              <Save className="w-[18px] h-[18px]" />
              ذخیره
            </button>
            <button onClick={onClose} className="p-2 rounded-lg transition-all"
              style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = colors.error + "20";
                e.currentTarget.style.color = colors.error;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                e.currentTarget.style.color = colors.textSecondary;
              }}>
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* RIGHT SIDEBAR */}
          <div className="w-72 border-l flex flex-col overflow-hidden flex-shrink-0"
            style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: colors.border }}>
              {[
                { id: "data", name: "داده‌ها", icon: Database },
                { id: "analytics", name: "تحلیل", icon: Calculator },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activePanel === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActivePanel(tab.id as any)}
                    className="flex-1 py-3 text-[13px] transition-all relative"
                    style={{ color: isActive ? colors.primary : colors.textSecondary, backgroundColor: isActive ? colors.cardBackground : "transparent" }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </div>
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary }} />}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto">

              {/* DATA PANEL */}
              {activePanel === "data" && (
                <div className="p-3 space-y-4">
                  {/* Data sources */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[13px]" style={{ color: colors.textPrimary }}>منابع داده</h3>
                      <button onClick={() => setShowJoinDialog(true)}
                        className="flex items-center gap-1 text-[12px] px-2 py-1 rounded"
                        style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                        <Plus className="w-3.5 h-3.5" />
                        افزودن
                      </button>
                    </div>

                    {dataSources.length === 0 ? (
                      <div className="p-4 rounded-xl border-2 border-dashed text-center" style={{ borderColor: colors.border }}>
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: colors.textSecondary }} />
                        <p className="text-[12px] mb-2" style={{ color: colors.textSecondary }}>هیچ منبع داده‌ای اضافه نشده</p>
                        <button onClick={() => setShowJoinDialog(true)}
                          className="text-[12px] px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                          افزودن منبع داده
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {dataSources.map(ds => {
                          const software = softwares.find(s => s.id === ds.softwareId);
                          const table = software?.tables.find(t => t.id === ds.tableId);
                          return (
                            <div key={ds.id} className="p-2.5 rounded-lg border flex items-center gap-2 group cursor-pointer hover:shadow-sm transition-all"
                              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                              onClick={() => { setEditingDataSources(true); setShowJoinDialog(true); }}>
                              <Database className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] truncate" style={{ color: colors.textPrimary }}>{table?.name}</p>
                                <p className="text-[11px] opacity-60 truncate" style={{ color: colors.textSecondary }}>{software?.name}</p>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); setEditingDataSources(true); setShowJoinDialog(true); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                                style={{ color: colors.primary }}>
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDataSources(prev => prev.filter(d => d.id !== ds.id)); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                                style={{ color: colors.error }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Field search */}
                  {allFields.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                      <Search className="w-4 h-4 opacity-40 flex-shrink-0" style={{ color: colors.textSecondary }} />
                      <input value={fieldSearch} onChange={e => setFieldSearch(e.target.value)}
                        placeholder="جستجوی فیلد..."
                        className="flex-1 text-[13px] bg-transparent border-none outline-none"
                        style={{ color: colors.textPrimary }} />
                      {fieldSearch && (
                        <button onClick={() => setFieldSearch("")} style={{ color: colors.textSecondary }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Dimensions */}
                  {dimensions.length > 0 && (
                    <div>
                      <h3 className="text-[12px] mb-2 flex items-center gap-1.5" style={{ color: colors.textPrimary }}>
                        <Type className="w-4 h-4" style={{ color: "#3b82f6" }} />
                        ابعاد
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full mr-auto"
                          style={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}>
                          {dimensions.length}
                        </span>
                      </h3>
                      <div className="space-y-1">
                        {dimensions.map(field => renderFieldItem(field, activeDragField?.id, handleDragStart, handleDragEnd, colors, "#3b82f6", "بعد"))}
                      </div>
                    </div>
                  )}

                  {/* Measures */}
                  {measures.length > 0 && (
                    <div>
                      <h3 className="text-[12px] mb-2 flex items-center gap-1.5" style={{ color: colors.textPrimary }}>
                        <Hash className="w-4 h-4" style={{ color: "#10b981" }} />
                        معیارها
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full mr-auto"
                          style={{ backgroundColor: "#10b98115", color: "#10b981" }}>
                          {measures.length}
                        </span>
                      </h3>
                      <div className="space-y-1">
                        {measures.map(field => renderFieldItem(field, activeDragField?.id, handleDragStart, handleDragEnd, colors, "#10b981", "معیار"))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ANALYTICS PANEL */}
              {activePanel === "analytics" && (
                <div className="p-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] flex items-center gap-1.5" style={{ color: colors.textPrimary }}>
                      <Sigma className="w-4 h-4" style={{ color: colors.primary }} />
                      فیلدهای محاسباتی
                    </h3>
                    <button onClick={() => setShowCalcForm(p => !p)}
                      className="flex items-center gap-1 text-[12px] px-2 py-1 rounded"
                      style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                      <Plus className="w-3.5 h-3.5" />
                      جدید
                    </button>
                  </div>

                  {showCalcForm && (
                    <div className="p-3 rounded-xl border space-y-2.5"
                      style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                      <p className="text-[12px]" style={{ color: colors.textPrimary }}>فیلد محاسباتی جدید</p>
                      <input type="text" value={newCalcName} onChange={e => setNewCalcName(e.target.value)}
                        placeholder="نام فیلد..."
                        className="w-full px-3 py-2 rounded-lg border text-[13px] outline-none"
                        style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }} />
                      <textarea value={newCalcFormula} onChange={e => setNewCalcFormula(e.target.value)}
                        placeholder="مثال: SUM(مقدار) / COUNT(نوع)" rows={2}
                        className="w-full px-3 py-2 rounded-lg border text-[13px] outline-none font-mono resize-none"
                        style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }} />
                      <StyledSelect
                        value={newCalcType}
                        onChange={val => setNewCalcType(val as FieldType)}
                        options={[
                          { value: "measure", label: "معیار (عددی)" },
                          { value: "dimension", label: "بعد (متنی)" },
                        ]}
                        colors={colors}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => {
                          if (!newCalcName.trim()) return;
                          setCalculatedFields(prev => [...prev, { id: "calc-" + Date.now(), name: newCalcName, formula: newCalcFormula, type: newCalcType }]);
                          setNewCalcName(""); setNewCalcFormula(""); setShowCalcForm(false);
                        }} className="flex-1 py-2 rounded-lg text-[13px]"
                          style={{ backgroundColor: colors.primary, color: "#fff" }}>افزودن</button>
                        <button onClick={() => setShowCalcForm(false)}
                          className="px-4 py-2 rounded-lg text-[13px]"
                          style={{ backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}>لغو</button>
                      </div>
                    </div>
                  )}

                  {calculatedFields.length === 0 && !showCalcForm ? (
                    <div className="text-center py-8">
                      <Code2 className="w-10 h-10 mx-auto mb-2 opacity-20" style={{ color: colors.textSecondary }} />
                      <p className="text-[13px] mb-1" style={{ color: colors.textPrimary }}>بدون فیلد محاسباتی</p>
                      <p className="text-[12px] opacity-60" style={{ color: colors.textSecondary }}>فیلدهای سفارشی با فرمول بسازید</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {calculatedFields.map(cf => (
                        <div key={cf.id} className="p-2.5 rounded-lg border group flex items-center gap-2"
                          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                          <Zap className="w-4 h-4 flex-shrink-0" style={{ color: "#f59e0b" }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] truncate" style={{ color: colors.textPrimary }}>{cf.name}</p>
                            <p className="text-[11px] font-mono truncate opacity-60" style={{ color: colors.textSecondary }}>{cf.formula || "بدون فرمول"}</p>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cf.type === "measure" ? "#10b98120" : "#3b82f620", color: cf.type === "measure" ? "#10b981" : "#3b82f6" }}>
                            {cf.type === "measure" ? "معیار" : "بعد"}
                          </span>
                          <button onClick={() => setCalculatedFields(prev => prev.filter(f => f.id !== cf.id))}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                            style={{ color: colors.error }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl border"
                    style={{ backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }}>
                    <p className="text-[12px] mb-2 flex items-center gap-1.5" style={{ color: colors.primary }}>
                      <Info className="w-4 h-4" />
                      تجمیع‌های موجود
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {aggregationTypes.map(a => (
                        <div key={a.id} className="text-[11px] text-center py-1 px-2 rounded-md"
                          style={{ backgroundColor: colors.cardBackground, color: colors.textSecondary }}>{a.name}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* MAIN CANVAS */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Drag hint bar */}
            {activeDragField && (
              <div
                className="flex items-center justify-between gap-3 px-4 py-2 flex-shrink-0 select-none"
                style={{
                  backgroundColor: activeDragField.type === "dimension" ? "#0f172a" : "#052e16",
                  borderBottom: "2px solid " + (activeDragField.type === "dimension" ? "#3b82f650" : "#10b98150"),
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex-shrink-0 flex items-center justify-center w-4 h-4">
                    <span
                      className="absolute inline-flex h-3 w-3 rounded-full opacity-60 animate-ping"
                      style={{ backgroundColor: activeDragField.type === "dimension" ? "#60a5fa" : "#34d399" }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: activeDragField.type === "dimension" ? "#3b82f6" : "#10b981" }}
                    />
                  </span>
                  <span
                    className="text-[13px] px-2 py-0.5 rounded-md flex-shrink-0"
                    style={{
                      backgroundColor: activeDragField.type === "dimension" ? "#1e3a5f" : "#064e3b",
                      color: activeDragField.type === "dimension" ? "#93c5fd" : "#6ee7b7",
                      border: "1px solid " + (activeDragField.type === "dimension" ? "#3b82f650" : "#10b98150"),
                    }}
                  >
                    «{activeDragField.name}»
                  </span>
                  <span className="text-[13px] hidden sm:inline" style={{ color: "#94a3b8" }}>
                    را روی یکی از ناحیه‌های زیر رها کنید
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {[
                    { label: "ابعاد", color: "#93c5fd", bg: "#1e3a5f", border: "#3b82f660" },
                    { label: "مقادیر", color: "#6ee7b7", bg: "#064e3b", border: "#10b98160" },
                  ].map(z => (
                    <span
                      key={z.label}
                      className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: z.bg, color: z.color, border: `1px solid ${z.border}` }}
                    >
                      {z.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SHELVES - collapsible */}
            <div className="border-b flex-shrink-0"
              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
              <div className="flex items-center justify-between px-4 py-2">
                <button onClick={() => setShelvesCollapsed(p => !p)}
                  className="flex items-center gap-1.5 text-[12px]"
                  style={{ color: colors.textSecondary }}>
                  <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: shelvesCollapsed ? "rotate(-90deg)" : "none" }} />
                  شلف‌ها
                  {totalFieldsUsed > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                      {totalFieldsUsed} فیلد
                    </span>
                  )}
                </button>
                {!shelvesCollapsed && totalFieldsUsed > 0 && (
                  <button onClick={handleResetAll}
                    className="text-[11px] px-2 py-1 rounded flex items-center gap-1"
                    style={{ color: colors.error, backgroundColor: colors.error + "10" }}>
                    <RotateCcw className="w-3.5 h-3.5" />
                    پاکسازی
                  </button>
                )}
              </div>

              {!shelvesCollapsed && (
                <div className="px-4 pb-3 space-y-2">
                  {/* Dimensions */}
                  <DropZone label="ابعاد" icon={Layers} fields={columns}
                    onDrop={() => handleDrop("columns")} onRemove={idx => removeFromShelf("columns", idx)}
                    onUpdateAgg={(idx, agg) => updateAggregation("columns", idx, agg)}
                    onClearAll={() => clearShelf("columns")}
                    colors={colors} color="#3b82f6"
                    isDragActive={!!activeDragField}
                    activeDragFieldType={activeDragField?.type}
                    acceptedTypes={["dimension"]} />
                  {/* Values */}
                  <DropZone label="مقادیر" icon={BarChart3} fields={values}
                    onDrop={() => handleDrop("values")} onRemove={idx => removeFromShelf("values", idx)}
                    onUpdateAgg={(idx, agg) => updateAggregation("values", idx, agg)}
                    onClearAll={() => clearShelf("values")}
                    colors={colors} color="#10b981"
                    isDragActive={!!activeDragField}
                    activeDragFieldType={activeDragField?.type}
                    acceptedTypes={["measure"]} />
                </div>
              )}
            </div>

            {/* CANVAS */}
            <div className="flex-1 overflow-auto p-4">
              {hasChartData ? (
                  <div className="h-full rounded-xl border flex flex-col overflow-hidden"
                    style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}>
                    <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: colors.border }}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[15px]" style={{ color: colors.textPrimary }}>{title}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                          {chartTypes.find(c => c.id === chartType)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#f59e0b15", color: "#f59e0b" }}>داده نمونه</span>
                        <button className="p-1.5 rounded-lg"
                          style={{ backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}>
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 p-5 overflow-auto">{renderLiveChart()}</div>
                    <div className="px-5 py-2.5 border-t flex items-center gap-3 text-[12px] flex-wrap"
                      style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
                      {columns.length > 0 && (
                        <span className="text-[12px]" style={{ color: colors.textSecondary }}>
                          <span style={{ color: "#3b82f6" }}>ابعاد: </span>
                          {columns.map(f => f.field.name).join(", ")}
                        </span>
                      )}
                      {values.length > 0 && (
                        <span className="text-[12px]" style={{ color: colors.textSecondary }}>
                          <span style={{ color: "#10b981" }}>مقادیر: </span>
                          {values.map(f => (f.aggregation || "").toUpperCase() + "(" + f.field.name + ")").join(", ")}
                        </span>
                      )}
                      {colorBy && (
                        <span className="text-[12px]" style={{ color: colors.textSecondary }}>
                          <span style={{ color: "#f59e0b" }}>رنگ: </span>
                          {colorBy.field.name}
                        </span>
                      )}
                      {activeFilters.length > 0 && (
                        <span className="text-[12px]" style={{ color: colors.textSecondary }}>
                          <span style={{ color: "#ef4444" }}>فیلتر: </span>
                          {activeFilters.length} فیلتر فعال
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center"
                    style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary, minHeight: 280 }}>
                    <div className="w-full max-w-sm px-6 text-center">
                      <div className="w-full rounded-xl border p-4 mb-5 shadow-sm mx-auto"
                        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                        <div className="flex items-end gap-1.5 h-20 mb-1">
                          {[35, 60, 42, 75, 50, 68, 30, 85, 55, 70].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-sm"
                              style={{ height: h + "%", backgroundColor: currentSchemeColors[i % currentSchemeColors.length], opacity: 0.5 + (i % 3) * 0.15 }} />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-[15px] mb-1" style={{ color: colors.textPrimary }}>پیش‌نمایش نمودار</h3>
                      <p className="text-[13px] leading-relaxed mb-5 opacity-70" style={{ color: colors.textSecondary }}>
                        فیلدها را از پنل داده‌ها به ابعاد و مقادیر بکشید
                      </p>
                      <div className="space-y-2 text-right">
                        {[
                          { num: "۱", title: "افزودن منبع داده", desc: "ابتدا یک منبع داده انتخاب کنید", icon: Database, done: dataSources.length > 0 },
                          { num: "۲", title: "کشیدن فیلدها", desc: "ابعاد و مقادیر را به شلف‌ها بکشید", icon: GripVertical, done: columns.length > 0 || values.length > 0 },
                          { num: "۳", title: "انتخاب مقادیر", desc: "معیارها را به قسمت مقادیر بکشید", icon: Hash, done: values.length > 0 },
                        ].map(step => (
                          <div key={step.num} className="flex items-center gap-3 p-3 rounded-xl border"
                            style={{ backgroundColor: colors.cardBackground, borderColor: step.done ? colors.primary + "40" : colors.border }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px]"
                              style={{ backgroundColor: step.done ? colors.primary : colors.primary + "20", color: step.done ? "#fff" : colors.primary }}>
                              {step.done ? <Check className="w-3.5 h-3.5" /> : step.num}
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px]" style={{ color: step.done ? colors.primary : colors.textPrimary }}>{step.title}</p>
                              <p className="text-[11px] opacity-60" style={{ color: colors.textSecondary }}>{step.desc}</p>
                            </div>
                            <step.icon className="w-4 h-4 flex-shrink-0 opacity-25" style={{ color: colors.textSecondary }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showJoinDialog && (
        <DataSourceDialog
          onAdd={(sw, tbl) => setDataSources(prev => [...prev, { id: "ds-" + Date.now(), softwareId: sw, tableId: tbl }])}
          onClose={() => { setShowJoinDialog(false); setEditingDataSources(false); }}
          colors={colors}
          initialTables={editingDataSources ? dataSources.map(ds => {
            const sw = softwares.find(s => s.id === ds.softwareId);
            const tbl = sw?.tables.find(t => t.id === ds.tableId);
            return {
              softwareId: ds.softwareId,
              tableId: ds.tableId,
              tableName: tbl?.name || "",
              softwareName: sw?.name || "",
              fields: tbl?.fields || [],
            };
          }) : undefined}
          initialJoinLinks={editingDataSources ? (() => {
            const tables = dataSources.map(ds => {
              const sw = softwares.find(s => s.id === ds.softwareId);
              const tbl = sw?.tables.find(t => t.id === ds.tableId);
              return { fields: tbl?.fields || [] };
            });
            const links: JoinLink[] = [];
            for (let i = 1; i < tables.length; i++) {
              const leftFields = tables[i - 1].fields;
              const rightFields = tables[i].fields;
              const commonField = leftFields.find(lf => rightFields.some(rf => rf.id === lf.id));
              links.push({
                leftIdx: i - 1, rightIdx: i,
                type: "inner",
                leftKey: commonField?.id || leftFields[0]?.id || "",
                rightKey: commonField?.id || rightFields[0]?.id || "",
                operator: "=" as JoinOperator,
              });
            }
            return links;
          })() : undefined}
          onConfirmAll={editingDataSources ? (tables, _joinLinks) => {
            setDataSources(tables.map(t => ({
              id: "ds-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
              softwareId: t.softwareId,
              tableId: t.tableId,
            })));
          } : undefined}
        />
      )}
    </div>
  );
}

// ==================== SUB COMPONENTS ====================

// ─── FilterDropZone ───────────────────────────────────────────────────────────

interface FilterDropZoneProps {
  activeFilters: ActiveFilter[];
  onDrop: () => void;
  onRemove: (id: string) => void;
  onUpdateFilter: (id: string, patch: Partial<ActiveFilter>) => void;
  onClearAll: () => void;
  colors: any;
  isDragActive?: boolean;
  activeDragFieldType?: FieldType | null;
  sampleData: Record<string, Record<string, any>[]>;
}

function FilterDropZone({ activeFilters, onDrop, onRemove, onUpdateFilter, onClearAll, colors, isDragActive, activeDragFieldType, sampleData }: FilterDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);

  const isCompatible = !!activeDragFieldType;
  const COLOR = "#ef4444";

  return (
    <div
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop(); }}
      className="rounded-lg border-2 transition-all duration-200 p-2.5"
      style={{
        borderColor: dragOver ? COLOR : (isCompatible && isDragActive ? COLOR + "80" : colors.border),
        backgroundColor: dragOver ? COLOR + "18" : (isCompatible && isDragActive ? COLOR + "0D" : colors.backgroundSecondary),
        borderStyle: dragOver ? "solid" : (isCompatible && isDragActive ? "solid" : "dashed"),
        boxShadow: dragOver ? "0 0 0 3px " + COLOR + "30" : (isCompatible && isDragActive ? "0 0 0 2px " + COLOR + "15" : "none"),
        opacity: isDragActive && !isCompatible ? 0.45 : 1,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Filter className="w-4 h-4" style={{ color: dragOver ? COLOR : (isCompatible && isDragActive ? COLOR : colors.textSecondary) }} />
        <span className="text-[12px]" style={{ color: dragOver ? COLOR : (isCompatible && isDragActive ? COLOR : colors.textPrimary) }}>فیلترها</span>
        {activeFilters.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full mr-1"
            style={{ backgroundColor: COLOR + "15", color: COLOR }}>
            {activeFilters.length}
          </span>
        )}
        {activeFilters.length > 0 && (
          <button onClick={onClearAll} className="mr-auto text-[10px] px-1.5 py-0.5 rounded"
            style={{ color: COLOR, backgroundColor: COLOR + "10" }}>
            پاکسازی
          </button>
        )}
        {isCompatible && isDragActive && activeFilters.length === 0 && !dragOver && (
          <span className="mr-auto text-[10px] px-2 py-0.5 rounded-full animate-pulse"
            style={{ backgroundColor: COLOR + "25", color: COLOR }}>اینجا رها کنید</span>
        )}
      </div>

      {activeFilters.length === 0 ? (
        <div className="text-center py-1.5">
          <p className="text-[11px]" style={{ color: dragOver ? COLOR : (isCompatible && isDragActive ? COLOR : colors.textSecondary), opacity: dragOver ? 1 : (isCompatible && isDragActive ? 0.7 : 0.4) }}>
            {dragOver ? "رها کنید" : "فیلد را اینجا رها کنید"}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 relative">
          {activeFilters.map(af => (
            <FilterPill
              key={af.id}
              filter={af}
              isOpen={openFilterId === af.id}
              onToggleOpen={() => setOpenFilterId(prev => prev === af.id ? null : af.id)}
              onClose={() => setOpenFilterId(null)}
              onRemove={() => { onRemove(af.id); if (openFilterId === af.id) setOpenFilterId(null); }}
              onUpdate={patch => onUpdateFilter(af.id, patch)}
              colors={colors}
              sampleData={sampleData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── label خلاصه فیلتر ──────────────────────────────────────────────────────
function filterSummary(f: ActiveFilter): string {
  switch (f.mode) {
    case "values":
      if (f.selectedValues.length === 0) return "بدون انتخاب";
      return `${f.selectedValues.length} مورد`;
    case "range":
      return `${f.rangeMin ?? "?"} – ${f.rangeMax ?? "?"}`;
    case "text_condition":
      if (!f.textValue) return f.textOperator ?? "شرط";
      return `«${f.textValue}»`;
    case "num_condition": {
      const ops: Record<string, string> = { equals:"=", notEquals:"≠", greater:">", greaterEq:"≥", less:"<", lessEq:"≤", between:"بین" };
      const label = ops[f.numOperator ?? ""] ?? "";
      return f.numOperator === "between"
        ? `${label} ${f.numValue} تا ${f.numValue2}`
        : `${label} ${f.numValue ?? ""}`;
    }
    case "date": {
      const presets: Record<string, string> = { today:"امروز", yesterday:"دیروز", thisWeek:"این هفته", thisMonth:"این ماه", thisQuarter:"این فصل", thisYear:"امسال", custom:"سفارشی" };
      return presets[f.datePreset ?? ""] ?? "تاریخ";
    }
    default: return "فیلتر";
  }
}

const TEXT_OPS: { id: TextOperator; label: string }[] = [
  { id: "contains",    label: "شامل" },
  { id: "notContains", label: "شامل نباشد" },
  { id: "equals",      label: "برابر" },
  { id: "notEquals",   label: "نابرابر" },
  { id: "startsWith",  label: "شروع با" },
  { id: "endsWith",    label: "پایان با" },
];

const NUM_OPS: { id: NumOperator; label: string }[] = [
  { id: "equals",    label: "= برابر" },
  { id: "notEquals", label: "≠ نابرابر" },
  { id: "greater",   label: "> بزرگ‌تر" },
  { id: "greaterEq", label: "≥ بزرگ‌تر یا مساوی" },
  { id: "less",      label: "< کوچک‌تر" },
  { id: "lessEq",    label: "≤ کوچک‌تر یا مساوی" },
  { id: "between",   label: "بین دو مقدار" },
];

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "today",       label: "امروز" },
  { id: "yesterday",   label: "دیروز" },
  { id: "thisWeek",    label: "این هفته" },
  { id: "thisMonth",   label: "این ماه" },
  { id: "thisQuarter", label: "این فصل" },
  { id: "thisYear",    label: "امسال" },
  { id: "custom",      label: "بازه سفارشی" },
];

interface FilterPillProps {
  filter: ActiveFilter;
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<ActiveFilter>) => void;
  colors: any;
  sampleData: Record<string, Record<string, any>[]>;
}

function FilterPill({ filter, isOpen, onToggleOpen, onClose, onRemove, onUpdate, colors, sampleData }: FilterPillProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const pillRef = useRef<HTMLDivElement>(null);
  const isNumber = filter.field.dataType === "number";
  const isDate   = filter.field.dataType === "date";

  const tabs: { id: FilterMode; label: string }[] = isNumber
    ? [{ id: "range", label: "بازه" }, { id: "num_condition", label: "شرط" }, { id: "values", label: "مقادیر" }]
    : isDate
      ? [{ id: "date", label: "تاریخ" }]
      : [{ id: "values", label: "مقادیر" }, { id: "text_condition", label: "شرط متنی" }];

  const allValues = useMemo(() => {
    const raw = sampleData[filter.field.sourceTable] || [];
    const key = filter.field.id.split(".").pop()!;
    return Array.from(new Set(raw.map((d: any) => String(d[key] ?? "")))).filter(Boolean) as string[];
  }, [filter.field, sampleData]);

  const numStats = useMemo(() => {
    if (!isNumber) return null;
    const raw = sampleData[filter.field.sourceTable] || [];
    const key = filter.field.id.split(".").pop()!;
    const nums = raw.map((d: any) => Number(d[key])).filter(v => !isNaN(v));
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }, [filter.field, sampleData, isNumber]);

  const filteredValues = searchTerm ? allValues.filter(v => v.includes(searchTerm)) : allValues;
  const allSelected = filter.selectedValues.length === allValues.length;

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [isOpen, onClose]);

  const pill_bg  = "#ef4444";
  const pill_bg2 = "#ef444415";

  const inputCls = "w-full px-3 py-2 rounded-lg border text-[13px] outline-none";
  const inputStyle = { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary };

  return (
    <div ref={pillRef} className="relative">
      <div
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border group text-[12px] cursor-pointer select-none transition-all"
        style={{ backgroundColor: colors.cardBackground, borderColor: "#ef444450" }}
        onClick={onToggleOpen}
      >
        <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: pill_bg }} />
        <span style={{ color: colors.textPrimary }}>{filter.field.name}</span>
        <span className="text-[10px] px-1 rounded" style={{ backgroundColor: pill_bg2, color: pill_bg }}>
          {filterSummary(filter)}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-40 transition-transform" style={{ color: colors.textSecondary, transform: isOpen ? "rotate(180deg)" : "none" }} />
        <button onClick={e => { e.stopPropagation(); onRemove(); }}
          className="opacity-0 group-hover:opacity-100 transition-all"
          style={{ color: pill_bg }}><X className="w-3 h-3" /></button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 z-50 rounded-2xl border shadow-2xl"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border, width: 300 }}
          dir="rtl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary + "cc", borderRadius: "16px 16px 0 0" }}>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: pill_bg }} />
              <span className="text-[13px]" style={{ color: colors.textPrimary }}>فیلتر: {filter.field.name}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-md hover:opacity-60 transition-opacity" style={{ color: colors.textSecondary }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs */}
          {tabs.length > 1 && (
            <div className="flex gap-1.5 px-4 pt-2.5">
              {tabs.map(t => (
                <button key={t.id} onClick={() => onUpdate({ mode: t.id })}
                  className="flex-1 py-1.5 rounded-lg text-[12px] transition-all"
                  style={{
                    backgroundColor: filter.mode === t.id ? pill_bg : colors.backgroundSecondary,
                    color: filter.mode === t.id ? "#fff" : colors.textSecondary,
                  }}>{t.label}</button>
              ))}
            </div>
          )}

          {/* ── Values Tab ── */}
          {filter.mode === "values" && (
            <div>
              <div className="px-3 pt-2">
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border"
                  style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                  <Search className="w-3 h-3 opacity-40 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder="جستجو..."
                    className="flex-1 text-[10px] bg-transparent border-none outline-none"
                    style={{ color: colors.textPrimary }} />
                  {searchTerm && <button onClick={() => setSearchTerm("")} style={{ color: colors.textSecondary }}><X className="w-2.5 h-2.5" /></button>}
                </div>
              </div>

              <div className="px-3 pt-1.5">
                <button onClick={() => onUpdate({ selectedValues: allSelected ? [] : [...allValues] })}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded-xl text-[10px] transition-all"
                  style={{ backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}>
                  <div className="w-3 h-3 rounded-md border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: allSelected ? pill_bg : colors.border, backgroundColor: allSelected ? pill_bg : "transparent" }}>
                    {allSelected && <Check className="w-2 h-2 text-white" />}
                  </div>
                  {allSelected ? "لغو انتخاب همه" : "انتخاب همه"}
                </button>
              </div>

              <div className="mx-3 my-1 h-px" style={{ backgroundColor: colors.border }} />

              <div className="px-3 pb-2 space-y-0.5 max-h-40 overflow-y-auto custom-scroll">
                {filteredValues.length === 0
                  ? <p className="text-[9px] text-center py-3 opacity-40" style={{ color: colors.textSecondary }}>نتیجه‌ای یافت نشد</p>
                  : filteredValues.map(val => {
                    const checked = filter.selectedValues.includes(val);
                    return (
                      <button key={val}
                        onClick={() => onUpdate({ selectedValues: checked ? filter.selectedValues.filter(v => v !== val) : [...filter.selectedValues, val] })}
                        className="w-full flex items-center gap-2 px-2 py-1 rounded-xl text-[10px] transition-all text-right"
                        style={{ backgroundColor: checked ? pill_bg + "12" : "transparent", color: checked ? pill_bg : colors.textPrimary }}>
                        <div className="w-3 h-3 rounded-md border flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: checked ? pill_bg : colors.border, backgroundColor: checked ? pill_bg : "transparent" }}>
                          {checked && <Check className="w-2 h-2 text-white" />}
                        </div>
                        <span className="flex-1 truncate">{val}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── Range Tab ── */}
          {filter.mode === "range" && (
            <div className="px-3 pt-2.5 pb-2 space-y-2">
              {numStats && (
                <p className="text-[9px] opacity-50 text-center" style={{ color: colors.textSecondary }}>
                  بازه کل: {numStats.min} تا {numStats.max}
                </p>
              )}
              <div className="space-y-1.5">
                <label className="block text-[9px]" style={{ color: colors.textSecondary }}>حداقل</label>
                <input type="number"
                  value={filter.rangeMin ?? ""}
                  onChange={e => onUpdate({ rangeMin: e.target.value !== "" ? Number(e.target.value) : undefined })}
                  placeholder={`حداقل${numStats ? ` (${numStats.min})` : ""}`}
                  className={inputCls} style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px]" style={{ color: colors.textSecondary }}>حداکثر</label>
                <input type="number"
                  value={filter.rangeMax ?? ""}
                  onChange={e => onUpdate({ rangeMax: e.target.value !== "" ? Number(e.target.value) : undefined })}
                  placeholder={`حداکثر${numStats ? ` (${numStats.max})` : ""}`}
                  className={inputCls} style={inputStyle} />
              </div>
              <div className="flex flex-wrap gap-1">
                {numStats && [
                  { label: "ربع اول", min: numStats.min, max: numStats.min + (numStats.max - numStats.min) * 0.25 },
                  { label: "نیمه اول", min: numStats.min, max: numStats.min + (numStats.max - numStats.min) * 0.5 },
                  { label: "همه", min: numStats.min, max: numStats.max },
                ].map(p => (
                  <button key={p.label}
                    onClick={() => onUpdate({ rangeMin: Math.round(p.min), rangeMax: Math.round(p.max) })}
                    className="text-[8px] px-1.5 py-0.5 rounded-full transition-all"
                    style={{ backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Text Condition Tab ── */}
          {filter.mode === "text_condition" && (
            <div className="px-3 pt-2.5 pb-2 space-y-2">
              <div>
                <label className="block text-[9px] mb-1" style={{ color: colors.textSecondary }}>عملگر</label>
                <div className="grid grid-cols-2 gap-1">
                  {TEXT_OPS.map(op => (
                    <button key={op.id}
                      onClick={() => onUpdate({ textOperator: op.id })}
                      className="py-1 rounded-lg text-[9px] transition-all"
                      style={{
                        backgroundColor: filter.textOperator === op.id ? pill_bg : colors.backgroundSecondary,
                        color: filter.textOperator === op.id ? "#fff" : colors.textSecondary,
                      }}>{op.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] mb-1" style={{ color: colors.textSecondary }}>مقدار</label>
                <input value={filter.textValue ?? ""}
                  onChange={e => onUpdate({ textValue: e.target.value })}
                  placeholder="متن مورد نظر..."
                  className={inputCls} style={inputStyle} />
              </div>
            </div>
          )}

          {/* ── Num Condition Tab ── */}
          {filter.mode === "num_condition" && (
            <div className="px-3 pt-2.5 pb-2 space-y-2">
              <div>
                <label className="block text-[9px] mb-1" style={{ color: colors.textSecondary }}>عملگر</label>
                <div className="space-y-0.5">
                  {NUM_OPS.map(op => (
                    <button key={op.id}
                      onClick={() => onUpdate({ numOperator: op.id })}
                      className="w-full text-right py-1 px-2 rounded-lg text-[10px] transition-all"
                      style={{
                        backgroundColor: filter.numOperator === op.id ? pill_bg + "15" : "transparent",
                        color: filter.numOperator === op.id ? pill_bg : colors.textSecondary,
                        border: `1px solid ${filter.numOperator === op.id ? pill_bg + "50" : "transparent"}`,
                      }}>{op.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <input type="number"
                  value={filter.numValue ?? ""}
                  onChange={e => onUpdate({ numValue: e.target.value !== "" ? Number(e.target.value) : undefined })}
                  placeholder={filter.numOperator === "between" ? "از مقدار..." : "مقدار..."}
                  className={inputCls} style={inputStyle} />
                {filter.numOperator === "between" && (
                  <input type="number"
                    value={filter.numValue2 ?? ""}
                    onChange={e => onUpdate({ numValue2: e.target.value !== "" ? Number(e.target.value) : undefined })}
                    placeholder="تا مقدار..."
                    className={inputCls} style={inputStyle} />
                )}
              </div>
            </div>
          )}

          {/* ── Date Tab ── */}
          {filter.mode === "date" && (
            <div className="px-3 pt-2.5 pb-2 space-y-2">
              <div>
                <label className="block text-[9px] mb-1" style={{ color: colors.textSecondary }}>بازه زمانی</label>
                <div className="grid grid-cols-2 gap-1">
                  {DATE_PRESETS.filter(p => p.id !== "custom").map(p => (
                    <button key={p.id}
                      onClick={() => onUpdate({ datePreset: p.id })}
                      className="py-1 rounded-xl text-[9px] transition-all"
                      style={{
                        backgroundColor: filter.datePreset === p.id ? pill_bg : colors.backgroundSecondary,
                        color: filter.datePreset === p.id ? "#fff" : colors.textSecondary,
                      }}>{p.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onUpdate({ datePreset: "custom" })}
                  className="w-full py-1 rounded-xl text-[9px] transition-all"
                  style={{
                    backgroundColor: filter.datePreset === "custom" ? pill_bg : colors.backgroundSecondary,
                    color: filter.datePreset === "custom" ? "#fff" : colors.textSecondary,
                  }}>بازه سفارشی</button>
              </div>

              {filter.datePreset === "custom" && (
                <div className="space-y-1.5 pt-1">
                  <div>
                    <label className="block text-[9px] mb-0.5" style={{ color: colors.textSecondary }}>از تاریخ</label>
                    <input type="date"
                      value={filter.dateFrom ?? ""}
                      onChange={e => onUpdate({ dateFrom: e.target.value })}
                      className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[9px] mb-0.5" style={{ color: colors.textSecondary }}>تا تاریخ</label>
                    <input type="date"
                      value={filter.dateTo ?? ""}
                      onChange={e => onUpdate({ dateTo: e.target.value })}
                      className={inputCls} style={inputStyle} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Apply Button */}
          <div className="px-4 pb-3 pt-2">
            <button onClick={onClose}
              className="w-full py-2 rounded-xl text-[13px] transition-all hover:opacity-90"
              style={{ backgroundColor: pill_bg, color: "#fff" }}>
              اعمال فیلتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────���───────────────────���────────────────────────────────────────────────────

interface DropZoneProps {
  label: string;
  icon: any;
  fields: DroppedField[];
  onDrop: () => void;
  onRemove: (index: number) => void;
  onUpdateAgg?: (index: number, agg: AggregationType) => void;
  onClearAll?: () => void;
  colors: any;
  color: string;
  isDragActive?: boolean;
  activeDragFieldType?: FieldType | null;
  acceptedTypes?: FieldType[];
}

function DropZone({ label, icon: Icon, fields, onDrop, onRemove, onUpdateAgg, onClearAll, colors, color, activeDragFieldType, acceptedTypes }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const isCompatible = activeDragFieldType
    ? !acceptedTypes || acceptedTypes.includes(activeDragFieldType)
    : false;
  const isDragging = !!activeDragFieldType;

  return (
    <div
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop(); }}
      className="rounded-lg border-2 transition-all duration-200 p-2.5"
      style={{
        borderColor: dragOver ? color : (isCompatible ? color + "80" : colors.border),
        backgroundColor: dragOver ? color + "18" : (isCompatible ? color + "0D" : colors.backgroundSecondary),
        borderStyle: dragOver ? "solid" : (isCompatible ? "solid" : "dashed"),
        boxShadow: dragOver ? "0 0 0 3px " + color + "30" : (isCompatible ? "0 0 0 2px " + color + "15" : "none"),
        opacity: isDragging && !isCompatible ? 0.45 : 1,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-4 h-4" style={{ color: dragOver ? color : (isCompatible ? color : colors.textSecondary) }} />
        <span className="text-[12px]" style={{ color: dragOver ? color : (isCompatible ? color : colors.textPrimary) }}>{label}</span>
        {fields.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full mr-1"
            style={{ backgroundColor: color + "15", color }}>
            {fields.length}
          </span>
        )}
        {fields.length > 0 && onClearAll && (
          <button onClick={onClearAll} className="mr-auto text-[10px] px-1.5 py-0.5 rounded"
            style={{ color, backgroundColor: color + "10" }}>
            پاکسازی
          </button>
        )}
        {isCompatible && fields.length === 0 && !dragOver && (
          <span className="mr-auto text-[10px] px-2 py-0.5 rounded-full animate-pulse"
            style={{ backgroundColor: color + "25", color }}>اینجا رها کنید</span>
        )}
      </div>
      {fields.length === 0 ? (
        <div className="text-center py-1.5">
          <p className="text-[11px]" style={{ color: dragOver ? color : (isCompatible ? color : colors.textSecondary), opacity: dragOver ? 1 : (isCompatible ? 0.7 : 0.4) }}>
            {dragOver ? "رها کنید" : "فیلد را اینجا رها کنید"}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {fields.map((field, idx) => (
            <FieldPill key={idx} field={field} onRemove={() => onRemove(idx)}
              onUpdateAgg={onUpdateAgg ? agg => onUpdateAgg(idx, agg) : undefined}
              colors={colors} accentColor={color} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FieldPillProps {
  field: DroppedField;
  onRemove: () => void;
  onUpdateAgg?: (agg: AggregationType) => void;
  colors: any;
  accentColor?: string;
}

function FieldPill({ field, onRemove, onUpdateAgg, colors, accentColor }: FieldPillProps) {
  const [showAggMenu, setShowAggMenu] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  // Close agg menu on outside click
  useEffect(() => {
    if (!showAggMenu) return;
    const handler = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setShowAggMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAggMenu]);

  return (
    <div ref={pillRef} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border group relative text-[12px]"
      style={{ backgroundColor: colors.cardBackground, borderColor: accentColor ? accentColor + "40" : colors.border }}>
      {field.field.type === "measure" && field.aggregation && onUpdateAgg && (
        <button onClick={() => setShowAggMenu(m => !m)}
          className="px-1 rounded uppercase text-[10px]"
          style={{ backgroundColor: colors.primary + "20", color: colors.primary }}>
          {field.aggregation}
        </button>
      )}
      <span style={{ color: colors.textPrimary }}>{field.field.name}</span>
      <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-all" style={{ color: colors.error }}>
        <X className="w-3.5 h-3.5" />
      </button>
      {showAggMenu && onUpdateAgg && (
        <div className="absolute top-full right-0 mt-1 py-1 rounded-xl border shadow-xl z-20 min-w-[120px]"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
          {aggregationTypes.map(agg => (
            <button key={agg.id} onClick={() => { onUpdateAgg(agg.id); setShowAggMenu(false); }}
              className="w-full px-3 py-1.5 text-right text-[12px] flex items-center gap-2 transition-all"
              style={{
                backgroundColor: field.aggregation === agg.id ? colors.primary + "10" : "transparent",
                color: field.aggregation === agg.id ? colors.primary : colors.textPrimary,
              }}>
              {field.aggregation === agg.id && <Check className="w-3.5 h-3.5" />}
              {agg.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Venn Diagram SVG Icons for Join Types ─────────────────────────────────
function JoinIcon({ type, size = 32, active = false, colors }: { type: string; size?: number; active?: boolean; colors: any }) {
  const r = size * 0.32;
  const cx1 = size * 0.38;
  const cx2 = size * 0.62;
  const cy = size * 0.5;
  const fillColor = active ? "#2563eb" : colors.textSecondary;
  const dimColor = active ? "#2563eb30" : colors.border;
  const uid = `join-${type}-${size}-${active ? "a" : "i"}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id={uid}>
          <circle cx={cx1} cy={cy} r={r} />
        </clipPath>
      </defs>
      {type === "inner" && (
        <g>
          <circle cx={cx1} cy={cy} r={r} fill="none" stroke={dimColor} strokeWidth={1.5} />
          <circle cx={cx2} cy={cy} r={r} fill="none" stroke={dimColor} strokeWidth={1.5} />
          <circle cx={cx2} cy={cy} r={r} fill={fillColor} opacity={0.5} clipPath={`url(#${uid})`} />
        </g>
      )}
      {type === "left" && (
        <g>
          <circle cx={cx1} cy={cy} r={r} fill={fillColor} opacity={0.5} />
          <circle cx={cx2} cy={cy} r={r} fill="none" stroke={dimColor} strokeWidth={1.5} />
        </g>
      )}
      {type === "right" && (
        <g>
          <circle cx={cx1} cy={cy} r={r} fill="none" stroke={dimColor} strokeWidth={1.5} />
          <circle cx={cx2} cy={cy} r={r} fill={fillColor} opacity={0.5} />
        </g>
      )}
      {type === "full" && (
        <g>
          <circle cx={cx1} cy={cy} r={r} fill={fillColor} opacity={0.5} />
          <circle cx={cx2} cy={cy} r={r} fill={fillColor} opacity={0.5} />
        </g>
      )}
    </svg>
  );
}

// ─── StyledSelect ──────────────────────────────────────────────────────────────
function StyledSelect({ value, onChange, options, colors, placeholder, className, compact, icon }: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  colors: any;
  placeholder?: string;
  className?: string;
  compact?: boolean;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Also check if click is on the fixed dropdown
        const dropdowns = document.querySelectorAll('[data-styled-select-dropdown]');
        let clickedDropdown = false;
        dropdowns.forEach(dd => { if (dd.contains(e.target as Node)) clickedDropdown = true; });
        if (!clickedDropdown) setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    } else if (!isOpen) {
      setDropPos(null);
    }
  }, [isOpen]);

  const selected = options.find(o => o.value === value);
  const sz = compact ? "text-[11px]" : "text-[12px]";
  const py = compact ? "py-1.5" : "py-2";

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 px-2.5 ${py} rounded-lg border ${sz} outline-none transition-all duration-150`}
        style={{
          backgroundColor: isOpen ? colors.primary + "08" : colors.backgroundSecondary,
          borderColor: isOpen ? colors.primary : colors.border,
          color: selected ? colors.textPrimary : colors.textSecondary,
          boxShadow: isOpen ? `0 0 0 3px ${colors.primary}15` : "none",
        }}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1 text-right truncate">
          {selected?.label || placeholder || "انتخاب..."}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: isOpen ? colors.primary : colors.textSecondary + "80" }}
        />
      </button>

      {isOpen && dropPos && (
        <div
          data-styled-select-dropdown="true"
          dir="rtl"
          style={{
            position: "fixed",
            top: dropPos.top,
            left: dropPos.left,
            width: dropPos.width,
            zIndex: 10001,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.cardBackground,
            boxShadow: `0 4px 16px rgba(0,0,0,0.12)`,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          <div className="py-1">
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 ${py} ${sz} text-right transition-all duration-100`}
                  style={{
                    backgroundColor: isActive ? colors.primary + "12" : "transparent",
                    color: isActive ? colors.primary : colors.textPrimary,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.primary }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface TableauJoinEntry {
  softwareId: string;
  tableId: string;
  tableName: string;
  softwareName: string;
  fields: { id: string; name: string; dataType: string }[];
}

type JoinOperator = "=" | "!=" | "<" | "<=" | ">" | ">=";

const joinOperators: { id: JoinOperator; label: string }[] = [
  { id: "=", label: "مساوی  =" },
  { id: "!=", label: "نامساوی  ≠" },
  { id: "<", label: "کوچک‌تر  <" },
  { id: "<=", label: "کوچک‌تر مساوی  ≤" },
  { id: ">", label: "بزرگ‌تر  >" },
  { id: ">=", label: "بزرگ‌تر مساوی  ≥" },
];

interface JoinCondition {
  leftKey: string;
  rightKey: string;
  operator: JoinOperator;
}

interface JoinLink {
  leftIdx: number;
  rightIdx: number;
  type: "inner" | "left" | "right" | "full";
  leftKey: string;
  rightKey: string;
  operator: JoinOperator;
  extraConditions?: JoinCondition[];
}

function DataSourceDialog({ onAdd, onClose, colors, initialTables, initialJoinLinks, onConfirmAll }: {
  onAdd: (softwareId: string, tableId: string) => void;
  onClose: () => void;
  colors: any;
  initialTables?: TableauJoinEntry[];
  initialJoinLinks?: JoinLink[];
  onConfirmAll?: (tables: TableauJoinEntry[], joinLinks: JoinLink[]) => void;
}) {
  const [addedTables, setAddedTables] = useState<TableauJoinEntry[]>(initialTables || []);
  const [joinLinks, setJoinLinks] = useState<JoinLink[]>(initialJoinLinks || []);
  const [activeJoinIdx, setActiveJoinIdx] = useState<number | null>(null);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [pickerSoftware, setPickerSoftware] = useState("");
  const [pickerSearch, setPickerSearch] = useState("");
  const [showAliases, setShowAliases] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [tablePanelHeight, setTablePanelHeight] = useState(280);
  const [columnFilters, setColumnFilters] = useState<Record<string, { operator: string; value: string }[]>>({});
  const [openColFilter, setOpenColFilter] = useState<string | null>(null);
  const [colFilterOp, setColFilterOp] = useState<string>("equals");
  const [colFilterVal, setColFilterVal] = useState("");
  const colFilterRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const delta = dragStartYRef.current - e.clientY;
      const newHeight = Math.max(80, Math.min(window.innerHeight - 250, dragStartHeightRef.current + delta));
      setTablePanelHeight(newHeight);
    };
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = tablePanelHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleAddTable = (swId: string, tblId: string) => {
    const sw = softwares.find(s => s.id === swId);
    const tbl = sw?.tables.find(t => t.id === tblId);
    if (!sw || !tbl) return;
    const newEntry: TableauJoinEntry = {
      softwareId: swId,
      tableId: tblId,
      tableName: tbl.name,
      softwareName: sw.name,
      fields: tbl.fields,
    };
    setAddedTables(prev => {
      const next = [...prev, newEntry];
      if (next.length >= 2) {
        const li = next.length - 2;
        const ri = next.length - 1;
        const leftFields = next[li].fields;
        const rightFields = next[ri].fields;
        const commonField = leftFields.find(lf => rightFields.some(rf => rf.id === lf.id));
        setJoinLinks(prevJ => [...prevJ, {
          leftIdx: li, rightIdx: ri,
          type: commonField ? "inner" : "full",
          leftKey: commonField?.id || leftFields[0]?.id || "",
          rightKey: commonField?.id || rightFields[0]?.id || "",
          operator: "=" as JoinOperator,
        }]);
      }
      return next;
    });
    setShowTablePicker(false);
    setPickerSoftware("");
    setPickerSearch("");
  };

  const removeTable = (idx: number) => {
    setAddedTables(prev => prev.filter((_, i) => i !== idx));
    setJoinLinks(prev => prev.filter(j => j.leftIdx !== idx && j.rightIdx !== idx).map(j => ({
      ...j,
      leftIdx: j.leftIdx > idx ? j.leftIdx - 1 : j.leftIdx,
      rightIdx: j.rightIdx > idx ? j.rightIdx - 1 : j.rightIdx,
    })));
    setActiveJoinIdx(null);
  };

  const updateJoinLink = (idx: number, patch: Partial<JoinLink>) => {
    setJoinLinks(prev => prev.map((j, i) => i === idx ? { ...j, ...patch } : j));
  };

  const previewData = useMemo(() => {
    if (addedTables.length === 0) return { headers: [] as string[], rows: [] as Record<string, any>[] };
    const firstTable = addedTables[0];
    let data = (sampleData[firstTable.tableId] || []).map(row => {
      const mapped: Record<string, any> = {};
      firstTable.fields.forEach(f => { mapped[`${firstTable.tableName}.${f.name}`] = row[f.id]; });
      return mapped;
    });

    for (let ji = 0; ji < joinLinks.length; ji++) {
      const link = joinLinks[ji];
      const rightTable = addedTables[link.rightIdx];
      if (!rightTable) continue;
      const rightData = sampleData[rightTable.tableId] || [];
      const leftKeyName = addedTables[link.leftIdx]?.fields.find(f => f.id === link.leftKey)?.name;
      const rightKeyField = rightTable.fields.find(f => f.id === link.rightKey);
      if (!leftKeyName || !rightKeyField) continue;
      const leftFullKey = `${addedTables[link.leftIdx].tableName}.${leftKeyName}`;

      const newData: Record<string, any>[] = [];
      if (link.type === "inner") {
        data.forEach(leftRow => {
          rightData.forEach(rr => {
            if (String(leftRow[leftFullKey]) === String(rr[link.rightKey])) {
              const merged = { ...leftRow };
              rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = rr[f.id]; });
              newData.push(merged);
            }
          });
        });
      } else if (link.type === "left") {
        data.forEach(leftRow => {
          const matches = rightData.filter(rr => String(leftRow[leftFullKey]) === String(rr[link.rightKey]));
          if (matches.length === 0) {
            const merged = { ...leftRow };
            rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = null; });
            newData.push(merged);
          } else {
            matches.forEach(rr => {
              const merged = { ...leftRow };
              rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = rr[f.id]; });
              newData.push(merged);
            });
          }
        });
      } else if (link.type === "right") {
        rightData.forEach(rr => {
          const matches = data.filter(lr => String(lr[leftFullKey]) === String(rr[link.rightKey]));
          if (matches.length === 0) {
            const merged: Record<string, any> = {};
            Object.keys(data[0] || {}).forEach(k => { merged[k] = null; });
            rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = rr[f.id]; });
            newData.push(merged);
          } else {
            matches.forEach(lr => {
              const merged = { ...lr };
              rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = rr[f.id]; });
              newData.push(merged);
            });
          }
        });
      } else {
        const usedRight = new Set<number>();
        data.forEach(leftRow => {
          const matches = rightData.map((rr, ri) => ({ rr, ri })).filter(({ rr }) => String(leftRow[leftFullKey]) === String(rr[link.rightKey]));
          if (matches.length === 0) {
            const merged = { ...leftRow };
            rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = null; });
            newData.push(merged);
          } else {
            matches.forEach(({ rr, ri }) => {
              usedRight.add(ri);
              const merged = { ...leftRow };
              rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = rr[f.id]; });
              newData.push(merged);
            });
          }
        });
        rightData.forEach((rr, ri) => {
          if (!usedRight.has(ri)) {
            const merged: Record<string, any> = {};
            Object.keys(data[0] || {}).forEach(k => { merged[k] = null; });
            rightTable.fields.forEach(f => { merged[`${rightTable.tableName}.${f.name}`] = rr[f.id]; });
            newData.push(merged);
          }
        });
      }
      data = newData;
    }

    const headers: string[] = [];
    addedTables.forEach(t => { t.fields.forEach(f => { headers.push(`${t.tableName}.${f.name}`); }); });
    return { headers, rows: data };
  }, [addedTables, joinLinks]);

  // ── Column filter operators ──
  const colFilterOperators = [
    { value: "equals", label: "مساوی" },
    { value: "notEquals", label: "نامساوی" },
    { value: "contains", label: "شامل" },
    { value: "greaterThan", label: "بزرگ‌تر از" },
    { value: "greaterThanOrEqual", label: "بزرگ‌تر یا مساوی" },
    { value: "lessThan", label: "کوچک‌تر از" },
    { value: "lessThanOrEqual", label: "کمتر یا مساوی" },
    { value: "isEmpty", label: "خالی" },
    { value: "isNotEmpty", label: "غیرخالی" },
  ];

  const applyColumnFilter = (header: string) => {
    if (!colFilterVal.trim() && !["isEmpty", "isNotEmpty"].includes(colFilterOp)) return;
    setColumnFilters(prev => ({
      ...prev,
      [header]: [...(prev[header] || []), { operator: colFilterOp, value: colFilterVal.trim() }],
    }));
    setColFilterVal("");
    setColFilterOp("equals");
  };

  const removeColumnFilter = (header: string, idx: number) => {
    setColumnFilters(prev => {
      const arr = [...(prev[header] || [])];
      arr.splice(idx, 1);
      const next = { ...prev };
      if (arr.length === 0) delete next[header]; else next[header] = arr;
      return next;
    });
  };

  const clearAllColumnFilters = () => setColumnFilters({});

  const totalFilterCount = Object.values(columnFilters).reduce((s, arr) => s + arr.length, 0);

  const filteredRows = useMemo(() => {
    let rows = previewData.rows;
    for (const [header, filters] of Object.entries(columnFilters)) {
      for (const f of filters) {
        rows = rows.filter(row => {
          const raw = row[header];
          const val = raw != null ? String(raw) : "";
          const numVal = parseFloat(val);
          const numFilter = parseFloat(f.value);
          switch (f.operator) {
            case "equals": return val === f.value;
            case "notEquals": return val !== f.value;
            case "contains": return val.includes(f.value);
            case "greaterThan": return !isNaN(numVal) && !isNaN(numFilter) && numVal > numFilter;
            case "greaterThanOrEqual": return !isNaN(numVal) && !isNaN(numFilter) && numVal >= numFilter;
            case "lessThan": return !isNaN(numVal) && !isNaN(numFilter) && numVal < numFilter;
            case "lessThanOrEqual": return !isNaN(numVal) && !isNaN(numFilter) && numVal <= numFilter;
            case "isEmpty": return raw == null || val === "";
            case "isNotEmpty": return raw != null && val !== "";
            default: return true;
          }
        });
      }
    }
    return rows;
  }, [previewData.rows, columnFilters]);

  // Close column filter popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colFilterRef.current && !colFilterRef.current.contains(e.target as Node)) {
        setOpenColFilter(null);
      }
    };
    if (openColFilter) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openColFilter]);

  const handleConfirm = () => {
    if (onConfirmAll) {
      onConfirmAll(addedTables, joinLinks);
    } else {
      addedTables.forEach(t => { onAdd(t.softwareId, t.tableId); });
    }
    onClose();
  };

  const joinTypeLabels: { id: JoinLink["type"]; name: string }[] = [
    { id: "inner", name: "داخلی" },
    { id: "left", name: "چپ" },
    { id: "right", name: "راست" },
    { id: "full", name: "کامل" },
  ];

  return (
    <div>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div
        className="fixed inset-6 z-[90] rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.backgroundPrimary, borderColor: colors.border }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5" style={{ color: colors.primary }} />
            <span className="text-[14px] font-medium" style={{ color: colors.textPrimary }}>
              {addedTables.length > 0
                ? (onConfirmAll ? "ویرایش: " : "") + addedTables.map(t => t.tableName).join(" + ")
                : "منبع داده جدید"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            
            <div className="w-px h-5" style={{ backgroundColor: colors.border }} />
            <span className="text-[12px]" style={{ color: colors.textSecondary }}>
              فیلترها <span className="px-1.5 py-0.5 rounded text-[11px]" style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>0</span>
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg"
              style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas: Table Boxes + Join Connectors */}
        <div className="flex-1 border-b relative overflow-hidden"
          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border, minHeight: 100 }}>
          <div className="px-5 py-5 overflow-x-auto">
            <div className="flex items-center gap-0 min-w-max">
              {addedTables.map((tbl, idx) => (
                <div key={idx} className="contents">
                  <div
                    className="relative px-4 py-2.5 rounded-lg border shadow-sm min-w-[140px] group"
                    style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
                  >
                    <button onClick={() => removeTable(idx)}
                      className="absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      style={{ backgroundColor: colors.error, color: "#fff" }}>
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>{tbl.tableName}</p>
                    <p className="text-[10px] opacity-50" style={{ color: colors.textSecondary }}>{tbl.softwareName}</p>
                  </div>

                  {idx < addedTables.length - 1 && (() => {
                    const jIdx = joinLinks.findIndex(j => j.leftIdx === idx && j.rightIdx === idx + 1);
                    return (
                      <div className="flex items-center mx-1">
                        <div className="w-8 h-px" style={{ backgroundColor: colors.border }} />
                        <button
                          onClick={() => setActiveJoinIdx(activeJoinIdx === jIdx ? null : jIdx)}
                          className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110"
                          style={{
                            backgroundColor: activeJoinIdx === jIdx ? colors.primary + "15" : colors.cardBackground,
                            borderColor: activeJoinIdx === jIdx ? colors.primary : colors.border,
                          }}
                        >
                          <JoinIcon type={joinLinks[jIdx]?.type || "inner"} size={24} active={activeJoinIdx === jIdx} colors={colors} />
                        </button>
                        <div className="w-8 h-px" style={{ backgroundColor: colors.border }} />
                      </div>
                    );
                  })()}
                </div>
              ))}

              <div className="mr-2">
                {addedTables.length === 0 ? (
                  <button
                    onClick={() => setShowTablePicker(!showTablePicker)}
                    className="px-5 py-3.5 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all hover:border-solid min-w-[160px]"
                    style={{
                      borderColor: showTablePicker ? colors.primary : colors.primary + "40",
                      color: colors.primary,
                      backgroundColor: showTablePicker ? colors.primary + "08" : "transparent",
                    }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: colors.primary + "12" }}>
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[12px]">افزودن جدول</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTablePicker(!showTablePicker)}
                    className="flex items-center gap-0 transition-all hover:scale-[1.03] active:scale-[0.98]"
                    style={{ color: colors.primary }}
                  >
                    {/* Connector line */}
                    <div className="w-6 h-px flex-shrink-0" style={{ backgroundColor: colors.border }} />
                    {/* Join circle */}
                    <div className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: showTablePicker ? colors.primary : colors.primary + "50",
                        backgroundColor: showTablePicker ? colors.primary + "12" : "transparent",
                      }}>
                      <Plus className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                    </div>
                    {/* Connector line */}
                    <div className="w-4 h-px flex-shrink-0" style={{ backgroundColor: colors.border }} />
                    {/* Card */}
                    <div className="px-3.5 py-2 rounded-lg border-2 border-dashed flex items-center gap-2 transition-all"
                      style={{
                        borderColor: showTablePicker ? colors.primary : colors.primary + "40",
                        backgroundColor: showTablePicker ? colors.primary + "08" : colors.cardBackground + "80",
                      }}>
                      <Database className="w-3.5 h-3.5 opacity-60" />
                      <span className="text-[12px] whitespace-nowrap">Join با جدول جدید</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Join Config Popup - rendered outside overflow container */}
          {activeJoinIdx !== null && activeJoinIdx >= 0 && joinLinks[activeJoinIdx] && (
            <div>
              <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setActiveJoinIdx(null)}>
              <div
                className="relative z-[10000] rounded-xl border shadow-2xl"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  width: 380,
                }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b"
                  style={{ borderColor: colors.border }}>
                  <span className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>
                    تنظیمات Join
                  </span>
                  <button onClick={() => setActiveJoinIdx(null)}
                    className="p-1 rounded-md transition-all"
                    style={{ color: colors.textSecondary }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2 px-4 py-3">
                  {joinTypeLabels.map(jt => {
                    const isActive = joinLinks[activeJoinIdx].type === jt.id;
                    return (
                      <button key={jt.id}
                        onClick={() => updateJoinLink(activeJoinIdx, { type: jt.id })}
                        className="flex flex-col items-center gap-1.5 flex-1 py-2.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: isActive ? colors.primary + "12" : "transparent",
                          border: `1.5px solid ${isActive ? colors.primary : colors.border}`,
                        }}>
                        <JoinIcon type={jt.id} size={32} active={isActive} colors={colors} />
                        <span className="text-[11px]" style={{ color: isActive ? colors.primary : colors.textSecondary }}>{jt.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-4 h-px" style={{ backgroundColor: colors.border }} />

                <div className="px-4 py-3 space-y-3">
                  <p className="text-[11px]" style={{ color: colors.textSecondary }}>شرط اتصال (Join Clause)</p>

                  {/* Primary condition */}
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                    <div>
                      <label className="block text-[10px] mb-1.5" style={{ color: colors.textSecondary }}>
                        {addedTables[joinLinks[activeJoinIdx].leftIdx]?.tableName}
                      </label>
                      <StyledSelect
                        value={joinLinks[activeJoinIdx].leftKey}
                        onChange={val => updateJoinLink(activeJoinIdx, { leftKey: val })}
                        options={(addedTables[joinLinks[activeJoinIdx].leftIdx]?.fields || []).map(f => ({ value: f.id, label: f.name }))}
                        colors={colors}
                        placeholder="انتخاب فیلد..."
                      />
                    </div>
                    <StyledSelect
                      value={joinLinks[activeJoinIdx].operator || "="}
                      onChange={val => updateJoinLink(activeJoinIdx, { operator: val as JoinOperator })}
                      options={joinOperators.map(op => ({ value: op.id, label: op.label }))}
                      colors={colors}
                      className="min-w-[120px]"
                    />
                    <div>
                      <label className="block text-[10px] mb-1.5" style={{ color: colors.textSecondary }}>
                        {addedTables[joinLinks[activeJoinIdx].rightIdx]?.tableName}
                      </label>
                      <StyledSelect
                        value={joinLinks[activeJoinIdx].rightKey}
                        onChange={val => updateJoinLink(activeJoinIdx, { rightKey: val })}
                        options={(addedTables[joinLinks[activeJoinIdx].rightIdx]?.fields || []).map(f => ({ value: f.id, label: f.name }))}
                        colors={colors}
                        placeholder="انتخاب فیلد..."
                      />
                    </div>
                  </div>

                  {/* Extra conditions */}
                  {(joinLinks[activeJoinIdx].extraConditions || []).map((ec, ecIdx) => (
                    <div key={ecIdx} className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
                      <StyledSelect
                        value={ec.leftKey}
                        onChange={val => {
                          const extras = [...(joinLinks[activeJoinIdx].extraConditions || [])];
                          extras[ecIdx] = { ...extras[ecIdx], leftKey: val };
                          updateJoinLink(activeJoinIdx, { extraConditions: extras });
                        }}
                        options={(addedTables[joinLinks[activeJoinIdx].leftIdx]?.fields || []).map(f => ({ value: f.id, label: f.name }))}
                        colors={colors}
                        placeholder="انتخاب فیلد..."
                      />
                      <StyledSelect
                        value={ec.operator || "="}
                        onChange={val => {
                          const extras = [...(joinLinks[activeJoinIdx].extraConditions || [])];
                          extras[ecIdx] = { ...extras[ecIdx], operator: val as JoinOperator };
                          updateJoinLink(activeJoinIdx, { extraConditions: extras });
                        }}
                        options={joinOperators.map(op => ({ value: op.id, label: op.label }))}
                        colors={colors}
                        className="min-w-[120px]"
                      />
                      <StyledSelect
                        value={ec.rightKey}
                        onChange={val => {
                          const extras = [...(joinLinks[activeJoinIdx].extraConditions || [])];
                          extras[ecIdx] = { ...extras[ecIdx], rightKey: val };
                          updateJoinLink(activeJoinIdx, { extraConditions: extras });
                        }}
                        options={(addedTables[joinLinks[activeJoinIdx].rightIdx]?.fields || []).map(f => ({ value: f.id, label: f.name }))}
                        colors={colors}
                        placeholder="انتخاب فیلد..."
                      />
                      <button
                        onClick={() => {
                          const extras = [...(joinLinks[activeJoinIdx].extraConditions || [])];
                          extras.splice(ecIdx, 1);
                          updateJoinLink(activeJoinIdx, { extraConditions: extras });
                        }}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: colors.textSecondary }}
                        onMouseEnter={e => { e.currentTarget.style.color = colors.error; e.currentTarget.style.backgroundColor = colors.error + "10"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = colors.textSecondary; e.currentTarget.style.backgroundColor = "transparent"; }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button className="text-[11px] flex items-center gap-1.5 py-1"
                    style={{ color: colors.primary }}
                    onClick={() => {
                      const extras = [...(joinLinks[activeJoinIdx].extraConditions || [])];
                      extras.push({ leftKey: "", rightKey: "", operator: "=" });
                      updateJoinLink(activeJoinIdx, { extraConditions: extras });
                    }}>
                    <Plus className="w-3 h-3" />
                    افزودن شرط Join جدید
                  </button>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Table Picker Dropdown */}
          {showTablePicker && (() => {
            const filteredSoftwares = softwares.map(s => ({
              ...s,
              tables: s.tables.filter(t =>
                !pickerSearch || t.name.includes(pickerSearch) || s.name.includes(pickerSearch)
              ),
            })).filter(s => s.tables.length > 0);

            const alreadyAdded = new Set(addedTables.map(t => t.tableId));

            return (
              <div>
                <div className="fixed inset-0 z-[99]" onClick={() => { setShowTablePicker(false); setPickerSoftware(""); setPickerSearch(""); }} />
                <div
                  className="absolute z-[100] rounded-xl border shadow-2xl overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    width: 340,
                    maxHeight: "calc(100% - 32px)",
                    top: 16,
                    left: 16,
                  }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
                    style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.primary + "12" }}>
                        <Database className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="text-[13px]" style={{ color: colors.textPrimary }}>
                          {addedTables.length === 0 ? "افزودن جدول" : "Join با جدول جدید"}
                        </p>
                        <p className="text-[10px]" style={{ color: colors.textSecondary }}>
                          یک منبع داده انتخاب کنید
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setShowTablePicker(false); setPickerSoftware(""); setPickerSearch(""); }}
                      className="p-1 rounded-md transition-colors hover:opacity-80"
                      style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="px-3 pt-3 pb-2 flex-shrink-0">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                      <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textSecondary }} />
                      <input
                        type="text"
                        value={pickerSearch}
                        onChange={e => setPickerSearch(e.target.value)}
                        placeholder="جستجوی جدول..."
                        className="flex-1 bg-transparent outline-none text-[12px] text-right"
                        style={{ color: colors.textPrimary }}
                        autoFocus
                      />
                      {pickerSearch && (
                        <button onClick={() => setPickerSearch("")} style={{ color: colors.textSecondary }}>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Software & Tables List */}
                  <div className="flex-1 overflow-y-auto px-3 pb-3" style={{ maxHeight: 320 }}>
                    {filteredSoftwares.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Search className="w-8 h-8 mb-2 opacity-15" style={{ color: colors.textSecondary }} />
                        <p className="text-[12px]" style={{ color: colors.textSecondary }}>نتیجه‌ای یافت نشد</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredSoftwares.map(sw => (
                          <div key={sw.id}>
                            {/* Software Header */}
                            <button
                              onClick={() => setPickerSoftware(pickerSoftware === sw.id ? "" : sw.id)}
                              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors text-right"
                              style={{
                                backgroundColor: pickerSoftware === sw.id ? colors.primary + "08" : "transparent",
                              }}
                            >
                              <ChevronDown
                                className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                                style={{
                                  color: colors.textSecondary,
                                  transform: pickerSoftware === sw.id ? "rotate(0deg)" : "rotate(90deg)",
                                }}
                              />
                              <Layers className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.primary + "90" }} />
                              <span className="flex-1 text-[12px]" style={{ color: colors.textPrimary }}>{sw.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md"
                                style={{ backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}>
                                {sw.tables.length}
                              </span>
                            </button>

                            {/* Tables */}
                            {pickerSoftware === sw.id && (
                              <div className="mr-4 mt-1 mb-2 space-y-1 border-r-2 pr-2"
                                style={{ borderColor: colors.primary + "20" }}>
                                {sw.tables.map(t => {
                                  const isAdded = alreadyAdded.has(t.id);
                                  const numFields = t.fields.filter(f => f.dataType === "number").length;
                                  const strFields = t.fields.length - numFields;
                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => !isAdded && handleAddTable(sw.id, t.id)}
                                      disabled={isAdded}
                                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-right group"
                                      style={{
                                        backgroundColor: isAdded ? colors.backgroundSecondary + "80" : colors.backgroundSecondary,
                                        opacity: isAdded ? 0.55 : 1,
                                        cursor: isAdded ? "default" : "pointer",
                                      }}
                                    >
                                      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
                                        style={{
                                          backgroundColor: isAdded ? colors.success + "15" : colors.primary + "10",
                                        }}>
                                        {isAdded ? (
                                          <Check className="w-3.5 h-3.5" style={{ color: colors.success }} />
                                        ) : (
                                          <TableIcon className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[12px] truncate" style={{ color: colors.textPrimary }}>
                                          {t.name}
                                          {isAdded && <span className="text-[10px] mr-1" style={{ color: colors.success }}>(اضافه شده)</span>}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-[10px] flex items-center gap-0.5" style={{ color: "#3b82f6" }}>
                                            <Type className="w-2.5 h-2.5" /> {strFields}
                                          </span>
                                          <span className="text-[10px] flex items-center gap-0.5" style={{ color: "#10b981" }}>
                                            <Hash className="w-2.5 h-2.5" /> {numFields}
                                          </span>
                                        </div>
                                      </div>
                                      {!isAdded && (
                                        <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                          style={{ color: colors.primary }} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2 border-t flex-shrink-0"
                    style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
                    <p className="text-[10px] flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <Info className="w-3 h-3 flex-shrink-0" />
                      ابتدا نرم‌افزار را باز کنید، سپس جدول مورد نظر را انتخاب کنید
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleResizeStart}
          className="flex-shrink-0 flex items-center justify-center cursor-row-resize group relative"
          style={{ height: 8, backgroundColor: colors.backgroundSecondary, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}
        >
          <div
            className="w-10 h-1 rounded-full transition-all group-hover:w-14 group-hover:h-1.5"
            style={{ backgroundColor: colors.textSecondary + "40" }}
          />
          <div className="absolute inset-x-0 -top-2 -bottom-2" />
        </div>

        {/* Toolbar + Data Preview Table (resizable) */}
        <div className="flex flex-col flex-shrink-0" style={{ height: tablePanelHeight }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-2 border-b flex-shrink-0"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <TableIcon className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} />
                <span className="text-[12px]" style={{ color: colors.textSecondary }}>مرتب‌سازی فیلدها</span>
                <StyledSelect
                  value="source"
                  onChange={() => {}}
                  options={[
                    { value: "source", label: "ترتیب منبع داده" },
                    { value: "alpha", label: "الفبایی" },
                  ]}
                  colors={colors}
                  compact
                  className="w-[140px]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              
              
              <span className="text-[12px] px-2 py-0.5 rounded"
                style={{ backgroundColor: colors.primary + "10", color: colors.primary }}>
                {totalFilterCount > 0
                  ? `${filteredRows.length} از ${previewData.rows.length} ردیف`
                  : `${previewData.rows.length} ردیف`}
              </span>
              {totalFilterCount > 0 && (
                <button
                  onClick={clearAllColumnFilters}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-all"
                  style={{ backgroundColor: colors.error + "15", color: colors.error }}>
                  <X className="w-3 h-3" />
                  حذف فیلترها ({totalFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Badges */}
          {totalFilterCount > 0 && (
            <div className="flex items-center gap-2 px-5 py-1.5 border-b flex-shrink-0 flex-wrap"
              style={{ backgroundColor: colors.primary + "05", borderColor: colors.border }}>
              <Filter className="w-3 h-3 flex-shrink-0" style={{ color: colors.primary }} />
              {Object.entries(columnFilters).map(([header, filters]) => {
                const fieldName = header.split(".").slice(1).join(".");
                return filters.map((cf, fi) => (
                  <div key={`${header}-${fi}`}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                    style={{ backgroundColor: colors.primary + "12", color: colors.primary }}>
                    <span className="font-medium">{fieldName}</span>
                    <span style={{ opacity: 0.7 }}>{colFilterOperators.find(o => o.value === cf.operator)?.label}</span>
                    {cf.value && <span>«{cf.value}»</span>}
                    <button onClick={() => removeColumnFilter(header, fi)} className="p-0.5 rounded-full hover:bg-white/30">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ));
              })}
            </div>
          )}

          {/* Data Preview Table */}
          <div className="flex-1 overflow-auto relative" style={{ backgroundColor: colors.cardBackground }}>
          {previewData.headers.length > 0 ? (
            <table className="w-full text-[12px] border-collapse" dir="rtl">
              <thead className="sticky top-0 z-10">
                <tr>
                  {previewData.headers.map((h, i) => {
                    const parts = h.split(".");
                    const tableName = parts[0];
                    const fieldName = parts.slice(1).join(".");
                    const tableEntry = addedTables.find(t => t.tableName === tableName);
                    const fieldDef = tableEntry?.fields.find(f => f.name === fieldName);
                    const isNum = fieldDef?.dataType === "number";
                    const hasFilter = (columnFilters[h]?.length || 0) > 0;
                    return (
                      <th key={i} className="px-3 py-2 text-right border-b border-l whitespace-nowrap relative"
                        style={{
                          backgroundColor: hasFilter ? colors.primary + "08" : colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1 py-0.5 rounded"
                            style={{
                              backgroundColor: isNum ? "#10b98115" : "#3b82f615",
                              color: isNum ? "#10b981" : "#3b82f6",
                            }}>
                            {isNum ? "#" : "Abc"}
                          </span>
                          <div className="flex flex-col flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              setOpenColFilter(openColFilter === h ? null : h);
                              setColFilterOp("equals");
                              setColFilterVal("");
                            }}>
                            <span className="text-[10px] opacity-40" style={{ color: colors.textSecondary }}>{tableName}</span>
                            <span className="text-[12px] flex items-center gap-1">
                              {fieldName}
                              {hasFilter && (
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] text-white"
                                  style={{ backgroundColor: colors.primary }}>
                                  {columnFilters[h].length}
                                </span>
                              )}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenColFilter(openColFilter === h ? null : h);
                              setColFilterOp("equals");
                              setColFilterVal("");
                            }}
                            className="p-0.5 rounded transition-all"
                            style={{ color: hasFilter ? colors.primary : colors.textSecondary + "60" }}>
                            <Filter className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Column Filter Popup */}
                        {openColFilter === h && (() => {
                          const canApplyFilter = ["isEmpty", "isNotEmpty"].includes(colFilterOp) || colFilterVal.trim();
                          return (
                          <div className="contents">
                          <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setOpenColFilter(null)}>
                          <div
                            ref={colFilterRef}
                            onClick={e => e.stopPropagation()}
                            dir="rtl"
                            style={{
                              position: "relative",
                              zIndex: 10000,
                              width: 320,
                              display: "flex",
                              flexDirection: "column",
                              borderRadius: 16,
                              border: `1px solid ${colors.border}`,
                              backgroundColor: colors.cardBackground,
                              boxShadow: `0 8px 32px ${colors.textPrimary}15, 0 0 0 1px ${colors.border}`,
                            }}>

                            {/* Header */}
                            <div style={{ position: "relative", overflow: "hidden" }}>
                              <div style={{ position: "absolute", inset: 0, opacity: 0.04, background: `linear-gradient(135deg, ${colors.primary}, transparent 70%)` }} />
                              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${colors.border}` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primary + "12" }}>
                                    <Filter style={{ width: 14, height: 14, color: colors.primary }} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>فیلتر ستون</span>
                                    <span style={{ fontSize: 10, color: colors.textSecondary }}>{fieldName}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setOpenColFilter(null)}
                                  style={{ padding: 6, borderRadius: 8, color: colors.textSecondary, border: "none", background: "transparent", cursor: "pointer" }}
                                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.backgroundSecondary; }}
                                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                                  <X style={{ width: 16, height: 16 }} />
                                </button>
                              </div>
                            </div>

                            {/* Active filters */}
                            {hasFilter && (
                              <div style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.primary + "03", display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                  <span style={{ fontSize: 10, fontWeight: 500, color: colors.textSecondary }}>
                                    فیلترهای فعال ({columnFilters[h].length})
                                  </span>
                                  <button
                                    onClick={() => { setColumnFilters(prev => { const n = { ...prev }; delete n[h]; return n; }); }}
                                    style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, color: colors.error, border: "none", background: "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.error + "10"; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                                    حذف همه
                                  </button>
                                </div>
                                {columnFilters[h].map((cf, fi) => (
                                  <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, padding: "6px 10px", borderRadius: 8, backgroundColor: colors.primary + "08", border: `1px solid ${colors.primary}15` }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, backgroundColor: colors.primary }} />
                                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: colors.textPrimary }}>
                                      <span style={{ color: colors.primary }}>{colFilterOperators.find(o => o.value === cf.operator)?.label}</span>
                                      {cf.value && <span style={{ marginRight: 4 }}>«{cf.value}»</span>}
                                    </span>
                                    <button
                                      onClick={() => removeColumnFilter(h, fi)}
                                      style={{ padding: 2, borderRadius: 4, color: colors.textSecondary, border: "none", background: "transparent", cursor: "pointer" }}
                                      onMouseEnter={e => { e.currentTarget.style.color = colors.error; }}
                                      onMouseLeave={e => { e.currentTarget.style.color = colors.textSecondary; }}>
                                      <X style={{ width: 12, height: 12 }} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* New filter form */}
                            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: colors.textSecondary }}>نوع مقایسه</label>
                                <StyledSelect
                                  value={colFilterOp}
                                  onChange={val => setColFilterOp(val)}
                                  options={colFilterOperators.map(op => ({ value: op.value, label: op.label }))}
                                  colors={colors}
                                />
                              </div>
                              {!["isEmpty", "isNotEmpty"].includes(colFilterOp) && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: colors.textSecondary }}>مقدار</label>
                                  <input
                                    type="text"
                                    value={colFilterVal}
                                    onChange={e => setColFilterVal(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") applyColumnFilter(h); }}
                                    placeholder="مقدار فیلتر را وارد کنید..."
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      boxSizing: "border-box",
                                      padding: "10px 12px",
                                      borderRadius: 8,
                                      border: `1px solid ${colors.border}`,
                                      fontSize: 12,
                                      outline: "none",
                                      backgroundColor: colors.backgroundSecondary,
                                      color: colors.textPrimary,
                                      direction: "rtl",
                                    }}
                                    onFocus={e => {
                                      e.currentTarget.style.borderColor = colors.primary;
                                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}15`;
                                    }}
                                    onBlur={e => {
                                      e.currentTarget.style.borderColor = colors.border;
                                      e.currentTarget.style.boxShadow = "none";
                                    }}
                                    autoFocus
                                  />
                                </div>
                              )}
                              <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                                <button
                                  onClick={() => applyColumnFilter(h)}
                                  disabled={!canApplyFilter}
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    padding: "10px 16px",
                                    borderRadius: 12,
                                    fontSize: 12,
                                    color: "white",
                                    border: "none",
                                    cursor: canApplyFilter ? "pointer" : "not-allowed",
                                    background: canApplyFilter
                                      ? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`
                                      : colors.textSecondary + "30",
                                    boxShadow: canApplyFilter ? `0 2px 8px ${colors.primary}30` : "none",
                                  }}
                                  onMouseEnter={e => { if (canApplyFilter) e.currentTarget.style.opacity = "0.9"; }}
                                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                                  <Plus style={{ width: 14, height: 14 }} />
                                  اعمال فیلتر
                                </button>
                                <button
                                  onClick={() => setOpenColFilter(null)}
                                  style={{ padding: "10px 16px", borderRadius: 12, fontSize: 12, border: "none", cursor: "pointer", backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}
                                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.border; }}
                                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = colors.backgroundSecondary; }}>
                                  بستن
                                </button>
                              </div>
                            </div>
                          </div>
                          </div>
                          </div>
                          );
                        })()}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredRows.slice(0, 50).map((row, ri) => (
                  <tr key={ri}
                    style={{ backgroundColor: ri % 2 === 0 ? colors.cardBackground : colors.backgroundSecondary }}>
                    {previewData.headers.map((h, ci) => (
                      <td key={ci} className="px-3 py-1.5 border-b border-l whitespace-nowrap"
                        style={{ borderColor: colors.border + "60", color: row[h] == null ? colors.textSecondary + "60" : colors.textPrimary }}>
                        {row[h] != null ? String(row[h]) : "null"}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredRows.length === 0 && previewData.rows.length > 0 && (
                  <tr>
                    <td colSpan={previewData.headers.length} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="w-6 h-6 opacity-20" style={{ color: colors.textSecondary }} />
                        <p className="text-[12px]" style={{ color: colors.textSecondary }}>هیچ ردیفی با فیلترهای اعمال‌شده مطابقت ندارد</p>
                        <button onClick={clearAllColumnFilters}
                          className="text-[11px] px-3 py-1 rounded-lg"
                          style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                          حذف همه فیلترها
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
              <Database className="w-12 h-12 mb-3 opacity-15" style={{ color: colors.textSecondary }} />
              <p className="text-[14px] mb-1" style={{ color: colors.textPrimary }}>هیچ جدولی اضافه نشده</p>
              <p className="text-[12px] opacity-50" style={{ color: colors.textSecondary }}>
                از دکمه «افزودن جدول» برای شروع استفاده کنید
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t flex-shrink-0"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
          <div className="flex items-center gap-2 text-[12px]" style={{ color: colors.textSecondary }}>
            {addedTables.length > 0 && (
              <span>{addedTables.length} جدول{joinLinks.length > 0 ? ` \u00b7 ${joinLinks.length} Join` : ""}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px]"
              style={{ backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }}>
              انصراف
            </button>
            <button
              onClick={handleConfirm}
              disabled={addedTables.length === 0}
              className="px-5 py-2 rounded-lg text-[13px] flex items-center gap-2"
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
                opacity: addedTables.length === 0 ? 0.5 : 1,
              }}>
              <Check className="w-4 h-4" />
              {onConfirmAll ? "ذخیره تغییرات" : "تأیید و افزودن"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
