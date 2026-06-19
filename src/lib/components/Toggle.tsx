"use client"

import { useTheme } from "../contexts/ThemeContext";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, activeColor, disabled = false }: ToggleProps) {
  const { isDarkMode } = useTheme();
  
  // رنگ پس‌زمینه در حالت غیرفعال
  const inactiveBg = isDarkMode ? "#4a5568" : "#cbd5e0";
  
  return (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={`
          w-11 h-6 rounded-full transition-all duration-200 ease-in-out
          relative
          ${disabled ? 'opacity-50' : ''}
        `}
        style={{
          backgroundColor: checked ? (activeColor || "#0085ff") : inactiveBg,
        }}
      >
        {/* دایره متحرک */}
        <div
          className={`
            absolute top-[2px] 
            w-5 h-5 
            bg-white rounded-full 
            shadow-md
            transition-all duration-200 ease-in-out
            ${checked ? 'left-[2px]' : 'right-[2px]'}
          `}
        />
      </div>
    </label>
  );
}
