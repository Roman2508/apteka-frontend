import { useState, useMemo, useRef } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { addDays, addMonths, addYears, parseISO } from "date-fns"
import { Download, HelpCircle, Upload, RefreshCw, Printer, X, Copy } from "lucide-react"

import {
  useProductBatches,
  useCreateProductBatch,
  useUpdateProductBatch,
  useDeleteProductBatch,
} from "@/hooks/api/use-product-batches.ts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import handIcon from "../assets/icons/hand-icon.png"
import { useProducts } from "@/hooks/api/use-medical-products.ts"
import alarmClockIcon from "../assets/icons/alarm-clock-icon.png"
import { useCounterparties } from "@/hooks/api/use-counterparties.ts"
import type { ProductBatchType } from "@/types/product-batch.types.ts"
import type { MedicalProductType } from "@/types/medical-product.types.ts"
import type { CustomRenderProps } from "@/components/custom/template-form-item.tsx"
import { transformMedicalProductForm } from "@/helpers/transform-medical-product-form.ts"
import { ConfigurablePage, type ConfigurablePageRef } from "../components/custom/configurable-page.tsx"

const SaleRegistrationPage = () => {
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
      {/* <h1 className="text-lg mb-2">
        Пташник Роман / 
        1984 каса / Зміна 1984-000664 від 26.12.2025 14:39:25 (Відкрита): 4:01 год
      </h1> */}
      <div className="h-[calc(100vh-65px)] flex gap-2">
        <div className="flex-1 flex flex-col gap-4 truncate">
          <ConfigurablePage
            ref={pageRef}
            data={productBatches}
            columns={columns}
            onEntitySave={handleEntitySave}
            topToolbar={{
              title: "Пташник Роман / 1984 каса / Зміна 1984-000664 від 26.12.2025 14:39:25 (Відкрита): 4:01 год",
              items: [
                [
                  {
                    label: "Реімбурсація",
                    onClick: () => console.log("create"),
                    variant: "default",
                  },
                  {
                    label: "Соц. проекти",
                    // onClick: () => fileInputRef.current?.click(),
                    variant: "default",

                    // disabled: importExcel.isPending,
                  },
                  {
                    label: "Підбірний лист",
                    icon: <Printer className="w-4 h-4 text-muted-foreground" />,
                    // onClick: () => setIsHelpModalOpen(true),
                    variant: "default",
                    className: "px-2",
                    title: "Інструкція з імпорту",
                  },
                  {
                    label: "Інтернет замовлення",
                    // onClick: handleExport,
                    variant: "default",
                  },
                ],
              ],
              hideActionsMenu: true,
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
            // globalFilter={globalFilter}
            // setGlobalFilter={setGlobalFilter}
            isLoading={isLoading}
            selectedRowProvider={setSelectedRow}
          />

          <ConfigurablePage
            ref={pageRef}
            data={productBatches}
            columns={columns}
            onEntitySave={handleEntitySave}
            topToolbar={{
              hideActionsMenu: true,
              items: [
                [
                  {
                    label: "Відмова",
                    onClick: () => console.log("create"),
                    variant: "default",
                  },
                  {
                    label: "Аналоги",
                    // onClick: () => fileInputRef.current?.click(),
                    variant: "default",

                    // disabled: importExcel.isPending,
                  },
                  {
                    label: "Друк чеку вибачення",
                    // onClick: () => setIsHelpModalOpen(true),
                    variant: "default",
                    className: "px-2",
                    title: "Інструкція з імпорту",
                  },
                  {
                    type: "custom",
                    content: (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Пошук по найменуванню (BackSpace)"
                          className="h-7 placeholder:text-[13px] w-[250px]"
                          // value={filters.status}
                          // onChange={(e) => handleFilterChange("status", e.target.value)}
                        />
                      </div>
                    ),
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

        <div className="flex flex-col w-75 mt-20 h-[calc(100vh-135px)]">
          <div className="flex-1">
            <div className="bg-neutral-300 flex flex-col gap-2 w-full px-1 mb-2">
              <div className="flex justify-between">
                <span className="text-lg opacity-[0.8] ">До оплати</span>
                <span className="text-lg font-bold">1132,20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Знижка</span>
                <span className="text-sm">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">бокуси</span>
                <span className="text-sm">0</span>
              </div>
            </div>

            <div className="bg-neutral-300 flex justify-center gap-2 w-full py-2 px-1 mb-2">
              <Button variant="primary" size="sm" className="flex-1">
                Рекомендація
              </Button>
              <Button size="sm" className="flex-1">
                Розрахувати знижки
              </Button>
            </div>

            <div className="bg-neutral-300 flex flex-col gap-2 w-full py-2 px-1 mb-6">
              <div className="flex gap-1">
                <Input placeholder="Номер телефону клієнта" className="flex-1 h-7" />
                <Button size="icon" className="h-7">
                  <X className="min-w-4" />
                </Button>
                <Button size="icon" className="h-7">
                  <Copy className="min-w-3" />
                </Button>
              </div>

              <div className="mr-1">
                <Input placeholder="Лікар" className="flex-1 h-7" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-neutral-300 flex items-center gap-2 w-full p-2 mb-2">
              <div className="flex justify-between font-bold">
                <span className="text-sm">План: 27 682</span>
              </div>

              <div className="flex justify-between gap-1 font-bold">
                <span className="text-sm">Факт: 3 622,26</span>
                <span className="text-sm text-destructive-500">(-24 059,74)</span>
              </div>
            </div>

            <div className="bg-neutral-300 flex gap-4 w-full p-2 mb-2">
              <div className="flex flex-col gap-3">
                <Button size="sm">Змінити користувача</Button>
                <Button size="sm">Касова зміна</Button>
                <Button size="sm">Переоцінки</Button>
                <Button size="sm">Чеки ККМ</Button>
              </div>

              <div className="flex flex-col gap-4">
                <img src={alarmClockIcon} alt="alarm clock icon" className="w-6 h-6 mt-0.5" />
                <img src={handIcon} alt="hand icon" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SaleRegistrationPage
