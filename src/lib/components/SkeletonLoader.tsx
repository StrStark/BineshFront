"use client"

import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function SkeletonLoader({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  className = "",
}: SkeletonLoaderProps) {
  const colors = useCurrentColors();

  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.backgroundSecondary,
        backgroundImage: `linear-gradient(90deg, ${colors.backgroundSecondary} 0%, ${colors.border}40 50%, ${colors.backgroundSecondary} 100%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

// Skeleton برای کارت‌های آماری
export function StatCardSkeleton() {
  const colors = useCurrentColors();

  return (
    <div
      className="p-6 rounded-xl border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <SkeletonLoader width="80px" height="16px" />
        <SkeletonLoader width="40px" height="40px" borderRadius="12px" />
      </div>
      <SkeletonLoader width="60px" height="32px" className="mb-2" />
      <SkeletonLoader width="100px" height="14px" />
    </div>
  );
}

// Skeleton برای نمودارها
export function ChartSkeleton() {
  const colors = useCurrentColors();

  return (
    <div
      className="p-6 rounded-xl border"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="mb-6">
        <SkeletonLoader width="150px" height="24px" className="mb-2" />
        <SkeletonLoader width="200px" height="14px" />
      </div>
      <SkeletonLoader width="100%" height="300px" borderRadius="12px" />
    </div>
  );
}

// Skeleton برای جدول
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  const colors = useCurrentColors();

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center gap-4"
        style={{ borderColor: colors.border }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonLoader key={i} width="100px" height="16px" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 border-b flex items-center gap-4"
          style={{ borderColor: colors.border }}
        >
          <SkeletonLoader width="40px" height="40px" borderRadius="50%" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader width="60%" height="16px" />
            <SkeletonLoader width="40%" height="14px" />
          </div>
          <SkeletonLoader width="80px" height="24px" borderRadius="12px" />
        </div>
      ))}
    </div>
  );
}

// Skeleton برای لیست
export function ListItemSkeleton() {
  const colors = useCurrentColors();

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-start gap-3">
        <SkeletonLoader width="48px" height="48px" borderRadius="12px" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader width="70%" height="18px" />
          <SkeletonLoader width="50%" height="14px" />
          <SkeletonLoader width="90%" height="14px" />
        </div>
      </div>
    </div>
  );
}
