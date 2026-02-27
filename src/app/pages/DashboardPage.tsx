import { Info, GraduationCap, Settings, ArrowRight, Plus, Minus, X, LayoutDashboard, CheckCircle2, Phone, Check, Clock, Users, Star, Timer, PhoneOff, Hourglass, Zap, Trophy, Award, Table, Calendar, ListTodo, TrendingUp, DollarSign, ShoppingBag, Package, Sparkles, Trash2, BarChart3 } from "lucide-react";
// v2 - forced recompile
import { useNavigation } from "../contexts/NavigationContext";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useState, useEffect, useCallback } from "react";
import { useDrop } from "react-dnd";
import { WidgetWrapper } from "../components/dashboard-widgets/WidgetWrapper";
import { DraggableWidgetWrapper } from "../components/dashboard-widgets/DraggableWidgetWrapper";
import { TotalCallsWidget } from "../components/dashboard-widgets/TotalCallsWidget";
import { SuccessRateWidget } from "../components/dashboard-widgets/SuccessRateWidget";
import { AvgTimeWidget } from "../components/dashboard-widgets/AvgTimeWidget";
import { ActiveAgentsWidget } from "../components/dashboard-widgets/ActiveAgentsWidget";
import { SatisfactionWidget } from "../components/dashboard-widgets/SatisfactionWidget";
import { WaitingQueueWidget } from "../components/dashboard-widgets/WaitingQueueWidget";
import { RecentCallsWidget } from "../components/dashboard-widgets/RecentCallsWidget";
import { PeakHoursWidget } from "../components/dashboard-widgets/PeakHoursWidget";
import { MissedCallsWidget } from "../components/dashboard-widgets/MissedCallsWidget";
import { AvgWaitTimeWidget } from "../components/dashboard-widgets/AvgWaitTimeWidget";
import { FirstCallResolutionWidget } from "../components/dashboard-widgets/FirstCallResolutionWidget";
import { TopPerformersWidget } from "../components/dashboard-widgets/TopPerformersWidget";
import { FirstResponseTimeWidget } from "../components/dashboard-widgets/FirstResponseTimeWidget";
import { ServiceQualityWidget } from "../components/dashboard-widgets/ServiceQualityWidget";
import { CallsTableWidget } from "../components/dashboard-widgets/CallsTableWidget";
import { AgentsTableWidget } from "../components/dashboard-widgets/AgentsTableWidget";
import { CustomersTableWidget } from "../components/dashboard-widgets/CustomersTableWidget";
import { CalendarWidget } from "../components/dashboard-widgets/CalendarWidget";
import { TodoListWidget } from "../components/dashboard-widgets/TodoListWidget";
// ویجت‌های مدیریت داده‌ها
import { SalesOverviewWidget } from "../components/widgets/SalesOverviewWidget";
import { CustomersStatsWidget } from "../components/widgets/CustomersStatsWidget";
import { ProductsCategoryWidget } from "../components/widgets/ProductsCategoryWidget";
import { ExhibitionVisitsWidget } from "../components/widgets/ExhibitionVisitsWidget";
import { RevenueChartWidget } from "../components/widgets/RevenueChartWidget";
import { TopSellersWidget } from "../components/widgets/TopSellersWidget";
import { RecentSalesWidget } from "../components/widgets/RecentSalesWidget";
import { OrdersStatusWidget } from "../components/widgets/OrdersStatusWidget";
import { SalesTrendWidget } from "../components/widgets/SalesTrendWidget";
import { StatCardSkeleton, ChartSkeleton } from "../components/SkeletonLoader";
// کامپوننت‌های ویجت سفارشی
import { CustomWidgetBuilder, CustomWidgetData } from "../components/dashboard-widgets/CustomWidgetBuilder";
import { TableauStyleWidgetBuilder, TableauWidgetConfig } from "../components/dashboard-widgets/TableauStyleWidgetBuilder";
import { CustomWidgetRenderer } from "../components/dashboard-widgets/CustomWidgetRenderer";
import { TableauWidgetRenderer } from "../components/dashboard-widgets/TableauWidgetRenderer";

