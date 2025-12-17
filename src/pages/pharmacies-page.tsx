import { useRef } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Download, HelpCircle, Upload } from "lucide-react"

import { formatDate } from "@/helpers/format-date"
import { ConfigurablePage, type ConfigurablePageRef } from "@/components/custom/configurable-page"
import {
  useCreatePharmacy,
  useDeletePharmacy,
  usePharmacies,
  useUpdatePharmacy,
  type Pharmacy,
} from "@/hooks/use-pharmacies"

const columns: ColumnDef<Pharmacy>[] = [
  {
    accessorKey: "number",
    header: "Номер",
    meta: { form: { type: "text", required: true, placeholder: "Введіть номер" } },
  },
  {
    accessorKey: "chain",
    header: "Мережа",
    meta: {
      form: {
        type: "select",
        required: true,
        options: [
          { label: "Асистент фармацевта", value: "pharmacist" },
          { label: "Адміністратор", value: "admin" },
        ],
        placeholder: "Виберіть",
      },
    },
    cell: ({ getValue }) => {
      const chain = getValue<Pharmacy["chain"]>()
      return chain ? chain.name : "-"
    },
  },
  {
    accessorKey: "address",
    header: "Адреса",
    meta: { form: { type: "text", required: true, placeholder: "Введіть адресу" } },
  },
  {
    accessorKey: "ownerId",
    header: "Зав.аптеки",
    meta: {
      form: {
        type: "select",
        required: true,
        options: [
          { label: "Асистент фармацевта", value: "pharmacist" },
          { label: "Адміністратор", value: "admin" },
        ],
        placeholder: "Виберіть",
      },
    },
    cell: ({ getValue }) => {
      const owner = getValue<Pharmacy["owner"]>()
      return owner ? owner.full_name : "-"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Дата створення",
    cell: ({ getValue }) => {
      const date = getValue<string>()
      if (date) return formatDate(date, "long")
      return "-"
    },
    meta: { form: { hidden: true, type: "text", placeholder: "Дата створення", readonly: true } },
  },
]

const PharmaciesPage = () => {
  const { data: pharmacies, isLoading } = usePharmacies()
  const createMutation = useCreatePharmacy()
  const updateMutation = useUpdatePharmacy()
  const deleteMutation = useDeletePharmacy()

  const pageRef = useRef<ConfigurablePageRef>(null)

  const handleEntitySave = async (data: Pharmacy, mode: "create" | "edit" | "copy") => {
    try {
      const { chain, ...rest } = data
      if (mode === "create" || mode === "copy") {
        // @ts-ignore
        await createMutation.mutateAsync({ chainId: +chain, ...rest })
      } else if (mode === "edit") {
        // @ts-ignore    // chain === string
        await updateMutation.mutateAsync({ id: data.id, data: { ...rest, chainId: +chain } })
      }
    } catch (error) {
      console.error("Failed to save pharmacy chain:", error)
      alert("Помилка при збереженні мережі")
    }
  }

  const customActions = {
    delete: (row: Pharmacy | null) => {
      if (row) {
        if (confirm("Ви впевнені, що хочете видалити цю мережу?")) {
          deleteMutation.mutate(row.id)
        }
      }
      return false // prevent default delete
    },
  }

  return (
    <ConfigurablePage
      ref={pageRef}
      data={pharmacies || []}
      columns={columns}
      isLoading={isLoading}
      onEntitySave={handleEntitySave}
      customActions={customActions}
      topToolbar={{
        title: "Аптечні пункти",
        items: [
          [
            {
              label: "Додати аптечний пункт",
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
    />
  )
}

export default PharmaciesPage
