import { Check, ChevronsUpDown, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { type Control, Controller } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export type FormItemType =
  | "text"
  | "checkbox"
  | "number"
  | "password"
  | "date"
  | "select"
  | "async-select"
  | "file"
  | "multi-select"
  | "custom"

export interface Option {
  label: string
  value: string | number
}

export interface CustomRenderProps {
  onChange: (...event: any[]) => void
  value: any
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  name: string
  ref: React.Ref<any>
  onBlur: () => void
}

interface TemplateFormItemProps {
  name: string
  label: string
  description?: string
  type: FormItemType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  required?: boolean
  options?: Option[]
  onSearch?: (query: string) => Promise<Option[]>
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
  staticValue?: any
  render?: (props: CustomRenderProps) => React.ReactElement
}

export function TemplateFormItem({
  name,
  label,
  description,
  type,
  control,
  options: initialOptions = [],
  onSearch,
  required,
  disabled,
  readOnly,
  className,
  placeholder,
  staticValue,
  render,
  inputClassName = "w-[300px]",
}: TemplateFormItemProps) {
  // State for file previews
  const [filePreviews, setFilePreviews] = useState<Array<{ file: File; url: string }>>([])

  // State for async select
  const [open, setOpen] = useState(false)
  const [asyncOptions, setAsyncOptions] = useState<Option[]>(initialOptions)
  const [loading, setLoading] = useState(false)

  // State for label mapping (for multi-select and async-select)
  const [labelMap, setLabelMap] = useState<Record<string, string>>({})

  // Update label map when options change
  useEffect(() => {
    const newMap = { ...labelMap }
    let changed = false
    const addOptions = (opts: Option[]) => {
      opts.forEach((opt) => {
        const key = String(opt.value)
        if (newMap[key] !== opt.label) {
          newMap[key] = opt.label
          changed = true
        }
      })
    }
    addOptions(initialOptions)
    addOptions(asyncOptions)

    if (changed) setLabelMap(newMap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOptions, asyncOptions]) // Intentionally not including labelMap to avoid loops, though logic handles it.

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      filePreviews.forEach((fp) => {
        if (fp.url) URL.revokeObjectURL(fp.url)
      })
    }
  }, [filePreviews])

  // Search handler for async select
  const handleSearch = useCallback(
    async (search: string) => {
      if (!onSearch) return
      setLoading(true)
      try {
        const results = await onSearch(search)
        setAsyncOptions(results.slice(0, 30))
      } catch (error) {
        console.error("Search failed", error)
      } finally {
        setLoading(false)
      }
    },
    [onSearch],
  )

  // Initial load for async select if onSearch is provided
  useEffect(() => {
    if ((type === "async-select" || type === "multi-select") && onSearch) {
      handleSearch("")
    }
  }, [type, onSearch, handleSearch])

  return (
    <div className={cn("grid grid-cols-2 grid-cols-[200px_1fr] gap-4 items-start py-4 last:border-0", className)}>
      <div className="space-y-1">
        <Label htmlFor={name} className="text-base font-bold">
          {label}
          {required ? "*" : ""}
        </Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex flex-col items-start w-full">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ...field } }) => {
            switch (type) {
              case "checkbox":
                return (
                  <Checkbox
                    id={name}
                    onChange={(e) => onChange(e.target.checked)}
                    checked={staticValue ?? value ?? false}
                    disabled={disabled || readOnly}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    required={!!required}
                    // {...field}
                  />
                )

              case "async-select":
                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("justify-between font-normal", inputClassName, !value && "text-muted-foreground")}
                        disabled={disabled || readOnly}
                      >
                        {value ? labelMap[String(value)] || value : placeholder || "Оберіть зі списку..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                      <Command shouldFilter={!onSearch}>
                        <CommandInput
                          placeholder="Пошук..."
                          onValueChange={(val) => {
                            if (onSearch) handleSearch(val)
                          }}
                        />
                        <CommandList>
                          {loading && <div className="py-6 text-center text-sm">Завантаження...</div>}
                          <CommandEmpty>Нічого не знайдено.</CommandEmpty>
                          <CommandGroup>
                            {asyncOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={staticValue ?? option.value}
                                onSelect={() => {
                                  onChange(option.value)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(value) === String(option.value) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )

              case "multi-select":
                const selectedValues = Array.isArray(value) ? value : []
                return (
                  <div className="flex flex-col gap-2 w-full">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn("justify-between font-normal", inputClassName)}
                          disabled={disabled || readOnly}
                        >
                          {placeholder || "Оберіть зі списку..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                        <Command shouldFilter={!onSearch}>
                          <CommandInput
                            placeholder="Пошук..."
                            onValueChange={(val) => {
                              if (onSearch) handleSearch(val)
                            }}
                          />
                          <CommandList>
                            {loading && <div className="py-6 text-center text-sm">Завантаження...</div>}
                            <CommandEmpty>Нічого не знайдено.</CommandEmpty>
                            <CommandGroup>
                              {asyncOptions.map((option) => {
                                const isSelected = selectedValues.some((v: any) => String(v) === String(option.value))
                                return (
                                  <CommandItem
                                    key={option.value}
                                    value={staticValue ?? String(option.label)}
                                    onSelect={() => {
                                      let newValue
                                      if (isSelected) {
                                        newValue = selectedValues.filter((v: any) => String(v) !== String(option.value))
                                      } else {
                                        newValue = [...selectedValues, option.value]
                                      }
                                      onChange(newValue)
                                      // Don't close on multi-select to allow multiple chunks
                                      // setOpen(false)
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                    {option.label}
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Badges Area */}
                    {selectedValues.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedValues.map((val: any) => (
                          <div
                            key={val}
                            className="inline-flex items-center rounded-full border px-1 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary-500 text-primary hover:bg-primary/80"
                          >
                            {labelMap[String(val)] || val}
                            <button
                              type="button"
                              onClick={() => {
                                const newValue = selectedValues.filter((v: any) => String(v) !== String(val))
                                onChange(newValue)
                              }}
                              disabled={disabled || readOnly}
                              className="cursor-pointer ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary-foreground/20"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )

              case "select":
                return (
                  <Select
                    required={!!required}
                    onValueChange={onChange}
                    value={staticValue ?? value ? String(value) : undefined}
                    disabled={disabled || readOnly}
                  >
                    <SelectTrigger className={cn("w-full", inputClassName)}>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {initialOptions?.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
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
                      required={!!required}
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
                        setFilePreviews((prev) => [
                          ...prev, // @ts-ignore
                          ...previews,
                        ])
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
                    required={!!required}
                    placeholder={placeholder}
                    className={inputClassName}
                    value={staticValue ?? value ?? ""}
                    onChange={(e) => onChange(e.target.valueAsNumber)}
                    {...field}
                  />
                )

              case "custom":
                return render ? (
                  render({ onChange, value, disabled, readOnly, placeholder, ...field })
                ) : (
                  <div className="text-destructive">Custom render function is missing</div>
                )

              default:
                // "text"
                return (
                  <Input
                    id={name}
                    type={type}
                    disabled={disabled}
                    readOnly={readOnly}
                    onChange={onChange}
                    required={!!required}
                    placeholder={placeholder}
                    className={inputClassName}
                    value={staticValue ?? value ?? ""}
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
