import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Warehouse,
  DollarSign,
  Bot,
  CalendarDays,
  Settings,
  GraduationCap,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import clsx from "clsx";
import { useNavigation } from "../contexts/NavigationContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useEffect, useState } from "react";

interface SidebarItem {
  id: "dashboard" | "sales" | "products" | "customers" | "warehouse" | "financial" | "ai" | "testpage" | "exhibition" | "settings";
  label: string;
  icon: any;
  badge?: number;
}

const menuItems: SidebarItem[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "exhibition", label: "بازدید نمایشگاه", icon: CalendarDays },
  { id: "sales", label: "فروش", icon: ShoppingCart },
  { id: "products", label: "محصولات", icon: Package },
  { id: "customers", label: "مشتریان", icon: Users },
  { id: "warehouse", label: "انبار", icon: Warehouse },
  { id: "financial", label: "مالی", icon: DollarSign },
  { id: "ai", label: "هوش‌مصنوعی", icon: Bot },
  { id: "testpage", label: "تست چارت‌ها", icon: Database },
];

const footerItems = [
  { id: "tutorials", label: "آموزش‌ها", icon: GraduationCap },
  { id: "settings", label: "تنظیمات", icon: Settings },
  { id: "support", label: "پشتیبانی", icon: HelpCircle },
];

export function Sidebar() {
  const { activePage, setActivePage } = useNavigation();
  const { isOpen, closeSidebar, openSidebar } = useSidebar();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = useCurrentColors();
  const [isHovering, setIsHovering] = useState(false);

  const handleMenuClick = (pageId: string) => {
    setActivePage(pageId as any);
    // Close sidebar on mobile after clicking
    closeSidebar();
  };

  // قابلیت باز شدن خودکار با حرکت موس به سمت راست
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 50; // فاصله از لبه راست (پیکسل)
      const distanceFromRight = window.innerWidth - e.clientX;

      // اگر موس به نزدیکی لبه راست رسید
      if (distanceFromRight <= threshold && !isOpen) {
        openSidebar();
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      // اگر sidebar به صورت خودکار باز شده بود، آن را ببند
      if (isHovering) {
        closeSidebar();
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen, isHovering, openSidebar, closeSidebar]);

   return (
    <>
      {/* منطقه trigger برای باز کردن sidebar */}
      {!isOpen && (
        <div
          className="fixed top-0 right-0 w-2 h-screen z-30 group"
          onMouseEnter={() => {
            openSidebar();
            setIsHovering(true);
          }}
          style={{
            backgroundColor: "transparent",
          }}
        >
          {/* خط نمایشگر بصری */}
          <div 
            className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-32 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              backgroundColor: colors.primary,
              boxShadow: `0 0 20px ${colors.primary}40`,
            }}
          />
          
          {/* Tooltip راهنما */}
          <div 
            className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
            style={{
              transform: 'translateY(-50%) translateX(0)',
            }}
          >
            <div 
              className="px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.textPrimary,
                borderColor: colors.border,
                border: `1px solid ${colors.border}`,
              }}
            >
              منوی راهبری ← 
            </div>
          </div>
        </div>
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-full md:w-64 border-l flex flex-col transition-all duration-300 h-screen fixed top-0 right-0 z-40`}
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}
        dir="rtl"
        onMouseLeave={() => {
          // فقط اگر sidebar به صورت hover باز شده باشد، آن را ببند
          if (isHovering) {
            setTimeout(() => {
              closeSidebar();
              setIsHovering(false);
            }, 300);
          }
        }}
      >
        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto pt-20">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all"
                    style={{
                      backgroundColor: isActive ? colors.primary + '50' : 'transparent',
                      color: isActive ? colors.primary : colors.textSecondary,
                      border: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                      fontWeight: isActive ? '600' : '400'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                        e.currentTarget.style.color = colors.textPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textSecondary;
                      }
                    }}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <span 
                          className="text-white text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.error }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <Icon className="w-5 h-5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <div className="space-y-1">
            {footerItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? colors.primary + '50' : 'transparent',
                    color: isActive ? colors.primary : colors.textSecondary,
                    border: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                    fontWeight: isActive ? '600' : '400'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                      e.currentTarget.style.color = colors.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.textSecondary;
                    }
                  }}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}