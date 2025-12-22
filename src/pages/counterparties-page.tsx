import { useRef } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  useCounterparties,
  useCreateCounterparty,
  useUpdateCounterparty,
  useDeleteCounterparty,
  type Counterparty,
  type CreateCounterpartyDto,
} from "@/hooks/api/use-counterparties"
import { ConfigurablePage, type ConfigurablePageRef } from "@/components/custom/configurable-page"

const columns: ColumnDef<Counterparty>[] = [
  {
    accessorKey: "name",
    header: "Назва",
    meta: { form: { type: "text", required: true, placeholder: "Введіть назву" } } as any,
  },
  {
    accessorKey: "type",
    header: "Тип",
    meta: {
      form: {
        type: "select",
        required: true,
        options: [
          { label: "Постачальник", value: "supplier" },
          { label: "Виробник", value: "manufacturer" },
          { label: "Страхова", value: "insurer" },
          { label: "Фізична особа", value: "individual" },
        ],
      },
    },
  },
  {
    accessorKey: "edrpou_code",
    header: "ЄДРПОУ",
    meta: { form: { type: "text", placeholder: "Код ЄДРПОУ" } },
  },
  {
    accessorKey: "phone",
    header: "Телефон",
    meta: { form: { type: "text", placeholder: "+380..." } },
  },
  {
    accessorKey: "address",
    header: "Адреса",
    meta: { form: { type: "text" } },
  },
  {
    accessorKey: "contact_person",
    header: "Контактна особа",
    meta: { form: { type: "text" } },
  },
  {
    accessorKey: "note",
    header: "Примітка",
    meta: { form: { type: "text" } },
  },
]

const CounterpartiesPage = () => {
  const { data: counterparties, isLoading } = useCounterparties()
  const createMutation = useCreateCounterparty()
  const updateMutation = useUpdateCounterparty()
  const deleteMutation = useDeleteCounterparty()

  const pageRef = useRef<ConfigurablePageRef>(null)

  const handleEntitySave = async (data: Counterparty, mode: "create" | "edit" | "copy") => {
    try {
      if (mode === "create" || mode === "copy") {
        await createMutation.mutateAsync(data)
      } else if (mode === "edit") {
        const { id, ...rest } = data
        await updateMutation.mutateAsync({ id, data: rest as CreateCounterpartyDto })
      }
    } catch (error) {
      console.error("Failed to save counterparty:", error)
      alert("Помилка при збереженні контрагента")
    }
  }

  const customActions = {
    delete: (row: Counterparty | null) => {
      if (row) {
        if (confirm("Ви впевнені, що хочете видалити цього контрагента?")) {
          deleteMutation.mutate(row.id)
        }
      }
      return false // prevent default delete
    },
  }

  return (
    <ConfigurablePage
      ref={pageRef}
      data={counterparties}
      columns={columns}
      isLoading={isLoading}
      onEntitySave={handleEntitySave}
      customActions={customActions}
      topToolbar={{
        title: "Контрагенти",
        items: [
          [
            {
              label: "Додати контрагента",
              onClick: () => pageRef.current?.openModal("create"),
              variant: "primary",
            },
          ],
        ],
      }}
    />
  )
}

export default CounterpartiesPage
