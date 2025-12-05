import { type Control, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TemplateFormItemProps {
  name: string
  label: string
  description?: string
  type: "text" | "number" | "password" | "checkbox" | "select" | "file"
  control: Control<any>
  options?: { label: string; value: string }[]
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function TemplateFormItem({
  name,
  label,
  description,
  type,
  control,
  options,
  disabled,
  readOnly,
  placeholder,
  className,
  inputClassName = "w-[300px]",
}: TemplateFormItemProps) {
  // State for file previews (used only when type === "file")
  const [filePreviews, setFilePreviews] = useState<Array<{ file: File; url: string }>>([])

  // Cleanup object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      filePreviews.forEach((fp) => {
        if (fp.url) URL.revokeObjectURL(fp.url)
      })
    }
  }, [filePreviews])

  return (
    <div className={cn("grid grid-cols-2 gap-4 items-start py-4 last:border-0", className)}>
      <div className="space-y-1">
        <Label htmlFor={name} className="text-base font-medium">
          {label}
        </Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex flex-col items-start">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ...field } }) => {
            switch (type) {
              case "checkbox":
                return (
                  <Checkbox
                    id={name}
                    checked={value ?? false}
                    onChange={onChange}
                    disabled={disabled || readOnly}
                    className={inputClassName}
                    {...field}
                  />
                )

              case "select":
                return (
                  <Select onValueChange={onChange} defaultValue={value} disabled={disabled || readOnly}>
                    <SelectTrigger className={cn("w-full", inputClassName)}>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )

              case "file":
                return (
                  <>
                    <Input
                      id={name}
                      type="file"
                      multiple
                      disabled={disabled || readOnly}
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : []
                        const limited = files.slice(0, 10)
                        const previews = limited
                          .map((f) => {
                            if (!f.type.startsWith("image/")) return
                            return { file: f, url: URL.createObjectURL(f) }
                          })
                          .filter((el) => !!el)
                        setFilePreviews((prev) => [...prev, ...previews])
                        onChange(limited)
                      }}
                      {...field}
                      value={undefined}
                      className={cn("cursor-pointer", inputClassName)}
                    />
                    <div className="flex flex-wrap mt-2 gap-2">
                      {filePreviews.map((fp, idx) => (
                        <div key={idx} className="relative">
                          {fp.url ? (
                            <img src={fp.url} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded" />
                          ) : (
                            <span className="inline-block w-24 h-24 bg-gray-200 flex items-center justify-center text-sm">
                              No preview
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const updated = filePreviews.filter((_, i) => i !== idx)
                              setFilePreviews(updated)
                              if (fp.url) URL.revokeObjectURL(fp.url)
                              onChange(updated.map((p) => p.file))
                            }}
                            className="absolute cursor-pointer top-0 right-0 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )

              case "number":
                return (
                  <Input
                    id={name}
                    type="number"
                    disabled={disabled}
                    readOnly={readOnly}
                    value={value ?? ""}
                    placeholder={placeholder}
                    className={inputClassName}
                    onChange={(e) => onChange(e.target.valueAsNumber)}
                    {...field}
                  />
                )

              default:
                // "text"
                return (
                  <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    onChange={onChange}
                    value={value ?? ""}
                    className={inputClassName}
                    {...field}
                  />
                )
            }
          }}
        />
      </div>
    </div>
  )
}
