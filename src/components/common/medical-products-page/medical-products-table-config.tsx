import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ColumnDef } from "@tanstack/react-table"

export type Counterparty = {
  id: string
  name: string
  brand_name: string
  form: string
  dosage_value: string
  dosage_unit: string
  inn: string
  subpackages_per_package: string
  subpackage_type: string
  shelf_life_value: string
  shelf_life_unit: string
  active: boolean
  isGroup?: boolean
}

export const data: Counterparty[] = [
  {
    id: "00000001",
    name: "Нурофен",
    brand_name: "Нурофен",
    form: "Підкожна",
    dosage_value: "5",
    dosage_unit: "мг",
    inn: "12345678",
    subpackages_per_package: "1",
    subpackage_type: "Пластинки",
    shelf_life_value: "1",
    shelf_life_unit: "мг",
    active: true,
  },
]

export const columns: ColumnDef<Counterparty>[] = [
  {
    accessorKey: "id",
    header: "Код",
  },
  {
    accessorKey: "name",
    header: "Найменування",
  },
  {
    accessorKey: "brand_name",
    header: "Торгова марка",
  },
  {
    accessorKey: "form",
    header: "Форма випуску",
  },
  {
    accessorKey: "dosage_value",
    header: "Доза",
  },
  {
    accessorKey: "dosage_unit",
    header: "Одиниця виміру",
  },
  {
    accessorKey: "inn",
    header: "МНН",
  },
  {
    accessorKey: "subpackage_type",
    header: "Тип упаковки",
  },
  {
    accessorKey: "subpackages_per_package",
    header: "К-ть в упаковці",
  },
  {
    accessorKey: "shelf_life_value",
    header: "Срок придатності",
  },
  {
    accessorKey: "shelf_life_unit",
    header: "Одиниця виміру",
  },
]
