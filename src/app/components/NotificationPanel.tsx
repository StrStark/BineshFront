import { X, AlertCircle, CheckCircle, Info, Phone, TrendingUp, AlertTriangle, Sparkles, Bell, Tag, Code, Gift, Star, Trophy, FileText, Settings as SettingsIcon, Eye } from "lucide-react";
import { useState } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useNavigation } from "../contexts/NavigationContext";
import { copyToClipboard } from "../utils/clipboard";

type NotificationType = "activity" | "warning" | "success" | "promotion" | "system";
type NotificationTab = "all" | "activity" | "warnings" | "promotions" | "system";

interface Notification {
  id: number;
  type: NotificationType;
  category: NotificationTab;
  title: string;
  message: string;
  time: string;
  actionLabel?: string;
  actionPage?: string;
  promoCode?: string;
  badge?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "promotion",
    category: "promotions",
    title: "🎉 تخفیف ویژه پکیج پرمیوم",
    message: "با کد تخفیف QUALITY30 از ۳۰٪ تخفیف پکیج پرمیوم رهگیر بهره‌مند شوید",
    time: "۱ ساعت پیش",
    actionLabel: "دریافت کد تخفیف",
    promoCode: "QUALITY30",
    badge: "۳۰٪ تخفیف"
  },
  {
    id: 2,
    type: "success",
    category: "activity",
    title: "✨ عملکرد عالی کارشناس",
    message: "کارشناس رضا احمدی امروز ۱۵ تماس با امتیاز بالای ۹۰ انجام داده است",
    time: "۲ ساعت پیش",
    actionLabel: "مشاهده جزئیات",
    actionPage: "agents"
  },
  {
    id: 3,
    type: "warning",
    category: "warnings",
    title: "⚠️ کاهش کیفیت تماس‌ها",
    message: "میانگین کیفیت تماس‌ها در ۲ ساعت اخیر به زیر ۷۰ رسیده است",
    time: "۳ ساعت پیش",
    actionLabel: "بررسی گزارش",
    actionPage: "reports"
  },
  {
    id: 4,
    type: "activity",
    category: "activity",
    title: "📞 تماس جدید ثبت شد",
    message: "تماس با مشتری آقای محمدی با موفقیت ضبط و ذخیره شد",
    time: "۴ ساعت پیش",
    actionLabel: "گوش دادن",
    actionPage: "calls"
  },
  {
    id: 5,
    type: "promotion",
    category: "promotions",
    title: "🎁 هدیه ویژه کاربران فعال",
    message: "به پاس استفاده مستمر شما، یک ماه اشتراک پرمیوم رایگان دریافت کنید",
    time: "۵ ساعت پیش",
    actionLabel: "فعال‌سازی",
    promoCode: "FREE1MONTH",
    badge: "رایگان"
  },
  {
    id: 6,
    type: "system",
    category: "system",
    title: "🔄 به‌روزرسانی سیستم",
    message: "نسخه جدید رهگیر با قابلیت‌های جدید منتشر شد",
    time: "۱ روز پیش",
    actionLabel: "مشاهده تغییرات"
  },
  {
    id: 7,
    type: "success",
    category: "activity",
    title: "🏆 رکورد جدید ثبت شد",
    message: "تیم شما امروز بیشترین تعداد تماس موفق ماه را ثبت کرد",
    time: "۲ روز پیش",
    actionLabel: "مشاهده آمار",
    actionPage: "dashboard"
  },
  {
    id: 8,
    type: "warning",
    category: "warnings",
    title: "🚨 تماس بدون ارزیابی",
    message: "۱۲ تماس در انتظار ارزیابی کیفی هستند",
    time: "۳ روز پیش",
    actionLabel: "ارزیابی کنید",
    actionPage: "calls"
  },
  {
    id: 9,
    type: "promotion",
    category: "promotions",
    title: "💎 پیشنهاد ویژه سازمانی",
    message: "برای سازمان‌های بالای ۵۰ نفر، تخفیف ویژه ۴۰٪ با کد ENTERPRISE40",
    time: "۴ روز پیش",
    actionLabel: "اطلاعات بیشتر",
    promoCode: "ENTERPRISE40",
    badge: "۴۰٪ تخفیف"
  },
  {
    id: 10,
    type: "activity",
    category: "activity",
    title: "📊 گزارش هفتگی آماده است",
    message: "گزارش عملکرد هفته گذشته تیم شما آماده مشاهده است",
    time: "۵ روز پیش",
    actionLabel: "مشاهده گزارش",
    actionPage: "reports"
  },
  {
    id: 11,
    type: "system",
    category: "system",
    title: "⚙️ نگهداری برنامه‌ریزی شده",
    message: "سیستم در تاریخ ۱۵ اردیبهشت به مدت ۲ ساعت در دسترس نخواهد بود",
    time: "۶ روز پیش",
    actionLabel: "جزئیات بیشتر"
  },
  {
    id: 12,
    type: "promotion",
    category: "promotions",
    title: "🌟 جشنواره تخفیف بهاره",
    message: "تا پایان فصل بهار، از تخفیف‌های ویژه رهگیر با کد SPRING25 استفاده کنید",
    time: "۷ روز پیش",
    actionLabel: "کپی کد تخفیف",
    promoCode: "SPRING25",
    badge: "۲۵٪ تخفیف"
  }
];

