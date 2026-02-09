import { 
  Package, 
  Plus, 
  Search, 
  TrendingUp, 
  RefreshCw, 
  Calendar, 
  X,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useState, useMemo } from "react";
import { ProductsTableWithFilters } from "../components/ProductsTableWithFilters";
import { ColumnConfig } from "../components/ColumnCustomizer";
import { ThemedButton } from "../components/ThemedButton";
import { ReportDownload, ReportSection } from "../components/ReportDownload";

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  warehouse: string;
  price: string;
  sales: string;
}

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
  ]);

  const stats = [
    { 
      icon: Package, 
      label: "کل محصولات", 
      value: "۶۰۰۰", 
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

  const allProducts: Product[] = [
    {
      id: 1,
      name: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ برجسته درجه ۱",
      code: "+۲۶۰",
      category: "فرش",
      warehouse: "فرش",
      price: "۲۵,۰۰۰,۰۰۰",
      sales: "۲,۴۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 2,
      name: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ برجسته درجه ۱",
      code: "+۲۶۰",
      category: "فرش",
      warehouse: "فرش",
      price: "۲۵,۰۰۰,۰۰۰",
      sales: "۲,۴۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 3,
      name: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ برجسته درجه ۱",
      code: "+۲۶۰",
      category: "فرش",
      warehouse: "فرش",
      price: "۲۵,۰۰۰,۰۰۰",
      sales: "۲,۴۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 4,
      name: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ برجسته درجه ۱",
      code: "+۲۶۰",
      category: "فرش",
      warehouse: "فرش",
      price: "۲۵,۰۰۰,۰۰۰",
      sales: "۲,۴۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 5,
      name: "فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ برجسته درجه ۱",
      code: "+۲۶۰",
      category: "فرش",
      warehouse: "فرش",
      price: "۲۵,۰۰۰,۰۰۰",
      sales: "۲,۴۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 6,
      name: "فرش ۵۰۰*۴ شانه تراکم ۲۰۰۰ الیت برجسته درجه ۱",
      code: "+۳۲۰",
      category: "فرش",
      warehouse: "انبار مرکزی",
      price: "۳۵,۰۰۰,۰۰۰",
      sales: "۳,۵۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 7,
      name: "موکت ۷۰۰*۵ شانه تراکم ۲۵۰۰ لوکس",
      code: "+۴۵۰",
      category: "موکت",
      warehouse: "انبار شرق",
      price: "۱۸,۰۰۰,۰۰۰",
      sales: "۱,۸۰۰,۰۰۰,۰۰۰"
    },
    {
      id: 8,
      name: "تابلو فرش دستباف ۱۰۰*۱۵۰",
      code: "+۱۲۰",
      category: "تابلو فرش",
      warehouse: "انبار غرب",
      price: "۴۵,۰۰۰,۰۰۰",
      sales: "۹۰۰,۰۰۰,۰۰۰"
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
  }, [searchQuery]);

  const handleEdit = (productId: number) => {
    console.log("Edit product:", productId);
    // Add edit logic here
  };

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
    // Add delete logic here
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
      />
    </div>
  );
}