"use client"

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#e8e8e8] border-t-[#1c1c1c] rounded-full animate-spin"></div>
        <p className="text-sm text-[#585757]" dir="auto">
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-[#d5d5d5] rounded-lg p-5 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </div>
  );
}
