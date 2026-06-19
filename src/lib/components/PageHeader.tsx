"use client"

import { ReactNode } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const colors = useCurrentColors();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}