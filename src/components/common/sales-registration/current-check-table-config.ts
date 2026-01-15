import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { type InventoryType } from "@/types/inventory.types"
import { type MedicalProductType } from "@/types/medical-product.types"
import { transformMedicalProductForm } from "@/utils/medical-product.utils"

export const getCurrentCheckTableColumns = (): ColumnDef<InventoryType>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "batch.product",
        header: "Чек",
        cell: ({ getValue }) => {
          const product = getValue<MedicalProductType>()
          return product
            ? `${product.name} ${product.dosage_value || ""}${product.dosage_unit} (${transformMedicalProductForm(
                product.form,
              )})`
            : "-"
        },
      },
      {
        /*
        [
          {
            "id": 1,
            "warehouseId": 1,
        "batchId": 2,
        "quantity": 2,
        "reserved_quantity": 0,
        shelfPlacementId: null,
        shelfPlacement: {id: 1, name: "Полиця 1"},
        "updatedAt": "2026-01-08T15:32:30.318Z",
        "batch": {
            "id": 2,
            "productId": 1,
            "supplierId": 1,
            "batch_number": "132",
            "manufacture_date": null,
            "expiry_date": "2025-12-22T15:30:45.123Z",
            "purchase_price": "1300",
            "createdAt": "2026-01-08T15:32:16.893Z",
            "product": {
                "id": 1,
                "name": "Test product 1",
                "brand_name": "123",
                "form": "tablet",
                "dosage_value": "11",
                "dosage_unit": "mg",
                "barcode": "13133845123351",
                "inn": "Paracetamol",
                "atc_code": "",
                "registration_number": "",
                "in_national_list": true,
                "in_reimbursed_program": false,
                "subpackages_per_package": 2,
                "subpackage_type": "blister",
                "shelf_life_value": 2,
                "shelf_life_unit": "years",
                "retail_price": "110",
                "vat_rate": 7,
                "manufacturerId": 1,
                "createdAt": "2025-12-05T20:19:35.582Z",
                "updatedAt": "2026-01-08T15:15:37.335Z"
            }
        }
    }
]
        } */
        accessorKey: "shelfPlacement",
        header: "Полиця",
        cell: ({ getValue }) => {
          const shelfPlacement = getValue<{ id: number; name: string }>()
          return shelfPlacement?.name || "-"
        },
      },
      {
        accessorKey: "quantity",
        header: "Кількість",
        cell: ({ getValue }) => {
          // Треба буде передавати вибрану кількість
          return "1111"
        },
      },
      // №  Чек(назва,доза,батч,дата виробництва) Полиця Кількість Ціна(за 1) Знижка Сума(за всі)
      {
        accessorKey: "purchase_price",
        header: "Ціна",
        cell: ({ getValue }) => {
          const purchase_price = getValue<number>()
          return purchase_price ? purchase_price : "-"
        },
      },
      {
        accessorKey: "sum",
        header: "Сума",
        cell: ({ getValue }) => {
          console.log("Треба рахувати (ціна * кількість вибрано)")
          // const sum = getValue<number>()
          return "1111"
        },
      },
    ],
    [],
  )
}
