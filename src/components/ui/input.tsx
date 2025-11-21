import { forwardRef, type InputHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Показати червону лінію (помилка або обов’язкове поле) */
  error?: boolean
  wrapperClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, type, error, required, ...props }, ref) => {
    // Авто-визначення помилки: або вручну, або required + порожнє значення
    const hasError = error || (required && !props.value && props.value !== 0)

    return (
      <div className={cn("relative", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "flex h-8 w-full px-2 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "bg-white border border-neutral-800 rounded-sm",
            "focus-visible:outline-none",
            "focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
            "read-only:bg-neutral-200 read-only:border-dashed read-only:border-neutral-800 read-only:cursor-default",
            "disabled:bg-white disabled:text-neutral-900 disabled:border-neutral-700 [&[type='date']]:w-full [&[type='date']]:text-[13px]",

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
    )
  }
)
Input.displayName = "Input"

export { Input }
