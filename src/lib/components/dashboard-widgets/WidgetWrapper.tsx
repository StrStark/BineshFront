"use client"

import { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { GripVertical, X, Maximize2, Minimize2 } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

interface WidgetWrapperProps {
  id: string;
  title: string;
  icon: React.ElementType | string;
  children: ReactNode;
  onRemove?: () => void;
  isDraggable?: boolean;
  size?: 'small' | 'medium' | 'large';
  onSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  maxSize?: 'small' | 'medium' | 'large'; // حداکثر سایز مجاز
}

export function WidgetWrapper({ id, title, icon, children, onRemove, isDraggable = false, size = 'small', onSizeChange, maxSize = 'large' }: WidgetWrapperProps) {
  const colors = useCurrentColors();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET",
    item: { id, title, icon },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  }), [id, isDraggable]);

  const handleSizeToggle = () => {
    if (!onSizeChange) return;
    
    if (size === 'small') {
      onSizeChange('medium');
    } else if (size === 'medium') {
      // اگر maxSize='medium' باشد، به small برگرد، وگرنه به large برو
      if (maxSize === 'medium') {
        onSizeChange('small');
      } else {
        onSizeChange('large');
      }
    } else {
      onSizeChange('small');
    }
  };

  const getSizeIcon = () => {
    if (size === 'large') return <Minimize2 className="w-4 h-4" />;
    return <Maximize2 className="w-4 h-4" />;
  };

  const getSizeLabel = () => {
    if (size === 'small') return 'کوچک';
    if (size === 'medium') return 'متوسط';
    return 'بزرگ';
  };

  // Render icon (support both component and string)
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <span className="text-xl">{icon}</span>;
    }
    const IconComponent = icon;
    return <IconComponent className="w-5 h-5" style={{ color: colors.textSecondary }} />;
  };

  return (
    <div
      ref={isDraggable ? (drag as unknown as React.LegacyRef<HTMLDivElement>) : undefined}
      className="rounded-xl border transition-all h-full flex flex-col"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDraggable ? 'move' : 'default',
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 flex-1">
          {isDraggable && (
            <div
              className="transition-colors"
              style={{ color: colors.textSecondary }}
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {renderIcon()}
          
          {/* Size Toggle Button */}
          {onSizeChange && (
            <button
              onClick={handleSizeToggle}
              className="transition-colors group relative"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
              title={`اندازه: ${getSizeLabel()}`}
            >
              {getSizeIcon()}
              
              {/* Tooltip */}
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {getSizeLabel()}
              </div>
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={onRemove}
              className="transition-colors z-10"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.error;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  );
}