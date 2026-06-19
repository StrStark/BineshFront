"use client"

import {
  Palette,
  Shield,
  Check,
  Users,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  useThemeColors,
  useCurrentColors,
} from "../contexts/ThemeColorsContext";
import { useSettings } from "../contexts/SettingsContext";
import { useSettingsTab, type SettingsTab } from "../contexts/SettingsTabContext";
import { ThemedButton } from "../components/ThemedButton";
import { Toggle } from "../components/Toggle";
import { UsersAndPermissions } from "../components/UsersAndPermissions";

export function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentTheme, pendingTheme, setPendingTheme, applyTheme } =
    useThemeColors();
  const { settings, updateSettings, saveSettings, hasUnsavedChanges } =
    useSettings();
  const { activeTab, setActiveTab } = useSettingsTab();
  const colors = useCurrentColors();
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // بررسی تغییرات
  useEffect(() => {
    setHasChanges(currentTheme !== pendingTheme || hasUnsavedChanges);
  }, [currentTheme, pendingTheme, hasUnsavedChanges]);

  // تابع ذخیره همه تنظیمات
  const handleSaveAll = () => {
    applyTheme();
    saveSettings();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "users", label: "کاربران", icon: Users },
    { id: "support", label: "پشتیبانی", icon: Phone },
    { id: "appearance", label: "ظاهر و نمایش", icon: Palette },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: colors.textPrimary }}
        >
          تنظیمات
        </h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          مدیریت تنظیمات سیستم و حساب کاربری
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div
            className="rounded-lg border p-2"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
<button
  key={tab.id}
  onClick={() => setActiveTab(tab.id)}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
  style={{
    backgroundColor:
      activeTab === tab.id
        ? colors.backgroundSecondary
        : "transparent",
    color:
      activeTab === tab.id
        ? colors.textPrimary
        : colors.textSecondary,
    fontWeight: activeTab === tab.id ? "500" : "400",
  }}
  onMouseEnter={(e) => {
    if (activeTab !== tab.id) {
      e.currentTarget.style.backgroundColor = `${colors.primary}12`; // ~7% opacity
      // Optional: make text/icon slightly stronger
      // e.currentTarget.style.color = colors.textPrimary;
    }
  }}
  onMouseLeave={(e) => {
    if (activeTab !== tab.id) {
      e.currentTarget.style.backgroundColor = "transparent";
      // e.currentTarget.style.color = colors.textSecondary;
    }
  }}
>
  <Icon className="w-5 h-5" />
  <span className="text-sm">{tab.label}</span>
