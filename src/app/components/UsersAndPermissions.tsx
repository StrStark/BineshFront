import { useState } from "react";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Crown,
  Search,
  ChevronDown,
  User,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ThemedButton } from "./ThemedButton";
import {
  PermissionsModal,
  Permission as ModalPermission,
} from "./PermissionsModal";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  lastName: string;
  mobile: string;
  birthDate?: string;
  position: string;
  role: "admin" | "manager" | "user";
  permissions: string[];
  status: "active" | "inactive";
  lastLogin: string;
  avatar?: string;
}

const availablePermissions: Permission[] = [
  { id: "dashboard", name: "داشبورد", description: "دسترسی به داشبورد اصلی" },
  { id: "calls", name: "اطلاعات تماس", description: "مشاهده و مدیریت تماس‌ها" },
  {
    id: "customers",
    name: "اطلاعات مشتریان",
    description: "مشاهده و مدیریت مشتریان",
  },
  { id: "agents", name: "کارشناسان", description: "مدیریت کارشناسان" },
  {
    id: "analytics",
    name: "تحلیل‌ها",
    description: "دسترسی به گزارش‌های تحلیلی",
  },
  {
    id: "reports",
    name: "گزارش‌گیری",
    description: "دانلود و مشاهده گزارش‌ها",
  },
  { id: "settings", name: "تنظیمات", description: "تغییر تنظیمات سیستم" },
  { id: "users", name: "مدیریت کاربران", description: "افزودن و حذف کاربران" },
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "احمد",
    lastName: "محمدی",
    mobile: "09120509859",
    position: "مدیر عامل",
    birthDate: "1370/05/15",
    role: "manager",
    permissions: [
      "dashboard",
      "calls",
      "customers",
      "agents",
      "analytics",
      "reports",
      "settings",
      "users",
    ],
    status: "active",
    lastLogin: "1402/12/16 13:50:00",
  },
  {
    id: "2",
    name: "فاطمه",
    lastName: "احمدی",
    mobile: "09120509859",
    position: "مدیر فروش",
    birthDate: "1372/08/23",
    role: "manager",
    permissions: ["dashboard", "calls", "customers", "analytics", "reports"],
    status: "active",
    lastLogin: "1402/12/16 14:00:00",
  },
  {
    id: "3",
    name: "محسن",
    lastName: "رضایی",
    mobile: "09120509859",
    position: "کارشناس پشتیبانی",
    birthDate: "1375/03/10",
    role: "user",
    permissions: ["dashboard", "calls", "reports"],
    status: "active",
    lastLogin: "1402/12/16 12:30:00",
  },
  {
    id: "4",
    name: "زهرا",
    lastName: "کریمی",
    mobile: "09120509859",
    position: "کارشناس کنترل کیفیت",
    birthDate: "1373/11/28",
    role: "user",
    permissions: ["dashboard", "calls", "analytics"],
    status: "active",
    lastLogin: "1402/12/15 16:45:00",
  },
  {
    id: "5",
    name: "علی",
    lastName: "حسینی",
    mobile: "09120509859",
    position: "اپراتور",
    birthDate: "1376/02/18",
    role: "user",
    permissions: ["dashboard", "calls"],
    status: "inactive",
    lastLogin: "1402/11/28 10:20:00",
  },
];

const roleLabels = {
  admin: "مدیر کل",
  manager: "مدیر",
  user: "کاربر",
};

const roleColors = {
  admin: { bg: "#fef3c7", text: "#b45309", icon: "#f59e0b" },
  manager: { bg: "#dbeafe", text: "#1e40af", icon: "#3b82f6" },
  user: { bg: "#e0e7ff", text: "#4338ca", icon: "#6366f1" },
};

