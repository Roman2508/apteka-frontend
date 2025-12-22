import { useRef } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Download, HelpCircle, Upload } from "lucide-react"

import { formatDate } from "@/helpers/format-date"
import { ConfigurablePage, type ConfigurablePageRef } from "@/components/custom/configurable-page"
import {
  useCreatePharmacyChain,
  useDeletePharmacyChain,
  usePharmacyChains,
  useUpdatePharmacyChain,
  type PharmacyChain,
} from "@/hooks/api/use-pharmacy-chains"

const columns: ColumnDef<PharmacyChain>[] = [
  {
    accessorKey: "name",
    header: "Назва",
    meta: { form: { type: "text", required: true, placeholder: "Введіть назву" } },
  },
  {
    accessorKey: "edrpou_code",
    header: "ЄДРПОУ",
    meta: { form: { type: "text", required: true, placeholder: "Введіть назву" } },
  },
  {
    accessorKey: "pharmacyCount",
    header: "К-ть аптек",
    // meta.form.hidden only in modal, but meta.hideInTable = true only in table
    meta: { form: { hidden: true, type: "number", required: true, readonly: true } },
  },
  {
    accessorKey: "userCount",
    header: "К-ть користувачів",
    meta: { form: { hidden: true, type: "number", required: true, readonly: true } },
  },
  {
    accessorKey: "pharmacies",
    header: "Аптеки",
    cell: ({ getValue }) => {
      const pharmacies = getValue<PharmacyChain["pharmacies"]>()
      return pharmacies ? pharmacies.map((pharmacy) => pharmacy.number).join(", ") : "-"
    },
    meta: {
      hideInTable: true,
      form: {
        type: "multi-select",
        required: true,
        options: [
          { label: "Аптека 1123", value: "1123" },
          { label: "Аптека 7485", value: "7485" },
          { label: "Аптека 2501", value: "2501" },
          { label: "Аптека 8591", value: "8591" },
        ],
        placeholder: "Аптеки",
      },
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

const PharmacyChainsPage = () => {
  const { data: pharmacyChains, isLoading } = usePharmacyChains()
  const createMutation = useCreatePharmacyChain()
  const updateMutation = useUpdatePharmacyChain()
  const deleteMutation = useDeletePharmacyChain()

  const pageRef = useRef<ConfigurablePageRef>(null)

  const handleEntitySave = async (data: PharmacyChain, mode: "create" | "edit" | "copy") => {
    try {
      if (mode === "create" || mode === "copy") {
        // const _data = data as unknown as CreateUserDto
        await createMutation.mutateAsync(data)
      } else if (mode === "edit") {
        await updateMutation.mutateAsync({ id: data.id, data })
      }
    } catch (error) {
      console.error("Failed to save pharmacy chain:", error)
      alert("Помилка при збереженні мережі")
    }
  }

  const customActions = {
    delete: (row: PharmacyChain | null) => {
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
      data={pharmacyChains || []}
      columns={columns}
      isLoading={isLoading}
      onEntitySave={handleEntitySave}
      customActions={customActions}
      topToolbar={{
        title: "Мережі аптек",
        items: [
          [
            {
              label: "Додати мережу",
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

export default PharmacyChainsPage
