"use client"

import { useState } from "react";
import { Save, FolderOpen, Trash2, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveFilterSet, loadFilterSet, deleteSavedFilterSet } from "../store/filtersSlice";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface SavedFiltersButtonProps {
  tableId: string;
}

export function SavedFiltersButton({ tableId }: SavedFiltersButtonProps) {
  const dispatch = useAppDispatch();
  const { activeFilters, savedFilterSets } = useAppSelector((state) => state.filters);
  const currentTableFilters = activeFilters[tableId] || [];
  const currentTableSavedSets = savedFilterSets.filter(set => set.tableId === tableId);
  const colors = useCurrentColors();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [filterSetName, setFilterSetName] = useState("");

  const handleSave = () => {
    if (filterSetName.trim() && currentTableFilters.length > 0) {
      dispatch(saveFilterSet({ tableId, name: filterSetName.trim() }));
      setFilterSetName("");
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (id: string) => {
    dispatch(loadFilterSet({ tableId, setId: id }));
    setShowLoadDialog(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteSavedFilterSet(id));
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={currentTableFilters.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.textSecondary
          }}
        >
          <Save className="w-4 h-4" />
          ذخیره فیلترها
        </button>

        <button
          onClick={() => setShowLoadDialog(true)}
          disabled={currentTableSavedSets.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.textSecondary
          }}
        >
          <FolderOpen className="w-4 h-4" />
          بارگذاری فیلترها ({currentTableSavedSets.length})
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowSaveDialog(false)}
          />
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border rounded-lg shadow-xl p-6 w-96" 
            dir="rtl"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                ذخیره فیلترها
              </h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="p-1 hover:bg-opacity-80 rounded transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textSecondary
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                نام مجموعه فیلتر
              </label>
              <input
                type="text"
                value={filterSetName}
                onChange={(e) => setFilterSetName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.textPrimary
                }}
                placeholder="نام را وارد کنید..."
                autoFocus
              />
            </div>

            <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: colors.backgroundSecondary }}>
              <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                فیلترهای فعلی ({currentTableFilters.length}):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {currentTableFilters.map((filter) => (
                  <div key={filter.id} className="text-xs" style={{ color: colors.textPrimary }}>
                    • {filter.column}: {filter.value}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!filterSetName.trim()}
                className="flex-1 px-4 py-2 bg-[#0085ff] text-white rounded-lg hover:bg-[#0075dd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ذخیره
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 bg-white dark:bg-[#252b3d] border border-[#e8e8e8] dark:border-[#2a3142] text-[#585757] dark:text-[#8b92a8] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-colors text-sm"
              >
                انصراف
              </button>
            </div>
          </div>
        </>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px] z-40"
            onClick={() => setShowLoadDialog(false)}
          />
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border rounded-lg shadow-xl p-6 w-[500px]" 
            dir="rtl"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                بارگذاری فیلترهای ذخیره شده
              </h3>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="p-1 hover:bg-opacity-80 rounded transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textSecondary
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentTableSavedSets.map((filterSet) => (
                <div
                  key={filterSet.id}
                  onClick={() => handleLoad(filterSet.id)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-80 cursor-pointer transition-colors group"
                  style={{
                    backgroundColor: colors.backgroundSecondary
                  }}
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                      {filterSet.name}
                    </h4>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {filterSet.filters.length} فیلتر • {new Date(filterSet.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(filterSet.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded transition-all"
                    style={{
                      backgroundColor: colors.cardBackground
                    }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: colors.error }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}