import { Bell, Gift, Percent, ShoppingBag, TrendingUp, Check, Copy, Eye, Star, Package, Settings, Phone, Trophy, AlertTriangle, Code, Tag } from "lucide-react";
import { useState } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ThemedButton } from "../components/ThemedButton";
import { Toggle } from "../components/Toggle";
import { useSettings } from "../contexts/SettingsContext";
import { useNavigation, type PageType } from "../contexts/NavigationContext";
import { useSettingsTab } from "../contexts/SettingsTabContext";
import { copyToClipboard } from "../utils/clipboard";

type NotificationType = "activity" | "warning" | "success" | "promotion" | "system";
type NotificationCategory = "all" | "activity" | "warnings" | "promotions" | "system";

interface Notification {
  id: number;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  time: string;
  actionLabel?: string;
  actionPage?: PageType;
  promoCode?: string;
  badge?: string;
  changes?: string[];
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "promotion",
    category: "promotions",
    title: " تخفیف ویژه پکیج پرمیوم",
    message: "با کد تخفیف QUALITY30 از ۳۰٪ تخفیف پکیج پرمیوم رهگیر بهره‌مند شوید",
    time: "۱ ساعت پیش",
    promoCode: "QUALITY30",
    badge: "۳۰٪ تخفیف"
  },
  {
    id: 2,
    type: "success",
    category: "activity",
    title: " عملکرد عالی کارشناس",
    message: "کارشناس رضا احمدی امروز ۱۵ تماس با امتیاز بالای ۹۰ انجام داده است",
    time: "۲ ساعت پیش",
    changes: [
      "۱۵ تماس موفق با میانگین امتیاز ۹۳",
      "افزایش ۲۵٪ نسبت به روز گذشته",
      "کسب رتبه اول در تیم امروز"
    ]
  },
  {
    id: 3,
    type: "warning",
    category: "warnings",
    title: " کاهش کیفیت تماس‌ها",
    message: "میانگین کیفیت تماس‌ها در ۲ ساعت اخیر به زیر ۷۰ رسیده است",
    time: "۳ ساعت پیش",
    changes: [
      "کاهش از ۸۵ به ۶۸ در ۲ ساعت گذشته",
      "تماس‌های ناموفق افزایش ۳۰٪ یافته",
      "نیاز به بررسی فوری فرآیندها"
    ]
  },
  {
    id: 4,
    type: "promotion",
    category: "promotions",
    title: " هدیه ویژه کاربران فعال",
    message: "به پاس استفاده مستمر شما، یک ماه اشتراک پرمیوم رایگان دریافت کنید",
    time: "۴ ساعت پیش",
    promoCode: "FREE1MONTH",
    badge: "رایگان"
  },
  {
    id: 5,
    type: "system",
    category: "system",
    title: " به‌روزرسانی سیستم",
    message: "نسخه جدید رهگیر با قابلیت‌های جدید منتشر شد",
    time: "۱ روز پیش",
    changes: [
      "داشبورد جدید با ویجت‌های قابل تنظیم",
      "سیستم گزارش‌گیری پیشرفته",
      "بهبود عملکرد و رفع باگ‌ها"
    ]
  },
  {
    id: 6,
    type: "success",
    category: "activity",
    title: " رکورد جدید ثبت شد",
    message: "تیم شما امروز بیشترین تعداد تماس موفق ماه را ثبت کرد",
    time: "۲ روز پیش",
    changes: [
      "۱۲۷ تماس موفق در یک روز",
      "بهبود ۴۰٪ نسبت به میانگین ماه",
      "نرخ رضایت مشتری: ۹۲٪"
    ]
  },
  {
    id: 7,
    type: "warning",
    category: "warnings",
    title: " تماس بدون ارزیابی",
    message: "۱۲ تماس در انتظار ارزیابی کیفی هستند",
    time: "۳ روز پیش",
    changes: [
      "۱۲ تماس نیاز به ارزیابی دارند",
      "قدیمی‌ترین تماس: ۳ روز پیش",
      "توصیه: ارزیابی در کمتر از ۲۴ ساعت"
    ]
  },
  {
    id: 8,
    type: "promotion",
    category: "promotions",
    title: " پیشنهاد ویژه سازمانی",
    message: "برای سازمان‌های بالای ۵۰ نفر، تخفیف ویژه ۴۰٪ با کد ENTERPRISE40",
    time: "۴ روز پیش",
    promoCode: "ENTERPRISE40",
    badge: "۴۰٪ تخفیف"
  },
  {
    id: 9,
    type: "activity",
    category: "activity",
    title: " گزارش هفتگی آماده است",
    message: "گزارش عملکرد هفته گذشته تیم شما آماده مشاهده است",
    time: "۵ روز پیش",
    changes: [
      "۴۸۵ تماس در هفته گذشته",
      "میانگین امتیاز کیفیت: ۸۵/۱۰۰",
      "بهترین کارشناس: رضا احمدی"
    ]
  },
  {
    id: 10,
    type: "system",
    category: "system",
    title: " نگهداری برنامه‌ریزی شده",
    message: "سیستم در تاریخ ۱۵ اردیبهشت به مدت ۲ ساعت در دسترس نخواهد بود",
    time: "۶ روز پیش",
    changes: [
      "زمان: ۱۵ اردیبهشت، ساعت ۲ تا ۴ بامداد",
      "دلیل: ارتقا سرورها و بهبود امنیت",
      "اطلاعات شما در امان خواهد بود"
    ]
  },
  {
    id: 11,
    type: "promotion",
    category: "promotions",
    title: " جشنواره تخفیف بهاره",
    message: "تا پایان فصل بهار، از تخفیف‌های ویژه رهگیر با کد SPRING25 استفاده کنید",
    time: "۷ روز پیش",
    promoCode: "SPRING25",
    badge: "۲۵٪ تخفیف"
  }
];

