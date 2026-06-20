"use client"

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Warehouse,
  DollarSign,
  Bot,
  Settings,
  X,
} from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useEffect } from "react";

interface SidebarItem {
  id: "dashboard" | "sales" | "products" | "customers" | "warehouse" | "financial" | "ai" | "settings";
  label: string;
  icon: any;
  badge?: number;
}

const menuItems: SidebarItem[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "sales", label: "فروش", icon: ShoppingCart },
  { id: "products", label: "محصولات", icon: Package },
  { id: "customers", label: "مشتریان", icon: Users },
  { id: "warehouse", label: "انبار", icon: Warehouse },
  { id: "financial", label: "مالی", icon: DollarSign },
  { id: "ai", label: "هوش‌مصنوعی", icon: Bot },
];

const footerItems = [
  { id: "settings", label: "تنظیمات", icon: Settings },
];

type SidebarProps = {
  onHoverChange?: (hovered: boolean) => void;
};

export function Sidebar({ onHoverChange }: SidebarProps) {
  const { activePage, setActivePage } = useNavigation();
  const { isOpen, closeSidebar } = useSidebar();
  const colors = useCurrentColors();

  const isActive = (id: string) => activePage === id;

  const handleClick = (id: string) => {
    setActivePage(id as any);
    closeSidebar();
  };

  // Close with Escape on mobile
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSidebar]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="group fixed top-0 right-0 z-30 hidden h-screen w-20 shrink-0 flex-col overflow-hidden border-l transition-all duration-300 ease-in-out hover:w-64 md:flex"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      >
        {/* Menu items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 pt-16">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                title={item.label}
                className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200"
                style={{
                  backgroundColor: active ? colors.primary + "20" : "transparent",
                  color: active ? colors.primary : colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    e.currentTarget.style.color = colors.textPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.textSecondary;
                  }
                }}
              >
                <span className="flex h-12 w-10 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5 shrink-0" />
                </span>
                <span
                  className="whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                  style={{ color: active ? colors.primary : undefined }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-1 p-3">
          {footerItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                title={item.label}
                className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200"
                style={{
                  backgroundColor: active ? colors.primary + "20" : "transparent",
                  color: active ? colors.primary : colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    e.currentTarget.style.color = colors.textPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.textSecondary;
                  }
                }}
              >
                <span className="flex h-12 w-10 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5 shrink-0" />
                </span>
                <span
                  className="whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                  style={{ color: active ? colors.primary : undefined }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-screen w-64 flex-col border-l shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* Mobile close button */}
        <div className="flex justify-end p-3">
          <button
            onClick={closeSidebar}
            className="rounded-lg p-2"
            style={{ color: colors.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile menu items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {[...menuItems, ...footerItems].map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                title={item.label}
                className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200"
                style={{
                  backgroundColor: active ? colors.primary + "20" : "transparent",
                  color: active ? colors.primary : colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    e.currentTarget.style.color = colors.textPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.textSecondary;
                  }
                }}
              >
                <span className="flex h-12 w-10 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5 shrink-0" />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
