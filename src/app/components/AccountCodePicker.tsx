import { X } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface AccountCodePickerProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  availableCodes: Array<{ code: string; name: string }>;
  index?: number;
}

export function AccountCodePicker({
  value,
  onChange,
  onRemove,
  availableCodes,
}: AccountCodePickerProps) {
  const colors = useCurrentColors();

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm outline-none cursor-pointer"
        style={{
          color: colors.textPrimary,
        }}
        dir="rtl"
      >
        <option value="">انتخاب کنید</option>
        {availableCodes.map((acc) => (
          <option key={acc.code} value={acc.code}>
            {acc.code} - {acc.name}
          </option>
        ))}
      </select>
      <button
        onClick={onRemove}
        className="p-1 rounded transition-colors hover:bg-red-100 dark:hover:bg-red-900/20"
        style={{
          color: colors.textSecondary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.error;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.textSecondary;
        }}
        title="حذف"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
