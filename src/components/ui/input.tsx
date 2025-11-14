// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Показати червону лінію (помилка або обов’язкове поле) */
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, required, ...props }, ref) => {
    // Авто-визначення помилки: або вручну, або required + порожнє значення
    const hasError = error || (required && !props.value && props.value !== 0);

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-8 w-full px-2 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "bg-white border border-[#C0C0C0] rounded-[4px]",
            "focus-visible:outline-none",
            "focus-visible:border-[#FFCC00] focus-visible:ring-2 focus-visible:ring-[#FFCC00] focus-visible:ring-offset-1",
            "read-only:bg-[#F5F5F5] read-only:border-dashed read-only:border-[#C0C0C0] read-only:cursor-default",
            "disabled:bg-[#FAFAFA] disabled:text-[#808080] disabled:border-[#D0D0D0]",

            // ЧЕРВОНА ЛІНІЯ ЗНИЗУ
            hasError && "border-b-2 border-dotted border-b-red-500",

            className
          )}
          ref={ref}
          required={required}
          {...props}
        />

        {/* Червона лінія (якщо помилка) */}
        {hasError && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 pointer-events-none"
            style={{ transform: "translateY(1px)" }}
          />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
