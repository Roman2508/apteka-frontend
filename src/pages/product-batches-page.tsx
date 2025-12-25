import { useState, useMemo, useRef } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { addDays, addMonths, addYears, parseISO } from "date-fns"
import { Download, HelpCircle, Upload, RefreshCw } from "lucide-react"

import {
  useProductBatches,
  useCreateProductBatch,
  useUpdateProductBatch,
  useDeleteProductBatch,
} from "@/hooks/api/use-product-batches.ts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/api/use-medical-products.ts"
import { useCounterparties } from "@/hooks/api/use-counterparties.ts"
import type { ProductBatchType } from "@/types/product-batch.types.ts"
import type { MedicalProductType } from "@/types/medical-product.types.ts"
import type { CustomRenderProps } from "@/components/custom/template-form-item.tsx"
import { transformMedicalProductForm } from "@/helpers/transform-medical-product-form.ts"
import { ConfigurablePage, type ConfigurablePageRef } from "../components/custom/configurable-page.tsx"

const ProductBatchesPage = () => {
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)

  const pageRef = useRef<ConfigurablePageRef>(null)

  const { data: medicalProducts } = useProducts()
  const { data: productBatches } = useProductBatches()
  const { data: counterparties } = useCounterparties()

  const createMutation = useCreateProductBatch()
  const updateMutation = useUpdateProductBatch()
  const deleteMutation = useDeleteProductBatch()

  const handleEntitySave = async (data: ProductBatchType, mode: "create" | "edit" | "copy") => {
    console.log("data", data, "mode", mode)
    try {
      if (mode === "create" || mode === "copy") {
        const _data = data as unknown as CreateProductBatchDto
        await createMutation.mutateAsync(_data)
      } else if (mode === "edit") {
        const { id, ...rest } = data
        await updateMutation.mutateAsync({ id, data: rest as UpdateProductBatchDto })
      }
    } catch (error) {
      console.error("Failed to save user:", error)
      alert("Помилка при збереженні партії товару")
    }
  }

  const customActions = {
    delete: (row: ProductBatchType | null) => {
      if (row) {
        if (confirm("Ви впевнені, що хочете видалити цю партію товару?")) {
          deleteMutation.mutate(row.id)
        }
      }
      return false // prevent default delete
    },
  }

  const columns: ColumnDef<ProductBatchType>[] = useMemo(
    () => [
      {
        accessorKey: "productId",
        header: "Товар",
        cell: ({ getValue }) => {
          const productId = getValue<number>()
          const product = medicalProducts?.find((p) => p.id === productId)
          return product
            ? `${product.name} ${product.dosage_value || ""}${product.dosage_unit} (${transformMedicalProductForm(
                product.form,
              )})`
            : "-"
        },
        meta: {
          form: {
            type: "async-select",
            required: true,
            placeholder: "Виберіть товар",
            options: [
              ...(medicalProducts?.map((p) => ({
                value: p.id,
                label: `${p.name} ${p.dosage_value || ""}${p.dosage_unit} (${transformMedicalProductForm(p.form)})`,
              })) || []),
            ],
          },
        },
      },
      {
        accessorKey: "supplierId",
        header: "Постачальник",
        cell: ({ getValue }) => {
          const supplierId = getValue<number>()
          const supplier = counterparties?.find((p) => p.id === supplierId)
          return supplier ? supplier.name : "-"
        },
        meta: {
          form: {
            type: "async-select",
            required: true,
            placeholder: "Виберіть постачальника",
            options: [...(counterparties?.map((c) => ({ value: c.id, label: c.name })) || [])],
          },
        },
      },
      {
        accessorKey: "batch_number",
        header: "Номер партії",
        cell: ({ getValue }) => {
          const batch_number = getValue<string>()
          return batch_number ? batch_number : "-"
        },
        meta: {
          form: {
            type: "custom",
            required: true,
            placeholder: "Введіть номер партії",
            render: ({ value, onChange, placeholder, disabled }: CustomRenderProps) => (
              <div className="flex gap-2 w-full">
                <Input
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={() => {
                    const generated = "BT-" + Math.random().toString(36).substring(7).toUpperCase()
                    onChange(generated)
                  }}
                  disabled={disabled}
                >
                  <RefreshCw className="min-w-4 min-h-4" />
                </Button>
              </div>
            ),
          },
        },
      },
      {
        accessorKey: "manufacture_date",
        header: "Дата виробництва",
        cell: ({ getValue }) => {
          const manufacture_date = getValue<string>()
          return manufacture_date ? new Date(manufacture_date).toLocaleDateString() : "-"
        },
        meta: { form: { type: "date", required: true, placeholder: "Дата виробництва" } },
      },
      {
        accessorKey: "expiry_date",
        header: "Придатний до",
        cell: ({ getValue }) => {
          const expiry_date = getValue<string>()
          return expiry_date ? new Date(expiry_date).toLocaleDateString() : "-"
        },
        meta: { form: { type: "date", required: true, placeholder: "Придатний до" } },
      },
      {
        accessorKey: "purchase_price",
        header: "Ціна закупівлі",
        cell: ({ getValue }) => {
          const purchase_price = getValue<number>()
          return purchase_price ? purchase_price : "-"
        },
        meta: { form: { type: "number", required: true, placeholder: "Ціна закупівлі" } },
      },
    ],
    [medicalProducts, counterparties],
  )

  return (
    <>
      <div className="h-[calc(100vh-65px)] flex flex-col">
        <ConfigurablePage
          ref={pageRef}
          data={productBatches}
          columns={columns}
          onEntitySave={handleEntitySave}
          topToolbar={{
            title: "Партії товарів",
            // hideActionsMenu: true,
            items: [
              [
                {
                  label: "Додати партію",
                  onClick: () => pageRef.current?.openModal("create"),
                  variant: "primary",
                },
                {
                  label: "Завантажити з файлу",
                  icon: <Download className="w-3.5 h-3.5" />,
                  // onClick: () => fileInputRef.current?.click(),
                  variant: "default",
                  // disabled: importExcel.isPending,
                },
                {
                  label: "",
                  icon: <HelpCircle className="w-4 h-4 text-muted-foreground" />,
                  // onClick: () => setIsHelpModalOpen(true),
                  variant: "default",
                  className: "px-2",
                  title: "Інструкція з імпорту",
                },
                {
                  label: "Експорт",
                  icon: <Upload className="w-3.5 h-3.5" />,
                  // onClick: handleExport,
                  variant: "default",
                },
              ],
            ],
          }}
          onFormValuesChange={(values, info, { setValue }) => {
            if (info.name === "productId" || info.name === "manufacture_date") {
              const productId = values.productId
              const manufactureDateStr = values.manufacture_date

              if (!productId || !manufactureDateStr) return

              const product = medicalProducts?.find((p) => p.id === productId)

              if (product && product.shelf_life_value && product.shelf_life_unit) {
                try {
                  const manufactureDate = parseISO(manufactureDateStr)
                  if (!isNaN(manufactureDate.getTime())) {
                    let expiryDate: Date | null = null

                    switch (product.shelf_life_unit) {
                      case "years":
                        expiryDate = addYears(manufactureDate, product.shelf_life_value)
                        break
                      case "months":
                        expiryDate = addMonths(manufactureDate, product.shelf_life_value)
                        break
                      case "days":
                        expiryDate = addDays(manufactureDate, product.shelf_life_value)
                        break
                    }

                    if (expiryDate && !isNaN(expiryDate.getTime())) {
                      const formatted = expiryDate.toISOString().split("T")[0]
                      setValue("expiry_date", formatted)
                    }
                  }
                } catch (e) {
                  console.error("Failed to calculate expiry date", e)
                }
              }
            }
          }}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
          selectedRowProvider={setSelectedRow}
        />
      </div>
    </>
  )
}

export default ProductBatchesPage
