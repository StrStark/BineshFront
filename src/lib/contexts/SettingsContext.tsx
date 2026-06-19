"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// تعریف نوع تنظیمات
export interface UserSettings {
  // تنظیمات عمومی
  organizationName: string;
  language: string;
  timezone: string;

  // تنظیمات پروفایل
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    title: string;
  };

  // تنظیمات ظاهر
  appearance: {
    fontSize: "small" | "medium" | "large";
  };

  // تنظیمات داده و پشتیبان
  data: {
    autoBackup: boolean;
  };
}

const defaultSettings: UserSettings = {
  organizationName: "",
  language: "فارسی",
  timezone: "تهران (UTC+3:30)",
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    title: "",
  },
  appearance: {
    fontSize: "medium",
  },
  data: {
    autoBackup: true,
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
  hasUnsavedChanges: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      try {
        const parsed = { ...defaultSettings, ...JSON.parse(saved) };
        setSettings(parsed);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.body) {
          const nameParts = (data.body.name || "").split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const roleMap: Record<string, string> = {
            admin: "مدیر سیستم",
            manager: "مدیر",
            supervisor: "سرپرست",
            user: "کاربر",
          };
          setSettings((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              firstName: firstName || prev.profile.firstName,
              lastName: lastName || prev.profile.lastName,
              phone: data.body.username || prev.profile.phone,
              position: roleMap[data.body.role] || prev.profile.position,
              title: data.body.role === "admin" ? "مهندس" : prev.profile.title,
            },
          }));
        }
      })
      .catch(() => {});
  }, []);

  const [savedSettings, setSavedSettings] = useState<UserSettings>(settings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // بررسی تغییرات
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, savedSettings]);

  // به روزرسانی تنظیمات
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      // Deep merge برای nested objects
      const updated = { ...prev };
      
      Object.keys(newSettings).forEach((key) => {
        const value = newSettings[key as keyof UserSettings];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          updated[key as keyof UserSettings] = {
            ...(prev as any)[key],
            ...value,
          } as any;
        } else {
          updated[key as keyof UserSettings] = value as any;
        }
      });
      
      return updated;
    });
  };

  // ذخیره تنظیمات
  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSavedSettings(settings);
    setHasUnsavedChanges(false);
  };

  // بازگردانی به تنظیمات پیش‌فرض
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
    setSavedSettings(defaultSettings);
    setHasUnsavedChanges(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        saveSettings,
        hasUnsavedChanges,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