</button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {/* Support */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    پشتیبانی
                  </h2>
                  <p
                    className="text-sm mb-6"
                    style={{ color: colors.textSecondary }}
                  >
                    برای ارتباط با تیم پشتیبانی با شماره زیر تماس حاصل فرمایید
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <Phone className="w-7 h-7" style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        شماره پشتیبانی
                      </p>
                      <a
                        href="tel:09135098259"
                        className="text-xl font-bold transition-opacity hover:opacity-80"
                        style={{ color: colors.textPrimary, direction: "ltr", unicodeBidi: "plaintext" }}
                      >
                        ۰۹۱۳۵۰۹۸۲۵۹
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms & Privacy */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    قوانین و مقررات استفاده از نرم‌افزار بینش
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    لطفاً قوانین و مقررات استفاده از نرم‌افزار را به دقت مطالعه
                    کنید
                  </p>
                </div>

                <div
                  className="space-y-6 max-h-[600px] overflow-y-auto px-6 py-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                  }}
                >
                  {/* مقدمه */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۱. مقدمه
                    </h3>
                    <p
                      className="text-sm leading-7"
                      style={{ color: colors.textSecondary }}
                    >
                      نرم‌افزار بینش یک سامانه جامع مدیریت کیفیت مراکز تماس است
                      که با هدف بهبود فرآیندهای کاری و ارتقای کیفیت خدمات‌رسانی
                      طراحی شده است. استفاده از این نرم‌افزار مستلزم پذیرش و
                      رعایت کلیه قوانین و مقررات ذکر شده در این سند می‌باشد.
                    </p>
                  </div>

                  {/* حریم خصوصی */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۲. حریم خصوصی و محرمانگی اطلاعات
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        لیه اطلاعات ورودی در سامانه بینش محرمانه بوده و تنها
                        توسط افراد مجاز قابل دسترسی است.
                      </li>
                      <li className="list-disc">
                        کاربران موظف به حفاظت از اطلاعات کاربری خود شامل نام
                        کاربری و رمز عبور هستند.
                      </li>
                      <li className="list-disc">
                        هرگونه افشای اطلاعات محرمانه مشتریان یا سازمان به اشخاص
                        ثالث ممنوع بوده و پیگرد قانونی خواهد داشت.
                      </li>
                      <li className="list-disc">
                        سامانه از رمزنگاری پیشرفته برای حفاظت از داده‌ها استفاده
                        می‌کند.
                      </li>
                    </ul>
                  </div>

                  {/* مسئولیت‌های کاربران */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۳. مسئولیت‌های کاربران
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        کاربران موظف به استفاده صحیح و قانونی از نرم‌افزار
                        هستند.
                      </li>
                      <li className="list-disc">
                        هرگونه تلاش برای دستکاری، هک یا نفوذ غیرمجاز در سامانه
                        ممنوع است.
                      </li>
                      <li className="list-disc">
                        ثبت اطلاعات نادرست یا گمراه‌کننده در سامانه مجاز
                        نمی‌باشد.
                      </li>
                      <li className="list-disc">
                        استفاده از حساب کاربری توسط اشخاص دیگر ممنوع است.
                      </li>
                      <li className="list-disc">
                        کاربران باید رمز عبور خود را به صورت دوره‌ای تغییر دهند.
                      </li>
                    </ul>
                  </div>

                  {/* محدودیت‌های استفاده */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۴. محدودیت‌های استفاده
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        استفاده از نرم‌افزار برای اهداف غیرقانونی یا خلاف اخلاق
                        ممنوع است.
                      </li>
                      <li className="list-disc">
                        کپی‌برداری، توزیع یا فروش نرم‌افزار بدون اجازه کتبی
                        ممنوع می‌باشد.
                      </li>
                      <li className="list-disc">
                        انجام مهندسی معکوس یا تلاش برای استخراج کد منبع ممنوع
                        است.
                      </li>
                      <li className="list-disc">
                        استفاده از ابزارهای خودکار برای دسترسی به سامانه بدون
                        مجوز ممنوع است.
                      </li>
                    </ul>
                  </div>

                  {/* پشتیبانی و به‌روزرسانی */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۵. پشتیبانی و به‌روزرسانی
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        تیم پشتیبانی بینش در روزهای کاری آماده ارائه خدمات
                        می‌باشد.
                      </li>
                      <li className="list-disc">
                        به‌روزرسانی‌های نرم‌افزار به صورت خودکار انجام می‌شود.
                      </li>
                      <li className="list-disc">
                        کاربران موظف به نصب آخرین نسخه نرم‌افزار هستند.
                      </li>
                      <li className="list-disc">
                        گزارش مشکلات فنی به تیم پشتیبانی الزامی است.
                      </li>
                    </ul>
                  </div>

                  {/* مالکیت معنوی */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۶. مالکیت معنوی
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        کلیه حقوق مالکیت معنوی نرم‌افزار بینش متعلق به شرکت
                        سازنده می‌باشد.
                      </li>
                      <li className="list-disc">
                        لوگو، نام تجاری و طراحی‌های رابط کاربری تحت حمایت قوانین
                        مالکیت معنوی هستند.
                      </li>
                      <li className="list-disc">
                        استفاده تجاری از نام یا لوگوی بینش بدون مجوز ممنوع است.
                      </li>
                    </ul>
                  </div>

                  {/* محدودیت مسئولیت */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۷. محدودیت مسئولیت
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        نرم‌افزار بینش "همان‌طور که هست" ارائه می‌شود.
                      </li>
                      <li className="list-disc">
                        شرکت سازنده مسئولیتی در قبال خسارات ناشی از استفاده
                        نادرست ندارد.
                      </li>
                      <li className="list-disc">
                        کاربران موظف به تهیه نسخه پشتیبان از داده‌های خود هستند.
                      </li>
                      <li className="list-disc">
                        قطعی احتمالی سرویس‌ها به دلایل فنی یا نگهداری ممکن است.
                      </li>
                    </ul>
                  </div>

                  {/* تغییرات قوانین */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۸. تغییرات قوانین
                    </h3>
                    <p
                      className="text-sm leading-7"
                      style={{ color: colors.textSecondary }}
                    >
                      شرکت بینش حق تغییر، اصلاح یا به‌روزرسانی این قوانین را در
                      هر زمان محفوظ می‌دارد. کاربران موظف به بررسی دوره‌ای این
                      صفحه برای آگاهی از تغییرات احتمالی هستند. استفاده مستمر از
                      نرم‌افزار به منزله پذیرش قوانین جدید تلقی می‌شود.
                    </p>
                  </div>

                  {/* قوانین مربوط به داده */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      ۹. قوانین مربوط به داده و ذخیره‌سازی
                    </h3>
                    <ul
                      className="space-y-2 text-sm leading-7 pr-6"
                      style={{ color: colors.textSecondary }}
                    >
                      <li className="list-disc">
                        کلیه اطلاعات در سرورهای امن و با رعایت استانداردهای
                        بین‌المللی ذخیره می‌شوند.
                      </li>
                      <li className="list-disc">
                        سازمان حق دارد داده‌های غیرفعال بیش از مدت مشخص را حذف
                        کند.
                      </li>
                      <li className="list-disc">
                        کاربران می‌توانند درخواست حذف دائمی اطلاعات خود را ارائه
                        دهند.
                      </li>
                      <li className="list-disc">
                        انتقال داده به کشورهای خارج از ایران بدون رضایت کاربر
                        انجام نمی‌شود.
                      </li>
                    </ul>
                  </div>

                  {/* پایان */}
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.primary,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Shield
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: colors.primary }}
                      />
                      <div>
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: colors.textPrimary }}
                        >
                          تایید و پذیرش قوانین
                        </p>
                        <p
                          className="text-xs leading-6"
                          style={{ color: colors.textSecondary }}
                        >
                          با استفاده از نرم‌افزار بینش، شما تایید می‌کنید که
                          کلیه قوانین و مقررات فوق را مطالعه کرده و می‌پذیرید.
                          عدم رعایت این قوانین می‌تواند منجر به تعلیق یا لغو
                          حساب کاربری شما شود.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* Appearance */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    ظاهر و نمایش
                  </h2>
                </div>

                <div className="space-y-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          حالت تاریک
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.textSecondary }}
                        >
                          تغییر بین حالت روز و شب
                        </p>
                      </div>
                      <Toggle
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        activeColor={colors.primary}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: colors.textPrimary }}
                    >
                      تم رنگی
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* تم بینش */}
                      <button
                        onClick={() => setPendingTheme("default")}
                        className="relative group"
                      >
                        <div
                          className={`rounded-2xl p-6 h-48 flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl border-2 ${
                            pendingTheme === "default"
                              ? "border-[#2b5278] dark:border-[#2b5278]"
                              : "border-transparent"
                          }`}
                          style={{
                            background:
                              "linear-gradient(135deg, #1e3a5f 0%, #2b5278 100%)",
                          }}
                        >
                          <p className="text-white text-2xl font-bold">
                            تم بینش
                          </p>
                          {pendingTheme === "default" && (
                            <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <div className="w-5 h-5 bg-[#2b5278] rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>

                      {/* تم حافظ */}
                      <button
                        onClick={() => setPendingTheme("hafez")}
                        className="relative group"
                      >
                        <div
                          className={`relative bg-gradient-to-br from-[#3d7571] to-[#5a9a95] rounded-2xl p-6 h-48 flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl border-2 overflow-hidden ${
                            pendingTheme === "hafez"
                              ? "border-[#5a9a95] shadow-lg ring-4 ring-[#5a9a95]/20"
                              : "border-transparent"
                          }`}
                        >
                          {/* Diagonal Pattern */}
                          <div className="absolute inset-0">
                            <svg
                              className="w-full h-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 192 192"
                            >
                              <path
                                d="M0 0H192V192L0 0Z"
                                fill="rgba(90, 154, 149, 0.4)"
                              />
                            </svg>
                          </div>
                          <p className="relative z-10 text-white text-2xl font-bold">
                            تم حافظ
                          </p>
                          {pendingTheme === "hafez" && (
                            <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center z-20">
                              <div className="w-5 h-5 bg-[#5a9a95] rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users and Permissions */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <UsersAndPermissions />
              </div>
            )}

            {/* Save Button */}
            <div
              className="mt-6 pt-6 border-t"
              style={{ borderColor: colors.border }}
            >
              <ThemedButton
                className="px-6 py-3 rounded-lg flex items-center gap-2 flex-row-reverse"
                onClick={handleSaveAll}
                disabled={!hasChanges}
              >
                {hasChanges ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        whiteSpace: "nowrap",
                        minWidth: "fit-content", // Or a specific px value like '160px' if needed
                        direction: "rtl", // Assuming RTL context; change to 'ltr' if needed
                      }}
                    >
                      <span>اعمال تغییرات</span>
                      <Check className="w-5 h-5" />
                    </div>
                  </>
                ) : (
                  <span>تغییری وجود ندارد</span>
                )}
              </ThemedButton>
              {showSuccess && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[#00c853] bg-[#e6f9f0] dark:bg-[#1a3a2a] px-4 py-2 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span>تم با موفقیت اعمال شد!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
