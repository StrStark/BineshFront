import { useEffect, useState, useCallback, useRef } from "react";
import { CustomWidgetData } from "./CustomWidgetBuilder";
import { CustomChartWidget } from "./CustomChartWidget";
import { salesAPI } from "../../api/salesAPI";
import { productAPI } from "../../api/productAPI";
import { customerAPI } from "../../api/customerAPI";
import { financialAPI } from "../../api/financialAPI";
import { Loader2 } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { useExhibitionVisits } from "../../contexts/ExhibitionVisitsContext";

interface CustomWidgetRendererProps {
  widget: CustomWidgetData;
}

export function CustomWidgetRenderer({ widget }: CustomWidgetRendererProps) {
  const colors = useCurrentColors();
  const { visits } = useExhibitionVisits();
  const [data, setData] = useState<Array<{ label: string; value: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastFetchTimeRef = useRef<number>(Date.now());

  const fetchDataFromAPI = useCallback(async () => {
    // Determine configuration source
    const config = widget.systemConfig || widget.apiConfig;
    if (!config) return;

    // Determine software and table IDs
    let softwareId = widget.dataSource as string;
    let tableId = "";
    
    if (widget.dataSource === "system" && widget.systemConfig) {
      softwareId = widget.systemConfig.softwareId;
      tableId = widget.systemConfig.tableId;
    } else if (widget.apiConfig) {
      // Legacy mapping
      tableId = widget.apiConfig.endpoint;
    }

    const { labelField, valueField } = config;

    setLoading(true);
    setError(null);

    try {
      // Default date filter (30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const dateFilter = {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        timeFrameUnit: 1,
      };

      let apiData: any[] = [];

      // --- Data Management Panel (and legacy IDs) ---
      if (softwareId === "data_panel" || softwareId === "sales" || softwareId === "products" || softwareId === "customers" || softwareId === "financial") {
        
        // Sales Data
        if (tableId === "sales_summary" || tableId === "salesSummary") {
          const response = await salesAPI.getSalesSummary({ dateFilter });
          apiData = response.body.soldItems || [];
        } 
        else if (tableId === "top_selling_products" || tableId === "topSellingProducts") {
          const response = await salesAPI.getTopSellingProducts({ dateFilter });
          apiData = response.body.items || [];
        }
        
        // Products Data
        else if (tableId === "products_list" || tableId === "productsList") {
          const response = await productAPI.getProducts({
            categoryDto: { productCategory: "" },
            paggination: { pageNumber: 1, pageSize: 10 },
          });
          apiData = response.body.items || [];
        }
        
        // Customers Data
        else if (tableId === "customers_list" || tableId === "customersList") {
          const response = await customerAPI.getCustomers({
            dateFilter,
            prodctCategory: { productCategory: "" },
            custoemrCategory: { customerCategory: "" },
            paggination: { pageNumber: 1, pageSize: 10 },
          });
          apiData = response.body.items || [];
        }
        
        // Financial Data
        else if (tableId === "financial_summary" || tableId === "financialSummary") {
          const response = await financialAPI.getFinancialSummary();
          const cards = response.body.stateCards;
          apiData = [
            { category: "فروش کل", amount: cards.totalSale?.value || 0 },
            { category: "حاشیه سود", amount: cards.profitMargine?.value || 0 },
            { category: "سود خالص", amount: cards.netProfit?.value || 0 },
            { category: "نقدینگی", amount: cards.liquidity?.value || 0 },
          ];
        }

        // Exhibition Visits (Aggregated from Context)
        else if (tableId === "exhibition_visits") {
          // Aggregate visits by date
          const aggregated = visits.reduce((acc: any, visit) => {
            const date = visit.date || "نامشخص";
            if (!acc[date]) {
              acc[date] = { date, count: 0, converted: 0 };
            }
            acc[date].count += 1;
            if (visit.followUpStatus === "converted") {
              acc[date].converted += 1;
            }
            return acc;
          }, {});
          apiData = Object.values(aggregated);
        }
      } 
      
      // --- Call Management Panel ---
      else if (softwareId === "call_panel") {
        // Mock Data for Call Center
        if (tableId === "total_calls") {
          apiData = [
            { day: "شنبه", calls: 45 },
            { day: "یک‌شنبه", calls: 52 },
            { day: "دوشنبه", calls: 38 },
            { day: "سه‌شنبه", calls: 61 },
            { day: "چهارشنبه", calls: 48 },
            { day: "پنج‌شنبه", calls: 55 },
            { day: "جمعه", calls: 42 },
          ];
        }
        else if (tableId === "agents_performance") {
          apiData = [
            { agentName: "علی محمدی", callsAnswered: 45, avgDuration: 120, satisfaction: 4.5 },
            { agentName: "سارا احمدی", callsAnswered: 52, avgDuration: 110, satisfaction: 4.8 },
            { agentName: "رضا کریمی", callsAnswered: 38, avgDuration: 140, satisfaction: 4.2 },
            { agentName: "مریم حسینی", callsAnswered: 60, avgDuration: 100, satisfaction: 4.7 },
          ];
        }
        else if (tableId === "queue_status") {
          apiData = [
            { queueName: "فروش", waiting: 5, avgWait: 45 },
            { queueName: "پشتیبانی", waiting: 12, avgWait: 120 },
            { queueName: "مالی", waiting: 2, avgWait: 30 },
            { queueName: "شکایات", waiting: 1, avgWait: 60 },
          ];
        }
      }

      // Apply conditions (Filters) if any
      if (widget.systemConfig?.conditions && widget.systemConfig.conditions.length > 0) {
        apiData = apiData.filter(item => {
          return widget.systemConfig!.conditions.every(condition => {
            const itemValue = String(item[condition.field] || "").toLowerCase();
            const conditionValue = condition.value.toLowerCase();
            
            switch (condition.operator) {
              case "equals": return itemValue === conditionValue;
              case "contains": return itemValue.includes(conditionValue);
              case "greater": return Number(itemValue) > Number(conditionValue);
              case "less": return Number(itemValue) < Number(conditionValue);
              default: return true;
            }
          });
        });
      }

      // Map to chart data
      const chartData = apiData.map((item: any) => ({
        label: String(item[labelField] || "نامشخص"),
        value: Number(item[valueField] || 0),
      }));

      setData(chartData);
    } catch (err: any) {
      console.error("Error fetching custom widget data:", err);
      setError("خطا در دریافت داده‌ها");
      setData([
        { label: "داده ۱", value: 10 },
        { label: "داده ۲", value: 20 },
        { label: "داده ۳", value: 15 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [widget, visits]);

  // Initial Fetch
  useEffect(() => {
    // If it's a manual widget (legacy support, though disabled in builder now)
    // Using explicit type casting to avoid TS errors with legacy properties
    const widgetAny = widget as any;
    if (widget.dataSource === "manual" && widgetAny.dataPoints) {
      setData(widgetAny.dataPoints);
      setLoading(false);
      setError(null);
    } else {
      fetchDataFromAPI();
    }
    // Reset timer on widget change
    lastFetchTimeRef.current = Date.now();
  }, [fetchDataFromAPI, widget]);

  // Auto Update Logic (Fetch only, no progress display on widget)
  useEffect(() => {
    if (!widget.autoUpdate?.enabled) {
      return;
    }

    const intervalMs = widget.autoUpdate.interval * 1000;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastFetchTimeRef.current;
      
      if (elapsed >= intervalMs) {
        // Trigger fetch
        fetchDataFromAPI();
        lastFetchTimeRef.current = now;
      }
    }, 1000); // Check every second

    return () => clearInterval(timer);
  }, [widget.autoUpdate, fetchDataFromAPI]);


  // Loading State
  if (loading && data.length === 0) { // Only show full loader if no data exists
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: colors.primary }} />
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: colors.error }}>
            {error}
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            از داده‌های نمونه استفاده می‌شود
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for CustomChartWidget
  // Use any to bypass strict type check against CustomChartWidget's local interface
  const chartWidgetData: any = {
    ...widget,
    dataPoints: data,
  };

  return (
    <div className="w-full h-full flex flex-col relative group">
      <div className="flex-1 min-h-0">
        <CustomChartWidget data={chartWidgetData} />
      </div>
      
      {/* Refresh Indicator (Spinner if updating in background) - Kept discrete as requested */}
      {loading && data.length > 0 && (
        <div className="absolute top-2 right-2 p-1 rounded-full bg-white/80 dark:bg-black/80 shadow-sm z-10">
          <Loader2 className="w-3 h-3 animate-spin" style={{ color: colors.primary }} />
        </div>
      )}
    </div>
  );
}