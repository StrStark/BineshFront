"use client"

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { Settings, FileDown, Plus, Trash2, X } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  capacity: number;
  used: number;
  categories: {
    carpet: number;
    furniture: number;
    product2: number;
    product3: number;
  };
}

export function WarehouseStatusChart() {
  const colors = useCurrentColors();
  const [activeTab, setActiveTab] = useState<"settings" | "report">("report");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "1",
      name: "انبار ۱",
      capacity: 500,
      used: 350,
      categories: {
        carpet: 200,
        furniture: 80,
        product2: 40,
        product3: 30,
      },
    },
    {
      id: "2",
      name: "انبار ۲",
      capacity: 400,
      used: 250,
      categories: {
        carpet: 150,
        furniture: 60,
        product2: 25,
        product3: 15,
      },
    },
    {
      id: "3",
      name: "انبار ۳",
      capacity: 600,
      used: 480,
      categories: {
        carpet: 300,
        furniture: 100,
        product2: 50,
        product3: 30,
      },
    },
    {
      id: "4",
      name: "نمایشگاه فرش ۴",
      capacity: 200,
      used: 120,
      categories: {
        carpet: 80,
        furniture: 20,
        product2: 10,
        product3: 10,
      },
    },
  ]);

  const [editingWarehouse, setEditingWarehouse] = useState<string | null>(null);
  const [tempCapacity, setTempCapacity] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseCapacity, setNewWarehouseCapacity] = useState<number>(500);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Prepare data for chart
  const chartData = warehouses.map((warehouse) => ({
    name: warehouse.name,
    فرش: warehouse.categories.carpet,
    مبلمان: warehouse.categories.furniture,
    "کالای ۲": warehouse.categories.product2,
    "کالای ۳": warehouse.categories.product3,
    فضایخالی: warehouse.capacity - warehouse.used,
  }));

  const categoryColors = {
    فرش: "#00C6FF",
    مبلمان: "#FF6B9D",
    "کالای ۲": "#FFC107",
    "کالای ۳": "#4CAF50",
    فضایخالی: colors.border, // Will use pattern fill
  };

  const handleCapacityChange = (warehouseId: string, newCapacity: number) => {
    setWarehouses((prev) =>
      prev.map((w) => {
        if (w.id === warehouseId) {
          // Don't allow capacity less than used space
          const finalCapacity = Math.max(newCapacity, w.used);
          return { ...w, capacity: finalCapacity };
        }
        return w;
      })
    );
    setEditingWarehouse(null);
  };

  const handleAddWarehouse = () => {
    if (!newWarehouseName.trim()) {
      alert("لطفاً نام انبار را وارد کنید");
      return;
    }

    const newWarehouse: Warehouse = {
      id: Date.now().toString(),
      name: newWarehouseName,
      capacity: newWarehouseCapacity,
      used: 0,
      categories: {
        carpet: 0,
        furniture: 0,
        product2: 0,
        product3: 0,
      },
    };

    setWarehouses([...warehouses, newWarehouse]);
    setIsAddModalOpen(false);
    setNewWarehouseName("");
    setNewWarehouseCapacity(500);
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    setWarehouses((prev) => prev.filter((w) => w.id !== warehouseId));
    setDeleteConfirmId(null);
  };

  // Custom bar component with pattern for empty space
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, dataKey } = props;
    
    if (dataKey === "فضایخالی") {
      return (
        <g>
          <defs>
            <pattern
              id={`pattern-${x}-${y}`}
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke={colors.textSecondary}
                strokeWidth="1.5"
                opacity="0.6"
              />
            </pattern>
          </defs>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={`url(#pattern-${x}-${y})`}
            stroke={colors.textSecondary}
            strokeWidth="1.5"
            strokeDasharray="4,3"
            opacity="0.8"
            rx="4"
            ry="4"
          />
        </g>
      );
    }

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const warehouse = warehouses.find((w) => w.name === label);
      return (
        <div
          className="p-4 rounded-lg border shadow-lg"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <p
            className="font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            {label}
          </p>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            ظرفیت کل: {warehouse?.capacity} واحد
          </p>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            استفاده شده: {warehouse?.used} واحد
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ 
                      backgroundColor: entry.dataKey === "فضایخالی" ? "transparent" : entry.color,
                      border: entry.dataKey === "فضایخالی" ? `2px dashed ${colors.border}` : "none"
                    }}
                  />
                  <span style={{ color: colors.textPrimary }}>
                    {entry.name}:
                  </span>
                </div>
                <span
                  className="font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      {/* Header with Tabs */}
      <div
        className="p-4 border-b flex items-center justify-between"
        dir="rtl"
        style={{ borderColor: colors.border }}
      >
        <div>
          <h2
            className="text-lg md:text-xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
              وضعیت انبارهاو نمایشگاه‌ها
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            میزان استفاده از ظرفیت انبارها و نمایشگاه‌ها
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" dir="rtl">
        {activeTab === "report" ? (
          <>
            {/* Chart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={colors.border}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={colors.textSecondary}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke={colors.textSecondary}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: "14px",
                      color: colors.textPrimary,
                    }}
                  />
                  <Bar
                    dataKey="فرش"
                    stackId="a"
                    fill={categoryColors.فرش}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="مبلمان"
                    stackId="a"
                    fill={categoryColors.مبلمان}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="کالای ۲"
                    stackId="a"
                    fill={categoryColors["کالای ۲"]}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="کالای ۳"
                    stackId="a"
                    fill={categoryColors["کالای ۳"]}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="فضایخالی"
                    stackId="a"
                    fill={categoryColors.فضایخالی}
                    radius={[4, 4, 0, 0]}
                    shape={<CustomBar />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {warehouses.map((warehouse) => {
                const usagePercent = (
                  (warehouse.used / warehouse.capacity) *
                  100
                ).toFixed(0);
                const isOverloaded = warehouse.used > warehouse.capacity * 0.9;

                return (
                  <div
                    key={warehouse.id}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    }}
                  >
                    <h4
                      className="font-bold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      {warehouse.name}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.textSecondary }}>
                          استفاده:
                        </span>
                        <span
                          className="font-medium"
                          style={{
                            color: isOverloaded
                              ? colors.error
                              : colors.textPrimary,
                          }}
                        >
                          {usagePercent}٪
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.textSecondary }}>
                          ظرفیت:
                        </span>
                        <span style={{ color: colors.textPrimary }}>
                          {warehouse.capacity} واحد
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.textSecondary }}>
                          باقیمانده:
                        </span>
                        <span style={{ color: colors.success }}>
                          {warehouse.capacity - warehouse.used} واحد
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Settings Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                تنظیم ظرفیت هر انبار (واحد)
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  backgroundColor: colors.primary,
                  color: "#fff",
                }}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">افزودن انبار جدید</span>
              </button>
            </div>

            {warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4
                        className="font-bold"
                        style={{ color: colors.textPrimary }}
                      >
                        {warehouse.name}
                      </h4>
                      {deleteConfirmId === warehouse.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: colors.error }}>
                            حذف شود؟
                          </span>
                          <button
                            onClick={() => handleDeleteWarehouse(warehouse.id)}
                            className="px-2 py-1 rounded text-xs transition-all hover:opacity-80"
                            style={{
                              backgroundColor: colors.error,
                              color: "#fff",
                            }}
                          >
                            بله
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded text-xs transition-all hover:opacity-80"
                            style={{
                              backgroundColor: colors.backgroundSecondary,
                              borderColor: colors.border,
                              color: colors.textSecondary,
                            }}
                          >
                            خیر
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(warehouse.id)}
                          className="p-1 rounded transition-all hover:opacity-80"
                          style={{ color: colors.error }}
                          title="حذف انبار"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span style={{ color: colors.textSecondary }}>
                          ظرفیت فعلی:{" "}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {warehouse.capacity} واحد
                        </span>
                      </div>
                      <div className="text-sm">
                        <span style={{ color: colors.textSecondary }}>
                          استفاده شده:{" "}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.warning }}
                        >
                          {warehouse.used} واحد
                        </span>
                      </div>
                    </div>
                  </div>

                  {editingWarehouse === warehouse.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempCapacity}
                        onChange={(e) =>
                          setTempCapacity(Number(e.target.value))
                        }
                        className="px-3 py-2 rounded-lg border outline-none w-32"
                        style={{
                          backgroundColor: colors.cardBackground,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        min={warehouse.used}
                      />
                      <button
                        onClick={() =>
                          handleCapacityChange(warehouse.id, tempCapacity)
                        }
                        className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                        style={{
                          backgroundColor: colors.success,
                          color: "#fff",
                        }}
                      >
                        ذخیره
                      </button>
                      <button
                        onClick={() => setEditingWarehouse(null)}
                        className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textSecondary,
                        }}
                      >
                        لغو
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingWarehouse(warehouse.id);
                        setTempCapacity(warehouse.capacity);
                      }}
                      className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#fff",
                      }}
                    >
                      ویرایش ظرفیت
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.border }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (warehouse.used / warehouse.capacity) * 100,
                          100
                        )}%`,
                        backgroundColor:
                          warehouse.used > warehouse.capacity * 0.9
                            ? colors.error
                            : warehouse.used > warehouse.capacity * 0.7
                            ? colors.warning
                            : colors.success,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Warehouse Modal */}
      {isAddModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsAddModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none" dir="rtl">
            <div
              className="rounded-lg p-6 w-full max-w-md border pointer-events-auto"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  افزودن انبار جدید
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    نام انبار
                  </label>
                  <input
                    type="text"
                    value={newWarehouseName}
                    onChange={(e) => setNewWarehouseName(e.target.value)}
                    placeholder="مثال: انبار مرکزی"
                    className="w-full px-4 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    ظرفیت (واحد)
                  </label>
                  <input
                    type="number"
                    value={newWarehouseCapacity}
                    onChange={(e) =>
                      setNewWarehouseCapacity(Number(e.target.value))
                    }
                    min={1}
                    className="w-full px-4 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddWarehouse}
                    className="flex-1 px-4 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#fff",
                    }}
                  >
                    افزودن
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border transition-all hover:opacity-80"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.textSecondary,
                    }}
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}