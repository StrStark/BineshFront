import { useState, useMemo, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Award,
  UserPlus,
  Search,
  X,
  Tag,
  Edit,
  Trash2,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { CustomersTableWithFilters } from "../components/CustomersTableWithFilters";
import { ReportDownload, ReportSection } from "../components/ReportDownload";
import { useAppSelector } from "../store/hooks";
import { ColumnConfig } from "../components/ColumnCustomizer";
import {
  CategorySettingsModal,
  Category,
} from "../components/CategorySettingsModal";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ThemedButton } from "../components/ThemedButton";
import { customerAPI } from "../api/customerAPI";

interface Customer {
  id: string;
  fullName: string;
  isActive: boolean;
  salesCount: number;
  place: string;
}

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "فروش موفق",
      color: "#00c853",
      keywords: ["خرید", "موافقت", "قبول", "تایید"],
    },
    {
      id: "2",
      name: "نیاز به پیگیری",
      color: "#ff9800",
      keywords: ["فکر می‌کنم", "بعداً", "نمی‌دانم"],
    },
    {
      id: "3",
      name: "عدم علاقه",
      color: "#e92c2c",
      keywords: ["نه", "رد", "علاقه‌ای ندارم"],
    },
  ]);
  const [customColumns, setCustomColumns] = useState<ColumnConfig[]>([
    { key: "fullName", label: "نام مشتری", visible: true },
    { key: "isActive", label: "وضعیت", visible: true },
    { key: "salesCount", label: "تعداد فروش‌ها", visible: true },
    { key: "place", label: "محل", visible: true },
    { key: "history", label: "تاریخچه خریدها", visible: true },
    { key: "actions", label: "عملیات", visible: true },
  ]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    province: "",
    city: "",
    neighborhood: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [deletedCustomers, setDeletedCustomers] = useState<Customer[]>([]);
  const [isDeletedCustomersModalOpen, setIsDeletedCustomersModalOpen] =
    useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // API state for cards
  const [cardsLoading, setCardsLoading] = useState(true);
  const [arpuData, setArpuData] = useState({ value: 0, growth: 0 });
  const [crrData, setCrrData] = useState({ value: 0, growth: 0 });

  // API state for table
  const [tableLoading, setTableLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>(
    "Bedehkaran",
  );
  const [selectedProductType, setSelectedProductType] = useState<string>("");

  // Customer Type options with Persian labels
  const customerTypeOptions = [
    { value: "", label: "همه مشتریان" },
    { value: "Bedehkaran", label: "بدهکاران" },
    { value: "Bestankar", label: "بستانکار" },
    { value: "Personnel", label: "پرسنل" },
    { value: "Ranandeh", label: "راننده" },
    { value: "Bazaryab", label: "بازاریاب" },
    { value: "Sherka", label: "شرکا" },
    { value: "MoshtarianKhanegi", label: "مشتریان خانگی" },
    { value: "JariSherkathaVaAshkhas", label: "جاری شرکت‌ها و اشخاص" },
    { value: "TarahVaEditor", label: "طراح و ادیتور" },
  ];

  // Product Type options with Persian labels
  const productTypeOptions = [
    { value: "", label: "همه محصولات" },
    { value: "Carpet", label: "فرش" },
    { value: "RawMaterials", label: "مواد خام" },
    { value: "Rug", label: "گلیم" },
  ];

  // Fetch table data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setTableLoading(true);
      try {
        const response = await customerAPI.getCustomers({
          dateFilter: {
            startTime: "2000-02-13T12:04:22.098Z",
            endTime: "2026-02-13T12:04:22.098Z",
            timeFrameUnit: 1,
          },
          prodctCategory: {
            productCategory: selectedProductType,
          },
          custoemrCategory: {
            customerCategory: selectedCustomerType,
          },
          paggination: {
            pageNumber: currentPage,
            pageSize: pageSize,
          },
        });

        if (response.code === 200 && response.status === "success") {
          setCustomers(response.body.items);
          setTotalCount(response.body.totalCount);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setTableLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, pageSize, selectedCustomerType, selectedProductType]);

  // Fetch cards data from API
  useEffect(() => {
    const fetchCardsData = async () => {
      setCardsLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        const response = await customerAPI.getCustomersCards({
          dateFilter: {
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            timeFrameUnit: 1,
          },
          prodctCategory: {
            productCategory: "",
          },
          custoemrCategory: {
            customerCategory: "string",
          },
        });

        if (response.code === 200 && response.status === "success") {
          setArpuData(response.body.arpu);
          setCrrData(response.body.crr);
        }
      } catch (err) {
        console.error("Failed to fetch cards data:", err);
      } finally {
        setCardsLoading(false);
      }
    };

    fetchCardsData();
  }, []);

  // Get active filters from Redux store
  const { activeFilters } = useAppSelector((state) => state.filters);
  const TABLE_ID = "customers-table";
  const tableFilters = activeFilters[TABLE_ID] || [];

  // Check if there's a tags column
  const hasTagsColumn = customColumns.some(
    (col) =>
      col.isCustom &&
      (col.label.toLowerCase().includes("تگ") ||
        col.label.toLowerCase().includes("برچسب") ||
        col.label.toLowerCase().includes("tag")),
  );

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Apply search query filter
  const searchFilteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply Redux filters
  const filteredCustomers = useMemo(() => {
    let result = searchFilteredCustomers;

    tableFilters.forEach((filter) => {
      result = result.filter((customer) => {
        const value = String(customer[filter.column as keyof Customer] || "");
        const filterValue = filter.value.toLowerCase();
        const cellValue = value.toLowerCase();

        switch (filter.operator) {
          case "equals":
            return cellValue === filterValue;
          case "notEquals":
            return cellValue !== filterValue;
          case "contains":
            return cellValue.includes(filterValue);
          case "greaterThan":
            return Number(cellValue) > Number(filterValue);
          case "lessThan":
            return Number(cellValue) < Number(filterValue);
          case "greaterThanOrEqual":
            return Number(cellValue) >= Number(filterValue);
          case "lessThanOrEqual":
            return Number(cellValue) <= Number(filterValue);
          default:
            return true;
        }
      });
    });

    return result;
  }, [searchFilteredCustomers, tableFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      // ویرایش مشتری موجود
      handleSaveEdit(e);
    } else {
      // افزودن مشتری جدید
      const newCustomer: Customer = {
        id: String(Date.now()),
        fullName: `${formData.firstName} ${formData.lastName}`,
        salesCount: 0,
        isActive: true,
        place: `${formData.province}، ${formData.city}، ${formData.neighborhood}`,
      };

      setCustomers([newCustomer, ...customers]);
      setIsModalOpen(false);

      // ریست کردن فرم
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: "",
        province: "",
        city: "",
        neighborhood: "",
      });
      setTags([]);
      setTagInput("");
    }
  };

  const handleEdit = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      const nameParts = customer.fullName.split(" ");
      const placeParts = customer.place.split("، ");
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: "",
        email: "",
        company: "",
        province: placeParts[0] || "",
        city: placeParts[1] || "",
        neighborhood: placeParts[2] || "",
      });
      setEditingCustomerId(customerId);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomerId) {
      const updatedCustomers = customers.map((customer) => {
        if (customer.id === editingCustomerId) {
          return {
            ...customer,
            fullName: `${formData.firstName} ${formData.lastName}`,
            place: `${formData.province}، ${formData.city}، ${formData.neighborhood}`,
          };
        }
        return customer;
      });
      setCustomers(updatedCustomers);
      setIsEditMode(false);
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: "",
        province: "",
        city: "",
        neighborhood: "",
      });
      setTags([]);
      setTagInput("");
    }
  };

  const handleDelete = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setCustomerToDelete(customer);
      setIsDeleteConfirmModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      setDeletedCustomers([...deletedCustomers, customerToDelete]);
      setIsDeleteConfirmModalOpen(false);
      setCustomerToDelete(null);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmModalOpen(false);
    setCustomerToDelete(null);
  };

  // Prepare report sections with dynamic columns
  const visibleCustomColumns = customColumns.filter((col) => col.visible);

  // Filter out 'history' column from report (it's just an action button, not data)
  const reportCustomColumns = visibleCustomColumns.filter(
    (col) => col.key !== "history",
  );

  const reportSections: ReportSection[] = [
    {
      title: "آمار کلی مشتریان",
      data: [
        {
          شاخص: "کل مشتریان",
          مقدار: filteredCustomers.length,
          تغییرات: "+12%",
        },
        { شاخص: "مشتریان فعال", مقدار: 1923, تغییرات: "+8%" },
        { شاخص: "میانگین رضایت", مقدار: "4.2", تغییرات: "+0.3" },
        { شاخص: "مشتریان جدید", مقدار: 89, تغییرات: "-3%" },
      ],
      headers: ["شاخص", "مقدار", "تغییرات"],
    },
    {
      title: "لیست مشتریان",
      data: filteredCustomers.map((c) => {
        const row: Record<string, any> = {};
        reportCustomColumns.forEach((col) => {
          const label = col.customLabel || col.label;
          switch (col.key) {
            case "name":
              row[label] = c.fullName;
              break;
            case "phone":
              row[label] = c.phone;
              break;
            case "email":
              row[label] = c.email;
              break;
            case "province":
              row[label] = c.place.split("، ")[0];
              break;
            case "city":
              row[label] = c.place.split("، ")[1];
              break;
            case "neighborhood":
              row[label] = c.place.split("، ")[2];
              break;
            case "totalCalls":
              row[label] = c.salesCount;
              break;
            case "lastCall":
              row[label] = c.lastCall;
              break;
            default:
              // For custom columns, add placeholder
              if (col.isCustom) {
                row[label] = "-";
              }
              break;
          }
        });
        return row;
      }),
      headers: reportCustomColumns.map((col) => col.customLabel || col.label),
    },
  ];

  const colors = useCurrentColors();

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c] dark:text-white mb-1 sm:mb-2">
            مدیریت مشتریان
          </h1>
          <p className="text-xs sm:text-sm text-[#585757] dark:text-[#8b92a8]">
            مشاهده و مدیریت اطلاعات مشتریان
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {deletedCustomers.length > 0 && (
            <ThemedButton
              variant="secondary"
              onClick={() => setIsDeletedCustomersModalOpen(true)}
              icon={<Trash2 className="w-4 h-4" />}
            >
              حذف شده‌ها ({deletedCustomers.length})
            </ThemedButton>
          )}
          <ReportDownload sections={reportSections} fileName="گزارش-مشتریان" />
          <ThemedButton
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg flex-1 sm:flex-initial"
            icon={<UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            <span className="text-xs sm:text-sm">افزودن مشتری جدید</span>
          </ThemedButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="rounded-lg p-4 border transition-all duration-300"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5" style={{ color: colors.primary }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              کل مشتریان
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            2,547
          </p>
          <p className="text-xs mt-1" style={{ color: colors.success }}>
            +12% نسبت به ماه قبل
          </p>
        </div>

        <div
          className="rounded-lg p-4 border transition-all duration-300"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: colors.success }} />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              مشتریان فعال
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            1,923
          </p>
          <p className="text-xs mt-1" style={{ color: colors.success }}>
            +8% نسبت به ماه قبل
          </p>
        </div>

        <div
          className="rounded-lg p-4 border transition-all duration-300"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-[#ffd700]" />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              نرخ حفظ مشتری (CRR)
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            {cardsLoading ? "..." : `${crrData.value.toFixed(1)}٪`}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              color:
                crrData.growth >= 0 ? colors.success : colors.error,
            }}
          >
            {cardsLoading
              ? "..."
              : `${crrData.growth >= 0 ? "+" : ""}${(crrData.growth * 100).toFixed(
                  0,
                )}٪ نسبت به دوره قبل`}
          </p>
        </div>

        <div
          className="rounded-lg p-4 border transition-all duration-300"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <UserPlus className="w-5 h-5 text-[#9c27b0]" />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              متوسط درآمد هر مشتری (ARPU)
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            {cardsLoading
              ? "..."
              : `${(arpuData.value / 1000000).toLocaleString("fa-IR", {
                  maximumFractionDigits: 0,
                })}`}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              color:
                arpuData.growth >= 0 ? colors.success : colors.error,
            }}
          >
            {cardsLoading
              ? "..."
              : `${arpuData.growth >= 0 ? "+" : ""}${(arpuData.growth * 100).toFixed(
                  0,
                )}٪ نسبت به دوره قبل`}
          </p>
        </div>
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
            placeholder="جستجو در مشتریان (نام، شماره تلفن، ایمیل)"
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
            </button>a
          )}
        </div>
      </div> */}

      {/* Customers Table */}
      <CustomersTableWithFilters
        customers={filteredCustomers}
        customColumns={customColumns}
        setCustomColumns={setCustomColumns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={tableLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedCustomerType={selectedCustomerType}
        selectedProductType={selectedProductType}
        onCustomerTypeChange={setSelectedCustomerType}
        onProductTypeChange={setSelectedProductType}
        customerTypeOptions={customerTypeOptions}
        productTypeOptions={productTypeOptions}
      />

      {/* Category Settings Modal */}
      <CategorySettingsModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSave={(newCategories) => {
          setCategories(newCategories);
          console.log("Saved categories:", newCategories);
        }}
      />

      {/* Add Customer Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            dir="rtl"
          >
            <div className="bg-white dark:bg-[#1a1f2e] rounded-lg p-6 w-full max-w-[500px] border border-[#e8e8e8] dark:border-[#2a3142] pointer-events-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1c1c1c] dark:text-white">
                  {isEditMode ? "ویرایش اطلاعات مشتری" : "افزودن مشتری جدید"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditingCustomerId(null);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      phone: "",
                      email: "",
                      company: "",
                      province: "",
                      city: "",
                      neighborhood: "",
                    });
                  }}
                  className="text-[#585757] dark:text-[#8b92a8] hover:text-[#e92c2c] dark:hover:text-[#e92c2c] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={isEditMode ? handleSaveEdit : handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                      نام
                    </label>
                    <input
                      type="text"
                      placeholder="نام را وارد کنید"
                      className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      placeholder="نام خانوادگی را وارد کنید"
                      className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    placeholder="09123456789"
                    className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    placeholder="example@company.com"
                    className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                    شرکت
                  </label>
                  <input
                    type="text"
                    placeholder="نام شرکت"
                    className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                      استان
                    </label>
                    <input
                      type="text"
                      placeholder="تهران"
                      className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                      شهر
                    </label>
                    <input
                      type="text"
                      placeholder="تهران"
                      className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                      محله
                    </label>
                    <input
                      type="text"
                      placeholder="ونک"
                      className="w-full bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                      value={formData.neighborhood}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          neighborhood: e.target.value,
                        })
                      }
                      dir="rtl"
                    />
                  </div>
                </div>

                {hasTagsColumn && (
                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                      تگ‌ها
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="افزودن تگ جدید"
                        className="flex-1 bg-[#f7f9fb] dark:bg-[#2a3142] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg px-4 py-2 text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] outline-none focus:border-[#0085ff]"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        dir="rtl"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-[#0085ff] text-white px-4 py-2 rounded-lg hover:bg-[#0066cc] transition-colors flex items-center gap-1"
                      >
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">افزودن</span>
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-[#0085ff]/10 dark:bg-[#0085ff]/20 text-[#0085ff] dark:text-[#4da3ff] px-3 py-1.5 rounded-lg text-sm border border-[#0085ff]/20 dark:border-[#0085ff]/30"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="mr-1 text-[#0085ff] hover:text-[#e92c2c] transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8e8e8] dark:border-[#2a3142]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditMode(false);
                      setEditingCustomerId(null);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        phone: "",
                        email: "",
                        company: "",
                        province: "",
                        city: "",
                        neighborhood: "",
                      });
                    }}
                    className="px-4 py-2 text-sm text-[#585757] dark:text-[#8b92a8] hover:text-[#1c1c1c] dark:hover:text-white transition-colors"
                  >
                    انصراف
                  </button>
                  <ThemedButton
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg"
                  >
                    {isEditMode ? (
                      <>
                        <Edit className="w-5 h-5" />
                        <span>ذخیره تغییرات</span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          <span>افزودن مشتری</span>
                        </div>
                      </>
                    )}
                  </ThemedButton>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Deleted Customers Modal */}
      {isDeletedCustomersModalOpen && (
        <>
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsDeletedCustomersModalOpen(false)}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            dir="rtl"
          >
            <div className="bg-white dark:bg-[#1a1f2e] rounded-lg p-6 w-full max-w-[500px] border border-[#e8e8e8] dark:border-[#2a3142] pointer-events-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1c1c1c] dark:text-white">
                  مشتریان حذف شده
                </h2>
                <button
                  onClick={() => {
                    setIsDeletedCustomersModalOpen(false);
                  }}
                  className="text-[#585757] dark:text-[#8b92a8] hover:text-[#e92c2c] dark:hover:text-[#e92c2c] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {deletedCustomers.length === 0 ? (
                  <div className="text-center py-8">
                    <Trash2
                      className="w-12 h-12 mx-auto mb-3 opacity-30"
                      style={{ color: colors.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      هیچ مشتری حذف شده‌ای وجود ندارد
                    </p>
                  </div>
                ) : (
                  deletedCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="border rounded-lg p-4 transition-colors"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h3
                            className="font-semibold mb-1"
                            style={{ color: colors.textPrimary }}
                          >
                            {customer.fullName}
                          </h3>
                          <div
                            className="space-y-1 text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            {customer.place && (
                              <p>
                                📍 {customer.place}
                              </p>
                            )}
                            <p>🔢 تعداد فروش‌ها: {customer.salesCount}</p>
                            <p>
                              <span className="opacity-60">وضعیت:</span>{" "}
                              {customer.isActive ? "فعال" : "غیر فعال"}
                            </p>
                          </div>
                        </div>
                        <ThemedButton
                          variant="success"
                          onClick={() => {
                            setCustomers([...customers, customer]);
                            setDeletedCustomers(
                              deletedCustomers.filter(
                                (c) => c.id !== customer.id,
                              ),
                            );
                          }}
                          icon={<RotateCcw className="w-4 h-4" />}
                        >
                          بازگردانی
                        </ThemedButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Modal */}
      {isDeleteConfirmModalOpen && customerToDelete && (
        <>
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={cancelDelete}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            dir="rtl"
          >
            <div
              className="rounded-lg p-6 w-full max-w-[450px] border pointer-events-auto animate-fadeIn shadow-xl"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: colors.error + "20" }}
                >
                  <Trash2 className="w-6 h-6" style={{ color: colors.error }} />
                </div>
                <div className="flex-1">
                  <h2
                    className="font-bold text-lg"
                    style={{ color: colors.textPrimary }}
                  >
                    تایید حذف مشتری
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: colors.textSecondary }}
                  >
                    این عملیات قابل بازگشت است
                  </p>
                </div>
                <button
                  onClick={cancelDelete}
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

              {/* Customer Info Card */}
              <div
                className="border rounded-lg p-4 mb-5"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }}
              >
                <h3
                  className="font-semibold mb-3 text-base"
                  style={{ color: colors.textPrimary }}
                >
                  {customerToDelete.fullName}
                </h3>
                <div
                  className="grid grid-cols-2 gap-3 text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  <div className="flex items-center gap-2">
                    <span className="opacity-60">🔢</span>
                    <span>{customerToDelete.salesCount} فروش</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-60">📊</span>
                    <span>
                      {customerToDelete.isActive ? "فعال" : "غیر فعال"}
                    </span>
                  </div>
                  {customerToDelete.place && (
                    <div className="flex items-center gap-2 col-span-2">
                      <span className="opacity-60">📍</span>
                      <span>
                        {customerToDelete.place}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning Message */}
              <div
                className="rounded-lg p-3 mb-5 border"
                style={{
                  backgroundColor: colors.error + "10",
                  borderColor: colors.error + "30",
                }}
              >
                <p className="text-sm" style={{ color: colors.textPrimary }}>
                  <span className="font-semibold">توجه:</span> با حذف این مشتری،
                  اطلاعات آن از لیست اصلی حذف می‌شود اما می‌توانید از بخش "حذف
                  شده‌ها" آن را بازگردانی کنید.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: colors.textSecondary,
                    backgroundColor: colors.backgroundSecondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.backgroundSecondary;
                  }}
                >
                  انصراف
                </button>
                <ThemedButton
                  variant="danger"
                  onClick={confirmDelete}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg"
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  <span className="text-sm font-medium">حذف مشتری</span>
                </ThemedButton>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div
          className="fixed bottom-5 right-5 left-5 sm:left-auto sm:right-5 sm:w-auto bg-[#00c853] text-white px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-fadeIn z-[51]"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              مشتری با موفقیت حذف شد و به بخش "حذف شده‌ها" منتقل شد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}