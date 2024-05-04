"use client";

import * as React from "react";
import { cn, stringToHexColor } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, username, ...props }, ref) => {
    const displayName = username.slice(0, 1).toUpperCase() || "?";
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full font-bold bg-gray-100 text-black select-none",
          className
        )}
        style={{ backgroundColor: `${stringToHexColor(username)}` }}
        {...props}
      >
        {displayName}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
