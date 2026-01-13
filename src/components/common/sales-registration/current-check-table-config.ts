import { type InventoryType } from "@/types/inventory.types"

// №  Чек(назва,доза,батч,дата виробництва) Полиця Кількість Ціна(за 1) Знижка Сума(за всі)
export const getCurrentCheckTableColumns = (): ColumnDef<InventoryType>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "productId",
        header: "Чек",
        cell: ({ getValue }) => {
          const productId = getValue<number>()
          const product = medicalProducts?.find((p) => p.id === productId)
          return product
            ? `${product.name} ${product.dosage_value || ""}${product.dosage_unit} (${transformMedicalProductForm(
                product.form,
              )})`
            : "-"
        },
        /*
          warehouse: WarehouseType
          warehouseId: number
          batch: ProductBatchType
          batchId: number
          quantity: number
          reserved_quantity: number
        } */
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
        header: "Полиця",
        cell: ({ getValue }) => {
          return "-"
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
}
