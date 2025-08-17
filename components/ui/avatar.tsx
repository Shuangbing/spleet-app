"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn, stringToHexColor } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, username, ...props }, ref) => {
    const displayName = username.slice(0, 1).toUpperCase() || "?";
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0, showAbove: false });
    const avatarRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const updateTooltipPosition = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // 检查是否有足够空间在下方显示tooltip
        const spaceBelow = viewportHeight - rect.bottom;
        const shouldShowAbove = spaceBelow < 60; // tooltip大致高度
        
        // 计算左右位置，确保不超出屏幕
        let left = rect.left + rect.width / 2;
     
        setTooltipPosition({
          top: shouldShowAbove ? rect.top - 40 : rect.bottom + 8,
          left: left,
          showAbove: shouldShowAbove,
        });
      }
    };

    const handleClick = () => {
      setShowTooltip((prev) => {
        if (!prev) {
          updateTooltipPosition();
        }
        return !prev;
      });
    };

    const handleBlur = () => {
      setShowTooltip(false);
    };

    React.useEffect(() => {
      const handleResize = () => {
        if (showTooltip) {
          updateTooltipPosition();
        }
      };

      const handleScroll = () => {
        if (showTooltip) {
          updateTooltipPosition();
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
          setShowTooltip(false);
        }
      };

      if (showTooltip) {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true);
        document.addEventListener('click', handleClickOutside);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll, true);
          document.removeEventListener('click', handleClickOutside);
        };
      }
    }, [showTooltip]);

    const tooltip = showTooltip && mounted ? (
      <div
        className="fixed bg-popover text-popover-foreground text-sm px-3 py-2 rounded-lg z-[9999] font-medium whitespace-nowrap max-w-[10rem] shadow-xl border border-border animate-fade-in pointer-events-none"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <div 
          className="absolute w-2 h-2 bg-popover border-l border-t border-border rotate-45"
          style={{
            [tooltipPosition.showAbove ? 'bottom' : 'top']: '-4px',
            left: '50%',
            transform: `translateX(-50%) ${tooltipPosition.showAbove ? 'rotate(225deg)' : 'rotate(45deg)'}`,
          }}
        />
        {username}
      </div>
    ) : null;

    return (
      <>
        <div 
          ref={avatarRef}
          className="relative inline-block"
        >
          <div
            className={cn(
              "flex h-full w-full items-center justify-center rounded-full font-bold text-white select-none cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 ring-2 ring-white/20 hover:ring-white/40",
              className
            )}
            style={{ backgroundColor: `${stringToHexColor(username)}` }}
            {...props}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            onBlur={handleBlur}
            tabIndex={0}
          >
            {displayName}
          </div>
        </div>
        {mounted && tooltip && createPortal(tooltip, document.body)}
      </>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
