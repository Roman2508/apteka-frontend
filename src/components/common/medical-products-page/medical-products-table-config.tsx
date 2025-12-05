import { type ColumnDef } from "@tanstack/react-table"
import { type MedicalProduct } from "@/hooks/use-medical-products"

export const columns: ColumnDef<MedicalProduct>[] = [
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
