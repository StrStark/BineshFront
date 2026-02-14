import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const colors = useCurrentColors();

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm whitespace-nowrap" style={{ color: colors.textSecondary }}>
        {label}:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 border rounded-lg text-sm focus:outline-none transition-colors"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          color: colors.textPrimary,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.primary;
          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}