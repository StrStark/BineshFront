import { useState, useEffect } from "react";
import { X, BarChart3, PieChart, LineChart, Activity, TrendingUp, Save, Table, Filter, Plus, Trash2, Database, RefreshCw, Clock } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { Progress } from "../ui/progress";

export interface CustomWidgetData {
  id: string;
  title: string;
  chartType: "bar" | "line" | "pie" | "area" | "radar" | "table";
  dataSource: "system";
  systemConfig: {
    softwareId: string;
    tableId: string;
    labelField: string;
    valueField: string;
    conditions: Array<{
      id: string;
      field: string;
      operator: string;
      value: string;
    }>;
  };
  autoUpdate?: {
    enabled: boolean;
    interval: number; // in seconds
  };
  // Legacy support for renderer
  apiConfig?: {
    endpoint: string;
    labelField: string;
    valueField: string;
  };
}

interface CustomWidgetBuilderProps {
  onSave: (widget: CustomWidgetData) => void;
  onClose: () => void;
  editWidget?: CustomWidgetData;
}

const chartTypes = [
  { id: "bar", name: "نمودار میله‌ای", icon: BarChart3 },
  { id: "line", name: "نمودار خطی", icon: LineChart },
  { id: "pie", name: "نمودار دایره‌ای", icon: PieChart },
  { id: "area", name: "نمودار منطقه‌ای", icon: Activity },
  { id: "radar", name: "نمودار رادار", icon: TrendingUp },
  { id: "table", name: "جدول", icon: Table },
];

// Definition of softwares, tables and fields
const softwares = [
  {
    id: "data_panel",
    name: "پنل مدیریت داده",
    tables: [
      {
        id: "sales_summary",
        name: "خلاصه فروش",
        fields: [
          { id: "type", name: "نوع" },
          { id: "value", name: "مقدار" },
          { id: "returned", name: "برگشتی" },
        ],
      },
      {
        id: "top_selling_products",
        name: "محصولات پرفروش",
        fields: [
          { id: "productName", name: "نام محصول" },
          { id: "count", name: "تعداد" },
          { id: "totalAmount", name: "مبلغ کل" },
          { id: "growth", name: "رشد" },
        ],
      },
      {
        id: "products_list",
        name: "لیست محصولات",
        fields: [
          { id: "productName", name: "نام محصول" },
          { id: "totalSale", name: "کل فروش" },
          { id: "priceUnit", name: "قیمت واحد" },
          { id: "stock", name: "موجودی" },
        ],
      },
      {
        id: "customers_list",
        name: "لیست مشتریان",
        fields: [
          { id: "customerName", name: "نام مشتری" },
          { id: "totalPurchase", name: "کل خرید" },
          { id: "lastPurchase", name: "آخرین خرید" },
        ],
      },
      {
        id: "financial_summary",
        name: "خلاصه مالی",
        fields: [
          { id: "category", name: "دسته‌بندی" },
          { id: "amount", name: "مبلغ" },
        ],
      },
      {
        id: "exhibition_visits",
        name: "بازدید نمایشگاه",
        fields: [
          { id: "date", name: "تاریخ" },
          { id: "count", name: "تعداد بازدید" },
          { id: "converted", name: "تبدیل شده" },
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
          { id: "day", name: "روز هفته" },
          { id: "calls", name: "تعداد تماس" },
        ],
      },
      {
        id: "agents_performance",
        name: "عملکرد کارشناسان",
        fields: [
          { id: "agentName", name: "نام کارشناس" },
          { id: "callsAnswered", name: "پاسخ داده شده" },
          { id: "avgDuration", name: "میانگین مکالمه" },
          { id: "satisfaction", name: "رضایت" },
        ],
      },
      {
        id: "queue_status",
        name: "وضعیت صف",
        fields: [
          { id: "queueName", name: "نام صف" },
          { id: "waiting", name: "در انتظار" },
          { id: "avgWait", name: "میانگین انتظار" },
        ],
      },
    ],
  },
];

const operators = [
  { id: "equals", name: "برابر است با" },
  { id: "contains", name: "شامل" },
  { id: "greater", name: "بزرگتر از" },
  { id: "less", name: "کوچکتر از" },
];

