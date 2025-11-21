import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Базові стилі
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "border border-neutral-800 rounded-sm h-8 px-4 text-[13px]",
  {
    variants: {
      variant: {
        /* ---------- СТАНДАРТНА (біла, градієнт) ---------- */
        default:
          "bg-gradient-to-b from-white to-neutral-400 " +
          "text-black hover:from-neutral-200 hover:to-neutral-600 " +
          "active:from-neutral-500 active:to-neutral-700 " +
          "shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_1px_2px_rgba(0,0,0,0.1)]",

        /* ---------- PRIMARY (жовта, градієнт) ---------- */
        primary:
          "bg-gradient-to-b from-primary-300 to-primary-600 " +
          "font-bold text-black border-primary-700 " +
          "hover:from-primary-400 hover:to-primary-700 " +
          "active:from-primary-500 active:to-primary-800 " +
          "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(0,0,0,0.2)]",

        /* ---------- ССИЛКА ---------- */
        link: "text-blue-500 underline-offset-4 hover:underline bg-transparent border-transparent",

        /* ---------- ДЕСТРУКТИВНА ---------- */
        destructive:
          "bg-gradient-to-b from-destructive-300 to-destructive-700 " +
          "text-white border-destructive-700 " +
          "hover:from-destructive-400 hover:to-destructive-800 " +
          "active:from-destructive-600 active:to-destructive-900",

        /* ---------- NOT USED ---------- */
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground border-transparent",
      },
      size: {
        default: "h-8 px-4",
        sm: "h-7 px-3",
        lg: "h-9 px-5 text-base",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
