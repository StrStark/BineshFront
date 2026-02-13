import { 
  Package, 
  Plus, 
  Search, 
  TrendingUp, 
  RefreshCw, 
  Calendar, 
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useState, useMemo, useEffect } from "react";
import { ProductsTableWithFilters } from "../components/ProductsTableWithFilters";
import { ColumnConfig } from "../components/ColumnCustomizer";
import { ThemedButton } from "../components/ThemedButton";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { productAPI, type ProductEvents } from "../api/productAPI";

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  warehouse: string;
  price: string;
  sales: string;
}

// Map category numbers to names
const getCategoryName = (categoryNumber: number): string => {
  const categoryMap: Record<number, string> = {
    1: "فرش",
    2: "موکت",
    3: "تابلو فرش",
    4: "سایر",
  };
  return categoryMap[categoryNumber] || "نامشخص";
};

export function ProductsPage() {
  const colors = useCurrentColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [customColumns, setCustomColumns] = useState<ColumnConfig[]>([
    { key: "name", label: "نام محصول", visible: true },
    { key: "code", label: "کد تولید", visible: true },
    { key: "category", label: "دسته بندی", visible: true },
    { key: "warehouse", label: "انبار", visible: true },
    { key: "price", label: "قیمت صرفه تخته فروش(تومان)", visible: true },
    { key: "sales", label: "فروش (کل تومان)", visible: true },
    { key: "actions", label: "عملیات", visible: true },
  ]);

  // API state
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Carpet");

  // Pagination state (managed by parent)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Product Events Modal state
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [productEvents, setProductEvents] = useState<ProductEvents | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsPageSize, setEventsPageSize] = useState(10);

  // Fetch products from API once with large pageSize
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getProducts({
          categoryDto: {
            productCategory: selectedCategory,
          },
          paggination: {
            pageNumber: 1,
            pageSize: 1000, // Get many products at once
          },
        });

        if (response.code === 200 && response.status === "success") {
          const mappedProducts: Product[] = response.body.items.map((item) => ({
            id: item.productId,
            name: item.productName,
            code: item.detailedType,
            category: getCategoryName(item.category),
            warehouse: getCategoryName(item.category), // Using category as warehouse for now
            price: item.priceUnit.toLocaleString("fa-IR"),
            sales: item.totalSale.toLocaleString("fa-IR"),
          }));
          setAllProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        // در صورت خطا از mock data استفاده می‌شود
        setAllProducts([
          {
            id: "1",
            name: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ برجسته درجه ۱",
            code: "+۲۶۰",
            category: "فرش",
            warehouse: "فرش",
            price: "۲۵,۰۰۰,۰۰۰",
            sales: "۲,۴۰۰,۰۰۰,۰۰۰"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Only refetch when category changes

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const stats = [
    { 
      icon: Package, 
      label: "کل محصولات", 
      value: loading ? "..." : allProducts.length.toLocaleString("fa-IR"), 
      unit: "عدد",
      growth: "رشد نسبت به سال قبل: ٪۵۰+",
      color: colors.primary 
    },
    { 
      icon: RefreshCw, 
      label: "نرخ گردش موجودی", 
      value: "۲", 
      unit: "بار",
      growth: "رشد نسبت به سال قبل: ٪۵۰+",
      color: colors.success 
    },
    { 
      icon: Calendar, 
      label: "روزهای گردش موجودی", 
      value: "۱۸۰", 
      unit: "روز",
      growth: "رشد نسبت به سال قبل: ٪۵۰+",
      color: colors.warning 
    },
  ];

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (product) =>
        product.name.includes(searchQuery) ||
        product.code.includes(searchQuery) ||
        product.category.includes(searchQuery) ||
        product.warehouse.includes(searchQuery)
    );
  }, [searchQuery, allProducts]);

  const handleEdit = (productId: string) => {
    console.log("Edit product:", productId);
    // Add edit logic here
  };

  const handleDelete = (productId: string) => {
    console.log("Delete product:", productId);
    // Add delete logic here
  };

  const handleViewDetails = async (productId: string) => {
    setIsEventsModalOpen(true);
    setEventsLoading(true);
    setEventsError(null);
    setProductEvents(null);
    
    try {
      const response = await productAPI.getProductEvents({
        listDto: {
          productIdList: [productId],
        },
        paggination: {
          pageNumber: eventsPage,
          pageSize: eventsPageSize,
        },
      });

      if (response.code === 200 && response.status === "success" && response.body.items.length > 0) {
        setProductEvents(response.body.items[0]);
      } else {
        setEventsError("اطلاعاتی برای این محصول یافت نشد");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در دریافت اطلاعات";
      setEventsError(errorMessage);
      console.error("Error fetching product events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  // Helper function to get state label in Persian
  const getStateLabel = (state: string): string => {
    const stateMap: Record<string, string> = {
      Receipt: "رسید",
      Issue: "حواله",
      SalesOrConsumptionRequest: "درخواست فروش/مصرف",
      PurchaseOrProductionRequest: "درخواست خرید/تولید",
    };
    return stateMap[state] || state;
  };

  // Prepare report sections
  const visibleProductColumns = customColumns.filter(col => col.visible);
  
  const reportSections: ReportSection[] = [
    {
      title: "آمار کلی محصولات",
      data: [
        { "شاخص": "کل محصولات", "مقدار": "6000", "تغییرات": "+50%" },
        { "شاخص": "نرخ گردش موجودی", "مقدار": "2", "تغییرات": "+50%" },
        { "شاخص": "روزهای گردش موجودی", "مقدار": "180", "تغییرات": "+50%" },
      ],
      headers: ["شاخص", "مقدار", "تغییرات"]
    },
    {
      title: "لیست محصولات",
      data: filteredProducts.map(p => {
        const row: Record<string, any> = {};
        visibleProductColumns.forEach(col => {
          const label = col.customLabel || col.label;
          switch (col.key) {
            case "name":
              row[label] = p.name;
              break;
            case "code":
              row[label] = p.code;
              break;
            case "category":
              row[label] = p.category;
              break;
            case "warehouse":
              row[label] = p.warehouse;
              break;
            case "price":
              row[label] = p.price;
              break;
            case "sales":
              row[label] = p.sales;
              break;
            default:
              if (col.isCustom) {
                row[label] = "-";
              }
              break;
          }
        });
        return row;
      }),
      headers: visibleProductColumns.map(col => col.customLabel || col.label)
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: colors.textPrimary }}>
            مدیریت محصولات
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
            فهرست و مدیریت محصولات
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <ReportDownload sections={reportSections} fileName="گزارش-محصولات" />
          <ThemedButton
            onClick={() => console.log("Add product")}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg flex-1 sm:flex-initial"
            icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            <span className="text-xs sm:text-sm">افزودن محصول جدید</span>
          </ThemedButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                      {stat.value}
                    </p>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {stat.unit}
                    </span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: colors.success }}>
                <TrendingUp className="w-3 h-3" />
                <span>{stat.growth}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      {/* <div
        className="rounded-lg p-4 border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 sm:py-3 border"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          }}
        >
          <Search
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            style={{ color: colors.textSecondary }}
          />
          <input
            type="text"
            placeholder="جستجو در محصولات (نام، کد، دسته‌بندی، انبار)"
            className="bg-transparent flex-1 outline-none text-xs sm:text-sm placeholder:opacity-60"
            style={{ color: colors.textPrimary }}
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="transition-colors flex-shrink-0"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div> */}

      {/* Products Table */}
      <ProductsTableWithFilters
        products={filteredProducts}
        customColumns={customColumns}
        setCustomColumns={setCustomColumns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleViewDetails={handleViewDetails}
        currentPage={currentPage}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        loading={loading}
      />

      {/* Product Events Modal */}
      {isEventsModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsEventsModalOpen(false)}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            dir="rtl"
          >
            <div
              className="rounded-lg p-6 w-full max-w-[1200px] border pointer-events-auto animate-fadeIn max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}22` }}
                  >
                    <Eye className="w-5 h-5" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      جزئیات رویدادهای محصول
                    </h2>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: colors.textSecondary }}
                    >
                      مشاهده تاریخچه رسید، حواله و درخواست‌های محصول
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEventsModalOpen(false)}
                  className="transition-colors p-1 rounded-lg"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary Stats */}
              {productEvents && !eventsLoading && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    }}
                  >
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      خرید
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.success }}
                    >
                      {productEvents.buy.toLocaleString("fa-IR")}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    }}
                  >
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      فروش
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.error }}
                    >
                      {productEvents.sell.toLocaleString("fa-IR")}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    }}
                  >
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      موجودی
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      {productEvents.stock.toLocaleString("fa-IR")}
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {eventsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div
                      className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                      style={{ borderColor: colors.primary }}
                    />
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      در حال بارگذاری اطلاعات...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {eventsError && !eventsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: colors.error }}
                    />
                    <p
                      className="text-base font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      خطا در دریافت اطلاعات
                    </p>
                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                      {eventsError}
                    </p>
                    <ThemedButton
                      onClick={() => handleViewDetails(productEvents?.productId || "")}
                      icon={<RotateCcw className="w-4 h-4" />}
                    >
                      تلاش مجدد
                    </ThemedButton>
                  </div>
                </div>
              )}

              {/* Events Table */}
              {productEvents && !eventsLoading && !eventsError && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className="border-b"
                        style={{ borderColor: colors.border }}
                      >
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          وضعیت
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          تاریخ
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          شماره فاکتور
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          مقدار 1
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          مقدار 2
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          مقدار 3
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          قیمت (تومان)
                        </th>
                        <th
                          className="text-right px-4 py-3 text-sm font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          توضیحات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productEvents.items.map((event, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors"
                          style={{ borderColor: colors.border }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <td className="px-4 py-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor:
                                  event.state === "Receipt"
                                    ? `${colors.success}22`
                                    : event.state === "Issue"
                                    ? `${colors.error}22`
                                    : `${colors.warning}22`,
                                color:
                                  event.state === "Receipt"
                                    ? colors.success
                                    : event.state === "Issue"
                                    ? colors.error
                                    : colors.warning,
                              }}
                            >
                              {getStateLabel(event.state)}
                            </span>
                          </td>
                          <td
                            className="px-4 py-3 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {event.date !== "1970-01-01T00:00:00Z"
                              ? new Date(event.date).toLocaleDateString("fa-IR")
                              : "-"}
                          </td>
                          <td
                            className="px-4 py-3 text-sm"
                            style={{ color: colors.textPrimary }}
                          >
                            {event.factorNumber}
                          </td>
                          <td
                            className="px-4 py-3 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {event.value1}
                          </td>
                          <td
                            className="px-4 py-3 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {event.value2}
                          </td>
                          <td
                            className="px-4 py-3 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {event.value3}
                          </td>
                          <td
                            className="px-4 py-3 text-sm font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {event.price > 0
                              ? event.price.toLocaleString("fa-IR")
                              : "-"}
                          </td>
                          <td
                            className="px-4 py-3 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {event.desc || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty State */}
              {productEvents &&
                !eventsLoading &&
                !eventsError &&
                productEvents.items.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle
                      className="w-12 h-12 mx-auto mb-4 opacity-40"
                      style={{ color: colors.textSecondary }}
                    />
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      هیچ رویدادی برای این محصول ثبت نشده است
                    </p>
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}