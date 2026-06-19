"use client"

import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from "react";
import { useAppSelector } from "../store/hooks";

export interface ReportDataItem {
  [key: string]: string | number;
}

export interface ReportSection {
  title: string;
  data: ReportDataItem[];
  headers?: string[];
}

interface DataSource {
  tableId: string;
  title: string;
  data: ReportDataItem[];
  headers?: string[];
}

interface ReportDataContextType {
  getFilteredCallsData: () => ReportDataItem[];
  getFilteredCustomersData: () => ReportDataItem[];
  getFilteredAgentsData: () => ReportDataItem[];
  getAllReportSections: () => ReportSection[];
  registerDataSource: (source: DataSource) => void;
  unregisterDataSource: (tableId: string) => void;
}

const ReportDataContext = createContext<ReportDataContextType | undefined>(undefined);

export function ReportDataProvider({ children }: { children: ReactNode }) {
  const { activeFilters } = useAppSelector((state) => state.filters);
  const [dataSources, setDataSources] = useState<Map<string, DataSource>>(new Map());

  const registerDataSource = useCallback((source: DataSource) => {
    setDataSources((prev) => {
      const newMap = new Map(prev);
      newMap.set(source.tableId, source);
      return newMap;
    });
  }, []);

  const unregisterDataSource = useCallback((tableId: string) => {
    setDataSources((prev) => {
      const newMap = new Map(prev);
      newMap.delete(tableId);
      return newMap;
    });
  }, []);

  // تابع کمکی برای اعمال فیلتر روی داده‌ها
  const applyFilters = useCallback((data: ReportDataItem[], tableId: string): ReportDataItem[] => {
    const filters = activeFilters[tableId] || [];
    
    if (filters.length === 0) {
      return data;
    }

    return data.filter((item) => {
      return filters.every((filter) => {
        const value = item[filter.column];
        if (value === undefined || value === null) return true;
        
        const valueStr = String(value).toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case "equals":
            return valueStr === filterValue;
          case "contains":
            return valueStr.includes(filterValue);
          case "startsWith":
            return valueStr.startsWith(filterValue);
          case "endsWith":
            return valueStr.endsWith(filterValue);
          case "greaterThan":
            return Number(value) > Number(filter.value);
          case "lessThan":
            return Number(value) < Number(filter.value);
          case "greaterThanOrEqual":
            return Number(value) >= Number(filter.value);
          case "lessThanOrEqual":
            return Number(value) <= Number(filter.value);
          default:
            return true;
        }
      });
    });
  }, [activeFilters]);

  const getFilteredCallsData = useCallback((): ReportDataItem[] => {
    const source = dataSources.get("calls-table");
    if (!source) return [];
    return applyFilters(source.data, source.tableId);
  }, [dataSources, applyFilters]);

  const getFilteredCustomersData = useCallback((): ReportDataItem[] => {
    const source = dataSources.get("customers-table");
    if (!source) return [];
    return applyFilters(source.data, source.tableId);
  }, [dataSources, applyFilters]);

  const getFilteredAgentsData = useCallback((): ReportDataItem[] => {
    const source = dataSources.get("agents-table");
    if (!source) return [];
    return applyFilters(source.data, source.tableId);
  }, [dataSources, applyFilters]);

  const getAllReportSections = useCallback((): ReportSection[] => {
    const sections: ReportSection[] = [];

    dataSources.forEach((source) => {
      const filteredData = applyFilters(source.data, source.tableId);
      if (filteredData.length > 0) {
        sections.push({
          title: source.title,
          data: filteredData,
          headers: source.headers,
        });
      }
    });

    return sections;
  }, [dataSources, applyFilters]);

  const value: ReportDataContextType = useMemo(() => ({
    getFilteredCallsData,
    getFilteredCustomersData,
    getFilteredAgentsData,
    getAllReportSections,
    registerDataSource,
    unregisterDataSource,
  }), [
    getFilteredCallsData,
    getFilteredCustomersData,
    getFilteredAgentsData,
    getAllReportSections,
    registerDataSource,
    unregisterDataSource,
  ]);

  return (
    <ReportDataContext.Provider value={value}>
      {children}
    </ReportDataContext.Provider>
  );
}

export function useReportData() {
  const context = useContext(ReportDataContext);
  if (!context) {
    throw new Error("useReportData must be used within a ReportDataProvider");
  }
  return context;
}