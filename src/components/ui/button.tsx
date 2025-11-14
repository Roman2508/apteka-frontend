import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Базові стилі (1С)
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0066CC] " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "font-1c text-1c border border-[#BEBEBE] rounded-[4px] h-8 px-4 text-sm",
  {
    variants: {
      variant: {
        /* ---------- СТАНДАРТНА (біла, градієнт) ---------- */
        default:
          "bg-gradient-to-b from-[#FFFFFF] to-[#E6E6E6] " +
          "text-black hover:from-[#F5F5F5] hover:to-[#D4D4D4] " +
          "active:from-[#E0E0E0] active:to-[#C8C8C8] " +
          "shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_1px_2px_rgba(0,0,0,0.1)]",

        /* ---------- PRIMARY (жовта, градієнт) ---------- */
        primary:
          // "bg-gradient-to-b from-[#FFFFCC] to-[#FFCC33] " +
          "bg-gradient-to-b from-[#FFEA4D] to-[#efcf00] " +
          "font-bold text-black border-[#CC9900] " +
          // "hover:from-[#FFFFB3] hover:to-[#FFCC00] " +
          "hover:from-[#FFEE6C] hover:to-[#E6C700] " +
          // "active:from-[#FFCC66] active:to-[#E6B800] " +
          "active:from-[#FFDB66] active:to-[#D0B800] " +
          "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(0,0,0,0.2)]",

        /* ---------- ВТОРОСТЕПЕННА (для "..." тощо) ---------- */
        secondary:
          "bg-gradient-to-b from-[#F5F5F5] to-[#E0E0E0] " +
          "text-black hover:from-[#EBEBEB] hover:to-[#D0D0D0] " +
          "active:from-[#DCDCDC] active:to-[#C4C4C4]",

        /* ---------- ССИЛКА ---------- */
        link: "text-[#0000EE] underline-offset-4 hover:underline bg-transparent border-transparent",

        /* ---------- ДЕСТРУКТИВНА ---------- */
        destructive:
          "bg-gradient-to-b from-[#FF6666] to-[#CC0000] " +
          "text-white border-[#990000] " +
          "hover:from-[#FF4D4D] hover:to-[#B30000] " +
          "active:from-[#E63939] active:to-[#990000]",
      },
      size: {
        default: "h-8 px-4 text-sm",
        sm: "h-7 px-3 text-[13px]",
        lg: "h-9 px-5 text-base",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
