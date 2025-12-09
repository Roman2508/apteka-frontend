import { ConfigurablePage } from "@/components/custom/configurable-page"
import { type ColumnDef } from "@tanstack/react-table"
import {
  useCounterparties,
  useCreateCounterparty,
  useUpdateCounterparty,
  useDeleteCounterparty,
  type Counterparty,
  type CreateCounterpartyDto,
} from "@/hooks/use-counterparties"

const columns: ColumnDef<Counterparty>[] = [
  {
    accessorKey: "name",
    header: "Назва",
  },
  {
    accessorKey: "type",
    header: "Тип",
  },
  {
    accessorKey: "edrpou_code",
    header: "ЄДРПОУ",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "address",
    header: "Адреса",
  },
  {
    accessorKey: "contact_person",
    header: "Контактна особа",
  },
  {
    accessorKey: "note",
    header: "Примітка",
  },
]

const CounterpartiesPage = () => {
  const { data: counterparties, isLoading } = useCounterparties()
  const createMutation = useCreateCounterparty()
  const updateMutation = useUpdateCounterparty()
  const deleteMutation = useDeleteCounterparty()

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
    }
  }

  return (
    <ConfigurablePage
      data={counterparties}
      columns={columns}
      isLoading={isLoading}
      onEntitySave={handleEntitySave}
      customActions={customActions}
      topToolbar={{ title: "Контрагенти" }}
    />
  )
}

export default CounterpartiesPage