const quickActions = [
  {
    id: 1,
    title: "تکمیل اطلاعات پروفایل",
    description: "تکمیل اطلاعات پروفایل",
    icon: Info,
    color: "bg-[#e6f3ff] dark:bg-[#1a2a3a]",
    iconColor: "text-[#0085ff]",
    page: "settings" as const,
  },
  {
    id: 2,
    title: "آموزش‌ها",
    description: "ویدیوها و راهنما",
    icon: GraduationCap,
    color: "bg-[#fff3e0] dark:bg-[#3a2a1a]",
    iconColor: "text-[#ff9800]",
    page: "tutorials" as const,
  },
  {
    id: 3,
    title: "تنظیمات",
    description: "پیکربندی سیستم",
    icon: Settings,
    color: "bg-[#e6f9f0] dark:bg-[#1a3a2a]",
    iconColor: "text-[#00c853]",
    page: "settings" as const,
  },
];

const otherSoftware = [
  {
    id: 1,
    title: "سیستم مدیریت تماس هوشمند رهگیر",
    link: "#",
  },
];

interface WidgetConfig {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  component: React.ComponentType;
  category: "ready" | "composite"; // دسته‌بندی ویجت‌ها
}

// ویجت‌های پنل رهگیر (مرکز تماس)
const availableWidgetsConfig: WidgetConfig[] = [
  { id: "total-calls", title: "مجموع تماس‌ها", icon: Phone, description: "نمایش نمودار تماس‌های هفتگی", component: TotalCallsWidget, category: "ready" },
  { id: "success-rate", title: "نرخ موفقیت", icon: CheckCircle2, description: "درصد و آمار تماس‌های موفق", component: SuccessRateWidget, category: "ready" },
  { id: "avg-time", title: "متوسط زمان", icon: Timer, description: "نمودار میانگین زمان تماس‌ها", component: AvgTimeWidget, category: "ready" },
  { id: "active-agents", title: "کارشناسان فعال", icon: Users, description: "لیست کارشناسان آنلاین", component: ActiveAgentsWidget, category: "ready" },
  { id: "satisfaction", title: "رضایت مشتری", icon: Star, description: "نمودار امتیاز رضایت", component: SatisfactionWidget, category: "ready" },
  { id: "waiting-queue", title: "صف انتظار", icon: Clock, description: "نمایش صف انتظار فعلی", component: WaitingQueueWidget, category: "ready" },
  { id: "recent-calls", title: "تماس‌های اخیر", icon: Table, description: "نمایش آخرین تماس‌ها", component: RecentCallsWidget, category: "ready" },
  { id: "peak-hours", title: "ساعات پیک", icon: Clock, description: "نمایش ساعات پیک تماس‌ها", component: PeakHoursWidget, category: "ready" },
  { id: "missed-calls", title: "تماس‌های از دست رفته", icon: PhoneOff, description: "تماس‌های بدون پاسخ این هفته", component: MissedCallsWidget, category: "ready" },
  { id: "avg-wait-time", title: "میانگین زمان انتظار", icon: Hourglass, description: "متوسط زمان انتظار مشتریان", component: AvgWaitTimeWidget, category: "ready" },
  { id: "first-call-resolution", title: "حل در اولین تماس", icon: Check, description: "نرخ حل مسئله در اولین تماس", component: FirstCallResolutionWidget, category: "ready" },
  { id: "top-performers", title: "برترین کارشناسان", icon: Trophy, description: "رتبه‌بندی کارشناسان برتر", component: TopPerformersWidget, category: "ready" },
  { id: "first-response-time", title: "زمان پاسخگویی", icon: Zap, description: "میانگین زمان پاسخگویی اول", component: FirstResponseTimeWidget, category: "ready" },
  { id: "service-quality", title: "کیفیت خدمات", icon: Award, description: "امتیاز کلی کیفیت خدمات", component: ServiceQualityWidget, category: "ready" },
  { id: "calls-table", title: "جدول تماس‌ها", icon: Phone, description: "نمایش جدول تماس‌ها", component: CallsTableWidget, category: "composite" },
  { id: "agents-table", title: "جدول کارشناسان", icon: Users, description: "نمایش جدل کارشناسان", component: AgentsTableWidget, category: "composite" },
  { id: "customers-table", title: "جدول مشتریان", icon: Users, description: "نمایش جدول مشتریان", component: CustomersTableWidget, category: "composite" },
  { id: "total-sales", title: "فروش کل", icon: TrendingUp, description: "نمایش فروش کل", component: SalesOverviewWidget, category: "composite" },
  { id: "top-products", title: "محصولات برتر", icon: ShoppingBag, description: "نمایش محصولات برتر", component: TopSellersWidget, category: "composite" },
  { id: "inventory-status", title: "وضعیت انبار", icon: Package, description: "دسته‌بندی محصولات", component: ProductsCategoryWidget, category: "composite" },
  { id: "revenue", title: "درآمد", icon: DollarSign, description: "نمایش درآمد", component: RevenueChartWidget, category: "composite" },
  { id: "top-customers", title: "مشتریان", icon: Users, description: "آمار مشتریان", component: CustomersStatsWidget, category: "composite" },
  { id: "pending-orders", title: "سفارشات", icon: Package, description: "وضعیت سفارشات", component: OrdersStatusWidget, category: "composite" },
  { id: "recent-sales", title: "فروش‌های اخیر", icon: ShoppingBag, description: "آخرین فروش‌ها", component: RecentSalesWidget, category: "composite" },
  { id: "exhibition-visits", title: "بازدید نمایشگاه", icon: Users, description: "آمار بازدیدکنندگان", component: ExhibitionVisitsWidget, category: "composite" },
  { id: "sales-trend", title: "نوسان فروش", icon: TrendingUp, description: "نمودار نوسان فروش", component: SalesTrendWidget, category: "composite" },
  { id: "calendar", title: "تقویم", icon: Calendar, description: "نمایش تقویم", component: CalendarWidget, category: "ready" },
  { id: "todo-list", title: "لیست وظایف", icon: ListTodo, description: "نمایش لیست وظایف", component: TodoListWidget, category: "ready" },
];

