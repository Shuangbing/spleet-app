"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-bold bg-gray-100 text-black select-none",
        className
      )}
      {...props}
    ></div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };
