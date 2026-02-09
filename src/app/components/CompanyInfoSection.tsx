import { Building2, Upload, Image, FileText } from "lucide-react";
import { useState } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ThemedButton } from "./ThemedButton";

export function CompanyInfoSection() {
  const colors = useCurrentColors();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [letterheadPreview, setLetterheadPreview] = useState<string | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "letterhead"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          setLogoPreview(reader.result as string);
        } else {
          setLetterheadPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6" style={{ color: colors.primary }} />
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          اطلاعات شرکت/موسسه
        </h2>
      </div>

      <div className="space-y-6">
        {/* Logo & Letterhead Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo Upload */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              لوگو
            </label>
            <div
              className="relative rounded-lg border-2 border-dashed p-6 text-center cursor-pointer hover:border-opacity-60 transition-all"
              style={{
                backgroundColor: `${colors.primary}08`,
                borderColor: colors.primary,
              }}
            >
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleFileUpload(e, "logo")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {logoPreview ? (
                <div className="space-y-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-32 h-32 object-contain mx-auto rounded-lg"
                  />
                  <p
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    کلیک کنید برای تغییر
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <Image className="w-8 h-8" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      لوگوی خود را بکشید و رها کنید
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      فقط فرمت‌های JPG / PNG کمتر از ۱۰ مگابایت
                    </p>
                  </div>
                  <ThemedButton className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto">
                    <span>انتخاب فایل</span>
                  </ThemedButton>
                </div>
              )}
            </div>
          </div>

          {/* Letterhead Upload */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              سربرگ
            </label>
            <div
              className="relative rounded-lg border-2 border-dashed p-6 text-center cursor-pointer hover:border-opacity-60 transition-all"
              style={{
                backgroundColor: `${colors.primary}08`,
                borderColor: colors.primary,
              }}
            >
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleFileUpload(e, "letterhead")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {letterheadPreview ? (
                <div className="space-y-2">
                  <img
                    src={letterheadPreview}
                    alt="Letterhead Preview"
                    className="w-full h-32 object-contain mx-auto rounded-lg"
                  />
                  <p
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    کلیک کنید برای تغییر
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <FileText className="w-8 h-8" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      فایل سربرگ A4 خود را بکشید و رها کنید
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      فقط فرمت‌های JPG / PNG کمتر از ۱۰ مگابایت
                    </p>
                  </div>
                  <ThemedButton className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto">
                    <span>انتخاب فایل</span>
                  </ThemedButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نام شخص حقیقی/حقوقی */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              نام شخص حقیقی/حقوقی *
            </label>
            <input
              type="text"
              placeholder="نام کامل شخص حقیقی یا حقوقی را وارد کنید"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              dir="rtl"
            />
          </div>

          {/* نام تجاری */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              نام تجاری
            </label>
            <input
              type="text"
              placeholder="نام تجاری شرکت را وارد کنید"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              dir="rtl"
            />
          </div>
        </div>

        {/* نشانی کامل */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            نشانی کامل
          </label>
          <input
            type="text"
            placeholder="آدرس دقیق پستی شرکت (پلاک، واحد، خیابان، ...) را وارد کنید"
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            dir="rtl"
          />
        </div>

        {/* کد پستی */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            کد پستی ۱۰ رقمی
          </label>
          <input
            type="text"
            placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
            maxLength={10}
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* شماره اقتصادی */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              شماره اقتصادی
            </label>
            <input
              type="text"
              placeholder="شماره اقتصادی ۱۲ رقمی را وارد کنید"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              dir="rtl"
            />
          </div>

          {/* شماره ثبت/شماره ملی */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              شماره ثبت / کد ملی
            </label>
            <input
              type="text"
              placeholder="شماره ثبت شرکت یا کد ملی شخص را وارد کنید"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* تاریخ ثبت شرکت */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              تاریخ ثبت شرکت
            </label>
            <input
              type="text"
              placeholder="مثال: ۱۴۰۴/۰۵/۱۷"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              dir="rtl"
            />
          </div>

          {/* شماره تلفن نمابر */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              شماره تلفن / نمابر
            </label>
            <input
              type="tel"
              placeholder="مثال: ۰۲۱۸۸۷۷۷۷۷۷"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              dir="rtl"
            />
          </div>
        </div>

        {/* آدرس وبسایت */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            آدرس وب‌سایت
          </label>
          <input
            type="url"
            placeholder="مثال: https://example.com"
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            dir="rtl"
          />
        </div>

        {/* ایمیل */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            ایمیل
          </label>
          <input
            type="email"
            placeholder="مثال: info@company.ir"
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-right"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            dir="rtl"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          {/* <ThemedButton className="px-6 py-3 rounded-lg text-sm font-semibold">
            ذخیره اطلاعات
          </ThemedButton> */}
        </div>
      </div>
    </div>
  );
}