export function DashboardPage() {
  const { setActivePage, showNotifications } = useNavigation();
  const colors = useCurrentColors();
  const { isOpen: isSidebarOpen } = useSidebar();
  const [showDrawer, setShowDrawer] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ready" | "composite">("ready");
  const [showCustomWidgetBuilder, setShowCustomWidgetBuilder] = useState(false);
  const [showTableauBuilder, setShowTableauBuilder] = useState(false);
  const [editingWidget, setEditingWidget] = useState<CustomWidgetData | undefined>(undefined);
  const [deleteConfirmWidget, setDeleteConfirmWidget] = useState<{ id: string; title: string; type: 'custom' | 'normal' } | null>(null);
  
  // Load active widgets from localStorage
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem("dashboard-active-widgets");
    return saved ? JSON.parse(saved) : [];
  });

  // Load widget sizes from localStorage
  const [widgetSizes, setWidgetSizes] = useState<Record<string, 'small' | 'medium' | 'large'>>(() => {
    const saved = localStorage.getItem("dashboard-widget-sizes");
    return saved ? JSON.parse(saved) : {};
  });

  // Load custom widgets from localStorage
  const [customWidgets, setCustomWidgets] = useState<CustomWidgetData[]>(() => {
    const saved = localStorage.getItem("dashboard-custom-widgets");
    return saved ? JSON.parse(saved) : [];
  });

  // Load Tableau widgets from localStorage
  const [tableauWidgets, setTableauWidgets] = useState<TableauWidgetConfig[]>(() => {
    const saved = localStorage.getItem("dashboard-tableau-widgets");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Save active widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard-active-widgets", JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  // Save widget sizes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard-widget-sizes", JSON.stringify(widgetSizes));
  }, [widgetSizes]);

  // Save custom widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard-custom-widgets", JSON.stringify(customWidgets));
  }, [customWidgets]);

  // Save Tableau widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard-tableau-widgets", JSON.stringify(tableauWidgets));
  }, [tableauWidgets]);

  // Handle scroll to hide/show drawer button
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('.overflow-y-auto');
      if (mainContent) {
        const scrollTop = mainContent.scrollTop;
        setIsScrolled(scrollTop > 100);
      }
    };

    const mainContent = document.querySelector('.overflow-y-auto');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Drop zone for widgets
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item: { id: string }) => {
      if (!activeWidgets.includes(item.id)) {
        setActiveWidgets([...activeWidgets, item.id]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [activeWidgets]);

  const removeWidget = (id: string) => {
    setActiveWidgets(activeWidgets.filter((w) => w !== id));
  };

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    setActiveWidgets((prevWidgets) => {
      const newWidgets = [...prevWidgets];
      const draggedWidget = newWidgets[dragIndex];
      const draggedWidgetId = draggedWidget;
      const targetWidgetId = newWidgets[hoverIndex];
      
      // Move widget
      newWidgets.splice(dragIndex, 1);
      newWidgets.splice(hoverIndex, 0, draggedWidget);
      
      // Swap sizes
      setWidgetSizes((prevSizes) => {
        const newSizes = { ...prevSizes };
        const draggedSize = newSizes[draggedWidgetId];
        const targetSize = newSizes[targetWidgetId];
        
        // Swap the sizes
        if (draggedSize || targetSize) {
          newSizes[draggedWidgetId] = targetSize;
          newSizes[targetWidgetId] = draggedSize;
        }
        
        return newSizes;
      });
      
      return newWidgets;
    });
  }, []);

  const handleSizeChange = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgetSizes(prev => ({
      ...prev,
      [widgetId]: size
    }));
  };

  const getGridSpan = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    // جداول به صورت پیش‌فرض بزرگ هستند
    const isTable = widgetId.includes('-table');
    
    if (isTable) {
      if (size === 'small') return 'md:col-span-2';
      if (size === 'medium') return 'md:col-span-2 lg:col-span-3';
      return 'md:col-span-3 lg:col-span-3'; // large
    }
    
    // ویجت‌های عادی
    if (size === 'small') return '';
    if (size === 'medium') return 'md:col-span-2';
    return 'md:col-span-2 lg:col-span-3'; // large
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6" ref={drop}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2">
          پنل شخصی
        </h1>
        <p className="text-sm text-[#585757] dark:text-[#8b92a8]">
          به پنل مدیریت رهگیر خوش آمدید
        </p>
      </div>

      {/* Drop Zone Indicator */}
      {isOver && activeWidgets.length === 0 && (
        <div
          className="border-2 border-dashed rounded-xl p-12 text-center mb-6"
          style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}05` }}
        >
          <LayoutDashboard className="w-12 h-12 mx-auto mb-2" style={{ color: colors.primary }} />
          <p className="text-sm font-medium" style={{ color: colors.primary }}>
            ویجت را اینجا رها کنید
          </p>
        </div>
      )}

      {/* Active Widgets Grid */}
      {activeWidgets.length > 0 && (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          style={{
            backgroundColor: isOver ? `${colors.primary}05` : 'transparent',
            borderRadius: isOver ? '12px' : '0',
            padding: isOver ? '12px' : '0',
            gridAutoRows: 'minmax(350px, auto)',
            gridAutoFlow: 'dense', // پر کردن هوشمند فضاهای خالی
          }}
        >
          {isLoading ? (
            // Skeleton Loading State
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            // Actual Widgets
            activeWidgets.map((widgetId, index) => {
              // بررسی اینکه آیا این یک ویجت از پیش تعریف شده است
              const config = availableWidgetsConfig.find((w) => w.id === widgetId);
              
              // بررسی اینکه آیا این یک ویجت سفارشی است
              const customWidget = customWidgets.find((w) => w.id === widgetId);
              
              // بررسی اینکه آیا این یک ویجت Tableau است
              const tableauWidget = tableauWidgets.find((w) => w.id === widgetId);
              
              // اگر نه ویجت از پیش تعریف شده و نه سفارشی و نه Tableau باشد، null برگردان
              if (!config && !customWidget && !tableauWidget) return null;

              // اگر ویجت سفارشی باشد
              if (customWidget) {
                const defaultSize = 'medium';
                const size = widgetSizes[widgetId] || defaultSize;
                const gridSpan = getGridSpan(widgetId, size);
                
                return (
                  <div 
                    key={widgetId} 
                    className={`${gridSpan} h-full`}
                    style={{ 
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <DraggableWidgetWrapper
                      id={widgetId}
                      index={index}
                      title={customWidget.title}
                      icon={Sparkles}
                      onMove={moveWidget}
                      size={size}
                      onSizeChange={(newSize) => handleSizeChange(widgetId, newSize)}
                      maxSize="large"
                      onEdit={() => {
                        setEditingWidget(customWidget);
                        setShowCustomWidgetBuilder(true);
                      }}
                      onRemove={() => removeWidget(widgetId)}
                    >
                      <CustomWidgetRenderer widget={customWidget} />
                    </DraggableWidgetWrapper>
                  </div>
                );
              }

              // اگر ویجت Tableau باشد
              if (tableauWidget) {
                const defaultSize = 'medium';
                const size = widgetSizes[widgetId] || defaultSize;
                const gridSpan = getGridSpan(widgetId, size);
                
                return (
                  <div 
                    key={widgetId} 
                    className={`${gridSpan} h-full`}
                    style={{ 
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <DraggableWidgetWrapper
                      id={widgetId}
                      index={index}
                      title={tableauWidget.title}
                      icon={BarChart3}
                      onMove={moveWidget}
                      size={size}
                      onSizeChange={(newSize) => handleSizeChange(widgetId, newSize)}
                      maxSize="large"
                      onRemove={() => removeWidget(widgetId)}
                    >
                      <TableauWidgetRenderer config={tableauWidget} />
                    </DraggableWidgetWrapper>
                  </div>
                );
              }

              // اگر ویجت از پیش تعریف شده باشد
              if (config) {
                const WidgetComponent = config.component;
                // تقویم با سایز پیش‌فرض کوچک، بقیه متوسط
                const defaultSize = widgetId === 'calendar' ? 'small' : 'medium';
                const size = widgetSizes[widgetId] || defaultSize;
                const gridSpan = getGridSpan(widgetId, size);
                
                // تقویم فقط تا سایز متوسط
                const maxSize = widgetId === 'calendar' ? 'medium' : 'large';
                
                return (
                  <div 
                    key={widgetId} 
                    className={`${gridSpan} h-full`}
                    style={{ 
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <DraggableWidgetWrapper
                      id={widgetId}
                      index={index}
                      title={config.title}
                      icon={config.icon}
                      onMove={moveWidget}
                      size={size}
                      onSizeChange={(newSize) => handleSizeChange(widgetId, newSize)}
                      maxSize={maxSize}
                      onRemove={() => removeWidget(widgetId)}
                    >
                      <WidgetComponent />
                    </DraggableWidgetWrapper>
                  </div>
                );
              }

              return null;
            })
          )}
        </div>
      )}

      {/* Quick Actions Cards */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="rounded-lg border p-8 hover:shadow-lg transition-all cursor-pointer group"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border
                }}
                onClick={() => setActivePage(action.page)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: colors.backgroundSecondary
                    }}
                  >
                    <Icon className="w-10 h-10" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h3 
                      className="text-lg font-bold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      {action.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Other Software Section */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: colors.textPrimary }}>
          دیگر نرم‌افزارها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
          {otherSoftware.map((software) => (
            <a
              key={software.id}
              href={software.link}
              className="rounded-lg border p-4 transition-colors cursor-pointer group flex items-center justify-between"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.cardBackground;
              }}
            >
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                {software.title}
              </span>
              <ArrowRight 
                className="w-4 h-4 transition-colors rotate-180" 
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Drawer with integrated button */}
      {!showDrawer && !isScrolled && !showNotifications && (
        <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isSidebarOpen ? 'md:block hidden' : 'block'}`}>
          <button 
            onClick={() => setShowDrawer(true)}
            style={{ backgroundColor: colors.primary }}
            className="text-white px-4 md:px-8 py-2.5 md:py-3 rounded-t-[20px] hover:opacity-90 transition-all flex items-center gap-2 md:gap-3 shadow-2xl border border-[#2a3142] border-b-0 active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium whitespace-nowrap">شخصی‌سازی داشبورد</span>
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      )}

      {/* Drawer */}
      {showDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer Content */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1f2e] z-50 rounded-t-3xl shadow-2xl border-t-2 border-[#e8e8e8] dark:border-[#2a3142] transition-transform duration-300 animate-slideUp max-h-[70vh] md:max-h-[50vh] overflow-y-auto" dir="rtl">

            <div className="p-4 md:p-6 pb-24">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-start justify-between mb-4 md:mb-6 gap-3 md:gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div 
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}11` }}
                  >
                    <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.primary }} />
                  </div>
                  <div className="flex-1 md:flex-initial">
                    <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
                      شخصی‌سازی داشبورد
                    </h3>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      ویجت‌ها را به داشبورد بکشید
                    </p>
                  </div>
                  
                  {/* Mobile: Close button next to title */}
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="transition-colors md:hidden flex-shrink-0"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.error;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.textSecondary;
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Help Box */}
                <div 
                  className="w-full md:flex-1 md:max-w-md p-2.5 md:p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: `${colors.primary}11`,
                    borderColor: colors.primary
                  }}
                >
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    هر ویجت را با موس بگیرید و به صفحه داشبورد بکشید. برای حذف، روی دکمه X کلیک کنید.
                  </p>
                </div>

                {/* Desktop: Close button and counter */}
                <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                  <div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: `${colors.primary}11` }}
                  >
                    <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                      {activeWidgets.length} فعال / {availableWidgetsConfig.length - activeWidgets.length} موجود
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="transition-colors"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.error;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.textSecondary;
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile: Widget counter */}
              <div className="md:hidden mb-4">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}11` }}
                >
                  <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                    {activeWidgets.length} فعال / {availableWidgetsConfig.length - activeWidgets.length} موجود
                  </span>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("ready")}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all"
                  style={{
                    backgroundColor: activeTab === "ready" ? colors.primary : colors.backgroundSecondary,
                    color: activeTab === "ready" ? "#ffffff" : colors.textPrimary,
                    border: `1px solid ${activeTab === "ready" ? colors.primary : colors.border}`
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>شاخص‌های آماده</span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: activeTab === "ready" ? "#ffffff20" : colors.primary + "15",
                        color: activeTab === "ready" ? "#ffffff" : colors.primary
                      }}
                    >
                      {availableWidgetsConfig.filter(w => w.category === "ready" && !activeWidgets.includes(w.id)).length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("composite")}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all"
                  style={{
                    backgroundColor: activeTab === "composite" ? colors.primary : colors.backgroundSecondary,
                    color: activeTab === "composite" ? "#ffffff" : colors.textPrimary,
                    border: `1px solid ${activeTab === "composite" ? colors.primary : colors.border}`
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>شاخص‌های ترکیبی</span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: activeTab === "composite" ? "#ffffff20" : colors.primary + "15",
                        color: activeTab === "composite" ? "#ffffff" : colors.primary
                      }}
                    >
                      {availableWidgetsConfig.filter(w => w.category === "composite" && !activeWidgets.includes(w.id)).length}
                    </span>
                  </div>
                </button>
              </div>

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {/* ویجت‌های موجود */}
                {availableWidgetsConfig
                  .filter(widget => !activeWidgets.includes(widget.id) && widget.category === activeTab)
                  .map(widget => {
                  const WidgetComponent = widget.component;

                  return (
                    <WidgetWrapper
                      key={widget.id}
                      id={widget.id}
                      title={widget.title}
                      icon={widget.icon}
                      isDraggable={true}
                    >
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                            {widget.description}
                          </p>
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${colors.primary}11`,
                              color: colors.primary 
                            }}
                          >
                            بکشید به داشبورد
                          </div>
                        </div>
                      </div>
                    </WidgetWrapper>
                  );
                })}

                {/* شاخص‌های سفارشی ساخته شده */}
                {customWidgets.map((widget) => (
                  <WidgetWrapper
                    key={widget.id}
                    id={widget.id}
                    title={widget.title}
                    icon={Sparkles}
                    isDraggable={!activeWidgets.includes(widget.id)}
                    onEdit={() => {
                      setEditingWidget(widget);
                      setShowCustomWidgetBuilder(true);
                    }}
                    onRemove={() => {
                      setDeleteConfirmWidget({ id: widget.id, title: widget.title, type: 'custom' });
                    }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                          {widget.chartType === "bar" && "نمودار میله‌ای"}
                          {widget.chartType === "line" && "نمودار خطی"}
                          {widget.chartType === "pie" && "نمودار دایره‌ای"}
                          {widget.chartType === "area" && "نمودار منطقه‌ای"}
                          {widget.chartType === "radar" && "نمودار رادار"}
                          {widget.chartType === "table" && "جدول"}
                        </p>
                        {!activeWidgets.includes(widget.id) && (
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${colors.primary}11`,
                              color: colors.primary 
                            }}
                          >
                            بکشید به داشبورد
                          </div>
                        )}
                        {activeWidgets.includes(widget.id) && (
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${colors.success}11`,
                              color: colors.success 
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            فعال شده
                          </div>
                        )}
                      </div>
                    </div>
                  </WidgetWrapper>
                ))}

                {/* شاخص‌های Tableau ساخته شده */}
                {tableauWidgets.map((widget) => (
                  <WidgetWrapper
                    key={widget.id}
                    id={widget.id}
                    title={widget.title}
                    icon={BarChart3}
                    isDraggable={!activeWidgets.includes(widget.id)}
                    onRemove={() => {
                      setDeleteConfirmWidget({ id: widget.id, title: widget.title, type: 'custom' });
                    }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                          نمودار Tableau
                        </p>
                        {!activeWidgets.includes(widget.id) && (
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${colors.primary}11`,
                              color: colors.primary 
                            }}
                          >
                            بکشید به داشبورد
                          </div>
                        )}
                        {activeWidgets.includes(widget.id) && (
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${colors.success}11`,
                              color: colors.success 
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            فعال شده
                          </div>
                        )}
                      </div>
                    </div>
                  </WidgetWrapper>
                ))}

                {/* باکس ساخت شاخص سفارشی - ساده */}
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    setShowCustomWidgetBuilder(true);
                  }}
                  className="rounded-lg border-2 border-dashed p-6 transition-all hover:scale-105"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: `${colors.primary}05`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[120px]">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}15` }}
                    >
                      <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold mb-1" style={{ color: colors.primary }}>
                        ساخت شاخص سفارشی
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        سازنده ساده و سریع
                      </p>
                    </div>
                  </div>
                </button>

                {/* باکس ساخت شاخص حرفه‌ای - Tableau Style */}
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    setShowTableauBuilder(true);
                  }}
                  className="rounded-lg border-2 border-dashed p-6 transition-all hover:scale-105"
                  style={{
                    borderColor: "#8b5cf6",
                    backgroundColor: "#8b5cf615",
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[120px]">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#8b5cf625" }}
                    >
                      <BarChart3 className="w-6 h-6" style={{ color: "#8b5cf6" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold mb-1" style={{ color: "#8b5cf6" }}>
                        سازنده حرفه‌ای نمودار
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        مشابه Tableau - کشیدن و رها کردن
                      </p>
                    </div>
                  </div>
                </button>
                
                {/* Empty State - فقط زمانی نمایش داده شود که هیچ ویجتی موجود نباشد */}
                {availableWidgetsConfig.filter(widget => !activeWidgets.includes(widget.id) && widget.category === activeTab).length === 0 && customWidgets.length === 0 && tableauWidgets.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                      style={{ backgroundColor: `${colors.success}11` }}
                    >
                      <CheckCircle2 className="w-8 h-8" style={{ color: colors.success }} />
                    </div>
                    <h4 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                      همه ویجت‌ها فعال شده‌اند! 
                    </h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      تمام ویجت‌های موجود را به داشبورد اضافه کرده‌اید
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom Widget Builder Modal */}
      {showCustomWidgetBuilder && (
        <CustomWidgetBuilder
          onSave={(widget) => {
            if (editingWidget) {
              // حالت ویرایش - به‌روزرسانی ویجت موجود
              setCustomWidgets(customWidgets.map(w => w.id === widget.id ? widget : w));
            } else {
              // حالت ساخت جدید - افزودن ویجت جدید
              setCustomWidgets([...customWidgets, widget]);
              setActiveWidgets([...activeWidgets, widget.id]);
            }
            setShowCustomWidgetBuilder(false);
            setEditingWidget(undefined);
          }}
          onClose={() => {
            setShowCustomWidgetBuilder(false);
            setEditingWidget(undefined);
          }}
          editWidget={editingWidget}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmWidget && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300"
            onClick={() => setDeleteConfirmWidget(null)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md mx-4">
            <div
              className="rounded-2xl shadow-2xl p-6"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.error}15` }}
                >
                  <Trash2 className="w-8 h-8" style={{ color: colors.error }} />
                </div>
              </div>

              {/* Title */}
              <h3
                className="text-xl font-bold text-center mb-2"
                style={{ color: colors.textPrimary }}
              >
                حذف ویجت
              </h3>

              {/* Message */}
              <p
                className="text-center mb-6"
                style={{ color: colors.textSecondary }}
              >
                آیا از حذف ویجت <span className="font-bold" style={{ color: colors.textPrimary }}>"{deleteConfirmWidget.title}"</span> اطمینان دارید؟
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmWidget(null)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  }}
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmWidget.type === 'custom') {
                      // حذف ویجت سفارشی یا Tableau
                      setCustomWidgets(customWidgets.filter(w => w.id !== deleteConfirmWidget.id));
                      setTableauWidgets(prev => prev.filter(w => w.id !== deleteConfirmWidget.id));
                      setActiveWidgets(activeWidgets.filter(id => id !== deleteConfirmWidget.id));
                    } else {
                      // حذف ویجت عادی از داشبورد
                      removeWidget(deleteConfirmWidget.id);
                    }
                    setDeleteConfirmWidget(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-opacity"
                  style={{
                    backgroundColor: colors.error,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  حذف کنید
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tableau Style Widget Builder Modal */}
      {showTableauBuilder && (
        <TableauStyleWidgetBuilder
          onSave={(config) => {
            // ذخیره ویجت Tableau جدید
            const isEdit = tableauWidgets.some(w => w.id === config.id);
            if (isEdit) {
              setTableauWidgets(prev => prev.map(w => w.id === config.id ? config : w));
            } else {
              setTableauWidgets(prev => [...prev, config]);
              setActiveWidgets(prev => [...prev, config.id]);
            }
            setShowTableauBuilder(false);
          }}
          onClose={() => setShowTableauBuilder(false)}
        />
      )}
    </div>
  );
}