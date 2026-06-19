"use client"

import { useState } from "react";
import { X, Shield, Check } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ThemedButton } from "./ThemedButton";

export interface Permission {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  initialPermissions?: Permission[];
  onSave?: (permissions: Permission[]) => void;
}

const defaultPermissions: Permission[] = [
  {
    id: "dashboard",
    label: "داشبورد",
    description: "دسترسی به داشبورد اصلی",
    enabled: true,
  },
  {
    id: "calls",
    label: "اطلاعات تماس",
    description: "مشاهده و مدیریت تماس‌ها",
    enabled: true,
  },
  {
    id: "customers",
    label: "اطلاعات مشتریان",
    description: "مشاهده و مدیریت مشتریان",
    enabled: true,
  },
  {
    id: "agents",
    label: "کارشناسان",
    description: "مدیریت کارشناسان",
    enabled: false,
  },
  {
    id: "analytics",
    label: "تحلیل‌ها",
    description: "دسترسی به گزارش‌های تحلیلی",
    enabled: true,
  },
  {
    id: "reports",
    label: "گزارش‌گیری",
    description: "دانلود و مشاهده گزارش‌ها",
    enabled: true,
  },
  {
    id: "settings",
    label: "تنظیمات",
    description: "تغییر تنظیمات سیستم",
    enabled: false,
  },
  {
    id: "users",
    label: "مدیریت کاربران",
    description: "افزودن و حذف کاربران",
    enabled: false,
  },
];

export function PermissionsModal({
  isOpen,
  onClose,
  userName,
  initialPermissions = defaultPermissions,
  onSave,
}: PermissionsModalProps) {
  const colors = useCurrentColors();
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);

  if (!isOpen) return null;

  const handleTogglePermission = (id: string) => {
    setPermissions(
      permissions.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(permissions);
    }
    onClose();
  };

  const handleClose = () => {
    // Reset to initial permissions
    setPermissions(initialPermissions);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + "20" }}
            >
              <Shield className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <div>
              <h2 className="text-xl" style={{ color: colors.textPrimary }}>
                مدیریت دسترسی‌ها
              </h2>
              <p className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>
                {userName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((permission) => (
              <button
                key={permission.id}
                onClick={() => handleTogglePermission(permission.id)}
                className="p-4 rounded-xl border-2 text-right transition-all hover:shadow-md"
                style={{
                  backgroundColor: permission.enabled
                    ? colors.primary + "10"
                    : colors.backgroundSecondary,
                  borderColor: permission.enabled
                    ? colors.primary
                    : colors.border,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3
                      className="font-medium mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      {permission.label}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {permission.description}
                    </p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: permission.enabled
                        ? colors.primary
                        : colors.border,
                    }}
                  >
                    {permission.enabled && (
                      <Check className="w-4 h-4" style={{ color: "#ffffff" }} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-end gap-3"
          style={{ borderColor: colors.border }}
        >
          <ThemedButton variant="secondary" onClick={handleClose}>
            بستن
          </ThemedButton>
          <ThemedButton variant="primary" onClick={handleSave}>
            ذخیره تغییرات
          </ThemedButton>
        </div>
      </div>
    </div>
  );
}
