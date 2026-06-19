"use client"

import { useState, useEffect } from "react";
import { X, Plus, Sparkles, Trash2 } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

export interface AICategory {
  id: string;
  name: string;
  keywords: string[];
  color: string;
}

interface AICategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCategories: AICategory[] = [
  {
    id: "1",
    name: "فروش موفق",
    keywords: ["خرید", "موافقت", "قبول", "تایید"],
    color: "#10a242",
  },
  {
    id: "2",
    name: "نیاز به پیگیری",
    keywords: ["فکر می‌کنم", "بعداً", "نمی‌دانم"],
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "عدم علاقه",
    keywords: ["نه", "رد", "علاقه‌ای ندارم"],
    color: "#e92c2c",
  },
];

export function AICategoriesModal({ isOpen, onClose }: AICategoriesModalProps) {
  const [categories, setCategories] = useState<AICategory[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#0085ff");
  const [newKeyword, setNewKeyword] = useState("");
  const [tempKeywords, setTempKeywords] = useState<string[]>([]);
  const colors = useCurrentColors();

  // Load categories from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("aiCategories");
      if (saved) {
        try {
          setCategories(JSON.parse(saved));
        } catch (e) {
          setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
      }
    }
  }, [isOpen]);

  // Save categories to localStorage
  const saveCategories = (cats: AICategory[]) => {
    localStorage.setItem("aiCategories", JSON.stringify(cats));
    setCategories(cats);
  };

  const addCategory = () => {
    if (!newCategoryName.trim() || tempKeywords.length === 0) return;

    const newCategory: AICategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      keywords: tempKeywords,
      color: newCategoryColor,
    };

    saveCategories([...categories, newCategory]);
    
    // Reset form
    setNewCategoryName("");
    setNewCategoryColor("#0085ff");
    setTempKeywords([]);
    setIsAddingCategory(false);
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter((cat) => cat.id !== id));
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setTempKeywords([...tempKeywords, newKeyword.trim()]);
    setNewKeyword("");
  };

  const removeKeyword = (index: number) => {
    setTempKeywords(tempKeywords.filter((_, i) => i !== index));
  };

  const removeKeywordFromCategory = (categoryId: string, keyword: string) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          keywords: cat.keywords.filter((kw) => kw !== keyword),
        };
      }
      return cat;
    });
    saveCategories(updatedCategories);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none" dir="rtl">
        <div 
          className="rounded-xl w-full max-w-[700px] border pointer-events-auto animate-fadeIn shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
              <h2 className="text-xl" style={{ color: colors.textPrimary }}>
                تنظیمات دسته‌بندی هوش مصنوعی
              </h2>
            </div>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e92c2c'}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div 
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border
            }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              هوش مصنوعی بر اساس کلمات کلیدی تعریف شده، تماس‌ها را به دسته‌های مختلف تقسیم‌بندی می‌کند.
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Category Button */}
            <div className="mb-4">
              <button
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دسته‌بندی جدید</span>
              </button>
            </div>

            {/* Add Category Form */}
            {isAddingCategory && (
              <div 
                className="mb-6 p-4 border rounded-lg space-y-4"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundSecondary
                }}
              >
                <h3 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  دسته‌بندی جدید
                </h3>

                {/* Category Name */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                    نام دسته‌بندی
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="مثال: مشتری راضی"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.cardBackground,
                      color: colors.textPrimary,
                      outlineColor: colors.primary
                    }}
                  />
                </div>

                {/* Category Color */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                    رنگ دسته‌بندی
                  </label>
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-20 h-10 border rounded-lg cursor-pointer"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                    کلمات کلیدی
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                      placeholder="کلمه کلیدی را وارد کنید..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.cardBackground,
                        color: colors.textPrimary,
                        outlineColor: colors.primary
                      }}
                    />
                    <button
                      onClick={addKeyword}
                      className="px-3 py-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: colors.primary }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Keywords List */}
                  {tempKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tempKeywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 border rounded text-xs"
                          style={{
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border
                          }}
                        >
                          <span style={{ color: colors.textPrimary }}>{keyword}</span>
                          <button
                            onClick={() => removeKeyword(index)}
                            className="text-[#e92c2c] hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={addCategory}
                    disabled={!newCategoryName.trim() || tempKeywords.length === 0}
                    className="flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) => !newCategoryName.trim() || tempKeywords.length === 0 ? null : e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    افزودن دسته‌بندی
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                      setNewCategoryColor("#0085ff");
                      setTempKeywords([]);
                      setNewKeyword("");
                    }}
                    className="px-4 py-2 rounded-lg transition-colors text-sm"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textSecondary
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    لغو
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg group"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardBackground
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {category.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-[var(--color-background-secondary)] text-[#e92c2c] p-1.5 rounded transition-all"
                      title="حذف دسته‌بندی"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {category.keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 border rounded text-xs group/keyword"
                        style={{
                          backgroundColor: colors.backgroundSecondary,
                          borderColor: colors.border
                        }}
                      >
                        <span style={{ color: colors.textSecondary }}>{keyword}</span>
                        <button
                          onClick={() => removeKeywordFromCategory(category.id, keyword)}
                          className="opacity-0 group-hover/keyword:opacity-100 text-[#e92c2c] hover:opacity-70 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}