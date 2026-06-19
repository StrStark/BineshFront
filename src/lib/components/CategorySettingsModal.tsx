"use client"

import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface Category {
  id: string;
  name: string;
  color: string;
  keywords: string[];
}

interface CategorySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (categories: Category[]) => void;
}

export function CategorySettingsModal({
  isOpen,
  onClose,
  categories: initialCategories,
  onSave,
}: CategorySettingsModalProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#0085ff");

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
        keywords: [],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryColor("#0085ff");
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleAddKeyword = (categoryId: string, keyword: string) => {
    if (keyword.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, keywords: [...cat.keywords, keyword.trim()] }
            : cat
        )
      );
    }
  };

  const handleRemoveKeyword = (categoryId: string, keywordIndex: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              keywords: cat.keywords.filter((_, i) => i !== keywordIndex),
            }
          : cat
      )
    );
  };

  const handleSave = () => {
    onSave(categories);
    onClose();
  };

  const predefinedColors = [
    "#00c853", // سبز
    "#ff9800", // نارنجی
    "#e92c2c", // قرمز
    "#0085ff", // آبی
    "#9c27b0", // بنفش
    "#ffd700", // طلایی
    "#00bcd4", // آبی فیروزه‌ای
    "#f44336", // قرمز تیره
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-[#1a1f2e] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8e8e8] dark:border-[#2a3142]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e6f3ff] dark:bg-[#2a4a6f] rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <h2 className="text-xl font-bold text-[#1c1c1c] dark:text-white">
              تنظیمات دسته‌بندی هوش مصنوعی
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#969696] dark:text-[#8b92a8] hover:text-[#1c1c1c] dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 py-4 bg-[#f7f9fb] dark:bg-[#252b3d] border-b border-[#e8e8e8] dark:border-[#2a3142]">
          <p className="text-sm text-[#585757] dark:text-[#8b92a8]">
            هوش مصنوعی بر اساس کلمات کلیدی تعریف شده، تماس‌ها را به دسته‌های مختلف تقسیم‌بندی می‌کند.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Existing Categories */}
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onDelete={() => handleDeleteCategory(category.id)}
              onAddKeyword={(keyword) => handleAddKeyword(category.id, keyword)}
              onRemoveKeyword={(index) => handleRemoveKeyword(category.id, index)}
            />
          ))}

          {/* Add New Category */}
          <div className="border-2 border-dashed border-[#e8e8e8] dark:border-[#2a3142] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                placeholder="نام دسته‌بندی جدید..."
                className="flex-1 px-4 py-2 bg-white dark:bg-[#252b3d] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] focus:outline-none focus:ring-2 focus:ring-[#0085ff]/20"
              />
              
              {/* Color Picker */}
              <div className="flex items-center gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      newCategoryColor === color
                        ? "ring-2 ring-[#0085ff] ring-offset-2 dark:ring-offset-[#1a1f2e]"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[#0085ff] text-white rounded-lg hover:bg-[#0066cc] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دسته‌بندی جدید</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#e8e8e8] dark:border-[#2a3142]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#f7f9fb] dark:bg-[#252b3d] text-[#1c1c1c] dark:text-white rounded-lg hover:bg-[#e8e8e8] dark:hover:bg-[#2a3142] transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#0085ff] text-white rounded-lg hover:bg-[#0066cc] transition-colors"
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}

interface CategoryItemProps {
  category: Category;
  onDelete: () => void;
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (index: number) => void;
}

function CategoryItem({
  category,
  onDelete,
  onAddKeyword,
  onRemoveKeyword,
}: CategoryItemProps) {
  const [keywordInput, setKeywordInput] = useState("");

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      onAddKeyword(keywordInput);
      setKeywordInput("");
    }
  };

  return (
    <div className="bg-white dark:bg-[#252b3d] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: category.color }}
          />
          <h3 className="font-bold text-[#1c1c1c] dark:text-white">
            {category.name}
          </h3>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-[#e92c2c] hover:bg-[#fee] dark:hover:bg-[#3d2a2a] rounded-lg transition-colors"
          title="حذف دسته"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-3">
        {category.keywords.map((keyword, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f9fb] dark:bg-[#1a1f2e] rounded-full border border-[#e8e8e8] dark:border-[#2a3142]"
          >
            <span className="text-sm text-[#1c1c1c] dark:text-white">
              {keyword}
            </span>
            <button
              onClick={() => onRemoveKeyword(index)}
              className="text-[#969696] dark:text-[#8b92a8] hover:text-[#e92c2c] transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add Keyword */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
          placeholder="افزودن کلمه کلیدی جدید..."
          className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1f2e] border border-[#e8e8e8] dark:border-[#2a3142] rounded-lg text-sm text-[#1c1c1c] dark:text-white placeholder:text-[#969696] dark:placeholder:text-[#8b92a8] focus:outline-none focus:ring-2 focus:ring-[#0085ff]/20"
        />
        <button
          onClick={handleAddKeyword}
          className="px-4 py-2 bg-[#0085ff] text-white rounded-lg hover:bg-[#0066cc] transition-colors text-sm"
        >
          افزودن
        </button>
      </div>
    </div>
  );
}