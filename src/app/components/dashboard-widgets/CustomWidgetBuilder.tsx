import { useState } from "react";
import { X, BarChart3, PieChart, LineChart, Activity, TrendingUp, Save, Table, Filter, Plus, Trash2, Database, ArrowDown, AlignLeft, Link } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

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
    // JOIN Configuration
    join?: {
      enabled: boolean;
      secondarySoftwareId: string;
      secondaryTableId: string;
      primaryJoinKey: string;
      secondaryJoinKey: string;
    };
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
          { id: "fullName", name: "نام و نام خانوادگی" },
          { id: "phoneNumber", name: "شماره تماس" },
          { id: "company", name: "شرکت" },
          { id: "city", name: "شهر" },
          { id: "province", name: "استان" },
          { id: "interestedProducts", name: "محصولات مورد علاقه" },
          { id: "notes", name: "توضیحات" },
          { id: "visitDate", name: "تاریخ بازدید" },
          { id: "followUpStatus", name: "وضعیت پیگیری" },
          { id: "priority", name: "اولویت" },
          { id: "count", name: "تعداد" },
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

  // JOIN State
  const [joinEnabled, setJoinEnabled] = useState(editWidget?.systemConfig?.join?.enabled || false);
  const [secondarySoftware, setSecondarySoftware] = useState(editWidget?.systemConfig?.join?.secondarySoftwareId || "");
  const [secondaryTable, setSecondaryTable] = useState(editWidget?.systemConfig?.join?.secondaryTableId || "");
  const [primaryJoinKey, setPrimaryJoinKey] = useState(editWidget?.systemConfig?.join?.primaryJoinKey || "");
  const [secondaryJoinKey, setSecondaryJoinKey] = useState(editWidget?.systemConfig?.join?.secondaryJoinKey || "");

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
        conditions,
        join: joinEnabled ? {
          enabled: true,
          secondarySoftwareId: secondarySoftware,
          secondaryTableId: secondaryTable,
          primaryJoinKey,
          secondaryJoinKey,
        } : undefined,
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
        style={{ minHeight: '100vh', minWidth: '100vw' }}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-[95%] max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border flex flex-col"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
        dir="rtl"
      >
        {/* Header - Sticky */}
        <div 
          className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b shadow-sm"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
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
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
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
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Database className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <label className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  منبع داده
                </label>
              </div>

              {/* Data Source Configuration */}
              <div className="space-y-5 p-5 rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
                
                {/* مرحله ۱: انتخاب نرم‌افزار */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: colors.primary, color: 'white' }}
                    >
                      ۱
                    </div>
                    <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                      انتخاب نرم‌افزار
                    </label>
                  </div>
                  <select
                    value={selectedSoftware}
                    onChange={(e) => {
                      setSelectedSoftware(e.target.value);
                      setSelectedTable("");
                      setSelectedLabelField("");
                      setSelectedValueField("");
                    }}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-all hover:border-opacity-60"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderColor: selectedSoftware ? colors.primary : colors.border,
                      color: colors.textPrimary,
                      borderWidth: selectedSoftware ? '2px' : '1px',
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

                {/* خط جداکننده */}
                {selectedSoftware && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                    <ArrowDown className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                  </div>
                )}

                {/* مرحله ۲: انتخاب جدول */}
                <div className={!selectedSoftware ? "opacity-40 pointer-events-none" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      style={{ 
                        backgroundColor: selectedSoftware ? colors.primary : colors.border, 
                        color: selectedSoftware ? 'white' : colors.textSecondary 
                      }}
                    >
                      ۲
                    </div>
                    <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                      انتخاب جدول اطلاعاتی
                    </label>
                  </div>
                  <select
                    value={selectedTable}
                    onChange={(e) => {
                      setSelectedTable(e.target.value);
                      setSelectedLabelField("");
                      setSelectedValueField("");
                    }}
                    disabled={!selectedSoftware}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-all hover:border-opacity-60"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderColor: selectedTable ? colors.primary : colors.border,
                      color: colors.textPrimary,
                      borderWidth: selectedTable ? '2px' : '1px',
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

                {/* خط جداکننده */}
                {selectedTable && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                    <ArrowDown className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                  </div>
                )}

                {/* مرحله ۳: انتخاب ستون‌ها */}
                <div className={!selectedTable ? "opacity-40 pointer-events-none" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      style={{ 
                        backgroundColor: selectedTable ? colors.primary : colors.border, 
                        color: selectedTable ? 'white' : colors.textSecondary 
                      }}
                    >
                      ۳
                    </div>
                    <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                      انتخاب ستون‌های نمودار
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}>
                      <div className="flex items-center gap-2 mb-2">
                        <AlignLeft className="w-4 h-4" style={{ color: colors.primary }} />
                        <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                          ستون عنوان (محور X)
                        </span>
                      </div>
                      <select
                        value={selectedLabelField}
                        onChange={(e) => setSelectedLabelField(e.target.value)}
                        disabled={!selectedTable}
                        className="w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: selectedLabelField ? colors.primary : colors.border,
                          color: colors.textPrimary,
                          borderWidth: selectedLabelField ? '2px' : '1px',
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
                    <div className="p-3 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4" style={{ color: colors.primary }} />
                        <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                          ستون مقدار (محور Y)
                        </span>
                      </div>
                      <select
                        value={selectedValueField}
                        onChange={(e) => setSelectedValueField(e.target.value)}
                        disabled={!selectedTable}
                        className="w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: selectedValueField ? colors.primary : colors.border,
                          color: colors.textPrimary,
                          borderWidth: selectedValueField ? '2px' : '1px',
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

                {/* خط جداکننده */}
                {selectedTable && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                    <Filter className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                  </div>
                )}

                {/* مرحله ۴: شرط‌ها و فیلترها */}
                <div className={!selectedTable ? "opacity-40 pointer-events-none" : ""}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        style={{ 
                          backgroundColor: selectedTable ? colors.primary : colors.border, 
                          color: selectedTable ? 'white' : colors.textSecondary 
                        }}
                      >
                        ۴
                      </div>
                      <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        شروط و فیلترها (اختیاری)
                      </label>
                    </div>
                    <button
                      onClick={addCondition}
                      disabled={!selectedTable}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 font-medium hover:scale-105"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary,
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      افزودن شرط
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {conditions.length === 0 && (
                      <div 
                        className="text-center py-6 rounded-lg border-2 border-dashed" 
                        style={{ borderColor: colors.border, backgroundColor: `${colors.backgroundSecondary}50` }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                          style={{ backgroundColor: `${colors.primary}10` }}
                        >
                          <Filter className="w-5 h-5" style={{ color: colors.primary }} />
                        </div>
                        <span className="text-sm font-medium block" style={{ color: colors.textPrimary }}>
                          هیچ شرطی تعریف نشده است
                        </span>
                        <span className="text-xs opacity-70 mt-1 block" style={{ color: colors.textSecondary }}>
                          برای فیلتر کردن داده‌ها، شرط اضافه کنید
                        </span>
                      </div>
                    )}
                    
                    {conditions.map((condition, index) => (
                      <div 
                        key={condition.id} 
                        className="flex gap-2 p-3 rounded-lg border transition-all hover:shadow-sm" 
                        style={{ borderColor: colors.border, backgroundColor: colors.cardBackground }}
                      >
                        <div className="flex items-center justify-center pt-2">
                          <span 
                            className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <select
                          value={condition.field}
                          onChange={(e) => updateCondition(condition.id, "field", e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm transition-all"
                          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }}
                        >
                          <option value="">انتخاب فیلد...</option>
                          {activeFields.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                        
                        <select
                          value={condition.operator}
                          onChange={(e) => updateCondition(condition.id, "operator", e.target.value)}
                          className="w-28 px-3 py-2 rounded-lg border outline-none text-sm transition-all"
                          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }}
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
                          className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm transition-all"
                          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }}
                        />
                        
                        <button
                          onClick={() => removeCondition(condition.id)}
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ backgroundColor: `${colors.error}10`, color: colors.error }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* مرحله ۵: JOIN با جدول دیگر */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Link className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <label className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  اتصال به جدول دیگر (JOIN)
                </label>
              </div>

              <div className="space-y-5 p-5 rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
                
                {/* فعال‌سازی JOIN */}
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed transition-all" 
                  style={{ 
                    borderColor: joinEnabled ? colors.primary : colors.border,
                    backgroundColor: joinEnabled ? `${colors.primary}08` : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    id="joinEnabled"
                    checked={joinEnabled}
                    onChange={(e) => {
                      setJoinEnabled(e.target.checked);
                      if (!e.target.checked) {
                        setSecondarySoftware("");
                        setSecondaryTable("");
                        setPrimaryJoinKey("");
                        setSecondaryJoinKey("");
                      }
                    }}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: colors.primary }}
                  />
                  <label htmlFor="joinEnabled" className="flex-1 cursor-pointer">
                    <span className="text-sm font-bold block" style={{ color: colors.textPrimary }}>
                      فعال‌سازی JOIN با جدول/نرم‌افزار دیگر
                    </span>
                    <span className="text-xs opacity-75 mt-0.5 block" style={{ color: colors.textSecondary }}>
                      داده‌ها را با جدول دیگری ترکیب کنید و اطلاعات بیشتری نمایش دهید
                    </span>
                  </label>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{ 
                      backgroundColor: joinEnabled ? `${colors.primary}20` : `${colors.border}30`,
                    }}
                  >
                    <Link 
                      className="w-5 h-5 transition-transform" 
                      style={{ 
                        color: joinEnabled ? colors.primary : colors.textSecondary,
                        transform: joinEnabled ? 'rotate(45deg)' : 'rotate(0deg)'
                      }} 
                    />
                  </div>
                </div>

                {/* تنظیمات JOIN */}
                <div className={!joinEnabled ? "opacity-40 pointer-events-none" : ""}>
                  
                  {/* انتخاب نرم‌افزار ثانویه */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        style={{ 
                          backgroundColor: joinEnabled ? colors.primary : colors.border, 
                          color: joinEnabled ? 'white' : colors.textSecondary 
                        }}
                      >
                        ۱
                      </div>
                      <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        انتخاب نرم‌افزار دوم
                      </label>
                    </div>
                    <select
                      value={secondarySoftware}
                      onChange={(e) => {
                        setSecondarySoftware(e.target.value);
                        setSecondaryTable("");
                        setPrimaryJoinKey("");
                        setSecondaryJoinKey("");
                      }}
                      disabled={!joinEnabled}
                      className="w-full px-4 py-3 rounded-lg border outline-none transition-all hover:border-opacity-60"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderColor: secondarySoftware ? colors.primary : colors.border,
                        color: colors.textPrimary,
                        borderWidth: secondarySoftware ? '2px' : '1px',
                      }}
                    >
                      <option value="">نرم‌افزار دوم را انتخاب کنید...</option>
                      {softwares.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* خط جداکننده */}
                  {secondarySoftware && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                      <ArrowDown className="w-4 h-4" style={{ color: colors.textSecondary }} />
                      <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                    </div>
                  )}

                  {/* انتخاب جدول ثانویه */}
                  <div className={`mb-4 ${!secondarySoftware ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        style={{ 
                          backgroundColor: secondarySoftware ? colors.primary : colors.border, 
                          color: secondarySoftware ? 'white' : colors.textSecondary 
                        }}
                      >
                        ۲
                      </div>
                      <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        انتخاب جدول دوم
                      </label>
                    </div>
                    <select
                      value={secondaryTable}
                      onChange={(e) => {
                        setSecondaryTable(e.target.value);
                        setPrimaryJoinKey("");
                        setSecondaryJoinKey("");
                      }}
                      disabled={!secondarySoftware}
                      className="w-full px-4 py-3 rounded-lg border outline-none transition-all hover:border-opacity-60"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderColor: secondaryTable ? colors.primary : colors.border,
                        color: colors.textPrimary,
                        borderWidth: secondaryTable ? '2px' : '1px',
                      }}
                    >
                      <option value="">جدول دوم را انتخاب کنید...</option>
                      {softwares.find(s => s.id === secondarySoftware)?.tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* خط جداکننده */}
                  {secondaryTable && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                      <Link className="w-4 h-4" style={{ color: colors.textSecondary }} />
                      <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                    </div>
                  )}

                  {/* کلیدهای JOIN */}
                  <div className={`${!secondaryTable ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        style={{ 
                          backgroundColor: secondaryTable ? colors.primary : colors.border, 
                          color: secondaryTable ? 'white' : colors.textSecondary 
                        }}
                      >
                        ۳
                      </div>
                      <label className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                        تعیین کلیدهای JOIN
                      </label>
                    </div>

                    <div 
                      className="p-4 rounded-lg border-2 space-y-3" 
                      style={{ 
                        borderColor: (primaryJoinKey && secondaryJoinKey) ? colors.primary : colors.border,
                        backgroundColor: colors.cardBackground 
                      }}
                    >
                      {/* توضیح */}
                      <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}08` }}>
                        <div className="mt-0.5">
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                            کلیدهای JOIN مشخص می‌کنند که دو جدول بر اساس کدام ستون‌ها به هم متصل شوند.
                          </p>
                          <p className="text-xs mt-1 opacity-75" style={{ color: colors.textSecondary }}>
                            مثال: phoneNumber در جدول اول = phoneNumber در جدول دوم
                          </p>
                        </div>
                      </div>

                      {/* کلید جدول اصلی */}
                      <div>
                        <label className="text-xs font-medium mb-2 block flex items-center gap-2" style={{ color: colors.textPrimary }}>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                          کلید جدول اول ({activeTable?.name || "جدول اصلی"})
                        </label>
                        <select
                          value={primaryJoinKey}
                          onChange={(e) => setPrimaryJoinKey(e.target.value)}
                          disabled={!secondaryTable}
                          className="w-full px-3 py-2.5 rounded-lg border outline-none transition-all text-sm"
                          style={{
                            backgroundColor: colors.backgroundSecondary,
                            borderColor: primaryJoinKey ? colors.primary : colors.border,
                            color: colors.textPrimary,
                            borderWidth: primaryJoinKey ? '2px' : '1px',
                          }}
                        >
                          <option value="">ستون را انتخاب کنید...</option>
                          {activeFields.map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name} ({field.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* علامت مساوی */}
                      <div className="flex items-center justify-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ 
                            backgroundColor: (primaryJoinKey && secondaryJoinKey) ? `${colors.primary}20` : `${colors.border}30`,
                            color: (primaryJoinKey && secondaryJoinKey) ? colors.primary : colors.textSecondary
                          }}
                        >
                          =
                        </div>
                      </div>

                      {/* کلید جدول ثانویه */}
                      <div>
                        <label className="text-xs font-medium mb-2 block flex items-center gap-2" style={{ color: colors.textPrimary }}>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary || colors.primary }} />
                          کلید جدول دوم ({softwares.find(s => s.id === secondarySoftware)?.tables.find(t => t.id === secondaryTable)?.name || "جدول ثانویه"})
                        </label>
                        <select
                          value={secondaryJoinKey}
                          onChange={(e) => setSecondaryJoinKey(e.target.value)}
                          disabled={!secondaryTable}
                          className="w-full px-3 py-2.5 rounded-lg border outline-none transition-all text-sm"
                          style={{
                            backgroundColor: colors.backgroundSecondary,
                            borderColor: secondaryJoinKey ? colors.primary : colors.border,
                            color: colors.textPrimary,
                            borderWidth: secondaryJoinKey ? '2px' : '1px',
                          }}
                        >
                          <option value="">ستون را انتخاب کنید...</option>
                          {softwares
                            .find(s => s.id === secondarySoftware)
                            ?.tables.find(t => t.id === secondaryTable)
                            ?.fields.map((field) => (
                              <option key={field.id} value={field.id}>
                                {field.name} ({field.id})
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* نمایش پیش‌نمایش JOIN */}
                      {primaryJoinKey && secondaryJoinKey && (
                        <div 
                          className="mt-3 p-3 rounded-lg border-2 text-center font-mono text-xs"
                          style={{ 
                            backgroundColor: `${colors.success}10`,
                            borderColor: colors.success,
                            color: colors.success
                          }}
                        >
                          <div className="font-bold mb-1">✓ JOIN آماده است!</div>
                          <div className="opacity-80">
                            {activeTable?.name}.{primaryJoinKey} = {softwares.find(s => s.id === secondarySoftware)?.tables.find(t => t.id === secondaryTable)?.name}.{secondaryJoinKey}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer Buttons - Sticky */}
        <div 
          className="sticky bottom-0 z-10 flex gap-3 px-6 py-4 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:opacity-90"
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
            className="px-4 py-3 rounded-lg font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: colors.backgroundSecondary,
              color: colors.textPrimary,
            }}
          >
            انصراف
          </button>
        </div>
      </div>
    </>
  );
}