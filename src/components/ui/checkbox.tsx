// components/ui/checkbox.tsx (додай, якщо потрібно)
import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={cn(
      "w-4 h-4 border border-[#C0C0C0] rounded-none",
      "checked:bg-[#FFCC00] checked:border-[#CC9900]",
      "focus-visible:ring-2 focus-visible:ring-[#FFCC00] focus-visible:ring-offset-1",
      "cursor-pointer",
      className
    )}
    ref={ref}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
