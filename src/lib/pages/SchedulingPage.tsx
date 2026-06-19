"use client"

import { useState, useMemo } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useCustomers, Customer } from "../contexts/CustomersContext";
import { CustomerSearchInput } from "../components/CustomerSearchInput";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  Plus,
  X,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  UserPlus,
  Bot,
} from "lucide-react";
import { ThemedButton } from "../components/ThemedButton";

// Types
interface ScheduledCall {
  id: string;
  customerName: string;
  customerPhone: string;
  assignedAgent: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "missed" | "rescheduled";
  notes: string;
  aiGenerated: boolean;
}

interface AIStrategy {
  enabled: boolean;
  priorityRules: string;
  timePreferences: string;
  agentDistribution: string;
  callFrequency: string;
}

// Mock Data
const mockScheduledCalls: ScheduledCall[] = [
  {
    id: "1",
    customerName: "رضا محمدی",
    customerPhone: "09121234567",
    assignedAgent: "سارا احمدی",
    scheduledDate: "2025-01-05",
    scheduledTime: "10:00",
    priority: "high",
    status: "pending",
    notes: "مشتری علاقه‌مند به محصول جدید",
    aiGenerated: false,
  },
  {
    id: "2",
    customerName: "فاطمه کریمی",
    customerPhone: "09129876543",
    assignedAgent: "علی رضایی",
    scheduledDate: "2025-01-05",
    scheduledTime: "11:30",
    priority: "medium",
    status: "pending",
    notes: "پیگیری خرید قبلی",
    aiGenerated: true,
  },
  {
    id: "3",
    customerName: "محمد حسینی",
    customerPhone: "09123456789",
    assignedAgent: "مریم صادقی",
    scheduledDate: "2025-01-05",
    scheduledTime: "14:00",
    priority: "high",
    status: "completed",
    notes: "مشاوره محصول ویژه",
    aiGenerated: true,
  },
  {
    id: "4",
    customerName: "زهرا نوری",
    customerPhone: "09127654321",
    assignedAgent: "حسین جعفری",
    scheduledDate: "2025-01-06",
    scheduledTime: "09:00",
    priority: "low",
    status: "pending",
    notes: "پیگیری نظرسنجی",
    aiGenerated: false,
  },
  {
    id: "5",
    customerName: "امیر کاظمی",
    customerPhone: "09128765432",
    assignedAgent: "سارا احمدی",
    scheduledDate: "2025-01-06",
    scheduledTime: "15:30",
    priority: "medium",
    status: "rescheduled",
    notes: "تماس مجدد برای تکمیل سفارش",
    aiGenerated: true,
  },
];

const agents = [
  "سارا احمدی",
  "علی رضایی",
  "مریم صادقی",
  "حسین جعفری",
  "نرگس مرادی",
];