export function UsersAndPermissions() {
  const colors = useCurrentColors();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    mobile: "",
    birthDate: "",
    position: "",
    role: "user" as "admin" | "manager" | "user",
    avatar: "" as string,
  });

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  // Filtered Users
  const filteredUsers = users.filter(
    (user) =>
      `${user.name} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || user.mobile.includes(searchTerm),
  );

  const handleAddUser = () => {
    setIsEditMode(false);
    setEditingUser(null);
    setSelectedUser(null);
    setFormData({
      name: "",
      lastName: "",
      mobile: "",
      birthDate: "",
      position: "",
      role: "user",
      avatar: "",
    });
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditMode(true);
    setEditingUser(user);
    setFormData({
      name: user.name,
      lastName: user.lastName,
      mobile: user.mobile,
      birthDate: user.birthDate || "",
      position: user.position,
      role: user.role,
      avatar: user.avatar || "",
    });
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && editingUser) {
      // Edit existing user — only update the fields from the info modal
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                lastName: formData.lastName,
                mobile: formData.mobile,
                birthDate: formData.birthDate || undefined,
                position: formData.position,
                role: formData.role,
                avatar: formData.avatar || undefined,
              }
            : u,
        ),
      );
    } else {
      // Add new user
      const newUser: User = {
        id: String(Date.now()),
        name: formData.name,
        lastName: formData.lastName,
        mobile: formData.mobile,
        birthDate: formData.birthDate || undefined,
        position: formData.position,
        role: formData.role,
        avatar: formData.avatar || undefined,
        permissions: [], // new users start with no permissions
        status: "active",
        lastLogin:
          new Date().toLocaleDateString("fa-IR") +
          " " +
          new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      };
      setUsers([...users, newUser]);
    }

    setShowAddUserModal(false);
    setIsEditMode(false);
    setEditingUser(null);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
  };

  const getInitials = (name: string, lastName: string) => {
    return (name[0] || "") + (lastName[0] || "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            کاربران و دسترسی‌ها
          </h3>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            مدیریت کاربران و سطوح دسترسی آن‌ها
          </p>
        </div>
        <ThemedButton
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          افزودن کاربر جدید
        </ThemedButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                کل کاربران
              </p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: colors.textPrimary }}
              >
                {totalUsers}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Users className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                مدیران
              </p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: colors.textPrimary }}
              >
                {adminUsers}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Shield className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          style={{ color: colors.textSecondary }}
        />
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا موبایل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-4 py-3 rounded-lg border outline-none transition-colors"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.textPrimary,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.border;
          }}
        />
      </div>

      {/* Users Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: colors.backgroundSecondary }}>
                <th
                  className="text-right px-6 py-4 text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  نام کاربر
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  موبایل
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  دسترسی‌ها
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  آخرین ورود
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t transition-colors hover:bg-opacity-50"
                  style={{ borderColor: colors.border }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.backgroundSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: roleColors[user.role].bg,
                          color: roleColors[user.role].text,
                        }}
                      >
                        {getInitials(user.name, user.lastName)}
                      </div>
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {user.name} {user.lastName}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {user.position}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mobile */}
                  <td className="px-6 py-4">
                    <span
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                      dir="ltr"
                    >
                      {user.mobile}
                    </span>
                  </td>

                  {/* Permissions */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditPermissions(user)}
                      className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.textSecondary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary;
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.backgroundSecondary;
                        e.currentTarget.style.color = colors.textSecondary;
                      }}
                    >
                      {user.permissions.length} دسترسی
                    </button>
                  </td>

                  {/* Last Login */}
                  <td className="px-6 py-4">
                    <div
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      <div>{user.lastLogin.split(" ")[0]}</div>
                      <div className="mt-0.5" dir="ltr">
                        {user.lastLogin.split(" ")[1]}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.backgroundSecondary;
                          e.currentTarget.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="ویرایش کاربر"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#fee2e2";
                          e.currentTarget.style.color =
                            colors.error || "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="حذف کاربر"
                        disabled={user.role === "admin"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div
              className="px-6 py-4 border-b sticky top-0 z-10"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <h3
                className="text-xl font-bold text-center"
                style={{ color: colors.textPrimary }}
              >
                {isEditMode ? "ویرایش کاربر" : "افزودن کاربر جدید"}
              </h3>
            </div>

            <form onSubmit={handleSubmitUser}>
              <div className="px-8 py-8">
                {/* Avatar Upload Section */}
                <div
                  className="flex items-center gap-6 p-6 rounded-xl mb-8"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                  }}
                >
                  <div className="relative flex-shrink-0">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar"
                        className="w-28 h-28 rounded-full object-cover border-4"
                        style={{ borderColor: colors.border }}
                      />
                    ) : (
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold border-4"
                        style={{
                          backgroundColor: colors.cardBackground,
                          borderColor: colors.border,
                          color: colors.primary,
                        }}
                      >
                        {formData.name && formData.lastName
                          ? formData.name[0] + formData.lastName[0]
                          : "م"}
                      </div>
                    )}
                    <div
                      className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center border-4"
                      style={{
                        backgroundColor: colors.primary,
                        borderColor: colors.cardBackground,
                      }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <h4
                      className="text-lg font-bold mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      {formData.name && formData.lastName
                        ? `${formData.name} ${formData.lastName}`
                        : "نام کاربر"}
                    </h4>
                    <p
                      className="text-sm mb-3"
                      style={{ color: colors.textSecondary }}
                    >
                      {formData.position || "عنوان شغلی"}
                    </p>

                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("حجم فایل نباید بیشتر از 5 مگابایت باشد");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              ...formData,
                              avatar: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      className="text-sm font-medium underline decoration-2 underline-offset-4 transition-colors"
                      style={{ color: colors.primary }}
                    >
                      تغییر تصویر
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2 text-right"
                        style={{ color: colors.textPrimary }}
                      >
                        نام*
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = colors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = colors.border)
                        }
                        placeholder="نام"
                        required
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2 text-right"
                        style={{ color: colors.textPrimary }}
                      >
                        نام خانوادگی*
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = colors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = colors.border)
                        }
                        placeholder="نام خانوادگی"
                        required
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2 text-right"
                        style={{ color: colors.textPrimary }}
                      >
                        تاریخ تولد
                      </label>
                      <input
                        type="text"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = colors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = colors.border)
                        }
                        placeholder="1404/11/20"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2 text-right"
                        style={{ color: colors.textPrimary }}
                      >
                        شماره موبایل*
                      </label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = colors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = colors.border)
                        }
                        placeholder="09xx xxx xxxx"
                        required
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2 text-right"
                        style={{ color: colors.textPrimary }}
                      >
                        عنوان شغلی*
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = colors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = colors.border)
                        }
                        placeholder="مدیر فروش"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Role Select */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2 text-right"
                      style={{ color: colors.textPrimary }}
                    >
                      سطح دسترسی*
                    </label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as
                              | "admin"
                              | "manager"
                              | "user",
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border outline-none appearance-none transition-colors pr-12"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = colors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = colors.border)
                        }
                      >
                        <option value="user">کاربر</option>
                        <option value="manager">مدیر</option>
                        <option value="admin">مدیر کل</option>
                      </select>
                      <ChevronDown
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: colors.textSecondary }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="px-6 py-4 border-t flex items-center justify-center gap-3"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setIsEditMode(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-sm transition-colors"
                  style={{
                    color: colors.textSecondary,
                    backgroundColor: colors.backgroundSecondary,
                  }}
                >
                  انصراف
                </button>
                <ThemedButton
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-medium"
                >
                  {isEditMode ? "ذخیره تغییرات" : "ثبت کاربر"}
                </ThemedButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-xl shadow-2xl max-w-md w-full"
            style={{
              backgroundColor: colors.cardBackground,
            }}
          >
            <div className="px-6 py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <Trash2
                  className="w-6 h-6"
                  style={{ color: colors.error || "#ef4444" }}
                />
              </div>
              <h3
                className="text-lg font-bold text-center"
                style={{ color: colors.textPrimary }}
              >
                حذف کاربر
              </h3>
              <p
                className="text-sm text-center mt-2"
                style={{ color: colors.textSecondary }}
              >
                آیا از حذف کاربر{" "}
                <span className="font-bold">
                  {userToDelete.name} {userToDelete.lastName}
                </span>{" "}
                اطمینان دارید؟ این عملیات قابل بازگشت نیست.
              </p>
            </div>

            <div
              className="px-6 py-4 border-t flex items-center justify-center gap-3"
              style={{
                borderColor: colors.border,
              }}
            >
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{
                  color: colors.textSecondary,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                انصراف
              </button>
              <ThemedButton
                onClick={confirmDelete}
                variant="error"
                className="px-4 py-2 rounded-lg text-sm"
              >
                حذف کاربر
              </ThemedButton>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal - key forces remount on user change to ensure fresh initialPermissions */}
      <PermissionsModal
        key={selectedUser ? selectedUser.id : "closed"}
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        userName={
          selectedUser ? `${selectedUser.name} ${selectedUser.lastName}` : ""
        }
        initialPermissions={
          selectedUser
            ? availablePermissions.map((p) => ({
                id: p.id,
                label: p.name,
                description: p.description,
                enabled: selectedUser.permissions.includes(p.id),
              }))
            : []
        }
        onSave={(permissions: ModalPermission[]) => {
          if (selectedUser) {
            const enabledIds = permissions
              .filter((p) => p.enabled)
              .map((p) => p.id);
            setUsers(
              users.map((u) =>
                u.id === selectedUser.id
                  ? { ...u, permissions: enabledIds }
                  : u,
              ),
            );
            setSelectedUser(null);
          }
        }}
      />
    </div>
  );
}