export function CustomWidgetBuilder({ onSave, onClose, editWidget }: CustomWidgetBuilderProps) {
  const colors = useCurrentColors();
  const [title, setTitle] = useState(editWidget?.title || "");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area" | "radar" | "table">(editWidget?.chartType || "bar");
  
  // System Data State
  const initialSoftwareId = editWidget?.systemConfig?.softwareId || "";
  const initialTableId = editWidget?.systemConfig?.tableId || "";
  const initialLabelField = editWidget?.systemConfig?.labelField || "";
  const initialValueField = editWidget?.systemConfig?.valueField || "";
  
  const [selectedSoftware, setSelectedSoftware] = useState(initialSoftwareId);
  const [selectedTable, setSelectedTable] = useState(initialTableId);
  const [selectedLabelField, setSelectedLabelField] = useState(initialLabelField);
  const [selectedValueField, setSelectedValueField] = useState(initialValueField);
  
  const [conditions, setConditions] = useState<Array<{ id: string; field: string; operator: string; value: string }>>(
    editWidget?.systemConfig?.conditions || []
  );

  // Auto Update State
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(editWidget?.autoUpdate?.enabled || false);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState(editWidget?.autoUpdate?.interval || 60);
  
  // Simulation Progress for Builder Preview
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  useEffect(() => {
    if (!autoUpdateEnabled) {
      setSimulatedProgress(0);
      return;
    }
    
    // Simulate progress loop for visual feedback in settings
    const interval = setInterval(() => {
      setSimulatedProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, [autoUpdateEnabled]);


  // Conditions Functions
  const addCondition = () => {
    setConditions([...conditions, { id: Date.now().toString(), field: "", operator: "equals", value: "" }]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, key: "field" | "operator" | "value", value: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("لطفاً عنوان ویجت را وارد کنید");
      return;
    }

    if (!selectedSoftware || !selectedTable || !selectedLabelField || !selectedValueField) {
      alert("لطفاً تنظیمات منبع داده را کامل کنید");
      return;
    }

    const widget: CustomWidgetData = {
      id: editWidget ? editWidget.id : `custom-${Date.now()}`,
      title,
      chartType,
      dataSource: "system",
      systemConfig: {
        softwareId: selectedSoftware,
        tableId: selectedTable,
        labelField: selectedLabelField,
        valueField: selectedValueField,
        conditions
      },
      autoUpdate: {
        enabled: autoUpdateEnabled,
        interval: autoUpdateInterval,
      },
      apiConfig: { 
        endpoint: selectedTable,
        labelField: selectedLabelField,
        valueField: selectedValueField,
      },
    };

    onSave(widget);
  };

  // Helper to get available options
  const activeSoftware = softwares.find(s => s.id === selectedSoftware);
  const activeTable = activeSoftware?.tables.find(t => t.id === selectedTable);
  const activeFields = activeTable?.fields || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
        dir="rtl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {editWidget ? "ویرایش ویجت سفارشی" : "ساخت ویجت سفارشی"}
                </h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {editWidget ? "تغییرات خود را اعمال کنید" : "نمودار دلخواه خود را بسازید"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: colors.textSecondary }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* عنوان ویجت */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                عنوان ویجت
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: فروش ماهانه"
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              />
            </div>

            {/* نوع نمودار */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                نوع نمودار
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chartTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = chartType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setChartType(type.id as any)}
                      className="p-4 rounded-lg border transition-all"
                      style={{
                        backgroundColor: isSelected ? `${colors.primary}15` : colors.backgroundSecondary,
                        borderColor: isSelected ? colors.primary : colors.border,
                      }}
                    >
                      <Icon
                        className="w-6 h-6 mx-auto mb-2"
                        style={{ color: isSelected ? colors.primary : colors.textSecondary }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: isSelected ? colors.primary : colors.textPrimary }}
                      >
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* منبع داده */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4" style={{ color: colors.primary }} />
                <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  منبع داده
                </label>
              </div>

              {/* Data Source Configuration */}
              <div className="space-y-4 p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: `${colors.backgroundSecondary}50` }}>
                
                {/* مرحله ۱: انتخاب نرم‌افزار */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    ۱. انتخاب نرم‌افزار
                  </label>
                  <select
                    value={selectedSoftware}
                    onChange={(e) => {
                      setSelectedSoftware(e.target.value);
                      setSelectedTable("");
                      setSelectedLabelField("");
                      setSelectedValueField("");
                    }}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="">نرم‌افزار را انتخاب کنید...</option>
                    {softwares.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* مرحله ۲: انتخاب جدول */}
                <div className={!selectedSoftware ? "opacity-50 pointer-events-none" : ""}>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    ۲. انتخاب جدول اطلاعاتی
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => {
                      setSelectedTable(e.target.value);
                      setSelectedLabelField("");
                      setSelectedValueField("");
                    }}
                    disabled={!selectedSoftware}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="">جدول را انتخاب کنید...</option>
                    {activeSoftware?.tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* مرحله ۳: انتخاب ستون‌ها */}
                <div className={!selectedTable ? "opacity-50 pointer-events-none" : ""}>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    ۳. انتخاب ستون‌های نمودار
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs mb-1 block opacity-70" style={{ color: colors.textSecondary }}>ستون عنوان (محور X)</span>
                      <select
                        value={selectedLabelField}
                        onChange={(e) => setSelectedLabelField(e.target.value)}
                        disabled={!selectedTable}
                        className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">انتخاب کنید...</option>
                        {activeFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-xs mb-1 block opacity-70" style={{ color: colors.textSecondary }}>ستون مقدار (محور Y)</span>
                      <select
                        value={selectedValueField}
                        onChange={(e) => setSelectedValueField(e.target.value)}
                        disabled={!selectedTable}
                        className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">انتخاب کنید...</option>
                        {activeFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* مرحله ۴: شرط‌ها و فیلترها */}
                <div className={!selectedTable ? "opacity-50 pointer-events-none" : ""}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                      ۴. شروط و فیلترها (اختیاری)
                    </label>
                    <button
                      onClick={addCondition}
                      className="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary,
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      افزودن شرط
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {conditions.length === 0 && (
                      <div className="text-center py-4 border rounded-lg border-dashed" style={{ borderColor: colors.border }}>
                        <Filter className="w-4 h-4 mx-auto mb-1 opacity-50" style={{ color: colors.textSecondary }} />
                        <span className="text-xs opacity-70" style={{ color: colors.textSecondary }}>هیچ شرطی تعریف نشده است</span>
                      </div>
                    )}
                    
                    {conditions.map((condition) => (
                      <div key={condition.id} className="flex gap-2 p-2 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
                        <select
                          value={condition.field}
                          onChange={(e) => updateCondition(condition.id, "field", e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded border outline-none text-xs"
                          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.textPrimary }}
                        >
                          <option value="">انتخاب فیلد...</option>
                          {activeFields.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                        
                        <select
                          value={condition.operator}
                          onChange={(e) => updateCondition(condition.id, "operator", e.target.value)}
                          className="w-24 px-2 py-1.5 rounded border outline-none text-xs"
                          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.textPrimary }}
                        >
                          {operators.map((op) => (
                            <option key={op.id} value={op.id}>{op.name}</option>
                          ))}
                        </select>
                        
                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                          placeholder="مقدار..."
                          className="flex-1 px-2 py-1.5 rounded border outline-none text-xs"
                          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border, color: colors.textPrimary }}
                        />
                        
                        <button
                          onClick={() => removeCondition(condition.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* به‌روزرسانی خودکار */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-4 h-4" style={{ color: colors.primary }} />
                <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  به‌روزرسانی خودکار
                </label>
              </div>

              <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: `${colors.backgroundSecondary}50` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                      به‌روزرسانی خودکار
                    </span>
                    <span className="text-xs opacity-70" style={{ color: colors.textSecondary }}>
                      دریافت مجدد اطلاعات به صورت دوره‌ای
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={autoUpdateEnabled}
                      onChange={(e) => setAutoUpdateEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {autoUpdateEnabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                        بازه زمانی
                      </label>
                      <select
                        value={autoUpdateInterval}
                        onChange={(e) => setAutoUpdateInterval(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border outline-none text-sm transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="5">۵ ثانیه</option>
                        <option value="10">۱۰ ثانیه</option>
                        <option value="30">۳۰ ثانیه</option>
                        <option value="60">۱ دقیقه</option>
                        <option value="300">۵ دقیقه</option>
                      </select>
                    </div>

                    {/* Progress Bar in Settings */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs" style={{ color: colors.textSecondary }}>
                          وضعیت به‌روز بودن داده‌ها
                        </span>
                        <Clock className="w-3 h-3" style={{ color: colors.textSecondary }} />
                      </div>
                      <Progress value={simulatedProgress} className="h-1.5" />
                      <div className="mt-1 flex justify-between text-[10px]" style={{ color: colors.textSecondary }}>
                         <span>تا به‌روزرسانی بعدی</span>
                         <span>{autoUpdateInterval} ثانیه</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
            >
              <Save className="w-5 h-5" />
              ذخیره ویجت
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
              }}
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </>
  );
}