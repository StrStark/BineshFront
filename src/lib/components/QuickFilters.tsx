"use client"

import { Calendar, Clock, Filter } from "lucide-react";

export function QuickFilters() {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142] p-4 transition-colors duration-300" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#1c1c1c] dark:text-white" dir="auto">
          فیلترها و دسترسی سریع
        </h3>
        <Filter className="w-5 h-5 text-[#585757] dark:text-[#8b92a8]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f9fb] dark:bg-[#2a3142] rounded-lg hover:bg-gray-100 dark:hover:bg-[#343d52] transition-colors">
          <Calendar className="w-4 h-4 text-[#585757] dark:text-[#8b92a8]" />
          <span className="text-sm text-[#585757] dark:text-[#8b92a8]">امروز</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f9fb] dark:bg-[#2a3142] rounded-lg hover:bg-gray-100 dark:hover:bg-[#343d52] transition-colors">
          <Calendar className="w-4 h-4 text-[#585757] dark:text-[#8b92a8]" />
          <span className="text-sm text-[#585757] dark:text-[#8b92a8]">این هفته</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f9fb] dark:bg-[#2a3142] rounded-lg hover:bg-gray-100 dark:hover:bg-[#343d52] transition-colors">
          <Clock className="w-4 h-4 text-[#585757] dark:text-[#8b92a8]" />
          <span className="text-sm text-[#585757] dark:text-[#8b92a8]">این ماه</span>
        </button>
      </div>
    </div>
  );
}