const filterTabs = [
  { id: "all", label: "همه پیام‌ها", icon: Bell },
  { id: "activity", label: "فعالیت‌ها", icon: TrendingUp },
  { id: "warnings", label: "هشدارها", icon: AlertTriangle },
  { id: "promotions", label: "تخفیف‌ها", icon: Tag },
  { id: "system", label: "سیستم", icon: Settings }
];

export function NotificationsPage() {
  const colors = useCurrentColors();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { settings, updateSettings } = useSettings();
  const { setActivePage } = useNavigation();
  const { setActiveTab } = useSettingsTab();

  const filteredNotifications = activeFilter === "all" 
    ? mockNotifications 
    : mockNotifications.filter(n => n.category === activeFilter);

  const handleCopy = (text: string, id: number) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNavigateToSettings = () => {
    setActiveTab("notifications");
    setActivePage("settings");
  };

  const getIconComponent = (type: NotificationType) => {
    switch(type) {
      case "promotion": return Gift;
      case "success": return Trophy;
      case "warning": return AlertTriangle;
      case "activity": return TrendingUp;
      case "system": return Settings;
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch(type) {
      case "promotion": return "#ec4899";
      case "success": return "#22c55e";
      case "warning": return "#f59e0b";
      case "activity": return colors.primary;
      case "system": return "#6366f1";
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            اعلان‌ها
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            مدیریت اعلان‌ها و پیام‌های سیستم
          </p>
        </div>
        
      </div>

      {/* Filter Tabs */}
      <div 
        className="rounded-lg border p-2"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  backgroundColor: isActive ? colors.primary : "transparent",
                  color: isActive ? "#ffffff" : colors.textSecondary,
                  fontWeight: isActive ? "600" : "400"
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const IconComponent = getIconComponent(notification.type);
          const iconColor = getIconColor(notification.type);
          return (
            <div
              key={notification.id}
              className="rounded-lg border p-6 transition-all hover:shadow-md"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${iconColor}15` }}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color: iconColor }} 
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 
                      className="font-semibold text-base"
                      style={{ color: colors.textPrimary }}
                      dir="auto"
                    >
                      {notification.title}
                    </h3>
                    {notification.badge && (
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                        style={{
                          backgroundColor: `${colors.primary}15`,
                          color: colors.primary
                        }}
                      >
                        {notification.badge}
                      </span>
                    )}
                  </div>
                  
                  <p 
                    className="text-sm mb-3 leading-relaxed"
                    style={{ color: colors.textSecondary }}
                    dir="auto"
                  >
                    {notification.message}
                  </p>

                  {/* Promo Code Box (only for promotions) */}
                  {notification.promoCode && (
                    <div 
                      className="flex items-center gap-2 p-3 rounded-lg border mb-3"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border
                      }}
                    >
                      <span 
                        className="text-sm font-mono flex-1"
                        style={{ color: colors.textPrimary }}
                        dir="ltr"
                      >
                        کد تخفیف: {notification.promoCode}
                      </span>
                      <button
                        onClick={() => handleCopy(notification.promoCode!, notification.id)}
                        className="px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                        style={{
                          backgroundColor: copiedId === notification.id ? colors.success : colors.primary,
                          color: "#ffffff"
                        }}
                      >
                        {copiedId === notification.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-xs">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-xs">کپی کد</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Changes List (bullet points) */}
                  {notification.changes && notification.changes.length > 0 && (
                    <div 
                      className="p-3 rounded-lg border mb-3"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border
                      }}
                    >
                      <ul className="space-y-1.5">
                        {notification.changes.map((change, index) => (
                          <li 
                            key={index} 
                            className="text-xs flex items-start gap-2"
                            style={{ color: colors.textSecondary }}
                          >
                            <span 
                              className="mt-1 flex-shrink-0"
                              style={{ color: colors.primary }}
                            >
                              •
                            </span>
                            <span className="flex-1">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Time */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xs"
                      style={{ color: colors.textTertiary }}
                    >
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div 
          className="rounded-lg border p-12 text-center"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border
          }}
        >
          <Bell 
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: colors.textTertiary }}
          />
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            اعلانی وجود ندارد
          </h3>
          <p 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            هیچ اعلانی در این دسته‌بندی یافت نشد
          </p>
        </div>
      )}

      {/* Message Settings Section */}
      <div 
        className="rounded-lg border p-6"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5" style={{ color: colors.primary }} />
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            تنظیمات پیام‌ها
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { 
              key: "newCalls", 
              title: "تماس‌های جدید", 
              desc: "دریافت اعلا برای تماس‌های ورودی جدید",
              icon: Bell
            },
            { 
              key: "systemMessages", 
              title: "پیام‌های سیستم", 
              desc: "اعلان‌های مربوط به عملکرد سیستم",
              icon: TrendingUp
            },
            { 
              key: "dailyReports", 
              title: "گزارش‌های روزانه", 
              desc: "دریافت خلاصه گزارش روزانه",
              icon: ShoppingBag
            },
            { 
              key: "securityAlerts", 
              title: "هشدارهای امنیتی", 
              desc: "اعلان‌های مربوط به امنیت حساب",
              icon: Star
            },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary
                }}
              >
                <div className="flex items-center gap-3">
                  <ItemIcon 
                    className="w-5 h-5" 
                    style={{ color: colors.textSecondary }} 
                  />
                  <div>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: colors.textPrimary }}
                    >
                      {item.title}
                    </p>
                    <p 
                      className="text-xs mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                  onChange={(checked) => {
                    const newSettings = {
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [item.key]: checked
                      }
                    };
                    updateSettings(newSettings);
                    localStorage.setItem('userSettings', JSON.stringify(newSettings));
                  }}
                  activeColor={colors.primary}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}