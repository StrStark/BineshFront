"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useExhibitionVisits, ExhibitionVisit } from "../contexts/ExhibitionVisitsContext";

interface EditExhibitionVisitModalProps {
  visit: ExhibitionVisit;
  onClose: () => void;
}

const iranProvinces = [
  "تهران", "اصفهان", "فارس", "خوزستان", "خراسان رضوی", "آذربایجان شرقی",
  "آذربایجان غربی", "کرمان", "مازندران", "گیلان", "البرز", "کرمانشاه",
  "قزوین", "یزد", "هرمزگان", "همدان", "زنجان", "مرکزی", "لرستان",
  "سمنان", "گلستان", "اردبیل", "قم", "کهگیلویه و بویراحمد", "بوشهر",
  "چهارمحال و بختیاری", "ایلام", "کردستان", "خراسان شمالی", "خراسان جنوبی", "سیستان و بلوچستان"
];

export function EditExhibitionVisitModal({ visit, onClose }: EditExhibitionVisitModalProps) {
  const colors = useCurrentColors();
  const { updateVisit } = useExhibitionVisits();

  const [formData, setFormData] = useState({
    fullName: visit.fullName,
    phoneNumber: visit.phoneNumber,
    company: visit.company,
    city: visit.city,
    province: visit.province,
    interestedProducts: visit.interestedProducts,
    notes: visit.notes,
    priority: visit.priority,
    followUpStatus: visit.followUpStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phoneNumber) {
      alert("لطفاً نام و شماره تماس را وارد کنید");
      return;
    }

    updateVisit(visit.id, formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div
        className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between bg-white dark:bg-[#1a1f2e] z-10"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-xl font-bold dark:text-white">ویرایش بازدیدکننده</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* نام و نام خانوادگی */}
            <div>
              <label className="block text-sm mb-2 dark:text-gray-300">
                نام و نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
                placeholder="مثال: علی احمدی"
                required
              />
            </div>

            {/* شماره تماس */}
            <div>
              <label className="block text-sm mb-2 dark:text-gray-300">
                شماره تماس <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
                placeholder="09123456789"
                required
              />
            </div>

            {/* شرکت/سازمان */}
            <div>
              <label className="block text-sm mb-2 dark:text-gray-300">
                شرکت/سازمان
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
                placeholder="نام شرکت یا سازمان"
              />
            </div>

            {/* استان */}
            <div>
              <label className="block text-sm mb-2 dark:text-gray-300">
                استان
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
              >
                <option value="">انتخاب استان</option>
                {iranProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* شهر */}
            <div>
              <label className="block text-sm mb-2 dark:text-gray-300">
                شهر
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
                placeholder="نام شهر"
              />
            </div>

            {/* اولویت */}
            <div>
              <label className="block text-sm mb-2 dark:text-gray-300">
                اولویت
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
              >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">زیاد</option>
              </select>
            </div>

            {/* وضعیت پیگیری */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 dark:text-gray-300">
                وضعیت پیگیری
              </label>
              <select
                name="followUpStatus"
                value={formData.followUpStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
              >
                <option value="pending">در انتظار پیگیری</option>
                <option value="contacted">تماس گرفته شده</option>
                <option value="converted">تبدیل به مشتری</option>
                <option value="not_interested">عدم علاقه</option>
              </select>
            </div>

            {/* محصولات مورد علاقه */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 dark:text-gray-300">
                محصولات مورد علاقه
              </label>
              <input
                type="text"
                name="interestedProducts"
                value={formData.interestedProducts}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700"
                style={{
                  borderColor: colors.border,
                }}
                placeholder="مثال: لپ‌تاپ HP، موس لاجیتک"
              />
            </div>

            {/* توضیحات */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 dark:text-gray-300">
                توضیحات و یادداشت‌ها
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-white dark:bg-[#252b3d] dark:text-white dark:border-gray-700 resize-none"
                style={{
                  borderColor: colors.border,
                }}
                placeholder="یادداشت‌های مهم، نیازها، درخواست‌ها و..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: colors.primary }}
            >
              ذخیره تغییرات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border transition-all hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
              style={{ borderColor: colors.border }}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
