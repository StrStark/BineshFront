import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// تعریف رنگ‌ها برای هر تم
export interface ThemeColors {
  primary: string;
  primaryHover: string;
  success: string;
  error: string;
  warning: string;
  purple: string;
  gold: string;
  background: string;
  cardBackground: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary?: string;
  backgroundSecondary: string;
  inputBackground: string;
}

export interface ThemeColorSet {
  light: ThemeColors;
  dark: ThemeColors;
}

// تم بینش - رنگ‌های فعلی برنامه
const defaultTheme: ThemeColorSet = {
  light: {
    primary: "#1e3a5f",
    primaryHover: "#152d4a",
    success: "#00c853",
    error: "#e92c2c",
    warning: "#ff9800",
    purple: "#9c27b0",
    gold: "#ffd700",
    background: "#f8fafc",
    cardBackground: "#ffffff",
    border: "#e8e8e8",
    textPrimary: "#1c1c1c",
    textSecondary: "#585757",
    textTertiary: "#9e9e9e",
    backgroundSecondary: "#f7f9fb",
    inputBackground: "#f7f9fb",
  },
  dark: {
    primary: "#2b5278",
    primaryHover: "#1e3a5f",
    success: "#00c853",
    error: "#e92c2c",
    warning: "#ff9800",
    purple: "#9c27b0",
    gold: "#ffd700",
    background: "#1a1f2e",
    cardBackground: "#232837",
    border: "#2a3142",
    textPrimary: "#ffffff",
    textSecondary: "#8b92a8",
    textTertiary: "#6b7280",
    backgroundSecondary: "#223265",
    inputBackground: "#2a3142",
  },
};

// تم حافظ - رنگ‌های سبز-آبی
const hafezTheme: ThemeColorSet = {
  light: {
    primary: "#5a9a95",
    primaryHover: "#478a85",
    success: "#3d7571",
    error: "#e92c2c",
    warning: "#d4af37",
    purple: "#3d7571",
    gold: "#d4af37",
    background: "#f8fafc",
    cardBackground: "#ffffff",
    border: "#d4e5e3",
    textPrimary: "#1c1c1c",
    textSecondary: "#4a6864",
    textTertiary: "#9e9e9e",
    backgroundSecondary: "#f0f7f6",
    inputBackground: "#f0f7f6",
  },
  dark: {
    primary: "#10b981",
    primaryHover: "#059669",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    purple: "#8b5cf6",
    gold: "#f59e0b",
    background: "#1a1d29",
    cardBackground: "#252836",
    border: "#2f3342",
    textPrimary: "#ffffff",
    textSecondary: "#9ca3af",
    textTertiary: "#6b7280",
    backgroundSecondary: "#2a2f3e",
    inputBackground: "#2a2f3e",
  },
};

interface ThemeColorsContextType {
  currentTheme: "default" | "hafez";
  pendingTheme: "default" | "hafez";
  setPendingTheme: (theme: "default" | "hafez") => void;
  applyTheme: () => void;
  colors: ThemeColorSet;
  isDarkMode: boolean;
}

const ThemeColorsContext = createContext<ThemeColorsContextType | undefined>(undefined);

export function ThemeColorsProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<"default" | "hafez">(() => {
    const saved = localStorage.getItem("appliedTheme");
    return (saved as "default" | "hafez") || "default";
  });

  const [pendingTheme, setPendingTheme] = useState<"default" | "hafez">(currentTheme);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === null) return true;
    return saved === "true";
  });

  // تابع اعمال تم
  const applyTheme = () => {
    setCurrentTheme(pendingTheme);
    localStorage.setItem("appliedTheme", pendingTheme);
    
    // اعمال CSS Variables
    const theme = pendingTheme === "default" ? defaultTheme : hafezTheme;
    const mode = isDarkMode ? "dark" : "light";
    const colors = theme[mode];
    
    // Set CSS variables in root
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-purple', colors.purple);
    root.style.setProperty('--color-gold', colors.gold);
  };

  // اعمال خودکار رنگ‌ها وقتی تم یا dark mode تغییر می‌کند
  useEffect(() => {
    const theme = currentTheme === "default" ? defaultTheme : hafezTheme;
    const mode = isDarkMode ? "dark" : "light";
    const colors = theme[mode];
    
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-purple', colors.purple);
    root.style.setProperty('--color-gold', colors.gold);
  }, [currentTheme, isDarkMode]);

  // گوش دادن به تغییرات dark mode از ThemeContext
  useEffect(() => {
    const handleStorageChange = () => {
      const darkModeValue = localStorage.getItem("darkMode");
      setIsDarkMode(darkModeValue === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    
    // بررسی هر 100ms برای sync شدن با ThemeContext
    const interval = setInterval(() => {
      const darkModeValue = localStorage.getItem("darkMode");
      if (darkModeValue !== null) {
        const newValue = darkModeValue === "true";
        setIsDarkMode(newValue);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const colors = currentTheme === "default" ? defaultTheme : hafezTheme;

  return (
    <ThemeColorsContext.Provider
      value={{
        currentTheme,
        pendingTheme,
        setPendingTheme,
        applyTheme,
        colors,
        isDarkMode,
      }}
    >
      {children}
    </ThemeColorsContext.Provider>
  );
}

export function useThemeColors() {
  const context = useContext(ThemeColorsContext);
  if (!context) {
    throw new Error("useThemeColors must be used within ThemeColorsProvider");
  }
  return context;
}

// Hook برای دسترسی به رنگ‌های فعلی تم
export function useCurrentColors() {
  const { colors, isDarkMode } = useThemeColors();
  return colors[isDarkMode ? "dark" : "light"];
}