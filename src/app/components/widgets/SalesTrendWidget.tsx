import { TrendingUp, ChevronDown } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { SalesLineChart } from "../SalesLineChart";
import { useState, useEffect, useRef } from "react";
import { salesAPI } from "../../api/salesAPI";

// TimeFrame options
const timeFrameOptions = [
  { value: 1, label: "روزانه" },
  { value: 2, label: "هفتگی" },
  { value: 3, label: "ماهانه" },
  { value: 4, label: "فصلی" },
  { value: 5, label: "سالانه" },
];

export function SalesTrendWidget() {
  const colors = useCurrentColors();
  
  // تاریخ پیش‌فرض: 2000-02-14 تا 2026-02-14
  const defaultFrom = new Date("2000-02-14T00:00:00.000Z");
  const defaultTo = new Date("2026-02-14T23:59:59.999Z");

  // TimeFrame state for chart
  const [timeFrame, setTimeFrame] = useState(3); // Default: Month (3)
  const [showTimeFrameDropdown, setShowTimeFrameDropdown] = useState(false);
  const timeFrameDropdownRef = useRef<HTMLDivElement>(null);

  // Sales chart data state
  const [salesChartData, setSalesChartData] = useState<any[]>([]);
  const [salesChartLoading, setSalesChartLoading] = useState(true);
  const [salesChartError, setSalesChartError] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeFrameDropdownRef.current &&
        !timeFrameDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTimeFrameDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch sales chart data
  useEffect(() => {
    const fetchSalesData = async () => {
      setSalesChartLoading(true);
      setSalesChartError(null);

      try {
        const response = await salesAPI.getCustomerCategorizedSales({
          dateFilter: {
            startTime: defaultFrom.toISOString(),
            endTime: defaultTo.toISOString(),
            timeFrameUnit: timeFrame,
          },
          categoryDto: {
            productCategory: "",
          },
          provience: {
            provinece: "string",
          },
        });

        if (response.code === 200 && response.status === "success") {
          setSalesChartData(response.body.sales);
        } else {
          setSalesChartError("خطا در دریافت داده‌های نمودار");
        }
      } catch (err) {
        console.error("Error fetching sales chart data:", err);
        setSalesChartError("خطا در دریافت داده‌های نمودار");
      } finally {
        setSalesChartLoading(false);
      }
    };

    fetchSalesData();
  }, [timeFrame]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with TimeFrame Selector */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + "15" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
              روند فروش
            </h3>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              نمودار تعداد فروش
            </p>
          </div>
        </div>

        {/* TimeFrame Buttons */}
        <div className="relative" ref={timeFrameDropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap text-sm"
            style={{
              backgroundColor: colors.primary,
              color: "#ffffff",
            }}
            onClick={() => setShowTimeFrameDropdown(!showTimeFrameDropdown)}
          >
            <span>{timeFrameOptions.find(option => option.value === timeFrame)?.label}</span>
            <ChevronDown 
              className="w-4 h-4 transition-transform" 
              style={{ 
                transform: showTimeFrameDropdown ? 'rotate(180deg)' : 'rotate(0deg)' 
              }}
            />
          </button>
          {showTimeFrameDropdown && (
            <div
              className="absolute left-0 top-full mt-2 rounded-lg shadow-lg z-10 overflow-hidden min-w-[120px]"
              style={{
                backgroundColor: colors.cardBackground,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colors.border,
              }}
            >
              {timeFrameOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTimeFrame(option.value);
                    setShowTimeFrameDropdown(false);
                  }}
                  className="px-3 py-2 block w-full text-right transition-all whitespace-nowrap text-sm"
                  style={{
                    backgroundColor: timeFrame === option.value ? colors.primary : "transparent",
                    color: timeFrame === option.value ? "#ffffff" : colors.textPrimary,
                  }}
                  onMouseEnter={(e) => {
                    if (timeFrame !== option.value) {
                      e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (timeFrame !== option.value) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Component */}
      <div className="flex-1 min-h-0">
        <SalesLineChart 
          data={salesChartData} 
          loading={salesChartLoading} 
          error={salesChartError}
          hideHeader={true}
        />
      </div>
    </div>
  );
}
