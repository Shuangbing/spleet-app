"use client";

import * as React from "react";
import { cn, stringToHexColor } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, username, ...props }, ref) => {
    const displayName = username.slice(0, 1).toUpperCase() || "?";
    const [showTooltip, setShowTooltip] = React.useState(false);

    const handleClick = () => {
      setShowTooltip((prev) => !prev);
    };

    const handleBlur = () => {
      setShowTooltip(false);
    };

    return (
      <div className="relative inline-block">
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
        {showTooltip && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 mt-3 bg-popover text-popover-foreground text-sm px-3 py-2 rounded-lg z-50 font-medium whitespace-nowrap max-w-[10rem] shadow-lg border border-border animate-fade-in"
            style={{ top: "100%" }}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-popover border-l border-t border-border" />
            {username}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
