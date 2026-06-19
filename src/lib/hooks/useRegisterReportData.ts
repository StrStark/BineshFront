"use client"

import { useEffect, useRef } from "react";
import { useReportData, ReportDataItem } from "../contexts/ReportDataContext";

interface UseRegisterReportDataProps {
  tableId: string;
  title: string;
  data: ReportDataItem[];
  headers?: string[];
  enabled?: boolean;
}

/**
 * Hook برای ثبت خودکار داده‌های جدول در سیستم گزارش‌گیری
 * 
 * این Hook به صورت خودکار داده‌های جدول را در Context ثبت می‌کند
 * تا در گزارش‌گیری جامع استفاده شود
 */
export function useRegisterReportData({
  tableId,
  title,
  data,
  headers,
  enabled = true,
}: UseRegisterReportDataProps) {
  const { registerDataSource, unregisterDataSource } = useReportData();
  const dataRef = useRef<ReportDataItem[]>(data);
  const headersRef = useRef(headers);

  // Keep refs updated
  dataRef.current = data;
  headersRef.current = headers;

  useEffect(() => {
    if (!enabled || dataRef.current.length === 0) {
      return;
    }

    // Register/update data using current ref value
    registerDataSource({
      tableId,
      title,
      data: dataRef.current,
      headers: headersRef.current,
    });

    // Cleanup on unmount
    return () => {
      unregisterDataSource(tableId);
    };
    // ⚠️ CRITICAL: Only include stable values in dependencies
    // registerDataSource/unregisterDataSource are stable (useCallback with empty deps)
    // data/headers are NOT in dependencies - we use refs instead to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId, title, enabled]);
}
