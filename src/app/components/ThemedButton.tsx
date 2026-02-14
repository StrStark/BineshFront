import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { ReactNode } from "react";

interface ThemedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "error" | "warning";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function ThemedButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  icon,
}: ThemedButtonProps) {
  const colors = useCurrentColors();

  const getColors = () => {
    switch (variant) {
      case "secondary":
        return { 
          bg: colors.backgroundSecondary, 
          hover: colors.border,
          text: colors.textPrimary,
        };
      case "success":
        return { bg: colors.success, hover: colors.success, text: "#ffffff" };
      case "error":
        return { bg: colors.error, hover: colors.error, text: "#ffffff" };
      case "warning":
        return { bg: colors.warning, hover: colors.warning, text: "#ffffff" };
      default:
        return { bg: colors.primary, hover: colors.primaryHover, text: "#ffffff" };
    }
  };

  const { bg, hover, text } = getColors();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#9ca3af" : bg,
        color: disabled ? "#ffffff" : text,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = bg;
        }
      }}
      className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}