export function SchedulingPage() {
  const colors = useCurrentColors();
  const { searchCustomers, addCustomer, getCustomerByPhone } = useCustomers();
  const [selectedDate, setSelectedDate] = useState<string>("2025-01-05");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [scheduledCalls, setScheduledCalls] =
    useState<ScheduledCall[]>(mockScheduledCalls);
  const [addToCustomers, setAddToCustomers] = useState(false);
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // AI Strategy State
  const [aiStrategy, setAIStrategy] = useState<AIStrategy>({
    enabled: false,
    priorityRules:
      "مشتریان با سابقه خرید بالا اولویت دارند. تماس‌های فوری در ساعات اول روز برنامه‌ریزی شوند.",
    timePreferences:
      "صبح‌ها ساعت 9 تا 12، بعدازظهر 14 تا 17. از ساعات نهار و پایان روز اجتناب شود.",
    agentDistribution:
      "توزیع یکنواخت بین کارشناسان. کارشناسان با تخصص مرتبط به مشتریان خاص اختصاص یابند.",
    callFrequency:
      "حداکثر 3 تماس در روز برای هر کارشناس. فاصله 30 دقیقه بین هر تماس.",
  });

  // New Call Form State
  const [newCall, setNewCall] = useState({
    customerName: "",
    customerPhone: "",
    assignedAgent: "",
    scheduledDate: selectedDate,
    scheduledTime: "",
    priority: "medium" as "high" | "medium" | "low",
    notes: "",
  });

  // Filter calls
  const filteredCalls = useMemo(() => {
    return scheduledCalls.filter((call) => {
      const matchesSearch =
        call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.customerPhone.includes(searchQuery) ||
        call.assignedAgent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || call.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || call.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [scheduledCalls, searchQuery, filterStatus, filterPriority]);

  // Get calls for selected date
  const callsForSelectedDate = filteredCalls.filter(
    (call) => call.scheduledDate === selectedDate
  );

  // Stats
  const stats = {
    total: scheduledCalls.length,
    pending: scheduledCalls.filter((c) => c.status === "pending").length,
    completed: scheduledCalls.filter((c) => c.status === "completed").length,
    aiGenerated: scheduledCalls.filter((c) => c.aiGenerated).length,
  };

  // Handle Add Call
  const handleAddCall = () => {
    // اگر checkbox فعال باشد، مشتری را به لیست اضافه کن
    if (addToCustomers && newCall.customerName && newCall.customerPhone) {
      const existingCustomer = getCustomerByPhone(newCall.customerPhone);
      
      // فقط اگر مشتری قبلاً وجود نداشت، اضافه کن
      if (!existingCustomer) {
        const newCustomer: Customer = {
          id: Date.now().toString(),
          name: newCall.customerName,
          phone: newCall.customerPhone,
          email: "",
          status: "active",
          lastCall: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          totalCalls: 1,
          satisfaction: 0,
          satisfactionScore: 0,
        };
        addCustomer(newCustomer);
      }
    }

    const call: ScheduledCall = {
      id: Date.now().toString(),
      ...newCall,
      status: "pending",
      aiGenerated: false,
    };
    setScheduledCalls([...scheduledCalls, call]);
    setShowAddModal(false);
    setAddToCustomers(false);
    setNewCall({
      customerName: "",
      customerPhone: "",
      assignedAgent: "",
      scheduledDate: selectedDate,
      scheduledTime: "",
      priority: "medium",
      notes: "",
    });
  };

  // Generate AI Calls (Simulation)
  const handleGenerateAICalls = () => {
    // Simulate AI generating new calls
    const aiCalls: ScheduledCall[] = [
      {
        id: Date.now().toString() + "-1",
        customerName: "کیانا موسوی",
        customerPhone: "09121112222",
        assignedAgent: "علی رضایی",
        scheduledDate: "2025-01-07",
        scheduledTime: "10:00",
        priority: "high",
        status: "pending",
        notes: "پیشنهاد محصول جدید بر اساس سابقه خرید",
        aiGenerated: true,
      },
      {
        id: Date.now().toString() + "-2",
        customerName: "پویا رستمی",
        customerPhone: "09123334444",
        assignedAgent: "مریم صادقی",
        scheduledDate: "2025-01-07",
        scheduledTime: "11:00",
        priority: "medium",
        status: "pending",
        notes: "پیگیری مشتری غیرفعال",
        aiGenerated: true,
      },
      {
        id: Date.now().toString() + "-3",
        customerName: "سمیرا قاسمی",
        customerPhone: "09125556666",
        assignedAgent: "نرگس مرادی",
        scheduledDate: "2025-01-07",
        scheduledTime: "14:30",
        priority: "low",
        status: "pending",
        notes: "نظرسنجی رضایت مشتری",
        aiGenerated: true,
      },
    ];
    setScheduledCalls([...scheduledCalls, ...aiCalls]);
    setShowSuccessModal(true);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "در انتظار", color: colors.warning },
      completed: { label: "انجام شده", color: colors.success },
      missed: { label: "از دست رفته", color: colors.error },
      rescheduled: { label: "برنامه‌ریزی مجدد", color: colors.purple },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2" style={{ color: colors.textPrimary }}>
            برنامه‌ریزی تماس‌ها
          </h1>
          <p style={{ color: colors.textSecondary }}>
            مدیریت و برنامه‌ریزی هوشمند تماس‌های مرکز تماس
          </p>
        </div>

        {/* دکمه‌ها - در موبایل سه سطر، در دسکتاپ کنار هم */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <ThemedButton
            variant="secondary"
            onClick={() => setShowAIPanel(!showAIPanel)}
            icon={<Sparkles className="w-4 h-4" />}
            className="w-full md:w-auto justify-center"
          >
            {showAIPanel ? "بستن پنل AI" : "استراتژی AI"}
          </ThemedButton>
          <ThemedButton
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4" />}
            className="w-full md:w-auto justify-center"
          >
            افزودن تماس
          </ThemedButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                کل تماس‌ها
              </p>
              <p className="text-2xl mt-1" style={{ color: colors.textPrimary }}>
                {stats.total}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Phone className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                در انتظار
              </p>
              <p className="text-2xl mt-1" style={{ color: colors.textPrimary }}>
                {stats.pending}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Clock className="w-6 h-6" style={{ color: colors.warning }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                انجام شده
              </p>
              <p className="text-2xl mt-1" style={{ color: colors.textPrimary }}>
                {stats.completed}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: colors.success }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                برنامه‌ریزی AI
              </p>
              <p className="text-2xl mt-1" style={{ color: colors.textPrimary }}>
                {stats.aiGenerated}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Sparkles className="w-6 h-6" style={{ color: colors.purple }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategy Panel */}
      {showAIPanel && (
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <Bot className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="text-lg" style={{ color: colors.textPrimary }}>
                  استراتژی برنامه‌ریزی هوشمند
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  تنظیمات هوش مصنوعی برای برنامه‌ریزی خودکار تماس‌ها
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {aiStrategy.enabled ? "فعال" : "غیرفعال"}
                </span>
                <div
                  className="relative w-12 h-6 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: aiStrategy.enabled
                      ? colors.success
                      : colors.border,
                  }}
                  onClick={() =>
                    setAIStrategy({ ...aiStrategy, enabled: !aiStrategy.enabled })
                  }
                >
                  <div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    style={{
                      transform: aiStrategy.enabled
                        ? "translateX(-6px)"
                        : "translateX(-22px)",
                    }}
                  />
                </div>
              </label>

              {aiStrategy.enabled && (
                <ThemedButton
                  variant="primary"
                  onClick={handleGenerateAICalls}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  اجرای برنامه‌ریزی
                </ThemedButton>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                قوانین اولویت‌بندی
              </label>
              <textarea
                value={aiStrategy.priorityRules}
                onChange={(e) =>
                  setAIStrategy({ ...aiStrategy, priorityRules: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                rows={3}
                placeholder="مثال: مشتریان VIP اولویت بالا..."
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                ترجیحات زمانی
              </label>
              <textarea
                value={aiStrategy.timePreferences}
                onChange={(e) =>
                  setAIStrategy({ ...aiStrategy, timePreferences: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                rows={3}
                placeholder="مثال: صبح‌ها ساعت 9 تا 12..."
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                توزیع کارشناسان
              </label>
              <textarea
                value={aiStrategy.agentDistribution}
                onChange={(e) =>
                  setAIStrategy({ ...aiStrategy, agentDistribution: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                rows={3}
                placeholder="مثال: توزیع متوازن بین تیم..."
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                تناوب تماس‌ها
              </label>
              <textarea
                value={aiStrategy.callFrequency}
                onChange={(e) =>
                  setAIStrategy({ ...aiStrategy, callFrequency: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                rows={3}
                placeholder="مثال: حداکثر 3 تماس در روز..."
              />
            </div>
          </div>

          <div
            className="mt-6 p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
            <div>
              <p className="text-sm" style={{ color: colors.textPrimary }}>
                با فعال کردن این گزینه، هوش مصنوعی بر اساس استراتژی تعریف شده، به صورت خودکار تماس‌های جدید را برنامه‌ریزی می‌کند.
              </p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                شما همچنان می‌توانید تماس‌های پیشنهادی را بررسی و ویرایش کنید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Mini Calendar */}
          <div
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg" style={{ color: colors.textPrimary }}>
                تقویم
              </h3>
              <Calendar className="w-5 h-5" style={{ color: colors.primary }} />
            </div>

            {/* Simple Date Selector */}
            <div className="space-y-2">
              {["2025-01-05", "2025-01-06", "2025-01-07", "2025-01-08"].map(
                (date) => {
                  const dateObj = new Date(date);
                  const isSelected = date === selectedDate;
                  const callsCount = scheduledCalls.filter(
                    (c) => c.scheduledDate === date
                  ).length;

                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className="w-full p-3 rounded-lg transition-all text-right"
                      style={{
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.backgroundSecondary,
                        color: isSelected ? "#ffffff" : colors.textPrimary,
                        border: `1px solid ${isSelected ? colors.primary : colors.border}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {dateObj.toLocaleDateString("fa-IR", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {callsCount > 0 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: isSelected
                                ? "rgba(255,255,255,0.2)"
                                : colors.primary,
                              color: isSelected ? "#ffffff" : "#ffffff",
                            }}
                          >
                            {callsCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Filters */}
          <div
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" style={{ color: colors.primary }} />
              <h3 className="text-lg" style={{ color: colors.textPrimary }}>
                فیلترها
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  وضعیت
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="all">همه</option>
                  <option value="pending">در انتظار</option>
                  <option value="completed">انجام شده</option>
                  <option value="missed">از دست رفته</option>
                  <option value="rescheduled">برنامه‌ریزی مجدد</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  اولویت
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="all">همه</option>
                  <option value="high">بالا</option>
                  <option value="medium">متوسط</option>
                  <option value="low">پایین</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Calls List */}
        <div className="lg:col-span-2">
          <div
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="text"
                  placeholder="جستجو در تماس‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border outline-none transition-all"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Calls for Selected Date */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg" style={{ color: colors.textPrimary }}>
                تماس‌های{" "}
                {new Date(selectedDate).toLocaleDateString("fa-IR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {callsForSelectedDate.length} تماس
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {callsForSelectedDate.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar
                    className="w-16 h-16 mx-auto mb-3"
                    style={{ color: colors.textSecondary, opacity: 0.3 }}
                  />
                  <p style={{ color: colors.textSecondary }}>
                    هیچ تماسی برای این تاریخ برنامه‌ریزی نشده است
                  </p>
                </div>
              ) : (
                callsForSelectedDate.map((call) => {
                  const statusBadge = getStatusBadge(call.status);
                  return (
                    <div
                      key={call.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-all"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.cardBackground }}
                          >
                            <User className="w-5 h-5" style={{ color: colors.primary }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 style={{ color: colors.textPrimary }}>
                                {call.customerName}
                              </h4>
                              {call.aiGenerated && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                                  style={{
                                    backgroundColor: colors.purple + "20",
                                    color: colors.purple,
                                  }}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                              {call.customerPhone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: statusBadge.color + "20",
                              color: statusBadge.color,
                            }}
                          >
                            {statusBadge.label}
                          </span>
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getPriorityColor(call.priority) }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: colors.textSecondary }} />
                          <span className="text-sm" style={{ color: colors.textSecondary }}>
                            {call.scheduledTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" style={{ color: colors.textSecondary }} />
                          <span className="text-sm" style={{ color: colors.textSecondary }}>
                            {call.assignedAgent}
                          </span>
                        </div>
                      </div>

                      {call.notes && (
                        <p
                          className="text-sm p-2 rounded"
                          style={{
                            backgroundColor: colors.cardBackground,
                            color: colors.textSecondary,
                          }}
                        >
                          {call.notes}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Call Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl" style={{ color: colors.textPrimary }}>
                افزودن تماس جدید
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                    نام مشتری *
                  </label>
                  <CustomerSearchInput
                    value={newCall.customerName}
                    onChange={(customer: Customer) =>
                      setNewCall({ ...newCall, customerName: customer.name, customerPhone: customer.phone })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                    شماره تماس *
                  </label>
                  <input
                    type="tel"
                    value={newCall.customerPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // فقط اعداد
                      if (value.length <= 11) {
                        setNewCall({ ...newCall, customerPhone: value });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: newCall.customerPhone && newCall.customerPhone.length !== 11
                        ? colors.error
                        : colors.border,
                      color: colors.textPrimary,
                    }}
                    placeholder="09121234567"
                    dir="ltr"
                    maxLength={11}
                  />
                  {newCall.customerPhone && newCall.customerPhone.length !== 11 && (
                    <p className="text-xs mt-1" style={{ color: colors.error }}>
                      شماره تماس باید 11 رقم باشد (مثال: 09121234567)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                    کارشناس *
                  </label>
                  <select
                    value={newCall.assignedAgent}
                    onChange={(e) =>
                      setNewCall({ ...newCall, assignedAgent: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="">انتخاب کارشناس</option>
                    {agents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                    اولویت *
                  </label>
                  <select
                    value={newCall.priority}
                    onChange={(e) =>
                      setNewCall({
                        ...newCall,
                        priority: e.target.value as "high" | "medium" | "low",
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="low">پایین</option>
                    <option value="medium">متوسط</option>
                    <option value="high">بالا</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                    تاریخ *
                  </label>
                  <input
                    type="date"
                    value={newCall.scheduledDate}
                    onChange={(e) =>
                      setNewCall({ ...newCall, scheduledDate: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                    ساعت *
                  </label>
                  <input
                    type="time"
                    value={newCall.scheduledTime}
                    onChange={(e) =>
                      setNewCall({ ...newCall, scheduledTime: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textPrimary }}>
                  یادداشت
                </label>
                <textarea
                  value={newCall.notes}
                  onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border outline-none"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  rows={3}
                  placeholder="توضیحات اضافی..."
                />
              </div>

              {/* افزودن به لیست مشتریان */}
              <div
                className="p-4 rounded-lg border flex items-start gap-3"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }}
              >
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={addToCustomers}
                    onChange={(e) => setAddToCustomers(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded cursor-pointer"
                    style={{
                      accentColor: colors.primary,
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <UserPlus className="w-4 h-4" style={{ color: colors.primary }} />
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        افزودن به لیست مشتریان
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {newCall.customerName && newCall.customerPhone
                        ? `${newCall.customerName} • ${newCall.customerPhone}`
                        : "این مشتری را به لیست مشتریان دائمی اضافه کن"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <ThemedButton
                variant="primary"
                onClick={handleAddCall}
                disabled={
                  !newCall.customerName ||
                  !newCall.customerPhone ||
                  newCall.customerPhone.length !== 11 ||
                  !newCall.assignedAgent ||
                  !newCall.scheduledTime
                }
                icon={<Plus className="w-4 h-4" />}
              >
                افزودن تماس
              </ThemedButton>
              <ThemedButton variant="secondary" onClick={() => setShowAddModal(false)}>
                انصراف
              </ThemedButton>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl"
            style={{ backgroundColor: colors.cardBackground }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header with X button */}
            <div className="flex items-center justify-between px-6 pt-5 pb-6">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <div className="flex items-start gap-3">
                <p className="text-sm leading-relaxed flex-1" style={{ color: colors.textPrimary }}>
                  تماس‌های جدید توسط هوش مصنوعی برنامه‌ریزی شدند
                </p>
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.purple }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}