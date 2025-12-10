import { type Control, Controller } from "react-hook-form"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type FormItemType = "text" | "number" | "password" | "checkbox" | "select" | "async-select" | "file"

export interface Option {
  label: string
  value: string | number
}

interface TemplateFormItemProps {
  name: string
  label: string
  description?: string
  type: FormItemType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  options?: Option[]
  onSearch?: (query: string) => Promise<Option[]>
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
  options: initialOptions = [],
  onSearch,
  disabled,
  readOnly,
  placeholder,
  className,
  inputClassName = "w-[300px]",
}: TemplateFormItemProps) {
  // State for file previews
  const [filePreviews, setFilePreviews] = useState<Array<{ file: File; url: string }>>([])
  
  // State for async select
  const [open, setOpen] = useState(false)
  const [asyncOptions, setAsyncOptions] = useState<Option[]>(initialOptions)
  const [loading, setLoading] = useState(false)

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
    if (type === "async-select" && onSearch) {
      handleSearch("")
    }
  }, [type, onSearch, handleSearch])

  return (
    <div className={cn("grid grid-cols-2 grid-cols-[200px_1fr] gap-4 items-start py-4 last:border-0", className)}>
      <div className="space-y-1">
        <Label htmlFor={name} className="text-base font-bold">
          {label}
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
                    checked={value ?? false}
                    disabled={disabled || readOnly}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
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
                        {value
                          ? asyncOptions.find((opt) => String(opt.value) === String(value))?.label || value
                          : placeholder || "Оберіть зі списку..."}
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
                                value={String(option.label)} 
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

              case "select":
                return (
                  <Select 
                    onValueChange={onChange} 
                    value={value ? String(value) : undefined} 
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
                        setFilePreviews((prev) => [...prev, // @ts-ignore
                          ...previews])
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
