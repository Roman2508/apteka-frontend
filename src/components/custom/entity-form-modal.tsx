"use client"

import { useEffect } from "react"
import { useForm, type DefaultValues, type SubmitHandler, type FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { TemplateFormItem, type Option, type FormItemType } from "./template-form-item"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export interface FormFieldConfig {
  name: string
  label: string
  type: FormItemType
  options?: Option[]
  onSearch?: (query: string) => Promise<Option[]>
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
}

export interface EntityFormModalProps<TData> {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "copy"
  defaultValues?: TData | null
  onSave: (data: TData) => Promise<void> | void
  fields: FormFieldConfig[]
  isLoading?: boolean
}

export function EntityFormModal<TData extends FieldValues>({
  isOpen,
  onClose,
  mode,
  defaultValues,
  onSave,
  fields,
  isLoading = false,
}: EntityFormModalProps<TData>) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TData>({
    defaultValues: (defaultValues || {}) as DefaultValues<TData>,
  })

  // Reset form when dialog opens or defaults change
  useEffect(() => {
    if (isOpen) {
      if (mode === "create") {
        reset({} as DefaultValues<TData>)
      } else {
        // For copy, we might want to clear ID if it exists in data, allowing backend to generate new one
        // But usually standard is just filling inputs
        reset((defaultValues || {}) as DefaultValues<TData>)
      }
    }
  }, [isOpen, defaultValues, mode, reset])

  const onSubmit: SubmitHandler<TData> = async (data) => {
    await onSave(data)
    onClose()
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Створити запис"
      case "edit":
        return "Редагувати запис"
      case "copy":
        return "Копіювати запис"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
          {fields.map((field) => (
            <TemplateFormItem
              key={field.name}
              control={control}
              name={field.name}
              label={field.label}
              type={field.type}
              options={field.options}
              onSearch={field.onSearch}
              placeholder={field.placeholder}
              description={field.description}
              disabled={field.disabled || isLoading || isSubmitting}
            />
          ))}

          <DialogFooter className="sticky bottom-0 bg-background pt-2">
            <Button type="button" onClick={onClose} disabled={isSubmitting}>
              Скасувати
            </Button>

            <Button type="submit" disabled={isSubmitting} variant="primary">
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
