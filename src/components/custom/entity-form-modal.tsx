import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { type ColumnDef } from "@tanstack/react-table"

interface EntityFormModalProps<TData> {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "copy"
  defaultValues?: TData | null
  onSave: (data: TData) => void
  columns: ColumnDef<TData>[]
}

export function EntityFormModal<TData>({
  isOpen,
  onClose,
  mode,
  defaultValues,
  onSave,
  columns,
}: EntityFormModalProps<TData>) {
  const [formData, setFormData] = useState<Partial<TData>>({})

  useEffect(() => {
    if (isOpen && defaultValues) {
      setFormData({ ...defaultValues })
    } else if (isOpen) {
      setFormData({})
    }
  }, [isOpen, defaultValues])

  const handleSave = () => {
    onSave(formData as TData)
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

  // Filter out columns that shouldn't be edited (like actions, or complex cells if not handled)
  // For this demo, we'll just take columns with an accessorKey
  const editableColumns = columns.filter((col) => "accessorKey" in col)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editableColumns.map((col: any) => (
            <div key={col.accessorKey} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={col.accessorKey} className="text-right">
                {col.header as string}
              </Label>
              
              <Input
                id={col.accessorKey}
                value={(formData as any)[col.accessorKey] || ""}
                onChange={(e) => setFormData({ ...formData, [col.accessorKey]: e.target.value })}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave}>Зберегти</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
