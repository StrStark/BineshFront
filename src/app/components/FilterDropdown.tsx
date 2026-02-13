import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colors = useCurrentColors();

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-sm"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          color: colors.textPrimary,
        }}
      >
        <span className="whitespace-nowrap">{label}:</span>
        <span
          className="font-semibold"
          style={{ color: colors.primary }}
        >
          {selectedOption?.label || "همه"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: colors.textSecondary }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 rounded-lg border shadow-lg z-50 min-w-[200px] overflow-hidden"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm text-right flex items-center justify-between gap-2 transition-colors"
                style={{
                  backgroundColor:
                    value === option.value
                      ? colors.primary + "10"
                      : "transparent",
                  color:
                    value === option.value
                      ? colors.primary
                      : colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor =
                      colors.backgroundSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4" style={{ color: colors.primary }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
