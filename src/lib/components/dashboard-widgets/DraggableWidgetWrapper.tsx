"use client"

import { ReactNode, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, X, Maximize2, Minimize2 } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

interface DraggableWidgetWrapperProps {
  id: string;
  index: number;
  title: string;
  icon: React.ElementType;
  children: ReactNode;
  onRemove?: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  size?: 'small' | 'medium' | 'large';
  onSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  maxSize?: 'small' | 'medium' | 'large';
}

export function DraggableWidgetWrapper({ 
  id, 
  index,
  title, 
  icon, 
  children, 
  onRemove,
  onMove,
  size = 'medium',
  onSizeChange,
  maxSize = 'large'
}: DraggableWidgetWrapperProps) {
  const colors = useCurrentColors();
  const ref = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "ACTIVE_WIDGET",
    item: { id, index, size },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setDropPosition(null);
    }
  });

  const [{ isOver }, drop] = useDrop({
    accept: "ACTIVE_WIDGET",
    hover: (item: { id: string; index: number; size: 'small' | 'medium' | 'large' }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        setDropPosition(null);
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle and horizontal middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to the top and left
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Determine if we should show indicator before or after
      // Check both horizontal and vertical positions
      const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
      
      let position: 'top' | 'bottom' | 'left' | 'right' | null = null;
      
      // Prioritize horizontal position for RTL/LTR
      if (Math.abs(hoverClientX - hoverMiddleX) > Math.abs(hoverClientY - hoverMiddleY)) {
        // Horizontal movement is dominant
        if (isRTL) {
          position = hoverClientX > hoverMiddleX ? 'left' : 'right';
        } else {
          position = hoverClientX < hoverMiddleX ? 'left' : 'right';
        }
      } else {
        // Vertical movement is dominant
        position = hoverClientY < hoverMiddleY ? 'top' : 'bottom';
      }

      setDropPosition(position);
    },
    drop: (item: { id: string; index: number; size: 'small' | 'medium' | 'large' }) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex !== hoverIndex) {
        onMove(dragIndex, hoverIndex);
      }
      
      setDropPosition(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(ref));

  const Icon = icon;

  const handleSizeToggle = () => {
    if (!onSizeChange) return;
    
    const sizeOrder: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const maxSizeIndex = sizeOrder.indexOf(maxSize);
    const currentIndex = sizeOrder.indexOf(size);
    const nextIndex = (currentIndex + 1) > maxSizeIndex ? 0 : currentIndex + 1;
    
    onSizeChange(sizeOrder[nextIndex]);
  };

  return (
    <div className="relative">
      {/* Drop Line Indicator - Before */}
      {isOver && dropPosition === 'top' && (
        <div 
          className="absolute -top-3 left-0 right-0 h-1 z-50 pointer-events-none animate-pulse"
          style={{ 
            backgroundColor: colors.primary,
            boxShadow: `0 0 10px ${colors.primary}`,
            borderRadius: '2px',
          }}
        >
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
            }}
          >
            اینجا رها کنید
          </div>
        </div>
      )}

      <div
        ref={ref}
        className="rounded-lg border transition-all duration-200 h-full flex flex-col relative"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: isOver ? colors.primary : colors.border,
          borderWidth: isOver ? '2px' : '1px',
          opacity: isDragging ? 0.5 : 1,
          transform: isOver ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isOver ? `0 0 20px ${colors.primary}33` : 'none',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-2">
            <div
              ref={ref}
              className="cursor-move opacity-40 hover:opacity-100 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <Icon className="w-4 h-4" style={{ color: colors.primary }} />
            <h3 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {onSizeChange && (
              <button
                onClick={handleSizeToggle}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                style={{ color: colors.textSecondary }}
                title={`سایز: ${size === 'small' ? 'کوچک' : size === 'medium' ? 'متوسط' : 'بزرگ'}`}
              >
                {size === 'large' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                style={{ color: colors.textSecondary }}
              >
                <X className="w-3.5 h-3.5 group-hover:text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 min-h-0 overflow-auto">
          {children}
        </div>

        {/* Drop Indicator */}
        {isOver && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-lg border-2 animate-pulse"
            style={{ 
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}11`
            }}
          />
        )}
      </div>

      {/* Drop Line Indicator - After */}
      {isOver && dropPosition === 'bottom' && (
        <div 
          className="absolute -bottom-3 left-0 right-0 h-1 z-50 pointer-events-none animate-pulse"
          style={{ 
            backgroundColor: colors.primary,
            boxShadow: `0 0 10px ${colors.primary}`,
            borderRadius: '2px',
          }}
        >
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
            }}
          >
            اینجا رها کنید
          </div>
        </div>
      )}

      {/* Drop Line Indicator - Left */}
      {isOver && dropPosition === 'left' && (
        <div 
          className="absolute -left-3 top-0 bottom-0 w-1 z-50 pointer-events-none animate-pulse"
          style={{ 
            backgroundColor: colors.primary,
            boxShadow: `0 0 10px ${colors.primary}`,
            borderRadius: '2px',
          }}
        >
          <div 
            className="absolute -left-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
            }}
          >
            اینجا رها کنید
          </div>
        </div>
      )}

      {/* Drop Line Indicator - Right */}
      {isOver && dropPosition === 'right' && (
        <div 
          className="absolute -right-3 top-0 bottom-0 w-1 z-50 pointer-events-none animate-pulse"
          style={{ 
            backgroundColor: colors.primary,
            boxShadow: `0 0 10px ${colors.primary}`,
            borderRadius: '2px',
          }}
        >
          <div 
            className="absolute -right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-xs font-medium whitespace-nowrap"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
            }}
          >
            اینجا رها کنید
          </div>
        </div>
      )}
    </div>
  );
}