export function NotificationPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const colors = useCurrentColors();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  if (!isOpen) return null;

  // فیلتر اعلان‌ها بر اساس تب فعال
  const filteredNotifications = activeTab === "all" 
    ? mockNotifications 
    : mockNotifications.filter(n => n.category === activeTab);

  // شمارش اعلان‌ها در هر دسته
  const getCategoryCount = (category: NotificationTab) => {
    if (category === "all") return mockNotifications.length;
    return mockNotifications.filter(n => n.category === category).length;
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <Trophy className="w-5 h-5" style={{ color: "#22c55e" }} />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" style={{ color: "#f59e0b" }} />;
      case "activity":
        return <Phone className="w-5 h-5" style={{ color: colors.primary }} />;
      case "promotion":
        return <Gift className="w-5 h-5" style={{ color: "#ec4899" }} />;
      case "system":
        return <SettingsIcon className="w-5 h-5" style={{ color: "#6366f1" }} />;
    }
  };

  const handleCopyPromoCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs: { id: NotificationTab; label: string; icon: any }[] = [
    { id: "all", label: "همه پیام‌ها", icon: Bell },
    { id: "activity", label: "فعالیت‌ها", icon: TrendingUp },
    { id: "warnings", label: "هشدارها", icon: AlertTriangle },
    { id: "promotions", label: "تخفیف‌ها", icon: Tag },
    { id: "system", label: "سیستم", icon: SettingsIcon },
  ];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel with slide animation */}
      <div
        className="fixed left-0 top-0 h-screen w-[420px] shadow-2xl z-50 flex flex-col transition-colors duration-300 animate-slideInLeft"
        style={{ backgroundColor: colors.cardBackground }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: colors.primary }} />
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              اعلان‌ها
            </h2>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ 
                backgroundColor: `${colors.primary}20`,
                color: colors.primary 
              }}
            >
              {mockNotifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:rotate-90"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div 
          className="px-4 py-3 border-b overflow-x-auto"
          style={{ borderColor: colors.border }}
        >
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getCategoryCount(tab.id);
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.backgroundSecondary,
                    color: isActive ? '#ffffff' : colors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.border;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center"
                      style={{
                        backgroundColor: isActive ? '#ffffff30' : `${colors.primary}20`,
                        color: isActive ? '#ffffff' : colors.primary,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Bell className="w-16 h-16 mb-4" style={{ color: colors.textTertiary }} />
              <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                اعلانی یافت نشد
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className="rounded-xl border transition-all duration-200 overflow-hidden"
                style={{ 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border
                }}
              >
                <div className="p-4">
                  {/* Header with Icon and Badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.cardBackground }}
                    >
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-bold leading-snug" style={{ color: colors.textPrimary }}>
                          {notif.title}
                        </h3>
                        {notif.badge && (
                          <span
                            className="text-xs px-2 py-1 rounded-md font-bold whitespace-nowrap flex-shrink-0"
                            style={{ 
                              backgroundColor: notif.type === "promotion" ? "#ec489920" : `${colors.primary}20`,
                              color: notif.type === "promotion" ? "#ec4899" : colors.primary
                            }}
                          >
                            {notif.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: colors.textSecondary }}>
                        {notif.message}
                      </p>
                      <p className="text-xs" style={{ color: colors.textTertiary }}>
                        {notif.time}
                      </p>
                    </div>
                  </div>

                  {/* Promo Code */}
                  {notif.promoCode && (
                    <div 
                      className="mt-3 p-3 rounded-lg border-2 border-dashed"
                      style={{ 
                        backgroundColor: colors.cardBackground,
                        borderColor: "#ec4899"
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4" style={{ color: "#ec4899" }} />
                          <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                            کد تخفیف:
                          </span>
                          <span 
                            className="text-sm font-mono font-bold px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: "#ec489920",
                              color: "#ec4899"
                            }}
                          >
                            {notif.promoCode}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyPromoCode(notif.promoCode!)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{
                            backgroundColor: copiedCode === notif.promoCode ? "#22c55e" : "#ec4899",
                            color: "#ffffff"
                          }}
                        >
                          {copiedCode === notif.promoCode ? "✓ کپی شد" : "کپی کد"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {notif.actionLabel && !notif.promoCode && (
                    <button
                      onClick={() => {
                        if (notif.actionPage) {
                          navigation.setActivePage(notif.actionPage as any);
                        }
                        onClose();
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#ffffff"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.transform = "scale(0.98)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{notif.actionLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
