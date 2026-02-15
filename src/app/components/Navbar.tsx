import {
  Menu,
  ChevronDown,
  Bell,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Search,
  Key,
  GraduationCap,
  ChevronLeft,
  Maximize,
  Minimize,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useThemeColors } from "../contexts/ThemeColorsContext";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useTheme } from "../contexts/ThemeContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";
import { NotificationPanel } from "./NotificationPanel";

type PageType =
  | "dashboard"
  | "sales"
  | "products"
  | "customers"
  | "warehouse"
  | "financial"
  | "ai"
  | "exhibition"
  | "settings"
  | "tutorials"
  | "support"
  | "notifications";

const pageNames: Record<PageType, string> = {
  dashboard: "داشبورد",
  sales: "فروش",
  products: "محصولات",
  customers: "مشتریان",
  warehouse: "انبار",
  financial: "مالی",
  ai: "هوش‌مصنوعی",
  exhibition: "بازدید نمایشگاه",
  settings: "تنظیمات",
  tutorials: "آموزش‌ها",
  support: "پشتیبانی",
  notifications: "اعلان‌ها",
};

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = useCurrentColors();
  const { activePage, setActivePage, showNotifications, setShowNotifications } =
    useNavigation();
  const { toggleSidebar } = useSidebar();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showPagesMenu, setShowPagesMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const appsMenuRef = useRef<HTMLDivElement>(null);
  const pagesMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const handleBack = () => {
    setActivePage("dashboard");
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    // Check if fullscreen API is available and allowed
    if (!document.fullscreenEnabled) {
      console.log("Fullscreen is not enabled in this environment");
      return;
    }

    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.log("Fullscreen not available:", err.message);
          // Silently fail - fullscreen might not be allowed in iframe
          setIsFullscreen(false);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.log("Error exiting fullscreen:", err.message);
          setIsFullscreen(false);
        });
    }
  };

  // Listen for fullscreen changes (e.g., user pressing ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        appsMenuRef.current &&
        !appsMenuRef.current.contains(event.target as Node)
      ) {
        setShowAppsMenu(false);
      }
      if (
        pagesMenuRef.current &&
        !pagesMenuRef.current.contains(event.target as Node)
      ) {
        setShowPagesMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    setShowProfileMenu(false);
    logout();
    // Could redirect to login page or clear auth state
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 border-b px-3 md:px-9 py-1.5 transition-colors duration-300 z-50"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Right Side - Profile & Notifications */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-opacity-50"
                style={{
                  backgroundColor: showProfileMenu
                    ? `${colors.primary}11`
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!showProfileMenu) {
                    e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showProfileMenu) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {/* Name & Role - Desktop only */}
                <div className="hidden lg:flex flex-col items-end">
                  <span
                    className="text-sm font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    مهندس میرحسینی
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    مدیر سیستم
                  </span>
                </div>

                {/* Avatar */}
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: `${colors.primary}22`,
                    border: `2px solid ${colors.primary}44`,
                  }}
                >
                  <span
                    className="text-base md:text-lg font-bold"
                    style={{ color: colors.primary }}
                  >
                    م
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  {/* Menu */}
                  <div
                    className="absolute top-full left-0 mt-3 w-[320px] rounded-2xl border shadow-2xl overflow-hidden z-50 animate-fadeIn"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    }}
                    dir="rtl"
                  >
                    {/* User Info Header */}
                    <div
                      className="p-5 border-b"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{
                            backgroundColor: `${colors.primary}22`,
                            border: `3px solid ${colors.primary}44`,
                          }}
                        >
                          <span
                            className="text-3xl font-bold"
                            style={{ color: colors.primary }}
                          >
                            م
                          </span>
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-base font-bold mb-1"
                            style={{ color: colors.textPrimary }}
                          >
                            مهندس میرحسینی
                          </p>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.textSecondary }}
                          >
                            مدیر سیستم
                          </p>
                          {/* Removed online status indicator */}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {/* User Info */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActivePage("settings");
                          window.history.replaceState(
                            null,
                            "",
                            "/settings?tab=profile",
                          );
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-right group"
                        style={{ color: colors.textPrimary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.backgroundSecondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                          style={{ backgroundColor: `${colors.primary}11` }}
                        >
                          <User
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-sm font-bold block">
                            اطلاعات کاربری
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            مشاهده و ویرایش پروفایل
                          </span>
                        </div>
                        <ChevronLeft
                          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                          style={{ color: colors.textSecondary }}
                        />
                      </button>

                      {/* Settings */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActivePage("settings");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-right group"
                        style={{ color: colors.textPrimary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.backgroundSecondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                          style={{ backgroundColor: `${colors.primary}11` }}
                        >
                          <Settings
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-sm font-bold block">
                            تنظیمات
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            تنظیمات سیستم و حساب کاربری
                          </span>
                        </div>
                        <ChevronLeft
                          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                          style={{ color: colors.textSecondary }}
                        />
                      </button>

                      {/* Tutorials */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActivePage("tutorials");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-right group"
                        style={{ color: colors.textPrimary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.backgroundSecondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                          style={{ backgroundColor: `${colors.primary}11` }}
                        >
                          <GraduationCap
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-sm font-bold block">
                            آموزش‌ها
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            راهنما و آموزش استفاده
                          </span>
                        </div>
                        <ChevronLeft
                          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                          style={{ color: colors.textSecondary }}
                        />
                      </button>

                      {/* Version Info */}
                      <div
                        className="mx-2 my-3 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.backgroundSecondary }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Key
                              className="w-4 h-4"
                              style={{ color: colors.textSecondary }}
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: colors.textSecondary }}
                            >
                              نسخه سیستم
                            </span>
                          </div>
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-lg"
                            style={{
                              backgroundColor: `${colors.primary}22`,
                              color: colors.primary,
                            }}
                          >
                            v1.0.1
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div
                        className="h-px mx-2 my-2"
                        style={{ backgroundColor: colors.border }}
                      ></div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-right group"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.error}11`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                          style={{ backgroundColor: `${colors.error}11` }}
                        >
                          <LogOut
                            className="w-5 h-5"
                            style={{ color: colors.error }}
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <span
                            className="text-sm font-bold block"
                            style={{ color: colors.error }}
                          >
                            خروج از حساب
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            خروج از سیستم بینش
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative group"
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Bell
                  className={`w-6 h-6 transition-transform duration-300 ${showNotifications ? "rotate-12 scale-110" : "group-hover:rotate-12"}`}
                  style={{ color: colors.textPrimary }}
                />
              </div>
              <span
                className="absolute top-0 right-0 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-lg border-2 animate-pulse"
                style={{
                  background:
                    "linear-gradient(to bottom right, #ff3b3b, #e92c2c)",
                  borderColor: colors.cardBackground,
                }}
              >
                2
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 group"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label={isDarkMode ? "تغییر به حالت روز" : "تغییر به حالت شب"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-[#ffd700] group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                  style={{ color: colors.textPrimary }}
                />
              )}
            </button>

            {/* Fullscreen Toggle - Hidden on mobile */}
            <button
              onClick={toggleFullscreen}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 group"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label={
                isFullscreen
                  ? "خروج از حالت تمام صفحه"
                  : "ورود به حالت تمام صفحه"
              }
            >
              {isFullscreen ? (
                <Minimize
                  className="w-5 h-5 group-hover:scale-90 transition-transform duration-300"
                  style={{ color: colors.textPrimary }}
                />
              ) : (
                <Maximize
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: colors.textPrimary }}
                />
              )}
            </button>
          </div>

          {/* Center - Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div
              className="w-full rounded-lg px-4 py-2.5 flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
              }}
            >
              <Search
                className="w-4.5 h-4.5"
                style={{ color: colors.textSecondary }}
              />
              <input
                type="text"
                placeholder="فرآیند یا عبارت مد نظر خود را وارد کنید"
                className="bg-transparent flex-1 outline-none text-sm"
                style={{
                  color: colors.textSecondary,
                }}
                dir="rtl"
              />
            </div>
          </div>

          {/* Left - Logo & Breadcrumb & Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Menu Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="باز/بسته کردن منو"
            >
              <Menu className="w-5 h-5" style={{ color: colors.textPrimary }} />
            </button>

            {/* Breadcrumb - Only show when not on dashboard */}
            {activePage !== "dashboard" && (
              <>
                <div className="w-px h-5 bg-[#e8e8e8] dark:bg-[#2a3142] mx-1"></div>

                {/* Page Selector Dropdown */}
                <div className="relative" ref={pagesMenuRef}>
                  <button
                    onClick={() => setShowPagesMenu(!showPagesMenu)}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity group"
                  >
                    <span className="text-sm text-[#1c1c1c] dark:text-white">
                      {pageNames[activePage as PageType]}
                    </span>
                  </button>

                  {/* Pages Dropdown Menu */}
                  {showPagesMenu && (
                    <div
                      className="absolute top-full right-0 mt-2 w-[200px] bg-white dark:bg-[#1a1f2e] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142] shadow-xl overflow-hidden z-50 animate-fadeIn"
                      dir="rtl"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActivePage("dashboard");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "dashboard"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          داشبورد
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("exhibition");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "exhibition"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          بازدید نمایشگاه
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("sales");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "sales"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          فروش
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("products");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "products"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          محصولات
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("customers");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "customers"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          مشتریان
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("warehouse");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "warehouse"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          انبار
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("financial");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "financial"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          مالی
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("ai");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "ai"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          هوش مصنوعی
                        </button>

                        <div className="h-px bg-[#e8e8e8] dark:bg-[#2a3142] my-1"></div>

                        <button
                          onClick={() => {
                            setActivePage("settings");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "settings"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          تنظیمات
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("tutorials");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "tutorials"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          آموزش‌ها
                        </button>
                        <button
                          onClick={() => {
                            setActivePage("support");
                            setShowPagesMenu(false);
                          }}
                          className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                            activePage === "support"
                              ? "bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff]"
                              : "text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d]"
                          }`}
                        >
                          پشتیبانی
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <ChevronLeft className="w-4 h-4 text-[#585757] dark:text-[#8b92a8]" />
              </>
            )}

            {/* Logo with Apps Dropdown */}
            <div className="relative" ref={appsMenuRef}>
              <button
                onClick={() => setShowAppsMenu(!showAppsMenu)}
                className="px-2 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1 group"
                style={{ backgroundColor: colors.primary }}
              >
                <p className="text-white text-sm font-black uppercase">
                  مدیریت داده‌ها
                </p>
              </button>

              {/* Apps Dropdown Menu */}
              {showAppsMenu && (
                <div
                  className="absolute top-full right-0 mt-2 w-[240px] bg-white dark:bg-[#1a1f2e] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142] shadow-xl overflow-hidden z-50 animate-fadeIn"
                  dir="rtl"
                >
                  <div className="py-1">
                    <button className="w-full px-4 py-2.5 text-right text-sm bg-[#f7f9fb] dark:bg-[#252b3d] text-[#0085ff] cursor-default whitespace-nowrap">
                      پنل مدیریت داده 
                    </button>

                    <a href="https://rahgir.bineshafzar.ir">
                      <button className="w-full px-4 py-2.5 text-right text-sm text-[#1c1c1c] dark:text-white hover:bg-[#f7f9fb] dark:hover:bg-[#252b3d] transition-colors whitespace-nowrap">
                      پنل مدیریت تماس 
                    </button>
                    </a>
                   
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
